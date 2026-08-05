import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import GoalList from '../../components/goals/GoalList';
import goalsReducer from '../../store/slices/goalsSlice';
import transactionReducer from '../../store/slices/transactionSlice';
import spendingLimitsReducer from '../../store/slices/spendingLimitsSlice';
import authReducer from '../../store/slices/authSlice';
import type { Goal } from '../../types/goal';

// Helpers

const rootReducer = combineReducers({
  goals: goalsReducer,
  transactions: transactionReducer,
  spendingLimits: spendingLimitsReducer,
  auth: authReducer,
});

function buildStore(goals: Goal[], overrides = {}) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      goals: {
        items: goals,
        status: 'succeeded' as const,
        error: null,
        createStatus: 'idle' as const,
        createError: null,
      },
      transactions: {
        items: [],
        status: 'idle' as const,
        error: null,
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 10,
        dashboardItems: [
          // R$ 2.500 de receita
          { id: 1, type: 'INCOME' as const, amount: 2500, date: '2025-01-01', categoryId: 1, categoryName: 'Salário', description: '', tag: null },
        ],
        dashboardStatus: 'succeeded' as const,
        dashboardError: null,
        exportItems: [],
        exportStatus: 'idle' as const,
        exportError: null,
        categories: [],
        categoriesStatus: 'idle' as const,
        categoriesError: null,
      },
      spendingLimits: { items: [], status: 'idle' as const, error: null },
      ...overrides,
    },
  });
}

function renderWithStore(store: ReturnType<typeof buildStore>) {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <GoalList />
      </MemoryRouter>
    </Provider>
  );
}

// Tests

describe('GoalList', () => {
  it('deve exibir mensagem de estado vazio quando não há metas', () => {
    const store = buildStore([]);
    renderWithStore(store);
    expect(screen.getByText(/Nenhuma meta cadastrada/i)).toBeInTheDocument();
  });

  it('deve renderizar os cards de metas', () => {
    const goals: Goal[] = [
      { id: 1, name: 'Viagem', targetAmount: 5000, deadline: '2025-12-31', categoryId: 1, categoryName: 'Lazer' },
      { id: 2, name: 'Carro', targetAmount: 50000, deadline: '2027-06-01' },
    ];
    const store = buildStore(goals);
    renderWithStore(store);

    expect(screen.getByText('Viagem')).toBeInTheDocument();
    expect(screen.getByText('Carro')).toBeInTheDocument();
  });

  it('deve exibir categoria quando fornecida', () => {
    const goals: Goal[] = [
      { id: 1, name: 'Viagem', targetAmount: 5000, deadline: '2025-12-31', categoryId: 1, categoryName: 'Lazer' },
    ];
    const store = buildStore(goals);
    renderWithStore(store);
    expect(screen.getByText('Lazer')).toBeInTheDocument();
  });

  it('deve exibir barras de progresso (progressbar) para cada meta', () => {
    const goals: Goal[] = [
      { id: 1, name: 'Viagem', targetAmount: 5000, deadline: '2025-12-31' },
      { id: 2, name: 'Carro', targetAmount: 50000, deadline: '2027-06-01' },
    ];
    const store = buildStore(goals);
    renderWithStore(store);

    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(2);
  });

  it('deve exibir o valor alvo de cada meta', () => {
    const goals: Goal[] = [
      { id: 1, name: 'Viagem', targetAmount: 5000, deadline: '2025-12-31' },
    ];
    const store = buildStore(goals);
    renderWithStore(store);

    // Formatted as BRL currency
    expect(screen.getByText(/R\$\s*5\.000,00/i)).toBeInTheDocument();
  });

  it('deve exibir o estado de loading', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        goals: { items: [], status: 'loading' as const, error: null, createStatus: 'idle' as const, createError: null },
        transactions: {
          items: [], status: 'idle' as const, error: null,
          currentPage: 0, totalPages: 0, totalElements: 0, pageSize: 10,
          dashboardItems: [], dashboardStatus: 'idle' as const, dashboardError: null,
          exportItems: [], exportStatus: 'idle' as const, exportError: null,
          categories: [], categoriesStatus: 'idle' as const, categoriesError: null,
        },
        spendingLimits: { items: [], status: 'idle' as const, error: null },
        auth: { token: null, userName: null, status: 'idle' as const, error: null },
      },
    });
    renderWithStore(store);
    expect(screen.getByText(/Carregando metas/i)).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro quando fetchGoals falha', () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        goals: { items: [], status: 'failed' as const, error: 'Erro de conexão', createStatus: 'idle' as const, createError: null },
        transactions: {
          items: [], status: 'idle' as const, error: null,
          currentPage: 0, totalPages: 0, totalElements: 0, pageSize: 10,
          dashboardItems: [], dashboardStatus: 'idle' as const, dashboardError: null,
          exportItems: [], exportStatus: 'idle' as const, exportError: null,
          categories: [], categoriesStatus: 'idle' as const, categoriesError: null,
        },
        spendingLimits: { items: [], status: 'idle' as const, error: null },
        auth: { token: null, userName: null, status: 'idle' as const, error: null },
      },
    });
    renderWithStore(store);
    expect(screen.getByText('Erro de conexão')).toBeInTheDocument();
  });
});
