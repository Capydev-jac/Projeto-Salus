import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configura como a notificação aparece enquanto o app está aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registrarPushToken(userId: number, jwtToken: string) {
  if (!Device.isDevice) {
    console.log('Push só funciona em dispositivo físico');
    return;
  }

  const { status: statusExistente } = await Notifications.getPermissionsAsync();
  let statusFinal = statusExistente;

  if (statusExistente !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    statusFinal = status;
  }

  if (statusFinal !== 'granted') {
    console.log('Permissão de notificação negada');
    return;
  }

  // Android precisa de canal
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Salus',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
    });
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Push Token:', token);

  // Salva o token no backend
  await fetch(`${process.env.EXPO_PUBLIC_API_URL}/usuarios/push-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ userId, token }),
  });
}