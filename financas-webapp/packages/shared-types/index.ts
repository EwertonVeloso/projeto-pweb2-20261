export type TransactionType = 'INCOME' | 'EXPENSE';

export interface AuthResponse {
  token: string;
  username: string;
  name: string;
}

export interface TransactionResponse {
  id: number;
  amount: number;
  type: TransactionType;
  categoryId: number;
  categoryName: string;
  date: string;
  description: string;
}