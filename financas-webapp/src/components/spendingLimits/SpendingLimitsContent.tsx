import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store';
import {
  deleteSpendingLimit,
  fetchSpendingLimits,
  selectSpendingStatus,
} from '../../store/slices/spendingLimitsSlice';
import { fetchDashboardTransactions } from '../../store/slices/transactionSlice';
import SpendingLimitRow from './SpendingLimitRow';

export default function SpendingLimitsContent() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.spendingLimits);
  const { dashboardStatus } = useSelector((state: RootState) => state.transactions);
  const spendingStatus = useSelector(selectSpendingStatus);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSpendingLimits());
    }
    if (dashboardStatus === 'idle') {
      dispatch(fetchDashboardTransactions());
    }
  }, [status, dashboardStatus, dispatch]);

  return (
    <div className="p-6 max-w-4xl mx-auto animate-surgir">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extralight text-gray-800 dark:text-gray-100">
            Limites de Gastos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Defina limites mensais por categoria e acompanhe seus gastos
          </p>
        </div>
        <button
          onClick={() => navigate('/spending-limits/new')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-lg shadow-sm transition-colors duration-150"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Novo Limite
        </button>
      </div>

      {status === 'failed' && error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {status === 'loading' && (
        <p className="text-center text-gray-500 dark:text-gray-400 animate-pulse py-12">
          Carregando limites...
        </p>
      )}

      {status === 'succeeded' && spendingStatus.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">
            Nenhum limite definido
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
            Clique em "Novo Limite" para começar
          </p>
        </div>
      )}

      {status === 'succeeded' && spendingStatus.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {spendingStatus.map((item) => (
            <SpendingLimitRow
              key={item.categoryId}
              item={item}
              onDelete={() => dispatch(deleteSpendingLimit(item.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
