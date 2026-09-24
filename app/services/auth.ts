import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterCredentials {
  email: string;
  senha: string;
  nome: string;
}

export interface Usuario {
  id: string;
  email: string;
  nome: string;
}

export interface AuthResponse {
  access_token: string;
  usuario: Usuario;
}

class AuthService {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', credentials);
      await AsyncStorage.setItem('token', response.data.access_token);
      await AsyncStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao registrar');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      await AsyncStorage.setItem('token', response.data.access_token);
      await AsyncStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('usuario');
    } catch (error) {
      throw new Error('Erro ao fazer logout');
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('token');
      return !!token;
    } catch {
      return false;
    }
  }

  async getUser(): Promise<Usuario | null> {
    try {
      const usuario = await AsyncStorage.getItem('usuario');
      return usuario ? JSON.parse(usuario) : null;
    } catch {
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('token');
    } catch {
      return null;
    }
  }
}

export default new AuthService();