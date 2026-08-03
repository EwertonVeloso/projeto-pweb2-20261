import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface CategoryData {
  name: string;
  value: number;
}

interface GraficoDespesasProps {
  data: CategoryData[];
}

const COLORS = [
  '#7c3aed', // Purple/Violet
  '#ef4444', // Red/Rose
  '#f59e0b', // Amber/Orange
  '#3b82f6', // Blue
  '#ec4899', // Pink
  '#10b981', // Emerald/Green
  '#14b8a6', // Teal
  '#8b5cf6', // Indigo
  '#f43f5e', // Rose
  '#06b6d4', // Cyan
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formattedVal = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(data.value);

    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 shadow-lg">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">
          {data.name}
        </p>
        <p className="text-sm font-extrabold text-gray-900 dark:text-white">
          {formattedVal}
        </p>
      </div>
    );
  }
  return null;
};

export default function GraficoDespesas({ data }: GraficoDespesasProps) {
  const isEmpty = data.length === 0;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 m-0">
          Despesas por Categoria
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 m-0">
          Distribuição dos gastos no período filtrado
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-[260px]">
        {isEmpty ? (
          <div className="text-center text-gray-400 dark:text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 15.071-15.071L19.5 7.5M2.25 18H21" />
            </svg>
            <p className="text-sm font-semibold">Nenhuma despesa encontrada</p>
            <p className="text-xs text-gray-400 mt-1">Altere os filtros ou registre novas despesas</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
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
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
