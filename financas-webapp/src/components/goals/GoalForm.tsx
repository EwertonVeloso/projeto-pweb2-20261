import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store';
import { createGoal, clearGoalCreateStatus } from '../../store/slices/goalsSlice';
import { fetchCategories } from '../../store/slices/transactionSlice';
import type { NewGoal, GoalFormErrors } from '../../types/goal';

// ─── Validation ────────────────────────────────────────────────────────────────

function validateGoalForm(data: NewGoal): GoalFormErrors {
  const errors: GoalFormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'O nome da meta é obrigatório.';
  }

  if (!data.targetAmount || data.targetAmount <= 0) {
    errors.targetAmount = 'Informe um valor alvo maior que zero.';
  }

  if (!data.deadline) {
    errors.deadline = 'A data limite é obrigatória.';
  }

  return errors;
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface GoalFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function GoalForm({ onSuccess, onCancel }: GoalFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { createStatus, createError } = useSelector((state: RootState) => state.goals);

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [errors, setErrors] = useState<GoalFormErrors>({});

  const { categories, categoriesStatus } = useSelector(
    (state: RootState) => state.transactions
  );

  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [categoriesStatus, dispatch]);

  const isLoading = createStatus === 'loading';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearGoalCreateStatus());

    const formData: NewGoal = {
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      deadline,
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
    };

    const validationErrors = validateGoalForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      await dispatch(createGoal(formData)).unwrap();
      onSuccess?.();
      navigate('/goals');
    } catch {
      // error is handled by Redux state (createError)
    }
  };

  const handleCancel = () => {
    onCancel?.();
    navigate('/goals');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
      aria-label="Formulário de cadastro de meta"
    >
      {/* API error feedback */}
      {createStatus === 'failed' && createError && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm font-medium text-red-600 dark:text-red-400"
        >
          {createError}
        </div>
      )}

      {/* Nome */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="goal-name"
          className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
        >
          Nome da meta <span className="text-red-500">*</span>
        </label>
        <input
          id="goal-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Viagem internacional"
          disabled={isLoading}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'goal-name-error' : undefined}
          className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
            errors.name
              ? 'border-red-400 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500'
          }`}
        />
        {errors.name && (
          <span id="goal-name-error" className="text-xs font-medium text-red-600 dark:text-red-400">
            {errors.name}
          </span>
        )}
      </div>

      {/* Valor alvo */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="goal-target"
          className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
        >
          Valor alvo (R$) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-sm text-gray-400 dark:text-gray-500 pointer-events-none select-none">
            R$
          </span>
          <input
            id="goal-target"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0,00"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            disabled={isLoading}
            aria-invalid={!!errors.targetAmount}
            aria-describedby={errors.targetAmount ? 'goal-target-error' : undefined}
            className={`w-full rounded-xl border pl-9 pr-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
              errors.targetAmount
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500'
            }`}
          />
        </div>
        {errors.targetAmount && (
          <span id="goal-target-error" className="text-xs font-medium text-red-600 dark:text-red-400">
            {errors.targetAmount}
          </span>
        )}
      </div>

      {/* Data limite */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="goal-deadline"
          className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
        >
          Data limite <span className="text-red-500">*</span>
        </label>
        <input
          id="goal-deadline"
          type="date"
          min={today}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          disabled={isLoading}
          aria-invalid={!!errors.deadline}
          aria-describedby={errors.deadline ? 'goal-deadline-error' : undefined}
          className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
            errors.deadline
              ? 'border-red-400 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500'
          }`}
        />
        {errors.deadline && (
          <span id="goal-deadline-error" className="text-xs font-medium text-red-600 dark:text-red-400">
            {errors.deadline}
          </span>
        )}
      </div>

      {/* Categoria (opcional) */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="goal-category"
          className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
        >
          Categoria <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <select
          id="goal-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 disabled:opacity-60"
        >
          <option value="">Sem categoria</option>
          {categoriesStatus === 'loading' && <option value="">Carregando...</option>}
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm transition-all duration-150 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Salvando...' : 'Salvar meta'}
        </button>
      </div>
    </form>
  );
}
