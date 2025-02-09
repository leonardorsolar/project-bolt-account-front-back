import React, { createContext, useContext, useState } from 'react';
import { User, Transaction, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
  transfer: (amount: number, destinationAccount: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    balance: 0,
    transactions: [],
    isAuthenticated: false,
  });

  const login = async (email: string, password: string) => {
    // Simulação de login
    const user: User = {
      id: '1',
      name: 'João',
      email,
      accountNumber: '1234-5',
      agency: '0001',
    };

    setState({
      user,
      balance: 100, // Saldo inicial
      transactions: [],
      isAuthenticated: true,
    });
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulação de registro
    const user: User = {
      id: '1',
      name,
      email,
      accountNumber: '1234-5',
      agency: '0001',
    };

    setState({
      user,
      balance: 100,
      transactions: [],
      isAuthenticated: true,
    });
  };

  const logout = () => {
    setState({
      user: null,
      balance: 0,
      transactions: [],
      isAuthenticated: false,
    });
  };

  const addTransaction = (type: Transaction['type'], amount: number, description: string) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(),
      type,
      amount,
      date: new Date().toISOString(),
      description,
    };

    setState(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions],
    }));
  };

  const deposit = (amount: number) => {
    setState(prev => ({
      ...prev,
      balance: prev.balance + amount,
    }));
    addTransaction('deposit', amount, 'Depósito');
  };

  const withdraw = (amount: number) => {
    if (state.balance >= amount) {
      setState(prev => ({
        ...prev,
        balance: prev.balance - amount,
      }));
      addTransaction('withdrawal', amount, 'Saque');
    }
  };

  const transfer = (amount: number, destinationAccount: string) => {
    if (state.balance >= amount) {
      setState(prev => ({
        ...prev,
        balance: prev.balance - amount,
      }));
      addTransaction('transfer', amount, `Transferência para ${destinationAccount}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        deposit,
        withdraw,
        transfer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};