import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get('/jobs', { params: filters });
      return response.data.data; // contains jobs and pagination
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch job details');
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create job');
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/jobs/${jobId}`, jobData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to update job');
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (jobId, { rejectWithValue }) => {
    try {
      await api.delete(`/jobs/${jobId}`);
      return jobId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete job');
    }
  }
);

export const approveJob = createAsyncThunk(
  'jobs/approveJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/jobs/${jobId}/approve`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to approve job');
    }
  }
);

export const rejectJob = createAsyncThunk(
  'jobs/rejectJob',
  async ({ jobId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/jobs/${jobId}/reject`, { reason });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to reject job');
    }
  }
);

const initialState = {
  jobs: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
  currentJob: null,
  loading: false,
  error: null
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Job By ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Job
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload);
      })
      // Update Job
      .addCase(updateJob.fulfilled, (state, action) => {
        if (state.currentJob && state.currentJob.jobId === action.payload.jobId) {
          state.currentJob = action.payload;
        }
        const index = state.jobs.findIndex(j => j.jobId === action.payload.jobId);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      // Delete Job
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter(j => j.jobId !== action.payload);
        if (state.currentJob && state.currentJob.jobId === action.payload) {
          state.currentJob.status = 'cancelled';
        }
      })
      // Approve/Reject
      .addCase(approveJob.fulfilled, (state, action) => {
        if (state.currentJob && state.currentJob.jobId === action.payload.jobId) {
          state.currentJob = action.payload;
        }
        const index = state.jobs.findIndex(j => j.jobId === action.payload.jobId);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(rejectJob.fulfilled, (state, action) => {
        if (state.currentJob && state.currentJob.jobId === action.payload.jobId) {
          state.currentJob = action.payload;
        }
        const index = state.jobs.findIndex(j => j.jobId === action.payload.jobId);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      });
  }
});

export const { clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
