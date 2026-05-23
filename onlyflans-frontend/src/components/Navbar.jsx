import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import '../styles/onlyflans.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isCreator = user.role === 'creator';

  const followerLinks = [
    { to: '/feed',      label: 'Inicio'     },
    { to: '/creators',  label: 'Creadores'  },
    { to: '/favorites', label: 'Favoritos'  },
    { to: '/donations', label: 'Donaciones' },
  ];

  const isActive = (to) => location.pathname === to;

  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      <nav className="of-topnav">
        <Link to={isCreator ? '/creator' : '/feed'} className="of-topnav-brand">
          <span className="of-topnav-brand-icon">🍮</span>
          <span className="of-topnav-brand-text">Only<span>Flans</span></span>
        </Link>

        {!isCreator && (
          <ul className="of-topnav-links">
            {followerLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={isActive(to) ? 'active' : ''}>{label}</Link>
              </li>
            ))}
          </ul>
        )}

        {isCreator && <div style={{ flex: 1 }} />}

        <div className="of-topnav-right">
          <span className={`of-role-badge ${isCreator ? 'creator' : 'follower'}`}>
            {isCreator ? 'Creador' : 'Seguidor'}
          </span>

          <div style={{ position: 'relative' }}>
            <button
              className="of-avatar-btn"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Menú de usuario"
            >
              {initials}
            </button>

            {menuOpen && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
                  onClick={() => setMenuOpen(false)}
                />
                <div className="of-dropdown">
                  <div className="of-dropdown-user">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <button className="of-dropdown-btn" onClick={handleLogout}>
                    ⎋ &nbsp;Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>

          {!isCreator && (
            <button
              className="of-hamburger"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Menú"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </nav>

      {!isCreator && menuOpen && (
        <div className="of-mobile-menu">
          {followerLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={isActive(to) ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid var(--of-border)', marginTop: 8, paddingTop: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--of-muted)', padding: '0 12px', display: 'block', marginBottom: 4 }}>
              {user.name} · Seguidor
            </span>
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', color: 'var(--of-danger)', padding: '10px 12px', fontSize: 14, cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'inherit' }}
            >
              ⎋ Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </>
  );
}