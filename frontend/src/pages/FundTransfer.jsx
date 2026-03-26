import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function FundTransfer({ user }) {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [targetAccountNumber, setTargetAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get(`/accounts/user/${user.id}`);
        setAccounts(res.data);
        if (res.data.length > 0) {
          setSourceAccountId(res.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching accounts', err);
      }
    };
    fetchAccounts();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!sourceAccountId || !targetAccountNumber || !amount || amount <= 0) {
      setError('Please fill all fields correctly.');
      return;
    }

    try {
      await api.post('/accounts/transfer', {
        sourceAccountId,
        targetAccountNumber,
        amount
      });
      setSuccess(`Successfully transferred $${amount} to account ${targetAccountNumber}!`);
      setAmount('');
      setTargetAccountNumber('');
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }} className="card">
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Transfer Funds</h2>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '0.75rem', background: '#FEF2F2', borderRadius: '8px' }}>{error}</div>}
      {success && <div style={{ color: 'var(--secondary)', marginBottom: '1rem', padding: '0.75rem', background: '#ECFDF5', borderRadius: '8px', fontWeight: 'bold' }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>From Account</label>
          <select value={sourceAccountId} onChange={e => setSourceAccountId(e.target.value)} required>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.accountNumber} - Balance: ${parseFloat(acc.balance).toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>To Account Number</label>
          <input 
            type="text" 
            value={targetAccountNumber} 
            onChange={e => setTargetAccountNumber(e.target.value)} 
            required 
            placeholder="Recipient's account number"
          />
        </div>

        <div className="input-group">
          <label>Amount ($)</label>
          <input 
            type="number" 
            step="0.01" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            required 
            placeholder="0.00"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Send Transfer</button>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn" style={{ flex: 1, background: 'var(--border)', color: 'var(--text-main)' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default FundTransfer;
