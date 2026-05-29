import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, SafeAreaView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Feather } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useAuth } from '../contexts/AuthContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'> };

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Checklist de requisitos da senha
const senhaRequisitos = [
  { label: 'Mínimo 8 caracteres', test: (s: string) => s.length >= 8 },
  { label: '1 letra maiúscula', test: (s: string) => /[A-Z]/.test(s) },
  { label: '1 caractere especial (!@#$...)', test: (s: string) => /[!@#$%^&*(),.?":{}|<>]/.test(s) },
];

export default function SignUpScreen({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // Controla se o usuário já tocou no campo de senha (para mostrar o checklist)
  const [senhaFocused, setSenhaFocused] = useState(false);

  const [nomeError, setNomeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmarSenhaError, setConfirmarSenhaError] = useState('');
  const [serverError, setServerError] = useState('');

  const { signUp } = useAuth();

  const handleSignUp = async () => {
    setNomeError('');
    setEmailError('');
    setConfirmarSenhaError('');
    setServerError('');

    let isValid = true;

    if (!nome.trim()) {
      setNomeError('Informe seu nome.');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('Informe seu e-mail.');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Insira um e-mail válido (ex: nome@email.com).');
      isValid = false;
    }

    // Senha: o checklist já mostra os requisitos visualmente
    // Aqui só bloqueamos o envio se a senha não estiver ok
    const senhaValida = passwordRegex.test(senha);
    if (!senhaValida) {
      setSenhaFocused(true);
      isValid = false;
    }

    if (!confirmarSenha) {
      setConfirmarSenhaError('Confirme sua senha.');
      isValid = false;
    } else if (senha !== confirmarSenha) {
      setConfirmarSenhaError('As senhas não coincidem.');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      await signUp(email.toLowerCase().trim(), senha, nome.trim());
      navigation.navigate('ProfileConfirmed');
    } catch (error: any) {
      const msg: string = error.message ?? '';
      if (msg.toLowerCase().includes('e-mail') || msg.toLowerCase().includes('email') || msg.toLowerCase().includes('cadastrado')) {
        setEmailError(msg);
      } else {
        setServerError(msg || 'Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const senhaInputBorderColor = (): object | null => {
    if (!senhaFocused) return null;
    if (!senha) return null;
    return passwordRegex.test(senha) ? styles.inputSuccess : styles.inputError;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity>

      <Text style={styles.title}>Para começar,{'\n'}preciso de algumas{'\n'}informações</Text>

      {serverError ? (
        <View style={styles.errorBanner}>
          <Feather name="alert-circle" size={16} color="#FF3B30" />
          <Text style={styles.errorBannerText}>{serverError}</Text>
        </View>
      ) : null}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Qual seu Nome?</Text>
        <TextInput
          style={[styles.input, nomeError ? styles.inputError : null]}
          placeholder="Ex: João"
          value={nome}
          onChangeText={(t) => { setNome(t); setNomeError(''); }}
          editable={!loading}
        />
        {nomeError ? <Text style={styles.errorText}>{nomeError}</Text> : null}

        <Text style={styles.label}>Qual seu Email?</Text>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="Insira seu Email"
          value={email}
          onChangeText={(t) => { setEmail(t); setEmailError(''); setServerError(''); }}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Text style={styles.label}>Crie uma Senha</Text>
        <TextInput
          style={[styles.input, senhaInputBorderColor()]}
          placeholder="Crie uma senha"
          value={senha}
          onChangeText={(t) => { setSenha(t); }}
          onFocus={() => setSenhaFocused(true)}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
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

        <Text style={[styles.label, { marginTop: senhaFocused ? 8 : 0 }]}>Confirme a Senha</Text>
        <TextInput
          style={[styles.input, confirmarSenhaError ? styles.inputError : null]}
          placeholder="Confirme a senha"
          value={confirmarSenha}
          onChangeText={(t) => { setConfirmarSenha(t); setConfirmarSenhaError(''); }}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        {confirmarSenhaError ? <Text style={styles.errorText}>{confirmarSenhaError}</Text> : null}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.textLight} size="small" />
        ) : (
          <Text style={styles.buttonText}>Confirmar</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.l },
  backButton: { marginTop: theme.spacing.s, marginBottom: theme.spacing.m },
  title: {
    fontSize: 24,
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
  label: { fontSize: 16, marginBottom: 5, fontWeight: '500', color: theme.colors.textPrimary },
  input: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  inputError: { borderWidth: 1, borderColor: '#FF3B30', marginBottom: 5 },
  inputSuccess: { borderWidth: 1, borderColor: '#34C759', marginBottom: 8 },
  errorText: { color: '#FF3B30', fontSize: 12, marginBottom: 15, marginLeft: 5, marginTop: -2 },

  // Checklist de requisitos da senha
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
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: theme.colors.textLight, fontWeight: 'bold', fontSize: 16 },
});