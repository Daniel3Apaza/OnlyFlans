import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/follower_diseno.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Layouts
import CreatorLayout from './components/CreatorLayout';
import FollowerLayout from './components/FollowerLayout';

// Creador
import CreatorDashboard from './pages/creator/CreatorDashboard';
import CreatorProfile from './pages/creator/CreatorProfile';
import CreatorPosts from './pages/creator/CreatorPosts';
import CreatorGoals from './pages/creator/CreatorGoals';
import CreatorReport from './pages/creator/CreatorReport';

// Seguidor
import FollowerFeed from './pages/follower/FollowerFeed';
import CreatorsList from './pages/follower/CreatorsList';
import CreatorPublicProfile from './pages/follower/CreatorPublicProfile';
import Favorites from './pages/follower/Favorites';
import DonationHistory from './pages/follower/DonationHistory';

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route 
        path="/creator" 
        element={
          <PrivateRoute role="creator">
            <CreatorLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<CreatorDashboard />} />
        <Route path="profile" element={<CreatorProfile />} />
        <Route path="posts" element={<CreatorPosts />} />
        <Route path="goals" element={<CreatorGoals />} />
        <Route path="report" element={<CreatorReport />} />
      </Route>

      <Route 
        element={
          <PrivateRoute role="follower">
            <FollowerLayout />
          </PrivateRoute>
        }
      >
        <Route path="/feed" element={<FollowerFeed />} />
        <Route path="/creators" element={<CreatorsList />} />
        <Route path="/creators/:id" element={<CreatorPublicProfile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/donations" element={<DonationHistory />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}