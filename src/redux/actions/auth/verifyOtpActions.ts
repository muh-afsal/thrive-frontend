/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { VerifyOtpPayload } from '@/types/IAuth';
import { CLIENT_API } from '@/axios/index.ts';

// OTP Verification
export const verifyOtp = createAsyncThunk<boolean, VerifyOtpPayload>(
  'auth/verifyOtp',
  async (payload, thunkAPI) => {
    try {
      const response = await CLIENT_API.post('/auth/signup', payload);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "An unknown error occurred");
    }
  }
);
