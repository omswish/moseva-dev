# 🔐 Authentication Specification — Moseva

This document provides a technical specification of the authentication, session validation, and role-based authorization systems implemented across the **Moseva** full-stack marketplace.

---

## 🔑 1. JWT Dual-Token Architecture

Moseva implements a secure, stateless session system leveraging **JSON Web Tokens (JWT)** via Express.js and Axios interceptor clients.

```
+--------------------------------------------------------------+
|                    Session Lifecycles                        |
+--------------------------------------------------------------+
| 1. Access Token: Short-lived (15 mins), sent in HTTP Header |
|    Authorization: Bearer <AccessToken>                       |
| 2. Refresh Token: Long-lived (7 days), stored in secure      |
|    httpOnly, sameSite: strict Cookie domain                  |
+--------------------------------------------------------------+
```

### 🔒 1.1 Secure Cookie Requirements (Production vs Development)
The refresh token is set as an HTTP cookie with strict security configurations inside [auth.controller.js](file:///Users/omys/Code/moseva-dev/backend/src/controllers/auth.controller.js):
```javascript
res.cookie('refreshToken', refreshToken, {
  httpOnly: true, // Prevents document.cookie accessibility (XSS protection)
  secure: process.env.NODE_ENV === 'production', // Requires HTTPS/TLS in production
  sameSite: 'strict', // Mitigates Cross-Site Request Forgery (CSRF)
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7-day expiration
});
```

---

## 🤝 2. Google OAuth Federation

Platform users can register or log in seamlessly using **Google Identity Services**.

### ⚙️ 2.1 Backend Ticket Verification
1. Clients (Web and Mobile Android SDKs) perform Google Sign-In and retrieve a verified `idToken` directly from Google's servers.
2. The `idToken` and preferred profile `role` are posted to `/api/v1/auth/google`.
3. The backend service ([auth.service.js](file:///Users/omys/Code/moseva-dev/backend/src/services/auth.service.js)) verifies the token authenticity with Google's OAuth library:
   ```javascript
   const { OAuth2Client } = require('google-auth-library');
   const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
   
   const ticket = await client.verifyIdToken({
     idToken,
     audience: process.env.GOOGLE_CLIENT_ID
   });
   const payload = ticket.getPayload();
   ```
4. If valid, the system inspects the verified `email` field.
   * **Existing User**: Retrieves account and issues new JWT session tokens.
   * **New User**: Instantly creates a secure profile using verified Google names, emails, and primary profile pictures (`avatarUrl`) with a randomly-seeded display handle.

---

## 🛡️ 3. RBAC & Superadmin Bypass Authorization

Platform permissions are regulated through modular, role-based authorization filters.

### 🎭 3.1 Platform Access Roles
* **`patron`**: Standard customer role. Can post job requests, explore partners, accept bids, initiate bookings, submit ratings, and trigger DPDP erasure claims.
* **`service_partner`**: Service professional role. Can browse approved gigs, submit timelines/bids, negotiate, and chat with customers.
* **`steward`**: Moderation/Administration role. Can fetch analytics, approve/reject job posts, deactivate/activate user accounts, and resolve grievances.
* **`superadmin`**: Unrestricted platform bypass steward.

### 🔓 3.2 Superadmin Unrestricted Middleware Bypass
The middleware filter [auth.js](file:///Users/omys/Code/moseva-dev/backend/src/middleware/auth.js) grants the `superadmin` role complete bypass permissions across all protected, role-limited endpoints:
```javascript
// backend/src/middleware/auth.js
const auth = catchAsync(async (req, res, next) => {
  // ... JWT Token Decrypt ...
  const user = await User.findByPk(decoded.userId);
  
  if (user && user.role === 'superadmin') {
    req.user = user;
    return next(); // Unrestricted Superadmin system bypass
  }
  
  // Standard User filters...
});
```
This enables the root account to seamlessly audit all admin panels, grievances, and compliance cells.