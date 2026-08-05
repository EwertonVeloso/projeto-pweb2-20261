import { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import NewTransaction from './pages/NewTransaction';
import SpendingLimits from './pages/SpendingLimits';
import NewSpendingLimit from './pages/NewSpendingLimit';
import Goals from './pages/Goals';
import NewGoal from './pages/NewGoal';
import { store } from './store';

const ReportsApp = lazy(() => import('financas_mfe_reports/ReportsApp'));

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/new" element={<NewTransaction />} />
              <Route path="/spending-limits" element={<SpendingLimits />} />
              <Route path="/spending-limits/new" element={<NewSpendingLimit />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/goals/new" element={<NewGoal />} />
              <Route
                path="/reports"
                element={
                  <Suspense
                    fallback={
                      <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Carregando relatórios...
                        </p>
                      </div>
                    }
                  >
                    <ReportsApp />
                  </Suspense>
                }
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}