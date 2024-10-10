/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IGoogleAuth } from '@/types/IAuth';
import { CLIENT_API } from '@/axios/index.ts';

// Google Auth
export const googleLoginOrSignUp = createAsyncThunk(
  'auth/googleAuthentication',
  async (userCredentials: IGoogleAuth, thunkAPI) => {
    try {
      const response = await CLIENT_API.post('/auth/google', userCredentials);
      console.log('google auth data',response.data.data);
      
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.errors[0]?.message || "An unknown error occurred");
    }
  }
);
