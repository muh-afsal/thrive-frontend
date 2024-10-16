import React from 'react';

interface ModalProps {
  onClose: () => void;
  onConfirm: () => void;
  size: string;
}

const ConfirmationModal: React.FC<ModalProps> = ({ onClose, onConfirm, size }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
      <div className={`bg-white p-6 rounded-lg dark:bg-dark-bg shadow-lg relative ${size}`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <div className="text-lg font-bold text-neutral-700 mb-9 dark:text-neutral-400">Are you sure to continue?</div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-neutral-400 dark:bg-neutral-500 dark:hover:bg-neutral-400 text-neutral-900 py-1 px-4 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-lg"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;