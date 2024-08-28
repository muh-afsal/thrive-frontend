export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

export interface AuthState {
  email: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface SignUpPayload {
  username: string;
  email: string;
  password: string;
  phone: string;
}

export interface VerifyOtpPayload {
  email: User | null;
  otp: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  token: string;
}
