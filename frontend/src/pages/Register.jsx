import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, loginWithGoogle } from '../store/slices/authSlice';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patron'); // patron, service_partner
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
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
    // Registration via Google preserves the chosen user role (patron or service partner)
    dispatch(loginWithGoogle({ idToken, role }));
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '98662134377-p01aj6dk19vr163pmdi0uq9d74hvqm7p.apps.googleusercontent.com',
        callback: handleGoogleCallback,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signup-btn"),
        { theme: "outline", size: "large", width: 420, text: "signup_with" }
      );
    }
  }, [dispatch, role]); // re-render Google button if role changes so correct role gets registered

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    dispatch(registerUser({ username, email, password, role, firstName, lastName }));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem 0' }}>
      <div className="glass-card animate-fade-in" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <img src="/logo.png" alt="Moseva Brand Logo" style={{ width: '80px', height: '80px', borderRadius: '12px', border: '1px solid var(--border-glass)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)' }} />
        </div>
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Create Account</h2>
        <p style={{ marginBottom: '2rem', fontSize: '0.9rem', textAlign: 'center' }}>Join Moseva and experience next-gen service delivery</p>
        
        {error && (
          <div className="badge badge-error" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.5rem', justifyContent: 'center', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Segmented Control for Role */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Join As</label>
            <div style={{ display: 'flex', gap: '1rem', background: 'rgba(0, 0, 0, 0.2)', padding: '0.35rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <button 
                type="button" 
                className={`btn ${role === 'patron' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                onClick={() => setRole('patron')}
              >
                Hire Service (Patron)
              </button>
              <button 
                type="button" 
                className={`btn ${role === 'service_partner' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                onClick={() => setRole('service_partner')}
              >
                Offer Service (Partner)
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">First Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="John" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Last Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Doe" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="johndoe" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="john@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password (Min 8 characters)</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <span style={{ height: '1px', background: 'var(--border-glass)', flex: 1 }}></span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR</span>
          <span style={{ height: '1px', background: 'var(--border-glass)', flex: 1 }}></span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div id="google-signup-btn"></div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
          <Link to="/login" style={{ fontWeight: '600' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
