import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/transactions/TransactionForm';

export default function NewTransaction() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/transactions');
  };

  const handleSuccess = () => {
    // Redireciona com um estado de navegação sinalizando sucesso
    navigate('/transactions', { state: { showSuccessToast: true } });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      {/* Botão de Voltar */}
      <button
        onClick={handleClose}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Voltar para Transações
      </button>

      {/* Card do Formulário */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Cadastrar Transação
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Preencha os dados abaixo para registrar uma nova movimentação
          </p>
        </div>

        <TransactionForm onClose={handleClose} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
