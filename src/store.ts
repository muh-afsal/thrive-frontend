import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./redux/reducers/authSlice";
// import Cookies from 'js-cookie';

// Retrieve and parse the cookie, if it exists
// const authCookie = Cookies.get('auths');
// const parsedAuthCookie = authCookie ? JSON.parse(authCookie) : null;

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // preloadedState: {
  //   auth: {
  //     isAuthenticated: !!authCookie, 
  //     email: parsedAuthCookie, 
  //     isLoading: false,
  //     error: null,
  //   },
  // },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
