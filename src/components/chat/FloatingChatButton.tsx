import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import MedicalChatbot from './MedicalChatbot';

const FloatingChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
          <div className="bg-white rounded-lg shadow-xl w-[400px] h-[600px] overflow-hidden">
            <MedicalChatbot />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white rounded-full p-4 hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
          <span className="font-medium">Chat with AI</span>
        </button>
      )}
    </div>
  );
};

export default FloatingChatButton; 