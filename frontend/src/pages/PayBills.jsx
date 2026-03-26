import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PayBills({ user, onLogout }) {
  const navigate = useNavigate();
  const [billType, setBillType] = useState('Electricity');
  const [amount, setAmount] = useState('');

  const handlePay = (e) => {
    e.preventDefault();
    alert(`Success: $${amount} paid for ${billType} bill.`);
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7fe', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR */}
      <aside style={{ width: '260px', background: 'linear-gradient(180deg, #1e5cb3 0%, #2b6cb0 100%)', color: 'white', padding: '30px 0' }}>
        <h2 style={{ padding: '0 30px', marginBottom: '40px' }}>Virtual Bank</h2>
        <nav>
          <div onClick={() => navigate('/dashboard')} style={{ padding: '15px 30px', cursor: 'pointer' }}>👤 Dashboard</div>
          <div onClick={() => navigate('/transfer')} style={{ padding: '15px 30px', cursor: 'pointer' }}>⇄ Transfer</div>
          <div onClick={() => navigate('/settings')} style={{ padding: '15px 30px', cursor: 'pointer' }}>⚙️ Settings</div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '70px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: 0 }}>Pay Utility Bills</h3>
          <button onClick={onLogout} style={{ backgroundColor: '#fed7d7', color: '#c53030', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
        </header>

        <div style={{ padding: '40px' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', maxWidth: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h4 style={{ marginTop: 0 }}>Select Bill Details</h4>
            <form onSubmit={handlePay}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Bill Category</label>
                <select 
                  value={billType} 
                  onChange={(e) => setBillType(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                >
                  <option>Electricity</option>
                  <option>Water Gas</option>
                  <option>Internet / WiFi</option>
                  <option>Mobile Recharge</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Amount ($)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  required 
                />
              </div>

              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Pay Bill Now
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PayBills;