import React, { useEffect } from "react";
import { X } from "lucide-react";

const ContactModal = ({ onClose }) => {
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
          <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
          {/* <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button> */}
        </div>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Company:</p>
            <p>Celagenex Research (India) Pvt. Ltd.</p>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Floor:</p>
            <p>6th Floor, Bellona Building, Hiranandani Estate, Thane, Mumbai - 400607</p>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Email:</p>
            <p>cheerfol2@gmail.com</p>
          </div>
          <button
            className="w-full mt-6 px-4 py-2 bg-[#F7941C] text-white rounded-lg active:bg-[#F7941C]/70"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;