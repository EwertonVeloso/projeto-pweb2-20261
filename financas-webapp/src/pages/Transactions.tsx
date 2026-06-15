import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TransactionForm from '../components/features/transactions/TransactionForm';
import type { AppDispatch, RootState } from '../store';
import { fetchTransactions } from '../store/slices/transactionSlice.ts';

export default function Transactions() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <div>
      <h2>Gestão de Transações</h2>
      
      <TransactionForm />

      {status === 'loading' && <p>Carregando...</p>}
      {status === 'failed' && <p style={{ color: 'red' }}>{error}</p>}

      {status === 'succeeded' && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Data</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Descrição</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Categoria</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Tipo</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{t.date}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{t.description}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{t.categoryName}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd', color: t.type === 'INCOME' ? 'green' : 'red' }}>
                  {t.type === 'INCOME' ? 'Receita' : 'Despesa'}
                </td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>R$ {Number(t.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}