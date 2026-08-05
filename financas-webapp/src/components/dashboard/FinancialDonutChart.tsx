interface FinancialDonutChartProps {
  income: number;
  expense: number;
  formatCurrency: (val: number) => string;
}

export default function FinancialDonutChart({ income, expense, formatCurrency }: FinancialDonutChartProps) {
  const total = income + expense;
  
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
      <h2 className="text-lg font-extralight text-gray-900 dark:text-white m-0">
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
