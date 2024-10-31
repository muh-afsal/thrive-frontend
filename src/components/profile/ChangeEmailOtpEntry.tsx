/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { Helmet } from "react-helmet";
import otpimage1 from '@/assets/images/otpentryimage.png';
import * as Yup from 'yup';
import { CLIENT_API } from "@/axios";
import { useNavigate } from "react-router-dom";
import { logout } from "@/redux/actions/auth/logoutUserActions";
const forgetotpSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .length(4, 'OTP must be 4 digits')
    .matches(/^\d{4}$/, 'OTP must be a valid 4-digit number'),
});

interface ForgetOtpEntryProps {
  email: string;
  onOtpVerified: () => void;
}

const ChangeEmailOtpEntry: React.FC<ForgetOtpEntryProps> = ({ email, onOtpVerified }) => {
  const [forgetotp, setForgetOtp] = useState<string[]>(["", "", "", ""]);
  const [errors, setErrors] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(120);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendSuccessMessage, setReasendSuccessMessage] = useState<string | null>(null);
  const { isLoading } = useSelector((state: RootState) => state.user);
  const { data } = useSelector((state: RootState) => state.user);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null); 
  const [currentEmail]=useState(data?.email)
  const [newEmail]=useState(email)
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();




  useEffect(() => {
    const savedExpiration = localStorage.getItem("otpExpiration");
    if (savedExpiration) {
      const expirationTime = parseInt(savedExpiration, 10);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = expirationTime - currentTime;

      if (timeLeft > 0) {
        setRemainingTime(timeLeft);
      } else {
        setErrors("OTP has expired. Please request a new one.");
      }
    } else {
      const expirationTime = Math.floor(Date.now() / 1000) + 120;
      localStorage.setItem("otpExpiration", expirationTime.toString());
    }
  }, []);

  useEffect(() => {
    if (remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current); 
      };
    } else {
      setErrors("OTP has expired. Please request a new one.");
    }
  }, [remainingTime]);

  const handleotpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.slice(0, 1);
    if (!/^[0-9]$/.test(value) && value !== "") return;

    const newOtp = [...forgetotp];
    newOtp[index] = value;
    setForgetOtp(newOtp);

    if (value && index < forgetotp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleotpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !forgetotp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Change this function to be called manually
  const handleSubmit = async () => {
    
    const otpString = forgetotp.join("");

    try {
      await forgetotpSchema.validate({ otp: otpString });
      const payload = { email, otp: otpString };
     
      const response = await CLIENT_API.post("/auth/verify-otp", payload, {
        withCredentials: true,
      });
      
      

      if (response.data.success) {
        localStorage.removeItem("otpExpiration");
        const payload={
          currentEmail,newEmail
        }
        const changeEmailResponse = await CLIENT_API.post("/auth/change-email", payload, {
          withCredentials: true,
        });
        console.log(changeEmailResponse,'ggggggggggggggggggggggggggggggggggggg');
        
        if(changeEmailResponse.data.success){
          handleLogout()
          navigate('/login')
        }

        
        onOtpVerified();
      } else if(response.data.success===false) {
        setErrors("Invalid or expired OTP. Please try again.");
      }
    } catch (validationError: unknown) {
      if (validationError instanceof Yup.ValidationError) {
        setErrors(validationError.message || "Validation failed. Please check your OTP.");
      } else {
        setErrors("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      const payload = { email };
      const response = await CLIENT_API.post('/auth/resend-otp', payload);
      setErrors('')
      
      if (response.data.success) {
        const newExpirationTime = Math.floor(Date.now() / 1000) + 120;
        localStorage.setItem("otpExpiration", newExpirationTime.toString());
        setRemainingTime(120);
        setReasendSuccessMessage("A new OTP has been sent to your email.");
      } else {
        setResendMessage("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setResendMessage("An unexpected error occurred. Please try again.");
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };


  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <Helmet>
        <title>Enter OTP - Thrive</title>
      </Helmet>
      <div>
        <div className="bg--400 flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center text-center p-4 mb-4">
            <h1 className="mb-2 font-extrabold text-2xl lg:text-3xl">Enter the OTP</h1>
            <h4 className="text-gray-400 text-sm">Please check your email for the OTP,After verification your email will be changed,and redirect to login.</h4>
            {resendSuccessMessage && <p className="text-green-600 text-sm mt-7">{resendSuccessMessage}</p>}
          </div>
          <div className="flex items-center justify-center">
            <img className="w-[60%]" src={otpimage1} alt="OTP Entry" />
          </div>
          <div className="flex w-[90%] md:w-[400px] flex-col justify-center items-center text-center">
            <form className="flex flex-col gap-4 w-full">
              <div className="flex gap-2 justify-center">
                {forgetotp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder="0"
                    id={`otp-${index}`}
                    className="bg-slate-100 text-lg font-bold p-2 rounded-lg w-12 text-center dark:bg-neutral-800 dark:border-neutral-600 dark:text-white border border-gray-200 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleotpChange(e, index)}
                    onKeyDown={(e) => handleotpKeyDown(e, index)}
                    ref={(el) => (inputsRef.current[index] = el)}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              {errors && <p className="text-red-500 text-sm">{errors}</p>}
              {resendMessage && <p className="text-red-500 text-sm">{resendMessage}</p>}
              <div>
                <div className="flex justify-around px-9 text-sm">
                  <p>Expires At: {formatTime(remainingTime)}</p>
                  <p className="text-blue-700 cursor-pointer" onClick={handleResendOtp}>
                    Resend OTP
                  </p>
                </div>
                <button
                  type="button"  
                  onClick={handleSubmit}  
                  disabled={isLoading || remainingTime === 0}
                  className="bg-thirve-blue w-[70%] text-white font-semibold p-2 rounded-lg hover:opacity-95 disabled:opacity-80 mt-5"
                >
                  {isLoading ? "Loading..." : "Verify OTP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeEmailOtpEntry;
