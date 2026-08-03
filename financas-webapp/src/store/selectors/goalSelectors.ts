import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Tipos internos 

export interface GoalProgress {
  goalId: number;
  /** Saldo líquido de poupança */
  accumulated: number;
  targetAmount: number;
  percentComplete: number;
}

//  Helpers

function clampPercent(value: number): number {
  return Math.min(Math.round(value), 100);
}

// Calcula o saldo líquido de poupança:
function calcNetSavings(
  totalIncome: number,
  totalExpense: number
): number {
  return Math.max(0, totalIncome - totalExpense);
}

// selectors
const selectGoalItems = (state: RootState) => state.goals.items;
const selectDashboardItems = (state: RootState) => state.transactions.dashboardItems;

/**
 * Saldo líquido derivado de todas as transações do dashboard.
 * INCOME aumenta, EXPENSE diminui o valor acumulado.
 */
const selectNetSavings = createSelector(selectDashboardItems, (items) => {
  const totalIncome = items
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = items
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return calcNetSavings(totalIncome, totalExpense);
});

// Selector por meta

/**
 * Cache de selectors memoizados por goalId.
 * Cada instância de createSelector possui seu próprio cache de resultado,
 * evitando criações desnecessárias de objetos e warnings do react-redux.
 */
const goalProgressCache = new Map<number, (state: RootState) => GoalProgress | null>();

/**
 * Factory de selector memoizado por goalId.
 * Calcula o progresso como: (receitas − despesas) / valor alvo × 100.
 * Despesas reduzem o valor acumulado. O mínimo é 0%.
 * O progresso NUNCA é armazenado no Redux — é sempre derivado.
 */
export const selectGoalProgress = (goalId: number) => {
  if (!goalProgressCache.has(goalId)) {
    goalProgressCache.set(
      goalId,
      createSelector(selectGoalItems, selectNetSavings, (goals, netSavings) => {
        const goal = goals.find((g) => g.id === goalId);
        if (!goal) return null;

        const percentComplete =
          goal.targetAmount > 0
            ? clampPercent((netSavings / goal.targetAmount) * 100)
            : 0;

        return {
          goalId,
          accumulated: netSavings,
          targetAmount: goal.targetAmount,
          percentComplete,
        };
      })
    );
  }
  return goalProgressCache.get(goalId)!;
};

/**
 * Retorna o progresso de todas as metas de uma vez
 * O saldo líquido (receitas − despesas) é compartilhado entre todas as metas.
 */
export const selectAllGoalsProgress = createSelector(
  selectGoalItems,
  selectNetSavings,
  (goals, netSavings) =>
    goals.map((goal) => {
      const percentComplete =
        goal.targetAmount > 0
          ? clampPercent((netSavings / goal.targetAmount) * 100)
          : 0;

      return {
        goalId: goal.id,
        accumulated: netSavings,
        targetAmount: goal.targetAmount,
        percentComplete,
      };
    })
);
