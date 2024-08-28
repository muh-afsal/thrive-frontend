import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Landing from './pages/user/Landing';
import OtpEntry from './pages/auth/OtpEntry';
import Home from './pages/user/Home';
import Profile from './pages/user/Profile';
import Cookies from 'js-cookie';
import ProtectedRoutes  from './routes/ProtectedRoutes';


const App = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const authCookie = Cookies.get('auths');
  console.log(authCookie, 'authekl');

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <SignUp />} />
          <Route path="/otp-entry" element={<OtpEntry />} />
              <Route path="/home" element={<Home /> }/>

          <Route element={<ProtectedRoutes/>}>
             <Route path="/profile" element={<Profile/>} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
