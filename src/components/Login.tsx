import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import './Login.css';

interface LoginProps {
  onLoginSuccess: () => void;
  onCreateAccountClick: () => void;
}

export default function Login({ onLoginSuccess, onCreateAccountClick }: LoginProps) {
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    // Check if server is running
    fetch('http://localhost:3001/api/health')
      .then(() => setServerStatus('connected'))
      .catch(() => setServerStatus('disconnected'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim()) {
      setLocalError('Email is required');
      return;
    }

    if (!password) {
      setLocalError('Password is required');
      return;
    }

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      onLoginSuccess();
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign In</h2>
        
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email ID</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="divider">or</div>

        <button type="button" className="btn-create-account" onClick={onCreateAccountClick}>
          Create Account
        </button>

        <p className="login-footer">
          DeedVault - Property Services Platform
        </p>
      </div>
    </div>
  );
}
