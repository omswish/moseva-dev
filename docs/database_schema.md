# Database Schema

## Overview
This document outlines the PostgreSQL database schema for the service marketplace application. All tables use UUID as primary keys for distributed ID generation and security.

## Tables

### Users
Stores all user accounts with role-based access control.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique user identifier |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Display name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| role | ENUM('steward', 'patron', 'service_partner') | NOT NULL, DEFAULT 'patron' | User role |
| first_name | VARCHAR(100) | NULLABLE | First name |
| last_name | VARCHAR(100) | NULLABLE | Last name |
| phone | VARCHAR(20) | NULLABLE | Phone number |
| avatar_url | VARCHAR(500) | NULLABLE | Profile picture URL |
| bio | TEXT | NULLABLE | User biography |
| is_verified | BOOLEAN | DEFAULT false | Email verification status |
| is_active | BOOLEAN | DEFAULT true | Account active status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP (Sequelize managed) | Last update time |

**Indexes:**
- idx_users_email ON users(email)
- idx_users_username ON users(username)
- idx_users_role ON users(role)

### Service Categories
Hierarchical service categories for job classification.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| category_id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique category identifier |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Category name |
| description | TEXT | NULLABLE | Category description |
| parent_id | UUID | FOREIGN KEY REFERENCES categories(category_id) | Parent category for hierarchy |
| icon_url | VARCHAR(500) | NULLABLE | Category icon URL |
| is_active | BOOLEAN | DEFAULT true | Category availability |
| display_order | INTEGER | DEFAULT 0 | Sort order |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |

**Indexes:**
- idx_categories_parent ON categories(parent_id)
- idx_categories_active ON categories(is_active)

### Job Posts
Service requests posted by Patrons.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| job_id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique job identifier |
| title | VARCHAR(200) | NOT NULL | Job title |
| description | TEXT | NOT NULL | Detailed job description |
| category_id | UUID | FOREIGN KEY REFERENCES categories(category_id) | Service category |
| patron_id | UUID | FOREIGN KEY REFERENCES users(user_id) WHERE role='patron' | Job poster |
| budget_min | DECIMAL(10,2) | NULLABLE | Minimum budget |
| budget_max | DECIMAL(10,2) | NULLABLE | Maximum budget |
| location | VARCHAR(200) | NULLABLE | Job location |
| location_type | ENUM('onsite', 'remote', 'flexible') | DEFAULT 'flexible' | Work arrangement |
| status | ENUM('draft', 'pending', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled') | DEFAULT 'pending' | Job status |
| priority | ENUM('low', 'medium', 'high', 'urgent') | DEFAULT 'medium' | Job priority |
| deadline | DATE | NULLABLE | Preferred completion date |
| rejection_reason | TEXT | NULLABLE | Reason if rejected by steward |
| viewed_count | INTEGER | DEFAULT 0 | Number of views |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP (Sequelize managed) | Last update time |

**Indexes:**
- idx_jobs_category ON jobs(category_id)
- idx_jobs_patron ON jobs(patron_id)
- idx_jobs_status ON jobs(status)
- idx_jobs_created ON jobs(created_at DESC)
- idx_jobs_location ON jobs(location)

### Bookings
Agreements between Patrons and Service Partners for job execution.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| booking_id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique booking identifier |
| job_id | UUID | FOREIGN KEY REFERENCES jobs(job_id) | Associated job |
| service_partner_id | UUID | FOREIGN KEY REFERENCES users(user_id) WHERE role='service_partner' | Assigned service partner |
| patron_id | UUID | FOREIGN KEY REFERENCES users(user_id) WHERE role='patron' | Patron who posted job |
| proposal_text | TEXT | NULLABLE | Service partner's proposal |
| proposed_price | DECIMAL(10,2) | NULLABLE | Proposed price by partner |
| proposed_timeline | INTEGER | NULLABLE | Proposed days to complete |
| status | ENUM('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled') | DEFAULT 'pending' | Booking status |
| start_date | DATE | NULLABLE | Actual start date |
| end_date | DATE | NULLABLE | Actual completion date |
| cancellation_reason | TEXT | NULLABLE | Reason if cancelled |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP (Sequelize managed) | Last update time |

**Indexes:**
- idx_bookings_job ON bookings(job_id)
- idx_bookings_partner ON bookings(service_partner_id)
- idx_bookings_patron ON bookings(patron_id)
- idx_bookings_status ON bookings(status)

### Ratings
Reviews and ratings for completed jobs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| rating_id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique rating identifier |
| booking_id | UUID | UNIQUE, FOREIGN KEY REFERENCES bookings(booking_id) | Associated booking |
| job_id | UUID | FOREIGN KEY REFERENCES jobs(job_id) | Associated job |
| patron_id | UUID | FOREIGN KEY REFERENCES users(user_id) | Rating given by patron |
| service_partner_id | UUID | FOREIGN KEY REFERENCES users(user_id) | Rating given to partner |
| patron_rating | INTEGER | CHECK (1-5) | Patron's rating of service partner |
| partner_rating | INTEGER | CHECK (1-5) | Service partner's rating of patron |
| patron_comment | TEXT | NULLABLE | Patron's feedback |
| partner_comment | TEXT | NULLABLE | Service partner's feedback |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Rating creation time |

**Indexes:**
- idx_ratings_booking ON ratings(booking_id)
- idx_ratings_partner ON ratings(service_partner_id)
- idx_ratings_patron ON ratings(patron_id)

### Chat Messages
Real-time communication between users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| message_id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique message identifier |
| conversation_id | UUID | NOT NULL | Conversation thread identifier |
| sender_id | UUID | FOREIGN KEY REFERENCES users(user_id) | Message sender |
| receiver_id | UUID | FOREIGN KEY REFERENCES users(user_id) | Message receiver |
| booking_id | UUID | FOREIGN KEY REFERENCES bookings(booking_id) | Related booking (optional) |
| message_type | ENUM('text', 'image', 'file', 'system') | DEFAULT 'text' | Message type |
| content | TEXT | NOT NULL | Message content |
| media_url | VARCHAR(500) | NULLABLE | URL for image/file messages |
| is_read | BOOLEAN | DEFAULT false | Read status |
| is_deleted | BOOLEAN | DEFAULT false | Soft delete flag |
| sent_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Message sent time |
| read_at | TIMESTAMP | NULLABLE | Message read time |

**Indexes:**
- idx_messages_conversation ON messages(conversation_id)
- idx_messages_sender ON messages(sender_id)
- idx_messages_receiver ON messages(receiver_id)
- idx_messages_booking ON messages(booking_id)
- idx_messages_sent ON messages(sent_at DESC)

### Conversations
Metadata for chat conversations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| conversation_id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique conversation identifier |
| participant_1_id | UUID | FOREIGN KEY REFERENCES users(user_id) | First participant |
| participant_2_id | UUID | FOREIGN KEY REFERENCES users(user_id) | Second participant |
| booking_id | UUID | FOREIGN KEY REFERENCES bookings(booking_id) | Related booking (optional) |
| last_message_at | TIMESTAMP | NULLABLE | Last message timestamp |
| last_message_preview | TEXT | NULLABLE | Preview of last message |
| unread_count_1 | INTEGER | DEFAULT 0 | Unread count for participant 1 |
| unread_count_2 | INTEGER | DEFAULT 0 | Unread count for participant 2 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Conversation creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP (Sequelize managed) | Last update time |

**Indexes:**
- idx_conversations_participant1 ON conversations(participant_1_id)
- idx_conversations_participant2 ON conversations(participant_2_id)
- idx_conversations_booking ON conversations(booking_id)

### Refresh Tokens
JWT refresh token management.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| token_id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique token identifier |
| user_id | UUID | FOREIGN KEY REFERENCES users(user_id) | Associated user |
| token_hash | VARCHAR(255) | NOT NULL | Hashed refresh token |
| expires_at | TIMESTAMP | NOT NULL | Token expiration time |
| is_revoked | BOOLEAN | DEFAULT false | Revocation status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Token creation time |
| created_ip | INET | NULLABLE | IP address when created |

**Indexes:**
- idx_refresh_tokens_user ON refresh_tokens(user_id)
- idx_refresh_tokens_expires ON refresh_tokens(expires_at)

### Notifications
User notifications for various events.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| notification_id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique notification identifier |
| user_id | UUID | FOREIGN KEY REFERENCES users(user_id) | Recipient user |
| type | ENUM('job_posted', 'job_approved', 'booking_received', 'booking_accepted', 'message_received', 'rating_received', 'system') | NOT NULL | Notification type |
| title | VARCHAR(200) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification content |
| entity_type | VARCHAR(50) | NULLABLE | Related entity type (job, booking, etc.) |
| entity_id | UUID | NULLABLE | Related entity ID |
| is_read | BOOLEAN | DEFAULT false | Read status |
| action_url | VARCHAR(500) | NULLABLE | URL to navigate on action |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |

**Indexes:**
- idx_notifications_user ON notifications(user_id)
- idx_notifications_type ON notifications(type)
- idx_notifications_read ON notifications(is_read)

## Relationships Diagram

```
Users (1) ----< (many) Job Posts
Users (1) ----< (many) Bookings (as service_partner)
Users (1) ----< (many) Bookings (as patron)
Users (1) ----< (many) Ratings (as patron)
Users (1) ----< (many) Ratings (as service_partner)
Users (1) ----< (many) Chat Messages (as sender)
Users (1) ----< (many) Chat Messages (as receiver)
Users (1) ----< (many) Conversations (as participant_1)
Users (1) ----< (many) Conversations (as participant_2)
Users (1) ----< (many) Refresh Tokens
Users (1) ----< (many) Notifications

Service Categories (1) ----< (many) Service Categories (hierarchical)
Service Categories (1) ----< (many) Job Posts

Job Posts (1) ----< (many) Bookings
Job Posts (1) ----< (many) Ratings
Job Posts (1) ----< (many) Chat Messages

Bookings (1) ----< (many) Chat Messages
Bookings (1) ----< (many) Conversations
Bookings (1) ----< (1) Ratings
```

## Constraints & Rules

1. **Soft Deletes**: Use `is_active` or `is_deleted` flags instead of hard deletes for audit trails.
2. **Timestamps**: All tables include `created_at` and `updated_at` timestamps. Note: PostgreSQL does not support a direct `ON UPDATE` constraint in column definitions. Instead, these are automatically managed by the Sequelize ORM, or can be implemented locally using custom triggers.
3. **UUIDs**: All primary keys use UUID for security and distributed compatibility.
4. **Data Integrity**: Foreign key constraints ensure referential integrity.
5. **Indexing**: Critical foreign keys and query columns are indexed for local performance.
6. **Text Search**: PostgreSQL full-text search indexes can be added locally for job searches.

---

## Local PostgreSQL Database Setup Guide

For a localhost college project setup, follow these steps to install and set up your PostgreSQL database:

### Step 1: Install PostgreSQL Locally
- **Windows**: Download and run the interactive installer from the [official PostgreSQL site](https://www.postgresql.org/download/windows/). Keep default options and set a password you will remember (e.g., `password`).
- **macOS**: Install via Homebrew:
  ```bash
  brew install postgresql@15
  brew services start postgresql@15
  ```
- **Linux (Ubuntu/Debian)**:
  ```bash
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  sudo systemctl start postgresql
  ```

### Step 2: Create the Local Database
Open your SQL client (pgAdmin, DBeaver, or terminal `psql`) and run:
```sql
CREATE DATABASE service_marketplace;
```

### Step 3: Configure Environment Variables
Create or update your `.env` file in the `backend/` directory with your local database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=service_marketplace
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
```

### Step 4: Run Migrations and Seed Data
Once the database is created, navigate to your backend folder and execute standard Sequelize commands to build and seed your local tables:
```bash
npm run migrate
npm run seed
```