import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse, AuthState } from '@/types/IAuth';
import { completeProfile } from '../../actions/user/completeProfileActions';
import { fetchUser } from '../../actions/user/fetchUserActions';
import { signup, verifyOtp, login, googleLoginOrSignUp } from '../../actions/auth';
import { RootState } from '@/redux/store';

interface UserState extends AuthState {
  isLoading: boolean;
  data: AuthResponse | null;
  error: string | null;
}

const initialState: UserState = {
  isLoading: false,
  data: null,
  error: null,
};

// Combined userSlice that handles both user-related and auth-related actions
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch user actions
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
      });

    // Complete profile actions
    builder
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
      });

    // Signup actions
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.data = null;
      });

    // OTP verification actions
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.isLoading = false;
        if (!action.payload) {
          state.data = null;
          state.error = 'OTP verification failed';
        } else {
          state.error = null;
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.data = null;
      });

    // Login actions
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.data = null;
      });

    // Google login or sign-up actions
    builder
      .addCase(googleLoginOrSignUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLoginOrSignUp.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(googleLoginOrSignUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.data = null;
      });
  },
});

export const { resetError, logout } = userSlice.actions;
export default userSlice.reducer;

export const selectUserState = (state: RootState) => state.user;
