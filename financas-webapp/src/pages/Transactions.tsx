import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Toast from '../components/common/Toast';
import TransactionTable from '../components/transactions/TransactionTable';
import type { AppDispatch, RootState } from '../store';
import { fetchTransactions, fetchCategories } from '../store/slices/transactionSlice.ts';
import { exportTransactionsCsv } from '../utils/exportTransactionsCsv';

export default function Transactions() {
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
      // Limpa o estado no history para não exibir ao recarregar a página
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

          {/* Botão direciona para rota de criação */}
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

      {/* Seção de Filtros */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="filter-type" className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
            Tipo
          </label>
          <select
            id="filter-type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todos</option>
            <option value="INCOME">Receitas</option>
            <option value="EXPENSE">Despesas</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label htmlFor="filter-category" className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
            Categoria
          </label>
          <select
            id="filter-category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value ? Number(e.target.value) : '')}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todas</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {(filterType || filterCategory) && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {/* Seção de Exportação por Período */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
          Exportação por Período
        </h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[180px]">
            <label htmlFor="export-start-date" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Data Início
            </label>
            <input
              id="export-start-date"
              type="date"
              value={exportStartDate}
              onChange={(e) => setExportStartDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex-1 min-w-[180px]">
            <label htmlFor="export-end-date" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Data Fim
            </label>
            <input
              id="export-end-date"
              type="date"
              value={exportEndDate}
              onChange={(e) => setExportEndDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {(exportStartDate || exportEndDate) && (
            <button
              onClick={() => {
                setExportStartDate('');
                setExportEndDate('');
              }}
              className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Limpar Período
            </button>
          )}
        </div>
        {(exportStartDate || exportEndDate) && (
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            O CSV exportado conterá apenas transações dentro do período selecionado.
          </p>
        )}
      </div>

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

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-850 pt-4 px-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Página <span className="font-semibold text-gray-750 dark:text-gray-200">{currentPage + 1}</span> de{' '}
                <span className="font-semibold text-gray-750 dark:text-gray-200">{totalPages}</span>
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}