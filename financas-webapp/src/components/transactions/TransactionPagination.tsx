interface TransactionPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function TransactionPagination({
  currentPage,
  totalPages,
  onPageChange,
}: TransactionPaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-850 pt-4 px-1">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Página <span className="font-semibold text-gray-750 dark:text-gray-200">{currentPage + 1}</span> de{' '}
        <span className="font-semibold text-gray-750 dark:text-gray-200">{totalPages}</span>
      </span>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
        >
          Anterior
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
