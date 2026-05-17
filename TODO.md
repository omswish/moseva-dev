# 🚀 Project TODO – Service Marketplace (Moseva)

## 0️⃣ Prep & Tooling
- [ ] Add `.env.example` files for frontend & backend (already described).
- [ ] Install **Node ≥ 20**, **npm**, **Docker** (optional).
- [ ] Verify PostgreSQL is running locally (port 5432).

## 1️⃣ Backend – MVP (Node/Express + Sequelize)
### 1.1 Init & Dependencies
- [ ] `npm init -y` in `backend/`.
- [ ] Install core deps: `express sequelize pg pg-hstore dotenv jsonwebtoken bcrypt helmet cors compression cookie-parser express-rate-limit socket.io`.
- [ ] Install dev deps: `nodemon eslint prettier jest supertest`.

### 1️⃣.2 Project Skeleton
- [ ] Create folder hierarchy as described (`src/config`, `src/models`, `src/controllers`, …).
- [ ] Add **`src/config/database.js`** (Sequelize init using env vars).
- [ ] Add **`src/config/cors.js`**, **`src/config/socket.js`**.
- [ ] Add **`src/app.js`** (security middleware, static `/uploads`, rate limiter, routes, global error handler – copy from `backend_architecture.md`).
- [ ] Add **`server.js`** (DB connect, start HTTP server, init Socket.IO – copy from docs).

### 1️⃣.3 Core Models
- Implement models from **`database_schema.md`**: `User`, `Category`, `Job`, `Booking`, `Rating`, `Message`, `Conversation`, `RefreshToken`, `Notification`.
- Include model hooks for password hashing, timestamps, soft‑delete flags.

### 1️⃣.4 Auth System
- Implement **`auth.service.js`**, **`auth.controller.js`**, **routes** (`/auth/*`).
- Use the JWT‑refresh flow from **`authentication_specification.md`**.
- Add refresh‑token storage (`RefreshToken` model) and revocation logic.

### 1️⃣.5 Remaining Controllers / Services
- Users, Jobs, Bookings, Ratings, Categories, Chat, Notifications, Admin – skeleton files with CRUD + RBAC middleware.

### 1️⃣.6 Validation
- Add Joi schemas (`src/validators/*.validator.js`) per the docs.
- Wire them via `middleware/validation.js`.

### 1️⃣.7 Tests
- Write unit tests for auth, user creation, job CRUD.
- Write integration tests for protected routes.

### 1️⃣.8 Docs & Swagger (optional)
- Generate OpenAPI spec from the documented endpoints.

## 2️⃣ Frontend – MVP (React + Vite)
### 2.1 Scaffold
- `cd frontend && npx -y create-vite@latest . --template react`
- Install: `react-router-dom`, `@reduxjs/toolkit`, `react-redux`, `axios`, `socket.io-client`, `classnames`.

### 2.2 Design System (Premium UI)
- Choose a harmonious dark‑mode palette (e.g., HSL `--primary: hsl(210, 60%, 55%)`).
- Add Google Font **Inter** via `<link>` in `index.html`.
- Create `src/styles/theme.js` and global CSS with glass‑morphism cards, smooth gradients, and subtle micro‑animations (CSS transitions, `@keyframes` fade‑in/out).

### 2.3 Core Features
| Feature | Component(s) | Notes |
|---------|--------------|-------|
| Auth (Register / Login) | `auth/pages/*`, `auth/components/*`, `auth/service.js` | Store access token in memory, refresh token via http‑only cookie. |
| Job Browsing | `jobs/JobList`, `JobCard`, `JobsPage`, filters UI | Use `/jobs` API with pagination, sorting, full‑text search. |
| Job Creation / Editing | `jobs/JobForm`, `CreateJobPage` | Patron‑only, validated via Joi. |
| Bookings | `bookings/*` | Service‑partner apply, patron accept/reject. |
| Chat | `chat/ChatWindow`, `MessageList`, `MessageInput` | Socket.IO duplex connection, realtime updates. |
| Ratings | `ratings/*` | After booking completion. |
| Admin Dashboard | `admin/*` | Steward role: user management, job approval. |
| Notifications | `notifications/*` | Pull from `/notifications` endpoint, badge count. |

### 2.4 Routing
- Public routes (`/login`, `/register`, `/jobs`)
- Private routes wrapped by `<ProtectedRoute>` (checks auth slice).

### 2.5 State Management
- Redux slices for `auth`, `jobs`, `bookings`, `chat`, `notifications`.
- Central store in `src/app/store.js`.

### 2.6 API Layer
- Central `src/services/api.js` with Axios instance (baseURL from env, request/response interceptors for token refresh).

### 2.7 UI Polish
- Add **glass‑morphism cards** for job listings.
- Use **micro‑animations**: hover lift, button ripple, fade‑in on page load.
- Ensure **SEO**: `<title>`, `<meta name="description">`, proper heading hierarchy, semantic `<main>`, `<section>`, `<nav>`, etc.

## 3️⃣ Dev Workflow
1. **Backend** → `npm run dev` (nodemon) → API on `http://localhost:5000`.
2. **Frontend** → `npm start` (Vite) → UI on `http://localhost:3000`.
3. **Docker (optional)** – use `docker‑compose.yml` to spin up DB + API + UI containers.

## 4️⃣ Future Enhancements
- CI pipelines (GitHub Actions) for lint, test, build.
- Production Docker images & deployment scripts.
- PWA support (offline cache, manifest, service worker).
- Internationalization (i18n) and theming switcher.
- Server‑side rendering (Next.js) if SEO becomes critical.

---

*All steps are ordered for rapid MVP delivery while preserving a premium UI/UX.*
