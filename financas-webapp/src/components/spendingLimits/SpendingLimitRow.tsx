import { useState } from 'react';
import type { SpendingStatusItem } from '../../store/slices/spendingLimitsSlice';

interface SpendingLimitRowProps {
  item: SpendingStatusItem;
  onDelete: () => void;
}

function getProgressColor(percent: number): string {
  if (percent >= 100) return 'bg-red-500';
  if (percent >= 80) return 'bg-yellow-500';
  return 'bg-emerald-500';
}

function getTextColor(percent: number): string {
  if (percent >= 100) return 'text-red-600 dark:text-red-400';
  if (percent >= 80) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-emerald-600 dark:text-emerald-400';
}

export default function SpendingLimitRow({ item, onDelete }: SpendingLimitRowProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
    }
  };

  const percent = item.percentUsed;
  const clampedPercent = Math.min(percent, 100);
  const formatted = (n: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
  const barColor = getProgressColor(percent);
  const textColor = getTextColor(percent);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {item.categoryName}
        </h3>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-40"
          title="Excluir limite"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">Gasto atual</span>
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          {formatted(item.spent)}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">Limite mensal</span>
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          {formatted(item.limitAmount)}
        </span>
      </div>

      <div className="mt-1">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className={textColor + ' font-semibold'}>
            {percent}% utilizado
          </span>
        </div>
        <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${clampedPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
