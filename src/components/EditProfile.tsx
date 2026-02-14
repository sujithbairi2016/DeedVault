import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import './EditProfile.css';

interface EditProfileProps {
  onLogout: () => void;
  onHomeClick?: () => void;
  onProfileClick?: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditProfile({ onLogout, onHomeClick, onProfileClick, onSave, onCancel }: EditProfileProps) {
  const { user, logout, updateProfile, error: authError } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    middleName: user?.middleName || '',
    dob: user?.dob || '',
    gender: user?.gender || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing photo on mount
  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:3001/api/users/${user.id}/photo`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.image) {
            setPhotoPreview(data.image)
          }
        })
        .catch(err => console.error('Failed to load photo', err))
    }
  }, [user])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null)
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      setPhotoError('Please upload a JPG, JPEG, or PNG image')
      return
    }

    // Validate file size (300KB = 300 * 1024 bytes)
    if (file.size > 300 * 1024) {
      setPhotoError('Please upload the file with size less than or equal to 300 KB')
      return
    }

    setPhotoFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setError('First Name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last Name is required');
      return false;
    }
    if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 10) {
      setError('Valid Phone Number is required');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // First upload photo if changed
      if (photoFile && user?.id) {
        const photoFormData = new FormData()
        photoFormData.append('photo', photoFile)
        photoFormData.append('userId', user.id)
        photoFormData.append('firstName', formData.firstName)
        photoFormData.append('lastName', formData.lastName)

        try {
          const photoResponse = await fetch('http://localhost:3001/api/users/upload-photo', {
            method: 'POST',
            body: photoFormData,
          })

          const contentType = photoResponse.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const photoData = await photoResponse.json()
            if (!photoResponse.ok || !photoData.success) {
              setError(photoData.message || 'Failed to upload photo')
              setIsSaving(false)
              return
            }
          } else {
            setError('Server error: Invalid response from photo upload')
            setIsSaving(false)
            return
          }
        } catch (photoErr) {
          console.error('Photo upload error:', photoErr)
          setError('Failed to upload photo. Please try again.')
          setIsSaving(false)
          return
        }
      }

      // Then update profile
      const response = await fetch('http://localhost:3001/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName,
          dob: formData.dob,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setError(data.message || 'Failed to update profile');
        } else {
          setError('Server error: Invalid response from server');
          console.error('Response:', await response.text());
        }
        setIsSaving(false);
        return;
      }

      const data = await response.json();
      setIsSaving(false);

      if (data.success) {
        onSave();
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile. Make sure the server is running.');
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="edit-profile-container">
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

      <div className="edit-content">
        <div className="edit-header">
          <h1>Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          {(error || authError || photoError) && (
            <div className="error-message">
              {error || authError || photoError}
            </div>
          )}

          <div className="form-section">
            <h3>Profile Photo</h3>
            <div className="form-group">
              <label htmlFor="photo">Upload Photo (JPG, JPEG, PNG - Max 300KB)</label>
              {photoPreview && (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Profile preview" />
                </div>
              )}
              <input
                type="file"
                id="photo"
                accept=".jpg,.jpeg,.png"
                onChange={handlePhotoChange}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isSaving}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isSaving}
                />
              </div>
              <div className="form-group">
                <label htmlFor="middleName">Middle Name</label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={isSaving}
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isSaving}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Address</h3>
            <div className="form-group full-width">
              <label htmlFor="address">Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={isSaving}
                rows={4}
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-save" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn-cancel" onClick={onCancel} disabled={isSaving}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
