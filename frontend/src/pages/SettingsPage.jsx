import { useNavigate } from 'react-router-dom';

function SettingsPage({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
      navigate('/login');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7fe', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: '260px', background: 'linear-gradient(180deg, #1e5cb3 0%, #2b6cb0 100%)', color: 'white', padding: '30px 0' }}>
        <h2 style={{ padding: '0 30px', marginBottom: '40px', fontSize: '1.5rem', fontWeight: 'bold' }}>Virtual Bank</h2>
        <nav>
          <div onClick={() => navigate('/dashboard')} style={{ padding: '15px 30px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
            <span>👤</span> Dashboard
          </div>
          <div onClick={() => navigate('/transfer')} style={{ padding: '15px 30px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
            <span>⇄</span> Transfer
          </div>
          <div style={{ padding: '15px 30px', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'rgba(255,255,255,0.15)', borderLeft: '4px solid white', cursor: 'pointer' }}>
            <span>⚙️</span> Settings
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '70px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: 0, color: '#2d3748' }}>Settings</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#4a5568' }}>👤 {user.username}</span>
            <button 
              onClick={handleLogoutClick}
              style={{ backgroundColor: '#fed7d7', color: '#c53030', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >Logout</button>
          </div>
        </header>

        <div style={{ padding: '40px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h4 style={{ marginTop: 0, color: '#2d3748' }}>Account Information</h4>
            <div style={{ marginTop: '20px', color: '#4a5568' }}>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email || 'N/A'}</p>
              <p><strong>Account Status:</strong> <span style={{ color: '#48bb78' }}>Active</span></p>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;