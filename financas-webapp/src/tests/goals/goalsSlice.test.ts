import { describe, it, expect } from 'vitest';
import goalsReducer, {
  fetchGoals,
  createGoal,
  clearGoalCreateStatus,
} from '../../store/slices/goalsSlice';
import { logout } from '../../store/slices/authSlice';
import type { Goal } from '../../types/goal';

// Estado inicial

const initialState = {
  items: [],
  status: 'idle' as const,
  error: null,
  createStatus: 'idle' as const,
  createError: null,
};

const mockGoal: Goal = {
  id: 1,
  name: 'Viagem',
  targetAmount: 5000,
  deadline: '2025-12-31',
  categoryId: 1,
  categoryName: 'Lazer',
};

// Tests

describe('goalsSlice', () => {
  describe('estado inicial', () => {
    it('deve retornar o estado inicial correto', () => {
      const state = goalsReducer(undefined, { type: '@@INIT' });
      expect(state).toEqual(initialState);
    });
  });

  describe('reducers síncronos', () => {
    it('clearGoalCreateStatus deve resetar createStatus e createError', () => {
      const state = {
        ...initialState,
        createStatus: 'failed' as const,
        createError: 'Erro anterior',
      };
      const result = goalsReducer(state, clearGoalCreateStatus());
      expect(result.createStatus).toBe('idle');
      expect(result.createError).toBeNull();
    });

    it('logout deve resetar para o estado inicial', () => {
      const stateWithData = {
        ...initialState,
        items: [mockGoal],
        status: 'succeeded' as const,
      };
      const result = goalsReducer(stateWithData, logout());
      expect(result).toEqual(initialState);
    });
  });

  describe('fetchGoals extraReducers', () => {
    it('pending deve definir status como loading e limpar error', () => {
      const result = goalsReducer(initialState, fetchGoals.pending('', undefined));
      expect(result.status).toBe('loading');
      expect(result.error).toBeNull();
    });

    it('fulfilled deve popular items e definir status como succeeded', () => {
      const goals = [mockGoal];
      const result = goalsReducer(
        initialState,
        fetchGoals.fulfilled(goals, '', undefined)
      );
      expect(result.status).toBe('succeeded');
      expect(result.items).toEqual(goals);
    });

    it('rejected deve definir status como failed e armazenar error', () => {
      const result = goalsReducer(
        initialState,
        fetchGoals.rejected(null, '', undefined, 'Erro de rede')
      );
      expect(result.status).toBe('failed');
      expect(result.error).toBe('Erro de rede');
    });
  });

  describe('createGoal extraReducers', () => {
    it('pending deve definir createStatus como loading', () => {
      const result = goalsReducer(
        initialState,
        createGoal.pending('', { name: 'Test', targetAmount: 100, deadline: '2025-01-01' })
      );
      expect(result.createStatus).toBe('loading');
      expect(result.createError).toBeNull();
    });

    it('fulfilled deve adicionar o item à lista e definir createStatus como succeeded', () => {
      const newGoal: Goal = { id: 2, name: 'Carro', targetAmount: 30000, deadline: '2026-01-01' };
      const result = goalsReducer(
        initialState,
        createGoal.fulfilled(newGoal, '', { name: 'Carro', targetAmount: 30000, deadline: '2026-01-01' })
      );
      expect(result.createStatus).toBe('succeeded');
      expect(result.items).toContainEqual(newGoal);
    });

    it('rejected deve definir createStatus como failed e armazenar createError', () => {
      const result = goalsReducer(
        initialState,
        createGoal.rejected(
          null,
          '',
          { name: 'Carro', targetAmount: 30000, deadline: '2026-01-01' },
          'Falha ao criar meta'
        )
      );
      expect(result.createStatus).toBe('failed');
      expect(result.createError).toBe('Falha ao criar meta');
    });
  });
});
