import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();

  const handleRetryPayment = () => {
    navigate('/payment'); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100">
      <h1 className="text-4xl font-bold text-red-600 mb-6">Payment Failed</h1>
      <p className="text-lg text-gray-700 mb-8">Something went wrong with your transaction. Please try again.</p>
      <button
        onClick={handleRetryPayment}
        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
      >
        Retry Payment
      </button>
    </div>
  );
};

export default PaymentFailure;
