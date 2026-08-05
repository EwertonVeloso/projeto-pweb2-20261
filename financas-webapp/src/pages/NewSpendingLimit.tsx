import { Link } from 'react-router-dom';
import SpendingLimitForm from '../components/spendingLimits/SpendingLimitForm';

export default function NewSpendingLimit() {
  return (
    <div className="p-6 max-w-xl mx-auto animate-surgir">
      
      <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <Link
          to="/spending-limits"
          className="hover:text-purple-600 dark:hover:text-indigo-400 transition-colors"
        >
          Limites de Gastos
        </Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-200 font-medium">Novo Limite</span>
      </nav>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-xl font-extralight text-gray-900 dark:text-gray-100">
            Novo Limite de Gasto
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Defina um limite mensal por categoria e acompanhe seus gastos
          </p>
        </div>

        <SpendingLimitForm />
      </div>
    </div>
  );
}
