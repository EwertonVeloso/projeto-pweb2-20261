import React, { Suspense } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute.tsx';

const AuthApp = React.lazy(async () => {
  const modulo = await import('mfe_auth/AuthRoutes');
  return { default: modulo.default || modulo };
});

const TransactionsApp = React.lazy(async () => {
  const modulo = await import('mfe_transactions/TransactionRoutes');
  return { default: modulo.default || modulo };
});

const DashboardApp = React.lazy(async () => {
  const modulo = await import('mfe_dashboard/Dashboard');
  return { default: modulo.default || modulo };
});


export default function App() {
  const fazerLogout = () => {
    localStorage.removeItem('financas_token');
    window.dispatchEvent(new Event('auth_changed'));
  };

  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'sans-serif', margin: '0 auto', maxWidth: '1200px' }}>
        
        {/* Menu de Navegação Global (Renderizado pelo Host) */}
        <nav style={{ padding: '1rem', background: '#eee', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
          <strong>Host App (Menu)</strong>
          <Link to="/">Dashboard</Link>
          <Link to="/transactions">Transações</Link>
          <Link to="/auth">Login</Link>
          <button onClick={fazerLogout}>Logout</button>
        </nav>

        {/* Renderização das rotas dos Microfrontends */}
        <Suspense fallback={<p>A carregar módulos...</p>}>
          <Routes>
            <Route path="/auth/*" element={<AuthApp />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardApp />} />
              <Route path="/transactions/*" element={<TransactionsApp />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

      </div>
    </BrowserRouter>
  );
}
