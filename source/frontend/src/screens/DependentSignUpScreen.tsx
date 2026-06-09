import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { theme } from '../styles/theme';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'DependentSignUp'> };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Requisitos mais simples para dependentes (mínimo 6 caracteres, sem exigência de especiais)
const senhaRequisitos = [
  { label: 'Mínimo 6 caracteres', test: (s: string) => s.length >= 6 },
];

export default function DependentSignUpScreen({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const [senhaFocused, setSenhaFocused] = useState(false);

  const [nomeError, setNomeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmarSenhaError, setConfirmarSenhaError] = useState('');
  const [serverError, setServerError] = useState('');

  const { addDependente } = useAuth();

  const senhaValida = senha.length >= 6;

  const handleCadastro = async () => {
    setNomeError('');
    setEmailError('');
    setConfirmarSenhaError('');
    setServerError('');

    let isValid = true;

    if (!nome.trim()) {
      setNomeError('Informe o nome do dependente.');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('Informe o e-mail do dependente.');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Insira um e-mail válido (ex: nome@email.com).');
      isValid = false;
    }

    if (!senhaValida) {
      setSenhaFocused(true);
      isValid = false;
    }

    if (!confirmarSenha) {
      setConfirmarSenhaError('Confirme a senha.');
      isValid = false;
    } else if (senha !== confirmarSenha) {
      setConfirmarSenhaError('As senhas não coincidem.');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      await addDependente({ nome: nome.trim(), email: email.toLowerCase().trim(), senha });
      navigation.navigate('Home');
    } catch (error: any) {
      const msg: string = error.message ?? '';
      if (msg.toLowerCase().includes('e-mail') || msg.toLowerCase().includes('email') || msg.toLowerCase().includes('cadastrado')) {
        setEmailError(msg);
      } else {
        setServerError(msg || 'Erro ao cadastrar dependente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const senhaInputBorderColor = (): object | null => {
    if (!senhaFocused || !senha) return null;
    return senhaValida ? styles.inputSuccess : styles.inputError;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity>

      <Text style={styles.title}>Cadastrar{'\n'}Dependente</Text>

      {serverError ? (
        <View style={styles.errorBanner}>
          <Feather name="alert-circle" size={16} color="#FF3B30" />
          <Text style={styles.errorBannerText}>{serverError}</Text>
        </View>
      ) : null}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome do Dependente</Text>
        <TextInput
          placeholderTextColor="#999999"
          style={[styles.input, nomeError ? styles.inputError : null]}
          placeholder="Ex: Maria"
          value={nome}
          onChangeText={(t) => { setNome(t); setNomeError(''); }}
          editable={!loading}
        />
        {nomeError ? <Text style={styles.errorText}>{nomeError}</Text> : null}

        <Text style={styles.label}>Email do Dependente</Text>
        <TextInput
          placeholderTextColor="#999999"
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="email@exemplo.com"
          value={email}
          onChangeText={(t) => { setEmail(t); setEmailError(''); setServerError(''); }}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholderTextColor="#999999"
          style={[styles.input, senhaInputBorderColor()]}
          placeholder="Crie uma senha"
          value={senha}
          onChangeText={(t) => { setSenha(t); }}
          onFocus={() => setSenhaFocused(true)}
          secureTextEntry
          editable={!loading}
        />

        {/* Checklist de requisitos */}
        {senhaFocused ? (
          <View style={styles.requisitosContainer}>
            {senhaRequisitos.map((req) => {
              const ok = req.test(senha);
              return (
                <View key={req.label} style={styles.requisitoRow}>
                  <Feather
                    name={ok ? 'check-circle' : 'circle'}
                    size={14}
                    color={ok ? '#34C759' : '#AAAAAA'}
                  />
                  <Text style={[styles.requisitoText, ok && styles.requisitoOk]}>
                    {req.label}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : null}

        <Text style={[styles.label, { marginTop: senhaFocused ? 8 : 0 }]}>Confirmar Senha</Text>
        <TextInput
          placeholderTextColor="#999999"
          style={[styles.input, confirmarSenhaError ? styles.inputError : null]}
          placeholder="Confirme a senha"
          value={confirmarSenha}
          onChangeText={(t) => { setConfirmarSenha(t); setConfirmarSenhaError(''); }}
          secureTextEntry
          editable={!loading}
        />
        {confirmarSenhaError ? <Text style={styles.errorText}>{confirmarSenhaError}</Text> : null}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleCadastro}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.textLight} size="small" />
        ) : (
          <Text style={styles.buttonText}>Salvar Dependente</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.l },
  backButton: { marginTop: theme.spacing.s, marginBottom: theme.spacing.m },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: theme.borderRadius.m,
    padding: 12,
    marginBottom: theme.spacing.m,
    gap: 8,
  },
  errorBannerText: { color: '#FF3B30', fontSize: 14, flex: 1 },

  inputContainer: { width: '100%', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5, fontWeight: '600', color: theme.colors.textPrimary },
  input: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  inputError: { borderWidth: 1, borderColor: '#FF3B30', marginBottom: 5 },
  inputSuccess: { borderWidth: 1, borderColor: '#34C759', marginBottom: 8 },
  errorText: { color: '#FF3B30', fontSize: 12, marginBottom: 15, marginLeft: 5, marginTop: -2 },

  requisitosContainer: {
    backgroundColor: '#F7F7F7',
    borderRadius: theme.borderRadius.m,
    padding: 12,
    marginBottom: 6,
    gap: 6,
  },
  requisitoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  requisitoText: { fontSize: 13, color: '#AAAAAA' },
  requisitoOk: { color: '#34C759' },

  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 52,
    marginBottom: theme.spacing.m,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: theme.colors.textLight, fontWeight: 'bold', fontSize: 16 },

  cancelButton: { padding: 15, alignItems: 'center' },
  cancelButtonText: { color: theme.colors.textSecondary, fontWeight: 'bold', fontSize: 16 },
});