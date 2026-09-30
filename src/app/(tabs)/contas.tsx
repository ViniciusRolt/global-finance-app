import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import api from '@/services/api';
import { Cores } from '@/constants/cores';
import { formatarMoeda } from '@/lib/formatar';

interface Conta {
  id: string;
  banco: string;
  moeda: string;
  saldo: number;
}

export default function ContasScreen() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useFocusEffect(
    useCallback(() => {
      api
        .get<Conta[]>('/users/accounts')
        .then(({ data }) => {
          setContas(data);
          setErro('');
        })
        .catch(() => setErro('Nao foi possivel carregar as contas'))
        .finally(() => setCarregando(false));
    }, [])
  );

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color={Cores.destaque} />
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Suas contas</Text>
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
      <FlatList
        data={contas}
        keyExtractor={(c) => c.id}
        ListEmptyComponent={<Text style={estilos.vazio}>Nenhuma conta vinculada ainda</Text>}
        renderItem={({ item }) => (
          <View style={estilos.card}>
            <Text style={estilos.banco}>{item.banco}</Text>
            <Text style={estilos.saldo}>{formatarMoeda(item.saldo, item.moeda)}</Text>
            <Text style={estilos.moeda}>{item.moeda}</Text>
          </View>
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: Cores.fundo, padding: 20 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Cores.fundo },
  titulo: { color: Cores.texto, fontSize: 22, fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
  erro: { color: Cores.perigo, marginBottom: 12 },
  vazio: { color: Cores.textoSecundario, textAlign: 'center', paddingVertical: 24 },
  card: { backgroundColor: Cores.card, borderRadius: 14, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: Cores.borda },
  banco: { color: Cores.textoSecundario, fontSize: 14 },
  saldo: { color: Cores.texto, fontSize: 26, fontWeight: 'bold', marginTop: 6 },
  moeda: { color: Cores.destaque, fontSize: 12, marginTop: 4 },
});
