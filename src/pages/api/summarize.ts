import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export type Summaries = {
  forDoctor: string;
  forPatient: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { transcribedText, text } = req.body;

    if ((!text && !transcribedText) || (text === undefined && transcribedText === undefined)) {
      return res.status(400).json({ message: 'Invalid or missing text in the request body' });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that provides multiple summaries of text." },
          {
            role: "user", content: `
            あなたはクリニックの整形外科医です。診察の会話記録とあなたの医療ノートから、あなた自身とクリニックの他の医師に対してわかりやすい要約を日本語で提供してください。
            それぞれの項目は行で分けてください。

            forDoctor:
            Subject（主観的情報）
            Object（客観的情報）
            Assessment（評価）
            Plan（計画・治療）

            forPatient:
            診断内容
            過ごし方
            処方箋

            文章
            ${transcribedText}
            ${text}

            回答は以下のJSON形式で提供してください：
            {
              "forDoctor": "ここに forDoctor 向けの要約を書いてください",
              "forPatient": "ここに forPatient 向けの要約を書いてください"
            }`
          }
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
    console.log("response here", response);
    if (response.status !== 200) {
      throw new Error(`OpenAI API responded with status ${response.status}: ${response.statusText}`);
    }

    const summaryContent = response.data.choices[0]?.message?.content?.trim();
    if (!summaryContent) {
      throw new Error("Invalid response from OpenAI API");
    }

    let summaries: Summaries;
    try {
      summaries = JSON.parse(summaryContent);

      if (typeof summaries.forDoctor !== 'string' || typeof summaries.forPatient !== 'string') {
        throw new Error("Invalid summary format.");
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
    res.status(500).json({ message: error.message });
  }
}
