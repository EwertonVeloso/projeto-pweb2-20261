import { Link } from 'react-router-dom';
import GoalForm from '../components/goals/GoalForm';

export default function NewGoal() {
  return (
    <div className="p-6 max-w-xl mx-auto animate-surgir">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
        <Link to="/goals" className="hover:text-purple-600 dark:hover:text-indigo-400 transition-colors">
          Metas
        </Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-200 font-medium">Nova Meta</span>
      </nav>

      {/* Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Nova Meta Financeira
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Defina um objetivo e acompanhe sua evolução
          </p>
        </div>

        <GoalForm />
      </div>
    </div>
  );
}
