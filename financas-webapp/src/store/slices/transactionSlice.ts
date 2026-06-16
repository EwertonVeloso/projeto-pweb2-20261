import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';
import { api } from '../../services/api';
import type { NewTransaction, PageResponse, Transaction } from '../../types';
import type { RootState } from '../index';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, thunkAPI) => {
    try {
      const response = await api.get<PageResponse<Transaction>>('/transactions');
      return response.data.content;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao buscar transações:', error.response?.status, error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error('Erro ao buscar transações:', error.message);
      }
      return thunkAPI.rejectWithValue('Falha ao carregar transações');
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transaction: NewTransaction, thunkAPI) => {
    try {
      const response = await api.post<Transaction>('/transactions', transaction);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao criar transação:', error.response?.status, error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error('Erro ao criar transação:', error.message);
      }
      return thunkAPI.rejectWithValue('Falha ao criar transação');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [] as Transaction[],
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const selectTransactionsState = (state: RootState) => state.transactions;

export const selectAllTransactions = createSelector(
  [selectTransactionsState],
  (transactionsState) => transactionsState.items
);

export const selectCurrentMonthTransactions = createSelector(
  [selectAllTransactions],
  (transactions) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11

    return transactions.filter((t) => {
      if (!t.date) return false;
      const parts = t.date.split('-');
      if (parts.length < 2) return false;
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      return year === currentYear && month === currentMonth;
    });
  }
);

export const selectCurrentMonthTotals = createSelector(
  [selectCurrentMonthTransactions],
  (currentMonthTransactions) => {
    let income = 0;
    let expense = 0;

    currentMonthTransactions.forEach((t) => {
      const amount = Number(t.amount) || 0;
      if (t.type === 'INCOME') {
        income += amount;
      } else if (t.type === 'EXPENSE') {
        expense += amount;
      }
    });

    const balance = income - expense;

    return {
      income,
      expense,
      balance,
    };
  }
);

export const selectRecentTransactions = createSelector(
  [selectAllTransactions],
  (transactions) => {
    return [...transactions]
      .sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return b.id - a.id;
      })
      .slice(0, 5);
  }
);

export default transactionSlice.reducer;