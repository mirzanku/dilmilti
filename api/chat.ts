import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import {
  buildSipintarSystemInstruction,
  generateSmartSipintarReply,
  SipintarContextData
} from '../src/utils/sipintarKnowledgeBase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { message, conversationHistory, contextData } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const ctx: SipintarContextData = contextData || {};
    const systemInstruction = buildSipintarSystemInstruction(ctx);
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY;

    if (apiKey) {
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
          promptContent += `${msg.sender === 'user' ? 'Pengguna' : 'SIPINTAR AI'}: ${msg.text}\n`;
        });
        promptContent += '\n';
      }
      promptContent += `Pertanyaan Pengguna Saat Ini: ${message}`;

      const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest'];
      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: promptContent,
            config: {
              systemInstruction
            }
          });

          const replyText = response.text?.trim();
          if (replyText) {
            return res.status(200).json({ success: true, reply: replyText, source: modelName });
          }
        } catch (genErr: any) {
          console.warn(`[Vercel Serverless] Gemini model ${modelName} error:`, genErr?.message || genErr);
        }
      }
    }

    // Intelligent context-aware response when Gemini API key is not configured or rate-limited
    const smartReply = generateSmartSipintarReply(message, ctx);
    return res.status(200).json({
      success: true,
      reply: smartReply,
      source: 'knowledge_base'
    });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e?.message || 'Server error' });
  }
}
