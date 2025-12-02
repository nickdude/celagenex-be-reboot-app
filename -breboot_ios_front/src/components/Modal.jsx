import React, { useEffect } from "react";
import { X } from "lucide-react";

const ConsentModal = ({ onAction, title, subtitleOne, subtitleTwo, action }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <div className="bg-white rounded-xl p-6 w-80 shadow-lg text-center">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">{subtitleOne}</p>
        <p className="text-sm text-gray-600 mt-2">{subtitleTwo}</p>
        {/* Buttons */}
        <div className="flex flex-col justify-between gap-4 mt-6">
          <button
            className="px-4 py-2 bg-[#F7941C] text-white rounded-lg active:bg-[#F7941C]/70"
            onClick={() => onAction(true)}
          >
            {action}
          </button>
          <button
            className="px-4 py-2 border border-gray-400 active:bg-gray-200 text-gray-500 rounded-lg"
            onClick={() => onAction(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// New FormModal component for forms and other content
const FormModal = ({ title, onClose, children }) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Handle click outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export { ConsentModal, FormModal };