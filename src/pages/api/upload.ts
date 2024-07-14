// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * アップロードと文字起こしをおこなうAPI
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 音声アップロード

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await new Promise<[formidable.Fields<string>, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = Array.isArray(files.audio) ? files.audio[0] : files.audio;
    if (!file) {
      return res.status(400).json({ message: 'No audio file uploaded' });
    }

    const fileName = `audio_${Date.now()}${path.extname(file.originalFilename || '')}`;
    const filePath = path.join(uploadDir, fileName);
    await fs.rename(file.filepath, filePath);

    // 文字起こし

    // ファイルを読み込む
    const fileBuffer = await fs.readFile(filePath);

    // ChatGPTに送信するためのFormDataを作成
    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: fileName,
      contentType: file.mimetype || 'audio/webm',
    });
    formData.append('model', 'whisper-1');

    // プロンプトを追加（文字列リテラル）
    formData.append('prompt', 'この音声を日本語に文字起こししてください。');

    console.log(process.env.OPENAI_API_KEY);
    // ChatGPT APIを呼び出し
    const openaiResponse = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    // アップロードしたファイルを削除
    // await fs.unlink(filePath);

    res.status(200).json({
      message: 'File uploaded and transcribed successfully',
      transcription: openaiResponse.data.text,
    });
  } catch (error) {
    console.error('Error processing upload and transcription:', error);
    res.status(500).json({ message: 'Error processing upload and transcription' });
  }
}
