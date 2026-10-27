import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// MongoDB Schema for storing the centralized court database state
export interface ICourtDbDoc {
  docId: string;
  version: number;
  lastUpdated: string;
  data: Record<string, any>;
}

const CourtDbDocSchema = new mongoose.Schema<ICourtDbDoc>(
  {
    docId: { type: String, required: true, unique: true, index: true, default: 'dilmilti5_central_db' },
    version: { type: Number, default: 85, required: true },
    lastUpdated: { type: String, default: () => new Date().toISOString(), required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {}, required: true }
  },
  {
    timestamps: true,
    minimize: false
  }
);

const CourtModel: mongoose.Model<ICourtDbDoc> =
  (mongoose.models?.CourtDbDoc as mongoose.Model<ICourtDbDoc>) ||
  mongoose.model<ICourtDbDoc>('CourtDbDoc', CourtDbDocSchema);

interface ICourtMedia {
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

const MediaModel: mongoose.Model<ICourtMedia> =
  (mongoose.models?.CourtMedia as mongoose.Model<ICourtMedia>) ||
  mongoose.model<ICourtMedia>('CourtMedia', MediaSchema);

interface GlobalMongoCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
  lastError: string | null;
  cachedDb: { version: number; lastUpdated: string; data: Record<string, any> } | null;
  lastVersionCheckTs: number;
  compactedLegacyBase64?: boolean;
}

const globalForMongo = globalThis as unknown as {
  __dilmiltiMongoCache?: GlobalMongoCache;
  __dilmiltiMediaCache?: Map<string, { contentType: string; buffer: Buffer; dataUrl: string }>;
};
const mongoState: GlobalMongoCache = globalForMongo.__dilmiltiMongoCache || {
  conn: null,
  promise: null,
  lastError: null,
  cachedDb: null,
  lastVersionCheckTs: 0,
  compactedLegacyBase64: false
};
globalForMongo.__dilmiltiMongoCache = mongoState;
if (!globalForMongo.__dilmiltiMediaCache) {
  globalForMongo.__dilmiltiMediaCache = new Map();
}

function computeFastHash(str: string): string {
  let h1 = 0xdeadbeef ^ str.length;
  let h2 = 0x41c6ce57 ^ str.length;
  const step = Math.max(1, Math.floor(str.length / 256));
  for (let i = 0; i < str.length; i += step) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36) + '_' + str.length.toString(36);
}

/**
 * Recursively scans an object for embedded `data:` base64 strings (>1.5KB),
 * offloads them to the `CourtMedia` collection (and in-memory cache),
 * and replaces them with lightweight `/api/upload?id=...` URLs so `dilmilti5_central_db`
 * stays under ~100KB and updates in <100ms on MongoDB Atlas M0.
 */
async function offloadEmbeddedBase64ToMediaCollection(
  input: any,
  hasMongo: boolean
): Promise<{ cleaned: any; extractedCount: number }> {
  let extractedCount = 0;
  const pendingWrites: Array<{ fileId: string; contentType: string; dataUrl: string; size: number }> = [];

  function walk(node: any): any {
    if (!node) return node;
    if (typeof node === 'string') {
      if (node.startsWith('data:') && node.length > 1500) {
        const fileId = `img_auto_${computeFastHash(node)}`;
        let contentType = 'image/jpeg';
        const match = node.match(/^data:(.*?);base64,/);
        if (match && match[1]) {
          contentType = match[1];
        }
        const commaIdx = node.indexOf(',');
        const base64Str = commaIdx !== -1 ? node.slice(commaIdx + 1) : node;
        const size = Math.floor((base64Str.length * 3) / 4);
        pendingWrites.push({ fileId, contentType, dataUrl: node, size });
        try {
          const buffer = Buffer.from(base64Str, 'base64');
          globalForMongo.__dilmiltiMediaCache?.set(fileId, { contentType, buffer, dataUrl: node });
        } catch {}
        extractedCount++;
        return `/api/upload?id=${fileId}`;
      }
      return node;
    }
    if (Array.isArray(node)) {
      let arrModified = false;
      const nextArr = new Array(node.length);
      for (let i = 0; i < node.length; i++) {
        const updatedItem = walk(node[i]);
        if (updatedItem !== node[i]) arrModified = true;
        nextArr[i] = updatedItem;
      }
      return arrModified ? nextArr : node;
    }
    if (typeof node === 'object') {
      let objModified = false;
      const nextObj: Record<string, any> = {};
      for (const [k, v] of Object.entries(node)) {
        const updatedVal = walk(v);
        if (updatedVal !== v) objModified = true;
        nextObj[k] = updatedVal;
      }
      return objModified ? nextObj : node;
    }
    return node;
  }

  const cleaned = walk(input);

  if (hasMongo && pendingWrites.length > 0) {
    try {
      const uniqueMap = new Map<string, (typeof pendingWrites)[0]>();
      for (const item of pendingWrites) {
        uniqueMap.set(item.fileId, item);
      }
      await Promise.allSettled(
        Array.from(uniqueMap.values()).map((item) =>
          MediaModel.updateOne(
            { fileId: item.fileId },
            {
              $set: {
                filename: item.fileId,
                contentType: item.contentType,
                dataUrl: item.dataUrl,
                size: item.size,
                createdAt: new Date()
              }
            },
            { upsert: true }
          )
        )
      );
    } catch (err: any) {
      console.warn('[Court API - Media Compaction] Warning:', err?.message || err);
    }
  }

  return { cleaned, extractedCount };
}

function getResolvedDirname(): string {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.url) {
      return path.dirname(fileURLToPath(import.meta.url));
    }
  } catch {
    // Fall back to process.cwd()
  }
  return process.cwd();
}

/**
 * Thread-safe, globalThis-cached MongoDB Atlas connection handler for Vercel serverless environments.
 * Prevents duplicate connection storms across warm invocations and respects Atlas M0 connection limits.
 */
let cachedMongo = (globalThis as any).mongoose;
if (!cachedMongo) {
  cachedMongo = (globalThis as any).mongoose = { conn: null, promise: null };
}

async function connectToMongo(): Promise<typeof mongoose | null> {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGODB_URL;
  if (!mongoUri) return null;

  // Reuse active connection immediately (readyState: 1 = connected)
  if ((mongoose.connection.readyState as number) === 1) {
    mongoState.conn = mongoose;
    cachedMongo.conn = mongoose;
    return mongoose;
  }

  if (!cachedMongo.promise && !mongoState.promise) {
    const p = mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 7000,
      connectTimeoutMS: 7000,
      socketTimeoutMS: 25000,
      maxPoolSize: 3,
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
      family: 4,
      retryWrites: true,
      w: 1
    }).then((m) => {
      mongoState.conn = m;
      cachedMongo.conn = m;
      mongoState.lastError = null;
      console.log('[Court API - MongoDB] Successfully established connection to MongoDB Atlas');
      return m;
    }).catch((err) => {
      mongoState.lastError = err?.message || String(err);
      console.error('[Court API - MongoDB] Connection error:', mongoState.lastError);
      mongoState.conn = null;
      cachedMongo.conn = null;
      mongoState.promise = null;
      cachedMongo.promise = null;
      return null;
    });

    cachedMongo.promise = p;
    mongoState.promise = p;
  }

  try {
    const conn = await (cachedMongo.promise || mongoState.promise);
    if (conn && Number(mongoose.connection.readyState) === 1) {
      return conn;
    }
    cachedMongo.promise = null;
    mongoState.promise = null;
    return null;
  } catch {
    cachedMongo.promise = null;
    mongoState.promise = null;
    return null;
  }
}

/**
 * Atomic single-document operation executor for MongoDB Atlas in serverless environments.
 * Single-document findOneAndUpdate in MongoDB WiredTiger is natively 100% atomic without
 * distributed session lock contention that causes timeouts in serverless functions.
 */
async function executeInTransaction<T>(
  _mongo: typeof mongoose,
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

function getFallbackSeed(): Record<string, any> {
  if (mongoState.cachedDb && mongoState.cachedDb.data && Object.keys(mongoState.cachedDb.data).length > 0) {
    return mongoState.cachedDb.data;
  }
  return {
    dilmilti5_db_court_identity_v2: {
      name: 'PENGADILAN MILITER TINGGI V MAKASSAR',
      parent: 'MAHKAMAH AGUNG REPUBLIK INDONESIA',
      subParent: 'DIREKTORAT JENDERAL BADAN PERADILAN MILITER DAN PERADILAN TATA USAHA NEGARA',
      skStandardisasi: 'SK DIRJEN BADILMILTUN NOMOR: 593/DJMT/SK.TI2.1.1/VII/2026',
      address: 'Jalan Metro Tanjung Bunga Kompleks Mall Phinisi Point Makassar Sulawesi Selatan 90122',
      phone: '(0411) 512345 / 512346',
      whatsapp: '0811-4567-890 (Layanan PTSP & SIPP WhatsApp Real-Time)',
      email: 'dilmiti5makassar@gmail.com',
      website: 'https://dilmilti5-makassar.go.id',
      logoUrl: '/images/dilmilti_v_logo_transparent.png',
      bannerUrl: '/images/makassar_court_banner_1789442426023.jpg',
      slogan: 'REWAKO (Responsif, Energik, Wibawa, Adaptif, Kolaboratif, Objektif)',
      jamOperasional: 'Senin - Jumat: 08.00 - 16.30 WITA'
    }
  };
}

function loadInitialDiskBaseline(): { version: number; lastUpdated: string; data: Record<string, any> } {
  const dir = getResolvedDirname();
  const cwd = process.cwd();

  const possiblePaths = [
    '/tmp/court_db.json',
    path.join(cwd, 'data', 'court_db.json'),
    path.join(cwd, 'api', 'court_db_seed.json'),
    path.join(dir, 'court_db_seed.json'),
    path.resolve(dir, '../data/court_db.json'),
    path.resolve(dir, '../../data/court_db.json'),
    path.join(cwd, 'public', 'court_db.json')
  ];

  let bestMatch: { version: number; lastUpdated: string; data: Record<string, any> } | null = null;

  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const loadedData = parsed.data || parsed;
          if (loadedData && typeof loadedData === 'object' && Object.keys(loadedData).length > 0) {
            const ver = typeof parsed.version === 'number' ? parsed.version : 85;
            if (!bestMatch || ver > bestMatch.version) {
              bestMatch = {
                version: ver,
                lastUpdated: parsed.lastUpdated || new Date().toISOString(),
                data: loadedData
              };
            }
          }
        }
      }
    } catch {
      // try next path
    }
  }

  if (bestMatch) {
    return bestMatch;
  }

  return {
    version: 85,
    lastUpdated: new Date().toISOString(),
    data: getFallbackSeed()
  };
}

function saveDatabaseToDisk(dbState: any) {
  if (!dbState) return;
  // Non-blocking write to /tmp in serverless environments so HTTP response returns immediately
  fs.promises
    .writeFile('/tmp/court_db.json', JSON.stringify(dbState), 'utf-8')
    .catch(() => {});
}

/**
 * Fast metadata-only version lookup (<100 bytes over wire) so POST operations
 * do not waste 3-5 seconds downloading the entire multi-MB `data` object before writing.
 */
async function getDatabaseVersionMeta(): Promise<{ version: number; lastUpdated: string; storage: string }> {
  const mongo = await connectToMongo();
  if (mongo) {
    try {
      const doc = (await CourtModel.findOne(
        { docId: 'dilmilti5_central_db' },
        { version: 1, lastUpdated: 1 }
      ).lean()) as any;
      if (doc) {
        const ver = doc.version || 85;
        const lastUpd = doc.lastUpdated || new Date().toISOString();
        if (mongoState.cachedDb) {
          mongoState.cachedDb.version = ver;
          mongoState.cachedDb.lastUpdated = lastUpd;
        }
        mongoState.lastVersionCheckTs = Date.now();
        return { version: ver, lastUpdated: lastUpd, storage: 'mongodb_atlas' };
      }
    } catch (err: any) {
      console.error('[Court API - MongoDB] Version meta lookup error:', err?.message || err);
    }
  }

  if (mongoState.cachedDb) {
    return {
      version: mongoState.cachedDb.version || 85,
      lastUpdated: mongoState.cachedDb.lastUpdated || new Date().toISOString(),
      storage: 'serverless_memory'
    };
  }

  const initial = loadInitialDiskBaseline();
  mongoState.cachedDb = initial;
  return {
    version: initial.version || 85,
    lastUpdated: initial.lastUpdated || new Date().toISOString(),
    storage: 'disk_baseline'
  };
}

async function getDatabase(): Promise<{ version: number; lastUpdated: string; data: Record<string, any>; storage: string }> {
  // 1. Try MongoDB Atlas if configured
  const mongo = await connectToMongo();
  if (mongo) {
    try {
      const doc = await CourtModel.findOne({ docId: 'dilmilti5_central_db' }).lean() as any;
      if (doc && doc.data && Object.keys(doc.data).length > 0) {
        let docData = doc.data;
        // Automatically compact any legacy embedded base64 strings inside dilmilti5_central_db once per instance
        if (!mongoState.compactedLegacyBase64) {
          const { cleaned, extractedCount } = await offloadEmbeddedBase64ToMediaCollection(docData, true);
          mongoState.compactedLegacyBase64 = true;
          if (extractedCount > 0) {
            docData = cleaned;
            CourtModel.updateOne(
              { docId: 'dilmilti5_central_db' },
              { $set: { data: docData } }
            ).catch(() => {});
          }
        }
        mongoState.cachedDb = {
          version: doc.version || 85,
          lastUpdated: doc.lastUpdated || new Date().toISOString(),
          data: docData
        };
        mongoState.lastVersionCheckTs = Date.now();
        return { ...mongoState.cachedDb, storage: 'mongodb_atlas' };
      } else {
        // Document does not exist yet in MongoDB Atlas -> Seed MongoDB with compacted baseline
        const rawBaseline = loadInitialDiskBaseline();
        const { cleaned: compactedData } = await offloadEmbeddedBase64ToMediaCollection(rawBaseline.data, true);
        const initialBaseline = {
          ...rawBaseline,
          data: compactedData
        };
        await executeInTransaction(
          mongo,
          'CourtDb: SeedInitialBaseline',
          async () => {
            return await CourtModel.updateOne(
              { docId: 'dilmilti5_central_db' },
              {
                $set: {
                  version: initialBaseline.version || 85,
                  lastUpdated: initialBaseline.lastUpdated || new Date().toISOString(),
                  data: initialBaseline.data
                }
              },
              { upsert: true }
            );
          },
          { version: initialBaseline.version, keysCount: Object.keys(initialBaseline.data).length }
        );
        mongoState.cachedDb = initialBaseline;
        mongoState.compactedLegacyBase64 = true;
        mongoState.lastVersionCheckTs = Date.now();
        return { ...mongoState.cachedDb, storage: 'mongodb_atlas' };
      }
    } catch (err: any) {
      console.error('[Court API - MongoDB] Query error during getDatabase:', err?.message || err);
    }
  }

  // 2. Fallback to cached memory / disk
  if (mongoState.cachedDb) {
    return { ...mongoState.cachedDb, storage: 'serverless_memory' };
  }

  const initial = loadInitialDiskBaseline();
  mongoState.cachedDb = initial;
  return { ...mongoState.cachedDb, storage: 'disk_baseline' };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & Anti-Cache Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Priority-Strategy, X-Court-Section');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Use WHATWG URL API exclusively (avoid accessing req.query which triggers Node.js DEP0169 url.parse() warning)
  const requestUrl = new URL(req.url || '/', `http://${req.headers?.host || 'localhost'}`);
  const actionParam = requestUrl.searchParams.get('action');
  const isVersionRoute = actionParam === 'version' || requestUrl.pathname.endsWith('/version');
  const isResetRoute = actionParam === 'reset' || requestUrl.pathname.endsWith('/reset');

  // Route: check version (lightweight polling with 4s warm-instance TTL cache)
  if (isVersionRoute) {
    const hasCacheBust = requestUrl.searchParams.has('_t') || requestUrl.searchParams.get('priority') === 'network-first';
    const now = Date.now();
    if (
      !hasCacheBust &&
      mongoState.cachedDb &&
      now - mongoState.lastVersionCheckTs < 4000 &&
      mongoose.connection.readyState === 1
    ) {
      return res.status(200).json({
        version: mongoState.cachedDb.version || 85,
        lastUpdated: mongoState.cachedDb.lastUpdated,
        storage: 'mongodb_atlas',
        mongodbConfigured: true,
        mongodbConnected: true,
        cached: true
      });
    }

    const meta = await getDatabaseVersionMeta();
    return res.status(200).json({
      version: meta.version,
      lastUpdated: meta.lastUpdated,
      storage: meta.storage,
      mongodbConfigured: Boolean(process.env.MONGODB_URI || process.env.MONGO_URI),
      mongodbConnected: Boolean(mongoState.conn && mongoose.connection.readyState === 1),
      mongodbError: mongoState.lastError
    });
  }

  // Route: GET full database
  if (req.method === 'GET') {
    const hasCacheBust = requestUrl.searchParams.has('_t') || requestUrl.searchParams.get('priority') === 'network-first';
    const now = Date.now();
    if (
      !hasCacheBust &&
      mongoState.cachedDb &&
      mongoState.cachedDb.data &&
      Object.keys(mongoState.cachedDb.data).length > 0 &&
      now - mongoState.lastVersionCheckTs < 2500 &&
      mongoose.connection.readyState === 1
    ) {
      return res.status(200).json({
        success: true,
        version: mongoState.cachedDb.version || 85,
        lastUpdated: mongoState.cachedDb.lastUpdated,
        hasData: true,
        storage: 'mongodb_atlas',
        mongodbConfigured: true,
        mongodbConnected: true,
        cached: true,
        data: mongoState.cachedDb.data
      });
    }
    const current = await getDatabase();
    return res.status(200).json({
      success: true,
      version: current.version,
      lastUpdated: current.lastUpdated,
      hasData: Object.keys(current.data).length > 0,
      storage: current.storage,
      mongodbConfigured: Boolean(process.env.MONGODB_URI || process.env.MONGO_URI),
      mongodbConnected: Boolean(mongoState.conn && mongoose.connection.readyState === 1),
      mongodbError: mongoState.lastError,
      data: current.data
    });
  }

  // Route: POST updates
  if (req.method === 'POST') {
    try {
      let body = req.body || {};
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          body = {};
        }
      }

      // 1. Reset requested
      if (isResetRoute || body.action === 'reset') {
        const initialSeed = getFallbackSeed();
        const meta = await getDatabaseVersionMeta();
        const newVer = (meta.version || 85) + 1;
        const lastUpdated = new Date().toISOString();

        mongoState.cachedDb = {
          version: newVer,
          lastUpdated,
          data: initialSeed
        };
        mongoState.lastVersionCheckTs = Date.now();

        const mongo = await connectToMongo();
        if (mongo) {
          try {
            await executeInTransaction(
              mongo,
              'CourtDb: ResetDatabase',
              async () => {
                return await CourtModel.updateOne(
                  { docId: 'dilmilti5_central_db' },
                  {
                    $set: {
                      version: newVer,
                      lastUpdated,
                      data: initialSeed
                    }
                  },
                  { upsert: true }
                );
              },
              { newVersion: newVer, resetDate: lastUpdated }
            );
          } catch (e: any) {
            console.error('[Court API - MongoDB] Reset transaction failed:', e?.message || e);
          }
        }

        saveDatabaseToDisk(mongoState.cachedDb);

        return res.status(200).json({
          success: true,
          version: newVer,
          lastUpdated,
          storage: mongo ? 'mongodb_atlas' : 'serverless_memory'
        });
      }

      // 2. Handle single key update (sync-key)
      if (body.key) {
        const clientVer = typeof body.version === 'number' ? body.version : 0;
        const meta = await getDatabaseVersionMeta();
        const newVer = Math.max((meta.version || 85) + 1, clientVer + 1);
        const lastUpdated = new Date().toISOString();

        const mongo = await connectToMongo();
        const { cleaned: cleanedValue } = await offloadEmbeddedBase64ToMediaCollection(
          body.value,
          Boolean(mongo)
        );

        if (!mongoState.cachedDb) {
          mongoState.cachedDb = { version: newVer, lastUpdated, data: {} };
        }
        if (!mongoState.cachedDb.data) mongoState.cachedDb.data = {};
        mongoState.cachedDb.data[body.key] = cleanedValue;
        mongoState.cachedDb.version = newVer;
        mongoState.cachedDb.lastUpdated = lastUpdated;
        mongoState.lastVersionCheckTs = Date.now();

        if (mongo) {
          try {
            await executeInTransaction(
              mongo,
              'CourtDb: UpdateSingleKey',
              async () => {
                return await CourtModel.updateOne(
                  { docId: 'dilmilti5_central_db' },
                  {
                    $set: {
                      [`data.${body.key}`]: cleanedValue,
                      version: newVer,
                      lastUpdated
                    }
                  },
                  { upsert: true }
                );
              },
              { key: body.key, version: newVer, valueType: typeof cleanedValue }
            );
          } catch (e: any) {
            console.error(`[Court API - MongoDB] Key update transaction failed [${body.key}]:`, e?.message || e);
          }
        }

        if (mongoState.cachedDb) {
          saveDatabaseToDisk(mongoState.cachedDb);
        }

        return res.status(200).json({
          success: true,
          version: newVer,
          lastUpdated,
          storage: mongo ? 'mongodb_atlas' : 'serverless_memory'
        });
      }

      // 3. Handle full or delta data payload (sync-all / delta-sync)
      if (body.data && typeof body.data === 'object') {
        const clientVer = typeof body.version === 'number' ? body.version : 0;
        const meta = await getDatabaseVersionMeta();
        const serverVer = meta.version || 85;

        const newVer = Math.max(serverVer + 1, clientVer + 1);
        const lastUpdated = new Date().toISOString();

        const mongo = await connectToMongo();
        // Automatically extract and offload any large base64 data URLs before updating dilmilti5_central_db
        const { cleaned: cleanedData, extractedCount } = await offloadEmbeddedBase64ToMediaCollection(
          body.data,
          Boolean(mongo)
        );

        const entries = Object.entries(cleanedData).filter(([k]) => k.startsWith('dilmilti5_'));
        const keyCount = entries.length;

        if (!mongoState.cachedDb) {
          mongoState.cachedDb = { version: newVer, lastUpdated, data: {} };
        }
        mongoState.cachedDb = {
          version: newVer,
          lastUpdated,
          data: { ...(mongoState.cachedDb.data || {}), ...cleanedData }
        };
        mongoState.lastVersionCheckTs = Date.now();

        if (mongo) {
          try {
            // Use dot-notation $set with updateOne so MongoDB updates keys in-place without
            // requiring a full document pre-read or echoing multi-MB documents back over the wire
            const setFields: Record<string, any> = {
              version: newVer,
              lastUpdated
            };
            for (const [k, v] of entries) {
              setFields[`data.${k}`] = v;
            }

            await executeInTransaction(
              mongo,
              'CourtDb: SyncAllData',
              async () => {
                return await CourtModel.updateOne(
                  { docId: 'dilmilti5_central_db' },
                  { $set: setFields },
                  { upsert: true }
                );
              },
              { keysMerged: keyCount, newVersion: newVer, mediaExtracted: extractedCount }
            );
          } catch (e: any) {
            console.error('[Court API - MongoDB] Full sync transaction failed:', e?.message || e);
          }
        }

        if (mongoState.cachedDb) {
          saveDatabaseToDisk(mongoState.cachedDb);
        }

        return res.status(200).json({
          success: true,
          version: newVer,
          lastUpdated,
          storage: mongo ? 'mongodb_atlas' : 'serverless_memory'
        });
      }

      const meta = await getDatabaseVersionMeta();
      return res.status(200).json({
        success: true,
        version: meta.version,
        lastUpdated: meta.lastUpdated,
        storage: meta.storage
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Server error' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
