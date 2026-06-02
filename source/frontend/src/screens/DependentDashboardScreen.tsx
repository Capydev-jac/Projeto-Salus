import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  View, Text, TouchableOpacity, StyleSheet, 
  FlatList, Alert, ActivityIndicator, Modal, Platform 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import CustomButton from '../components/CustomButton';

type Props = NativeStackScreenProps<RootStackParamList, 'DependentDashboard'>;

export default function DependentDashboardScreen({ route, navigation }: Props) {
  const { dependenteId, dependenteNome } = route.params;
  const { medications, deleteMedication, loadMedications } = useAuth();
  const [loading, setLoading] = useState(true);

  // Estados do Modal de Exclusão
  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);
  const [medParaExcluir, setMedParaExcluir] = useState<{id: string, nome: string} | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const depId = String(dependenteId);

  useEffect(() => {
    loadMedications(depId).finally(() => setLoading(false));
  }, [depId]);

  const rotinaDependente = medications.filter(med => String(med.dependenteId) === depId);

  // Funções de Exclusão
  const abrirModalExcluir = (id: string, nome: string) => {
    setMedParaExcluir({ id, nome });
    setModalExcluirVisible(true);
  };

  const confirmarExclusao = async () => {
    if (!medParaExcluir) return;

    setExcluindo(true);
    try {
      await deleteMedication(medParaExcluir.id);
      setModalExcluirVisible(false);
      setMedParaExcluir(null);
    } catch (error: any) {
      console.log("ERRO DELETE:", error);
      if (Platform.OS === 'web') {
        window.alert(`Erro: ${error.message || 'Erro ao excluir'}`);
      } else {
        Alert.alert('Erro', error.message || 'Erro ao excluir');
      }
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Rotina: {dependenteNome}</Text>
      </View>

      <CustomButton
        title="Novo Medicamento"
        icon={<Feather name="plus" size={20} color={theme.colors.white} style={{ marginRight: 8 }} />}
        onPress={() => navigation.navigate('Search', { dependenteId: depId })}
        style={{ marginBottom: theme.spacing.l }}
      />

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={rotinaDependente}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.medCard}>
              <View style={styles.medInfoArea}>
                <View style={styles.medIcon}>
                  <Feather name="activity" size={20} color={theme.colors.secondary} />
                </View>
                <View>
                  <Text style={styles.medName}>{item.nome}</Text>
                  <Text style={styles.medDose}>{item.dose} • {item.horario}</Text>
                  <Text style={styles.medDays}>{item.dias.join(', ')}</Text>
                </View>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('Search', { dependenteId: depId, medicamento: item })}>
                  <Feather name="edit-2" size={16} color={theme.colors.textPrimary} style={{ marginRight: 4 }} />
                  <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.deleteBtn} onPress={() => abrirModalExcluir(item.id, item.nome)}>
                  <Feather name="trash-2" size={16} color={theme.colors.danger} style={{ marginRight: 4 }} />
                  <Text style={styles.deleteText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum medicamento cadastrado.</Text>}
        />
      )}

      {/* Modal de Exclusão */}
      <Modal visible={modalExcluirVisible} transparent animationType="fade" onRequestClose={() => setModalExcluirVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Excluir Medicamento</Text>

            <Text style={styles.modalMessage}>
              Deseja realmente excluir <Text style={{ fontWeight: 'bold' }}>{medParaExcluir?.nome}</Text> da rotina? {'\n\n'}
              Esta ação não poderá ser desfeita.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalExcluirVisible(false)} disabled={excluindo}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.saveBtn, { backgroundColor: theme.colors.danger }]} 
                onPress={confirmarExclusao} 
                disabled={excluindo}
              >
                <Text style={styles.saveText}>{excluindo ? 'Excluindo...' : 'Excluir'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.l },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.l, marginTop: theme.spacing.s },
  backButton: { marginRight: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.textPrimary },
  medCard: { backgroundColor: theme.colors.card, borderRadius: theme.borderRadius.l, padding: 15, marginBottom: 15 },
  medInfoArea: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  medIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.white, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  medName: { fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary },
  medDose: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 2 },
  medDays: { fontSize: 12, color: theme.colors.secondary, marginTop: 2, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.4)', paddingTop: 10 },
  editBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  editText: { color: theme.colors.textPrimary, fontWeight: 'bold' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center' },
  deleteText: { color: theme.colors.danger, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 30, color: theme.colors.textSecondary, fontSize: 16 },

  // Estilos compartilhados do Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: theme.spacing.l },
  modalBox: { backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.l, padding: theme.spacing.l, width: '100%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: theme.spacing.l },
  modalMessage: { fontSize: 16, color: theme.colors.textSecondary, marginBottom: theme.spacing.l, lineHeight: 22 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: theme.spacing.s },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 20 },
  cancelText: { color: theme.colors.textSecondary, fontWeight: 'bold' },
  saveBtn: { backgroundColor: theme.colors.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: theme.borderRadius.m },
  saveText: { color: theme.colors.white, fontWeight: 'bold' },
});