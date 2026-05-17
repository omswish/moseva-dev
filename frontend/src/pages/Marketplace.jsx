import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchJobs } from '../store/slices/jobSlice';
import api from '../services/api';

export default function Marketplace() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [locationType, setLocationType] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { jobs, pagination, loading, error } = useSelector((state) => state.jobs);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  // Fetch jobs when filters or page changes
  useEffect(() => {
    const filters = {
      page,
      limit: 6,
      status: 'approved'
    };
    if (selectedCategory) filters.categoryId = selectedCategory;
    if (search) filters.search = search;
    if (locationType) filters.locationType = locationType;
    if (budgetMin) filters.budgetMin = budgetMin;
    if (budgetMax) filters.budgetMax = budgetMax;

    dispatch(fetchJobs(filters));
  }, [selectedCategory, search, locationType, budgetMin, budgetMax, page, dispatch]);

  const handleCardClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }} className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>Service Marketplace</h1>
        <p style={{ fontSize: '1.1rem' }}>Find trusted service postings or apply for local gigs on-demand.</p>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Search Keywords</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Plumbing, cleaning..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Category</label>
          <select 
            className="form-control" 
            value={selectedCategory} 
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Location Style</label>
          <select 
            className="form-control" 
            value={locationType} 
            onChange={(e) => { setLocationType(e.target.value); setPage(1); }}
          >
            <option value="">Flexible</option>
            <option value="onsite">On-Site Only</option>
            <option value="remote">Remote Gigs</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Budget range ($)</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="number" 
              className="form-control" 
              placeholder="Min" 
              value={budgetMin}
              onChange={(e) => { setBudgetMin(e.target.value); setPage(1); }}
            />
            <input 
              type="number" 
              className="form-control" 
              placeholder="Max" 
              value={budgetMax}
              onChange={(e) => { setBudgetMax(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Loading awesome jobs...</div>
      ) : error ? (
        <div className="badge badge-error" style={{ padding: '1rem', justifyContent: 'center' }}>{error}</div>
      ) : jobs.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <h3>No Jobs Found</h3>
          <p style={{ marginTop: '0.5rem' }}>Try adjusting your search criteria or category filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
          {jobs.map(job => (
            <div 
              key={job.jobId} 
              className="glass-card" 
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left', cursor: 'pointer', height: '100%' }}
              onClick={() => handleCardClick(job.jobId)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge badge-success" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    {job.category?.name || 'Gigs'}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>
                    👀 {job.viewedCount || 0} views
                  </span>
                </div>
                
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>{job.title}</h3>
                
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {job.description}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', marginTop: '1rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Budget</span>
                    <span style={{ fontWeight: '700', fontSize: '1.15rem', color: 'hsl(var(--primary))' }}>
                      ${parseFloat(job.budgetMax || job.budgetMin || 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', textAlign: 'right' }}>Style</span>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', textTransform: 'capitalize' }}>
                      {job.locationType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button 
            className="btn btn-secondary" 
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span style={{ display: 'flex', alignItems: 'center', fontWeight: '600' }}>
            Page {page} of {pagination.totalPages}
          </span>
          <button 
            className="btn btn-secondary" 
            disabled={page === pagination.totalPages}
            onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
