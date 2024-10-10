/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthResponse,} from '@/types/IAuth';
import { CLIENT_API } from '@/axios/index.ts';
// import { configMultiPart } from '@/common/configuratoins'; 
const UserUrl='/auth/user'


export const editProfile = createAsyncThunk<AuthResponse, AuthResponse>(

  '/user/editProfile',
  async (formData, thunkAPI) => {
    try {
      console.log(formData,'thisis is the edite d]&^^^^^^^^^^^^^^^^^^^^^^^^^66');
      
      const response = await CLIENT_API.post(`${UserUrl}/editProfile`,formData, {withCredentials:true});
      return response.data; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "An unknown error occurred!");
    }
  }
);
