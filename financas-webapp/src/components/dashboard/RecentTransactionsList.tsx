import { Link } from 'react-router-dom';
import type { Transaction } from '../../types';

interface RecentTransactionsListProps {
  transactions: Transaction[];
  isLoading: boolean;
  formatCurrency: (value: number) => string;
  formatDate: (dateString: string) => string;
}

function LoadingSkeleton() {
  return (
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
  );
}

function EmptyState() {
  return (
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
  );
}

export default function RecentTransactionsList({
  transactions,
  isLoading,
  formatCurrency,
  formatDate,
}: RecentTransactionsListProps) {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center">
        <h2 className="text-lg font-extralight text-gray-900 dark:text-white m-0">
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
        <LoadingSkeleton />
      ) : transactions.length === 0 ? (
        <EmptyState />
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
              {transactions.map((t) => (
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
  );
}
