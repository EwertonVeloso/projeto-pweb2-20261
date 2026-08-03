import { useSelector } from 'react-redux';
import type { Goal } from '../../types/goal';
import { selectGoalProgress } from '../../store/selectors/goalSelectors';
import type { RootState } from '../../store';
import GoalProgress from './GoalProgress';

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

interface GoalCardProps {
  goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
  const progress = useSelector((state: RootState) => selectGoalProgress(goal.id)(state));
  const accumulated = progress?.accumulated ?? 0;
  const percentComplete = progress?.percentComplete ?? 0;

  return (
    <article
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200"
      aria-label={`Meta: ${goal.name}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
            {goal.name}
          </h3>
          {goal.category && (
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
              {goal.category}
            </span>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-xs text-gray-400 dark:text-gray-500">Prazo</p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {formatDate(goal.deadline)}
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3 py-2">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
            Acumulado
          </p>
          <p className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
            {formatCurrency(accumulated)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3 py-2">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
            Valor alvo
          </p>
          <p className="text-base font-bold text-gray-800 dark:text-gray-100 mt-0.5">
            {formatCurrency(goal.targetAmount)}
          </p>
        </div>
      </div>

      {/* Progress */}
      <GoalProgress percent={percentComplete} />
    </article>
  );
}
