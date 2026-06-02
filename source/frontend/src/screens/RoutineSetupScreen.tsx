import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../styles/theme';
import CustomButton from '../components/CustomButton';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'RoutineSetup'> };

export default function RoutineSetupScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Certo!{'\n'}Vamos{'\n'}estabelecer a{'\n'}rotina de{'\n'}Medicamentos</Text>
      </View>
      <CustomButton title="Estou Pronto" onPress={() => navigation.navigate('NotificationSetup')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.l, justifyContent: 'space-between' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: theme.colors.textPrimary, textAlign: 'center' }
});