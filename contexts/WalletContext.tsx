import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, LinkedAccount } from '../types';

interface WalletContextType {
  balance: number;
  accounts: LinkedAccount[];
  transactions: Transaction[];
  addMoney: (amount: number) => void;
  addAccount: (account: LinkedAccount) => void;
  removeAccount: (id: string) => void;
  addTransaction: (transaction: Transaction) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial Dummy Data
  const [balance, setBalance] = useState<number>(4520.00);
  const [accounts, setAccounts] = useState<LinkedAccount[]>([
      { id: '1', type: 'mfs', provider: 'bKash', number: '01711***890' },
      { id: '2', type: 'mfs', provider: 'Nagad', number: '01922***123' }
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([
      { id: 'TXN2593', service: 'Mobile Recharge', provider: 'Grameenphone', amount: '1000', date: '31/12/2025, 22:18:13', method: 'bKash', recipient: '01514656466', status: 'Success' },
      { id: 'TXN1234', service: 'Electricity', provider: 'DESCO', amount: '1250', date: '20/12/2025, 14:15:00', method: 'Nagad', recipient: 'Meter: 55667788', status: 'Success' }
  ]);

  const addMoney = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const addAccount = (account: LinkedAccount) => {
    setAccounts(prev => [...prev, account]);
  };

  const removeAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  return (
    <WalletContext.Provider value={{ balance, accounts, transactions, addMoney, addAccount, removeAccount, addTransaction }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};