import React, { useEffect } from "react";
import { X } from "lucide-react";

const ConfirmModal = ({
  title = "Are you sure?",
  message = "Do you really want to proceed?",
  sub="",
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel"
}) => {
  // ESC key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Backdrop click handler
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <p className="text-sm text-gray-600 mb-6">{sub}</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-[#F7941C] text-white hover:bg-[#e27c0c] transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
