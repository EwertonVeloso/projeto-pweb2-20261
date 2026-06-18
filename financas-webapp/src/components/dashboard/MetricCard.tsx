import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  accentColor: 'purple' | 'emerald' | 'rose';
  icon: ReactNode;
  /** Aplica estilo negativo (vermelho) ao valor */
  isNegative?: boolean;
}

const accentStyles = {
  purple: {
    bar: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    iconBg: 'bg-purple-50 dark:bg-purple-950/40',
    iconText: 'text-purple-600 dark:text-purple-400',
  },
  emerald: {
    bar: 'bg-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconText: 'text-emerald-600 dark:text-emerald-400',
  },
  rose: {
    bar: 'bg-rose-500',
    iconBg: 'bg-rose-50 dark:bg-rose-950/40',
    iconText: 'text-rose-600 dark:text-rose-400',
  },
};

export default function MetricCard({ label, value, accentColor, icon, isNegative }: MetricCardProps) {
  const styles = accentStyles[accentColor];

  const valueColor = isNegative
    ? 'text-rose-600 dark:text-rose-400'
    : accentColor === 'emerald'
      ? 'text-emerald-600 dark:text-emerald-400'
      : accentColor === 'rose'
        ? 'text-rose-600 dark:text-rose-400'
        : 'text-gray-900 dark:text-white';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute top-0 left-0 right-0 h-[4px] ${styles.bar}`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {label}
          </p>
          <h3 className={`text-2xl sm:text-3xl font-bold mt-2 tracking-tight transition-colors ${valueColor}`}>
            {value}
          </h3>
        </div>
        <div className={`p-3 ${styles.iconBg} rounded-xl ${styles.iconText} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
