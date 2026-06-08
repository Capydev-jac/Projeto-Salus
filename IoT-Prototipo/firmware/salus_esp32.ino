// ======================================
// BIBLIOTECAS
// ======================================

#include <WiFi.h>

#include <PubSubClient.h>

#include <ArduinoJson.h>

#include <Stepper.h>

#include <ESP32Servo.h>

#include <Wire.h>

#include <LiquidCrystal_I2C.h>

// ======================================
// WIFI
// ======================================

const char* ssid =
  "LENIN&MARX";

const char* password =
  "anabrava";

// ======================================
// MQTT
// ======================================

const char* mqttServer =
  "broker.hivemq.com";

const int mqttPort = 1883;

// ======================================
// TÓPICOS MQTT
// ======================================

const char* topicoComandos =
  "fatec/salus/capydev/comandos";

const char* topicoEventos =
  "fatec/salus/capydev/eventos";

// ======================================
// LEDS
// ======================================

const int ledVermelho = 19;

const int ledVerde = 5;

// ======================================
// BUZZER
// ======================================

const int buzzerPin = 23;

// ======================================
// SENSOR IR
// ======================================

const int sensorGaveta = 13;

// ======================================
// MOTOR STEPPER
// ======================================

const int stepsPerRevolution = 2048;

const int IN1 = 14;
const int IN2 = 27;
const int IN3 = 26;
const int IN4 = 25;

Stepper motor(
  stepsPerRevolution,
  IN1,
  IN2,
  IN3,
  IN4
);

// ======================================
// SERVO SG90
// ======================================

Servo servoPorta;

const int pinoServo = 18;

// ======================================
// LCD I2C
// ======================================

LiquidCrystal_I2C lcd(
  0x27,
  16,
  2
);

// ======================================
// MQTT
// ======================================

WiFiClient espClient;

PubSubClient client(
  espClient
);

// ======================================
// VARIÁVEIS GLOBAIS
// ======================================

String nomeMedicamento = "";

int medicamentoId = 0;

int compartimentoAtual = 0;

// ======================================
// DESLIGA MOTOR
// ======================================

void desligarMotor() {

  digitalWrite(IN1, LOW);

  digitalWrite(IN2, LOW);

  digitalWrite(IN3, LOW);

  digitalWrite(IN4, LOW);

}

// ======================================
// TOCA BUZZER COM PWM
// ======================================

void tocarBuzzer(
  int repeticoes,
  int tempoLigado,
  int tempoDesligado
) {

  for (
    int i = 0;
    i < repeticoes;
    i++
  ) {

    tone(
      buzzerPin,
      1500
    );

    delay(
      tempoLigado
    );

    noTone(
      buzzerPin
    );

    delay(
      tempoDesligado
    );

  }

}

// ======================================
// CONECTA WIFI
// ======================================

void conectarWiFi() {

  Serial.println(
    "Conectando WiFi..."
  );

  lcd.clear();

  lcd.setCursor(0, 0);

  lcd.print(
    "Conectando"
  );

  lcd.setCursor(0, 1);

  lcd.print(
    "WiFi..."
  );

  WiFi.begin(
    ssid,
    password
  );

  while (
    WiFi.status()
    != WL_CONNECTED
  ) {

    delay(500);

    Serial.print(".");

  }

  Serial.println("");

  Serial.println(
    "WiFi conectado"
  );

  Serial.println(
    WiFi.localIP()
  );

  lcd.clear();

  lcd.setCursor(0, 0);

  lcd.print(
    "WiFi OK"
  );

  delay(2000);

}

// ======================================
// CONECTA MQTT
// ======================================

void conectarMQTT() {

  while (
    !client.connected()
  ) {

    Serial.println(
      "Conectando MQTT..."
    );

    lcd.clear();

    lcd.setCursor(0, 0);

    lcd.print(
      "Conectando"
    );

    lcd.setCursor(0, 1);

    lcd.print(
      "MQTT..."
    );

    String clientId =
      "ESP32-SALUS-";

    clientId +=
      String(
        random(0xffff),
        HEX
      );

    if (
      client.connect(
        clientId.c_str()
      )
    ) {

      Serial.println(
        "MQTT conectado"
      );

      lcd.clear();

      lcd.setCursor(0, 0);

      lcd.print(
        "MQTT OK"
      );

      client.subscribe(
        topicoComandos
      );

      delay(2000);

    } else {

      Serial.print(
        "Erro MQTT: "
      );

      Serial.println(
        client.state()
      );

      delay(2000);

    }

  }

}

// ======================================
// ENVIA EVENTO MQTT
// ======================================

void enviarEvento(
  String status
) {

  DynamicJsonDocument doc(
    1024
  );

  doc["medicamento_id"] =
    medicamentoId;

  doc["compartimento"] =
    compartimentoAtual;

  doc["nome"] =
    nomeMedicamento;

  doc["status"] =
    status;

  String mensagem;

  serializeJson(
    doc,
    mensagem
  );

  client.publish(
    topicoEventos,
    mensagem.c_str()
  );

  Serial.println(
    "Evento enviado:"
  );

  Serial.println(
    mensagem
  );

}

// ======================================
// GIRA CARROSSEL
// ======================================

void avancarDispenser() {

  Serial.println(
    "Girando carrossel..."
  );

  lcd.clear();

  lcd.setCursor(0, 0);

  lcd.print(
    "Girando"
  );

  lcd.setCursor(0, 1);

  lcd.print(
    "carrossel"
  );

  motor.step(256);

  delay(300);

  desligarMotor();

}

// ======================================
// ABRE COMPORTA
// ======================================

void abrirComporta() {

  Serial.println(
    "Abrindo comporta..."
  );

  lcd.clear();

  lcd.setCursor(0, 0);

  lcd.print(
    "Liberando"
  );

  lcd.setCursor(0, 1);

  lcd.print(
    nomeMedicamento
  );

  servoPorta.write(90);

  delay(1000);

  delay(2000);

  servoPorta.write(0);

  delay(500);

}

// ======================================
// AGUARDA REMÉDIO
// ======================================

bool aguardarRemedio() {

  Serial.println(
    "Aguardando remedio..."
  );

  unsigned long tempoInicial =
    millis();

  while (
    millis() - tempoInicial
    < 10000
  ) {

    client.loop();

    Serial.print(
      "Sensor remedio: "
    );

    Serial.println(
      digitalRead(
        sensorGaveta
      )
    );

    delay(300);

    if (
      digitalRead(
        sensorGaveta
      ) == LOW
    ) {

      return true;

    }

  }

  return false;

}

// ======================================
// AGUARDA RETIRADA
// ======================================

bool aguardarRetirada() {

  Serial.println(
    "Aguardando retirada..."
  );

  unsigned long tempoInicial =
    millis();

  while (
    millis() - tempoInicial
    < 300000
  ) {

    client.loop();

    if (
      digitalRead(
        sensorGaveta
      ) == HIGH
    ) {

      return true;

    }

  }

  return false;

}

// ======================================
// PROCESSA ENTREGA
// ======================================

void processarEntrega() {

  avancarDispenser();

  abrirComporta();

  bool remedioDisponivel =
    aguardarRemedio();

  // ======================================
  // FALHA ENTREGA
  // ======================================

  if (
    !remedioDisponivel
  ) {

    Serial.println(
      "Falha entrega"
    );

    lcd.clear();

    lcd.setCursor(0, 0);

    lcd.print(
      "Falha"
    );

    lcd.setCursor(0, 1);

    lcd.print(
      "Entrega"
    );

    tocarBuzzer(
      5,
      300,
      300
    );

    enviarEvento(
      "falha_entrega"
    );

    return;

  }

  // ======================================
  // REMÉDIO DISPONÍVEL
  // ======================================

  Serial.println(
    "Remedio disponivel"
  );

  lcd.clear();

  lcd.setCursor(0, 0);

  lcd.print(
    "Retire o"
  );

  lcd.setCursor(0, 1);

  lcd.print(
    "remedio"
  );

  digitalWrite(
    ledVermelho,
    HIGH
  );

 for (
  int i = 0;
  i < 4;
  i++
) {

  tocarBuzzer(
    2,
    150,
    150
  );

  delay(1000);

}

  enviarEvento(
    "disponivel"
  );

  // ======================================
  // AGUARDA RETIRADA
  // ======================================

  bool retirado =
    aguardarRetirada();

  digitalWrite(
    ledVermelho,
    LOW
  );

  // ======================================
  // RETIRADO
  // ======================================

  if (retirado) {

    Serial.println(
      "Remedio retirado"
    );

    lcd.clear();

    lcd.setCursor(0, 0);

    lcd.print(
      "Remedio"
    );

    lcd.setCursor(0, 1);

    lcd.print(
      "retirado"
    );

    digitalWrite(
      ledVerde,
      HIGH
    );

    tocarBuzzer(
      1,
      100,
      0
    );

    enviarEvento(
      "retirado"
    );

    delay(3000);

    digitalWrite(
      ledVerde,
      LOW
    );

  } else {

    // ======================================
    // NÃO RETIRADO
    // ======================================

    Serial.println(
      "Remedio nao retirado"
    );

    lcd.clear();

    lcd.setCursor(0, 0);

    lcd.print(
      "Nao"
    );

    lcd.setCursor(0, 1);

    lcd.print(
      "retirado"
    );

    tocarBuzzer(
      10,
      200,
      200
    );

    enviarEvento(
      "nao_retirado"
    );

    delay(3000);

  }

  // ======================================
  // TELA PADRÃO
  // ======================================

  lcd.clear();

  lcd.setCursor(0, 0);

  lcd.print(
    "Projeto Salus"
  );

  lcd.setCursor(0, 1);

  lcd.print(
    "Aguardando"
  );

}

// ======================================
// CALLBACK MQTT
// ======================================

void callback(
  char* topic,
  byte* payload,
  unsigned int length
) {

  String mensagem = "";

  for (
    int i = 0;
    i < length;
    i++
  ) {

    mensagem +=
      (char) payload[i];

  }

  Serial.println(
    "Mensagem recebida:"
  );

  Serial.println(
    mensagem
  );

  DynamicJsonDocument doc(
    1024
  );

  DeserializationError erro =
    deserializeJson(
      doc,
      mensagem
    );

  if (erro) {

    Serial.println(
      "Erro JSON"
    );

    return;

  }

  medicamentoId =
    doc["id"];

  compartimentoAtual =
    doc["compartimento"];

  nomeMedicamento =
    doc["nome"]
      .as<String>();

  Serial.println(
    "Processando..."
  );

  Serial.print(
    "Medicamento: "
  );

  Serial.println(
    nomeMedicamento
  );

  processarEntrega();

}


 // LCD Setup

void setup() {

  Serial.begin(115200);

  Wire.begin(32, 33);

  // ======================================
  // LCD
  // ======================================

  lcd.init();

  lcd.backlight();

  lcd.setCursor(0, 0);

  lcd.print(
    "Projeto Salus"
  );

  delay(2000);

  // ======================================
  // LEDS
  // ======================================

  pinMode(
    ledVermelho,
    OUTPUT
  );

  pinMode(
    ledVerde,
    OUTPUT
  );

  digitalWrite(
    ledVermelho,
    LOW
  );

  digitalWrite(
    ledVerde,
    LOW
  );

  // ======================================
  // BUZZER
  // ======================================

  pinMode(
    buzzerPin,
    OUTPUT
  );

  // ======================================
  // SENSOR IR
  // ======================================

  pinMode(
    sensorGaveta,
    INPUT
  );

  // ======================================
  // MOTOR
  // ======================================

  motor.setSpeed(5);

  // ======================================
  // SERVO
  // ======================================

  servoPorta.attach(
    pinoServo
  );

  servoPorta.write(0);

  delay(1000);

  // ======================================
  // WIFI
  // ======================================

  conectarWiFi();

  // ======================================
  // MQTT
  // ======================================

  client.setServer(
    mqttServer,
    mqttPort
  );

  client.setCallback(
    callback
  );

  // ======================================
  // TELA INICIAL
  // ======================================

  lcd.clear();

  lcd.setCursor(0, 0);

  lcd.print(
    "Sistema pronto"
  );

  lcd.setCursor(0, 1);

  lcd.print(
    "Aguardando"
  );

}

// ======================================
// LOOP PRINCIPAL
// ======================================

void loop() {

  if (
    !client.connected()
  ) {

    conectarMQTT();

  }

  client.loop();

}