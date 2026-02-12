import React from 'react';
import { useAuth } from '../utils/AuthContext';
import Marquee from './Marquee';
import ServiceTiles from './ServiceTiles';
import './Dashboard.css';

interface DashboardProps {
  onLogout: () => void;
  onHomeClick?: () => void;
  onProfileClick?: () => void;
}

export default function Dashboard({ onLogout, onHomeClick, onProfileClick }: DashboardProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="dashboard">
      <Marquee />
      
      <div className="dashboard-content">
        <ServiceTiles />
      </div>
    </div>
  );
}
