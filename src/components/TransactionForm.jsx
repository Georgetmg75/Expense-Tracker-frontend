import { useState } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({
    date: '',
    note: '',
    amount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      date: form.date,
      note: form.note,
      amount: parseFloat(form.amount),
    };

    try {
      const res = await API.post('/transactions', payload);
      toast.success('Transaction saved!');
      setForm({ date: '', note: '', amount: '' });
      if (onAdd) onAdd(res.data); // optional callback to update parent
    } catch (err) {
      console.error('❌ Transaction save failed:', err.message);
      toast.error('Failed to save transaction');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
        className="input"
      />
      <input
        type="text"
        name="note"
        value={form.note}
        onChange={handleChange}
        placeholder="Note"
        required
        className="input"
      />
      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
        required
        className="input"
      />
      <button type="submit" className="btn-primary">
        Add Transaction
      </button>
    </form>
  );
}
