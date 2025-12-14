import React from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  const baseClasses = "flex items-center p-4 mb-4 rounded-lg border-l-4 shadow-sm";
  
  const typeClasses = {
    success: "bg-green-50 border-green-500 text-green-700",
    error: "bg-red-50 border-red-500 text-red-700", 
    warning: "bg-yellow-50 border-yellow-500 text-yellow-700",
    info: "bg-blue-50 border-blue-500 text-blue-700"
  };

  const icons = {
    success: <FaCheckCircle className="text-green-500" />,
    error: <FaExclamationTriangle className="text-red-500" />,
    warning: <FaExclamationTriangle className="text-yellow-500" />,
    info: <FaInfoCircle className="text-blue-500" />
  };

  if (!message) return null;

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      <div className="flex-shrink-0 mr-3">
        {icons[type]}
      </div>
      
      <div className="flex-1">
        {typeof message === 'string' ? (
          <p className="text-sm font-medium">{message}</p>
        ) : Array.isArray(message) ? (
          <ul className="text-sm font-medium list-disc list-inside space-y-1">
            {message.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm font-medium">{JSON.stringify(message)}</p>
        )}
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;