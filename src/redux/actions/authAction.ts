/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { SignUpPayload, VerifyOtpPayload, AuthResponse, LoginPayload } from '../../types/IAuth';

// signup
export const signup = createAsyncThunk<AuthResponse, SignUpPayload>(
  'auth/signup',
  async (payload, thunkAPI) => {
    try {
      
      const response = await axios.post('http://localhost:4000/auth/signup', payload);
      
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "An unknown error occurred!");
    }
  }
);

//  OTP verification
export const verifyOtp = createAsyncThunk<boolean, VerifyOtpPayload>(
  'auth/verifyOtp',
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:4000/auth/signup', payload);
      return response.data;
    } catch (error: any) {
      
      return thunkAPI.rejectWithValue(error.response?.data?.message || "An unknown error occurred");
    }
  }
);

//  login actioin
export const login = createAsyncThunk<AuthResponse, LoginPayload>(
  'auth/login',
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:4000/auth/login', payload);
      return response.data;
    } catch (error: any) {
      
      return thunkAPI.rejectWithValue(error.response?.data?.errors[0]?.message || "An unknown error occurred");

    }
  }
);
