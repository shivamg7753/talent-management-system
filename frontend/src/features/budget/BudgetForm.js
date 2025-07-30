import React, { useState } from 'react';
import { Button, TextField, Paper, Alert } from '@mui/material';
import { apiPost } from '../../lib/api';

export default function BudgetForm() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await apiPost('/budget', { name, total: parseFloat(amount) });
      setMessage('Budget added!');
      setName(''); setAmount('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth margin="normal" required />
        <TextField label="Amount" value={amount} onChange={e => setAmount(e.target.value)} fullWidth margin="normal" required type="number" />
        <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2 }}>
          {loading ? 'Adding...' : 'Add Budget'}
        </Button>
        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </form>
    </Paper>
  );
}