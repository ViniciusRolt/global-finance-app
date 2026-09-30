import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import authService, { LoginCredentials, RegisterCredentials, Usuario } from '@/services/auth';
import { registrarAoNaoAutorizado } from '@/services/api';

interface AuthContextData {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (dados: LoginCredentials) => Promise<void>;
  cadastrar: (dados: RegisterCredentials) => Promise<void>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    authService.getUser().then((u) => {
      setUsuario(u);
      setCarregando(false);
    });
    // token expirado -> volta pra tela de login
    registrarAoNaoAutorizado(() => setUsuario(null));
    return () => registrarAoNaoAutorizado(null);
  }, []);

  const entrar = useCallback(async (dados: LoginCredentials) => {
    const resposta = await authService.login(dados);
    setUsuario(resposta.usuario);
  }, []);

  const cadastrar = useCallback(async (dados: RegisterCredentials) => {
    const resposta = await authService.register(dados);
    setUsuario(resposta.usuario);
  }, []);

  const sair = useCallback(async () => {
    await authService.logout();
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, carregando, entrar, cadastrar, sair }),
    [usuario, carregando, entrar, cadastrar, sair]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro do AuthProvider');
  return ctx;
}
