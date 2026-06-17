import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { api } from '../../services/api.ts';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../../types';

interface ErrorResponseData {
  message?: string;
  error?: string;
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, thunkAPI) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      let message = 'Falha na autenticação. Verifique suas credenciais.';
      if (axios.isAxiosError(error)) {
        console.error('Erro no login:', error.response?.status, error.response?.data || error.message);
        const data = error.response?.data as ErrorResponseData | undefined;
        message = data?.message || data?.error || message;
      } else if (error instanceof Error) {
        console.error('Erro no login:', error.message);
        message = error.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials: RegisterCredentials, thunkAPI) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', credentials);
      return response.data;
    } catch (error) {
      let message = 'Falha no cadastro. Tente novamente.';
      if (axios.isAxiosError(error)) {
        console.error('Erro no cadastro:', error.response?.status, error.response?.data || error.message);
        const data = error.response?.data as ErrorResponseData | undefined;
        message = data?.message || data?.error || message;
      } else if (error instanceof Error) {
        console.error('Erro no cadastro:', error.message);
        message = error.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    userName: null as string | null,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userName = null;
      localStorage.removeItem('token');
    },
    clearAuthError: (state) => {
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.userName = action.payload.name;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;