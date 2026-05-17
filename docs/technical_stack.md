# 🛠️ Technical Stack Specification — Moseva

This document lists the actual, production-ready technologies and versions utilized across the **Moseva Service Marketplace** micro-applications.

---

## 💻 1. Frontend Micro-Application
* **Core Core Framework**: **React 19**
* **Build Tooling & Dev Server**: **Vite** (replaces legacy Create React App/Webpack structures for sub-second hot-reloads)
* **Styling & Design System**: Custom **Vanilla CSS** with HSL theme tokens (Glassmorphic dark-theme design; no generic component libraries or Tailwind dependencies)
* **Global State Management**: **Redux Toolkit** (slices for `auth`, `jobs`, `chat`)
* **Routing Engine**: **React Router v6**
* **HTTP Client Connection**: **Axios** with silent JWT auto-refresh and authorization header injection interceptors
* **Real-time Engine**: **Socket.IO-client**
* **API Ports**: Runs locally on `http://localhost:5173` (Vite standard port)

---

## ⚙️ 2. Backend Micro-Application
* **Core Runtime Engine**: **Node.js (v20+)**
* **API Web Framework**: **Express.js** (modular routes with clean MVC division)
* **Authentication Security**: **JSON Web Tokens (JWT)** with httpOnly Refresh cookies and custom passport-less validation
* **Real-time Duplex**: **Socket.IO** (coordinating real-time message relays)
* **Payload Request Validation**: **Joi** (custom body, query, and params validator middleware)
* **Media Upload Engine**: **Multer** (configuring disk space folders & file mimetype filtering)
* **Structured Logger**: **Winston** (console transports and local error file tracking)
* **Security Headers**: **Helmet** (CORS configurations and custom resource loading bypasses)
* **API Port**: Runs locally on `http://localhost:5001` (Express API port)

---

## 🗄️ 3. Database Engine
* **Database Engine**: **PostgreSQL** (Supabase Cloud Database instance for production)
* **Object Relational Mapper (ORM)**: **Sequelize**
* **Automated Migration Strategy**: Dynamic auto-synchronization (`sequelize.sync({ alter: true })`) executed directly on backend container boot to match schemas on the fly.

---

## 📱 4. Mobile Client Application
* **Framework Engine**: **React Native** (iOS & Android compile targets)
* **Storage Cache**: **@react-native-async-storage/async-storage**
* **Social OAuth Gateway**: Native **@react-native-google-signin/google-signin** SDK
* **Connection Client**: **Axios** (linking to production endpoints via JSON parsing)

---

## 🚀 5. Host & Production Deployments
* **Hosting Cloud Platform**: **Google Cloud Platform (GCP)**
* **Container Compilation**: **Google Cloud Build** (using multi-stage alpine node docker containers)
* **Serverless Execution**: **GCP Cloud Run** (auto-scaling microservices exposed on container port `8080`)
* **Production Live URLs**:
  * **Frontend**: `https://moseva-frontend-98662134377.us-central1.run.app`
  * **Backend**: `https://moseva-backend-98662134377.us-central1.run.app`