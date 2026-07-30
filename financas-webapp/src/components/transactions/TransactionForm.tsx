import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { createTransaction, fetchCategories } from '../../store/slices/transactionSlice.ts';
import { selectSpendingStatus } from '../../store/slices/spendingLimitsSlice.ts';
import type { Transaction } from '../../types';

export interface TransactionFormProps {

  onClose?: () => void;
  onSuccess?: () => void;
}

const labelClass =
  'block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1';

const inputClass =
  'w-full rounded-lg border border-gray-300 dark:border-gray-600 ' +
  'bg-white dark:bg-gray-800 ' +
  'px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ' +
  'transition-shadow duration-150';

export default function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  // Carrega as categorias do Redux
  const { categories, categoriesStatus } = useSelector(
    (state: RootState) => state.transactions
  );

  // Campos controlados
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<Transaction['type']>('INCOME');

  // Data
  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const [categoryId, setCategoryId] = useState<string>('');
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Carrega as categorias
  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [categoriesStatus, dispatch]);

  // Seta a primeira categoria como padrão
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(String(categories[0].id));
    }
  }, [categories, categoryId]);

  // Submissão
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    // Validações básicas
    if (!amount || parseFloat(amount) <= 0) {
      setValidationError('Por favor, informe um valor maior que zero.');
      return;
    }
    if (!date) {
      setValidationError('Por favor, informe a data da transação.');
      return;
    }
    if (!categoryId) {
      setValidationError('Por favor, selecione uma categoria.');
      return;
    }

    setLoading(false);

    try {
      setLoading(true);
      const newAmount = parseFloat(amount);
      await dispatch(
        createTransaction({
          description: description.trim(),
          amount: newAmount,
          type,
          date,
          categoryId: parseInt(categoryId, 10),
          tag: tag.trim() || undefined,
        })
      ).unwrap();

      if (type === 'EXPENSE' && currentLimit) {
        const projectedPercent = currentLimit.limitAmount > 0
          ? Math.round(((currentLimit.spent + newAmount) / currentLimit.limitAmount) * 100)
          : 0;

        if (projectedPercent >= 80 && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            title: 'Limite de Gastos Atingido',
            body: `A categoria ${currentLimit.categoryName} atingiu ${projectedPercent}% do limite mensal de ${formatCurrency(currentLimit.limitAmount)}.`,
          });
        }
      }

      // Reset dos campos
      setDescription('');
      setAmount('');
      setTag('');

      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      setValidationError(err || 'Ocorreu um erro ao salvar a transação.');
    } finally {
      setLoading(false);
    }
  };

  const spendingStatus = useSelector(selectSpendingStatus);

  const selectedCategoryId = categoryId ? parseInt(categoryId, 10) : null;
  const currentLimit = selectedCategoryId && type === 'EXPENSE'
    ? spendingStatus.find((s) => s.categoryId === selectedCategoryId)
    : null;
  const newSpent = currentLimit
    ? currentLimit.spent + (amount ? parseFloat(amount) : 0)
    : 0;
  const newPercentUsed = currentLimit && currentLimit.limitAmount > 0
    ? Math.round((newSpent / currentLimit.limitAmount) * 100)
    : 0;
  const isOverLimit = currentLimit && newPercentUsed >= 100;

  const isIncome = type === 'INCOME';

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {validationError && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm font-medium text-red-600 dark:text-red-400">
          {validationError}
        </div>
      )}

      <div>
        <p className={labelClass}>Tipo</p>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
          {(['INCOME', 'EXPENSE'] as const).map((opt) => {
            const active = type === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setType(opt)}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${active
                    ? opt === 'INCOME'
                      ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
                      : 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
              >
                {opt === 'INCOME' ? (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 17a1 1 0 01-1-1V6.414l-2.293 2.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 6.414V16a1 1 0 01-1 1z" clipRule="evenodd" />
                    </svg>
                    Receita
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v9.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 13.586V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Despesa
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="tf-description" className={labelClass}>
          Descrição
        </label>
        <input
          id="tf-description"
          type="text"
          placeholder="Ex: Salário, Aluguel, Supermercado…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          autoComplete="off"
        />
      </div>

      {/*Categoria*/}
      <div>
        <label htmlFor="tf-category" className={labelClass}>
          Categoria
        </label>
        <select
          id="tf-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={inputClass}
          required
        >
          {categoriesStatus === 'loading' && <option value="">Carregando categorias...</option>}
          {categoriesStatus === 'failed' && <option value="">Erro ao carregar categorias</option>}
          {categories.length === 0 && categoriesStatus === 'succeeded' && (
            <option value="">Nenhuma categoria encontrada</option>
          )}
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {isOverLimit && (
          <div className="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm font-medium text-red-600 dark:text-red-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <span>
                Atenção: a categoria <strong>{currentLimit!.categoryName}</strong> já atingiu{' '}
                <strong>{newPercentUsed}%</strong> do limite mensal de{' '}
                {formatCurrency(currentLimit!.limitAmount)} com esta transação.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Valor e Data ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Valor com prefixo R$ */}
        <div>
          <label htmlFor="tf-amount" className={labelClass}>
            Valor
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-sm text-gray-400 dark:text-gray-500 pointer-events-none select-none">
              R$
            </span>
            <input
              id="tf-amount"
              type="number"
              placeholder="0,00"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        {/* Data */}
        <div>
          <label htmlFor="tf-date" className={labelClass}>
            Data
          </label>
          <input
            id="tf-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={inputClass}
          />
        </div>
      </div>

      {/*Tag (Opcional) */}
      <div>
        <label htmlFor="tf-tag" className={labelClass}>
          Tag (Opcional)
        </label>
        <input
          id="tf-tag"
          type="text"
          placeholder="Ex: lazer, trabalho, viagens…"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className={inputClass}
          autoComplete="off"
        />
      </div>

      {/* Resumo visual antes do submit*/}
      {amount && parseFloat(amount) > 0 && date && (
        <div
          className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium border ${isIncome
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
            }`}
        >
          <span>
            {isIncome ? 'Receita' : 'Despesa'}{' '}
            {categoryId && categories.length > 0
              ? `(${categories.find((c) => String(c.id) === categoryId)?.name || ''})`
              : ''}{' '}
            em {date}
          </span>
          <span className="font-semibold">
            {isIncome ? '+' : '−'} R$ {parseFloat(amount || '0').toFixed(2)}
          </span>
        </div>
      )}

      {/* Ações */}
      <div className="flex justify-end gap-3 pt-1 border-t border-gray-100 dark:border-gray-800">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-150 disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !amount || !date || !categoryId}
          className="px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-sm transition-all duration-150
            bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
        >
          {loading ? 'Salvando...' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
}
