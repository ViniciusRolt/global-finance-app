import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import api from '@/services/api';
import { Cores } from '@/constants/cores';
import { formatarData, formatarMoeda } from '@/lib/formatar';

interface Transacao {
  id: string;
  valor: number;
  categoria: string;
  descricao: string;
  data: string;
  tipo: string;
  account?: { banco: string; moeda: string };
}

const CATEGORIAS = ['Todas', 'Alimentacao', 'Transporte', 'Saude', 'Renda', 'Outros'];

export default function TransacoesScreen() {
  const [categoria, setCategoria] = useState('Todas');
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useFocusEffect(
    useCallback(() => {
      setCarregando(true);
      api
        .get<Transacao[]>('/transactions', { params: { categoria } })
        .then(({ data }) => {
          setTransacoes(data);
          setErro('');
        })
        .catch(() => setErro('Nao foi possivel carregar as transacoes'))
        .finally(() => setCarregando(false));
    }, [categoria])
  );

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Transacoes</Text>

      <View style={{ height: 44 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIAS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCategoria(c)}
              style={[estilos.chip, categoria === c && estilos.chipAtivo]}>
              <Text style={[estilos.chipTexto, categoria === c && { color: '#000' }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

      {carregando ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={Cores.destaque} />
      ) : (
        <FlatList
          data={transacoes}
          keyExtractor={(t) => t.id}
          ListEmptyComponent={<Text style={estilos.vazio}>Nenhuma transacao encontrada</Text>}
          renderItem={({ item }) => (
            <View style={estilos.linha}>
              <View style={{ flex: 1 }}>
                <Text style={estilos.descricao}>{item.descricao}</Text>
                <Text style={estilos.legenda}>
                  {formatarData(item.data)} · {item.account?.banco ?? ''} · {item.categoria}
                </Text>
              </View>
              <Text style={{ color: item.tipo === 'income' ? Cores.destaque : Cores.perigo, fontWeight: '600' }}>
                {item.tipo === 'income' ? '+' : '-'}{formatarMoeda(item.valor, item.account?.moeda)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: Cores.fundo, padding: 20 },
  titulo: { color: Cores.texto, fontSize: 22, fontWeight: 'bold', marginTop: 24, marginBottom: 16 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: Cores.card, borderWidth: 1, borderColor: Cores.borda, marginRight: 8, height: 36 },
  chipAtivo: { backgroundColor: Cores.destaque, borderColor: Cores.destaque },
  chipTexto: { color: Cores.texto, fontSize: 13 },
  erro: { color: Cores.perigo, marginVertical: 8 },
  vazio: { color: Cores.textoSecundario, textAlign: 'center', paddingVertical: 24 },
  linha: { flexDirection: 'row', alignItems: 'center', backgroundColor: Cores.card, borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Cores.borda },
  descricao: { color: Cores.texto, fontSize: 15 },
  legenda: { color: Cores.textoSecundario, fontSize: 12, marginTop: 2 },
});
