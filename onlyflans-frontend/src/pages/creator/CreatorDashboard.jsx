import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/onlyflans.css';

export const NAV_LINKS = [
  { to: '/creator', label: 'Dashboard', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  )},
  { to: '/creator/posts', label: 'Mis Posts', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  )},
  { to: '/creator/goals', label: 'Mis Metas', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  )},
  { to: '/creator/profile', label: 'Mi Perfil', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  )},
  { to: '/creator/report', label: 'Reporte', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  )},
];

export function CreatorSidebar() {
  const location = useLocation();
  return (
    <aside className="of-sidebar">
      <ul className="of-nav" style={{ paddingTop: 20 }}>
        {NAV_LINKS.map(({ to, label, icon }) => (
          <li key={to}>
            <Link to={to} className={location.pathname === to ? 'active' : ''}>
              {icon} {label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="of-sidebar-bottom">
        <Link to="/creator/posts" className="of-btn of-btn-full">
          + Nueva Publicación
        </Link>
      </div>
    </aside>
  );
}

export default function CreatorDashboard() {
  const { user } = useAuth();

  const cards = [
    { to: '/creator/posts',   icon: '📝', title: 'Mis Posts',   desc: 'Publicá contenido para tus seguidores',  label: 'Ir a Posts'   },
    { to: '/creator/goals',   icon: '🎯', title: 'Mis Metas',   desc: 'Definí tus objetivos de apoyo',          label: 'Ir a Metas'   },
    { to: '/creator/profile', icon: '👤', title: 'Mi Perfil',   desc: 'Actualizá tu foto y banner',             label: 'Ir a Perfil'  },
    { to: '/creator/report',  icon: '📊', title: 'Reporte',     desc: 'Ver tus ingresos en flanes',             label: 'Ver Reporte'  },
  ];

  return (
    <>
      <h2 className="of-page-title">Bienvenido, {user?.name} 🍮</h2>
      <p className="of-page-sub">¿Qué querés hacer hoy?</p>

      <div className="of-action-grid">
        {cards.map(({ to, icon, title, desc, label }) => (
          <Link key={to} to={to} className="of-action-card">
            <div className="icon">{icon}</div>
            <h4>{title}</h4>
            <p>{desc}</p>
            <span className="of-btn-ghost of-action-card-btn">{label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}