import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { verifyOtp } from "../../redux/actions/auth"; 
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/navbars/AuthNavbar";
import { Helmet } from "react-helmet";
import otpimage1 from '@/assets/images/otpentryimage.png';
import * as Yup from 'yup';
import { CLIENT_API } from "@/axios";
import { config } from "@/common/configuratoins";

// Validation schema
const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .length(4, 'OTP must be 4 digits')
    .matches(/^\d{4}$/, 'OTP must be a valid 4-digit number'),
});

const OtpEntry: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [errors, setErrors] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(120);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useSelector((state: RootState) => state.user);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  
  const formData = location.state?.formData;

  useEffect(() => {
    const savedExpiration = localStorage.getItem("otpExpiration");

    if (savedExpiration) {
      const expirationTime = parseInt(savedExpiration, 10);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = expirationTime - currentTime;

      if (timeLeft > 0) {
        setRemainingTime(timeLeft);
      } else {
        localStorage.removeItem("otpExpiration");
        setRemainingTime(0);
        setErrors("OTP has expired. Please request a new one.");
      }
    } else {
      const expirationTime = Math.floor(Date.now() / 1000) + 120;
      localStorage.setItem("otpExpiration", expirationTime.toString());
      setRemainingTime(120);
    }
  }, []);

  useEffect(() => {
    if (remainingTime > 0) {
      const timerId = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else if (remainingTime === 0) {
      setErrors("OTP has expired. Please request a new one.");
      localStorage.removeItem("otpExpiration");
    }
  }, [remainingTime]);

  if (!formData) {
    return <p>No form data available</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.slice(0, 1);
    if (!/^[0-9]$/.test(value) && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    try {
      await otpSchema.validate({ otp: otpString });
      const payload = { ...formData, otp: otpString };
      const resultAction = await dispatch(verifyOtp(payload));

      if (verifyOtp.fulfilled.match(resultAction)) {
        const responsePayload = resultAction.payload;

        if (responsePayload) {
          localStorage.removeItem("otpExpiration");
          navigate("/completeprofile");
        } else {
          setErrors("OTP verification failed. Please try again.");
        }
      } else {
        setErrors("Incorrect or Invalid OTP.");
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

    const {email}=formData
     console.log(email,'form data of the things');
    const payload = {email}; 
    const response = await CLIENT_API.post('/auth/resend-otp', payload, config);
  console.log(response,'responce from teh api call of resend otp -------');

    if (response.data.success) {
      const newExpirationTime = Math.floor(Date.now() / 1000) + 120;
      localStorage.setItem("otpExpiration", newExpirationTime.toString());
      setRemainingTime(120);
      setResendMessage("A new OTP has been sent to your email.");
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

  return (
    <>
      <Helmet>
        <title>Enter OTP - Thrive</title>
      </Helmet>
      <div>
        <Header />
        <section className="w-full h-screen pt-7 px-3 flex justify-center">
          <div className="w-full h-[80%] flex justify-center pt-9 items-center flex-col">
            <div className="bg--400 flex flex-col justify-center items-center ">
              <div className="flex flex-col justify-center items-center text-center p-4 mb-4 ">
                <h1 className="mb-2 font-extrabold text-2xl lg:text-3xl">Enter the OTP</h1>
                <h4 className="text-gray-400 text-sm">Please check your email for the OTP</h4>
              </div>
              <div className="flex items-center justify-center">
                <img className="w-[60%]" src={otpimage1} alt="OTP Entry" />
              </div>
              <div className="flex w-[90%] md:w-[400px] flex-col justify-center items-center text-center">
                <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        placeholder="0"
                        id={`otp-${index}`}
                        className="bg-slate-100 text-lg font-bold p-2 rounded-lg w-12 text-center border border-gray-200 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
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
        </section>
      </div>
    </>
  );
};

export default OtpEntry;
