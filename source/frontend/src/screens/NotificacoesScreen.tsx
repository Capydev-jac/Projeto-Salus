import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

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

      const response =
        await fetch(
          'https://projeto-salus-production.up.railway.app/api/notificacoes'
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

  if (loading) {

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

      <Text style={styles.title}>
        🔔 Notificações
      </Text>

      <FlatList
        data={notificacoes}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text style={styles.message}>
              {item.mensagem}
            </Text>

            <Text style={styles.date}>
              {
                new Date(
                  item.created_at
                ).toLocaleString('pt-BR')
              }
            </Text>

          </View>

        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhuma notificação encontrada.
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
      theme.colors.background
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },

  card: {
    backgroundColor:
      theme.colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },

  message: {
    fontSize: 16,
    fontWeight: '600'
  },

  date: {
    marginTop: 8,
    color:
      theme.colors.textSecondary
  },

  empty: {
    textAlign: 'center',
    marginTop: 30
  }

});