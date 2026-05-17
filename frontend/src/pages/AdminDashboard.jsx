import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [dpdpRequests, setDpdpRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & filter states
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('');

  // Modals / Action states
  const [updatingNotes, setUpdatingNotes] = useState({ id: null, type: '', notes: '', status: '' });
  const [rejectionReason, setRejectionReason] = useState({ jobId: null, reason: '' });

  // Fetch functions
  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.data);
    } catch (err) {
      console.error('Error fetching dashboard stats', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = {};
      if (userSearch) params.search = userSearch;
      if (userRoleFilter) params.role = userRoleFilter;
      const res = await api.get('/admin/users', { params });
      setUsers(res.data.data.users);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  const fetchJobs = async () => {
    try {
      const params = {};
      if (jobSearch) params.search = jobSearch;
      if (jobStatusFilter) params.status = jobStatusFilter;
      const res = await api.get('/admin/jobs', { params });
      setJobs(res.data.data.jobs);
    } catch (err) {
      console.error('Error fetching jobs', err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/admin/feedback');
      setComplaints(res.data.data);
    } catch (err) {
      console.error('Error fetching complaints', err);
    }
  };

  const fetchDpdpRequests = async () => {
    try {
      const res = await api.get('/admin/dpdp');
      setDpdpRequests(res.data.data);
    } catch (err) {
      console.error('Error fetching DPDP requests', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      fetchDashboardStats(),
      fetchUsers(),
      fetchJobs(),
      fetchComplaints(),
      fetchDpdpRequests()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update operations
  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      await fetchUsers();
      await fetchDashboardStats();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to update user role');
    }
  };

  const handleToggleUserActive = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-active`);
      await fetchUsers();
      await fetchDashboardStats();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to toggle user status');
    }
  };

  const handleJobStatusChange = async (jobId, newStatus) => {
    if (newStatus === 'rejected') {
      const reason = prompt('Please enter the reason for rejecting this gig posting:');
      if (!reason) return;
      try {
        await api.put(`/admin/jobs/${jobId}/status`, { status: 'rejected', rejectionReason: reason });
        await fetchJobs();
        await fetchDashboardStats();
      } catch (err) {
        alert(err.response?.data?.error?.message || 'Failed to reject job');
      }
    } else {
      try {
        await api.put(`/admin/jobs/${jobId}/status`, { status: newStatus });
        await fetchJobs();
        await fetchDashboardStats();
      } catch (err) {
        alert(err.response?.data?.error?.message || 'Failed to update job status');
      }
    }
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    const { id, status, notes } = updatingNotes;
    try {
      await api.put(`/admin/feedback/${id}`, { status, adminNotes: notes });
      setUpdatingNotes({ id: null, type: '', notes: '', status: '' });
      await fetchComplaints();
      await fetchDashboardStats();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to update grievance status');
    }
  };

  const handleUpdateDpdp = async (e) => {
    e.preventDefault();
    const { id, status, notes } = updatingNotes;
    try {
      await api.put(`/admin/dpdp/${id}`, { status, adminNotes: notes });
      setUpdatingNotes({ id: null, type: '', notes: '', status: '' });
      await fetchDpdpRequests();
      await fetchDashboardStats();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to process DPDP grievance');
    }
  };

  // Run user searches when filter conditions change
  useEffect(() => {
    if (!loading) fetchUsers();
  }, [userRoleFilter]);

  useEffect(() => {
    if (!loading) fetchJobs();
  }, [jobStatusFilter]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'hsl(var(--text-secondary))' }}>
        <h3>Loading Moseva Admin Console data...</h3>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0', textAlign: 'left' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>Admin Operations Cell</h1>
          <p>Complete application oversight, moderation controls, grievances redressal & regulatory compliance cells.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={loadData}>🔄 Refresh Logs</button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'analytics', label: '📊 System Overview' },
          { id: 'users', label: '👥 User Registry' },
          { id: 'jobs', label: '💼 Gig Moderation' },
          { id: 'complaints', label: '💬 Customer Complaints' },
          { id: 'dpdp', label: '🛡️ DPDP Grievances' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: System Overview / Analytics */}
      {activeTab === 'analytics' && stats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* KPI grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <span style={{ fontSize: '1.75rem' }}>👥</span>
              <h3 style={{ fontSize: '1.85rem', margin: '0.5rem 0 0.25rem 0' }}>{stats.users.total}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Registered Users</p>
              <span className="badge badge-success" style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>
                {stats.users.active} Active
              </span>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <span style={{ fontSize: '1.75rem' }}>💼</span>
              <h3 style={{ fontSize: '1.85rem', margin: '0.5rem 0 0.25rem 0' }}>{stats.jobs.total}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Posted Gigs</p>
              <span className="badge badge-warning" style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>
                {stats.jobs.pending} Awaiting Review
              </span>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <span style={{ fontSize: '1.75rem' }}>🤝</span>
              <h3 style={{ fontSize: '1.85rem', margin: '0.5rem 0 0.25rem 0' }}>{stats.bookings.total}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Market Agreements</p>
              <span className="badge badge-success" style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>
                {stats.bookings.completed} Completed
              </span>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <span style={{ fontSize: '1.75rem' }}>🛡️</span>
              <h3 style={{ fontSize: '1.85rem', margin: '0.5rem 0 0.25rem 0' }}>{stats.complaints.total + stats.dpdp.total}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>DPDP & Redressal Issues</p>
              <span className="badge badge-error" style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>
                {stats.complaints.open + stats.dpdp.pending} Unresolved
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            {/* Recent Users */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Latest Registrations</h3>
              {stats.recentUsers.length === 0 ? (
                <p>No recent user log entries found.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>Username</th>
                        <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>Email</th>
                        <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>Role</th>
                        <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentUsers.map(u => (
                        <tr key={u.userId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>{u.username}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{u.email}</td>
                          <td style={{ padding: '0.75rem 0.5rem', textTransform: 'capitalize' }}>{u.role}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span className={`badge ${u.isActive ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.65rem' }}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Jobs */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Latest Job Postings</h3>
              {stats.recentJobs.length === 0 ? (
                <p>No recent gig postings found.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>Title</th>
                        <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>Client</th>
                        <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentJobs.map(j => (
                        <tr key={j.jobId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>{j.title}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{j.patron?.username}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span className={`badge ${
                              j.status === 'approved' ? 'badge-success' : 
                              j.status === 'pending' ? 'badge-warning' : 'badge-error'
                            }`} style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                              {j.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Registry */}
      {activeTab === 'users' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2>User Registry Control</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                className="form-control" 
                style={{ width: '220px', padding: '0.5rem 1rem' }}
                placeholder="Search username/email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              />
              <select 
                className="form-control" 
                style={{ width: '160px', padding: '0.5rem' }}
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="superadmin">Superadmin</option>
                <option value="admin">Admin</option>
                <option value="steward">Steward</option>
                <option value="patron">Patron</option>
                <option value="service_partner">Service Partner</option>
              </select>
              <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }} onClick={fetchUsers}>Filter</button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Name / Email</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Username</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>System Role</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '2rem 0.5rem', textAlign: 'center' }}>No users found matching query.</td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.userId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ fontWeight: 'bold' }}>{u.firstName || ''} {u.lastName || ''}</div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.email}</span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>@{u.username}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        {u.role === 'superadmin' ? (
                          <span className="badge badge-success">Superadmin</span>
                        ) : (
                          <select 
                            className="form-control" 
                            style={{ width: '150px', padding: '0.35rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)' }}
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.userId, e.target.value)}
                          >
                            <option value="patron">Patron</option>
                            <option value="service_partner">Service Partner</option>
                            <option value="steward">Steward</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span className={`badge ${u.isActive ? 'badge-success' : 'badge-error'}`}>
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                        {u.role !== 'superadmin' ? (
                          <button 
                            className={`btn ${u.isActive ? 'btn-secondary' : 'btn-primary'}`}
                            style={{ 
                              padding: '0.35rem 1rem', 
                              fontSize: '0.8rem',
                              background: u.isActive ? 'rgba(250, 80, 80, 0.1)' : undefined,
                              color: u.isActive ? 'hsl(var(--error))' : undefined,
                              borderColor: u.isActive ? 'hsla(var(--error), 0.3)' : undefined
                            }}
                            onClick={() => handleToggleUserActive(u.userId)}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unrestricted</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Gig Moderation */}
      {activeTab === 'jobs' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2>Gig Moderation Board</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                className="form-control" 
                style={{ width: '220px', padding: '0.5rem 1rem' }}
                placeholder="Search gigs title..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
              />
              <select 
                className="form-control" 
                style={{ width: '160px', padding: '0.5rem' }}
                value={jobStatusFilter}
                onChange={(e) => setJobStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }} onClick={fetchJobs}>Search</button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Title & Client</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Category</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Price Cap</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Workflow State</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Moderation Commands</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '2rem 0.5rem', textAlign: 'center' }}>No jobs found matching query.</td>
                  </tr>
                ) : (
                  jobs.map(j => (
                    <tr key={j.jobId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ fontWeight: 'bold' }}>{j.title}</div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Client: @{j.patron?.username} ({j.patron?.email})</span>
                        {j.rejectionReason && (
                          <div style={{ fontSize: '0.8rem', color: 'hsl(var(--error))', marginTop: '0.25rem', background: 'rgba(250,80,80,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                            <strong>Rejection Note:</strong> {j.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span className="badge badge-secondary" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                          {j.category?.name}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>${parseFloat(j.budgetMax).toLocaleString()}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span className={`badge ${
                          j.status === 'approved' ? 'badge-success' : 
                          j.status === 'pending' ? 'badge-warning' : 'badge-error'
                        }`} style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                          {j.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {j.status !== 'approved' && j.status !== 'cancelled' && (
                            <button 
                              className="btn btn-primary" 
                              style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem', background: 'linear-gradient(135deg, hsl(var(--success)), hsl(var(--primary)))', border: 'none' }}
                              onClick={() => handleJobStatusChange(j.jobId, 'approved')}
                            >
                              ✓ Approve
                            </button>
                          )}
                          {j.status !== 'rejected' && j.status !== 'cancelled' && (
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem', borderColor: 'hsla(var(--error), 0.3)', color: 'hsl(var(--error))', background: 'rgba(250,80,80,0.05)' }}
                              onClick={() => handleJobStatusChange(j.jobId, 'rejected')}
                            >
                              ✕ Reject
                            </button>
                          )}
                          {j.status !== 'cancelled' && (
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
                              onClick={() => handleJobStatusChange(j.jobId, 'cancelled')}
                            >
                              Cancel Post
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Customer Complaints */}
      {activeTab === 'complaints' && (
        <div className="glass-card">
          <h2 style={{ marginBottom: '1.5rem' }}>Grievance Redressal Registry</h2>
          
          {complaints.length === 0 ? (
            <p>No customer complaints or suggestions filed in logs.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {complaints.map(c => (
                <div key={c.feedbackId} className="glass-card" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.15)', borderColor: c.status === 'open' ? 'hsla(var(--primary), 0.3)' : undefined }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {c.title}
                        <span className={`badge ${
                          c.type === 'complaint' ? 'badge-error' : 'badge-success'
                        }`} style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                          {c.type}
                        </span>
                      </h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Filer: @{c.user?.username} ({c.user?.email})</span>
                    </div>
                    <span className={`badge ${
                      c.status === 'resolved' ? 'badge-success' : 
                      c.status === 'open' ? 'badge-error' : 'badge-warning'
                    }`} style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                      {c.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.95rem', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{c.description}</p>
                  
                  {c.adminNotes && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <strong>Staff Notes:</strong> {c.adminNotes}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                      onClick={() => setUpdatingNotes({ id: c.feedbackId, type: 'complaint', notes: c.adminNotes || '', status: c.status })}
                    >
                      🛠️ Manage / Resolve Grievance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: DPDP Grievances */}
      {activeTab === 'dpdp' && (
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <h2 style={{ color: 'hsl(var(--error))', margin: 0 }}>DPDP Erasure Registry</h2>
            <span className="badge badge-error" style={{ fontSize: '0.7rem' }}>Regulatory Cell</span>
          </div>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Indian <strong>Digital Personal Data Protection (DPDP) Act Compliance:</strong> Active data erasure requests. Approving a request deactivates user immediately and marks erasure complete.
          </p>

          {dpdpRequests.length === 0 ? (
            <p>No active DPDP data erasure requests filed by users.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {dpdpRequests.map(r => (
                <div key={r.requestId} className="glass-card" style={{ padding: '1.5rem', background: 'rgba(250,80,80,0.02)', borderColor: 'hsla(var(--error), 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem' }}>Personal Data Erasure Claim</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Claimant: @{r.user?.username} ({r.user?.email})</span>
                    </div>
                    <span className={`badge ${
                      r.status === 'completed' ? 'badge-success' : 
                      r.status === 'pending' ? 'badge-warning' : 'badge-error'
                    }`} style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                      {r.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                    <strong>Legal Reason for Claim:</strong><br />
                    <span style={{ display: 'block', padding: '0.5rem', background: 'rgba(0,0,0,0.15)', borderRadius: '6px', marginTop: '0.25rem' }}>{r.reason || 'None provided.'}</span>
                  </p>
                  
                  {r.completedAt && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      ✓ Erasure Process Completed At: {new Date(r.completedAt).toLocaleString()}
                    </p>
                  )}

                  {r.adminNotes && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <strong>DPDP Audit Log Notes:</strong> {r.adminNotes}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    {r.status !== 'completed' && (
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: 'linear-gradient(135deg, hsl(var(--error)), hsl(var(--accent)))', border: 'none' }}
                        onClick={() => setUpdatingNotes({ id: r.requestId, type: 'dpdp', notes: r.adminNotes || '', status: 'completed' })}
                      >
                        ✓ Erase & Deactivate User
                      </button>
                    )}
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                      onClick={() => setUpdatingNotes({ id: r.requestId, type: 'dpdp', notes: r.adminNotes || '', status: r.status })}
                    >
                      Update Audit Notes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Note Updating Modal (Inline Glass Dialog overlay style) */}
      {updatingNotes.id && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '90%', padding: '2.5rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>
              {updatingNotes.type === 'dpdp' ? 'Update DPDP Compliance Log' : 'Manage Grievance Issue'}
            </h2>
            
            <form onSubmit={updatingNotes.type === 'dpdp' ? handleUpdateDpdp : handleUpdateComplaint}>
              <div className="form-group">
                <label className="form-label">Workflow Status</label>
                <select 
                  className="form-control"
                  value={updatingNotes.status}
                  onChange={(e) => setUpdatingNotes({ ...updatingNotes, status: e.target.value })}
                >
                  {updatingNotes.type === 'dpdp' ? (
                    <>
                      <option value="pending">Pending Audit</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed (Deactivate User)</option>
                    </>
                  ) : (
                    <>
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="dismissed">Dismissed</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Staff Log Notes</label>
                <textarea 
                  className="form-control" 
                  rows="4"
                  value={updatingNotes.notes}
                  onChange={(e) => setUpdatingNotes({ ...updatingNotes, notes: e.target.value })}
                  placeholder="Enter notes for this action..."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={() => setUpdatingNotes({ id: null, type: '', notes: '', status: '' })}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
