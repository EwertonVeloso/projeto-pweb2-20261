import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import type { NewTransaction, Transaction } from '../../types';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, thunkAPI) => {
    try {
      const response = await api.get<Transaction[]>('/transactions');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch transactions');
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
      return thunkAPI.rejectWithValue('Failed to create transaction');
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

export default transactionSlice.reducer;