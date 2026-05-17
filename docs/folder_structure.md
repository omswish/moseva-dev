# 📂 Codebase Folder Structure Specification — Moseva

This document maps the actual directory layout of the full-stack **Moseva Service Marketplace** application.

---

## 🏗️ Monorepo Directory Diagram

```
moseva-dev/
├── backend/                       # Node.js Express API Server
│   ├── src/
│   │   ├── config/               # Database connect, Socket.IO handshakes, CORS settings
│   │   │   ├── database.js
│   │   │   └── socket.js
│   │   ├── controllers/          # API Request controllers (MVC logic layer)
│   │   │   ├── auth.controller.js
│   │   │   ├── admin.controller.js
│   │   │   ├── job.controller.js
│   │   │   ├── category.controller.js
│   │   │   └── rating.controller.js
│   │   ├── events/               # WebSocket event handlers
│   │   │   └── chat.events.js
│   │   ├── middleware/           # Access token parsers, validation, and error filters
│   │   │   ├── auth.js
│   │   │   ├── authorize.js
│   │   │   ├── errorHandler.js
│   │   │   └── fileUpload.js
│   │   ├── models/               # Active Sequelize tables & associations (11 models)
│   │   │   ├── index.js
│   │   │   ├── User.js
│   │   │   ├── Category.js
│   │   │   ├── Job.js
│   │   │   ├── Proposal.js
│   │   │   ├── Message.js
│   │   │   ├── Conversation.js
│   │   │   ├── Review.js
│   │   │   ├── Complaint.js
│   │   │   ├── Feedback.js
│   │   │   └── DataRemovalRequest.js
│   │   ├── routes/               # Express modular router mappings
│   │   │   ├── index.js
│   │   │   ├── auth.routes.js
│   │   │   ├── admin.routes.js
│   │   │   ├── job.routes.js
│   │   │   ├── category.routes.js
│   │   │   └── rating.routes.js
│   │   ├── scripts/              # Seeders and DB Forced sync triggers
│   │   │   ├── seed-superadmin.js
│   │   │   └── force-sync.js
│   │   ├── services/             # Core OAuth & auth services
│   │   │   ├── auth.service.js
│   │   │   └── google.service.js
│   │   ├── utils/                # Loggers & Custom API error catchers
│   │   │   ├── ApiError.js
│   │   │   ├── catchAsync.js
│   │   │   └── logger.js
│   │   └── validators/           # Payload verification Joi schemas
│   │       ├── auth.validator.js
│   │       └── job.validator.js
│   ├── uploads/                  # Local user media storage
│   ├── Dockerfile                # Production alpine container builder
│   ├── server.js                 # HTTP listener & WebSocket entrypoint
│   └── package.json
│
├── frontend/                      # React Vite SPA Web Application
│   ├── src/
│   │   ├── assets/               # Branding constants
│   │   ├── components/           # Main NavBar & protected layout filters
│   │   │   ├── NavBar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/                # Premium styled responsive web pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── CreateJob.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── Chat.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/             # API Axios hookups & Socket hook controllers
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── store/                # Redux Toolkit global store and slices
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── chatSlice.js
│   │   │       └── jobSlice.js
│   │   ├── index.css             # Harmonious Space-Navy & Neon Orange HSL dark-mode theme
│   │   ├── App.jsx               # Page router definitions
│   │   └── main.jsx              # React Vite compiler mount root
│   ├── Dockerfile                # Static build alpine multi-stage compiler
│   └── package.json
│
├── mobile/                        # React Native Mobile Client Workspace
│   ├── src/
│   │   ├── context/              # Authentication and dynamic Chat Context providers
│   │   │   ├── AuthContext.js
│   │   │   └── ChatContext.js
│   │   ├── screens/              # Screens for patrons and partners
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   ├── ExploreScreen.js
│   │   │   └── SubmitProposalScreen.js
│   │   └── services/             # Axios and device sync services
│   └── package.json
│
└── docs/                          # Architecture & Compliance Playbooks
    ├── developer_manual.md       # Technical Quick Start & GCP Deployments
    ├── technical_stack.md        # Technical Stack Specification
    ├── database_schema.md        # Sequelize Relationships Schema
    ├── api_endpoints.md          # REST API Route Documentation
    ├── authentication_specification.md # JWT & Google OAuth Handshakes
    ├── frontend_architecture.md  # SPA Layout Documentation
    ├── mobile_architecture.md    # React Native Client Layout Documentation
    ├── backend_architecture.md   # Express MVC Routing Documentation
    └── folder_structure.md       # This file
```

---

## 🛠️ Environment Configuration Mappings

### 1. Web Frontend (`frontend/.env`)
```env
VITE_API_URL=https://moseva-backend-98662134377.us-central1.run.app/api/v1
VITE_SOCKET_URL=https://moseva-backend-98662134377.us-central1.run.app
```

### 2. Backend Server (`backend/.env`)
```env
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
GOOGLE_CLIENT_ID=98662134377-p01aj6dk19vr163pmdi0uq9d74hvqm7p.apps.googleusercontent.com
ACCESS_TOKEN_SECRET=dev_access_token_secret_moseva_marketplace_32char_key
REFRESH_TOKEN_SECRET=dev_refresh_token_secret_moseva_marketplace_32char_key
ALLOWED_ORIGINS=https://moseva-frontend-98662134377.us-central1.run.app
```