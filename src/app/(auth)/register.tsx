import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { Cores } from '@/constants/cores';

export default function RegisterScreen() {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleCadastro = async () => {
    if (!nome.trim() || !email.trim() || !senha) {
      setErro('Preencha todos os campos');
      return;
    }
    // mesma regra do backend (MinLength 8)
    if (senha.length < 8) {
      setErro('A senha precisa ter pelo menos 8 caracteres');
      return;
    }
    setErro('');
    setCarregando(true);
    try {
      await cadastrar({ nome: nome.trim(), email: email.trim().toLowerCase(), senha });
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={estilos.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={estilos.titulo}>Criar conta</Text>
      <Text style={estilos.subtitulo}>Comece a consolidar suas financas</Text>

      <TextInput style={estilos.input} placeholder="Nome" placeholderTextColor={Cores.textoSecundario}
        value={nome} onChangeText={setNome} editable={!carregando} />
      <TextInput style={estilos.input} placeholder="Email" placeholderTextColor={Cores.textoSecundario}
        value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!carregando} />
      <TextInput style={estilos.input} placeholder="Senha (minimo 8 caracteres)" placeholderTextColor={Cores.textoSecundario}
        value={senha} onChangeText={setSenha} secureTextEntry editable={!carregando} />

      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

      <TouchableOpacity
        style={[estilos.botao, carregando && estilos.botaoDesativado]}
        onPress={handleCadastro}
        disabled={carregando}>
        <Text style={estilos.botaoTexto}>{carregando ? 'Criando...' : 'Cadastrar'}</Text>
      </TouchableOpacity>

      <Link href="/login" style={estilos.link}>
        Ja tem conta? Entrar
      </Link>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: Cores.fundo },
  titulo: { fontSize: 28, fontWeight: 'bold', color: Cores.destaque, textAlign: 'center', marginBottom: 6 },
  subtitulo: { fontSize: 14, color: Cores.textoSecundario, textAlign: 'center', marginBottom: 32 },
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
