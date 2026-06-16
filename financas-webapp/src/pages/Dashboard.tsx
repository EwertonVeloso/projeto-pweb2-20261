import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store';
import {
  fetchTransactions,
  selectCurrentMonthTotals,
  selectRecentTransactions,
} from '../store/slices/transactionSlice';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.transactions);

  const { income, expense, balance } = useSelector(selectCurrentMonthTotals);
  const recentTransactions = useSelector(selectRecentTransactions);

  useEffect(() => {
    dispatch(fetchTransactions());
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

  const isLoading = status === 'loading';

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 animate-surgir">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight m-0">
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
      {status === 'failed' && error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3.5 text-sm text-red-600 dark:text-red-400">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card: Saldo Atual */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm animate-pulse h-32" />
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-purple-500 to-indigo-500" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Saldo Atual (Mês Corrente)
                </p>
                <h3 className={`text-2xl sm:text-3xl font-bold mt-2 tracking-tight transition-colors ${
                  balance >= 0 ? 'text-gray-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {formatCurrency(balance)}
                </h3>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12m18 0V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44l-2.118-2.118a1.5 1.5 0 0 0-1.06-.44H5.25A2.25 2.25 0 0 0 3 6v6" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Card: Receitas */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm animate-pulse h-32" />
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-emerald-500" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Receitas do Mês
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold mt-2 text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {formatCurrency(income)}
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Card: Despesas */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm animate-pulse h-32" />
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-rose-500" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Despesas do Mês
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold mt-2 text-rose-600 dark:text-rose-400 tracking-tight">
                  {formatCurrency(expense)}
                </h3>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.306-4.307a11.95 11.95 0 0 1 5.814 5.519l2.74 1.22m0 0-5.94 2.28m5.94-2.28-2.28 5.941" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid de Transações Recentes & Gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Listagem de Transações Recentes */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white m-0">
              Transações Recentes (Últimas 5)
            </h2>
            <Link
              to="/transactions"
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              Ver Todas
            </Link>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10" />
                    <div className="space-y-2">
                      <div className="bg-gray-200 dark:bg-gray-700 h-4 w-28 rounded" />
                      <div className="bg-gray-200 dark:bg-gray-700 h-3 w-16 rounded" />
                    </div>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 w-20 rounded" />
                </div>
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center flex-1">
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-full text-gray-400 dark:text-gray-600 mb-4">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                Nenhuma transação encontrada
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-1">
                Registre suas receitas e despesas para acompanhar seu resumo financeiro aqui.
              </p>
              <Link
                to="/transactions"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-sm font-semibold px-4 py-2 transition-all duration-200"
              >
                Começar a registrar
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/40 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="py-4 px-6 border-b border-gray-100 dark:border-gray-700/50">Data</th>
                    <th className="py-4 px-6 border-b border-gray-100 dark:border-gray-700/50">Descrição</th>
                    <th className="py-4 px-6 border-b border-gray-100 dark:border-gray-700/50">Categoria</th>
                    <th className="py-4 px-6 border-b border-gray-100 dark:border-gray-700/50">Tipo</th>
                    <th className="py-4 px-6 border-b border-gray-100 dark:border-gray-700/50 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {recentTransactions.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-750/30 transition-colors duration-150"
                    >
                      <td className="py-4.5 px-6 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {formatDate(t.date)}
                      </td>
                      <td className="py-4.5 px-6 text-sm text-gray-900 dark:text-white font-medium">
                        {t.description || <span className="text-gray-400 dark:text-gray-600 italic">Sem descrição</span>}
                      </td>
                      <td className="py-4.5 px-6 text-sm text-gray-600 dark:text-gray-300">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                          {t.categoryName}
                        </span>
                      </td>
                      <td className="py-4.5 px-6 text-sm">
                        {t.type === 'INCOME' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/35 text-emerald-700 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Receita
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/35 text-rose-700 dark:text-rose-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            Despesa
                          </span>
                        )}
                      </td>
                      <td className={`py-4.5 px-6 text-sm text-right font-bold ${
                        t.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(Number(t.amount))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Gráfico Donut (1 coluna) */}
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

interface DonutChartProps {
  income: number;
  expense: number;
  formatCurrency: (val: number) => string;
}

function FinancialDonutChart({ income, expense, formatCurrency }: DonutChartProps) {
  const total = income + expense;
  
  // Circunferência para raio = 70
  // C = 2 * PI * r = 2 * 3.14159 * 70 = 439.82
  const r = 70;
  const circumference = 2 * Math.PI * r;

  const incomePercentage = total > 0 ? (income / total) * 100 : 0;
  const expensePercentage = total > 0 ? (expense / total) * 100 : 0;

  const incomeStroke = (incomePercentage / 100) * circumference;
  const expenseStroke = (expensePercentage / 100) * circumference;

  const incomeOffset = 0;
  const expenseOffset = -incomeStroke;

  const netBalance = income - expense;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col justify-between h-full min-h-[350px]">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white m-0">
        Distribuição Financeira
      </h2>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 flex-1">
          <svg className="w-40 h-40" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={r}
              fill="transparent"
              stroke="#e5e7eb"
              className="dark:stroke-gray-700"
              strokeWidth="16"
            />
            <text
              x="100"
              y="105"
              textAnchor="middle"
              className="text-xs font-semibold fill-gray-400 dark:fill-gray-500"
            >
              Sem dados
            </text>
          </svg>
          <p className="text-xs text-gray-400 text-center mt-4 max-w-[180px]">
            Registre receitas e despesas neste mês para gerar o gráfico.
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-6 w-full justify-around flex-1 py-4">
          {/* SVG Chart */}
          <div className="relative w-40 h-40 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              {/* Círculo de fundo */}
              <circle
                cx="100"
                cy="100"
                r={r}
                fill="transparent"
                stroke="#f3f4f6"
                className="dark:stroke-gray-950/20"
                strokeWidth="16"
              />
              {/* Segmento de Receitas */}
              {incomeStroke > 0 && (
                <circle
                  cx="100"
                  cy="100"
                  r={r}
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="16"
                  strokeDasharray={`${incomeStroke} ${circumference - incomeStroke}`}
                  strokeDashoffset={incomeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out hover:opacity-90 cursor-pointer"
                />
              )}
              {/* Segmento de Despesas */}
              {expenseStroke > 0 && (
                <circle
                  cx="100"
                  cy="100"
                  r={r}
                  fill="transparent"
                  stroke="#f43f5e"
                  strokeWidth="16"
                  strokeDasharray={`${expenseStroke} ${circumference - expenseStroke}`}
                  strokeDashoffset={expenseOffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out hover:opacity-90 cursor-pointer"
                />
              )}
            </svg>
            
            {/* Texto Central */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500">
                Saldo Líquido
              </span>
              <span className={`text-sm font-bold mt-0.5 tracking-tight ${
                netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {formatCurrency(netBalance)}
              </span>
            </div>
          </div>

          {/* Legendas */}
          <div className="flex flex-col gap-3 w-full max-w-[200px] justify-center">
            {/* Receitas */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Receitas
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900 dark:text-white m-0">
                  {formatCurrency(income)}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold m-0">
                  {incomePercentage.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Despesas */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Despesas
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900 dark:text-white m-0">
                  {formatCurrency(expense)}
                </p>
                <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold m-0">
                  {expensePercentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
