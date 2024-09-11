import { CLIENT_API } from '@/axios';
import { config } from '@/common/configuratoins';
import { RootState } from '@/redux/store';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ProVersionPayment: React.FC = () => {
  const { data } = useSelector((state: RootState) => state.user);
  const [message, setMessage] = useState<string>(''); 
  const handleProceedToPayment = async () => {
    try {
      const stripe = await loadStripe(
        "pk_test_51PxMNgAfLu7cproEGr2rMOWPdIQJ6m8KSx7A2IC0yMXuo76r3mzaQVOB3ouZ13p0Np4RLDxVwQaZiEiF5SeNhyin00m0bIwHrJ"
      );

      const payload = {
        userId: data?._id,
        email: data?.email,
      };

      const response = await CLIENT_API.post('/user/create-checkout-session', payload, config);

      console.log(response);
      
      if (response?.data?.error) {
        setMessage(response.data.error);
        return;
      }

      if (stripe && response?.data?.id) {
        stripe.redirectToCheckout({
          sessionId: response?.data?.id,
        });
      }
    } catch (error) {
      setMessage('An error occurred while processing your payment.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black bg-opacity-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Go Pro with Our Application
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Unlock all the premium features with the Pro version of our app. Enjoy advanced tools, priority support,
          and much more!
        </p>

        <div className="border border-gray-200 rounded-lg p-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Pro Plan</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>Unlimited access to all features</li>
            <li>Priority customer support</li>
            <li>Access to exclusive content</li>
            <li>Access to video feature</li>
          </ul>
          <p className="text-xl font-semibold text-gray-800 mt-4">Price: 1499₹/-</p>
        </div>

        <button
          onClick={handleProceedToPayment}
          className="bg-blue-500 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-600 transition-colors duration-300"
        >
          Proceed to Payment
        </button>

        {message && (
          <p className="text-red-500 text-center mt-4">{message}</p> 
        )}
      </div>
    </div>
  );
};

export default ProVersionPayment;
