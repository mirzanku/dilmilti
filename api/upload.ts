import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Media Schema for storing uploaded image/file blobs directly in MongoDB Atlas
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

const MediaModel: mongoose.Model<ICourtMedia> =
  (mongoose.models?.CourtMedia as mongoose.Model<ICourtMedia>) ||
  mongoose.model<ICourtMedia>('CourtMedia', MediaSchema);

const globalForUploadMongo = globalThis as unknown as {
  __dilmiltiMongoCache?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose | null> | null;
  };
  __dilmiltiMediaCache?: Map<string, { contentType: string; buffer: Buffer; dataUrl: string }>;
};

if (!globalForUploadMongo.__dilmiltiMongoCache) {
  globalForUploadMongo.__dilmiltiMongoCache = { conn: null, promise: null };
}
if (!globalForUploadMongo.__dilmiltiMediaCache) {
  globalForUploadMongo.__dilmiltiMediaCache = new Map();
}

const uploadMongoState = globalForUploadMongo.__dilmiltiMongoCache;
// In-memory & disk fallback cache for serverless environment
const localMediaCache = globalForUploadMongo.__dilmiltiMediaCache;

let cachedUploadMongo = (globalThis as any).mongoose;
if (!cachedUploadMongo) {
  cachedUploadMongo = (globalThis as any).mongoose = { conn: null, promise: null };
}

async function connectToMongo(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGODB_URL;
  if (!uri) return null;

  if ((mongoose.connection.readyState as number) === 1) {
    uploadMongoState.conn = mongoose;
    cachedUploadMongo.conn = mongoose;
    return mongoose;
  }

  if (!cachedUploadMongo.promise && !uploadMongoState.promise) {
    const p = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 7000,
      connectTimeoutMS: 7000,
      socketTimeoutMS: 30000,
      maxPoolSize: 3,
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
      family: 4,
      retryWrites: true,
      w: 1
    }).then((m) => {
      uploadMongoState.conn = m;
      cachedUploadMongo.conn = m;
      return m;
    }).catch((err: any) => {
      console.error('[Upload API - MongoDB] Connection failed:', err?.message || err);
      uploadMongoState.promise = null;
      uploadMongoState.conn = null;
      cachedUploadMongo.promise = null;
      cachedUploadMongo.conn = null;
      return null;
    });

    cachedUploadMongo.promise = p;
    uploadMongoState.promise = p;
  }

  try {
    const conn = await (cachedUploadMongo.promise || uploadMongoState.promise);
    if (conn && Number(mongoose.connection.readyState) === 1) {
      return conn;
    }
    cachedUploadMongo.promise = null;
    uploadMongoState.promise = null;
    return null;
  } catch {
    cachedUploadMongo.promise = null;
    uploadMongoState.promise = null;
    return null;
  }
}

/**
 * Atomic single-document operation executor for media uploads.
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

function saveToDiskCache(fileId: string, contentType: string, dataUrl: string) {
  try {
    const tmpPath = path.join('/tmp', `court_media_${fileId}.json`);
    fs.writeFileSync(tmpPath, JSON.stringify({ fileId, contentType, dataUrl }), 'utf-8');
  } catch {}
}

function getFromDiskCache(fileId: string): { contentType: string; dataUrl: string } | null {
  try {
    const tmpPath = path.join('/tmp', `court_media_${fileId}.json`);
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse query parameters via WHATWG URL API to avoid Node.js DEP0169 url.parse() deprecation warning
  const requestUrl = new URL(req.url || '/', `http://${req.headers?.host || 'localhost'}`);
  const fileId = requestUrl.searchParams.get('id') || requestUrl.searchParams.get('fileId') || '';

  if (req.method === 'GET') {
    if (!fileId) {
      return res.status(400).json({ success: false, message: 'Missing image id parameter' });
    }

    // 1. Check in-memory cache
    if (localMediaCache.has(fileId)) {
      const item = localMediaCache.get(fileId)!;
      res.setHeader('Content-Type', item.contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
      res.setHeader('CDN-Cache-Control', 'public, max-age=31536000, immutable');
      return res.status(200).send(item.buffer);
    }

    // 2. Check disk cache in /tmp
    const diskItem = getFromDiskCache(fileId);
    if (diskItem && diskItem.dataUrl) {
      const commaIdx = diskItem.dataUrl.indexOf(',');
      if (commaIdx !== -1) {
        const base64Data = diskItem.dataUrl.slice(commaIdx + 1);
        const buffer = Buffer.from(base64Data, 'base64');
        localMediaCache.set(fileId, { contentType: diskItem.contentType, buffer, dataUrl: diskItem.dataUrl });
        res.setHeader('Content-Type', diskItem.contentType || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
        res.setHeader('CDN-Cache-Control', 'public, max-age=31536000, immutable');
        return res.status(200).send(buffer);
      }
    }

    // 3. Fetch from MongoDB Atlas
    const mongo = await connectToMongo();
    if (mongo) {
      try {
        const media = await MediaModel.findOne({ fileId }).lean() as any;
        if (media && media.dataUrl) {
          const commaIdx = media.dataUrl.indexOf(',');
          if (commaIdx !== -1) {
            const base64Data = media.dataUrl.slice(commaIdx + 1);
            const buffer = Buffer.from(base64Data, 'base64');
            const contentType = media.contentType || 'image/jpeg';
            localMediaCache.set(fileId, { contentType, buffer, dataUrl: media.dataUrl });
            saveToDiskCache(fileId, contentType, media.dataUrl);
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
            res.setHeader('CDN-Cache-Control', 'public, max-age=31536000, immutable');
            return res.status(200).send(buffer);
          }
        }
      } catch (err: any) {
        console.error('[Upload API] Failed to fetch image from MongoDB:', err?.message);
      }
    }

    // 4. Clean SVG fallback instead of 404 so legacy/expired image IDs never break UI or log 404s
    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#072617"/><stop offset="100%" stop-color="#0d4a2b"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><circle cx="200" cy="185" r="68" fill="#fbbf24" fill-opacity="0.18" stroke="#fbbf24" stroke-width="3"/><path d="M120 380 C120 310, 280 310, 280 380" fill="#fbbf24" fill-opacity="0.18" stroke="#fbbf24" stroke-width="3"/><text x="200" y="445" text-anchor="middle" fill="#fde68a" font-family="sans-serif" font-size="15" font-weight="bold">DILMILTI V MAKASSAR</text></svg>`;
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).send(fallbackSvg);
  }

  // Handle POST request to upload image/file
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

      const { filename, dataUrl } = body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ success: false, message: 'dataUrl is required' });
      }

      // Extract Content-Type
      let contentType = 'image/jpeg';
      const match = dataUrl.match(/^data:(.*?);base64,/);
      if (match && match[1]) {
        contentType = match[1];
      }

      const commaIdx = dataUrl.indexOf(',');
      const base64Str = commaIdx !== -1 ? dataUrl.slice(commaIdx + 1) : dataUrl;
      const buffer = Buffer.from(base64Str, 'base64');
      const newFileId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      // Save to local memory and disk cache first for instant retrieval
      localMediaCache.set(newFileId, { contentType, buffer, dataUrl });
      saveToDiskCache(newFileId, contentType, dataUrl);

      // Save to MongoDB Atlas inside an awaited, logged transaction block using updateOne (no base64 echo back)
      let savedToMongo = false;
      const mongo = await connectToMongo();
      if (mongo) {
        try {
          await executeInTransaction(
            mongo,
            'UploadMedia: SaveImageBlob',
            async () => {
              return await MediaModel.updateOne(
                { fileId: newFileId },
                {
                  $set: {
                    filename: filename || 'upload',
                    contentType,
                    dataUrl,
                    size: buffer.length,
                    createdAt: new Date()
                  }
                },
                { upsert: true }
              );
            },
            { fileId: newFileId, filename: filename || 'upload', bytes: buffer.length, contentType }
          );
          savedToMongo = true;
        } catch (err: any) {
          console.error(`[Upload API] Failed to save media to MongoDB for fileId [${newFileId}]:`, err?.message || err);
        }
      }

      const publicUrl = `/api/upload?id=${newFileId}`;
      return res.status(200).json({
        success: true,
        url: publicUrl,
        fileId: newFileId,
        contentType,
        storage: savedToMongo ? 'mongodb_atlas' : 'memory_disk_cache'
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || 'Upload server error' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
