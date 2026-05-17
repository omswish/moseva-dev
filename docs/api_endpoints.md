# 🔌 REST API Route Documentation — Moseva

This document lists the actual, production-ready REST API endpoints exposed by the **Moseva API Server Gateway** (`/api/v1`).

---

## 🔐 1. Authentication Endpoints (`/auth`)

### 1.1 User Registration
* **Endpoint**: `POST /auth/register`
* **Access**: Public
* **Payload Body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@doe.com",
    "password": "Password@123",
    "role": "patron" // "patron" or "service_partner"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "userId": "d7a4f91b-c6b2...",
        "username": "johndoe",
        "email": "john@doe.com",
        "role": "patron"
      },
      "accessToken": "eyJhbGciOiJIUzI1Ni..."
    }
  }
  ```

### 1.2 User Login
* **Endpoint**: `POST /auth/login`
* **Access**: Public
* **Payload Body**:
  ```json
  {
    "email": "john@doe.com",
    "password": "Password@123"
  }
  ```
* **Success Response (200 OK)**: Sets a secure, httpOnly refresh token cookie (`refreshToken`) and returns access token payload.

### 1.3 Google OAuth Integration
* **Endpoint**: `POST /auth/google`
* **Access**: Public
* **Payload Body**:
  ```json
  {
    "idToken": "eyJhbGciOiJIUzI1NiGoogleCredToken...",
    "role": "patron"
  }
  ```
* **Success Response (200 OK)**: Returns dynamic user profile and new session token payload.

---

## 💼 2. Job Posts & Bidding Endpoints (`/jobs`)

### 2.1 Post a New Job
* **Endpoint**: `POST /jobs`
* **Access**: Protected (Patron only)
* **Payload Body**:
  ```json
  {
    "title": "Need Urgent Home Plumbing",
    "description": "Fixing leaking kitchen pipe under the sink. Tools required.",
    "categoryId": "c76a91b2...",
    "budgetMin": 500.00,
    "budgetMax": 1500.00,
    "location": "Sector 62, Noida",
    "locationType": "onsite", // "onsite", "remote", "flexible"
    "priority": "high", // "low", "medium", "high", "urgent"
    "deadline": "2026-06-01"
  }
  ```

### 2.2 Query Public Jobs
* **Endpoint**: `GET /jobs`
* **Access**: Public (Approved jobs only)
* **Query Parameters**:
  * `category`: UUID
  * `locationType`: `onsite` / `remote` / `flexible`
  * `search`: String (title/description)
  * `sortBy`: `createdAt` / `budgetMax` (Default: `createdAt`)
  * `sortOrder`: `asc` / `desc` (Default: `desc`)

### 2.3 Submit Proposal Bid
* **Endpoint**: `POST /jobs/:id/proposals`
* **Access**: Protected (Service Partner only)
* **Payload Body**:
  ```json
  {
    "bidPrice": 850.00,
    "completionTime": 2, // Completion timeline in days
    "coverLetter": "Hi, I have 5 years experience as a plumber, happy to take this up today!"
  }
  ```

### 2.4 Accept Proposal Bid
* **Endpoint**: `PUT /jobs/:id/proposals/:proposalId/accept`
* **Access**: Protected (Patron owner only)
* **Action**: Transitions proposal to accepted, creates a booking, updates job status to `in_progress`, and triggers Socket alerts.

---

## 🛡️ 3. Steward Backoffice Endpoints (`/admin`)

### 3.1 Fetch Backoffice Operational Stats
* **Endpoint**: `GET /admin/stats`
* **Access**: Protected (Steward / Superadmin only)
* **Response Payload**:
  ```json
  {
    "success": true,
    "data": {
      "usersCount": 42,
      "jobsCount": 18,
      "proposalsCount": 35
    }
  }
  ```

### 3.2 List Users Registry
* **Endpoint**: `GET /admin/users`
* **Access**: Protected (Steward / Superadmin only)

### 3.3 Toggle User Status (Deactivate / Reactivate)
* **Endpoint**: `PUT /admin/users/:id/status`
* **Access**: Protected (Steward / Superadmin only)
* **Payload Body**:
  ```json
  {
    "isActive": false
  }
  ```

### 3.4 Moderate Job Queue
* **Endpoint**: `PUT /admin/jobs/:id/status`
* **Access**: Protected (Steward / Superadmin only)
* **Payload Body**:
  ```json
  {
    "status": "approved", // "approved" or "rejected"
    "rejectionReason": "Budget must be specified in Indian Rupees."
  }
  ```

### 3.5 Execute DPDP Act Data Erasure Claim
* **Endpoint**: `POST /admin/dpdp/:id/execute`
* **Access**: Protected (Steward / Superadmin only)
* **Action**: Flags the account as inactive (`isActive = false`), removes personal metadata, logs compliance history, and updates erasure timestamps.