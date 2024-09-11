// src/redux/slices/userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse } from '@/types/IAuth';
import { completeProfile } from '../../actions/user/completeProfileActions';
import { fetchUser } from '../../actions/user/fetchUserActions';
import { logout } from '../../actions/user/logoutUserActions'; 
import { RootState } from '@/redux/store';

interface UserState {
  isLoading: boolean;
  data: AuthResponse | null;
  error: string | null;
}

const initialState: UserState = {
  isLoading: false,
  data: null,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.data = null;
      })
      .addCase(completeProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeProfile.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(completeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.data = null;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.data = null; 
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetError } = userSlice.actions;
export default userSlice.reducer;

export const selectUserState = (state: RootState) => state.user;
