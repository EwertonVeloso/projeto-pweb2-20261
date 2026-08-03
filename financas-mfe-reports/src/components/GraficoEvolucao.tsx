import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface EvolutionData {
  name: string;
  Saldo: number;
}

interface GraficoEvolucaoProps {
  data: EvolutionData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const valFormatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(payload[0].value);

    const isNegative = payload[0].value < 0;
    const textColor = isNegative ? 'text-red-600 dark:text-red-400' : 'text-indigo-600 dark:text-indigo-400';

    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 shadow-lg">
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">
          Dia: {payload[0].payload.name}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Saldo acumulado:</span>
          <span className={`text-xs font-bold ${textColor}`}>{valFormatted}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function GraficoEvolucao({ data }: GraficoEvolucaoProps) {
  const isEmpty = data.length === 0 || (data.length === 1 && data[0].name === 'Sem dados');

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 m-0">
          Evolução do Saldo
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 m-0">
          Curva do saldo líquido acumulado ao longo do tempo
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-[260px]">
        {isEmpty ? (
          <div className="text-center text-gray-400 dark:text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 15.071-15.071L19.5 7.5M2.25 18H21" />
            </svg>
            <p className="text-sm font-semibold">Sem dados de movimentação</p>
            <p className="text-xs text-gray-400 mt-1">Registre transações para ver a curva de evolução</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9ca3af', fontSize: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                tickFormatter={(val) => `R$ ${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="Saldo"
                stroke="#7c3aed"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorSaldo)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
