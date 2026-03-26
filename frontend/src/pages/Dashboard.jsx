import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Dashboard({ user, onLogout }) {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const [depositAmount, setDepositAmount] = useState(''); 
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const accRes = await api.get(`/accounts/user/${user.id}`);
      setAccounts(accRes.data);

      if (accRes.data.length > 0) {
        const transRes = await api.get(`/accounts/${accRes.data[0].id}/transactions`);
        const sortedTrans = transRes.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setTransactions(sortedTrans.slice(0, 5)); 
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    
    if (!amount || amount <= 0) return alert("Please enter a valid amount.");
    if (!accounts.length) return alert("No active account found.");

    try {
      await api.post(`/accounts/deposit`, {
        accountId: accounts[0].id,
        amount: amount
      });

      setDepositAmount('');
      alert(`Success! $${amount.toFixed(2)} deposited.`);
      fetchDashboardData(); 
    } catch (err) {
      console.error("Deposit error:", err);
      alert("Deposit failed. Make sure Backend is running.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, [user.id]);

  const mainAccount = accounts[0] || { id: '0', balance: 0, account_number: 'XXXX' };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Updating Dashboard...</div>;

  const NavItem = ({ icon, label, path, active }) => (
    <div 
      onClick={() => navigate(path)} 
      style={{ 
        padding: '15px 30px', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
        borderLeft: active ? '4px solid white' : '4px solid transparent',
        transition: '0.3s'
      }}
    >
      <span>{icon}</span> {label}
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7fe', fontFamily: 'sans-serif' }}>
      
      <aside style={{ width: '260px', background: 'linear-gradient(180deg, #1e5cb3 0%, #2b6cb0 100%)', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ padding: '30px', margin: 0, textAlign: 'center', letterSpacing: '1px' }}>Virtual Bank</h2>
        
        <nav style={{ marginTop: '20px', flex: 1 }}>
          <NavItem icon="👤" label="Dashboard" path="/dashboard" active={true} />
          {/* Home ko bhi Dashboard par redirect kar diya hai */}
          <NavItem icon="🏠" label="Home" path="/dashboard" active={false} />
          <NavItem icon="⇄" label="Transfer" path="/transfer" active={false} />
          <NavItem icon="⚙️" label="Settings" path="/settings" active={false} />
        </nav>

        <div style={{ padding: '20px', fontSize: '0.8rem', textAlign: 'center', opacity: 0.7, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          Logged in as: {user.username}
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        
        <header style={{ height: '70px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', position: 'sticky', top: 0, zIndex: 10 }}>
          <h3 style={{ margin: 0, color: '#2d3748' }}>Welcome, <b>{user.username}!</b></h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowNotif(!showNotif)}>
              <span style={{ fontSize: '1.4rem' }}>🔔</span>
              {transactions.length > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-2px', backgroundColor: '#e53e3e', color: 'white', borderRadius: '50%', padding: '2px 5px', fontSize: '0.65rem', fontWeight: 'bold', border: '2px solid white' }}>
                  {transactions.length}
                </span>
              )}
              {showNotif && (
                <div style={{ position: 'absolute', top: '45px', right: 0, width: '280px', backgroundColor: 'white', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', borderRadius: '12px', padding: '15px', zIndex: 100, border: '1px solid #eee' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>Recent Alerts</h4>
                  {transactions.slice(0, 2).map(t => (
                    <p key={t.id} style={{ fontSize: '0.75rem', margin: '5px 0', padding: '8px', backgroundColor: '#f7fafc', borderRadius: '5px' }}>
                      📢 {t.type} of ${t.amount} successful!
                    </p>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => { onLogout(); navigate('/login'); }} style={{ backgroundColor: '#fed7d7', color: '#c53030', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
          </div>
        </header>

        <div style={{ padding: '30px', flex: 1 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '25px', marginBottom: '30px' }}>
            
            <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ color: '#718096', margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>TOTAL AVAILABLE BALANCE</p>
              <h1 style={{ fontSize: '3rem', margin: '10px 0', color: '#1a202c' }}>
                ${parseFloat(mainAccount.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h1>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button onClick={() => navigate('/transfer')} style={{ backgroundColor: '#3182ce', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>🚀 Send Money</button>
                
                {/* VIEW HISTORY BUTTON FIXED HERE */}
                <button 
                  onClick={() => navigate(`/account/${mainAccount.id}/transactions`)}
                  style={{ backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  View History
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#2d3748' }}>Quick Deposit</h4>
              <form onSubmit={handleDeposit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#a0aec0' }}>$</span>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    style={{ padding: '12px 12px 12px 30px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', fontSize: '1rem' }}
                  />
                </div>
                <button type="submit" style={{ backgroundColor: '#48bb78', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                  + Deposit Money
                </button>
              </form>
            </div>
          </div>

          <h4 style={{ marginBottom: '15px', color: '#2d3748' }}>Banking Services</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
            {[
              { label: 'Pay Bills', icon: '📄', color: '#ebf8ff', text: '#2b6cb0', path: '/pay-bills' },
              { label: 'My Cards', icon: '💳', color: '#faf5ff', text: '#6b46c1', path: '/cards' },
              { label: 'Savings', icon: '💰', color: '#f0fff4', text: '#2f855a', path: '/savings' },
              { label: 'Support', icon: '🎧', color: '#fffaf0', text: '#9c4221', path: '/support' }
            ].map((action, idx) => (
              <div 
                key={idx} 
                onClick={() => navigate(action.path)} 
                style={{ backgroundColor: action.color, padding: '25px 20px', borderRadius: '15px', textAlign: 'center', cursor: 'pointer', transition: '0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
              >
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{action.icon}</div>
                <div style={{ fontWeight: 'bold', color: action.text }}>{action.label}</div>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h4 style={{ margin: 0, color: '#2d3748' }}>Recent Activity</h4>
              <button onClick={() => navigate(`/account/${mainAccount.id}/transactions`)} style={{ background: 'none', border: 'none', color: '#3182ce', cursor: 'pointer', fontWeight: 'bold' }}>View All →</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#a0aec0', fontSize: '0.85rem', borderBottom: '2px solid #f7fafc' }}>
                  <th style={{ padding: '12px 0' }}>DATE</th>
                  <th>DESCRIPTION</th>
                  <th style={{ textAlign: 'right' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((t) => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #f7fafc' }}>
                      <td style={{ padding: '18px 0', fontSize: '0.85rem', color: '#718096' }}>{new Date(t.timestamp).toLocaleDateString()}</td>
                      <td style={{ padding: '18px 0', fontWeight: '600', color: '#2d3748' }}>{t.type}</td>
                      <td style={{ padding: '18px 0', textAlign: 'right', fontWeight: 'bold', color: t.type === 'DEPOSIT' ? '#48bb78' : '#e53e3e' }}>
                        {t.type === 'DEPOSIT' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#a0aec0' }}>No transaction history found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <footer style={{ padding: '20px 40px', backgroundColor: 'white', borderTop: '1px solid #e2e8f0', textAlign: 'center', color: '#718096', fontSize: '0.85rem' }}>
          <p style={{ margin: 0 }}>&copy; 2026 Virtual Bank. All transactions are encrypted and secure.</p>
          <div style={{ marginTop: '5px' }}>
            <span style={{ cursor: 'pointer', margin: '0 10px' }}>Privacy Policy</span> | 
            <span style={{ cursor: 'pointer', margin: '0 10px' }}>Terms of Service</span> | 
            <span style={{ cursor: 'pointer', margin: '0 10px' }}>Contact Support</span>
          </div>
        </footer>

      </main>
    </div>
  );
}

export default Dashboard;