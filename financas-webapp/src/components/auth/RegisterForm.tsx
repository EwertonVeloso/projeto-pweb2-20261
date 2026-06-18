import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store';
import { clearAuthError, registerUser } from '../../store/slices/authSlice';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const isLoading = status === 'loading';
  const navigate = useNavigate();

  // Redirect to login after successful registration
  useEffect(() => {
    if (status === 'succeeded') {
      dispatch(clearAuthError());
      navigate('/login');
    }
  }, [status, navigate, dispatch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(registerUser({ name, username, password }));
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-white"
          style={{ fontSize: '2rem', fontWeight: 700, fontStyle: 'normal', letterSpacing: '0px', margin: 0 }}
        >
          Crie sua conta
        </h1>
        <p className="mt-2 pt-3 text-sm text-gray-400">
          Preencha os dados abaixo para começar a controlar suas finanças
        </p>
      </div>

      {/* Error alert */}
      {status === 'failed' && error && (
        <div
          className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          role="alert"
        >
          <svg
            className="h-5 w-5 shrink-0 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-gray-400">
            Nome completo
          </label>
          <input
            id="name"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="w-full rounded-lg border border-gray-600/50 bg-[#16162a] px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
          />
        </div>

        {/* Username field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="register-username" className="text-sm font-medium text-gray-400">
            Usuário
          </label>
          <input
            id="register-username"
            type="text"
            placeholder="Nome de usuário ou email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={50}
            autoComplete="username"
            className="w-full rounded-lg border border-gray-600/50 bg-[#16162a] px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
          />
        </div>

        {/* Password field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="register-password" className="text-sm font-medium text-gray-400">
            Senha
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-600/50 bg-[#16162a] px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-500 transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-[#7c3aed] py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#6d28d9] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-[#1a1a2e] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Carregando...
            </span>
          ) : (
            'Criar conta'
          )}
        </button>
      </form>

      {/* Login link */}
      <p className="mt-8 pt-4 text-sm text-gray-500">
        Já possui conta?{' '}
        <Link
          to="/login"
          className="font-semibold text-white underline underline-offset-2 transition-colors hover:text-purple-400"
        >
          Faça login
        </Link>
      </p>
    </div>
  );
}

