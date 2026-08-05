import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { createSpendingLimit } from '../../store/slices/spendingLimitsSlice';
import { fetchCategories } from '../../store/slices/transactionSlice';

interface SpendingLimitFormProps {
  onSuccess?: () => void;
}

export default function SpendingLimitForm({ onSuccess }: SpendingLimitFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, categoriesStatus } = useSelector(
    (state: RootState) => state.transactions
  );

  const [categoryId, setCategoryId] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [categoriesStatus, dispatch]);

  // Se o usuário ainda não escolheu uma categoria, usa a primeira carregada
  const effectiveCategoryId =
    categoryId || (categories.length > 0 ? String(categories[0].id) : '');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!effectiveCategoryId) {
      setError('Selecione uma categoria.');
      return;
    }
    if (!limitAmount || parseFloat(limitAmount) <= 0) {
      setError('Informe um valor maior que zero.');
      return;
    }

    try {
      setLoading(true);
      await dispatch(
        createSpendingLimit({
          categoryId: parseInt(effectiveCategoryId, 10),
          limitAmount: parseFloat(limitAmount),
        })
      ).unwrap();
      onSuccess?.();
    } catch (err) {
      setError(typeof err === 'string' && err ? err : 'Erro ao criar limite.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="sl-category" className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
          Categoria
        </label>
        <select
          id="sl-category"
          value={effectiveCategoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-shadow duration-150"
        >
          {categoriesStatus === 'loading' && <option value="">Carregando...</option>}
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sl-amount" className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
          Valor Limite Mensal (R$)
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-sm text-gray-400 dark:text-gray-500 pointer-events-none select-none">
            R$
          </span>
          <input
            id="sl-amount"
            type="number"
            placeholder="0,00"
            step="0.01"
            min="0.01"
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-9 pr-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-shadow duration-150"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-1 border-t border-gray-100 dark:border-gray-800">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-sm transition-all duration-150 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
