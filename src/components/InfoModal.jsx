// InfoModal component - Client-side UI component
import React from 'react';

const InfoModal = ({ isOpen, onClose, type, title, message }) => {
  if (!isOpen) return null;

  const isSuccess = type === "success";
  const iconClass = isSuccess ? "text-green-500" : "text-red-500";
  const bgClass = isSuccess
    ? "bg-green-50 border-green-200"
    : "bg-red-50 border-red-200";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-300 ${bgClass} border`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center mb-4">
          <div className={`text-4xl ${iconClass}`}>
            {isSuccess ? "✅" : "❌"}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-center mb-6">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="text-white font-medium py-2 px-8 rounded-lg transition-colors duration-200"
            style={{
              background: 'linear-gradient(135deg, #00A859 0%, #007A3D 100%)'
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;