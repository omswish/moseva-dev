import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';

export default function NavBar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);
  const { conversations } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  // Count unread notifications
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // Count unread conversations (simplistic summation)
  const unreadConversationsCount = conversations.reduce((acc, conv) => {
    const unread = user?.userId === conv.participant1Id ? conv.unreadCount1 : conv.unreadCount2;
    return acc + (unread || 0);
  }, 0);

  return (
    <nav className="navbar animate-fade-in">
      <Link to="/" className="navbar-logo">
        MOSEVA
      </Link>
      <div className="navbar-links">
        <Link to="/marketplace">Explore Jobs</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/chat" style={{ position: 'relative' }}>
              Messages
              {unreadConversationsCount > 0 && (
                <span className="badge badge-error" style={{ position: 'absolute', top: '-10px', right: '-12px', fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                  {unreadConversationsCount}
                </span>
              )}
            </Link>
            <span className="badge badge-success" style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
              {user?.role?.replace('_', ' ')}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {user?.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt="avatar" 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-glass)' }} 
                />
              ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {user?.username?.substring(0, 2).toUpperCase()}
                </div>
              )}
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{user?.username}</span>
            </div>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
