/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthResponse } from '@/types/IAuth';
import { CLIENT_API } from '@/axios/index.ts';
import { config } from '../../../common/configuratoins';

interface FetchUserParams {
  userId: string;
}

export const fetchUser = createAsyncThunk<AuthResponse, FetchUserParams>(
  '/user/fetchUser',
  async ({ userId }, thunkAPI) => {
    try {
      const response = await CLIENT_API.get(`/user/getuserdata/${userId}`, config);
      return response.data; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "An unknown error occurred!");
    }
  }
);
