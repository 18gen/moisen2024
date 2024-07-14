"use client";

import { useState } from "react";
import Modal from "./components/Modal";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-2 rounded-full shadow-lg">
        <button 
          className="bg-transparent text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2"
          onClick={openModal}
        >
          <img src="/mic.png" alt="mic" className="h-6 w-6" />
          <span>録音を始める</span>
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
