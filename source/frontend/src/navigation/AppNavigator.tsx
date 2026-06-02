import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Medicamento } from '../contexts/AuthContext';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProfileConfirmedScreen from '../screens/ProfileConfirmedScreen';
import DependentSignUpScreen from '../screens/DependentSignUpScreen';
import RoutineSetupScreen from '../screens/RoutineSetupScreen';
import NotificationSetupScreen from '../screens/NotificationSetupScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import DependentDashboardScreen from '../screens/DependentDashboardScreen';
import HistoricoEventosScreen from '../screens/HistoricoEventosScreen';
import NotificacoesScreen from '../screens/NotificacoesScreen'

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  ProfileConfirmed: undefined;
  DependentSignUp: undefined;
  RoutineSetup: undefined;
  NotificationSetup: undefined;
  Home: undefined;
  DependentDashboard: { dependenteId: string; dependenteNome: string };
  Search: { dependenteId?: string; medicamento?: Medicamento };
  HistoricoEventos: undefined;
  Notificacoes: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{ 
          headerShown: false,
          animation: 'none'
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ProfileConfirmed" component={ProfileConfirmedScreen} />
        <Stack.Screen name="DependentSignUp" component={DependentSignUpScreen} />
        <Stack.Screen name="RoutineSetup" component={RoutineSetupScreen} />
        <Stack.Screen name="NotificationSetup" component={NotificationSetupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DependentDashboard" component={DependentDashboardScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="HistoricoEventos" component={HistoricoEventosScreen} options={{ headerShown: true, title: 'Histórico IoT', }} />
        <Stack.Screen name="Notificacoes" component={NotificacoesScreen} options={{ headerShown: true, title: 'Notificações', }}
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}