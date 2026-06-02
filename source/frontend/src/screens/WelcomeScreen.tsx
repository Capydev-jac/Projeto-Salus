import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Feather } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import CustomButton from '../components/CustomButton';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>; };

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.headerContainer}>
        <View style={styles.logoPlaceholder}>
          <Feather name="activity" size={40} color={theme.colors.primary} />
        </View>
        <Text style={styles.appName}>MedSalus</Text>
        <Text style={styles.slogan}>O controle da sua saúde,{'\n'}na palma da sua mão.</Text>
      </View>

      <View style={styles.bottomContainer}>
        <CustomButton 
          title="Acessar minha conta" 
          onPress={() => navigation.navigate('Login')} 
        />

        <Text style={styles.questionText}>Ainda não possui cadastro?</Text>
        
        <CustomButton 
          title="Criar nova conta" 
          variant="secondary"
          onPress={() => navigation.navigate('SignUp')} 
        />
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background,
    justifyContent: 'space-between' 
  },
  headerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: theme.spacing.l },
  logoPlaceholder: { 
    width: 80, 
    height: 80, 
    backgroundColor: theme.colors.white, 
    borderRadius: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: theme.spacing.l, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 3 
  },
  appName: { fontSize: 32, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: theme.spacing.s },
  slogan: { fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  bottomContainer: { 
    padding: theme.spacing.xl, 
    paddingBottom: 50, 
    backgroundColor: theme.colors.white, 
    borderTopLeftRadius: theme.borderRadius.xl, 
    borderTopRightRadius: theme.borderRadius.xl, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -3 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 10, 
    elevation: 5 
  },
  questionText: { 
    color: theme.colors.textSecondary, 
    marginTop: theme.spacing.xl, 
    marginBottom: theme.spacing.s, 
    fontSize: 14, 
    fontWeight: '600', 
    textAlign: 'center' 
  }
});