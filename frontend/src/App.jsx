import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from './store/slices/authSlice';
import { fetchNotifications } from './store/slices/notificationSlice';

// Components
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import JobDetails from './pages/JobDetails';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';

// Premium landing page component
function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', padding: '2rem 0', textAlign: 'left' }} className="animate-fade-in">
      {/* Hero Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h1 style={{ fontSize: '3.5rem', lineHeight: '1.1' }}>
            Next-Gen <br />
            <span style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Service Gig
            </span> Marketplace
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'hsl(var(--text-secondary))' }}>
            Moseva connects patrons seeking top-tier help with professional partners offering local, flexible, or remote services on-demand.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Link to="/marketplace" className="btn btn-primary" style={{ padding: '0.9rem 2rem' }}>
              Explore Marketplace
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ padding: '0.9rem 2rem' }}>
              Offer Your Services
            </Link>
          </div>
        </div>

        {/* Feature glass illustration */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '3rem', transform: 'rotate(1deg)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'hsla(var(--primary), 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            ⚡
          </div>
          <h2 style={{ fontSize: '1.75rem' }}>Dynamic Schedule</h2>
          <p>
            Simply publish your request, receive custom bids from qualified taskers, and coordinate schedules via integrated chat channels.
          </p>
        </div>
      </div>

      {/* Categories overview */}
      <div>
        <h2 style={{ marginBottom: '1rem' }}>Explore Popular Gigs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🛠️</span>
            <h3>Home Repair</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Plumbing, electric & carpentry</p>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🧹</span>
            <h3>Cleaning</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Deep residential & move-out help</p>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>💻</span>
            <h3>Tech & Remote</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Web dev, design & tutorship</p>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📦</span>
            <h3>Delivery & Logistics</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Local courier, moves & packing</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Load user profile & notification center on startup if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
      dispatch(fetchNotifications());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Router>
      <div className="app-container">
        <NavBar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
