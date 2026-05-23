import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Importamos tu Navbar de seguidor

export default function FollowerLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Navbar />
      
      <main style={{ flex: 1, backgroundColor: 'var(--of-bg)' }}>
        <Outlet />
      </main>
    </div>
  );
}