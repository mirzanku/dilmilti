import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  return res.status(200).json({
    status: 'ok',
    name: 'Pengadilan Militer Tinggi V Makassar API Gateway',
    timestamp: new Date().toISOString()
  });
}
