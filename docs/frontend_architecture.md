# 💻 Web Frontend Architecture & Theme Design — Moseva

This document maps out the architecture, design choices, state models, and theme constants of the **Moseva Web Frontend React SPA** micro-application.

---

## 🎨 1. Design Aesthetic & Custom Theme System

Moseva implements a premium, high-contrast dark space-navy theme styled entirely using **Vanilla CSS Custom Properties** (no Material-UI, Tailwind, or external design framework dependencies).

### 🌈 1.1 Custom Theme HSL Colors
All colors are configured inside the central stylesheet [index.css](file:///Users/omys/Code/moseva-dev/frontend/src/index.css):
* **🌌 Primary Dark Space Background**: `hsl(222, 47%, 11%)` (Rich dark blue `#0b0f19`)
* **🟠 Highlight / Accent Accent Color**: `hsl(24, 96%, 53%)` (Pantone Neon Orange `#f97316`)
* **🟣 Indigo/Royal Blue Highlights**: `hsl(250, 84%, 54%)` (Deep Royal blue `#6366f1` for Superadmin elements)
* **🧊 Glassmorphic Card Background**: `rgba(255, 255, 255, 0.03)` (A sleek semi-transparent white backdrop over deep navy shadows)
* **🟢 Compliant Success Badge**: `hsl(142, 70%, 45%)` (Vibrant green `#10b981`)
* **🔴 Alert Danger Badge**: `hsl(0, 84%, 60%)` (Alert Crimson red `#ef4444`)

---

## 🏗️ 2. Core Frontend Architecture

The web application is built on a streamlined React 19 client compiled with **Vite** for optimized development hot-reloads and production assets minification.

```
+-------------------------------------------------------------+
|                      React Router v6                        |
+-------------------------------------------------------------+
|    [/login]       [/register]      [/explore]     [/chat]   |
|   LoginPage.jsx  RegisterPage.jsx  Explore.jsx    Chat.jsx  |
+-------------------------------------------------------------+
|                         Redux Store                         |
+-------------------------------------------------------------+
|      [authSlice]         [jobSlice]        [chatSlice]      |
+-------------------------------------------------------------+
|                        Services Layer                       |
+-------------------------------------------------------------+
|         [Axios client: api.js]       [Socket.IO: socket.js] |
+-------------------------------------------------------------+
```

---

## 🗃️ 3. Redux Global State Management

Application state is structured into feature slices using **Redux Toolkit**:

### 3.1 Auth Slice (`authSlice.js`)
Manages authentication statuses, profile loading, and verified OAuth tokens:
* **States**: `user` (profile object), `token` (JWT access token), `loading`, `error`, `isAuthenticated`.
* **Async Thunks**:
  * `loginUser(credentials)`: Dispatch email/password login.
  * `loginWithGoogle(idToken)`: Dispatches verified Google Identity tickets.
  * `fetchMe()`: Retrieves verified logged-in user profiles.
  * `logoutUser()`: Invokes endpoint logout, clears memory, and purges cookies.

### 3.2 Jobs Slice (`jobSlice.js`)
Manages exploring and creating job posts:
* **States**: `jobs` (list of approved public jobs), `myJobs` (user-specific listings), `currentJob` (detailed job information), `loading`, `error`.
* **Async Thunks**:
  * `fetchApprovedJobs(filters)`: Retrieves approved posts for exploration.
  * `createJobPost(jobData)`: Submits new patron job.
  * `submitProposal(proposalData)`: Service partner timeline bid submission.

---

## 🔌 4. API & Network Interceptors (`api.js`)

Moseva coordinates all HTTP communications through a configured Axios instance that handles network authentication seamlessly:
* **Base URL Routing**: Automatically bound to `import.meta.env.VITE_API_URL`.
* **Request Interceptor**: Automatically parses Redux memory and injects verified `Authorization: Bearer <token>` access tokens into the headers.
* **Response Interceptor (Silent JWT Refresh)**:
  1. If an API request returns an HTTP `401 Unauthorized` (indicating access token expiry), the interceptor halts standard requests.
  2. Dispatches a silent `POST /auth/refresh` request (transmitting the secure httpOnly cookie).
  3. If the server validates the refresh token, the interceptor captures the new `accessToken`, updates Redux memory, and retries the original failed API request.
  4. If the refresh token is expired or invalid (HTTP `403`), the interceptor signs the user out and clears the local profile.