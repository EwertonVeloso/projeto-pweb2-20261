import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../store';
import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';

export default function Register() {
  const { token } = useSelector((state: RootState) => state.auth);

  // Se já autenticado, redireciona para o dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
