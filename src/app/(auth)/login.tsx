import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { Cores } from '@/constants/cores';

export default function LoginScreen() {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !senha) {
      setErro('Preencha todos os campos');
      return;
    }
    setErro('');
    setCarregando(true);
    try {
      await entrar({ email: email.trim().toLowerCase(), senha });
      // a protecao de rota leva para o dashboard sozinha
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={estilos.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={estilos.titulo}>Global Finance</Text>
      <Text style={estilos.subtitulo}>Suas financas, consolidadas</Text>

      <TextInput
        style={estilos.input}
        placeholder="Email"
        placeholderTextColor={Cores.textoSecundario}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!carregando}
      />
      <TextInput
        style={estilos.input}
        placeholder="Senha"
        placeholderTextColor={Cores.textoSecundario}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        editable={!carregando}
        onSubmitEditing={handleLogin}
      />

      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

      <TouchableOpacity
        style={[estilos.botao, carregando && estilos.botaoDesativado]}
        onPress={handleLogin}
        disabled={carregando}>
        <Text style={estilos.botaoTexto}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>

      <Link href="/register" style={estilos.link}>
        Nao tem conta? Cadastre-se
      </Link>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: Cores.fundo },
  titulo: { fontSize: 30, fontWeight: 'bold', color: Cores.destaque, textAlign: 'center', marginBottom: 6 },
  subtitulo: { fontSize: 14, color: Cores.textoSecundario, textAlign: 'center', marginBottom: 36 },
  input: {
    borderWidth: 1,
    borderColor: Cores.borda,
    backgroundColor: Cores.card,
    color: Cores.texto,
    padding: 15,
    marginBottom: 14,
    borderRadius: 10,
    fontSize: 16,
  },
  botao: { backgroundColor: Cores.destaque, padding: 15, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  botaoDesativado: { opacity: 0.6 },
  botaoTexto: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  erro: { color: Cores.perigo, textAlign: 'center', marginBottom: 6 },
  link: { color: Cores.destaque, textAlign: 'center', marginTop: 22, fontSize: 14 },
});
