import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, fetchCategories } from '../../financas-webapp/src/store/slices/transactionSlice';
import type { AppDispatch, RootState } from '../../financas-webapp/src/store';
import { useReportFilters } from './hooks/useReportFilters';
import {
  selectFilteredTransactions,
  selectReportTotals,
  selectExpensesByCategory,
  selectIncomeVsExpensesData,
  selectBalanceEvolutionData,
} from './selectors/reportSelectors';
import CardTotalizador from './components/CardTotalizador';
import FiltroRelatorios from './components/FiltroRelatorios';
import GraficoDespesas from './components/GraficoDespesas';
import GraficoComparativo from './components/GraficoComparativo';
import GraficoEvolucao from './components/GraficoEvolucao';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { filters, setMonth, setYear, setCategoryId, setType, clearFilters } = useReportFilters();

  // Consumir estado do host Redux
  const { status, error, categories } = useSelector((state: RootState) => state.transactions);

  // Carregar transações em lote (size = 10000) e categorias na montagem
  useEffect(() => {
    dispatch(fetchTransactions({ page: 0, size: 10000 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Obter todo o estado para passar aos seletores
  const state = useSelector((state: RootState) => state);

  // Processar dados usando os seletores derivados em memória
  const filteredTransactions = selectFilteredTransactions(state, filters);
  const totals = selectReportTotals(filteredTransactions);
  const expensesByCategory = selectExpensesByCategory(filteredTransactions);
  const incomeVsExpenses = selectIncomeVsExpensesData(filteredTransactions);
  const balanceEvolution = selectBalanceEvolutionData(filteredTransactions, filters);

  const isLoading = status === 'loading';
  const isFailed = status === 'failed';

  return (
    <div className="p-6 max-w-7xl mx-auto animate-surgir">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Relatórios & Análise
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Visualize gráficos detalhados, tendências de despesas, receitas e evolução do saldo
        </p>
      </div>

      {/* Seção de Filtros */}
      <FiltroRelatorios
        filters={filters}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onCategoryIdChange={setCategoryId}
        onTypeChange={setType}
        onClear={clearFilters}
        categories={categories}
      />

      {/* Estados Visuais */}
      {isFailed && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 rounded-2xl p-6 text-center shadow-sm mb-8 animate-surgir">
          <svg className="mx-auto h-12 w-12 text-rose-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-bold text-rose-800 dark:text-rose-450">Falha ao carregar relatórios</h3>
          <p className="text-sm text-rose-600 dark:text-rose-400/80 mt-1">{error}</p>
          <button
            onClick={() => dispatch(fetchTransactions({ page: 0, size: 10000 }))}
            className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-all"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {isLoading ? (
        // Skeleton Loader
        <div className="space-y-8 animate-pulse">
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            ))}
          </div>
          {/* Charts skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          </div>
          <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
      ) : (
        !isFailed && (
          <div className="space-y-8">
            {/* Cards Totalizadores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CardTotalizador
                title="Total de Receitas"
                value={totals.income}
                type="income"
              />
              <CardTotalizador
                title="Total de Despesas"
                value={totals.expense}
                type="expense"
              />
              <CardTotalizador
                title="Saldo do Período"
                value={totals.balance}
                type="balance"
              />
            </div>

            {/* Grid de Gráficos Superior */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico 1: Despesas por Categoria */}
              <div className="h-[370px]">
                <GraficoDespesas data={expensesByCategory} />
              </div>

              {/* Gráfico 2: Receitas vs Despesas */}
              <div className="h-[370px]">
                <GraficoComparativo data={incomeVsExpenses} />
              </div>
            </div>

            {/* Gráfico Inferior: Evolução do Saldo */}
            <div className="h-[370px]">
              <GraficoEvolucao data={balanceEvolution} />
            </div>
          </div>
        )
      )}
    </div>
  );
}
