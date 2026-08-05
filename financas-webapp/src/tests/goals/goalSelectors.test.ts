import { describe, it, expect } from 'vitest';
import { selectGoalProgress, selectAllGoalsProgress } from '../../store/selectors/goalSelectors';
import type { RootState } from '../../store';
import type { Goal } from '../../types/goal';
import type { Transaction } from '../../types';

// Helpers

function buildState(
  goals: Goal[],
  dashboardItems: Partial<Transaction>[]
): RootState {
  return {
    goals: {
      items: goals,
      status: 'succeeded',
      error: null,
      createStatus: 'idle',
      createError: null,
    },
    transactions: {
      items: [],
      status: 'idle',
      error: null,
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      pageSize: 10,
      dashboardItems: dashboardItems as Transaction[],
      dashboardStatus: 'idle',
      dashboardError: null,
      exportItems: [],
      exportStatus: 'idle',
      exportError: null,
      categories: [],
      categoriesStatus: 'idle',
      categoriesError: null,
    },
    spendingLimits: { items: [], status: 'idle', error: null },
    auth: { token: null, userName: null, status: 'idle', error: null },
  } as unknown as RootState;
}

function income(id: number, amount: number): Partial<Transaction> {
  return { id, type: 'INCOME', amount, date: '2025-01-01', categoryId: 1, categoryName: 'X', description: '', tag: null };
}

function expense(id: number, amount: number): Partial<Transaction> {
  return { id, type: 'EXPENSE', amount, date: '2025-01-01', categoryId: 2, categoryName: 'Y', description: '', tag: null };
}

const mockGoal: Goal = {
  id: 1,
  name: 'Viagem',
  targetAmount: 5000,
  deadline: '2025-12-31',
};

// Tests

describe('goalSelectors', () => {
  describe('selectGoalProgress', () => {
    it('deve retornar null se a meta não existir', () => {
      const state = buildState([], []);
      expect(selectGoalProgress(999)(state)).toBeNull();
    });

    it('deve retornar 0% quando não há nenhuma transação', () => {
      const state = buildState([mockGoal], []);
      const result = selectGoalProgress(1)(state);
      expect(result?.percentComplete).toBe(0);
      expect(result?.accumulated).toBe(0);
    });

    it('deve retornar 0% quando há apenas despesas sem receitas', () => {
      const state = buildState([mockGoal], [expense(1, 2000)]);
      const result = selectGoalProgress(1)(state);
      // 0 - 2000 = -2000 → clamp a 0
      expect(result?.accumulated).toBe(0);
      expect(result?.percentComplete).toBe(0);
    });

    it('deve calcular progresso parcial com apenas receitas', () => {
      const state = buildState([mockGoal], [income(1, 2500)]);
      const result = selectGoalProgress(1)(state);
      // 2500 / 5000 * 100 = 50%
      expect(result?.accumulated).toBe(2500);
      expect(result?.percentComplete).toBe(50);
    });

    it('deve reduzir o acumulado quando há despesas', () => {
      const state = buildState(
        [mockGoal],
        [income(1, 3000), expense(2, 1000)]
      );
      const result = selectGoalProgress(1)(state);
      // (3000 - 1000) / 5000 * 100 = 40%
      expect(result?.accumulated).toBe(2000);
      expect(result?.percentComplete).toBe(40);
    });

    it('despesas maiores que receitas devem resultar em 0% (nunca negativo)', () => {
      const state = buildState(
        [mockGoal],
        [income(1, 1000), expense(2, 3000)]
      );
      const result = selectGoalProgress(1)(state);
      // 1000 - 3000 = -2000 → clamp a 0
      expect(result?.accumulated).toBe(0);
      expect(result?.percentComplete).toBe(0);
    });

    it('deve retornar 100% quando a meta é atingida (saldo líquido ≥ alvo)', () => {
      const state = buildState(
        [mockGoal],
        [income(1, 8000), expense(2, 2000)]
      );
      const result = selectGoalProgress(1)(state);
      // (8000 - 2000) / 5000 * 100 = 120% → clamp a 100%
      expect(result?.accumulated).toBe(6000);
      expect(result?.percentComplete).toBe(100);
    });

    it('deve retornar exatamente 100% quando saldo = valor alvo', () => {
      const state = buildState(
        [mockGoal],
        [income(1, 6000), expense(2, 1000)]
      );
      const result = selectGoalProgress(1)(state);
      // (6000 - 1000) / 5000 * 100 = 100%
      expect(result?.accumulated).toBe(5000);
      expect(result?.percentComplete).toBe(100);
    });

    it('não deve armazenar progresso no Redux (apenas derivado)', () => {
      const state = buildState(
        [mockGoal],
        [income(1, 2500), expense(2, 500)]
      );
      // O estado goals.items não deve conter percentComplete nem accumulated
      expect('percentComplete' in state.goals.items[0]).toBe(false);
      expect('accumulated' in state.goals.items[0]).toBe(false);
    });
  });

  describe('selectAllGoalsProgress', () => {
    it('deve retornar progresso para todas as metas usando o mesmo saldo líquido', () => {
      const goals: Goal[] = [
        { id: 1, name: 'Meta A', targetAmount: 1000, deadline: '2025-01-01' },
        { id: 2, name: 'Meta B', targetAmount: 2000, deadline: '2025-06-01' },
      ];
      // saldo líquido = 3000 - 1000 = 2000
      const state = buildState(goals, [income(1, 3000), expense(2, 1000)]);
      const result = selectAllGoalsProgress(state);

      expect(result).toHaveLength(2);
      expect(result[0].goalId).toBe(1);
      expect(result[0].accumulated).toBe(2000);
      expect(result[0].percentComplete).toBe(100); // 2000/1000 → 100%

      expect(result[1].goalId).toBe(2);
      expect(result[1].accumulated).toBe(2000);
      expect(result[1].percentComplete).toBe(100); // 2000/2000 → 100%
    });

    it('deve retornar lista vazia quando não há metas', () => {
      const state = buildState([], [income(1, 5000)]);
      expect(selectAllGoalsProgress(state)).toHaveLength(0);
    });
  });
});
