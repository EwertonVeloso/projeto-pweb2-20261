import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Toast from '../common/Toast';
import TransactionTable from './TransactionTable';
import TransactionFilters from './TransactionFilters.tsx';
import TransactionExportSection from './TransactionExportSection';
import TransactionPagination from './TransactionPagination';
import type { AppDispatch, RootState } from '../../store';
import { fetchTransactions, fetchCategories } from '../../store/slices/transactionSlice';
import { exportTransactionsCsv } from '../../utils/exportTransactionsCsv';

export default function TransactionListContent() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  const { items, status, error, currentPage, totalPages, categories } = useSelector(
    (state: RootState) => state.transactions
  );

  const [showToast, setShowToast] = useState(false);

  // Filtros locais
  const [filterType, setFilterType] = useState<'INCOME' | 'EXPENSE' | ''>('');
  const [filterCategory, setFilterCategory] = useState<number | ''>('');

  // Filtros de período para exportação CSV
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');

  // Captura o toast de sucesso se veio redirecionado de /transactions/new
  useEffect(() => {
    if (location.state && (location.state as any).showSuccessToast) {
      setShowToast(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Carrega transações e categorias
  useEffect(() => {
    dispatch(fetchTransactions({ page: 0, type: filterType, categoryId: filterCategory }));
    dispatch(fetchCategories());
  }, [dispatch, filterType, filterCategory]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      dispatch(
        fetchTransactions({
          page: newPage,
          type: filterType,
          categoryId: filterCategory,
        })
      );
    }
  };

  const handleClearFilters = () => {
    setFilterType('');
    setFilterCategory('');
  };

  const handleExportCsv = () => {
    exportTransactionsCsv(items, {
      startDate: exportStartDate || undefined,
      endDate: exportEndDate || undefined,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Gestão de Transações
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitore e organize suas receitas e despesas
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão exportar CSV */}
          <button
            id="btn-exportar-csv"
            onClick={handleExportCsv}
            disabled={items.length === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg shadow-sm transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Exportar CSV
          </button>

          {/* Botão nova transação */}
          <Link
            id="btn-nova-transacao"
            to="/transactions/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-sm transition-colors duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Nova Transação
          </Link>
        </div>
      </div>

      {/* Toast de sucesso */}
      {showToast && (
        <Toast
          message="Transação criada com sucesso!"
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Filtros */}
      <TransactionFilters
        filterType={filterType}
        filterCategory={filterCategory}
        categories={categories}
        onTypeChange={setFilterType}
        onCategoryChange={setFilterCategory}
        onClear={handleClearFilters}
      />

      {/* Exportação por Período */}
      <TransactionExportSection
        startDate={exportStartDate}
        endDate={exportEndDate}
        onStartDateChange={setExportStartDate}
        onEndDateChange={setExportEndDate}
      />

      {/* Estados de loading / erro */}
      {status === 'loading' && (
        <p className="mt-6 text-center text-gray-500 dark:text-gray-400 animate-pulse">
          Carregando transações...
        </p>
      )}

      {status === 'failed' && (
        <p className="mt-6 text-center text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20">
          {error}
        </p>
      )}

      {/* Tabela e Paginação */}
      {status === 'succeeded' && (
        <div className="mt-6 flex flex-col gap-4">
          <TransactionTable transactions={items} />

          {totalPages > 1 && (
            <TransactionPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
}
