// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { RootState } from '../../store';
// import { AuthResponse, AuthState } from '../../../types/IAuth';
// import { signup, verifyOtp, login, googleLoginOrSignUp } from '../../actions/auth';

// const initialState: AuthState = {
//   isLoading: false,
//   data: null,
//   error: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.data = null;
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(signup.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(signup.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
//         state.isLoading = false;
//         state.data = action.payload;
//         state.error = null;
//       })
//       .addCase(signup.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//         state.data = null;
//       })
//       .addCase(verifyOtp.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<boolean>) => {
//         state.isLoading = false;
//         if (!action.payload) {
//           state.data = null;
//           state.error = 'OTP verification failed';
//         } else {
//           state.error = null;
//         }
//       })
//       .addCase(verifyOtp.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//         state.data = null;
//       })
//       .addCase(login.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
//         state.isLoading = false;
//         state.data = action.payload;
//         state.error = null;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//         state.data = null;
//       })
//       .addCase(googleLoginOrSignUp.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(googleLoginOrSignUp.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
//         state.isLoading = false;
//         state.data = action.payload;
//         state.error = null;
//       })
//       .addCase(googleLoginOrSignUp.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//         state.data = null;
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;

// export const selectAuthState = (state: RootState) => state.auth;
