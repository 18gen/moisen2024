import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export type Summaries = {
  forDoctor: string;
  forPatientOrKeyPerson: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing text in the request body' });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that provides multiple summaries of text." },
          { role: "user", content: `以下の文章について、3つの異なる要約を提供してください：
1. 簡潔な要約（50文字以内）
2. 詳細な要約（200文字程度）
3. 重要なポイントを箇条書きにした要約（5点程度）

文章：${text}

回答は以下のJSON形式で提供してください：
{
  "brief": "簡潔な要約をここに",
  "detailed": "詳細な要約をここに",
  "bulletPoints": ["ポイント1", "ポイント2", "ポイント3", "ポイント4", "ポイント5"]
}` }
        ],
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const summaryContent = response.data.choices[0].message.content.trim();
    let summaries: Summaries | undefined;
    try {
      summaries = JSON.parse(summaryContent);

      if (summaries === undefined) {
        throw new Error("failed to summarize.");
      }
    } catch (error) {
      console.error('Error parsing JSON from API response:', error);
      return res.status(500).json({ message: 'Error processing API response' });
    }

    res.status(200).json({
      message: 'Text summarized successfully',
      summaries: summaries,
    });
  } catch (error) {
    console.error('Error summarizing text:', error);
    res.status(500).json({ message: 'Error summarizing text' });
  }
}
