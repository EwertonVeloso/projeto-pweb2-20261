interface TransactionExportSectionProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export default function TransactionExportSection({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: TransactionExportSectionProps) {
  return (
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
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
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
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {(startDate || endDate) && (
          <button
            onClick={() => {
              onStartDateChange('');
              onEndDateChange('');
            }}
            className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            Limpar Período
          </button>
        )}
      </div>
      {(startDate || endDate) && (
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          O CSV exportado conterá apenas transações dentro do período selecionado.
        </p>
      )}
    </div>
  );
}
