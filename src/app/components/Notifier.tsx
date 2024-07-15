import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

const LineNotifyComponent: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const notify = async (text: string): Promise<void> => {
    const response = await axios.post('/api/notify', { message: text });
    if (response.status !== 200) {
      throw new Error('Failed to send message to LINE');
    }
  };

  const handleSendToLine = async () => {
    if (!message.trim()) {
      setStatus('メッセージを入力してください');
      return;
    }

    setIsProcessing(true);
    setStatus('LINEに送信中...');

    try {
      await notify(message);
      setStatus('LINEにプッシュ通知を送信しました');
      setMessage(''); // 送信後にメッセージをクリア
    } catch (error) {
      console.error('Error sending to LINE:', error);
      setStatus('LINEへの送信中にエラーが発生しました');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">LINE通知送信</h1>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="LINEに送信するメッセージを入力してください"
      />
      <div className="flex justify-center mb-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
          onClick={handleSendToLine}
          disabled={isProcessing || !message.trim()}
        >
          {isProcessing ? '送信中...' : 'LINEに送信'}
        </button>
      </div>
      {status && <p className="text-sm text-center text-gray-600">{status}</p>}

      {/* Add the Modal component and pass the notify function */}
      <Modal
        isOpen={isModalOpen}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        onClose={() => setIsModalOpen(false)}
        onProceed={() => setIsModalOpen(false)}
        notify={notify}  {/* Pass notify function here */}
      />
    </div>
  );
};

export default LineNotifyComponent;