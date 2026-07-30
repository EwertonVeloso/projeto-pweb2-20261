import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api.ts';
import { logout } from './authSlice.ts';
import type { SpendingLimit, NewSpendingLimit, Transaction } from '../../types';

export const fetchSpendingLimits = createAsyncThunk(
  'spendingLimits/fetchSpendingLimits',
  async (_, thunkAPI) => {
    try {
      const response = await api.get<SpendingLimit[]>('/spending-limits');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Falha ao carregar limites';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createSpendingLimit = createAsyncThunk(
  'spendingLimits/createSpendingLimit',
  async (data: NewSpendingLimit, thunkAPI) => {
    try {
      const response = await api.post<SpendingLimit>('/spending-limits', data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Falha ao criar limite';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteSpendingLimit = createAsyncThunk(
  'spendingLimits/deleteSpendingLimit',
  async (id: number, thunkAPI) => {
    try {
      await api.delete(`/spending-limits/${id}`);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Falha ao excluir limite';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface SpendingLimitsState {
  items: SpendingLimit[];
  status: Status;
  error: string | null;
}

const initialState: SpendingLimitsState = {
  items: [],
  status: 'idle',
  error: null,
};

const spendingLimitsSlice = createSlice({
  name: 'spendingLimits',
  initialState,
  reducers: {
    clearSpendingLimitError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => initialState)
      .addCase(fetchSpendingLimits.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSpendingLimits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSpendingLimits.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createSpendingLimit.pending, (state) => {
        state.error = null;
      })
      .addCase(createSpendingLimit.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createSpendingLimit.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteSpendingLimit.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteSpendingLimit.fulfilled, (state, action) => {
        state.items = state.items.filter((l) => l.id !== action.payload);
      })
      .addCase(deleteSpendingLimit.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSpendingLimitError } = spendingLimitsSlice.actions;

export interface SpendingStatusItem {
  id: number;
  categoryId: number;
  categoryName: string;
  limitAmount: number;
  spent: number;
  percentUsed: number;
}

export const selectSpendingStatus = (state: {
  spendingLimits: SpendingLimitsState;
  transactions: { dashboardItems: Transaction[] };
}): SpendingStatusItem[] => {
  const { items } = state.spendingLimits;
  const expenses = state.transactions.dashboardItems.filter(
    (t) => t.type === 'EXPENSE'
  );

  return items.map((limit) => {
    const spent = expenses
      .filter((t) => t.categoryId === limit.categoryId)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const percentUsed = limit.limitAmount > 0
      ? Math.round((spent / limit.limitAmount) * 100)
      : 0;

    return {
      id: limit.id,
      categoryId: limit.categoryId,
      categoryName: limit.categoryName,
      limitAmount: limit.limitAmount,
      spent,
      percentUsed,
    };
  });
};

export default spendingLimitsSlice.reducer;
