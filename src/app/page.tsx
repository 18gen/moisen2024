"use client";

import { useState } from "react";
import axios from 'axios';
import Modal from "./components/Modal";
import Image from 'next/image';

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSummarized, setIsSummarized] = useState(false);
  const [recordedText, setRecordedText] = useState("");
  const [inputText, setInputText] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
    setIsRecording(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const proceedToSummarization = (data: { inputText: string, recordedText: string }) => {
    setRecordedText(data.recordedText);
    setInputText(data.inputText);
    setIsSummarized(true);
  };
  const reset = () => {
    setIsSummarized(false);
    setRecordedText("");
    setInputText("");
    setIsModalOpen(false);
  };

  const notify = async (message: string): Promise<void> => {
    try {
      const response = await axios.post('/api/notify', { message });
      if (response.status !== 200) {
        throw new Error('Failed to send message to LINE');
      }
    } catch (error) {
      console.error('Error sending to LINE:', error);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-2 rounded-full shadow-lg">
        <button 
          className="bg-transparent text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2"
          onClick={openModal}
        >
          <Image src="/mic.png" alt="mic" width={24} height={24} />
          <span>録音を始める</span>
        </button>
      </div>
      <Modal 
        isOpen={isModalOpen} 
        isRecording={isRecording} 
        setIsRecording={setIsRecording}
        onClose={closeModal} 
        onProceed={proceedToSummarization} 
        notify={notify}
        isSummarized={isSummarized}
        recordedText={recordedText}
        inputText={inputText}
        onReset={reset}
      />
    </div>
  );
}
