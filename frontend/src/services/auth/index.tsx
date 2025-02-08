import api from '../../utils/network/api';
import { LoginDto, RegisterDto, AuthResponse } from '../../data/dtos/auth';
import { API_CONFIG } from '../../config/api';

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const AuthService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(API_CONFIG.AUTH.LOGIN, data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new AuthError('Email ou mot de passe incorrect');
      }
      if (error.response?.data?.message) {
        throw new AuthError(error.response.data.message);
      }
      throw new AuthError('Une erreur est survenue lors de la connexion');
    }
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(API_CONFIG.AUTH.REGISTER, data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new AuthError('Cette adresse e-mail est déjà utilisée');
      }
      if (error.response?.data?.message) {
        throw new AuthError(error.response.data.message);
      }
      throw new AuthError('Une erreur est survenue lors de l\'inscription');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post(API_CONFIG.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
