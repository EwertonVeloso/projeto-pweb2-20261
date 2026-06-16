import { useState } from 'react';
import Modal from '../common/Modal';
import TransactionForm from './TransactionForm';

interface TransactionModalProps {
  /** Chamado após criação bem-sucedida — usado pelo pai para exibir o Toast. */
  onSuccess?: () => void;
}

export default function TransactionModal({ onSuccess }: TransactionModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  const handleSuccess = () => {
    onSuccess?.();
    handleClose();
  };

  return (
    <>
      {/* Botão de abertura */}
      <button
        id="btn-nova-transacao"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-sm transition-colors duration-150"
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
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Nova Transação
      </button>

      {/* Modal com o formulário */}
      <Modal isOpen={isOpen} onClose={handleClose} title="Nova Transação">
        <TransactionForm onClose={handleClose} onSuccess={handleSuccess} />
      </Modal>
    </>
  );
}
