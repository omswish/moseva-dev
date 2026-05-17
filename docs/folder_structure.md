# Folder Structure

## Complete Project Structure

This document outlines the complete folder structure for the service marketplace full-stack application. The structure is designed to keep the codebase organized, scalable, and maintainable.

```
moseva-dev/
├── docs/                           # Documentation
│   ├── product_requirements.md     # Product requirements and user stories
│   ├── technical_stack.md          # Technology choices and versions
│   ├── database_schema.md          # Database design and relationships
│   ├── api_endpoints.md            # API documentation
│   ├── authentication_specification.md  # Auth system details
│   ├── frontend_architecture.md    # Frontend structure and patterns
│   ├── backend_architecture.md     # Backend structure and patterns
│   └── folder_structure.md         # This file
│
├── frontend/                       # React frontend application
│   ├── public/
│   │   ├── index.html             # HTML entry point
│   │   ├── favicon.ico
│   │   ├── manifest.json          # PWA manifest
│   │   ├── robots.txt
│   │   └── assets/
│   │       ├── images/
│   │       └── fonts/
│   ├── src/
│   │   ├── app/                   # App configuration
│   │   │   ├── store.js           # Redux store
│   │   │   └── rootReducer.js     # Root reducer
│   │   ├── features/              # Feature-based modules
│   │   │   ├── auth/              # Authentication feature
│   │   │   │   ├── components/
│   │   │   │   │   ├── LoginForm.jsx
│   │   │   │   │   ├── RegisterForm.jsx
│   │   │   │   │   └── ProtectedRoute.jsx
│   │   │   │   ├── pages/
│   │   │   │   │   ├── LoginPage.jsx
│   │   │   │   │   └── RegisterPage.jsx
│   │   │   │   ├── services/
│   │   │   │   │   └── auth.service.js
│   │   │   │   ├── slices/
│   │   │   │   │   └── authSlice.js
│   │   │   │   └── hooks/
│   │   │   │       └── useAuth.js
│   │   │   ├── jobs/              # Job browsing feature
│   │   │   │   ├── components/
│   │   │   │   │   ├── JobCard.jsx
│   │   │   │   │   ├── JobList.jsx
│   │   │   │   │   ├── JobForm.jsx
│   │   │   │   │   └── JobFilters.jsx
│   │   │   │   ├── pages/
│   │   │   │   │   ├── JobsPage.jsx
│   │   │   │   │   ├── JobDetailsPage.jsx
│   │   │   │   │   └── CreateJobPage.jsx
│   │   │   │   ├── services/
│   │   │   │   │   └── job.service.js
│   │   │   │   ├── slices/
│   │   │   │   │   └── jobSlice.js
│   │   │   │   └── hooks/
│   │   │   │       └── useJobs.js
│   │   │   ├── bookings/          # Booking management
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   ├── slices/
│   │   │   │   └── hooks/
│   │   │   ├── chat/              # Real-time chat
│   │   │   │   ├── components/
│   │   │   │   │   ├── ChatWindow.jsx
│   │   │   │   │   ├── MessageList.jsx
│   │   │   │   │   └── MessageInput.jsx
│   │   │   │   ├── pages/
│   │   │   │   │   └── ChatPage.jsx
│   │   │   │   ├── services/
│   │   │   │   │   └── chat.service.js
│   │   │   │   ├── slices/
│   │   │   │   │   └── chatSlice.js
│   │   │   │   └── hooks/
│   │   │   │       └── useChat.js
│   │   │   ├── ratings/           # Rating system
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   └── slices/
│   │   │   ├── users/             # User profiles
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   └── slices/
│   │   │   └── admin/             # Admin dashboard
│   │   │       ├── components/
│   │   │       ├── pages/
│   │   │       ├── services/
│   │   │       └── slices/
│   │   ├── components/            # Shared components
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Alert.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── Pagination.jsx
│   │   │   └── layout/
│   │   │       ├── Header.jsx
│   │   │       ├── Footer.jsx
│   │   │       └── MainLayout.jsx
│   │   ├── hooks/                 # Custom hooks
│   │   │   ├── useApi.js
│   │   │   ├── useSocket.js
│   │   │   └── useLocalStorage.js
│   │   ├── services/              # API services
│   │   │   ├── api.js
│   │   │   ├── socket.js
│   │   │   └── interceptors.js
│   │   ├── utils/                 # Utilities
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── formatters.js
│   │   ├── styles/                # Global styles
│   │   │   ├── theme.js
│   │   │   └── globals.css
│   │   ├── routes/                # Route configuration
│   │   │   ├── index.js
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   ├── config/                # Configuration
│   │   │   └── env.js
│   │   ├── App.jsx
│   │   ├── App.test.js
│   │   ├── index.js
│   │   └── setupTests.js
│   ├── .env.example
│   ├── .env.local
│   ├── .eslintrc.json
│   ├── package.json
│   ├── README.md
│   └── jest.config.js
│
├── backend/                       # Node.js backend application
│   ├── src/
│   │   ├── config/               # Configuration
│   │   │   ├── index.js
│   │   │   ├── database.js
│   │   │   ├── env.js
│   │   │   ├── cors.js
│   │   │   └── socket.js
│   │   ├── models/               # Database models
│   │   │   ├── index.js
│   │   │   ├── User.js
│   │   │   ├── Job.js
│   │   │   ├── Booking.js
│   │   │   ├── Rating.js
│   │   │   ├── Category.js
│   │   │   ├── Message.js
│   │   │   ├── Conversation.js
│   │   │   ├── RefreshToken.js
│   │   │   └── Notification.js
│   │   ├── controllers/          # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── job.controller.js
│   │   │   ├── booking.controller.js
│   │   │   ├── rating.controller.js
│   │   │   ├── category.controller.js
│   │   │   ├── chat.controller.js
│   │   │   ├── notification.controller.js
│   │   │   └── admin.controller.js
│   │   ├── services/             # Business logic
│   │   │   ├── auth.service.js
│   │   │   ├── user.service.js
│   │   │   ├── job.service.js
│   │   │   ├── booking.service.js
│   │   │   ├── rating.service.js
│   │   │   ├── category.service.js
│   │   │   ├── chat.service.js
│   │   │   ├── notification.service.js
│   │   │   ├── email.service.js
│   │   │   └── file.service.js
│   │   ├── routes/               # API routes
│   │   │   ├── index.js
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── job.routes.js
│   │   │   ├── booking.routes.js
│   │   │   ├── rating.routes.js
│   │   │   ├── category.routes.js
│   │   │   ├── chat.routes.js
│   │   │   ├── notification.routes.js
│   │   │   └── admin.routes.js
│   │   ├── middleware/           # Express middleware
│   │   │   ├── auth.js
│   │   │   ├── authorize.js
│   │   │   ├── validation.js
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   └── fileUpload.js
│   │   ├── validators/           # Joi schemas
│   │   │   ├── auth.validator.js
│   │   │   ├── user.validator.js
│   │   │   ├── job.validator.js
│   │   │   ├── booking.validator.js
│   │   │   └── rating.validator.js
│   │   ├── utils/                # Utilities
│   │   │   ├── ApiError.js
│   │   │   ├── catchAsync.js
│   │   │   ├── pick.js
│   │   │   ├── pagination.js
│   │   │   └── helpers.js
│   │   ├── events/               # Event handlers
│   │   │   ├── chat.events.js
│   │   │   └── notification.events.js
│   │   └── app.js               # Express app setup
│   ├── tests/
│   │   ├── fixtures/
│   │   ├── integration/
│   │   └── unit/
│   ├── migrations/              # Database migrations
│   │   ├── 20240101000001-create-users.js
│   │   ├── 20240101000002-create-categories.js
│   │   └── ...
│   ├── seeders/                 # Database seeders
│   │   ├── 20240101000001-seed-users.js
│   │   └── ...
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── jest.config.js
│   ├── package.json
│   ├── server.js               # Entry point
│   ├── Dockerfile
│   └── README.md
│
├── src/                         # Legacy Python code (for reference)
│   ├── main.py
│   ├── job_posting.py
│   ├── catalog_browsing.py
│   ├── chat_interface.py
│   └── rating_closing.py
│
├── .github/                     # GitHub configuration
│   └── workflows/
│       ├── frontend-ci.yml
│       ├── backend-ci.yml
│       └── deploy.yml
│
├── .gitignore
├── docker-compose.yml           # Docker compose for local development
├── package.json                 # Root package.json (optional)
├── README.md                    # Project README
└── LICENSE
```

## Key Directories Explained

### `/docs`
Contains all project documentation including:
- Product requirements and user stories
- Technical specifications
- API documentation
- Architecture decisions
- Database schema

### `/frontend`
React application with:
- Feature-based organization (auth, jobs, bookings, chat, etc.)
- Each feature contains components, pages, services, slices (Redux), and hooks
- Shared components in `/components`
- Global utilities and services

### `/backend`
Node.js/Express application with:
- Clear separation of concerns (models, controllers, services, routes)
- Middleware for authentication, validation, error handling
- Database migrations and seeders
- Comprehensive test structure

### `/src` (Legacy)
Original Python implementation kept for reference. The new implementation uses Node.js/Express backend and React frontend.

## File Naming Conventions

### Frontend
- Components: `PascalCase.jsx` (e.g., `JobCard.jsx`)
- Services: `camelCase.service.js` (e.g., `auth.service.js`)
- Redux slices: `camelCaseSlice.js` (e.g., `authSlice.js`)
- Hooks: `usePascalCase.js` (e.g., `useAuth.js`)
- Tests: `filename.test.js`

### Backend
- Models: `PascalCase.js` (e.g., `User.js`)
- Controllers: `camelCase.controller.js` (e.g., `auth.controller.js`)
- Services: `camelCase.service.js` (e.g., `auth.service.js`)
- Routes: `camelCase.routes.js` (e.g., `auth.routes.js`)
- Middleware: `camelCase.js` (e.g., `auth.js`)
- Validators: `camelCase.validator.js` (e.g., `auth.validator.js`)
- Migrations: `YYYYMMDDHHMMSS-description.js`
- Seeders: `YYYYMMDDHHMMSS-description.js`

## Environment Variables

### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_ENV=development
```

### Backend (.env)
```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=service_marketplace
DB_USER=postgres
DB_PASSWORD=your_local_password

# JWT (HS256)
ACCESS_TOKEN_SECRET=your-secret-key-min-32-chars
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-secret-min-32-chars
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (Optional in local development - logged to terminal stdout)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=optional_user@gmail.com
SMTP_PASS=optional_app_password
EMAIL_FROM=noreply@servicemarketplace.com

# CORS (Allows frontend connection from port 3000)
ALLOWED_ORIGINS=http://localhost:3000
```

## Development Workflow

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd moseva-dev
   ```

2. **Set up the backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   npm install
   npm run migrate
   npm run seed
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   cp .env.example .env.local
   # Check .env.local variables point to backend port 5000
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api/v1`
   - API Health: `http://localhost:5000/health`

## Deployment Structure (Optional / Staging)

For production deployment, the structure remains the same with environment-specific configurations:

```
Production Environment (Optional Future Scope):
├── Frontend: Deployed to Vercel/Netlify/S3
├── Backend: Deployed to AWS ECS/Heroku/DigitalOcean
├── Database: AWS RDS PostgreSQL
└── CDN: CloudFront for static assets
```

## Docker Development (Optional)

Use docker-compose for local development:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The docker-compose.yml includes:
- PostgreSQL database
- Backend API (mapped to local port 5000)
- pgAdmin for database management (optional)