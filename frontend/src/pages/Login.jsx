import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, loginWithGoogle } from '../store/slices/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleCallback = (response) => {
    const idToken = response.credential;
    dispatch(loginWithGoogle({ idToken, role: 'patron' }));
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '98662134377-p01aj6dk19vr163pmdi0uq9d74hvqm7p.apps.googleusercontent.com',
        callback: handleGoogleCallback,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "outline", size: "large", width: 340, text: "signin_with" }
      );
    }
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem 0' }}>
      <div className="glass-card animate-fade-in" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ marginBottom: '2rem', fontSize: '0.9rem', textAlign: 'center' }}>Sign in to continue to Moseva</p>
        
        {error && (
          <div className="badge badge-error" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.5rem', justifyContent: 'center', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <span style={{ height: '1px', background: 'var(--border-glass)', flex: 1 }}></span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR</span>
          <span style={{ height: '1px', background: 'var(--border-glass)', flex: 1 }}></span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div id="google-signin-btn"></div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
          <Link to="/register" style={{ fontWeight: '600' }}>Create an Account</Link>
        </div>
      </div>
    </div>
  );
}
