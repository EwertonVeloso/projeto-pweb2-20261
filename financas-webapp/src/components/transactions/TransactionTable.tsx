import type { Transaction } from '../../types';
import TransactionRow from './TransactionRow';

interface TransactionTableProps {
  transactions: Transaction[];
}

const TH = ({ children, align = 'left' }: { children: string; align?: 'left' | 'right' }) => (
  <th
    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${
      align === 'right' ? 'text-right' : 'text-left'
    }`}
  >
    {children}
  </th>
);

export default function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <TH>Data</TH>
            <TH>Descrição</TH>
            <TH>Categoria</TH>
            <TH>Tipo</TH>
            <TH align="right">Valor</TH>
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
          {transactions.map((t) => (
            <TransactionRow key={t.id} transaction={t} />
          ))}

          {transactions.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500"
              >
                Nenhuma transação encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
