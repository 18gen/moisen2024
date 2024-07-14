import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-5/6 flex flex-col items-center">
        <h2 className="text-sm mb-4 text-slate-900">録音中、、、</h2>
        <div className="mt-8 flex flex-col space-y-4 items-center w-full">
          <div className="bg-white p-4 rounded-lg shadow-md w-5/6 h-64 flex flex-col items-center">
            <h2 className="text-gray-500 text-center text-xl mb-4">会話記録</h2>
            <textarea 
              className="w-full h-full border border-gray-300 rounded p-2 text-slate-900"
              placeholder="ここにテキストを入力してください..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </div>
        <button 
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
