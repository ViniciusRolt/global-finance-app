import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import api from '@/services/api';
import { useAuth } from '@/context/auth-context';
import { Cores } from '@/constants/cores';
import { formatarData, formatarMoeda } from '@/lib/formatar';

interface Dashboard {
  saldoTotalGBP: number;
  contas: { id: string; banco: string; moeda: string; saldo: number }[];
  transacoesRecentes: { id: string; valor: number; categoria: string; descricao: string; data: string; tipo: string }[];
  transacoesPorCategoria: { categoria: string; total: number }[];
}

export default function OverviewScreen() {
  const { usuario, sair } = useAuth();
  const [dados, setDados] = useState<Dashboard | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    try {
      const { data } = await api.get<Dashboard>('/users/dashboard');
      setDados(data);
      setErro('');
    } catch {
      setErro('Nao foi possivel carregar o dashboard');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color={Cores.destaque} />
      </View>
    );
  }

  return (
    <ScrollView
      style={estilos.container}
      contentContainerStyle={{ padding: 20 }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={carregar} tintColor={Cores.destaque} />}>
      <View style={estilos.cabecalho}>
        <View>
          <Text style={estilos.saudacao}>Ola, {usuario?.nome}</Text>
          <Text style={estilos.legenda}>O que esta acontecendo com suas financas</Text>
        </View>
        <TouchableOpacity onPress={sair}>
          <Text style={estilos.sair}>Sair</Text>
        </TouchableOpacity>
      </View>

      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

      <View style={estilos.cardDestaque}>
        <Text style={estilos.legenda}>Patrimonio liquido (contas em GBP)</Text>
        <Text style={estilos.saldo}>{formatarMoeda(dados?.saldoTotalGBP, 'GBP')}</Text>
      </View>

      <Text style={estilos.secao}>Transacoes recentes</Text>
      {dados?.transacoesRecentes?.length ? (
        dados.transacoesRecentes.map((t) => (
          <View key={t.id} style={estilos.linha}>
            <View style={{ flex: 1 }}>
              <Text style={estilos.linhaTitulo}>{t.descricao}</Text>
              <Text style={estilos.legenda}>{t.categoria} · {formatarData(t.data)}</Text>
            </View>
            <Text style={{ color: t.tipo === 'income' ? Cores.destaque : Cores.perigo, fontWeight: '600' }}>
              {t.tipo === 'income' ? '+' : '-'}{formatarMoeda(t.valor)}
            </Text>
          </View>
        ))
      ) : (
        <Text style={estilos.vazio}>Nenhuma transacao ainda</Text>
      )}

      <Text style={estilos.secao}>Gastos por categoria (mes)</Text>
      {dados?.transacoesPorCategoria?.length ? (
        dados.transacoesPorCategoria.map((c) => (
          <View key={c.categoria} style={estilos.linha}>
            <Text style={[estilos.linhaTitulo, { flex: 1 }]}>{c.categoria}</Text>
            <Text style={estilos.linhaTitulo}>{formatarMoeda(c.total)}</Text>
          </View>
        ))
      ) : (
        <Text style={estilos.vazio}>Sem dados neste mes</Text>
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: Cores.fundo },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Cores.fundo },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 20 },
  saudacao: { color: Cores.texto, fontSize: 22, fontWeight: 'bold' },
  legenda: { color: Cores.textoSecundario, fontSize: 13, marginTop: 2 },
  sair: { color: Cores.perigo, fontSize: 14 },
  erro: { color: Cores.perigo, marginBottom: 12 },
  cardDestaque: { backgroundColor: Cores.card, borderRadius: 14, padding: 20, borderWidth: 1, borderColor: Cores.borda, marginBottom: 24 },
  saldo: { color: Cores.texto, fontSize: 34, fontWeight: 'bold', marginTop: 6 },
  secao: { color: Cores.texto, fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 6 },
  linha: { flexDirection: 'row', alignItems: 'center', backgroundColor: Cores.card, borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Cores.borda },
  linhaTitulo: { color: Cores.texto, fontSize: 15 },
  vazio: { color: Cores.textoSecundario, textAlign: 'center', paddingVertical: 16 },
});
