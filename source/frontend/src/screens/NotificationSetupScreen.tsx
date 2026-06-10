import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../styles/theme';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../contexts/AuthContext';
import { registrarPushToken } from '../hooks/usePushNotifications';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'NotificationSetup'> };

export default function NotificationSetupScreen({ navigation }: Props) {
  const { user, token } = useAuth();

  // antes só navegava para Home sem registrar o token.
  // Agora solicita permissão e salva o token no backend antes de navegar.
  const handleAtivar = async () => {
    if (user?.id && token) {
      await registrarPushToken(Number(user.id), token).catch(console.warn);
    }
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Não Perca{'\n'}nenhuma dose!</Text>
        <Text style={styles.subtitle}>
          Ative as notificações para garantir{'\n'}que não vai perder o horário de{'\n'}seus medicamentos
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Ativar Notificações"
          onPress={handleAtivar}
          style={{ marginBottom: theme.spacing.m }}
        />
        <CustomButton
          title="Não, vou correr o risco"
          variant="secondary"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: theme.spacing.l },
  title: { fontSize: 32, fontWeight: 'bold', color: theme.colors.textPrimary, textAlign: 'center', marginBottom: 30 },
  subtitle: { fontSize: 16, textAlign: 'center', color: theme.colors.textSecondary, fontWeight: '500', lineHeight: 24 },
  buttonContainer: { width: '100%', paddingHorizontal: theme.spacing.l, paddingBottom: 50 },
});