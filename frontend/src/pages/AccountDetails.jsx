import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function AccountDetails() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Ideally we fetch a specific account, but backend only has user/accounts. 
    // We can fetch from localstorage user or just provide deposit/withdraw directly.
    fetchAccountData();
  }, [accountId]);

  const fetchAccountData = async () => {
    // In a real app we'd have GET /api/accounts/{id}
    // Using simple mock retrieval if needed or skip fetching individual.
    setAccount({ id: accountId });
  };

  const handleTransaction = async (type) => {
    setError('');
    setSuccess('');
    try {
      if (!amount || amount <= 0) {
        setError('Please enter a valid amount.');
        return;
      }
      const endpoint = type === 'deposit' ? '/accounts/deposit' : '/accounts/withdraw';
      await api.post(endpoint, {
        accountId: accountId,
        amount: amount
      });
      setSuccess(`${type === 'deposit' ? 'Deposit' : 'Withdrawal'} of $${amount} successful!`);
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }} className="card">
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Manage Account</h2>
      <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Perform deposits and withdrawals below.</p>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ color: 'var(--secondary)', marginBottom: '1rem', fontWeight: 'bold' }}>{success}</div>}
      
      <div className="input-group">
        <label>Amount ($)</label>
        <input 
          type="number" 
          step="0.01" 
          value={amount} 
          onChange={e => setAmount(e.target.value)} 
          placeholder="0.00" 
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button onClick={() => handleTransaction('deposit')} className="btn btn-primary" style={{ flex: 1 }}>
          Deposit
        </button>
        <button onClick={() => handleTransaction('withdraw')} className="btn btn-danger" style={{ flex: 1 }}>
          Withdraw
        </button>
      </div>
      
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button onClick={() => navigate('/dashboard')} className="btn" style={{ background: 'var(--border)', color: 'var(--text-main)' }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default AccountDetails;
