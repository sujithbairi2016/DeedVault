import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import './UserProfile.css';

interface UserProfileProps {
  onLogout: () => void;
  onHomeClick?: () => void;
  onProfileClick?: () => void;
  onEditClick: () => void;
}

export default function UserProfile({ onLogout, onHomeClick, onProfileClick, onEditClick }: UserProfileProps) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:3001/api/users/${user.id}/photo`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.image) {
            setUserPhoto(data.image)
          }
        })
        .catch(err => console.error('Failed to load photo', err))
    }
  }, [user])

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="user-profile-container">
      <Header 
        onMenuClick={() => setMenuOpen(!menuOpen)}
        onHomeClick={onHomeClick}
      />
      <Sidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onProfileClick={() => {
          setMenuOpen(false);
          if (onProfileClick) onProfileClick();
        }}
        onLogoutClick={() => {
          setMenuOpen(false);
          handleLogout();
        }}
      />

      <div className="profile-content">
        <div className="profile-header">
          <h1>User Profile</h1>
          <button className="edit-btn" onClick={onEditClick} title="Edit Profile">
            ✏️ Edit
          </button>
        </div>

        <div className="profile-card">
          {userPhoto && (
            <div className="profile-photo-section">
              <img src={userPhoto} alt="Profile" className="profile-photo" />
            </div>
          )}
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="profile-grid">
              <div className="profile-item">
                <label>First Name</label>
                <p>{user?.firstName}</p>
              </div>
              <div className="profile-item">
                <label>Last Name</label>
                <p>{user?.lastName}</p>
              </div>
              <div className="profile-item">
                <label>Middle Name</label>
                <p>{user?.middleName || 'N/A'}</p>
              </div>
              <div className="profile-item">
                <label>Date of Birth</label>
                <p>{user?.dob}</p>
              </div>
            </div>

            <h3>Contact Information</h3>
            <div className="profile-grid">
              <div className="profile-item">
                <label>Email</label>
                <p>{user?.email}</p>
              </div>
              <div className="profile-item">
                <label>Phone Number</label>
                <p>{user?.phoneNumber}</p>
              </div>
              <div className="profile-item">
                <label>Gender</label>
                <p>{user?.gender}</p>
              </div>
            </div>

            <h3>Address</h3>
            <div className="profile-grid full-width">
              <div className="profile-item">
                <label>Address</label>
                <p>{user?.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
