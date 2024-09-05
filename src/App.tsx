// src/App.tsx

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './redux/store';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Landing from './pages/user/Landing';
import OtpEntry from './pages/auth/OtpEntry';
import Home from './pages/user/Home';
import Profile from './pages/user/Profile';
import ProtectedRoutes from './routes/ProtectedRoutes';
import Loading from './components/common/Loading';
import Completeprofile from './pages/user/Completeprofile';
import { fetchUser } from './redux/actions/user/fetchUserActions';
import { decodeAccessToken } from './utils/jwt/jwtService';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();  
  const { isLoading } = useSelector((state: RootState) => state.user);


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
            <Route path="/home" element={<Home />} />
            <Route path="/completeprofile" element={<Completeprofile />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </BrowserRouter>
    </React.StrictMode>
  );
};


export default App;
