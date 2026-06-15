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
  const [categoryId, setCategoryId] = useState('1');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !categoryId) return;

    dispatch(createTransaction({
      description,
      amount: parseFloat(amount),
      type,
      date,
      categoryId: parseInt(categoryId),
    }));

    setDescription('');
    setAmount('');
    setDate('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
      <h3>Nova Transação</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
        <input type="text" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} style={{ flex: 1, padding: '8px', minWidth: '150px' }} />
        <input type="number" placeholder="Valor (R$)" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required style={{ width: '120px', padding: '8px' }} />
        <select value={type} onChange={(e) => setType(e.target.value as Transaction['type'])} style={{ padding: '8px' }}>
          <option value="INCOME">Receita</option>
          <option value="EXPENSE">Despesa</option>
        </select>
        <input type="number" placeholder="ID Categoria" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required min="1" style={{ width: '120px', padding: '8px' }} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ padding: '8px' }} />
      </div>
      <Button type="submit" variant="primary">Adicionar</Button>
    </form>
  );
}