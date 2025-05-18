import { CLIENT_API } from "@/axios";
import { config } from "@/common/configuratoins";
import { RootState } from "@/redux/store";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProVersionPayment: React.FC = () => {
  const { data } = useSelector((state: RootState) => state.user);
  const [message, setMessage] = useState<string>("");
  const [refresh, SetRefresh] = useState<boolean>(false);
  const navigate = useNavigate();
  
  
  const handleProceedToPayment = async () => {
    SetRefresh((prev)=>!prev)
    try {
      const stripe = await loadStripe(
        "pk_test_51PxMNgAfLu7cproEGr2rMOWPdIQJ6m8KSx7A2IC0yMXuo76r3mzaQVOB3ouZ13p0Np4RLDxVwQaZiEiF5SeNhyin00m0bIwHrJ"
      );

      const payload = {
        userId: data?._id,
        email: data?.email,
      };

      const response = await CLIENT_API.post(
        "/payment/create-checkout-session",
        payload,
        config
      );

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
      setMessage("An error occurred while processing your payment.");
    }
  };

  const handleFreeVersionClick = () => {
    navigate("/home");
  };

  useEffect(() => {
    if (message) {
      toast.error(message);
    }
  }, [message,refresh]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-[60%] h-[75%] gap-2 dark:bg-neutral-900 flex rounded-xl shadow-[0px_0px_20px_1px_#00000024] mt-[-50px]">
        <div className="h-full w-[50%] dark:text-white dark:hover:bg-thirve-blue hover:bg-thirve-blue hover:text-white dark:bg-neutral-800 transition duration-300 rounded-xl flex flex-col justify-center items-center px-7">
          <h1 className="text-3xl font-bold text-center mb-6">Free Version</h1>
          <p className="text-lg text-center mb-8">
            In the free version you get all basic features including quick
            actions, chat, meetings, blog
          </p>

          <div className="border dark:border-neutral-700 border-neutral-300 w-full rounded-lg p-4 mb-8">
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <ul className="list-disc list-inside">
              <li>Unlimited access to all features</li>
              <li>Unlimited access to chat</li>
              <li>Unlimited access to call</li>
              <li>Unlimited access to Blog</li>
              <li>Access to video feature</li>
              <li>Access to Project Management</li>
            </ul>
          </div>

          <button
            onClick={handleFreeVersionClick}
            className="bg-blue-400 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-600 transition-colors duration-300"
          >
            Continue with Free Version
          </button>
        </div>

        <div className="h-full w-[50%] dark:hover:bg-thirve-blue hover:bg-thirve-blue hover:text-white transition duration-300 dark:bg-neutral-800 dark:text-white rounded-xl flex flex-col justify-center items-center px-7">
          <h1 className="text-3xl font-bold text-center mb-6">
            Go Pro with Our Application
          </h1>
          <p className="text-lg text-center mb-8">
            Unlock all the premium features with the Pro version of our app.
            Enjoy advanced tools, priority support, and much more!
          </p>

          <div className="border dark:border-neutral-700 border-neutral-300 w-full rounded-lg p-4 mb-8">
            <h2 className="text-2xl font-bold mb-2">Pro Plan</h2>
            <ul className="list-disc list-inside">
              <li>Unlimited access to all features</li>
              <li>Priority customer support</li>
              <li>Access to event feature</li>
            </ul>
            <p className="text-xl font-semibold mt-4">Price: 1499₹/-</p>
          </div>

          <button
            onClick={handleProceedToPayment}
            className="bg-blue-400 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-600 transition-colors duration-300"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProVersionPayment;
