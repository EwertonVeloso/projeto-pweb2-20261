import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api.ts';
import type { AuthResponse, LoginCredentials } from '../../types';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, thunkAPI) => {
    try {
      const response = await api.post<AuthResponse>('/auth', credentials); 
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Authentication failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    userName: null as string | null,
    status: 'idle',
    error: null as string | null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userName = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.status = 'loading'; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.userName = action.payload.user.name;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;