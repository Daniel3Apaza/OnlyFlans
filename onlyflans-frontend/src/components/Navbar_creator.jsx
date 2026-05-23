import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function NavbarCreator() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ 
      background: 'var(--of-surface)', 
      borderBottom: '1px solid var(--of-border)', 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 36px',
      height: '64px',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--of-text)' }}>
        🍮 Only<span style={{ color: 'var(--of-blue)' }}>Flans</span>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--of-text)' }}>{user?.name}</span>
        <button onClick={handleLogout} className="of-btn-danger">
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}