/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}


export interface AuthState {
  isLoading: boolean;
	data: any | null;
	error: string | null;
}

export interface SignUpPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
export interface CompleteProfilePayload {
  profileImage?: string;  
  phone: string;
  address: string;
  profession: string;
  bio?: string; 
}


export interface VerifyOtpPayload {
  email: string| User | null;
  otp: string;
}
export interface ResendOtpPayload {
  email: User | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}


export interface AuthResponse {
  _id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  role?: string; 
  isBlocked?: boolean; 
  phone?: string;
  bio?: string;
  address?: string;
  profession?: string;
  profileImage?: string;
  subscription?: Array<{
    paymentStatus: "pending" | "paid";
    expiration?: Date;
    planType?: string;
    isActive?: boolean; 
  }>;
  transactions?: Array<{
    transactionType: "credit" | "debit";
    message?: string;
    date?: Date;
    amount?: number;
    transactionID?: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
  user?: User | null;
  accessToken?: string;
  refreshToken?: string;
}


export interface IGoogleAuth {
  email: string;
  google?: boolean;
}
