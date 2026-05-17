# Authentication Specification

## Overview
This document details the authentication and authorization system for the service marketplace application. The system uses JWT (JSON Web Tokens) with refresh tokens for secure, scalable authentication.

## Authentication Flow

### 1. Registration
```
User → POST /auth/register → Server
Server → Create user → Hash password → Generate tokens → Return tokens
```

### 2. Login
```
User → POST /auth/login → Server
Server → Verify credentials → Generate tokens → Return tokens + user info
```

### 3. Token Refresh
```
User → POST /auth/refresh (with refresh token) → Server
Server → Validate refresh token → Generate new access token → Return new token
```

### 4. Logout
```
User → POST /auth/logout → Server
Server → Revoke refresh token → Clear session
```

## Token Structure

### Access Token (JWT)
**Purpose:** Short-lived token for API authentication  
**Expiration:** 15 minutes  
**Storage:** Memory (not persisted)  
**Usage:** Bearer token in Authorization header

**Payload:**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "patron",
  "iat": 1640000000,
  "exp": 1640000900
}
```

### Refresh Token
**Purpose:** Long-lived token for obtaining new access tokens  
**Expiration:** 7 days (configurable)  
**Storage:** Database (hashed) + HTTP-only cookie or secure storage  
**Usage:** Sent with refresh token requests

**Storage in Database:**
```sql
INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
VALUES ('user-uuid', 'hashed_token', NOW() + INTERVAL '7 days');
```

## Security Measures

### Password Hashing
- **Algorithm:** bcrypt
- **Salt Rounds:** 12
- **Minimum Password Requirements:**
  - Length: 8+ characters
  - Contains uppercase and lowercase letters
  - Contains at least one number
  - Contains at least one special character

### Token Security
- **Access Tokens:** Signed with HS256 (HMAC using SHA-256 symmetric secret string from `.env`)
- **Refresh Tokens:** Stored as SHA-256 hash in database
- **Token Revocation:** Refresh tokens can be revoked individually
- **IP Binding (Optional):** Tokens can be bound to IP address for additional security in production

### Rate Limiting
- **Login attempts:** 5 per minute per IP
- **Registration:** 3 per minute per IP
- **Password reset:** 3 per minute per email
- **Token refresh:** 10 per minute per user

## Authorization & Role-Based Access Control (RBAC)

### Role Hierarchy
```
Steward (Admin)
├── Full system access
├── User management
├── Job approval/rejection
└── System monitoring

Patron (Customer)
├── Post jobs
├── Manage own jobs
├── Chat with service partners
└── Rate services

Service Partner (Worker)
├── Browse jobs
├── Apply to jobs
├── Chat with patrons
└── Manage bookings
```

### Permission Matrix

| Action | Steward | Patron | Service Partner |
|--------|---------|--------|-----------------|
| View all users | ✅ | ❌ | ❌ |
| Manage user roles | ✅ | ❌ | ❌ |
| Approve/reject jobs | ✅ | ❌ | ❌ |
| Post jobs | ❌ | ✅ | ❌ |
| Edit own jobs | ❌ | ✅ | ❌ |
| Apply to jobs | ❌ | ❌ | ✅ |
| Chat with users | ✅ | ✅ | ✅ |
| Rate services | ✅ | ✅ | ✅ |
| View system stats | ✅ | ❌ | ❌ |

### Middleware Implementation

#### Authentication Middleware
```javascript
// middleware/auth.js
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'NO_TOKEN', message: 'No token provided' }
      });
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: { code: 'TOKEN_EXPIRED', message: 'Token expired' }
      });
    }
    res.status(403).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid token' }
    });
  }
};
```

#### Authorization Middleware
```javascript
// middleware/authorize.js
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
      });
    }
    next();
  };
};

// Usage in routes:
router.post('/jobs', authenticate, authorize('patron'), jobController.createJob);
router.get('/admin/users', authenticate, authorize('steward'), userController.getAllUsers);
```

## Email Verification & Local Bypass

### Verification Flow (Production vs Local Dev)
In production, a real SMTP flow is executed. For the **localhost college project**, a local development strategy is supported to avoid needing Gmail SMTP configuration:

1. **Auto-Verification (Default Dev Configuration):**
   - When `NODE_ENV=development` is set, accounts can be automatically marked as verified (`is_verified = true`) upon registration, bypassing the need to verify email altogether.
2. **Terminal Log Flow (For Testing):**
   - If email verification is active in local dev, the backend will print/log the generated verification URL directly to the terminal stdout console (e.g. `Email Verification URL: http://localhost:3000/verify-email?token=...`).
   - The student can simply copy-paste this printed URL directly into their browser to simulate the click and trigger the `POST /auth/verify-email` endpoint.

### Email Templates (Production SMTP only)

**Verification Email:**
```
Subject: Verify your email for Service Marketplace

Hello {username},

Thank you for registering! Please verify your email by clicking the link below:

{verification_link}

This link expires in 24 hours.

If you didn't create an account, please ignore this email.
```

## Password Reset

### Reset Flow
1. User requests password reset → `POST /auth/forgot-password`
2. System validates email → Generates reset token → Sends email
3. User clicks reset link → `POST /auth/reset-password`
4. Token validated → Password updated → All refresh tokens revoked

### Reset Token
- **Expiration:** 1 hour
- **Single use:** Token is deleted after use
- **Secure generation:** Cryptographically random token

## Session Management

### Concurrent Sessions
- **Maximum active sessions:** 5 per user (configurable)
- **Session tracking:** Refresh tokens in database
- **Session revocation:** Users can revoke specific sessions

### Session Security
- **IP tracking:** Optional IP binding for sessions
- **User-Agent tracking:** Detect suspicious session changes
- **Automatic cleanup:** Expired tokens removed daily

## Environment Variables (Localhost Setup)

```env
# JWT Configuration (Symmetric HS256)
ACCESS_TOKEN_SECRET=your_access_token_secret_min_32_chars
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret_min_32_chars
REFRESH_TOKEN_EXPIRES_IN=7d

# Email Configuration (Optional for local development / mocked via stdout logs)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=optional_user@gmail.com
SMTP_PASS=optional_app_password
EMAIL_FROM=noreply@servicemarketplace.com

# Security
BCRYPT_SALT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=15m

# CORS (Allows local port sharing)
ALLOWED_ORIGINS=http://localhost:3000
```

## API Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email or password incorrect |
| `TOKEN_EXPIRED` | 401 | Access token has expired |
| `INVALID_TOKEN` | 403 | Token is invalid or malformed |
| `NO_TOKEN` | 401 | No token provided |
| `TOKEN_REVOKED` | 401 | Token has been revoked |
| `USER_NOT_VERIFIED` | 403 | Email not verified |
| `USER_INACTIVE` | 403 | Account is deactivated |
| `EMAIL_EXISTS` | 409 | Email already registered |
| `USERNAME_EXISTS` | 409 | Username already taken |
| `WEAK_PASSWORD` | 400 | Password doesn't meet requirements |
| `RESET_TOKEN_EXPIRED` | 400 | Password reset token expired |
| `RESET_TOKEN_INVALID` | 400 | Invalid reset token |
| `TOO_MANY_ATTEMPTS` | 429 | Too many login attempts |

## Frontend Integration

### Token Storage Strategy
```javascript
// Recommended approach: Memory + HTTP-only cookies
// Access token: In memory (React state/Redux)
// Refresh token: HTTP-only cookie (set by server)

// Alternative: Secure localStorage (with XSS protection)
// Both tokens in localStorage with encryption
```

### Axios Interceptor Setup
```javascript
// utils/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add access token
api.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { data } = await axios.post('/auth/refresh', {
          refreshToken: authService.getRefreshToken()
        });
        
        authService.setAccessToken(data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### Auth Service
```javascript
// services/auth.service.js
class AuthService {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    this.setTokens(response.data.data);
    return response.data;
  }

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    this.setTokens(response.data.data);
    return response.data;
  }

  async logout() {
    await api.post('/auth/logout');
    this.clearTokens();
  }

  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    const response = await api.post('/auth/refresh', { refreshToken });
    this.setAccessToken(response.data.data.accessToken);
    return response.data;
  }

  setTokens({ accessToken, refreshToken }) {
    // Store access token in memory
    this.accessToken = accessToken;
    // Refresh token stored in HTTP-only cookie by server
  }

  setAccessToken(token) {
    this.accessToken = token;
  }

  getAccessToken() {
    return this.accessToken;
  }

  getRefreshToken() {
    // Read from cookie
    return this.getCookie('refreshToken');
  }

  clearTokens() {
    this.accessToken = null;
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  isAuthenticated() {
    return !!this.accessToken;
  }

  getCurrentUser() {
    if (!this.accessToken) return null;
    return jwt_decode(this.accessToken);
  }
}

export default new AuthService();
```

## Testing Considerations

### Unit Tests
- Password hashing and verification
- Token generation and verification
- Permission checks
- Email validation

### Integration Tests
- Registration flow
- Login/logout flow
- Token refresh flow
- Password reset flow
- Role-based access control

### Security Tests
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Token tampering detection

## Monitoring & Logging

### Security Events to Log
- Failed login attempts
- Successful logins
- Token refreshes
- Password changes
- Account lockouts
- Suspicious activities

### Metrics to Track
- Active sessions count
- Failed login rate
- Token refresh rate
- Account creation rate
- Password reset requests

## Compliance Considerations

### GDPR Compliance
- Right to be forgotten (account deletion)
- Data export functionality
- Privacy policy disclosure
- Consent management

### Data Protection
- Password never logged or stored in plain text
- Personal data encrypted at rest
- Secure transmission (HTTPS/TLS)
- Regular security audits