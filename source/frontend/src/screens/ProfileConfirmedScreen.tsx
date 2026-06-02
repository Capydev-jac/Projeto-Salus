import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../styles/theme';
import CustomButton from '../components/CustomButton';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'ProfileConfirmed'> };

export default function ProfileConfirmedScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Seu Perfil foi{'\n'}criado com{'\n'}sucesso</Text>
        <Text style={styles.subtitle}>
          Antes de Continuar, A{'\n'}Rotina de Medicamentos{'\n'}É Para Você ou um{'\n'}Dependente?
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <CustomButton 
          title="Criar Rotina Para mim Mesmo" 
          variant="secondary"
          onPress={() => navigation.navigate('RoutineSetup')}
          style={{ marginBottom: theme.spacing.m }}
        />
        <CustomButton 
          title="Criar Rotina para um Dependente" 
          onPress={() => navigation.navigate('DependentSignUp')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' },
  textContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.textPrimary, textAlign: 'center', marginBottom: 40 },
  subtitle: { fontSize: 16, textAlign: 'center', color: theme.colors.textSecondary, fontWeight: '500', lineHeight: 24 },
  buttonContainer: { width: '100%', paddingHorizontal: theme.spacing.l, paddingBottom: 50 }
});