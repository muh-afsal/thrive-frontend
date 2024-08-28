import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { AuthResponse, AuthState } from '../../types/IAuth';
import { login, signup, verifyOtp } from '../actions/authAction';
import Cookies from 'js-cookie';

// Initial state
const initialState: AuthState = {
  email: null,
  isLoading: false,
  error: null,
  isAuthenticated: false, // Add this line
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.email = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.email = action.payload.user;
        state.isAuthenticated = !!action.payload.user;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload;
        if (!action.payload) {
          state.email = null;
          state.error = 'OTP verification failed';
        } else {
          state.error = null;
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.email = action.payload.user;
        state.isAuthenticated = !action.payload.user; 
        Cookies.set('auths', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

// Selector to get auth state
export const selectAuthState = (state: RootState) => state.auth;
