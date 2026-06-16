import type { Transaction } from '../../types';

interface TransactionRowProps {
  transaction: Transaction;
}

export default function TransactionRow({ transaction: t }: TransactionRowProps) {
  const isIncome = t.type === 'INCOME';

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
      {/* Data */}
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
        {t.date}
      </td>

      {/* Descrição e Tag */}
      <td className="px-4 py-3 text-sm">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          {t.description || <span className="italic text-gray-400">—</span>}
        </div>
        {t.tag && (
          <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            #{t.tag}
          </span>
        )}
      </td>

      {/* Categoria */}
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
        {t.categoryName || <span className="italic text-gray-400">—</span>}
      </td>

      {/* Tipo — badge pill */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isIncome
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {isIncome ? 'Receita' : 'Despesa'}
        </span>
      </td>

      {/* Valor — verde para INCOME, vermelho para EXPENSE */}
      <td
        className={`px-4 py-3 text-sm font-semibold text-right whitespace-nowrap ${
          isIncome
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        }`}
      >
        {isIncome ? '+' : '−'} R$ {Number(t.amount).toFixed(2)}
      </td>
    </tr>
  );
}
