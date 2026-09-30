import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { Cores } from '@/constants/cores';

function Rotas() {
  const { carregando } = useAuth();

  // espera ler a sessao salva antes de decidir qual tela mostrar
  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Cores.fundo }}>
        <ActivityIndicator size="large" color={Cores.destaque} />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Cores.fundo } }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Rotas />
    </AuthProvider>
  );
}
