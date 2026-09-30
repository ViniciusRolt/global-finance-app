import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterCredentials extends LoginCredentials {
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

// Backend devolve message como string ou lista (class-validator)
function extrairMensagem(error: any, padrao: string): string {
  const msg = error?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join('\n');
  if (typeof msg === 'string') return msg;
  if (error?.code === 'ERR_NETWORK') return 'Nao foi possivel conectar ao servidor';
  return padrao;
}

async function salvarSessao(dados: AuthResponse) {
  await AsyncStorage.setItem('token', dados.access_token);
  await AsyncStorage.setItem('usuario', JSON.stringify(dados.usuario));
}

class AuthService {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', credentials);
      await salvarSessao(data);
      return data;
    } catch (error: any) {
      throw new Error(extrairMensagem(error, 'Erro ao registrar'));
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);
      await salvarSessao(data);
      return data;
    } catch (error: any) {
      throw new Error(extrairMensagem(error, 'Erro ao fazer login'));
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuario');
  }

  async getUser(): Promise<Usuario | null> {
    try {
      const usuario = await AsyncStorage.getItem('usuario');
      const token = await AsyncStorage.getItem('token');
      return usuario && token ? JSON.parse(usuario) : null;
    } catch {
      return null;
    }
  }
}

export default new AuthService();
