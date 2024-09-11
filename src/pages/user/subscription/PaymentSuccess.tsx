import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/home'); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="text-4xl font-bold text-green-600 mb-6">Payment Successful!</h1>
      <p className="text-lg text-gray-700 mb-8">Thank you for your payment. Your transaction was successful.</p>
      <button
        onClick={handleGoToDashboard}
        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default PaymentSuccess;
