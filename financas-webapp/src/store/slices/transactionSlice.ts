import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api.ts';
import type { NewTransaction, Transaction, Category, PageResponse } from '../../types';

export interface FetchTransactionsParams {
  page?: number;
  size?: number;
  type?: 'INCOME' | 'EXPENSE' | '';
  categoryId?: number | '';
  startDate?: string;
  endDate?: string;
}

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params: FetchTransactionsParams | undefined, thunkAPI) => {
    try {
      const queryParams: Record<string, any> = {};
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
    } catch (error: any) {
      console.error('Erro ao buscar transações:', error.response?.status, error.response?.data || error.message);
      const message = error.response?.data?.message || 'Falha ao carregar transações';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transaction: NewTransaction, thunkAPI) => {
    try {
      const response = await api.post<Transaction>('/transactions', transaction);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar transação:', error.response?.status, error.response?.data || error.message);
      const message = error.response?.data?.message || 'Falha ao criar transação';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'transactions/fetchCategories',
  async (_, thunkAPI) => {
    try {
      const response = await api.get<Category[]>('/categories');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar categorias:', error.response?.status, error.response?.data || error.message);
      const message = error.response?.data?.message || 'Falha ao carregar categorias';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface TransactionState {
  items: Transaction[];
  status: Status;
  error: string | null;
  
  // Paginação
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;

  // Categorias
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
  },
  extraReducers: (builder) => {
    builder
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

export const { clearTransactionError } = transactionSlice.actions;
export default transactionSlice.reducer;