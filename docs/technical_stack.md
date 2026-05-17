# Technical Stack

## Frontend
- **Framework**: React 19 with Create React App
- **State Management**: Redux Toolkit for global state, React Context for theme/auth
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **HTTP Client**: Axios with request/response interceptors
- **Real-time**: Socket.IO client
- **Form Handling**: React Hook Form with Yup validation
- **Build Tool**: Webpack (via react-scripts)

## Backend
- **Framework**: Node.js with Express.js v5
- **Authentication**: JWT with refresh tokens, bcrypt for password hashing
- **Real-time**: Socket.IO for WebSocket communication
- **API Design**: RESTful with consistent error handling
- **Validation**: Joi for request validation
- **File Upload**: Multer for handling file uploads
- **Environment**: dotenv for environment variables

## Database
- **Database Management System**: PostgreSQL
- **ORM**: Sequelize with connection pooling
- **Migrations**: Sequelize CLI for database migrations
- **Seeding**: Sequelize seeders for development data

## Additional Tools
- **Version Control**: Git with conventional commits
- **Containerization**: Docker with docker-compose for local development (Optional)
- **Process Manager**: PM2 (Optional/Production only)
- **Testing**: 
  - Backend: Jest with Supertest
  - Frontend: Jest with React Testing Library
- **Code Quality**: ESLint, Prettier
- **API Documentation**: Swagger/OpenAPI
- **Logging**: Winston for structured local logging (writes to standard local files and terminal console only)
- **Security**: Helmet for security headers, CORS configuration for local port sharing, local rate limiting with express-rate-limit (configured higher or disabled in development to allow manual testing)

## Local Environment Ports
- **Frontend**: `http://localhost:3000` (React default port)
- **Backend API**: `http://localhost:5000` (Express custom port to prevent collision with Frontend)
- **Database**: `localhost:5432` (PostgreSQL default port)

## Development Tools
- **Package Manager**: npm
- **API Testing**: Postman/Insomnia
- **Database GUI**: pgAdmin or DBeaver

## Deployment & Hosting
- **Local Dev Server (Primary)**: Run locally via `npm run dev` or Node/Nodemon directly.
- **Production Deployment (Optional / Future Scope)**:
  - **Frontend**: Vercel or Netlify (static hosting)
  - **Backend**: AWS ECS or Heroku
  - **Database**: AWS RDS PostgreSQL or ElephantSQL
  - **CI/CD**: GitHub Actions (Optional for production integration only)