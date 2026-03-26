import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './index.css';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AccountDetails from './pages/AccountDetails';
import TransactionHistory from './pages/TransactionHistory';
import FundTransfer from './pages/FundTransfer';
import SettingsPage from './pages/SettingsPage';
import PayBills from './pages/PayBills';

// NEW IMPORTS FOR QUICK ACTIONS
import Cards from './pages/Cards';
import Savings from './pages/Savings';
import Support from './pages/Support';

const NavigationHandler = ({ user }) => {
  const location = useLocation();
  const showAuthHeader = ['/login', '/register'].includes(location.pathname) || (location.pathname === '/' && !user);

  if (showAuthHeader) {
    return (
      <header style={{ height: '60px', backgroundColor: 'white', display: 'flex', alignItems: 'center', padding: '0 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e5cb3' }}>VirtualBank</div>
      </header>
    );
  }
  return null;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Router>
      <NavigationHandler user={user} />

      <main className="container">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard user={user} onLogout={handleLogout} /></ProtectedRoute>} />
          
          {/* NEW PROTECTED ROUTES FOR QUICK ACTIONS */}
          <Route path="/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>} />
          <Route path="/savings" element={<ProtectedRoute><Savings /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />

          <Route path="/settings" element={<ProtectedRoute><SettingsPage user={user} onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/pay-bills" element={<ProtectedRoute><PayBills user={user} onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/transfer" element={<ProtectedRoute><FundTransfer user={user} /></ProtectedRoute>} />
          <Route path="/account/:accountId" element={<ProtectedRoute><AccountDetails /></ProtectedRoute>} />
          <Route path="/account/:accountId/transactions" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;