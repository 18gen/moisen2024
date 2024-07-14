import './styles/tailwind.css';
import React from 'react';

const FrontPage: React.FC = () => {
  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-2 rounded-full shadow-lg">
        <button className="bg-transparent text-white font-bold py-2 px-4 rounded-full">
          録音を始める
        </button>
      </div>
      <div className="mt-8 flex space-x-4">
        <div className="bg-white p-4 rounded-lg shadow-md w-96 h-64 flex items-center justify-center">
          <h2 className="text-gray-500 text-center text-xl">会話記録</h2>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md w-96 h-64 flex items-center justify-center">
          <h2 className="text-gray-500 text-center text-xl">電子カルテに入力した内容</h2>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
