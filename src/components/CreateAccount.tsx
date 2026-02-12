import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import './CreateAccount.css';

interface CreateAccountProps {
  onAccountCreated: () => void;
  onCancel: () => void;
}

export default function CreateAccount({ onAccountCreated, onCancel }: CreateAccountProps) {
  const { createAccount, error } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: '',
    phoneNumber: '',
    address: '',
    consent: false,
  });

  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    // Check if server is running
    fetch('http://localhost:3001/api/health')
      .then(() => setServerStatus('connected'))
      .catch(() => setServerStatus('disconnected'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setLocalError('First Name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setLocalError('Last Name is required');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setLocalError('Valid Email is required');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }
    if (!formData.dob) {
      setLocalError('Date of Birth is required');
      return false;
    }
    if (!formData.gender) {
      setLocalError('Gender is required');
      return false;
    }
    if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 10) {
      setLocalError('Valid Phone Number is required');
      return false;
    }
    if (!formData.address.trim()) {
      setLocalError('Address is required');
      return false;
    }
    if (!formData.consent) {
      setLocalError('You must consent to save your data');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName,
      email: formData.email,
      dob: formData.dob,
      gender: formData.gender,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
    };

    const success = await createAccount(userData, formData.password);
    
    if (success) {
      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        gender: '',
        phoneNumber: '',
        address: '',
        consent: false,
      });
      setTimeout(() => {
        onAccountCreated();
      }, 2000);
    }
  };

  return (
    <div className="create-account-container">
      <div className="create-account-form">
        <h2>Create Account</h2>
        
        {serverStatus === 'disconnected' && (
          <div className="info-message warning">
            ⚠️ Backend server is not running. Please start it with: <code>npm run server</code>
          </div>
        )}

        {(localError || error) && (
          <div className="error-message">
            {localError || error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
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
                placeholder="Doe"
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
                placeholder="Michael"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email ID *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="1234567890"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dob">Date of Birth *</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main Street, City, State, ZIP"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div className="form-group consent">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
            />
            <label htmlFor="consent">
              I consent to save my personal information in DeedVault's encrypted system
            </label>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-submit">Create Account</button>
            <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
