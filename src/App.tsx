// src/App.tsx

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './redux/store';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Landing from './pages/user/Landing';
import OtpEntry from './pages/auth/OtpEntry';
import PaymentSuccess from './pages/user/subscription/PaymentSuccess';
import PaymentFailure from './pages/user/subscription/PaymentFailed';
import ProVersionPayment from './pages/user/subscription/ProVersionPayment';
import Home from './pages/user/Home';
import Profile from './pages/user/Profile';
import ProtectedRoutes from './routes/ProtectedRoutes';
import Loading from './components/common/Loading';
import Completeprofile from './pages/user/Completeprofile';
import { fetchUser } from './redux/actions/user/fetchUserActions';
import { decodeAccessToken } from './utils/jwt/jwtService';
import ChangePassword from './components/signup/ChangePassword';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();  
  const { isLoading } = useSelector((state: RootState) => state.user);
  const { data } = useSelector((state: RootState) => state.auth);
console.log(data,'data from jteh appp &&&&&&&&&&&&&&&&&7');


  useEffect(() => {
    
    const token = decodeAccessToken();
    if (token) {
      const userId = token.userId; 
      dispatch(fetchUser({ userId }));
    }
  }, [dispatch]);

  return (
    <React.StrictMode>
      <BrowserRouter>
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
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailure />} />
            <Route element={<ProtectedRoutes />}>
            <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            <Route path="/completeprofile" element={<Completeprofile />} />
            <Route path="/payment-start" element={<ProVersionPayment />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </BrowserRouter>
    </React.StrictMode>
  );
};


export default App;
