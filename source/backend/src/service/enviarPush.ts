export async function enviarPushNotification(
  pushToken: string,
  titulo: string,
  mensagem: string
) {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: pushToken,
      title: titulo,
      body: mensagem,
      sound: 'default',
      priority: 'high',
    }),
  });
}