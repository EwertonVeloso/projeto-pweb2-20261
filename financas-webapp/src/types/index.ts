export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  name: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  name: string;
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  categoryId: number;
  categoryName: string;
  date: string;
  description: string;
  tag: string | null;
}

export interface NewTransaction {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  categoryId: number;
  date: string;
  description?: string;
  tag?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}