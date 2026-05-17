# Frontend Architecture

## Overview
This document outlines the frontend architecture for the service marketplace application built with React. The architecture follows modern React best practices with a focus on scalability, maintainability, and performance.

## Technology Stack

### Core Technologies
- **React 19**: UI library with hooks and functional components
- **React Router v6**: Client-side routing
- **Redux Toolkit**: Global state management
- **Material-UI (MUI) v5**: Component library and theming
- **Axios**: HTTP client with interceptors
- **Socket.IO Client**: Real-time communication
- **React Hook Form**: Form handling with validation
- **Yup**: Schema validation

### Build & Development
- **Create React App**: Build tooling and development server
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest & React Testing Library**: Testing framework

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   └── assets/
│       ├── images/
│       └── fonts/
├── src/
│   ├── app/
│   │   ├── store.js              # Redux store configuration
│   │   ├── rootReducer.js        # Root reducer
│   │   └── rootReducer.test.js
│   ├── features/                 # Feature-based modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   ├── ForgotPasswordForm.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   └── ForgotPasswordPage.jsx
│   │   │   ├── services/
│   │   │   │   ├── auth.service.js
│   │   │   │   └── auth.service.test.js
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   └── authSlice.test.js
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.js
│   │   │   └── validation/
│   │   │       └── authValidation.js
│   │   ├── jobs/
│   │   │   ├── components/
│   │   │   │   ├── JobCard.jsx
│   │   │   │   ├── JobList.jsx
│   │   │   │   ├── JobForm.jsx
│   │   │   │   ├── JobFilters.jsx
│   │   │   │   └── JobDetails.jsx
│   │   │   ├── pages/
│   │   │   │   ├── JobsPage.jsx
│   │   │   │   ├── JobDetailsPage.jsx
│   │   │   │   ├── CreateJobPage.jsx
│   │   │   │   └── EditJobPage.jsx
│   │   │   ├── services/
│   │   │   │   └── job.service.js
│   │   │   ├── slices/
│   │   │   │   └── jobSlice.js
│   │   │   └── hooks/
│   │   │       └── useJobs.js
│   │   ├── bookings/
│   │   │   ├── components/
│   │   │   │   ├── BookingCard.jsx
│   │   │   │   ├── BookingList.jsx
│   │   │   │   ├── BookingForm.jsx
│   │   │   │   └── BookingStatus.jsx
│   │   │   ├── pages/
│   │   │   │   ├── BookingsPage.jsx
│   │   │   │   └── BookingDetailsPage.jsx
│   │   │   ├── services/
│   │   │   │   └── booking.service.js
│   │   │   ├── slices/
│   │   │   │   └── bookingSlice.js
│   │   │   └── hooks/
│   │   │       └── useBookings.js
│   │   ├── chat/
│   │   │   ├── components/
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── MessageList.jsx
│   │   │   │   ├── MessageInput.jsx
│   │   │   │   ├── ConversationList.jsx
│   │   │   │   └── TypingIndicator.jsx
│   │   │   ├── pages/
│   │   │   │   ├── ChatPage.jsx
│   │   │   │   └── ConversationsPage.jsx
│   │   │   ├── services/
│   │   │   │   └── chat.service.js
│   │   │   ├── slices/
│   │   │   │   └── chatSlice.js
│   │   │   └── hooks/
│   │   │       └── useChat.js
│   │   ├── ratings/
│   │   │   ├── components/
│   │   │   │   ├── RatingForm.jsx
│   │   │   │   ├── StarRating.jsx
│   │   │   │   └── RatingDisplay.jsx
│   │   │   ├── pages/
│   │   │   │   └── RateJobPage.jsx
│   │   │   ├── services/
│   │   │   │   └── rating.service.js
│   │   │   └── slices/
│   │   │       └── ratingSlice.js
│   │   ├── users/
│   │   │   ├── components/
│   │   │   │   ├── UserProfile.jsx
│   │   │   │   ├── ProfileForm.jsx
│   │   │   │   └── AvatarUpload.jsx
│   │   │   ├── pages/
│   │   │   │   ├── ProfilePage.jsx
│   │   │   │   └── UserDetailPage.jsx
│   │   │   ├── services/
│   │   │   │   └── user.service.js
│   │   │   └── slices/
│   │   │       └── userSlice.js
│   │   └── admin/
│   │       ├── components/
│   │       │   ├── Dashboard.jsx
│   │       │   ├── UserManagement.jsx
│   │       │   └── JobApproval.jsx
│   │       ├── pages/
│   │       │   ├── AdminDashboard.jsx
│   │       │   └── AdminUsersPage.jsx
│   │       ├── services/
│   │       │   └── admin.service.js
│   │       └── slices/
│   │           └── adminSlice.js
│   ├── components/               # Shared components
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navigation.jsx
│   │   │   └── MainLayout.jsx
│   │   └── index.js              # Barrel export
│   ├── hooks/                    # Custom hooks
│   │   ├── useApi.js
│   │   ├── useLocalStorage.js
│   │   ├── useDebounce.js
│   │   ├── useSocket.js
│   │   └── useMediaQuery.js
│   ├── services/                 # API services
│   │   ├── api.js                # Axios instance configuration
│   │   ├── socket.js             # Socket.IO configuration
│   │   └── interceptors.js       # Request/response interceptors
│   ├── utils/                    # Utility functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── testUtils.js
│   ├── styles/                   # Global styles
│   │   ├── theme.js              # MUI theme configuration
│   │   ├── globals.css
│   │   └── responsive.css
│   ├── routes/                   # Route configuration
│   │   ├── index.js              # Route definitions
│   │   ├── PrivateRoute.jsx      # Protected route wrapper
│   │   └── PublicRoute.jsx       # Public route wrapper
│   ├── context/                  # React Context
│   │   ├── ThemeContext.jsx
│   │   └── SocketContext.jsx
│   ├── config/                   # Configuration
│   │   ├── env.js                # Environment variables
│   │   └── constants.js
│   ├── App.jsx                   # Main app component
│   ├── App.test.js
│   ├── index.js                  # Entry point
│   └── setupTests.js
├── .env.example
├── .env.local
├── package.json
├── README.md
├── jest.config.js
└── .eslintrc.json
```

## State Management

### Redux Store Structure

```javascript
// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slices/authSlice';
import jobReducer from '../features/jobs/slices/jobSlice';
import bookingReducer from '../features/bookings/slices/bookingSlice';
import chatReducer from '../features/chat/slices/chatSlice';
import userReducer from '../features/users/slices/userSlice';
import adminReducer from '../features/admin/slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    bookings: bookingReducer,
    chat: chatReducer,
    user: userReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['chat/messageReceived'], // Ignore Socket.IO actions
      },
    }),
});
```

### Redux Slice Pattern

```javascript
// features/auth/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/auth.service';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
```

### Custom Hooks for State Access

```javascript
// features/auth/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, register } from '../slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: (credentials) => dispatch(login(credentials)),
    logout: () => dispatch(logout()),
    register: (userData) => dispatch(register(userData)),
  };
};
```

## Component Architecture

### Component Types

1. **Presentational Components**: Focus on UI, receive data via props
2. **Container Components**: Connect to Redux, manage state
3. **Page Components**: Route-level components that compose other components

### Component Pattern Example

```jsx
// features/jobs/components/JobCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Button, Chip } from '@mui/material';
import { formatCurrency, formatDate } from '../../../utils/formatters';

const JobCard = ({ job, onViewDetails, onApply }) => {
  return (
    <Card sx={{ mb: 2, hover: { boxShadow: 6 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" component="h2">
            {job.title}
          </Typography>
          <Chip 
            label={job.priority} 
            color={job.priority === 'urgent' ? 'error' : 'primary'}
            size="small"
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {job.description.substring(0, 150)}...
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2">
              {formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {job.location} • {job.locationType}
            </Typography>
          </Box>
          
          <Box>
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => onViewDetails(job.jobId)}
              sx={{ mr: 1 }}
            >
              View Details
            </Button>
            {onApply && (
              <Button 
                variant="contained" 
                size="small"
                onClick={() => onApply(job.jobId)}
              >
                Apply Now
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    jobId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    budgetMin: PropTypes.number.isRequired,
    budgetMax: PropTypes.number.isRequired,
    location: PropTypes.string,
    locationType: PropTypes.string.isRequired,
  }).isRequired,
  onViewDetails: PropTypes.func,
  onApply: PropTypes.func,
};

export default JobCard;
```

## Routing Configuration

```jsx
// routes/index.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Lazy load pages for code splitting
const LoginPage = React.lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('../features/auth/pages/RegisterPage'));
const JobsPage = React.lazy(() => import('../features/jobs/pages/JobsPage'));
const JobDetailsPage = React.lazy(() => import('../features/jobs/pages/JobDetailsPage'));
const CreateJobPage = React.lazy(() => import('../features/jobs/pages/CreateJobPage'));
const ChatPage = React.lazy(() => import('../features/chat/pages/ChatPage'));
const ProfilePage = React.lazy(() => import('../features/users/pages/ProfilePage'));
const AdminDashboard = React.lazy(() => import('../features/admin/pages/AdminDashboard'));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/jobs"
        element={
          <PrivateRoute>
            <JobsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/jobs/:id"
        element={
          <PrivateRoute>
            <JobDetailsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/jobs/create"
        element={
          <PrivateRoute roles={['patron']}>
            <CreateJobPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute roles={['steward']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/jobs" replace />} />
      <Route path="*" element={<Navigate to="/jobs" replace />} />
    </Routes>
  );
};

export default AppRoutes;
```

## API Service Layer

```javascript
// services/api.js
import axios from 'axios';
import { API_BASE_URL } from '../config/env';
import { setupInterceptors } from './interceptors';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For HTTP-only cookies
});

// Setup request/response interceptors
setupInterceptors(api);

export default api;
```

```javascript
// features/jobs/services/job.service.js
import api from '../../../services/api';

const jobService = {
  // Get all jobs with filtering, pagination
  async getJobs(params = {}) {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  // Get single job by ID
  async getJob(jobId) {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  // Create new job
  async createJob(jobData) {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update job
  async updateJob(jobId, jobData) {
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return response.data;
  },

  // Delete job
  async deleteJob(jobId) {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  },

  // Get my jobs (patron's own jobs)
  async getMyJobs(params = {}) {
    const response = await api.get('/jobs/my-jobs', { params });
    return response.data;
  },
};

export default jobService;
```

## Real-time Communication

```javascript
// services/socket.js
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config/env';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.setupEventListeners();
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  // Chat events
  sendMessage(conversationId, content, messageType = 'text') {
    this.socket.emit('chat:message', {
      conversationId,
      content,
      messageType,
    });
  }

  onMessageReceived(callback) {
    this.socket.on('chat:message', callback);
  }

  sendTypingIndicator(conversationId, isTyping) {
    this.socket.emit('chat:typing', { conversationId, isTyping });
  }

  onTypingReceived(callback) {
    this.socket.on('chat:typing', callback);
  }

  markMessageAsRead(conversationId, messageId) {
    this.socket.emit('chat:read', { conversationId, messageId });
  }

  // Notification events
  onNotification(callback) {
    this.socket.on('notification', callback);
  }

  // Booking events
  onBookingUpdate(callback) {
    this.socket.on('booking:update', callback);
  }
}

export default new SocketService();
```

## Theming & Styling

```javascript
// styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#f50057',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 500 },
    h2: { fontSize: '2rem', fontWeight: 500 },
    h3: { fontSize: '1.75rem', fontWeight: 500 },
    h4: { fontSize: '1.5rem', fontWeight: 500 },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export default theme;
```

## Error Handling

```jsx
// components/common/ErrorBoundary.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    // Log to error reporting service
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleRetry}
          >
            Retry
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## Performance Optimizations

### Code Splitting
```jsx
// Lazy loading components
const JobDetailsPage = React.lazy(() => import('./pages/JobDetailsPage'));

// Suspense boundary
<Suspense fallback={<Loader />}>
  <JobDetailsPage />
</Suspense>
```

### Memoization
```jsx
// Prevent unnecessary re-renders
const JobCard = React.memo(({ job }) => {
  // component logic
});

// Memoize expensive calculations
const filteredJobs = useMemo(() => {
  return jobs.filter(job => /* filter logic */);
}, [jobs, filters]);
```

### Virtual Scrolling
```jsx
// For large lists
import { FixedSizeList } from 'react-window';

const VirtualizedJobList = ({ jobs }) => {
  return (
    <FixedSizeList
      height={600}
      itemCount={jobs.length}
      itemSize={100}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <JobCard job={jobs[index]} />
        </div>
      )}
    </FixedSizeList>
  );
};
```

## Testing Strategy

### Unit Tests
```javascript
// features/auth/slices/authSlice.test.js
import authReducer, { logout, clearError } from './authSlice';

describe('auth slice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle logout', () => {
    const state = {
      ...initialState,
      user: { id: '1', name: 'Test' },
      token: 'token123',
      isAuthenticated: true,
    };
    const result = authReducer(state, logout());
    expect(result).toEqual(initialState);
  });
});
```

### Component Tests
```javascript
// features/jobs/components/JobCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import JobCard from './JobCard';

describe('JobCard', () => {
  const mockJob = {
    jobId: '1',
    title: 'Test Job',
    description: 'Test description',
    priority: 'medium',
    budgetMin: 100,
    budgetMax: 200,
    location: 'Remote',
    locationType: 'remote',
  };

  it('renders job information', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('Test Job')).toBeInTheDocument();
    expect(screen.getByText('Test description...')).toBeInTheDocument();
  });

  it('calls onViewDetails when button clicked', () => {
    const onViewDetails = jest.fn();
    render(<JobCard job={mockJob} onViewDetails={onViewDetails} />);
    
    fireEvent.click(screen.getByText('View Details'));
    expect(onViewDetails).toHaveBeenCalledWith('1');
  });
});
```

## Build & Localhost Run Configuration

### Local Environment Variables (.env.local)
Configure these locally so that the React frontend (running on port 3000) can connect to the Node/Express backend (running on port 5000):
```env
# .env.local
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_ENV=development
```

### Build Commands
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --coverage",
    "eject": "react-scripts eject",
    "lint": "eslint src --ext .js,.jsx",
    "format": "prettier --write src/"
  }
}
```

### Localhost Run & Deployment Considerations
- **Primary Hosting**: Run the local React development server on `http://localhost:3000` via `npm start`.
- **Local Media Loading**: Ensure backend allows local Cross-Origin Resource Sharing (CORS) so that local images (avatars, icons) serve correctly from `http://localhost:5000/uploads/...` to the frontend at `http://localhost:3000`.
- **Production Deployment (Optional / Future Scope)**:
  - **Static Hosting**: Deploy production build (`npm run build`) to Vercel, Netlify, or standard local Nginx.
  - **SSL**: Optional locally via self-signed certs. Required for cloud production.
  - **Error Monitoring**: Optional local console reporting or Winston file logs. Cloud Sentry integration is marked as out of scope.