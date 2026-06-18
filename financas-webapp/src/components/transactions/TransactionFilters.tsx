import type { Category } from '../../types';

interface TransactionFiltersProps {
  filterType: 'INCOME' | 'EXPENSE' | '';
  filterCategory: number | '';
  categories: Category[];
  onTypeChange: (value: 'INCOME' | 'EXPENSE' | '') => void;
  onCategoryChange: (value: number | '') => void;
  onClear: () => void;
}

export default function TransactionFilters({
  filterType,
  filterCategory,
  categories,
  onTypeChange,
  onCategoryChange,
  onClear,
}: TransactionFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="filter-type" className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
          Tipo
        </label>
        <select
          id="filter-type"
          value={filterType}
          onChange={(e) => onTypeChange(e.target.value as any)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todos</option>
          <option value="INCOME">Receitas</option>
          <option value="EXPENSE">Despesas</option>
        </select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label htmlFor="filter-category" className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
          Categoria
        </label>
        <select
          id="filter-category"
          value={filterCategory}
          onChange={(e) => onCategoryChange(e.target.value ? Number(e.target.value) : '')}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todas</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {(filterType || filterCategory) && (
        <button
          onClick={onClear}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          Limpar Filtros
        </button>
      )}
    </div>
  );
}
