import { Outlet } from 'react-router-dom';
import NavbarCreator from './Navbar_creator';
import { CreatorSidebar } from '../pages/creator/CreatorDashboard'; 

export default function CreatorLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <CreatorSidebar />
      
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <NavbarCreator />
        
        <main className="of-main" style={{ marginLeft: 0, marginTop: '10px' }}>
          <Outlet />
        </main>

      </div>
    </div>
  );
}