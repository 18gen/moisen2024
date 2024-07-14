import React, { useState } from 'react';
import axios from 'axios';

interface Summaries {
  brief: string;
  detailed: string;
  bulletPoints: string[];
}

const SummarizeComponent: React.FC = () => {
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [summaries, setSummaries] = useState<Summaries | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');

  const summarizeText = async (text: string): Promise<Summaries> => {
    try {
      const response = await axios.post('/api/summarize', { text });
      return response.data.summaries;
    } catch (error) {
      console.error('Error summarizing text:', error);
      throw new Error('Failed to summarize text');
    }
  };

  const handleSummarize = async () => {
    if (!transcribedText) {
      setStatus('テキストが存在しません');
      return;
    }

    setIsProcessing(true);
    setStatus('要約中...');

    try {
      const result = await summarizeText(transcribedText);
      setSummaries(result);
      setStatus('要約が完了しました');
    } catch (error) {
      console.error('Error during summarization:', error);
      setStatus('要約中にエラーが発生しました');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4">
      <textarea
        className="w-full p-2 border rounded"
        rows={5}
        value={transcribedText}
        onChange={(e) => setTranscribedText(e.target.value)}
        placeholder="ここに文字起こしされたテキストを入力してください"
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSummarize}
        disabled={isProcessing || !transcribedText}
      >
        {isProcessing ? '処理中...' : '要約する'}
      </button>
      {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
      {summaries && (
        <div className="mt-4">
          <h3 className="font-bold">簡潔な要約:</h3>
          <p>{summaries.brief}</p>
          <h3 className="font-bold mt-2">詳細な要約:</h3>
          <p>{summaries.detailed}</p>
          <h3 className="font-bold mt-2">重要なポイント:</h3>
          <ul className="list-disc pl-5">
            {summaries.bulletPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SummarizeComponent;
