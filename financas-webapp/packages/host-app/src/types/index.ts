export interface User {
  id: number;
  username: string;
  name: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  categoryId: number;
  categoryName: string;
  date: string; // Formato ISO "YYYY-MM-DD"
  description: string;
  tag: string;
}