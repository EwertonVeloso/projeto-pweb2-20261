import type { FormEvent } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store';
import { createTransaction } from '../../../store/slices/transactionSlice.ts';
import type { Transaction } from '../../../types';
import { Button } from '../../common/Button';

export default function TransactionForm() {
  const dispatch = useDispatch<AppDispatch>();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<Transaction['type']>('INCOME');
  const [date, setDate] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) return;

    dispatch(createTransaction({
      description,
      amount: parseFloat(amount),
      type,
      date
    }));

    setDescription('');
    setAmount('');
    setDate('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
      <h3>Nova Transação</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input type="text" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ flex: 1, padding: '8px' }} />
        <input type="number" placeholder="Valor (R$)" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required style={{ width: '120px', padding: '8px' }} />
        <select value={type} onChange={(e) => setType(e.target.value as Transaction['type'])} style={{ padding: '8px' }}>
          <option value="INCOME">Receita</option>
          <option value="EXPENSE">Despesa</option>
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ padding: '8px' }} />
      </div>
      <Button type="submit" variant="primary">Adicionar</Button>
    </form>
  );
}