// pages/api/sendToLine.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const LINE_USER_ID = process.env.LINE_TARGET_PATIENT_ID;

  if (!LINE_CHANNEL_ACCESS_TOKEN || !LINE_USER_ID) {
    return res.status(500).json({ message: 'LINE configuration is missing' });
  }

  try {
    const response = await axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: LINE_USER_ID,
        messages: [
          {
            type: 'text',
            text: message
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
        }
      }
    );

    if (response.status === 200) {
      res.status(200).json({ message: 'Message sent successfully' });
    } else {
      res.status(response.status).json({ message: 'Failed to send message' });
    }
  } catch (error) {
    console.error('Error sending LINE message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
}
