import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function TransactionHistory() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get(`/accounts/${accountId}/transactions`);
        setTransactions(res.data);
      } catch (err) {
        setError('Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [accountId]);

  if (loading) return <div>Loading transactions...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--primary)' }}>Transaction History</h2>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">Back</button>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Reference Account</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No transactions found.</td>
              </tr>
            ) : (
              transactions.map(tx => (
                <tr key={tx.id}>
                  <td>{new Date(tx.timestamp).toLocaleString()}</td>
                  <td>{tx.type}</td>
                  <td className={tx.type.includes('IN') || tx.type === 'DEPOSIT' ? 'amount-positive' : 'amount-negative'}>
                    ${parseFloat(tx.amount).toFixed(2)}
                  </td>
                  <td>{tx.targetAccountNumber || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionHistory;
