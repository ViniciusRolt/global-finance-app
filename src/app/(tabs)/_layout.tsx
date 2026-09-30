import { Text } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { Cores } from '@/constants/cores';

const icone = (emoji: string) =>
  function Icone({ focused }: { focused: boolean }) {
    return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
  };

export default function TabsLayout() {
  const { usuario } = useAuth();

  // sem sessao -> vai pro login
  if (!usuario) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: Cores.card, borderTopColor: Cores.borda },
        tabBarActiveTintColor: Cores.destaque,
        tabBarInactiveTintColor: Cores.textoSecundario,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Overview', tabBarIcon: icone('📊') }} />
      <Tabs.Screen name="contas" options={{ title: 'Contas', tabBarIcon: icone('🏦') }} />
      <Tabs.Screen name="transacoes" options={{ title: 'Transacoes', tabBarIcon: icone('💸') }} />
    </Tabs>
  );
}
