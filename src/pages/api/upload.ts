// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // 修正: ファイルの取得方法を変更
    const file = Array.isArray(files.audio) ? files.audio[0] : files.audio;

    if (!file) {
      return res.status(400).json({ message: 'No audio file uploaded' });
    }

    const fileName = `audio_${Date.now()}${path.extname(file.originalFilename || '')}`;
    const newPath = path.join(uploadDir, fileName);

    await fs.rename(file.filepath, newPath);

    res.status(200).json({ message: 'File uploaded successfully', filename: fileName });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ message: 'Error processing upload' });
  }
}
