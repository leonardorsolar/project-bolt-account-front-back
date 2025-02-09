import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CreditCard, LogOut, Wallet } from 'lucide-react';

export function Dashboard() {
  const { user, balance, transactions, logout, deposit, withdraw, transfer } = useAuth();
  const [amount, setAmount] = useState('');
  const [destinationAccount, setDestinationAccount] = useState('');
  const [activeOperation, setActiveOperation] = useState<'deposit' | 'withdraw' | 'transfer' | null>(null);

  const handleOperation = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return;

    switch (activeOperation) {
      case 'deposit':
        deposit(value);
        break;
      case 'withdraw':
        withdraw(value);
        break;
      case 'transfer':
        if (destinationAccount) {
          transfer(value, destinationAccount);
        }
        break;
    }

    setAmount('');
    setDestinationAccount('');
    setActiveOperation(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Olá, {user?.name}</h1>
          <p className="text-gray-600">Agência: {user?.agency} | Conta: {user?.accountNumber}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold">Saldo Atual</h2>
          </div>
          <p className="text-3xl font-bold">R$ {balance.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold">Operações</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveOperation('deposit')}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Depositar
            </button>
            <button
              onClick={() => setActiveOperation('withdraw')}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Sacar
            </button>
            <button
              onClick={() => setActiveOperation('transfer')}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Transferir
            </button>
          </div>
        </div>
      </div>

      {activeOperation && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4">
            {activeOperation === 'deposit' && 'Realizar Depósito'}
            {activeOperation === 'withdraw' && 'Realizar Saque'}
            {activeOperation === 'transfer' && 'Realizar Transferência'}
          </h3>
          <div className="space-y-4">
            {activeOperation === 'transfer' && (
              <input
                type="text"
                placeholder="Número da conta de destino"
                value={destinationAccount}
                onChange={(e) => setDestinationAccount(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            )}
            <input
              type="number"
              placeholder="Valor"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={handleOperation}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Histórico de Transações</h2>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between items-center p-4 border rounded-md"
            >
              <div>
                <p className="font-semibold">{transaction.description}</p>
                <p className="text-sm text-gray-600">
                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <p
                className={`font-semibold ${
                  transaction.type === 'deposit'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {transaction.type === 'deposit' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}