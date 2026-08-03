interface GoalProgressProps {
  percent: number;
  /** Show percentage label. Defaults to true. */
  showLabel?: boolean;
}

function getBarColor(percent: number): string {
  if (percent >= 100) return 'bg-emerald-500';
  if (percent >= 60) return 'bg-indigo-500';
  return 'bg-indigo-400';
}

function getLabelColor(percent: number): string {
  if (percent >= 100) return 'text-emerald-600 dark:text-emerald-400';
  if (percent >= 60) return 'text-indigo-600 dark:text-indigo-400';
  return 'text-gray-500 dark:text-gray-400';
}

export default function GoalProgress({ percent, showLabel = true }: GoalProgressProps) {
  const clamped = Math.min(percent, 100);
  const barColor = getBarColor(percent);
  const labelColor = getLabelColor(percent);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className={`font-semibold ${labelColor}`}>
            {percent >= 100 ? '✓ Meta atingida!' : `${percent}% concluído`}
          </span>
          <span className="text-gray-400 dark:text-gray-500">{clamped}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progresso: ${clamped}%`}
        />
      </div>
    </div>
  );
}
