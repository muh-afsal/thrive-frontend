/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CLIENT_API } from '@/axios/index.ts';

// Logout
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      const response = await CLIENT_API.post('/auth/user/logout'); 
      console.log(response);
      
      return;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.errors[0]?.message || "An unknown error occurred");
    }
  }
);
