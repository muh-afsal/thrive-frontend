/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./redux/store";
import Loading from "./components/common/Loading";
import { fetchUser } from "./redux/actions/user/fetchUserActions";
import { decodeAccessToken } from "./utils/jwt/jwtService";
import { SocketProvider } from "./contexts/SocketContext";
import AppRoutes from "./Routes"; 
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
            <AppRoutes />  
          )}
        </SocketProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
