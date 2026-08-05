import { useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store';
import {
  fetchDashboardTransactions,
  selectDashboardTotals,
  selectRecentTransactions,
} from '../../store/slices/transactionSlice';
import MetricCard from './MetricCard';
import MetricCardSkeleton from './MetricCardSkeleton';
import RecentTransactionsList from './RecentTransactionsList';
import FinancialDonutChart from './FinancialDonutChart';

export default function DashboardContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboardStatus, dashboardError } = useSelector((state: RootState) => state.transactions);

  const { income, expense, balance } = useSelector(selectDashboardTotals);
  const recentTransactions = useSelector(selectRecentTransactions);

  useEffect(() => {
    dispatch(fetchDashboardTransactions());
  }, [dispatch]);

  const getCurrentMonthName = () => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const now = new Date();
    return `${months[now.getMonth()]} de ${now.getFullYear()}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length < 3) return dateString;
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  const isLoading = dashboardStatus === 'loading';

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 animate-surgir">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extralight text-gray-900 dark:text-white tracking-tight m-0">
            Dashboard Financeiro
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Resumo de <span className="font-semibold text-purple-600 dark:text-purple-400">{getCurrentMonthName()}</span>
          </p>
        </div>
        <Link
          to="/transactions"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 shadow-sm transition-all duration-200 hover:shadow-purple-500/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nova Transação
        </Link>
      </div>

      {/* Error Alert */}
      {dashboardStatus === 'failed' && dashboardError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3.5 text-sm text-red-600 dark:text-red-400">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <span>{dashboardError}</span>
        </div>
      )}

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              label="Saldo Atual (Mês Corrente)"
              value={formatCurrency(balance)}
              accentColor="purple"
              isNegative={balance < 0}
              icon={<Wallet className="h-6 w-6" />}
            />
            <MetricCard
              label="Receitas do Mês"
              value={formatCurrency(income)}
              accentColor="emerald"
              icon={<TrendingUp className="h-6 w-6" />}
            />
            <MetricCard
              label="Despesas do Mês"
              value={formatCurrency(expense)}
              accentColor="rose"
              icon={<TrendingDown className="h-6 w-6" />}
            />
          </>
        )}
      </div>

      {/* Grid de Transações Recentes & Gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <RecentTransactionsList
          transactions={recentTransactions}
          isLoading={isLoading}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />

        <div className="lg:col-span-1">
          <FinancialDonutChart
            income={income}
            expense={expense}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
    </div>
  );
}
