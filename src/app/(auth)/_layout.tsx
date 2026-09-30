import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { Cores } from '@/constants/cores';

export default function AuthLayout() {
  const { usuario } = useAuth();

  // ja logado -> vai pro dashboard
  if (usuario) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Cores.fundo } }} />;
}
