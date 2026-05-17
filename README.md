# 🚀 Moseva | Premium Service Marketplace Application

Moseva is a state-of-the-art, high-fidelity **Full-Stack Service Gig Marketplace** designed for local and remote service exchanges. It connects **Patrons** (clients seeking on-demand help) with **Service Partners** (professional taskers offering specialized services) and includes an integrated moderation backoffice for **Stewards** (staff managers).

The application is meticulously built for secure local deployments, featuring a **real-time duplex messaging engine**, **automated silent session refreshes**, **dynamic PostgreSQL table auto-synchronization**, and a **stunning Space-Navy glassmorphic UI**.

---

## 🎨 Premium Visual System

Moseva is designed with an immersive dark-theme system crafted using precise **HSL color tokens**, custom animations, and responsive flex layouts:
- **Harmony HSL Colors**: Space Navy surfaces (`#111827`) paired with vibrant neon blue (`#3b82f6`) and violet (`#8b5cf6`) linear gradients.
- **Glassmorphism Design**: High-blur background panels (`backdrop-filter: blur(12px)`) with thin micro-borders.
- **Seamless Responsiveness**: Fully responsive flex grids that render perfectly across mobile devices, tablets, and large screens.
- **Micro-Animations**: Smooth scale states, spring hover transitions, and fading animations that make the application feel premium and responsive.

---

## ⚡ Key Architectural Features

### 1. Robust Dual-Sided Operations
- **Patrons**: Create detailed service requests (titles, description, categories, budget caps, deadline targets, specific locations, and priority levels) and moderate incoming bids.
- **Service Partners**: Filter the marketplace by category, location, or price, submit detailed pricing bids with custom timelines, and track proposal approval statuses.
- **Stewards**: Review pending job listings to approve or reject them with reasons, keeping the marketplace clean.

### 2. Automated Silent JWT Refreshes
The Axios HTTP connector includes response interceptors that listen for `401 TOKEN_EXPIRED` errors. On expiry, the client automatically requests a session update from the `/auth/refresh` endpoint and retries the original API request seamlessly in the background—requiring **zero user interaction**.

### 3. Real-Time Duplex WebSocket Chat
Connected through JWT-authenticated handshakes, users join private conversation rooms (`chat:join`) linked to active jobs. Messages are persistent in the database and propagated instantly to active recipients (`chat:message:received`), updating unread badge counts across the navbar in real time.

### 4. Zero-Setup Database Engine
When the backend boots, it automatically scans your PostgreSQL database, generates the required tables and associations, and pre-seeds the categories table with standard marketplace classes (`Home Repair`, `Cleaning`, `Tech & Remote`, `Logistics`) so you can begin testing immediately!

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Key Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 (Vite), Redux Toolkit, Axios, Socket.IO Client, Vanilla HSL CSS | Premium SPA layout, state cache, silent refresh, and real-time handshakes |
| **Backend** | Node.js, Express, Sequelize ORM, PostgreSQL Client, Multer, Joi, Winston | Secure API endpoints, validation, local uploader directories, and logs |
| **Testing** | Jest, Supertest | Verification suite checking server health and route boot parameters |

---

## 📂 Core Folder Structure

```
moseva-dev/
├── backend/
│   ├── src/
│   │   ├── config/       # DB connectivity, CORS, and Socket.IO handshakes
│   │   ├── models/       # Sequelize active schemas & associations (9 models)
│   │   ├── controllers/  # API route action handlers
│   │   ├── middleware/   # JWT parsing, Joi validations, Multer upload filters, and RBAC
│   │   ├── routes/       # Modular route definitions
│   │   ├── services/     # Business logic layers (Auth, Emails)
│   │   ├── validators/   # Joi payload schema validations
│   │   └── utils/        # Shared loggers
│   ├── tests/            # Jest test files
│   ├── server.js         # HTTP server entrypoint
│   └── package.json
└── frontend/
    ├── src/
    │   ├── assets/       # Static web assets
    │   ├── components/   # NavBar, ProtectedRoutes layouts
    │   ├── pages/        # Home, Login, Register, Marketplace, JobDetails, Dashboard, Chat
    │   ├── services/     # Axios api.js connection, Socket managers
    │   ├── store/        # Redux Toolkit store and feature slices
    │   ├── index.css     # Premium HSL dark-mode CSS variables
    │   └── main.jsx      # Vite entrypoint
    └── package.json
```

---

## 🚀 Quick Start Guide

### Step 1: PostgreSQL Setup
Ensure PostgreSQL is running locally on its standard port (`5432`). Create a target database manually inside a terminal or PostgreSQL client:
```sql
CREATE DATABASE service_marketplace;
```

### Step 2: Launch the Backend
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install the server dependencies:
   ```bash
   npm install
   ```
3. Configure your local settings inside `.env` (copying from `.env.example`). Standard local configuration:
   ```env
   PORT=5000
   DATABASE_URL=postgres://postgres:password@localhost:5432/service_marketplace
   ACCESS_TOKEN_SECRET=your_super_secret_access_key
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   *The server will boot on `http://localhost:5000`, automatically synchronize your database tables, and seed the categories.*
5. **Seed Demo Data (Tikiri, Odisha villages)**:
   To instantly populate your database with realistic Indian profiles, jobs, and bids for testing:
   ```bash
   node seed-demo-data.js
   ```

### Step 3: Launch the Frontend
1. Open a new terminal window and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install the client dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client dashboard will compile and launch on `http://localhost:3000`!*

---

## 🧪 Verification & Testing

### Running Integration Tests
To verify all routes, Express boots, and security checks are operational:
```bash
cd backend
npm test
```

### Building for Production
To compile the React bundle into static chunks (HTML, CSS, JS):
```bash
cd frontend
npm run build
```

---

## 💡 Recommended Demo Scenarios

For a complete walkthrough of the marketplace lifecycle, we recommend opening two separate browser windows (or one standard and one incognito window):

1. **Window A (Patron)**:
   - Register a client account and navigate to the **Dashboard**.
   - Click **+ Post a New Job** to submit a service request (e.g., "Deep Clean Apartment").
   - Since this is local development, the job is registered instantly. Log in as a Steward or verify standard approved postings on the marketplace.
2. **Window B (Service Partner)**:
   - Register a tasker account and click **Explore Jobs**.
   - Select the Patron's job and submit a bid proposal (e.g., "$150, completed in 2 days").
3. **Window A (Patron)**:
   - View the dashboard under **Proposals & Gigs**. You will see the Partner's proposal instantly!
   - Click **Accept & Appoint** to hire them. This locks in the partner, shifts the job status to `in_progress`, and rejects other pending bids automatically.
4. **Real-time Collaboration**:
   - Click **Messages** in either window.
   - Choose the active thread to exchange real-time messages via the authenticated Socket channel!
5. **Gig Completion**:
   - Once the job is executed, click **Mark Gig as Completed** inside the Dashboard to complete the lifecycle cleanly.
