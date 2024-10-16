import React from 'react';

interface ModalProps {
  onClose: () => void;
  size: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children, size }) => {
  return (
    <div className="fixed inset-0 flex  items-center justify-center z-50 bg-black bg-opacity-75">
      <div className={`bg-white p-6 rounded-lg dark:bg-dark-bg shadow-lg relative ${size}`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
