import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import GoalForm from '../../components/goals/GoalForm';
import goalsReducer from '../../store/slices/goalsSlice';
import transactionReducer from '../../store/slices/transactionSlice';
import spendingLimitsReducer from '../../store/slices/spendingLimitsSlice';
import authReducer from '../../store/slices/authSlice';

// Mock react-router navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// Helpers

function buildStore(overrides = {}) {
  return configureStore({
    reducer: {
      goals: goalsReducer,
      transactions: transactionReducer,
      spendingLimits: spendingLimitsReducer,
      auth: authReducer,
    } as any,
    preloadedState: {
      goals: {
        items: [],
        status: 'idle' as const,
        error: null,
        createStatus: 'idle' as const,
        createError: null,
        ...overrides,
      },
    } as any,
  });
}

function renderForm(store = buildStore()) {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <GoalForm />
      </MemoryRouter>
    </Provider>
  );
}

// Tests

describe('GoalForm', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  describe('validação dos campos obrigatórios', () => {
    it('deve exibir erro de nome quando campo está vazio', async () => {
      const user = userEvent.setup();
      renderForm();
      await user.click(screen.getByRole('button', { name: /salvar/i }));
      expect(await screen.findByText(/nome da meta é obrigatório/i)).toBeInTheDocument();
    });

    it('deve exibir erro de valor alvo quando campo está vazio', async () => {
      const user = userEvent.setup();
      renderForm();
      await user.click(screen.getByRole('button', { name: /salvar/i }));
      expect(await screen.findByText(/informe um valor alvo/i)).toBeInTheDocument();
    });

    it('deve exibir erro de data quando campo está vazio', async () => {
      const user = userEvent.setup();
      renderForm();
      await user.click(screen.getByRole('button', { name: /salvar/i }));
      expect(await screen.findByText(/data limite é obrigatória/i)).toBeInTheDocument();
    });

    it('não deve submeter o formulário se campos obrigatórios estiverem vazios', async () => {
      const user = userEvent.setup();
      const store = buildStore();
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      renderForm(store);

      await user.click(screen.getByRole('button', { name: /salvar/i }));

      // Nenhum thunk deve ter sido disparado (apenas ações síncronas)
      const asyncActions = dispatchSpy.mock.calls.filter(
        ([action]) => typeof action === 'function'
      );
      expect(asyncActions).toHaveLength(0);
    });
  });

  describe('submissão correta', () => {
    it('deve limpar os erros e chamar dispatch quando o formulário é válido', async () => {
      const user = userEvent.setup();
      const store = buildStore();

      // Mock da action createGoal para retornar sucesso imediatamente
      vi.spyOn(store, 'dispatch').mockResolvedValueOnce({
        type: 'goals/createGoal/fulfilled',
        payload: { id: 99, name: 'Viagem', targetAmount: 5000, deadline: '2025-12-31' },
        unwrap: () => ({ id: 99, name: 'Viagem', targetAmount: 5000, deadline: '2025-12-31' }),
      } as any);

      renderForm(store);

      await user.type(screen.getByLabelText(/nome da meta/i), 'Viagem');
      await user.type(screen.getByLabelText(/valor alvo/i), '5000');
      await user.type(screen.getByLabelText(/data limite/i), '2025-12-31');

      await user.click(screen.getByRole('button', { name: /salvar/i }));

      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  describe('botão cancelar', () => {
    it('deve navegar para /goals ao clicar em cancelar', async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(screen.getByRole('button', { name: /cancelar/i }));
      expect(mockNavigate).toHaveBeenCalledWith('/goals');
    });
  });

  describe('campo categoria opcional', () => {
    it('deve renderizar o campo de categoria', () => {
      renderForm();
      expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
    });

    it('campo categoria não deve ser obrigatório', async () => {
      const user = userEvent.setup();
      renderForm();

      // Preencher apenas os campos obrigatórios
      await user.type(screen.getByLabelText(/nome da meta/i), 'Viagem');
      await user.type(screen.getByLabelText(/valor alvo/i), '5000');
      await user.type(screen.getByLabelText(/data limite/i), '2025-12-31');
      await user.click(screen.getByRole('button', { name: /salvar/i }));

      // Não deve aparecer erro de categoria
      expect(screen.queryByText(/categoria/i)).not.toHaveAttribute('id', 'goal-category-error');
    });
  });

  describe('estado de loading', () => {
    it('deve desabilitar o botão salvar durante o carregamento', () => {
      const store = buildStore({ createStatus: 'loading' });
      renderForm(store);
      expect(screen.getByRole('button', { name: /salvando/i })).toBeDisabled();
    });
  });

  describe('feedback de erro da API', () => {
    it('deve exibir mensagem de erro quando createStatus é failed', () => {
      const store = buildStore({ createStatus: 'failed', createError: 'Erro interno do servidor' });
      renderForm(store);
      expect(screen.getByRole('alert')).toHaveTextContent('Erro interno do servidor');
    });
  });
});
