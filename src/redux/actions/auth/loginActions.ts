/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginPayload, AuthResponse } from '@/types/IAuth';
import { CLIENT_API } from '@/axios/index.ts';

// Login
export const login = createAsyncThunk<AuthResponse, LoginPayload>(
  'auth/login',
  async (payload, thunkAPI) => {
    try {
      const response = await CLIENT_API.post('/auth/login', payload);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.errors[0]?.message || "An unknown error occurred");
    }
  }
);
