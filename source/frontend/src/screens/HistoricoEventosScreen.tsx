import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { theme } from '../styles/theme';

type Evento = {
  id: number;
  medicamento_id: number;
  medicamento_nome: string;
  compartimento: number;
  status: string;
  horario: string;
};

export default function HistoricoEventosScreen() {
  const navigation = useNavigation();

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEventos();
  }, []);

  async function carregarEventos() {
    try {
      const response = await fetch(
        'https://projeto-salus-production.up.railway.app/iot/eventos'
      );

      const data = await response.json();

      console.log('EVENTOS:', data);

      setEventos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log('ERRO HISTORICO:', error);
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

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Feather
            name="arrow-left"
            size={28}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Histórico IoT
        </Text>
      </View>

      <Text style={styles.counter}>
        Total de eventos: {eventos.length}
      </Text>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>

            <Text style={styles.cardTitle}>
              💊 {item.medicamento_nome || 'Medicamento'}
            </Text>

            <Text style={styles.cardText}>
              Compartimento: {item.compartimento}
            </Text>

            <Text
              style={[
                styles.status,
                item.status === 'retirado'
                  ? styles.statusOk
                  : styles.statusErro,
              ]}
            >
              Status:{' '}
              {item.status === 'retirado'
                ? 'Retirado'
                : 'Não retirado'}
            </Text>

            <Text style={styles.cardDate}>
              {new Date(item.horario).toLocaleString('pt-BR')}
            </Text>

          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum evento encontrado.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.l,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginLeft: 12,
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

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },

  cardText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginBottom: 5,
  },

  status: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  statusOk: {
    color: '#2E7D32',
  },

  statusErro: {
    color: '#C62828',
  },

  cardDate: {
    fontSize: 13,
    color: theme.colors.secondary,
    marginTop: 8,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
});