import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// No celular (Expo Go) localhost nao funciona: use o IP do PC em EXPO_PUBLIC_API_URL
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Quando o token expirar (401) o contexto de auth registra aqui o que fazer
let aoNaoAutorizado: (() => void) | null = null;
export function registrarAoNaoAutorizado(fn: (() => void) | null) {
  aoNaoAutorizado = fn;
}

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('usuario');
      aoNaoAutorizado?.();
    }
    return Promise.reject(error);
  }
);

export default api;
