/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthResponse, CompleteProfilePayload } from '@/types/IAuth';
import { CLIENT_API } from '@/axios/index.ts';
// import { configMultiPart } from '@/common/configuratoins'; 


export const completeProfile = createAsyncThunk<AuthResponse, CompleteProfilePayload>(

  '/user/Completeprofile',
  async (formData, thunkAPI) => {
    try {
      const response = await CLIENT_API.post('/user/completeprofile',formData, {withCredentials:true});
      return response.data; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "An unknown error occurred!");
    }
  }
);
