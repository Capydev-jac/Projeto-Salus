import React, { useEffect, useState } from 'react';

import {
  Text,
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../styles/theme';

type Notificacao = {
  id: number;
  mensagem: string;
  created_at: string;
};

export default function NotificacoesScreen() {
  const [notificacoes, setNotificacoes] =
    useState<Notificacao[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  async function carregarNotificacoes() {
    try {
      setLoading(true);

      const response =
        await fetch(
          'https://projeto-salus-production.up.railway.app/notificacoes'
        );

      const data =
        await response.json();

      setNotificacoes(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }

  async function marcarComoLida(
    id: number
  ) {
    try {

      await fetch(
        `https://projeto-salus-production.up.railway.app/notificacoes/${id}/lida`,
        {
          method: 'PUT',
        }
      );

      carregarNotificacoes();

    } catch (error) {

      console.log(error);

    }
  }

  if (loading && notificacoes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.counter}>
        Total de notificações: {notificacoes.length}
      </Text>

      <FlatList
        data={notificacoes}
        keyExtractor={(item) =>
          item.id.toString()
        }
        refreshing={loading}
        onRefresh={carregarNotificacoes}
        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text style={styles.alert}>
              {item.mensagem.includes('Falha')
                ? '🚨 Falha na Entrega'
                : '⚠️ Medicamento Não Retirado'}
            </Text>

            <Text style={styles.message}>
              {item.mensagem}
            </Text>

            <Text style={styles.date}>
              {new Date(
                item.created_at
              ).toLocaleString('pt-BR')}
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                marcarComoLida(item.id)
              }
            >
              <Text style={styles.buttonText}>
                ✓ Marcar como lida
              </Text>
            </TouchableOpacity>

          </View>

        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            🎉 Nenhuma notificação pendente.

            {'\n\n'}

            Todos os medicamentos foram administrados corretamente.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:
      theme.colors.background,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  counter: {
  fontSize: 14,
  color: theme.colors.textSecondary,
  marginBottom: 20,
},

  card: {
  backgroundColor: theme.colors.white,
  padding: 16,
  borderRadius: theme.borderRadius.m,
  marginBottom: 12,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.05,
  shadowRadius: 5,
  elevation: 2,
},

  alert: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  message: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  date: {
  fontSize: 13,
  color: theme.colors.secondary,
  marginTop: 8,
  marginBottom: 12,
},

  button: {
  backgroundColor: '#4CAF50',
  paddingVertical: 10,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 4,
},

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#555',
    lineHeight: 28,
  },
});