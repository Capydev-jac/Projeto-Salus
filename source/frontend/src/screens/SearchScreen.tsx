import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import CustomButton from '../components/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;
const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export default function SearchScreen({ route, navigation }: Props) {
  const { dependenteId, medicamento } = route.params || {};
  const { addMedication, updateMedication } = useAuth();

  const [nome, setNome] = useState('');
  const [dose, setDose] = useState('');
  const [horario, setHorario] = useState('');
  const [compartimento, setCompartimento] = useState('');
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (medicamento) {
      setNome(medicamento.nome);
      setDose(medicamento.dose);
      setCompartimento(String(medicamento.compartimento));
      setHorario(medicamento.horario);
      setDiasSelecionados(medicamento.dias);
    }
  }, [medicamento]);

  const toggleDia = (dia: string) => {
    if (diasSelecionados.includes(dia)) {
      setDiasSelecionados(diasSelecionados.filter(d => d !== dia));
    } else {
      setDiasSelecionados([...diasSelecionados, dia]);
    }
  };

  const formatarHorario = (texto: string) => {
    const numeros = texto.replace(/\D/g, '');
    let formatado = numeros;
    if (numeros.length > 2) {
      formatado = numeros.substring(0, 2) + ':' + numeros.substring(2, 4);
    }
    setHorario(formatado);
  };

  const salvarMedicamento = async () => {
    if (!nome || !horario || diasSelecionados.length === 0) return;

    const dadosMedicamento = {
      id: medicamento ? medicamento.id : Math.random().toString(),
      nome,
      dose: dose || '1 comprimido',
      horario,
      compartimento: Number(compartimento),
      dias: diasSelecionados,
      dependenteId: String(dependenteId || medicamento?.dependenteId),
    };

    setSaving(true);
    try {
      if (medicamento) {
        await updateMedication(dadosMedicamento);
      } else {
        await addMedication(dadosMedicamento);
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível salvar o medicamento.');
    } finally {
      setSaving(false);
    }
  };

  const isFormInvalid = !nome || !horario || !compartimento || diasSelecionados.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{medicamento ? 'Editar Medicamento' : 'Novo Medicamento'}</Text>
      </View>

      <ScrollView style={styles.form}>
        <Text style={styles.label}>Nome do Medicamento</Text>
        <TextInput style={styles.input} placeholder="Ex: Losartana" value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Dosagem</Text>
        <TextInput style={styles.input} placeholder="Ex: 1 comprimido" value={dose} onChangeText={setDose} />

        <Text style={styles.label}>Horário (HH:MM)</Text>
        <TextInput style={styles.input} placeholder="Ex: 08:00" value={horario} onChangeText={formatarHorario} keyboardType="numeric" maxLength={5} />

        <Text style={styles.label}>Compartimento</Text>
        <TextInput style={styles.input} placeholder="Ex: 1" value={compartimento} onChangeText={setCompartimento} keyboardType="numeric"/>
        <Text style={styles.label}>Dias da Semana</Text>
        <View style={styles.daysContainer}>
          {DIAS_SEMANA.map((dia) => (
            <TouchableOpacity
              key={dia}
              style={[styles.dayCircle, diasSelecionados.includes(dia) && styles.dayCircleActive]}
              onPress={() => toggleDia(dia)}
            >
              <Text style={[styles.dayText, diasSelecionados.includes(dia) && styles.dayTextActive]}>{dia}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {saving ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 10 }} />
        ) : (
          <CustomButton
            title={medicamento ? 'Atualizar Rotina' : 'Salvar na Rotina'}
            variant="secondary"
            onPress={salvarMedicamento}
            disabled={isFormInvalid}
            style={isFormInvalid ? { backgroundColor: theme.colors.card } : {}}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.l },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xl, marginTop: theme.spacing.s },
  backButton: { marginRight: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: theme.colors.textPrimary },
  form: { flex: 1 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: theme.colors.textPrimary },
  input: { backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.m, padding: 15, marginBottom: 20, fontSize: 16 },
  daysContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  dayCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: theme.colors.grayLight, justifyContent: 'center', alignItems: 'center' },
  dayCircleActive: { backgroundColor: theme.colors.primary },
  dayText: { color: theme.colors.textSecondary, fontSize: 14, fontWeight: '500' },
  dayTextActive: { color: theme.colors.white, fontWeight: 'bold' },
});