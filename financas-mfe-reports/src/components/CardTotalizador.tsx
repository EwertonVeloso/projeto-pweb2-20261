import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface CardTotalizadorProps {
  title: string;
  value: number;
  type: 'income' | 'expense' | 'balance';
}

export default function CardTotalizador({ title, value, type }: CardTotalizadorProps) {
  const isIncome = type === 'income';
  const isExpense = type === 'expense';

  // Formatação em Real Brasileiro (BRL)
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  // Cores dinâmicas com base no tipo
  const containerClass = type === 'balance' && value < 0
    ? 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10 border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400'
    : isIncome
      ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400'
      : isExpense
        ? 'bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/20 dark:to-rose-900/10 border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-400'
        : 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-indigo-900/10 border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-400';

  const iconContainerClass = type === 'balance' && value < 0
    ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
    : isIncome
      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
      : isExpense
        ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
        : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400';

  const renderIcon = () => {
    if (type === 'balance') {
      return <Wallet className="h-5 w-5" />;
    }
    return isIncome ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />;
  };

  return (
    <div className={`flex items-center gap-4 rounded-2xl border p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${containerClass}`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconContainerClass}`}>
        {renderIcon()}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 m-0">
          {title}
        </p>
        <h3 className="text-2xl font-bold tracking-tight mt-1 text-gray-900 dark:text-white m-0">
          {formattedValue}
        </h3>
      </div>
    </div>
  );
}
