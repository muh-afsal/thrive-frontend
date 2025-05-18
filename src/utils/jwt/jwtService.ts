import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface DecodedToken {
  userId: string;
  userEmail: string;
  role: string;
  isAdmin: boolean;
  isBlocked: boolean;
  exp: number;
}


export const getAccessToken = (): string | undefined => {
    const token = Cookies.get('accessToken');
    return token;
  };

export const decodeAccessToken = (): DecodedToken | null => {
  const token = getAccessToken();
  if (token) {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }
  return null;
};

export const isTokenExpired = (): boolean => {
  const decodedToken = decodeAccessToken();
  if (decodedToken) {
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  }
  return true;
};

export const setAccessToken = (token: string): void => {
  Cookies.set('accessToken', token, { 
    expires: 1, 
    secure: true,
    sameSite: 'strict'
  });
};

export const removeAccessToken = (): void => {
  Cookies.remove('accessToken');
};