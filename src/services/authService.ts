import { AuthResponse, LoginCredentials, SignupCredentials } from '../types/auth';
import api from './apiService';

export const login = (credentials: LoginCredentials) =>
  api.post<AuthResponse>('/auth/login', credentials);

export const register = (credentials: SignupCredentials) =>
  api.post<AuthResponse>('/auth/register', credentials);

export default {
  login,
  register,
}; 