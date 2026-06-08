import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { create } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registrarPushToken } from '../hooks/usePushNotifications';

export type User = { id?: string; email: string; nome?: string; role: 'responsavel' | 'dependente' };
export type Dependente = { id: string; nome: string; email: string };
export type Medicamento = { id: string; nome: string; dose: string; horario: string; dias: string[]; compartimento: number; dependenteId?: string };

type MedicamentoAPI = {
  id: number;
  nome: string;
  dose: string;
  horario: string;
  dias: unknown;
  compartimento: number;
  dependente_id: number;
};

type AuthContextData = {
  user: User | null;
  token: string | null;
  dependentes: Dependente[];
  medications: Medicamento[];
  login: (email: string, senhaDigitada: string) => Promise<void>;
  logout: () => void;
  signUp: (email: string, senha: string, nome: string) => Promise<void>;
  addDependente: (dependente: { nome: string; email: string; senha: string }) => Promise<void>;
  updateDependente: (id: string, dados: { nome: string; email: string }) => Promise<void>;
  deleteDependente: (id: string) => Promise<void>;
  addMedication: (med: Omit<Medicamento, 'id'> & { dependenteId: string }) => Promise<void>;
  updateMedication: (med: Medicamento) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  loadMedications: (dependenteId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const api = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const err = error as { response?: { data?: { message?: string } } };
    return err.response?.data?.message ?? fallback;
  }
  return fallback;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [dependentes, setDependentes] = useState<Dependente[]>([]);
  const [medications, setMedications] = useState<Medicamento[]>([]);
  const tokenRef = useRef<string | null>(null);

  const saveToken = (t: string | null) => {
    tokenRef.current = t;
    setToken(t);
  };

  // Restaura a sessão salva ao abrir o app
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('@medsalus:token');
        const savedUser = await AsyncStorage.getItem('@medsalus:user');
        if (savedToken && savedUser) {
          saveToken(savedToken);
          const parsedUser: User = JSON.parse(savedUser);
          setUser(parsedUser);
          if (parsedUser.role === 'responsavel') {
            const response = await api.get('/dependentes', { headers: { Authorization: `Bearer ${savedToken}` } });
            setDependentes(response.data);
          }
          // Registra push token ao restaurar sessão (app reaberto)
          if (parsedUser.id) {
            registrarPushToken(Number(parsedUser.id), savedToken).catch(console.warn);
          }
        }
      } catch {
        // Se houver erro ao restaurar, ignora e mantém o usuário deslogado
      }
    };
    restoreSession();
  }, []);

  const authHeader = () => ({ Authorization: `Bearer ${tokenRef.current}` });

  // Auth

  const loadDependentes = async () => {
    const response = await api.get('/dependentes', { headers: authHeader() });
    setDependentes(response.data);
  };

  const login = async (email: string, senhaDigitada: string) => {
    try {
      const response = await api.post('/login', { email, senha: senhaDigitada });
      const { token: jwtToken, user: userData } = response.data;
      saveToken(jwtToken);
      const userData2: User = {
        id: String(userData.id),
        nome: userData.nome,
        email: userData.email,
        role: userData.role,
      };
      setUser(userData2);
      await AsyncStorage.setItem('@medsalus:token', jwtToken);
      await AsyncStorage.setItem('@medsalus:user', JSON.stringify(userData2));
      if (userData.role === 'responsavel') {
        await loadDependentes();
      }
      // Registra push token após login bem-sucedido
      registrarPushToken(Number(userData.id), jwtToken).catch(console.warn);
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Erro de conexão. Verifique se o servidor está rodando.'));
    }
  };

  const logout = () => {
    saveToken(null);
    setUser(null);
    setDependentes([]);
    setMedications([]);
    AsyncStorage.multiRemove(['@medsalus:token', '@medsalus:user']);
  };

  const signUp = async (email: string, senha: string, nome: string) => {
    try {
      await api.post('/signup', { nome, email, senha });
      await login(email, senha);
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Erro de conexão. Verifique se o servidor está rodando.'));
    }
  };

  // Dependentes

  const addDependente = async (dependente: { nome: string; email: string; senha: string }) => {
    try {
      const response = await api.post('/dependentes', dependente, { headers: authHeader() });
      setDependentes((prev) => [...prev, response.data.dependente]);
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Erro ao cadastrar dependente.'));
    }
  };

  const updateDependente = async (id: string, dados: { nome: string; email: string }) => {
    try {
      const response = await api.put(`/dependentes/${id}`, dados, { headers: authHeader() });
      setDependentes((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...response.data } : d))
      );
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Erro ao editar dependente.'));
    }
  };

  const deleteDependente = async (id: string) => {
    try {
      await api.delete(`/dependentes/${id}`, { headers: authHeader() });
      setDependentes((prev) => prev.filter((d) => d.id !== id));
      setMedications((prev) => prev.filter((m) => m.dependenteId !== id));
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Erro ao remover dependente.'));
    }
  };

  // Medicamentos

  const parseDias = (dias: unknown): string[] =>
    Array.isArray(dias) ? (dias as string[]) : JSON.parse(dias as string);

  const loadMedications = async (dependenteId: string) => {
    try {
      const response = await api.get(`/medicamentos/${dependenteId}`, { headers: authHeader() });
      setMedications((prev) => [
        ...prev.filter((m) => m.dependenteId !== dependenteId),
        ...response.data.map((m: MedicamentoAPI) => ({
          id: String(m.id),
          nome: m.nome,
          dose: m.dose,
          horario: m.horario,
          dias: parseDias(m.dias),
          dependenteId: String(m.dependente_id),
        })),
      ]);
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Erro ao carregar medicamentos.'));
    }
  };

  const addMedication = async (med: Omit<Medicamento, 'id'> & { dependenteId: string }) => {
    try {
      const response = await api.post(
        '/medicamentos',
        {
          dependente_id: med.dependenteId,
          nome: med.nome,
          dose: med.dose,
          horario: med.horario,
          dias: med.dias,
          compartimento: med.compartimento,
        },
        { headers: authHeader() }
      );
      const m: MedicamentoAPI = response.data;
      setMedications((prev) => [
        ...prev,
        {
          id: String(m.id),
          nome: m.nome,
          dose: m.dose,
          horario: m.horario,
          dias: parseDias(m.dias),
          compartimento: m.compartimento,
          dependenteId: String(m.dependente_id),
        },
      ]);
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Erro ao salvar medicamento.'));
    }
  };

  const updateMedication = async (updatedMed: Medicamento) => {
    try {
      const response = await api.put(
        `/medicamentos/${updatedMed.id}`,
        {
          nome: updatedMed.nome,
          dose: updatedMed.dose,
          horario: updatedMed.horario,
          dias: updatedMed.dias,
        },
        { headers: authHeader() }
      );
      const m: MedicamentoAPI = response.data;
      setMedications((prev) =>
        prev.map((item) =>
          item.id === updatedMed.id
            ? { ...item, nome: m.nome, dose: m.dose, horario: m.horario, dias: parseDias(m.dias) }
            : item
        )
      );
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Erro ao atualizar medicamento.'));
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      await api.delete(`/medicamentos/${id}`, { headers: authHeader() });
      setMedications((prev) => prev.filter((m) => String(m.id) !== String(id)));
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Erro ao remover medicamento.'));
    }
  };

  return (
    <AuthContext.Provider value={{
      user, token, dependentes, medications,
      login, logout, signUp,
      addDependente, updateDependente, deleteDependente,
      addMedication, updateMedication, deleteMedication, loadMedications,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);