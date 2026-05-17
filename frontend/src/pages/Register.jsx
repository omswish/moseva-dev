import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../store/slices/authSlice';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    dispatch(registerUser({ username, email, password, role, firstName, lastName }));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem 0' }}>
      <div className="glass-card animate-fade-in" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem' }}>
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

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
          <Link to="/login" style={{ fontWeight: '600' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
