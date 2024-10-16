/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./redux/store";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Landing from "./pages/user/Landing";
import OtpEntry from "./pages/auth/OtpEntry";
import PaymentSuccess from "./pages/user/subscription/PaymentSuccess";
import PaymentFailure from "./pages/user/subscription/PaymentFailed";
import ProVersionPayment from "./pages/user/subscription/ProVersionPayment";
import Home from "./pages/user/Home";
import Profile from "./pages/user/profile/Profile";
import ChatLayout from "./pages/user/chat/ChatLayout";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Loading from "./components/common/Loading";
import Completeprofile from "./pages/user/profile/Completeprofile";
import { fetchUser } from "./redux/actions/user/fetchUserActions";
import { decodeAccessToken } from "./utils/jwt/jwtService";
import ChangePassword from "./components/signup/ChangePassword";
import GeneralInfo from "./components/profile/Generalnfo";
import Security from "./components/profile/Security";
import Billing from "./components/profile/Billing";
import Notification from "./components/profile/Notification";
import ChatPage from "./pages/user/chat/ChatPage";
import CallLayout from "./pages/user/Call/CallLayout";
import CallRoomPage from "./pages/user/Call/CallRoomPage";
import { SocketProvider } from "./contexts/SocketContext";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = decodeAccessToken();
      if (token) {
        const userId = token.userId;
        if (userId) {
          await dispatch(fetchUser({ userId }));
        }
      }
    };

    fetchUserData();
  }, [dispatch]);


  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);
  

  return (
    <React.StrictMode>
      <BrowserRouter>
      <SocketProvider>
        {isLoading ? (
          <>
            <Loading />
            {console.log("Loading...")}
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/otp-entry" element={<OtpEntry />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />}>
                <Route path="general-info" element={<GeneralInfo />} />
                <Route path="security" element={<Security />} />
                <Route path="billing" element={<Billing />} />
                <Route path="notification" element={<Notification />} />
              </Route>
              <Route path="/chat" element={<ChatLayout />}>
                <Route path=":chatType" element={<ChatPage />} />
              </Route>

              <Route path="/audio-call" element={<CallLayout />}/>
              <Route path="/call-room/:roomId" element={<CallRoomPage />}/>

              <Route path="/completeprofile" element={<Completeprofile />} />
              <Route path="/payment-start" element={<ProVersionPayment />} />
              <Route path="/payment-failed" element={<PaymentFailure />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
        </SocketProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
