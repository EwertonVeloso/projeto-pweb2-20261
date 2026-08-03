import { FilterX } from 'lucide-react';

export interface Category {
  id: number;
  name: string;
}

interface FiltroRelatoriosProps {
  filters: {
    month: string;
    year: string;
    categoryId: number | '';
    type: 'INCOME' | 'EXPENSE' | '';
  };
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  onCategoryIdChange: (categoryId: number | '') => void;
  onTypeChange: (type: 'INCOME' | 'EXPENSE' | '') => void;
  onClear: () => void;
  categories: Category[];
}

const MONTHS = [
  { value: 'all', label: 'Todos os Meses' },
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

const YEARS = [
  { value: 'all', label: 'Todos os Anos' },
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
  { value: '2027', label: '2027' },
];

export default function FiltroRelatorios({
  filters,
  onMonthChange,
  onYearChange,
  onCategoryIdChange,
  onTypeChange,
  onClear,
  categories,
}: FiltroRelatoriosProps) {
  const hasActiveFilters =
    filters.month !== 'all' ||
    filters.year !== 'all' ||
    filters.categoryId !== '' ||
    filters.type !== '';

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm mb-8 flex flex-wrap gap-4 items-end animate-surgir">
      {/* Filtro de Ano */}
      <div className="flex-1 min-w-[150px]">
        <label htmlFor="report-filter-year" className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
          Ano
        </label>
        <select
          id="report-filter-year"
          value={filters.year}
          onChange={(e) => onYearChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all"
        >
          {YEARS.map((y) => (
            <option key={y.value} value={y.value}>
              {y.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro de Mês */}
      <div className="flex-1 min-w-[150px]">
        <label htmlFor="report-filter-month" className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
          Mês
        </label>
        <select
          id="report-filter-month"
          value={filters.month}
          onChange={(e) => onMonthChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all"
        >
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro de Categoria */}
      <div className="flex-1 min-w-[180px]">
        <label htmlFor="report-filter-category" className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
          Categoria
        </label>
        <select
          id="report-filter-category"
          value={filters.categoryId}
          onChange={(e) => onCategoryIdChange(e.target.value ? Number(e.target.value) : '')}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all"
        >
          <option value="">Todas as Categorias</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro de Tipo */}
      <div className="flex-1 min-w-[150px]">
        <label htmlFor="report-filter-type" className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
          Tipo
        </label>
        <select
          id="report-filter-type"
          value={filters.type}
          onChange={(e) => onTypeChange(e.target.value as any)}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition-all"
        >
          <option value="">Todos os Tipos</option>
          <option value="INCOME">Receitas</option>
          <option value="EXPENSE">Despesas</option>
        </select>
      </div>

      {/* Botão de Limpar */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-400 border border-rose-150 dark:border-rose-900/30 rounded-xl transition-all duration-200 h-[42px]"
        >
          <FilterX className="h-4 w-4" />
          <span>Limpar</span>
        </button>
      )}
    </div>
  );
}
