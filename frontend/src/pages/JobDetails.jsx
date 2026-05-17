import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobById, clearCurrentJob } from '../store/slices/jobSlice';
import { createBooking } from '../store/slices/bookingSlice';

export default function JobDetails() {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentJob, loading: jobLoading, error: jobError } = useSelector((state) => state.jobs);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { loading: bookingLoading, error: bookingError } = useSelector((state) => state.bookings);

  // Proposal form fields
  const [proposalText, setProposalText] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [proposedTimeline, setProposedTimeline] = useState('');
  const [appliedSuccessfully, setAppliedSuccessfully] = useState(false);

  useEffect(() => {
    dispatch(fetchJobById(jobId));
    return () => {
      dispatch(clearCurrentJob());
    };
  }, [jobId, dispatch]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!proposedPrice || !proposedTimeline || !proposalText) return;

    const resultAction = await dispatch(createBooking({
      jobId,
      proposalText,
      proposedPrice: parseFloat(proposedPrice),
      proposedTimeline: parseInt(proposedTimeline, 10)
    }));

    if (createBooking.fulfilled.match(resultAction)) {
      setAppliedSuccessfully(true);
    }
  };

  if (jobLoading) {
    return <div style={{ padding: '4rem', textAlign: 'center', fontSize: '1.2rem' }}>Loading job details...</div>;
  }

  if (jobError) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <div className="badge badge-error" style={{ padding: '1rem', marginBottom: '1.5rem' }}>{jobError}</div>
        <div><Link to="/marketplace" className="btn btn-secondary">Back to Marketplace</Link></div>
      </div>
    );
  }

  if (!currentJob) return null;

  const isOwner = user?.userId === currentJob.patronId;
  const isServicePartner = user?.role === 'service_partner';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', padding: '1rem 0', textAlign: 'left' }} className="animate-fade-in">
      
      {/* Left Column: Job Description & Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span className="badge badge-success" style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
              {currentJob.category?.name}
            </span>
            <span className={`badge ${
              currentJob.status === 'approved' ? 'badge-success' : 
              currentJob.status === 'pending' ? 'badge-warning' : 'badge-error'
            }`} style={{ textTransform: 'capitalize' }}>
              Status: {currentJob.status}
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{currentJob.title}</h1>
          
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Location Type</span>
              <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{currentJob.locationType}</span>
            </div>
            {currentJob.location && (
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Address/City</span>
                <span style={{ fontWeight: '600' }}>{currentJob.location}</span>
              </div>
            )}
            <div>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Priority Level</span>
              <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{currentJob.priority}</span>
            </div>
          </div>

          <h3 style={{ marginBottom: '0.75rem' }}>Job Description</h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', fontSize: '1.05rem', color: 'hsl(var(--text-primary))' }}>
            {currentJob.description}
          </p>
        </div>

        {/* Applied Successfully State */}
        {appliedSuccessfully && (
          <div className="glass-card" style={{ background: 'hsla(var(--success), 0.08)', borderColor: 'hsl(var(--success))' }}>
            <h3 style={{ color: 'hsl(var(--success))', marginBottom: '0.5rem' }}>✓ Application Submitted!</h3>
            <p>Your proposal was logged successfully. You can track this application inside your Dashboard.</p>
            <Link to="/dashboard" className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>Go to Dashboard</Link>
          </div>
        )}

        {/* Application / Proposal Form for Service Partners */}
        {isServicePartner && currentJob.status === 'approved' && !appliedSuccessfully && (
          <div className="glass-card">
            <h3 style={{ marginBottom: '1.5rem' }}>Apply for this Job</h3>
            
            {bookingError && (
              <div className="badge badge-error" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.5rem', justifyContent: 'center' }}>
                {bookingError}
              </div>
            )}

            <form onSubmit={handleApply}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Your Bid Price ($)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Enter bid amount"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Timeline (In Days)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="e.g. 3 days"
                    value={proposedTimeline}
                    onChange={(e) => setProposedTimeline(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Proposal Cover Letter</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder="Explain why you are qualified, how you plan to execute the job, etc."
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={bookingLoading}>
                {bookingLoading ? 'Submitting proposal...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        {!isAuthenticated && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Sign in to Apply</h3>
            <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Are you a service provider? Sign in to submit a proposal.</p>
            <Link to="/login" className="btn btn-primary">Sign In Now</Link>
          </div>
        )}
      </div>

      {/* Right Column: Sidebar (Budget, Customer Info, Deadline) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Budget Cap</span>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'hsl(var(--primary))' }}>
              ${parseFloat(currentJob.budgetMax || currentJob.budgetMin || 0).toLocaleString()}
            </span>
          </div>

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Posted By</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {currentJob.patron?.avatarUrl ? (
                <img 
                  src={currentJob.patron.avatarUrl} 
                  alt="avatar" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {currentJob.patron?.username?.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <span style={{ display: 'block', fontWeight: '600', fontSize: '0.95rem' }}>
                  {currentJob.patron?.firstName ? `${currentJob.patron.firstName} ${currentJob.patron.lastName || ''}` : currentJob.patron?.username}
                </span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
                  Patron Client
                </span>
              </div>
            </div>
          </div>

          {currentJob.deadline && (
            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Deadline</span>
              <span style={{ fontWeight: '600' }}>
                {new Date(currentJob.deadline).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        <Link to="/marketplace" className="btn btn-secondary" style={{ width: '100%' }}>
          ← Back to Marketplace
        </Link>
      </div>

    </div>
  );
}
