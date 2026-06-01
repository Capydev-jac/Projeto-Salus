import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator} from 'react-native';

type Evento = {
  id: number;
  medicamento_id: number;
  compartimento: number;
  status: string;
  horario: string;
};

export default function HistoricoEventosScreen() {

  const [eventos, setEventos] =
    useState<Evento[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    carregarEventos();

  }, []);

  async function carregarEventos() {

    try {

      const response =
        await fetch(
          'http://192.168.15.5:3000/iot/eventos'
        );

      const data =
        await response.json();

      setEventos(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );

  }

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>
        Histórico IoT
      </Text>

      <FlatList
        data={eventos}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text>
              Compartimento:
              {item.compartimento}
            </Text>

            <Text>
              Status:
              {item.status}
            </Text>

            <Text>
              {new Date(
                item.horario
              ).toLocaleString()}
            </Text>

          </View>

        )}
      />

    </SafeAreaView>
  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10
  }

});