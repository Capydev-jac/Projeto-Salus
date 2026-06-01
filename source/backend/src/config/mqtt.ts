import mqtt from 'mqtt';

const client = mqtt.connect(
  "mqtt://broker.hivemq.com:1883"
);

client.on('connect', () => {

  console.log(
    '✅ Conectado ao broker MQTT'
  );

  client.subscribe(
    'fatec/salus/capydev/eventos'
  );

  console.log("Escutando eventos IoT")

});

client.on('message', (_, message) => {

  console.log(
    '📩 Mensagem recebida:'
  );

  console.log(
    message.toString()
  );

});

// ======================================
// ENVIA COMANDO MQTT
// ======================================

export function enviarComando(
  payload: any
) {

  client.publish(
    'fatec/salus/capydev/comandos',
    JSON.stringify(payload)
  );

  console.log(
    '📤 Comando enviado'
  );

}

export default client;