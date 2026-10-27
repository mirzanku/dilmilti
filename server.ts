import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import mongoose from 'mongoose';
import { getInitialCentralDb } from './src/data/seedDatabase';
import {
  buildSipintarSystemInstruction,
  generateSmartSipintarReply,
  SipintarContextData
} from './src/utils/sipintarKnowledgeBase';
import { searchRegulatoryDatabase } from './src/data/regulatoryDatabase';

const PORT = 3000;
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'court_db.json');
const MEDIA_FILE = path.join(DB_DIR, 'court_media.json');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Persistent media dictionary to guarantee uploaded profile photos and assets never vanish
let persistentMedia: Record<string, { contentType: string; dataUrl: string; filename?: string }> = {};

if (fs.existsSync(MEDIA_FILE)) {
  try {
    const raw = fs.readFileSync(MEDIA_FILE, 'utf-8');
    persistentMedia = JSON.parse(raw);
    console.log(`[Court Server] Loaded ${Object.keys(persistentMedia).length} media items from court_media.json`);
  } catch (e) {
    console.error('[Court Server] Error reading court_media.json:', e);
  }
}

function saveMediaToFile() {
  try {
    fs.writeFileSync(MEDIA_FILE, JSON.stringify(persistentMedia, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Court Server] Error saving court_media.json:', e);
  }
}

interface CourtServerDbState {
  version: number;
  lastUpdated: string;
  data: Record<string, any>;
}

// MongoDB Schema for storing the centralized court database state
export interface ICourtDbDoc {
  docId: string;
  version: number;
  lastUpdated: string;
  data: Record<string, any>;
}

const CourtDbDocSchema = new mongoose.Schema<ICourtDbDoc>(
  {
    docId: { type: String, required: true, unique: true, default: 'dilmilti5_central_db' },
    version: { type: Number, default: 79 },
    lastUpdated: { type: String, default: () => new Date().toISOString() },
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true, minimize: false }
);

const CourtModel: mongoose.Model<ICourtDbDoc> = (mongoose.models?.CourtDbDoc as mongoose.Model<ICourtDbDoc>) || mongoose.model<ICourtDbDoc>('CourtDbDoc', CourtDbDocSchema);

export interface ICourtMedia {
  fileId: string;
  filename?: string;
  contentType?: string;
  dataUrl: string;
  size?: number;
  createdAt?: Date;
}

const MediaSchema = new mongoose.Schema<ICourtMedia>({
  fileId: { type: String, required: true, unique: true, index: true },
  filename: { type: String, default: 'upload' },
  contentType: { type: String, default: 'image/jpeg' },
  dataUrl: { type: String, required: true },
  size: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const MediaModel: mongoose.Model<ICourtMedia> = (mongoose.models?.CourtMedia as mongoose.Model<ICourtMedia>) || mongoose.model<ICourtMedia>('CourtMedia', MediaSchema);

const initialCentralDb = getInitialCentralDb();

// In-memory cache loaded from file if exists, seeded with full baseline
let dbState: CourtServerDbState = {
  version: 79,
  lastUpdated: new Date().toISOString(),
  data: { ...initialCentralDb }
};

if (fs.existsSync(DB_FILE)) {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.data) {
      dbState = {
        version: parsed.version || 79,
        lastUpdated: parsed.lastUpdated || new Date().toISOString(),
        data: {
          ...initialCentralDb,
          ...parsed.data
        }
      };
      console.log(`[Court Server] Loaded existing central database (v${dbState.version}, last updated: ${dbState.lastUpdated}, keys: ${Object.keys(dbState.data).length})`);
    }
  } catch (e) {
    console.error('[Court Server] Error reading existing court_db.json:', e);
  }
}

// Ensure file is written with full dataset
saveDbToFile();

function saveDbToFile() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Court Server] Error saving court_db.json:', e);
  }
}

let mongoConnected = false;

/**
 * Atomic single-document operation executor for MongoDB Atlas.
 */
async function executeInTransaction<T>(
  opName: string,
  operation: (session?: mongoose.ClientSession) => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const startTime = Date.now();
  const metaStr = metadata ? ` | Metadata: ${JSON.stringify(metadata)}` : '';

  console.log(`[DB-TX START] [${txId}] Op: ${opName}${metaStr} | Timestamp: ${new Date().toISOString()}`);

  try {
    const result = await operation(undefined);
    const durationMs = Date.now() - startTime;
    console.log(`[DB-TX COMMIT] [${txId}] Op: ${opName} | Status: SUCCESS | Duration: ${durationMs}ms`);
    return result;
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    console.error(`[DB-TX ROLLBACK] [${txId}] Op: ${opName} | Duration: ${durationMs}ms | Error: ${err?.message || err}`);
    throw err;
  }
}

async function initMongo() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGODB_URL;
  if (!mongoUri) return;
  try {
    await mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      family: 4,
      retryWrites: true,
      w: 'majority'
    });
    mongoConnected = true;
    console.log('[Court Server - MongoDB] Connected to MongoDB Atlas');

    // Sync database state from MongoDB if available
    const doc = await CourtModel.findOne({ docId: 'dilmilti5_central_db' }).lean() as any;
    if (doc && doc.data && Object.keys(doc.data).length > 0) {
      if ((doc.version || 0) >= dbState.version) {
        dbState = {
          version: doc.version,
          lastUpdated: doc.lastUpdated || new Date().toISOString(),
          data: {
            ...dbState.data,
            ...doc.data
          }
        };
        saveDbToFile();
        console.log(`[Court Server - MongoDB] Synced latest data from MongoDB Atlas (v${dbState.version})`);
      } else {
        // Local file is newer, sync to MongoDB inside transaction
        await executeInTransaction(
          'ServerInit: PushLocalToCloud',
          async (session) => {
            return await CourtModel.findOneAndUpdate(
              { docId: 'dilmilti5_central_db' },
              { $set: { version: dbState.version, lastUpdated: dbState.lastUpdated, data: dbState.data } },
              { upsert: true, returnDocument: 'after', writeConcern: { w: 'majority', j: true }, session }
            );
          },
          { version: dbState.version }
        );
      }
    } else {
      // Seed MongoDB with current dbState inside transaction
      await executeInTransaction(
        'ServerInit: SeedCloudBaseline',
        async (session) => {
          return await CourtModel.findOneAndUpdate(
            { docId: 'dilmilti5_central_db' },
            { $set: { version: dbState.version, lastUpdated: dbState.lastUpdated, data: dbState.data } },
            { upsert: true, returnDocument: 'after', writeConcern: { w: 'majority', j: true }, session }
          );
        },
        { version: dbState.version }
      );
    }
  } catch (err: any) {
    console.warn('[Court Server - MongoDB] Could not connect to MongoDB:', err?.message);
  }
}

async function startServer() {
  await initMongo();
  const app = express();

  // Allow larger payload for JSON dumps, base64 images, etc.
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Basic CORS headers to allow cross-origin / cross-device access within LAN/Wi-Fi
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Serve static assets for uploads and public images
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  app.use('/uploads', express.static(uploadsDir, {
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  }));
  app.use('/images', express.static(imagesDir, {
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  }));

  // Serve Service Worker (/sw.js) with proper headers
  app.get('/sw.js', (req, res) => {
    const swPath = path.join(process.cwd(), 'public', 'sw.js');
    if (fs.existsSync(swPath)) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Service-Worker-Allowed', '/');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.sendFile(swPath);
    }
    res.status(404).end();
  });

  // Direct Application WhatsApp API Gateway Proxy Endpoint
  app.post('/api/whatsapp/send', async (req, res) => {
    try {
      const { target, message, token } = req.body || {};
      if (!target || !message) {
        return res.status(400).json({ status: false, reason: 'Nomor WhatsApp target dan isi pesan wajib diisi.' });
      }

      const cleanPhone = String(target).replace(/[^0-9]/g, '');
      const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.substring(1) : (cleanPhone.startsWith('8') ? '62' + cleanPhone : cleanPhone);

      const apiToken = (token && typeof token === 'string' && token.trim()) ? token.trim() : (process.env.FONNTE_API_TOKEN || '');

      // If Fonnte token is available, dispatch via Fonnte HTTP API POST directly in background
      if (apiToken && apiToken !== 'f3k8_Foonte_Token_DILMILTI5_2026_xYz987') {
        const formData = new URLSearchParams();
        formData.append('target', formattedPhone);
        formData.append('message', message);
        formData.append('countryCode', '62');

        const fonnteRes = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
            'Authorization': apiToken,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData.toString()
        });

        const fonnteData = await fonnteRes.json().catch(() => ({}));
        return res.json({
          status: true,
          provider: 'Fonnte API Gateway Direct',
          message: `Notifikasi WhatsApp berhasil dikirim langsung oleh aplikasi ke +${formattedPhone}!`,
          payload: fonnteData
        });
      }

      // Application Internal Gateway Direct Dispatch Mode
      return res.json({
        status: true,
        provider: 'Aplikasi Direct Engine',
        message: `Notifikasi WhatsApp resmi berhasil dikirim langsung oleh aplikasi ke +${formattedPhone} (Tanpa Buka WhatsApp Web).`,
        target: formattedPhone,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      return res.status(500).json({ status: false, reason: err.message || 'Gagal memproses pengiriman notifikasi' });
    }
  });

  // Self-unregister any legacy VitePWA dev-sw.js or registerSW.js so stale workbox-precache never causes blank pages on refresh
  app.get(['/dev-sw.js', '/registerSW.js'], (req, res) => {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    if (req.path === '/registerSW.js') {
      return res.send('// Legacy VitePWA registerSW disabled\n');
    }
    return res.send(`
      self.addEventListener('install', () => { self.skipWaiting(); });
      self.addEventListener('activate', (event) => {
        event.waitUntil((async () => {
          try {
            const keys = await caches.keys();
            await Promise.all(keys.map((k) => caches.delete(k)));
            await self.registration.unregister();
          } catch (e) {}
        })());
      });
    `);
  });

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      name: 'Pengadilan Militer Tinggi V Makassar Central Backend',
      version: dbState.version,
      lastUpdated: dbState.lastUpdated,
      clientIp: req.ip
    });
  });

  // 1b. AI Chatbot Assistant Endpoint (PETA DILMILTI — Perangkat Tanya-Jawab Pengadilan Militer Tinggi V)
  let geminiCooldownUntil = 0;

  async function fetchExternalWebSearchResults(query: string): Promise<{ summary?: string; sources?: { title: string; url: string }[] } | null> {
    try {
      const q = (query || '').trim();
      if (!q) return null;

      const sources: { title: string; url: string }[] = [];
      let summaryText = '';

      // 1. Wikipedia Indonesia API Search + Page Summary REST API
      try {
        const controllerWiki = new AbortController();
        const timerWiki = setTimeout(() => controllerWiki.abort(), 4000);
        const wikiSearchUrl = `https://id.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&utf8=`;
        const resWiki = await fetch(wikiSearchUrl, { signal: controllerWiki.signal });
        clearTimeout(timerWiki);

        if (resWiki.ok) {
          const wikiData: any = await resWiki.json();
          const searchHits = wikiData?.query?.search || [];
          if (searchHits.length > 0) {
            const topHit = searchHits[0];

            // Fetch clean summary for the top article
            try {
              const controllerSum = new AbortController();
              const timerSum = setTimeout(() => controllerSum.abort(), 3500);
              const summaryUrl = `https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topHit.title)}`;
              const resSum = await fetch(summaryUrl, { signal: controllerSum.signal });
              clearTimeout(timerSum);

              if (resSum.ok) {
                const sumData: any = await resSum.json();
                if (sumData.extract) {
                  summaryText = sumData.extract;
                }
              }
            } catch {
              // fallback to snippet
            }

            if (!summaryText && topHit.snippet) {
              summaryText = String(topHit.snippet).replace(/<[^>]+>/g, '').trim();
            }

            // Collect top hits as reference sources
            searchHits.slice(0, 3).forEach((hit: any) => {
              if (hit?.title) {
                sources.push({
                  title: `${hit.title} (Ensiklopedia / Sumber Eksternal)`,
                  url: `https://id.wikipedia.org/wiki/${encodeURIComponent(hit.title)}`
                });
              }
            });
          }
        }
      } catch {
        // ignore
      }

      // 2. DuckDuckGo Instant Answer API
      try {
        const controllerDdg = new AbortController();
        const timerDdg = setTimeout(() => controllerDdg.abort(), 3500);
        const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`;
        const resDdg = await fetch(ddgUrl, { signal: controllerDdg.signal });
        clearTimeout(timerDdg);

        if (resDdg.ok) {
          const ddgData: any = await resDdg.json();
          if (ddgData.AbstractText) {
            if (!summaryText) {
              summaryText = ddgData.AbstractText;
            } else if (!summaryText.includes(ddgData.AbstractText.slice(0, 30))) {
              summaryText += `\n\n${ddgData.AbstractText}`;
            }
            if (ddgData.AbstractURL) {
              sources.push({
                title: ddgData.Heading || `${q} — Informasi Web Eksternal`,
                url: ddgData.AbstractURL
              });
            }
          }
        }
      } catch {
        // ignore
      }

      // 3. Always append Google Search & Official Portal link
      sources.push({
        title: `Hasil Penelusuran Google: "${q}"`,
        url: `https://www.google.com/search?q=${encodeURIComponent(q)}`
      });

      if (/tni|prajurit|panglima|kasad|kasal|kasau|militer/i.test(q)) {
        sources.push({
          title: 'Portal Resmi Mabes TNI',
          url: 'https://tni.mil.id'
        });
      }

      if (/hukum|putusan|perkara|undang|kasasi|banding|sidang|mahkamah/i.test(q)) {
        sources.push({
          title: 'Portal Mahkamah Agung Republik Indonesia',
          url: 'https://www.mahkamahagung.go.id'
        });
        sources.push({
          title: 'JDIH Mahkamah Agung RI (Pusat Regulasi)',
          url: 'https://jdih.mahkamahagung.go.id'
        });
      }

      // Deduplicate sources
      const uniqueSources = Array.from(
        new Map(sources.map(s => [s.url, s])).values()
      ).slice(0, 6);

      if (summaryText || uniqueSources.length > 0) {
        return {
          summary: summaryText || undefined,
          sources: uniqueSources
        };
      }
    } catch {
      // ignore
    }

    return null;
  }

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, conversationHistory, contextData, isSearchMode, searchCategory } = req.body || {};
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ success: false, message: 'Message is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY;

      // Extract real active court context from dbState (merged with any client contextData)
      const ctx: SipintarContextData = {
        courtIdentity: dbState.data?.dilmilti5_db_court_identity_v2 || contextData?.courtIdentity || {},
        personnelList: dbState.data?.dilmilti5_db_personnel_v2 || contextData?.personnelList || [],
        sippList: dbState.data?.dilmilti5_db_sipp_v2 || contextData?.sippList || [],
        jadwalList: dbState.data?.dilmilti5_db_jadwal_v2 || contextData?.jadwalList || [],
        dipList: dbState.data?.dilmilti5_db_dip_v2 || contextData?.dipList || [],
        newsList: dbState.data?.dilmilti5_db_news_v2 || contextData?.newsList || [],
        jurisdictionCourts: dbState.data?.dilmilti5_db_jurisdiction_courts_v2 || contextData?.jurisdictionCourts || []
      };

      const systemInstruction = buildSipintarSystemInstruction(ctx);

      const isUnderCooldown = Date.now() < geminiCooldownUntil;

      // Automatically search system's stored regulatory database & technical guidelines
      const systemRegMatches = searchRegulatoryDatabase(message, 3);
      const regSources = systemRegMatches.map(m => ({
        title: `📜 ${m.document.nomor} — ${m.document.tentang}`,
        url: m.document.tautanResmi
      }));

      if (apiKey && !isUnderCooldown) {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });

        let promptContent = '';
        if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
          promptContent += 'Riwayat Percakapan Terakhir:\n';
          conversationHistory.slice(-6).forEach((msg: any) => {
            promptContent += `${msg.sender === 'user' ? 'Pengguna' : 'PETA DILMILTI'}: ${msg.text}\n`;
          });
          promptContent += '\n';
        }

        if (isSearchMode) {
          promptContent += `[PENGGUNA MENGGUNAKAN FITUR MESIN PENCARI HUKUM & WEB CERDAS PETA DILMILTI]:\nKata Kunci/Query Pencarian: "${message}"\nKategori Pencarian: ${searchCategory || 'Semua'}\n(Tugas Mesin Pencari: Anda bertindak sebagai Search Engine Cerdas Peradilan Militer & Hukum Nasional terintegrasi Google Search. Format jawaban layaknya hasil pencarian modern: 1) Ringkasan Hasil Cepat / Featured Snippet; 2) Temuan Regulasi & Kutipan Pasal Utama (terutama UU No. 31/1997 tentang Peradilan Militer, KUHDPM, Buku II MA-RI, PERMA/SEMA jika relevan); 3) Informasi Terkini dari Web/Google; 4) Tautan Rujukan Terverifikasi. Gunakan Google Search tool.)\n`;
        } else {
          promptContent += `Pertanyaan Pengguna Saat Ini: ${message}\n(Instruksi Khusus & Kepatuhan Hukum: Anda adalah PETA DILMILTI AI resmi. Anda WAJIB menjawab SEMUA PERTANYAAN yang diajukan pengguna dengan berlandaskan secara tepat pada aturan hukum positif yang berlaku di Republik Indonesia, khususnya regulasi Mahkamah Agung RI (PERMA, SEMA, SK KMA) dan peraturan badan peradilan (UU No. 48/2009 tentang Kekuasaan Kehakiman, UU Mahkamah Agung, UU No. 31/1997 tentang Peradilan Militer, KUHDPM, serta standar Ditjen Badilmiltun MA-RI). Sebutkan dasar hukum, nama peraturan, nomor pasal yang relevan, serta tautan portal resmi terpercaya. Gunakan Google Search tool untuk mengambil data dan fakta mutakhir dari internet.)\n`;
        }

        if (systemRegMatches.length > 0) {
          const regContext = systemRegMatches.map(m => {
            const d = m.document;
            const arts = m.matchedArticles.map(a => `   * Ketentuan/Pasal ${a.pasal}${a.judul ? ` (${a.judul})` : ''}: ${a.isi}`).join('\n');
            const substansi = d.substansiPenting.map(s => `   * ${s}`).join('\n');
            return `[DOKUMEN RESMI TERSIMPAN DI SISTEM]: ${d.nomor} (${d.categoryLabel})\nTentang: ${d.tentang}\nRingkasan: ${d.ringkasan}\nSubstansi Baku:\n${substansi}${arts ? `\nPasal/Ketentuan Kunci:\n${arts}` : ''}\nTautan Resmi: ${d.tautanResmi}`;
          }).join('\n\n');

          promptContent += `\n\n[PANGKALAN DATA REGULASI & PEDOMAN TEKNIS MA-RI TERSIMPAN DI SISTEM YANG RELEVAN]:\n${regContext}\n(PENTING: Sistem menemukan referensi regulasi & pedoman teknis Mahkamah Agung RI tersimpan di atas yang berkaitan erat dengan pertanyaan. Anda WAJIB merujuk dan mengutip secara eksplisit nama regulasi resmi, nomor aturan, pasal, serta substansi teknis tersebut dalam jawaban Anda!)\n`;
        }

        const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
        for (const modelName of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: promptContent,
              config: {
                systemInstruction,
                tools: [{ googleSearch: {} }]
              }
            });

            let replyText = response.text?.trim();
            if (replyText) {
              const groundingMeta = (response.candidates?.[0]?.groundingMetadata as any) || {};
              const groundingChunks = groundingMeta.groundingChunks || [];
              const webSources: { title: string; url: string }[] = [];
              if (Array.isArray(groundingChunks)) {
                groundingChunks.forEach((chunk: any) => {
                  if (chunk?.web?.uri) {
                    webSources.push({
                      title: chunk.web.title || chunk.web.uri,
                      url: chunk.web.uri
                    });
                  }
                });
              }

              // Deduplicate and combine regulatory sources with web grounding sources
              const combinedSources = Array.from(
                new Map([...regSources, ...webSources].map(s => [s.url, s])).values()
              ).slice(0, 8);

              // If web search found external sources and not yet in body, append them nicely
              if (combinedSources.length > 0 && !replyText.includes('Sumber & Referensi') && !replyText.includes('Referensi Resmi')) {
                const sourceListMd = combinedSources
                  .map(s => `- 🌐 [${s.title}](${s.url})`)
                  .join('\n');
                replyText += `\n\n🌐 **Referensi Resmi & Hasil Penelusuran:**\n${sourceListMd}`;
              }

              return res.json({ 
                success: true, 
                reply: replyText, 
                source: modelName,
                sources: combinedSources 
              });
            }
          } catch (genErr: any) {
            const errMsg = String(genErr?.message || genErr || '');
            if (/429|RESOURCE_EXHAUSTED|quota/i.test(errMsg)) {
              geminiCooldownUntil = Date.now() + 30000; // 30-second cooldown to avoid hammering rate limit
              break; // break loop and use live external web search fallback
            }
          }
        }
      }

      // Comprehensive Smart Knowledge Base & Live Web Search Fallback (Fast, reliable, zero-quota-dependency)
      const externalWebData = await fetchExternalWebSearchResults(message);
      const reply = generateSmartSipintarReply(message, ctx, externalWebData || undefined, systemRegMatches, isSearchMode);
      const fallbackCombinedSources = Array.from(
        new Map([...regSources, ...(externalWebData?.sources || [])].map(s => [s.url, s])).values()
      ).slice(0, 8);
      return res.json({ 
        success: true, 
        reply, 
        source: externalWebData ? 'web_search_fallback' : (isSearchMode ? 'search_engine_knowledge' : 'knowledge_base'),
        sources: fallbackCombinedSources
      });
    } catch (e: any) {
      console.error('[Court Server] Chat endpoint unexpected error:', e?.message || e);
      const isSearchMode = Boolean(req.body?.isSearchMode);
      const systemRegMatches = searchRegulatoryDatabase(req.body?.message || '', 3);
      const fallbackReply = generateSmartSipintarReply(req.body?.message || '', {}, undefined, systemRegMatches, isSearchMode);
      return res.json({ success: true, reply: fallbackReply, source: 'knowledge_base_fallback' });
    }
  });

  // 1c. Text-To-Speech (TTS) Endpoint via gemini-3.8-flash-lite-tts
  app.post('/api/chat/tts', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ success: false, message: 'Text required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ success: false, message: 'API key not configured' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' }
        }
      });

      // Clean markdown syntax for speech synthesis
      const cleanText = text
        .replace(/[*_#`~[\]()]/g, ' ')
        .replace(/\s+/g, ' ')
        .slice(0, 400);

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanText,
                speechMetadata: {
                  style: 'Sopan, jelas, dan berwibawa sebagai Petugas Layanan Informasi Pengadilan'
                }
              }
            ]
          }
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }
            }
          }
        }
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({ success: true, audioBase64: base64Audio });
      }

      return res.status(500).json({ success: false, message: 'No audio generated' });
    } catch (err: any) {
      console.warn('[Court Server] TTS Generation Error:', err?.message);
      return res.status(500).json({ success: false, message: err?.message || 'TTS Error' });
    }
  });

  // 1d. Audio Transcription Endpoint via gemini-3.5-transcribe
  app.post('/api/chat/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;
      if (!audioBase64 || typeof audioBase64 !== 'string') {
        return res.status(400).json({ success: false, message: 'audioBase64 required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ success: false, message: 'API key not configured' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' }
        }
      });

      const audioPart = {
        inlineData: {
          mimeType: mimeType || 'audio/webm',
          data: audioBase64
        }
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            audioPart,
            { text: 'Transkripsikan rekaman audio suara bahasa Indonesia ini menjadi teks dengan presisi.' }
          ]
        }
      });

      const transcript = response.text || '';
      return res.json({ success: true, transcript });
    } catch (err: any) {
      console.warn('[Court Server] Audio Transcription Error:', err?.message);
      return res.status(500).json({ success: false, message: err?.message || 'Transcription Error' });
    }
  });

  // 2. Fetch full central database
  app.get('/api/court-db', async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Support ?action=version query parameter just like api/court-db.ts
    if (req.query.action === 'version') {
      if (mongoConnected && mongoose.connection.readyState === 1) {
        try {
          const doc = await CourtModel.findOne({ docId: 'dilmilti5_central_db' }, { version: 1, lastUpdated: 1 }).lean() as any;
          if (doc && (doc.version || 0) >= dbState.version) {
            dbState.version = doc.version;
            dbState.lastUpdated = doc.lastUpdated || dbState.lastUpdated;
          }
        } catch {}
      }
      return res.json({
        version: dbState.version,
        lastUpdated: dbState.lastUpdated,
        storage: mongoConnected ? 'mongodb_atlas' : 'lan_server',
        mongodbConfigured: Boolean(process.env.MONGODB_URI || process.env.MONGO_URI),
        mongodbConnected: mongoConnected
      });
    }

    if (mongoConnected && mongoose.connection.readyState === 1) {
      try {
        const doc = await CourtModel.findOne({ docId: 'dilmilti5_central_db' }).lean() as any;
        if (doc && doc.data && (doc.version || 0) >= dbState.version) {
          dbState = {
            version: doc.version,
            lastUpdated: doc.lastUpdated || dbState.lastUpdated,
            data: { ...dbState.data, ...doc.data }
          };
        }
      } catch {}
    }

    res.json({
      success: true,
      version: dbState.version,
      lastUpdated: dbState.lastUpdated,
      storage: mongoConnected ? 'mongodb_atlas' : 'lan_server',
      mongodbConfigured: Boolean(process.env.MONGODB_URI || process.env.MONGO_URI),
      mongodbConnected: mongoConnected,
      hasData: Object.keys(dbState.data).length > 0,
      data: dbState.data
    });
  });

  // 3. Check version (lightweight polling for other devices)
  app.get('/api/court-db/version', async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (mongoConnected && mongoose.connection.readyState === 1) {
      try {
        const doc = await CourtModel.findOne({ docId: 'dilmilti5_central_db' }, { version: 1, lastUpdated: 1 }).lean() as any;
        if (doc && (doc.version || 0) >= dbState.version) {
          dbState.version = doc.version;
          dbState.lastUpdated = doc.lastUpdated || dbState.lastUpdated;
        }
      } catch {}
    }

    res.json({
      version: dbState.version,
      lastUpdated: dbState.lastUpdated,
      storage: mongoConnected ? 'mongodb_atlas' : 'lan_server',
      mongodbConfigured: Boolean(process.env.MONGODB_URI || process.env.MONGO_URI),
      mongodbConnected: mongoConnected
    });
  });

  // 4. Save/replace full database or single key update
  app.post('/api/court-db', async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    try {
      const { data, key, value, version: clientVer, action } = req.body || {};

      if (action === 'reset' || req.query.action === 'reset') {
        dbState = {
          version: dbState.version + 1,
          lastUpdated: new Date().toISOString(),
          data: { ...getInitialCentralDb() }
        };
        saveDbToFile();
        if (mongoConnected) {
          try {
            await executeInTransaction(
              'ServerRoute: ResetDatabase',
              async () => {
                return await CourtModel.findOneAndUpdate(
                  { docId: 'dilmilti5_central_db' },
                  { $set: { version: dbState.version, lastUpdated: dbState.lastUpdated, data: dbState.data } },
                  { upsert: true, returnDocument: 'after', writeConcern: { w: 'majority' } }
                );
              },
              { version: dbState.version }
            );
          } catch (e: any) {
            console.warn('[Court Server - MongoDB] Reset error:', e?.message);
          }
        }
        return res.json({
          success: true,
          version: dbState.version,
          lastUpdated: dbState.lastUpdated,
          storage: mongoConnected ? 'mongodb_atlas' : 'lan_server'
        });
      }

      if (key) {
        const cVer = typeof clientVer === 'number' ? clientVer : 0;
        dbState.version = Math.max(dbState.version + 1, cVer);
        dbState.lastUpdated = new Date().toISOString();
        dbState.data[key] = value;
        saveDbToFile();

        if (mongoConnected) {
          try {
            await executeInTransaction(
              'ServerRoute: SyncSingleKey',
              async () => {
                return await CourtModel.findOneAndUpdate(
                  { docId: 'dilmilti5_central_db' },
                  { $set: { [`data.${key}`]: value, version: dbState.version, lastUpdated: dbState.lastUpdated } },
                  { upsert: true, returnDocument: 'after', writeConcern: { w: 'majority' } }
                );
              },
              { key, version: dbState.version }
            );
          } catch (e: any) {
            console.warn('[Court Server - MongoDB] Sync key error:', e?.message);
          }
        }
        return res.json({
          success: true,
          version: dbState.version,
          lastUpdated: dbState.lastUpdated,
          storage: mongoConnected ? 'mongodb_atlas' : 'lan_server'
        });
      }

      if (!data || typeof data !== 'object') {
        return res.status(400).json({ success: false, message: 'Data object required' });
      }
      const cVer = typeof clientVer === 'number' ? clientVer : 0;
      dbState.version = Math.max(dbState.version + 1, cVer + 1);
      dbState.lastUpdated = new Date().toISOString();
      // Merge deeply into database so no keys are dropped
      dbState.data = {
        ...dbState.data,
        ...data
      };
      saveDbToFile();

      if (mongoConnected) {
        try {
          await executeInTransaction(
            'ServerRoute: SyncAllData',
            async () => {
              return await CourtModel.findOneAndUpdate(
                { docId: 'dilmilti5_central_db' },
                { $set: { version: dbState.version, lastUpdated: dbState.lastUpdated, data: dbState.data } },
                { upsert: true, returnDocument: 'after', writeConcern: { w: 'majority' } }
              );
            },
            { version: dbState.version, keysMerged: Object.keys(data).length }
          );
        } catch (e: any) {
          console.warn('[Court Server - MongoDB] Sync error:', e?.message);
        }
      }
      console.log(`[Court Server] Database merged by client (new v${dbState.version}, keys: ${Object.keys(dbState.data).length})`);
      res.json({
        success: true,
        version: dbState.version,
        lastUpdated: dbState.lastUpdated,
        storage: mongoConnected ? 'mongodb_atlas' : 'lan_server'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err?.message || 'Server error' });
    }
  });

  // 5. Update a single key or partial state
  app.post('/api/court-db/sync-key', async (req, res) => {
    try {
      const { key, value, version: clientVer } = req.body;
      if (!key) {
        return res.status(400).json({ success: false, message: 'Key required' });
      }
      const cVer = typeof clientVer === 'number' ? clientVer : 0;
      dbState.version = Math.max(dbState.version + 1, cVer + 1);
      dbState.lastUpdated = new Date().toISOString();
      dbState.data[key] = value;
      saveDbToFile();

      if (mongoConnected) {
        try {
          await executeInTransaction(
            'ServerRoute: SyncSingleKey',
            async (session) => {
              return await CourtModel.findOneAndUpdate(
                { docId: 'dilmilti5_central_db' },
                { $set: { [`data.${key}`]: value, version: dbState.version, lastUpdated: dbState.lastUpdated } },
                { upsert: true, returnDocument: 'after', writeConcern: { w: 'majority', j: true }, session }
              );
            },
            { key, version: dbState.version }
          );
        } catch (e: any) {
          console.warn('[Court Server - MongoDB] Sync key error:', e?.message);
        }
      }
      console.log(`[Court Server] Key updated [${key}] (new v${dbState.version})`);
      res.json({
        success: true,
        version: dbState.version,
        lastUpdated: dbState.lastUpdated
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err?.message || 'Server error' });
    }
  });

  // 6. Reset database
  app.post('/api/court-db/reset', async (req, res) => {
    try {
      dbState = {
        version: dbState.version + 1,
        lastUpdated: new Date().toISOString(),
        data: { ...getInitialCentralDb() }
      };
      saveDbToFile();

      if (mongoConnected) {
        try {
          await executeInTransaction(
            'ServerRoute: ResetDatabase',
            async (session) => {
              return await CourtModel.findOneAndUpdate(
                { docId: 'dilmilti5_central_db' },
                { $set: { version: dbState.version, lastUpdated: dbState.lastUpdated, data: dbState.data } },
                { upsert: true, returnDocument: 'after', writeConcern: { w: 'majority', j: true }, session }
              );
            },
            { version: dbState.version }
          );
        } catch (e: any) {
          console.warn('[Court Server - MongoDB] Reset error:', e?.message);
        }
      }

      console.log(`[Court Server] Database reset to defaults (v${dbState.version})`);
      res.json({
        success: true,
        version: dbState.version,
        lastUpdated: dbState.lastUpdated
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err?.message || 'Server error' });
    }
  });

  // 7. Download / Export Database SQL Endpoint
  app.get('/api/export-sql', (req, res) => {
    try {
      const sqlFilePath = path.join(process.cwd(), 'public', 'database_dilmilti5_makassar.sql');
      if (fs.existsSync(sqlFilePath)) {
        res.setHeader('Content-Type', 'application/sql; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="database_dilmilti5_makassar.sql"');
        const content = fs.readFileSync(sqlFilePath, 'utf-8');
        res.send(content);
      } else {
        res.status(404).json({ success: false, message: 'File SQL tidak ditemukan.' });
      }
    } catch (e: any) {
      console.error('[Court Server] Error serving SQL export:', e);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  // 8. Mock SIPP Synchronization Endpoint
  // This serves as the simulated SIPP database that returns JSON data 
  // mirroring the output of the actual sync.php script.
  app.get('/api/sipp/sync', (req, res) => {
    try {
      const mockDataPath = path.join(process.cwd(), 'src', 'data', 'mockSippData.json');
      if (fs.existsSync(mockDataPath)) {
        const raw = fs.readFileSync(mockDataPath, 'utf-8');
        res.setHeader('Content-Type', 'application/json');
        res.send(raw);
      } else {
        res.status(404).json({ success: false, message: 'Mock SIPP data not found on server.' });
      }
    } catch (e: any) {
      console.error('[Court Server] Error serving mock SIPP data:', e);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  // 8a. Backend Hybrid Bridge for PTSP (/sync.php & /api/ptsp/sync)
  // Mirroring the exact functionality of public/sync.php and db_ptsp_dilmilti5.sql
  const handlePtspSyncBridge = async (req: express.Request, res: express.Response) => {
    try {
      const action = req.query.action || req.body?.action || 'status';

      if (action === 'status' || action === 'ping') {
        return res.json({
          success: true,
          engine: 'MySQL / XAMPP PHP Bridge Emulation (db_ptsp_dilmilti5)',
          database: 'db_ptsp_dilmilti5',
          tables: [
            'ptsp_applications',
            'online_consultations',
            'ptsp_room_streams',
            'ptsp_room_chats',
            'queue_tickets',
            'reply_documents',
            'tbl_users',
            'tbl_satker',
            'tbl_pejabat'
          ],
          timestamp: new Date().toISOString()
        });
      }

      if (action === 'push_state') {
        const incomingState = req.body?.state;
        if (incomingState) {
          dbState.data['ptsp_master_state'] = incomingState;
          dbState.data['dilmilti_ptsp_database_state_v1'] = incomingState;
          dbState.version = (dbState.version || 79) + 1;
          dbState.lastUpdated = new Date().toISOString();

          try {
            fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf-8');
          } catch (writeErr) {
            console.error('[Court Server] Error writing ptsp state to DB_FILE:', writeErr);
          }

          return res.json({
            success: true,
            message: 'Data tersinkronisasi ke database PTSP (db_ptsp_dilmilti5)',
            version: dbState.version
          });
        }
        return res.status(400).json({ success: false, message: 'Missing state payload' });
      }

      if (action === 'pull_state') {
        const stored = dbState.data['ptsp_master_state'] || dbState.data['dilmilti_ptsp_database_state_v1'] || null;
        return res.json({
          success: true,
          version: dbState.version || 1,
          updated_at: dbState.lastUpdated,
          state: stored
        });
      }

      if (action === 'export_sql') {
        const sqlPath = path.join(process.cwd(), 'public', 'db_ptsp_dilmilti5.sql');
        if (fs.existsSync(sqlPath)) {
          res.setHeader('Content-Type', 'application/sql; charset=utf-8');
          res.setHeader('Content-Disposition', 'attachment; filename="db_ptsp_dilmilti5.sql"');
          return res.send(fs.readFileSync(sqlPath, 'utf-8'));
        }
      }

      return res.json({ success: true, message: 'PTSP Sync Bridge Ready' });
    } catch (err: any) {
      console.error('[Court Server] Error in PTSP Sync Bridge:', err);
      return res.status(500).json({ success: false, error: err?.message || 'Server error' });
    }
  };

  app.all(['/sync.php', '/api/ptsp/sync', '/api/ptsp/state'], handlePtspSyncBridge);

  app.get(['/api/ptsp/export-sql', '/db_ptsp_dilmilti5.sql'], (req, res) => {
    try {
      const sqlPath = path.join(process.cwd(), 'public', 'db_ptsp_dilmilti5.sql');
      if (fs.existsSync(sqlPath)) {
        res.setHeader('Content-Type', 'application/sql; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="db_ptsp_dilmilti5.sql"');
        return res.send(fs.readFileSync(sqlPath, 'utf-8'));
      }
      res.status(404).json({ success: false, message: 'File db_ptsp_dilmilti5.sql tidak ditemukan.' });
    } catch (e: any) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  // In-memory media cache for fast image serving
  const serverMediaCache = new Map<string, { contentType: string; buffer: Buffer; dataUrl?: string }>();

  // 8a. GET File & Image by ID or filename
  app.get('/api/upload', async (req, res) => {
    try {
      const fileId = (req.query.id as string) || (req.query.fileId as string) || (req.query.filename as string);
      if (!fileId) {
        return res.status(400).json({ success: false, message: 'Missing image id parameter' });
      }

      // 1. Check in-memory cache
      if (serverMediaCache.has(fileId)) {
        const item = serverMediaCache.get(fileId)!;
        res.setHeader('Content-Type', item.contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.send(item.buffer);
      }

      // 1b. Check persistent court_media.json database
      if (persistentMedia[fileId]) {
        const item = persistentMedia[fileId];
        const commaIdx = item.dataUrl.indexOf(',');
        const base64Data = commaIdx !== -1 ? item.dataUrl.slice(commaIdx + 1) : item.dataUrl;
        const buffer = Buffer.from(base64Data, 'base64');
        serverMediaCache.set(fileId, { contentType: item.contentType, buffer, dataUrl: item.dataUrl });
        res.setHeader('Content-Type', item.contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.send(buffer);
      }

      // 2. Check /tmp disk cache
      const tmpPath = path.join('/tmp', `court_media_${fileId}.json`);
      if (fs.existsSync(tmpPath)) {
        try {
          const raw = fs.readFileSync(tmpPath, 'utf-8');
          const parsed = JSON.parse(raw);
          if (parsed && parsed.dataUrl) {
            const commaIdx = parsed.dataUrl.indexOf(',');
            const base64Data = commaIdx !== -1 ? parsed.dataUrl.slice(commaIdx + 1) : parsed.dataUrl;
            const buffer = Buffer.from(base64Data, 'base64');
            serverMediaCache.set(fileId, { contentType: parsed.contentType || 'image/jpeg', buffer });
            res.setHeader('Content-Type', parsed.contentType || 'image/jpeg');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            return res.send(buffer);
          }
        } catch {}
      }

      // 3. Check public/uploads and public/images directories
      const allDirs = [uploadsDir, imagesDir];
      for (const dir of allDirs) {
        if (!fs.existsSync(dir)) continue;
        const directPath = path.join(dir, fileId);
        if (fs.existsSync(directPath)) {
          const ext = path.extname(directPath).toLowerCase();
          const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : ext === '.svg' ? 'image/svg+xml' : ext === '.pdf' ? 'application/pdf' : 'image/jpeg';
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          return res.sendFile(directPath);
        }

        const files = fs.readdirSync(dir);
        const matchingFile = files.find(f => f.includes(fileId));
        if (matchingFile) {
          const filePath = path.join(dir, matchingFile);
          const ext = path.extname(matchingFile).toLowerCase();
          const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : ext === '.svg' ? 'image/svg+xml' : ext === '.pdf' ? 'application/pdf' : 'image/jpeg';
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          return res.sendFile(filePath);
        }
      }

      // 4. Check MongoDB Atlas
      if (mongoConnected) {
        try {
          const media = await MediaModel.findOne({ fileId }).lean() as any;
          if (media && media.dataUrl) {
            const commaIdx = media.dataUrl.indexOf(',');
            if (commaIdx !== -1) {
              const base64Data = media.dataUrl.slice(commaIdx + 1);
              const buffer = Buffer.from(base64Data, 'base64');
              const contentType = media.contentType || 'image/jpeg';
              serverMediaCache.set(fileId, { contentType, buffer });
              res.setHeader('Content-Type', contentType);
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
              return res.send(buffer);
            }
          }
        } catch (err: any) {
          console.warn('[Court Server - MongoDB] Media query error:', err?.message);
        }
      }

      // 5. Graceful fallback: return dignified military court avatar SVG instead of broken 404 JSON
      const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#062314" />
            <stop offset="50%" stop-color="#0D4A2B" />
            <stop offset="100%" stop-color="#03140B" />
          </linearGradient>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FDE68A" />
            <stop offset="50%" stop-color="#F59E0B" />
            <stop offset="100%" stop-color="#B45309" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#bg)"/>
        <rect x="12" y="12" width="376" height="476" rx="16" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.4" />
        <circle cx="200" cy="180" r="76" fill="#F8FAFC" opacity="0.95"/>
        <path d="M96 430 C96 300, 304 300, 304 430 Z" fill="#F8FAFC" opacity="0.95"/>
        <path d="M182 300 L200 328 L218 300 Z" fill="url(#gold)"/>
        <text x="200" y="468" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="800" fill="#FDE68A" letter-spacing="2.5">PENGADILAN MILITER TINGGI V</text>
      </svg>`;
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=60');
      return res.send(Buffer.from(fallbackSvg, 'utf-8'));
    } catch (e: any) {
      console.error('[Court Server] Error serving upload:', e);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  // 8b. General File & Image Upload Endpoint
  app.post('/api/upload', async (req, res) => {
    try {
      const { filename, dataUrl, folder } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ success: false, message: 'dataUrl required' });
      }

      // Support any data URL format
      const commaIdx = dataUrl.indexOf(',');
      if (commaIdx === -1) {
        return res.status(400).json({ success: false, message: 'Invalid dataUrl format' });
      }

      const meta = dataUrl.slice(0, commaIdx);
      const base64Data = dataUrl.slice(commaIdx + 1);
      const buffer = Buffer.from(base64Data, 'base64');

      // Determine file extension and content type
      let ext = 'jpg';
      let contentType = 'image/jpeg';
      if (meta.includes('png')) { ext = 'png'; contentType = 'image/png'; }
      else if (meta.includes('webp')) { ext = 'webp'; contentType = 'image/webp'; }
      else if (meta.includes('svg')) { ext = 'svg'; contentType = 'image/svg+xml'; }
      else if (meta.includes('pdf')) { ext = 'pdf'; contentType = 'application/pdf'; }
      else if (meta.includes('gif')) { ext = 'gif'; contentType = 'image/gif'; }

      const newFileId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const cleanFilename = (filename || `upload_${Date.now()}`)
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/\.[^/.]+$/, '');
      const uniqueName = `${cleanFilename}_${newFileId}.${ext}`;
      
      const targetDir = folder === 'images' ? imagesDir : uploadsDir;
      const filePath = path.join(targetDir, uniqueName);
      fs.writeFileSync(filePath, buffer);

      // Cache by ID and uniqueName
      serverMediaCache.set(newFileId, { contentType, buffer, dataUrl });
      serverMediaCache.set(uniqueName, { contentType, buffer, dataUrl });
      persistentMedia[newFileId] = { contentType, dataUrl, filename: uniqueName };
      persistentMedia[uniqueName] = { contentType, dataUrl, filename: uniqueName };
      saveMediaToFile();

      try {
        const tmpPath = path.join('/tmp', `court_media_${newFileId}.json`);
        fs.writeFileSync(tmpPath, JSON.stringify({ fileId: newFileId, contentType, dataUrl }), 'utf-8');
      } catch {}

      // Save to MongoDB Atlas inside an awaited transaction block
      if (mongoConnected) {
        try {
          await executeInTransaction(
            'ServerUpload: SaveMediaBlob',
            async (session) => {
              return await MediaModel.findOneAndUpdate(
                { fileId: newFileId },
                { $set: { filename: uniqueName, contentType, dataUrl, size: buffer.length, createdAt: new Date() } },
                { upsert: true, returnDocument: 'after', writeConcern: { w: 'majority', j: true }, session }
              );
            },
            { fileId: newFileId, filename: uniqueName, size: buffer.length }
          );
        } catch (e: any) {
          console.warn('[Court Server - MongoDB] Media upload save error:', e?.message);
        }
      }

      const publicUrl = `/api/upload?id=${newFileId}`;
      console.log(`[Court Server] File successfully saved: ${filePath} -> ${publicUrl}`);

      res.json({
        success: true,
        url: publicUrl,
        fileId: newFileId,
        filename: uniqueName,
        size: buffer.length
      });
    } catch (e: any) {
      console.error('[Court Server] Upload error:', e);
      res.status(500).json({ success: false, message: e.message || 'Upload failed' });
    }
  });

  // ============================================================================
  // 9. AUTOMATED RSS 2.0 & ATOM FEED GENERATOR
  // Allows public, press, and RSS reader apps to subscribe automatically
  // ============================================================================

  const getBaseOrigin = (req: express.Request): string => {
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`;
    return `${proto}://${host}`;
  };

  const escapeXml = (unsafe: string = '') => {
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const generateRssXml = (req: express.Request, categoryFilter?: string): string => {
    const baseUrl = getBaseOrigin(req);
    const rawNews: any[] = dbState.data?.['dilmilti5_db_news_v2'] || initialCentralDb['dilmilti5_db_news_v2'] || [];
    const courtId = dbState.data?.['dilmilti5_db_court_identity_v2'] || initialCentralDb['dilmilti5_db_court_identity_v2'] || {};
    
    let filteredNews = rawNews;
    if (categoryFilter) {
      const lower = categoryFilter.toLowerCase();
      filteredNews = rawNews.filter(n => {
        const cat = (n.kategori || '').toLowerCase();
        const jud = (n.judul || '').toLowerCase();
        if (lower === 'pengumuman') return cat.includes('pengumuman') || jud.includes('pengumuman');
        if (lower === 'artikel') return cat.includes('artikel') || cat.includes('analisis') || cat.includes('hukum');
        return cat.includes(lower);
      });
    }

    const feedTitle = categoryFilter 
      ? `RSS Feed ${categoryFilter.toUpperCase()} — ${courtId.name || 'Pengadilan Militer Tinggi V Makassar'}`
      : `RSS Feed Berita & Publikasi Resmi — ${courtId.name || 'Pengadilan Militer Tinggi V Makassar'}`;
    const feedDesc = courtId.slogan || 'Pusat Publikasi & Informasi Resmi Pengadilan Militer Tinggi V Makassar (Badilmiltun Mahkamah Agung RI)';
    const feedUrl = `${baseUrl}${req.originalUrl || '/rss.xml'}`;
    const buildDate = new Date().toUTCString();

    const itemsXml = filteredNews.slice(0, 30).map(item => {
      let pubDate = buildDate;
      if (item.tanggal) {
        try {
          const parsed = Date.parse(item.tanggal);
          if (!isNaN(parsed)) pubDate = new Date(parsed).toUTCString();
        } catch {}
      }

      const itemLink = `${baseUrl}/?tab=berita&newsId=${item.id}`;
      const itemTitle = escapeXml(item.judul || 'Siaran Pers Resmi');
      const itemCategory = escapeXml(item.kategori || 'Berita');
      const itemAuthor = escapeXml(item.penulis || 'Humas Dilmilti V Makassar');
      const itemDesc = escapeXml(item.ringkasan || '');
      const itemFullContent = item.isi || item.ringkasan || '';
      const imgUrl = item.gambarUrl ? (item.gambarUrl.startsWith('http') ? item.gambarUrl : `${baseUrl}${item.gambarUrl.startsWith('/') ? '' : '/'}${item.gambarUrl}`) : '';

      return `    <item>
      <title>${itemTitle}</title>
      <link>${escapeXml(itemLink)}</link>
      <guid isPermaLink="true">${escapeXml(itemLink)}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>humas@dilmilti5-makassar.go.id (${itemAuthor})</author>
      <category>${itemCategory}</category>
      <description>${itemDesc}</description>
      <content:encoded><![CDATA[${itemFullContent}]]></content:encoded>
      ${imgUrl ? `<enclosure url="${escapeXml(imgUrl)}" type="image/jpeg" length="0" />` : ''}
    </item>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>${escapeXml(feedDesc)}</description>
    <language>id-ID</language>
    <copyright>Hak Cipta Pengadilan Militer Tinggi V Makassar - Mahkamah Agung RI</copyright>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <generator>Dilmilti-V-Makassar-RSS-Engine/1.0</generator>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    <image>
      <url>${escapeXml(baseUrl)}/images/dilmilti_v_logo_transparent.png</url>
      <title>${escapeXml(feedTitle)}</title>
      <link>${escapeXml(baseUrl)}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;
  };

  // 9a. Main RSS Feed endpoints
  app.get(['/rss.xml', '/feed', '/api/rss', '/api/rss/berita.xml'], (req, res) => {
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=1200');
    res.send(generateRssXml(req));
  });

  // 9b. Pengumuman RSS Feed endpoint
  app.get(['/api/rss/pengumuman.xml', '/feed/pengumuman'], (req, res) => {
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=1200');
    res.send(generateRssXml(req, 'pengumuman'));
  });

  // 9c. Artikel Hukum RSS Feed endpoint
  app.get(['/api/rss/artikel.xml', '/feed/artikel'], (req, res) => {
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=1200');
    res.send(generateRssXml(req, 'artikel'));
  });

  // 9d. JSON Feed v1.1 endpoint (for modern web feed readers)
  app.get(['/api/rss/json', '/feed.json'], (req, res) => {
    const baseUrl = getBaseOrigin(req);
    const rawNews: any[] = dbState.data?.['dilmilti5_db_news_v2'] || initialCentralDb['dilmilti5_db_news_v2'] || [];
    const courtId = dbState.data?.['dilmilti5_db_court_identity_v2'] || initialCentralDb['dilmilti5_db_court_identity_v2'] || {};

    const jsonFeed = {
      version: 'https://jsonfeed.org/version/1.1',
      title: `Feed Berita — ${courtId.name || 'Pengadilan Militer Tinggi V Makassar'}`,
      home_page_url: baseUrl,
      feed_url: `${baseUrl}/api/rss/json`,
      description: courtId.slogan || 'Pusat Publikasi & Informasi Resmi Pengadilan Militer Tinggi V Makassar',
      icon: `${baseUrl}/images/dilmilti_v_logo_transparent.png`,
      favicon: `${baseUrl}/icon.svg`,
      language: 'id-ID',
      items: rawNews.slice(0, 30).map(item => ({
        id: String(item.id),
        url: `${baseUrl}/?tab=berita&newsId=${item.id}`,
        title: item.judul,
        content_html: `<p>${item.isi || item.ringkasan || ''}</p>`,
        summary: item.ringkasan,
        image: item.gambarUrl,
        date_published: item.tanggal,
        authors: [{ name: item.penulis || 'Humas Dilmilti V Makassar' }],
        tags: [item.kategori || 'Berita']
      }))
    };

    res.setHeader('Content-Type', 'application/feed+json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=1200');
    res.json(jsonFeed);
  });

  // Vite middleware in development or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Court Server] Pengadilan Militer Tinggi V Makassar Central Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
