import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  FlatList, ActivityIndicator, Alert, Modal, TextInput, Platform
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth, Dependente } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import CustomButton from '../components/CustomButton';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Home'> };

export default function HomeScreen({ navigation }: Props) {
  const { user, logout, dependentes, medications, loadMedications, updateDependente, deleteDependente } = useAuth();
  const [loading, setLoading] = useState(false);

  // Estados do Modal de Edição
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Dependente | null>(null);
  const [nomeEdit, setNomeEdit] = useState('');
  const [emailEdit, setEmailEdit] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Estados do Modal de Exclusão
  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);
  const [depParaExcluir, setDepParaExcluir] = useState<Dependente | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    if (user?.role === 'dependente' && user?.id) {
      setLoading(true);
      loadMedications(String(user.id)).finally(() => setLoading(false));
    }
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigation.navigate('Welcome');
  };

  // Funções de Edição
  const abrirEdicao = (dep: Dependente) => {
    setEditando(dep);
    setNomeEdit(dep.nome);
    setEmailEdit(dep.email);
    setModalVisible(true);
  };

  const handleSalvarEdicao = async () => {
    if (!nomeEdit.trim() || !emailEdit.trim()) {
      return Alert.alert('Atenção', 'Nome e email são obrigatórios.');
    }
    if (!editando) return;

    setSalvando(true);
    try {
      await updateDependente(editando.id, { nome: nomeEdit.trim(), email: emailEdit.trim() });
      setModalVisible(false);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setSalvando(false);
    }
  };

  // Funções de Exclusão
  const abrirModalExcluir = (dep: Dependente) => {
    setDepParaExcluir(dep);
    setModalExcluirVisible(true);
  };

  const confirmarExclusao = async () => {
    if (!depParaExcluir) return;

    setExcluindo(true);
    try {
      await deleteDependente(depParaExcluir.id);
      setModalExcluirVisible(false);
      setDepParaExcluir(null);
    } catch (error: any) {
      if (Platform.OS === 'web') {
        window.alert(`Erro: ${error.message}`);
      } else {
        Alert.alert('Erro', error.message);
      }
    } finally {
      setExcluindo(false);
    }
  };

  // View do Responsável
  if (user?.role === 'responsavel') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Meus Dependentes</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Adicionar Novo Dependente"
          variant="secondary"
          icon={<Feather name="plus-circle" size={20} color={theme.colors.white} style={{ marginRight: 8 }} />}
          onPress={() => navigation.navigate('DependentSignUp')}
          style={{ marginBottom: theme.spacing.l }}
        />

        <View style={styles.quickActions}>

  <TouchableOpacity
    style={styles.quickButton}
    onPress={() =>
      navigation.navigate(
        'HistoricoEventos'
      )
    }
  >
    <Feather
      name="clock"
      size={18}
      color="#FFF"
    />

    <Text style={styles.quickButtonText}>
      Histórico
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.quickButton}
    onPress={() =>
      navigation.navigate(
        'Notificacoes'
      )
    }
  >
    <Feather
      name="bell"
      size={18}
      color="#FFF"
    />

    <Text style={styles.quickButtonText}>
      Notificações
    </Text>
  </TouchableOpacity>

</View>
        
        <FlatList
          data={dependentes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Feather name="user" size={24} color={theme.colors.textPrimary} style={{ marginRight: 10 }} />
                <Text style={styles.cardTitle}>{item.nome}</Text>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.verBtn}
                  onPress={() => navigation.navigate('DependentDashboard', { dependenteId: item.id, dependenteNome: item.nome })}
                >
                  <Feather name="list" size={15} color={theme.colors.primary} style={{ marginRight: 4 }} />
                  <Text style={styles.verText}>Ver rotina</Text>
                </TouchableOpacity>

                <View style={styles.actionsSeparator} />

                <TouchableOpacity style={styles.actionBtn} onPress={() => abrirEdicao(item)}>
                  <Feather name="edit-2" size={15} color={theme.colors.textPrimary} style={{ marginRight: 4 }} />
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>

                {/* chama a função que abre o modal de exclusão */}
                <TouchableOpacity style={styles.actionBtn} onPress={() => abrirModalExcluir(item)}>
                  <Feather name="trash-2" size={15} color={theme.colors.danger} style={{ marginRight: 4 }} />
                  <Text style={[styles.actionText, { color: theme.colors.danger }]}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum dependente cadastrado.</Text>
          }
        />

        {/* Modal de Edição */}
        <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Editar Dependente</Text>

              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={nomeEdit}
                onChangeText={setNomeEdit}
                placeholder="Nome do dependente"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={emailEdit}
                onChangeText={setEmailEdit}
                placeholder="Email do dependente"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSalvarEdicao} disabled={salvando}>
                  <Text style={styles.saveText}>{salvando ? 'Salvando...' : 'Salvar'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de Exclusão */}
        <Modal visible={modalExcluirVisible} transparent animationType="fade" onRequestClose={() => setModalExcluirVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Excluir Dependente</Text>

              <Text style={styles.modalMessage}>
                Deseja realmente excluir <Text style={{ fontWeight: 'bold' }}>{depParaExcluir?.nome}</Text>?{'\n\n'}
                Todos os medicamentos e a rotina vinculada a este dependente também serão removidos permanentemente.
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

  // View do Dependente
  const minhosRemédios = medications.filter(m => String(m.dependenteId) === String(user?.id));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Minha Rotina</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={minhosRemédios}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.medCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <Feather name="info" size={18} color={theme.colors.textPrimary} style={{ marginRight: 8 }} />
                <Text style={styles.medName}>{item.nome}</Text>
              </View>
              <Text style={styles.medDose}>{item.dose} • {item.horario}</Text>
              <Text style={styles.medDays}>{item.dias.join(', ')}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum medicamento cadastrado.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.l },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xl, marginTop: theme.spacing.s },
  welcomeText: { fontSize: 26, fontWeight: 'bold', color: theme.colors.textPrimary },
  logoutBtn: { backgroundColor: theme.colors.danger, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  logoutText: { color: theme.colors.white, fontWeight: 'bold' },
  card: { backgroundColor: theme.colors.white, padding: 20, borderRadius: theme.borderRadius.m, marginBottom: theme.spacing.m, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.textPrimary },
  cardActions: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)', paddingTop: 10, gap: 12 },
  verBtn: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  verText: { fontSize: 14, fontWeight: 'bold', color: theme.colors.primary },
  actionsSeparator: { width: 1, height: 16, backgroundColor: 'rgba(0,0,0,0.1)' },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: 'bold', color: theme.colors.textPrimary },
  emptyText: { textAlign: 'center', marginTop: 30, color: theme.colors.textSecondary, fontSize: 16 },
  medCard: { backgroundColor: theme.colors.card, borderRadius: theme.borderRadius.m, padding: 15, marginBottom: 10 },
  medName: { fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary },
  medDose: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 2 },
  medDays: { fontSize: 12, color: theme.colors.secondary, marginTop: 2, fontWeight: 'bold' },
  
  // Estilos compartilhados dos Modais
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: theme.spacing.l },
  modalBox: { backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.l, padding: theme.spacing.l, width: '100%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: theme.spacing.l },
  modalMessage: { fontSize: 16, color: theme.colors.textSecondary, marginBottom: theme.spacing.l, lineHeight: 22 }, // <-- Adicionado para o texto de exclusão
  label: { fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: 6 },
  input: { backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.m, padding: 14, fontSize: 16, marginBottom: theme.spacing.m },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: theme.spacing.s },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 20 },
  cancelText: { color: theme.colors.textSecondary, fontWeight: 'bold' },
  saveBtn: { backgroundColor: theme.colors.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: theme.borderRadius.m },
  saveText: { color: theme.colors.white, fontWeight: 'bold' },

  quickActions: {
  flexDirection: 'row',
  gap: 12,
  marginBottom: 20,
},

quickButton: {
  flex: 1,
  backgroundColor: theme.colors.primary,
  borderRadius: 16,
  paddingVertical: 14,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
},

quickButtonText: {
  color: '#FFF',
  fontWeight: 'bold',
  marginLeft: 8,
  fontSize: 15,
},
});