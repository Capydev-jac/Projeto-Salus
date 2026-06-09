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
import CustomButton from '../components/CustomButton';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Login'> };

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [emailError, setEmailError] = useState('');

  const { login } = useAuth();

  const handleLogin = async () => {
    const userEmail = email.toLowerCase().trim();

    // Limpa erros anteriores
    setServerError('');
    setEmailError('');

    // Validações inline
    let isValid = true;

    if (!userEmail) {
      setEmailError('Preencha o e-mail.');
      isValid = false;
    }

    if (!senha) {
      setServerError('Preencha todos os campos.');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      await login(userEmail, senha);
      navigation.navigate('Home');
    } catch (error: any) {
      setServerError(error.message ?? 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo!</Text>
        <Text style={styles.subtitle}>Acesse sua rotina de saúde.</Text>
      </View>

      {/* Banner de erro do servidor */}
      {serverError ? (
        <View style={styles.errorBanner}>
          <Feather name="alert-circle" size={16} color="#FF3B30" />
          <Text style={styles.errorBannerText}>{serverError}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <TextInput
          placeholderTextColor="#999999"
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="E-mail"
          value={email}
          onChangeText={(t) => { setEmail(t); setEmailError(''); setServerError(''); }}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}

        <TextInput
          placeholderTextColor="#999999"
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={(t) => { setSenha(t); setServerError(''); }}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.textLight} size="small" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.l,
  },
  backButton: { marginTop: theme.spacing.s, marginBottom: theme.spacing.xl },
  header: { alignItems: 'center', marginBottom: theme.spacing.xl },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.s,
  },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary },

  // Banner de erro
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
  errorBannerText: {
    color: '#FF3B30',
    fontSize: 14,
    flex: 1,
  },

  form: { width: '100%' },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.m,
    padding: 18,
    marginBottom: theme.spacing.m,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF3B30',
    marginBottom: 5,
  },
  fieldError: {
    color: '#FF3B30',
    fontSize: 12,
    marginBottom: theme.spacing.m,
    marginLeft: 5,
  },

  // Botão com estado de loading
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 52,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
});