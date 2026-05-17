# 🗄️ Database Schema & ORM Model Mappings — Moseva

This document maps out the active **PostgreSQL** database schemas, column specifications, and relationships maintained through the **Sequelize** ORM layer.

---

## 🗺️ 1. Active Entity Relationship Diagram

```
Users (1) ------------< (Many) Jobs (as patron)
Users (1) ------------< (Many) Proposals (as service_partner)
Users (1) ------------< (Many) Bookings (as patron or service_partner)
Users (1) ------------< (Many) Reviews (as reviewer or target)
Users (1) ------------< (Many) Message (as sender or receiver)
Users (1) ------------< (Many) Conversation (as participant)
Users (1) ------------< (Many) RefreshToken (as owner)
Users (1) ------------< (Many) Notification (as recipient)
Users (1) ------------< (Many) Feedback (as author)
Users (1) ------------< (Many) DataRemovalRequest (as claimant)

Categories (1) -------< (Many) Jobs
Jobs (1) -------------< (Many) Proposals
Jobs (1) -------------< (Many) Bookings
Proposals (1) --------< (Many) Bookings
Bookings (1) ---------| (One-to-One) Reviews
Conversations (1) ----< (Many) Messages
```

---

## 🗃️ 2. Core Table Mappings

### 2.1 Users (`users`)
Stores all platform member accounts (Patrons, Service Partners, and Stewards).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | `UUID` | Primary Key | Unique user identifier |
| `username` | `VARCHAR(50)` | Unique, Not Null | Public display name |
| `email` | `VARCHAR(255)` | Unique, Not Null | Contact/Login email |
| `password_hash`| `VARCHAR(255)` | Not Null | Hashed password |
| `role` | `ENUM` | Not Null, Default `patron` | Access role: `patron`, `service_partner`, `steward`, `superadmin` |
| `first_name` | `VARCHAR(100)` | Nullable | Given name |
| `last_name` | `VARCHAR(100)` | Nullable | Family name |
| `phone` | `VARCHAR(20)` | Nullable | Contact number |
| `avatar_url` | `VARCHAR(500)` | Nullable | Avatar URL |
| `bio` | `TEXT` | Nullable | User biography |
| `is_verified` | `BOOLEAN` | Default `false` | Verification status |
| `is_active` | `BOOLEAN` | Default `true` | Active status |
| `auth_provider`| `VARCHAR(50)` | Default `local` | `local` or `google` |
| `google_id` | `VARCHAR(255)` | Nullable | Google OAuth profile link ID |

---

### 2.2 Categories (`categories`)
Hierarchical categories for jobs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `category_id` | `UUID` | Primary Key | Unique category identifier |
| `name` | `VARCHAR(100)` | Unique, Not Null | Category name |
| `slug` | `VARCHAR(100)` | Unique, Not Null | URL friendly slug |
| `description` | `TEXT` | Nullable | Category details |
| `parent_id` | `UUID` | FK References `categories` | Hierarchical parent |

---

### 2.3 Jobs (`jobs`)
Platform gigs posted by patrons requiring moderation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `job_id` | `UUID` | Primary Key | Unique job identifier |
| `title` | `VARCHAR(200)` | Not Null | Job title |
| `description` | `TEXT` | Not Null | Details |
| `category_id` | `UUID` | FK References `categories` | Category link |
| `patron_id` | `UUID` | FK References `users` | Poster link |
| `budget_min` | `DECIMAL(10,2)`| Nullable | Price range bottom |
| `budget_max` | `DECIMAL(10,2)`| Nullable | Price range top |
| `location` | `VARCHAR(200)` | Nullable | Address details |
| `location_type`| `ENUM` | Default `flexible` | `onsite`, `remote`, `flexible` |
| `status` | `ENUM` | Default `pending` | `pending`, `approved`, `rejected`, `in_progress`, `completed`, `cancelled` |
| `priority` | `ENUM` | Default `medium` | `low`, `medium`, `high`, `urgent` |
| `deadline` | `DATE` | Nullable | Deadline date |
| `rejection_reason`| `TEXT` | Nullable | Steward rejection details |

---

### 2.4 Proposals (`proposals`)
Timeline bids submitted by service partners.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `proposal_id` | `UUID` | Primary Key | Unique bid ID |
| `job_id` | `UUID` | FK References `jobs` | Job link |
| `service_partner_id` | `UUID` | FK References `users` | Bidder link |
| `bid_price` | `DECIMAL(10,2)`| Not Null | Bid price |
| `completion_time`| `INTEGER` | Not Null | Promised timeline in days |
| `cover_letter` | `TEXT` | Nullable | Bid pitch details |

---

### 2.5 Feedbacks & Grievances (`feedbacks`)
User complaints and compliance reports.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `feedback_id` | `UUID` | Primary Key | Unique ID |
| `user_id` | `UUID` | FK References `users` | Author user link |
| `type` | `VARCHAR(50)` | Not Null | `grievance`, `complaint`, `feedback` |
| `subject` | `VARCHAR(200)` | Not Null | Grievance subject |
| `message` | `TEXT` | Not Null | Feedback payload details |
| `status` | `VARCHAR(50)` | Default `pending` | `pending`, `reviewed`, `resolved` |

---

### 2.6 Data Removal Requests (`data_removal_requests`)
DPDP compliance erasure queue records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `request_id` | `UUID` | Primary Key | Unique ID |
| `user_id` | `UUID` | FK References `users` | Claimant link |
| `reason` | `TEXT` | Nullable | Legal/User justification |
| `status` | `VARCHAR(50)` | Default `pending` | `pending`, `completed` |
| `completed_at` | `TIMESTAMP` | Nullable | Timestamp of compliance execution |

---

## 🛠️ 3. ORM Schema Alter Sync Strategy

To bypass slow structural database migrations during iterations, Moseva uses automatic live alters on launch:
```javascript
// backend/src/config/database.js
await sequelize.sync({ alter: true });
```
This queries existing table schemas over connection pools, compares structural data models with local scripts, and runs high-fidelity non-destructive `ALTER TABLE` actions automatically.