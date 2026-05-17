import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, acceptBooking, rejectBooking, completeBooking } from '../store/slices/bookingSlice';
import { createJob, fetchJobs } from '../store/slices/jobSlice';
import api from '../services/api';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { bookings, loading: bookingsLoading } = useSelector((state) => state.bookings);
  const { jobs, loading: jobsLoading } = useSelector((state) => state.jobs);

  // Tabs: 'bookings' or 'post_job' or 'my_jobs'
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Category list for posting jobs
  const [categories, setCategories] = useState([]);

  // Job creation fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [locationType, setLocationType] = useState('flexible');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');
  const [jobPostedSuccess, setJobPostedSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchBookings());
    
    // Load categories
    const getCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    getCategories();

    // Fetch my posted jobs if Patron
    if (user?.role === 'patron' || user?.role === 'steward') {
      dispatch(fetchJobs({ patronId: user.userId, status: '' })); // fetch all status
    }
  }, [dispatch, user]);

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!title || !description || !categoryId || !budgetMax) return;

    const resultAction = await dispatch(createJob({
      title,
      description,
      categoryId,
      budgetMin: 0,
      budgetMax: parseFloat(budgetMax),
      locationType,
      location,
      priority,
      deadline: deadline || null
    }));

    if (createJob.fulfilled.match(resultAction)) {
      setJobPostedSuccess(true);
      setTitle('');
      setDescription('');
      setCategoryId('');
      setBudgetMax('');
      setLocation('');
      setDeadline('');
      setTimeout(() => setJobPostedSuccess(false), 5000);
    }
  };

  const handleAcceptProposal = (bookingId) => {
    dispatch(acceptBooking(bookingId));
  };

  const handleRejectProposal = (bookingId) => {
    dispatch(rejectBooking(bookingId));
  };

  const handleCompleteGig = (bookingId) => {
    dispatch(completeBooking(bookingId));
  };

  const isPatron = user?.role === 'patron';
  const isPartner = user?.role === 'service_partner';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0', textAlign: 'left' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>User Dashboard</h1>
          <p>Manage your postings, review active applications, and complete scheduled bookings.</p>
        </div>
        <span className="badge badge-success" style={{ textTransform: 'capitalize', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
          Role: {user?.role?.replace('_', ' ')}
        </span>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
        <button 
          className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
          onClick={() => setActiveTab('bookings')}
        >
          {isPatron ? 'Proposals & Gigs' : 'My Gigs & Applications'}
        </button>

        {isPatron && (
          <>
            <button 
              className={`btn ${activeTab === 'my_jobs' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
              onClick={() => setActiveTab('my_jobs')}
            >
              My Posted Jobs
            </button>
            <button 
              className={`btn ${activeTab === 'post_job' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
              onClick={() => setActiveTab('post_job')}
            >
              + Post a New Job
            </button>
          </>
        )}
      </div>

      {/* Tab Contents: Bookings */}
      {activeTab === 'bookings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookingsLoading ? (
            <p>Loading gigs...</p>
          ) : bookings.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <h3>No Active Gigs</h3>
              <p style={{ marginTop: '0.5rem' }}>
                {isPatron ? "Proposals submitted by Service Partners will show up here." : "Explore the marketplace and submit applications to see them here!"}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {bookings.map(b => (
                <div key={b.bookingId} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem' }}>{b.job?.title}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
                        Booking ID: {b.bookingId}
                      </span>
                    </div>
                    <span className={`badge ${
                      b.status === 'accepted' ? 'badge-success' : 
                      b.status === 'pending' ? 'badge-warning' : 'badge-error'
                    }`} style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                      {b.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.95rem' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Proposed Price</span>
                      <span style={{ fontWeight: '700', color: 'hsl(var(--primary))', fontSize: '1.1rem' }}>
                        ${parseFloat(b.proposedPrice).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Proposed Timeline</span>
                      <span style={{ fontWeight: '600' }}>
                        {b.proposedTimeline} Days
                      </span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>
                        {isPatron ? 'Applicant Partner' : 'Client Patron'}
                      </span>
                      <span style={{ fontWeight: '600' }}>
                        {isPatron ? b.servicePartner?.username : b.patron?.username}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Proposal Details</span>
                    <p style={{ fontSize: '0.9rem', background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: '8px' }}>
                      {b.proposalText}
                    </p>
                  </div>

                  {/* Actions based on Status */}
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    {isPatron && b.status === 'pending' && (
                      <>
                        <button className="btn btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }} onClick={() => handleRejectProposal(b.bookingId)}>
                          Reject Proposal
                        </button>
                        <button className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }} onClick={() => handleAcceptProposal(b.bookingId)}>
                          Accept & Appoint
                        </button>
                      </>
                    )}

                    {b.status === 'accepted' && (
                      <button className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }} onClick={() => handleCompleteGig(b.bookingId)}>
                        Mark Gig as Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Contents: My Posted Jobs */}
      {activeTab === 'my_jobs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {jobsLoading ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p>You haven't posted any jobs yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {jobs.map(job => (
                <div key={job.jobId} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span className="badge badge-success" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                        {job.category?.name}
                      </span>
                      <span className={`badge ${
                        job.status === 'approved' ? 'badge-success' : 
                        job.status === 'pending' ? 'badge-warning' : 'badge-error'
                      }`} style={{ textTransform: 'capitalize', fontSize: '0.7rem' }}>
                        {job.status}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{job.title}</h3>
                    <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>{job.description.substring(0, 100)}...</p>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>Budget Cap</span>
                      <span style={{ fontWeight: '700', color: 'hsl(var(--primary))' }}>${parseFloat(job.budgetMax).toLocaleString()}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>👀 {job.viewedCount || 0} views</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Contents: Post a New Job */}
      {activeTab === 'post_job' && (
        <div className="glass-card" style={{ maxWidth: '650px' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Post a New Service Request</h2>
          
          {jobPostedSuccess && (
            <div className="badge badge-success" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.5rem', justifyContent: 'center' }}>
              ✓ Job post created successfully! It requires Staff approval before showing on marketplace.
            </div>
          )}

          <form onSubmit={handlePostJob}>
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Need complete bathroom plumbing overhaul" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea 
                className="form-control" 
                rows="4" 
                placeholder="Explain the job scope, materials available, requirements, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Category</label>
                <select 
                  className="form-control" 
                  value={categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Budget Limit ($)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="e.g. 500" 
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Location Type</label>
                <select 
                  className="form-control" 
                  value={locationType} 
                  onChange={(e) => setLocationType(e.target.value)}
                >
                  <option value="flexible">Flexible</option>
                  <option value="onsite">On-Site Only</option>
                  <option value="remote">Remote Gigs</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Specific Location / Address</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Downtown Boston" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Priority</label>
                <select 
                  className="form-control" 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Deadline Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
              Submit Job Posting
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
