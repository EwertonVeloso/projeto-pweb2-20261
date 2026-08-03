import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ComparativeData {
  name: string;
  Receitas: number;
  Despesas: number;
}

interface GraficoComparativoProps {
  data: ComparativeData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 shadow-lg flex flex-col gap-1.5">
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Comparativo
        </p>
        {payload.map((item: any, idx: number) => {
          const valFormatted = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(item.value);

          const dotColor = item.name === 'Receitas' ? 'bg-emerald-500' : 'bg-rose-500';
          const textColor = item.name === 'Receitas' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';

          return (
            <div key={idx} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {item.name}:
              </span>
              <span className={`text-xs font-bold ${textColor}`}>
                {valFormatted}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function GraficoComparativo({ data }: GraficoComparativoProps) {
  const hasData = data && data.length > 0 && (data[0].Receitas > 0 || data[0].Despesas > 0);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 m-0">
          Receitas vs Despesas
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 m-0">
          Comparativo geral de entradas e saídas no período
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-[260px]">
        {!hasData ? (
          <div className="text-center text-gray-400 dark:text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5M7.5 21l3-3 3 3 5-5m0 0H14m5 0V7.5" />
            </svg>
            <p className="text-sm font-semibold">Nenhuma movimentação registrada</p>
            <p className="text-xs text-gray-400 mt-1">Registre receitas ou despesas para visualizar o comparativo</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                tickFormatter={(val) => `R$ ${val}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {value}
                  </span>
                )}
              />
              <Bar dataKey="Receitas" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={48} />
              <Bar dataKey="Despesas" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
