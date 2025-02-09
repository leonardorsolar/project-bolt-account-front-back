export interface User {
  id: string;
  name: string;
  email: string;
  accountNumber: string;
  agency: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  date: string;
  description: string;
}

export interface AuthState {
  user: User | null;
  balance: number;
  transactions: Transaction[];
  isAuthenticated: boolean;
}