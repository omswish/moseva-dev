# ⚙️ Backend Architecture Specification — Moseva

This document outlines the system architecture, modular design, database configurations, and communication handlers of the **Moseva Node.js & Express RESTful API Server Gateway** (`backend/`).

---

## 🗺️ 1. Express Modular System Architecture

Moseva organizes backend components using a strict modular **Model-View-Controller (MVC)** abstraction. This isolates business logic, schema attributes, and endpoint definitions for cleaner debugging.

```
                  +---------------------------------------------+
                  |               HTTP / WebSocket              |
                  +---------------------------------------------+
                                         |
                                         v
                  +---------------------------------------------+
                  |             Express API Routing             |
                  |          [src/routes/index.js]              |
                  +---------------------------------------------+
                                         |
                                         v
                  +---------------------------------------------+
                  |            Security & Middleware            |
                  |     [auth.js, authorize.js, validation.js]   |
                  +---------------------------------------------+
                                         |
                                         v
                  +---------------------------------------------+
                  |            Modular Controllers              |
                  |      [auth, admin, job, rating, category]   |
                  +---------------------------------------------+
                    /                  |                      \
                   v                   v                       v
      +------------------+    +-------------------+    +-------------------+
      | Sequelize Models |    | WebSocket Events  |    | External Services |
      |   [src/models]   |    |  [src/events]     |    | [Google Auth SDK] |
      +------------------+    +-------------------+    +-------------------+
               |
               v
      +------------------+
      |  Supabase Cloud  |
      |    Postgres      |
      +------------------+
```

---

## 🏗️ 2. Core Operational Micro-Modules

### 2.1 Database Connectivity & Schema Alteration (`src/config/database.js`)
Handles database connections over PostgreSQL. It enables secure production SSL handshakes and manages dynamic schema auto-synchronization:
```javascript
// src/config/database.js
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: process.env.NODE_ENV === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
});
```
* **Alteration Hook**: On container boot, it executes `await sequelize.sync({ alter: true })` to dynamically align local database structures with code revisions (e.g. creating columns and index links automatically).

### 2.2 Global Error Handler Middleware (`src/middleware/errorHandler.js`)
A centralized exception interceptor that intercepts rejected async actions, standardizes errors, and handles specific validation payloads gracefully:
* **Sequelize Constraint Violations**: Maps database conflicts to clear HTTP `409 Conflict` client messages.
* **Joi Validation Errors**: Intercepts incorrect schema inputs, returning clean HTTP `400 Bad Request` messages detailing target errors.
* **Winston Tracking**: Logs stack traces directly to `logs/error.log` while preventing internal server error details from being exposed to clients in production.

---

## ⚡ 3. Real-Time WebSockets (`src/config/socket.js`)

Moseva coordinates real-time features using **Socket.IO**:

### 3.1 Handshake Configuration & CORS Policies
To allow local development port sharing alongside production deployments, WebSockets are bound to standard HTTP connections with unified CORS configurations:
```javascript
// src/config/socket.js
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});
```

### 3.2 Live Chat Duplex Event Exchanges (`src/events/chat.events.js`)
WebSocket signals coordinate instant message exchanges between marketplace participants:
* **`join_room`**: Links buyers and service partners inside dedicated chat rooms based on active booking IDs.
* **`send_message`**: Captures message payloads, persists the contents to the `messages` table, and broadcasts `receive_message` payloads to room participants.
* **Socket Disconnects**: Gracefully clears client mapping lists upon socket disconnection.