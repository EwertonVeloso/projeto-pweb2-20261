import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { goalsService } from '../../services/goalsService';
import { logout } from './authSlice';
import type { Goal, NewGoal } from '../../types/goal';

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? fallback;
  }
  return fallback;
}

// ─── Thunks ────────────────────────────────────────────────────────────────────

export const fetchGoals = createAsyncThunk(
  'goals/fetchGoals',
  async (_, thunkAPI) => {
    try {
      return await goalsService.fetchAll();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Falha ao carregar metas'));
    }
  }
);

export const createGoal = createAsyncThunk(
  'goals/createGoal',
  async (goal: NewGoal, thunkAPI) => {
    try {
      return await goalsService.create(goal);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Falha ao criar meta'));
    }
  }
);

// ─── State ─────────────────────────────────────────────────────────────────────

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface GoalsState {
  items: Goal[];
  status: Status;
  error: string | null;
  createStatus: Status;
  createError: string | null;
}

const initialState: GoalsState = {
  items: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  createError: null,
};

// ─── Slice ─────────────────────────────────────────────────────────────────────

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    clearGoalCreateStatus(state) {
      state.createStatus = 'idle';
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => initialState)

      // fetchGoals
      .addCase(fetchGoals.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // createGoal
      .addCase(createGoal.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload as string;
      });
  },
});

export const { clearGoalCreateStatus } = goalsSlice.actions;
export default goalsSlice.reducer;
