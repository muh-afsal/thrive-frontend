  /* eslint-disable @typescript-eslint/no-explicit-any */
  import { createAsyncThunk } from '@reduxjs/toolkit';
  import { SignUpPayload, AuthResponse } from '@/types/IAuth';
  import { CLIENT_API } from '@/axios/index.ts';
  import { config } from '@/common/configuratoins';

  // Signup
  export const signup = createAsyncThunk<AuthResponse, SignUpPayload>(
    'auth/signup',
    async (payload, thunkAPI) => {
      try {
        const response = await CLIENT_API.post('/auth/signup', payload, config);
        return response.data; 
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "An unknown error occurred!");
      }
    }
  );
