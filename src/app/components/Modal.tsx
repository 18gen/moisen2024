import "@/styles/globals.css";
import "@/styles/custom.css";
import 'flowbite';
import { useState, useRef, useEffect } from 'react';
import Summarization from './Summarization';
import AudioRecorder from './AudioRecorder';
import axios from 'axios';
import Image from 'next/image';

interface ModalProps {
  isOpen: boolean;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  onClose: () => void;
  onProceed: (data: { inputText: string, recordedText: string }) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, isRecording, setIsRecording, onClose, onProceed }) => {
  const [inputValue, setInputValue] = useState("");
  const [showSecondTextArea, setShowSecondTextArea] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [recordedText, setRecordedText] = useState("");
  const [summarizedText, setSummarizedText] = useState({
    forDoctor: { subject: '', object: '', assessment: '', plan: '' },
    forPatient: { diagnosis: '', lifestyle: '', prescription: '' }
  });
  const audioRecorderRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && isRecording) {
      audioRecorderRef.current.startRecording();
    }
  }, [isOpen, isRecording]);

  const handleProceed = async () => {
    if (currentStep === 1) {
      setShowSecondTextArea(true);
      setCurrentStep(2);
      audioRecorderRef.current.stopRecording();
    } else if (currentStep === 2) {
      setCurrentStep(3);
      try {
        const response = await axios.post('/api/summarize', { text: inputValue });
        const summary = response.data.summaries;
        console.log("summary here !!!", summary);
        setSummarizedText(summary);
      } catch (error) {
        console.error('Error during summarization:', error);
      }
    } else {
      onProceed({ inputText: inputValue, recordedText });
      handleReset();
    }
  };

  const handleReset = () => {
    setInputValue("");
    setShowSecondTextArea(false);
    setCurrentStep(1);
    onClose();
  };

  const handleStopRecording = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const transcription = response.data.transcription;
      setRecordedText(transcription || ""); // Set to empty string if no transcription
    } catch (error) {
      console.error('Error uploading audio:', error);
      setRecordedText(""); // Ensure recordedText is empty on error
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-gray-200 p-6 rounded-lg shadow-lg w-5/6 max-w-5/6 h-5/6 flex flex-col items-center">
        {typeof window !== 'undefined' && <AudioRecorder ref={audioRecorderRef} onStop={handleStopRecording} />}
        <div className="flex items-center justify-between w-full flex-wrap mb-4">
          <ol className="flex items-center w-full sm:w-3/5 text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base mb-4 sm:mb-0">
            <li className={`flex md:w-full items-center ${currentStep >= 1 ? 'text-blue-600 dark:text-blue-500' : ''} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
              <span className={`flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500 whitespace-nowrap ${currentStep >= 1 ? 'after:text-blue-400 dark:after:text-blue-500' : ''}`}>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
                録音
              </span>
            </li>
            <li className={`flex md:w-full items-center ${currentStep >= 2 ? 'text-blue-600 dark:text-blue-500' : ''} after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
              <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500 whitespace-nowrap">
                <span className="me-2">2</span>
                編集
              </span>
            </li>
            <li className={`flex md:w-full items-center ${currentStep >= 3 ? 'text-blue-600 dark:text-blue-500' : ''}`}>
              <span className="me-2">3</span>
              送信
            </li>
          </ol>
          <button 
            className="text-gray-500 hover:text-gray-700 text-xl leading-none flex top-0 right-0"
            onClick={handleReset}
          >
            <span className="whitespace-nowrap text-sm ml-1">キャンセルして閉じる</span>
          </button>
        </div>
        {currentStep == 1  && (
        <h2 className="text-gradient text-xl text-bold text-center p-2">会話を録音しています...</h2>
        )}
        {currentStep == 2  && (
        <h2 className="text-gradient text-xl text-bold text-center p-2">内容確認後、要約開始！</h2>
        )}
        {currentStep < 3 ? (
          <div className="mt-4 flex flex-col space-y-4 items-center w-full">
            <div className="bg-white p-4 rounded-lg shadow-md w-full flex flex-col items-center">
              <h2 className="text-gray-500 text-xl mb-4">診療メモ</h2>
              <textarea 
                className="w-full h-full border border-transparent rounded p-2 text-slate-900"
                placeholder="ここに会話以外の内容を入力してください..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            {showSecondTextArea && (
              <div className="bg-white p-4 rounded-lg shadow-md w-full flex flex-col items-center">
                <h2 className="text-gray-500 text-xl mb-4">録音内容</h2>
                <textarea 
                  className="w-full h-full border border-transparent rounded p-2 text-slate-900"
                  placeholder="会話の内容はここに表示されます..."
                  value={recordedText}
                  readOnly
                />
              </div>
            )}
          </div>
        ) : (
          <Summarization recordedText={recordedText} summarizedText={summarizedText} inputText={inputValue} onReset={handleReset} />
        )}
        
        <div className="mt-6 relative">
          <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-2 rounded-full shadow-lg">
            <button
              className="bg-transparent text-white font-bold py-1 px-5 rounded-full flex items-center space-x-2"
              onClick={() => {
                if (currentStep === 1) {
                  audioRecorderRef.current.stopRecording();
                  setIsRecording(false);
                }
                handleProceed();
              }}
            >
              {currentStep < 3 ? (
                currentStep === 1 ? (
                  <>
                    <Image src="/stop.png" alt="stop" width={20} height={20} />
                    <span className="whitespace-nowrap">録音停止</span>
                  </>
                ) : (
                  <span className="whitespace-nowrap">要約する</span>
                )
              ) : (
                <span className="whitespace-nowrap">保存する</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
