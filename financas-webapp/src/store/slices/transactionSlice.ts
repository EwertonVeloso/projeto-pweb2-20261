import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { api } from '../../services/api.ts';
import { logout } from './authSlice.ts';
import type { NewTransaction, Transaction, Category, PageResponse } from '../../types';

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? fallback;
  }
  return fallback;
}

// ─── Parâmetros ────────────────────────────────────────────────────────────────

export interface FetchTransactionsParams {
  page?: number;
  size?: number;
  type?: 'INCOME' | 'EXPENSE' | '';
  categoryId?: number | '';
  startDate?: string;
  endDate?: string;
}

export interface FetchExportParams {
  startDate?: string;
  endDate?: string;
}

/** Busca paginada para a listagem de transações */
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params: FetchTransactionsParams | undefined, thunkAPI) => {
    try {
      const queryParams: Record<string, string | number | undefined> = {};
      if (params) {
        if (params.page !== undefined) queryParams.page = params.page;
        if (params.size !== undefined) queryParams.size = params.size;
        if (params.type) queryParams.type = params.type;
        if (params.categoryId) queryParams.categoryId = params.categoryId;
        if (params.startDate) queryParams.startDate = params.startDate;
        if (params.endDate) queryParams.endDate = params.endDate;
      }

      const response = await api.get<PageResponse<Transaction>>('/transactions', {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Falha ao carregar transações'));
    }
  }
);

/** Busca todas as transações do mês para o Dashboard */
export const fetchDashboardTransactions = createAsyncThunk(
  'transactions/fetchDashboardTransactions',
  async (_, thunkAPI) => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();

      const response = await api.get<PageResponse<Transaction>>('/transactions', {
        params: {
          startDate: `${year}-${month}-01`,
          endDate: `${year}-${month}-${lastDay}`,
          size: 1000,
        },
      });
      return response.data.content;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Falha ao carregar dados do dashboard'));
    }
  }
);

/** Busca todas as transações para exportação CSV */
export const fetchExportTransactions = createAsyncThunk(
  'transactions/fetchExportTransactions',
  async (params: FetchExportParams | undefined, thunkAPI) => {
    try {
      const queryParams: Record<string, string | number | undefined> = {
        size: 10000,
      };
      if (params?.startDate) queryParams.startDate = params.startDate;
      if (params?.endDate) queryParams.endDate = params.endDate;

      const response = await api.get<PageResponse<Transaction>>('/transactions', {
        params: queryParams,
      });
      return response.data.content;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Falha ao carregar transações para exportação'));
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
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Falha ao criar transação'));
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'transactions/fetchCategories',
  async (_, thunkAPI) => {
    try {
      const response = await api.get<Category[]>('/categories');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Falha ao carregar categorias'));
    }
  }
);

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface TransactionState {
  items: Transaction[];
  status: Status;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;

  dashboardItems: Transaction[];
  dashboardStatus: Status;
  dashboardError: string | null;

  exportItems: Transaction[];
  exportStatus: Status;
  exportError: string | null;

  categories: Category[];
  categoriesStatus: Status;
  categoriesError: string | null;
}

const initialState: TransactionState = {
  items: [],
  status: 'idle',
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  pageSize: 10,

  dashboardItems: [],
  dashboardStatus: 'idle',
  dashboardError: null,

  exportItems: [],
  exportStatus: 'idle',
  exportError: null,

  categories: [],
  categoriesStatus: 'idle',
  categoriesError: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactionError(state) {
      state.error = null;
    },
    clearExportData(state) {
      state.exportItems = [];
      state.exportStatus = 'idle';
      state.exportError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => initialState)
      // fetchTransactions 
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.content;
        state.currentPage = action.payload.number;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.pageSize = action.payload.size;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // fetchDashboardTransactions 
      .addCase(fetchDashboardTransactions.pending, (state) => {
        state.dashboardStatus = 'loading';
        state.dashboardError = null;
      })
      .addCase(fetchDashboardTransactions.fulfilled, (state, action) => {
        state.dashboardStatus = 'succeeded';
        state.dashboardItems = action.payload;
      })
      .addCase(fetchDashboardTransactions.rejected, (state, action) => {
        state.dashboardStatus = 'failed';
        state.dashboardError = action.payload as string;
      })

      // fetchExportTransactions
      .addCase(fetchExportTransactions.pending, (state) => {
        state.exportStatus = 'loading';
        state.exportError = null;
      })
      .addCase(fetchExportTransactions.fulfilled, (state, action) => {
        state.exportStatus = 'succeeded';
        state.exportItems = action.payload;
      })
      .addCase(fetchExportTransactions.rejected, (state, action) => {
        state.exportStatus = 'failed';
        state.exportError = action.payload as string;
      })

      // createTransaction
      .addCase(createTransaction.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Adiciona à lista de itens se estiver na primeira página (cronológica, mais recente)
        if (state.currentPage === 0) {
          state.items = [action.payload, ...state.items].slice(0, state.pageSize);
        }
        state.totalElements += 1;
        // Mantém dashboardItems sincronizado para o selectSpendingStatus
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        if (action.payload.date.startsWith(`${year}-${month}`)) {
          state.dashboardItems = [action.payload, ...state.dashboardItems];
        }
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = 'loading';
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = 'failed';
        state.categoriesError = action.payload as string;
      });
  },
});

export const { clearTransactionError, clearExportData } = transactionSlice.actions;


// Seletores do Dashboard 
export const selectDashboardTotals = (state: { transactions: TransactionState }) => {
  let income = 0;
  let expense = 0;

  state.transactions.dashboardItems.forEach((t) => {
    if (t.type === 'INCOME') {
      income += Number(t.amount);
    } else if (t.type === 'EXPENSE') {
      expense += Number(t.amount);
    }
  });

  return {
    income,
    expense,
    balance: income - expense,
  };
};

export const selectRecentTransactions = (state: { transactions: TransactionState }) => {
  return [...state.transactions.dashboardItems]
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return b.id - a.id;
    })
    .slice(0, 5);
};

export default transactionSlice.reducer;