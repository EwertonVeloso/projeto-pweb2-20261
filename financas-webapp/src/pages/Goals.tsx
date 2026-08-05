import { Link } from 'react-router-dom';
import GoalList from '../components/goals/GoalList';

export default function Goals() {
  return (
    <div className="p-6 max-w-6xl mx-auto animate-surgir">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extralight text-gray-900 dark:text-gray-100">
            Metas Financeiras
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Acompanhe o progresso das suas metas de poupança
          </p>
        </div>
        <Link
          to="/goals/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-xl shadow-sm transition-colors duration-150 no-underline"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nova Meta
        </Link>
      </div>

      <GoalList />
    </div>
  );
}
