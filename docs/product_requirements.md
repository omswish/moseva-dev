# Product Requirements

## Overview
This document outlines the product requirements for a service marketplace application that connects Patrons (customers) with Service Partners (workers) for various service needs. The platform includes job posting, catalog browsing, real-time chat, booking management, and rating systems.

## User Roles

### 1. Steward (Admin)
**Description:** System administrators who manage the platform, users, and ensure quality standards.

**Responsibilities:**
- Manage users and roles (create, update, deactivate)
- Approve or reject job postings before they go live
- Monitor system performance and user activity
- Handle disputes and escalations
- Manage service categories
- View system analytics and reports

**Permissions:**
- Full access to all system features
- Can view all user data and communications
- Can override any user action
- Access to admin dashboard and analytics

### 2. Patron (Customer)
**Description:** Users who post job requests and hire Service Partners.

**Responsibilities:**
- Create and manage job postings
- Browse service categories
- Review Service Partner proposals
- Communicate with Service Partners
- Rate and review completed services
- Manage bookings and payments

**Permissions:**
- Post new jobs (subject to approval)
- View and edit own jobs
- Accept/reject Service Partner proposals
- Chat with Service Partners
- Rate completed services
- View own booking history

### 3. Service Partner (Worker)
**Description:** Skilled professionals who browse jobs, submit proposals, and provide services.

**Responsibilities:**
- Browse available job postings
- Submit proposals for jobs
- Communicate with Patrons
- Complete jobs according to agreements
- Maintain professional conduct
- Build reputation through ratings

**Permissions:**
- View approved job listings
- Submit proposals for jobs
- Chat with Patrons
- View own booking history
- Build and view own ratings/reviews
- Manage profile and availability

## Core Workflows

### 1. User Registration & Authentication
**Flow:**
1. User visits registration page
2. Selects role (Patron or Service Partner)
3. Provides email, password, and basic information
4. Receives email verification link (in production, sent via SMTP; in localhost development, printed to backend stdout console and accounts can be auto-verified depending on settings)
5. Verifies email by clicking link (or auto-verified in development) and completes profile
6. Can now log in and use the platform

**Requirements:**
- Email verification required (supported via terminal log/bypass in localhost development mode)
- Password strength requirements
- Role selection during registration
- Profile completion encouraged but not mandatory initially

### 2. Job Posting Workflow
**Flow:**
1. Patron creates job post with title, description, category, budget, location, deadline
2. Job is saved as "Pending" and submitted for approval
3. Steward reviews job post
4. Steward approves (job becomes "Approved") or rejects (Patron notified with reason)
5. Service Partners can now view and apply to approved jobs
6. Patron receives notifications for new proposals

**Requirements:**
- All jobs require steward approval before going live
- Patrons can save drafts
- Jobs have status: Draft, Pending, Approved, Rejected, In Progress, Completed, Cancelled
- Automatic notifications for status changes

### 3. Catalog Browsing
**Flow:**
1. Service Partner visits jobs page
2. Can filter by category, location, budget, priority, date
3. Can search by keywords in title/description
4. Views job details
5. Decides to apply or skip

**Requirements:**
- Advanced filtering options
- Search functionality
- Pagination for large result sets
- Sort by date, budget, priority
- Show job statistics (views, applications)

### 4. Booking & Proposal Workflow
**Flow:**
1. Service Partner views job details
2. Submits proposal with:
   - Cover letter/proposal text
   - Proposed price
   - Estimated timeline
3. Patron receives notification
4. Patron reviews proposal and can:
   - Accept (creates booking, job status → In Progress)
   - Reject (with optional reason)
   - Message partner for clarification
5. Service Partner notified of decision
6. If accepted, both parties can begin work and communication

**Requirements:**
- Service Partners can submit one proposal per job
- Patrons can accept only one proposal per job
- Rejected proposals cannot be resubmitted
- All communication tracked in chat

### 5. Real-time Chat
**Flow:**
1. After booking is accepted, chat channel opens between Patron and Service Partner
2. Both parties can send messages, images, files
3. Messages are delivered in real-time via WebSocket
4. Typing indicators show when other party is typing
5. Messages marked as read when viewed
6. Chat history persists for future reference

**Requirements:**
- Real-time message delivery
- Support for text, images, and file attachments
- Typing indicators
- Read receipts
- Message search within conversation
- Steward can monitor chats if needed (for dispute resolution)

### 6. Job Completion & Rating
**Flow:**
1. Service Partner marks job as completed
2. Patron receives notification
3. Patron confirms completion or requests revisions
4. If confirmed, both parties can rate each other:
   - 1-5 star rating
   - Written review/comment
5. Ratings are published to profiles
6. Job status → Completed

**Requirements:**
- Both parties must rate for job to be fully completed
- Ratings are permanent and cannot be changed after submission
- Average rating displayed on profiles
- Reviews visible on profiles

### 7. User Profile Management
**Flow:**
1. User accesses profile page
2. Can update:
   - Personal information (name, bio, phone)
   - Profile picture/avatar
   - Skills and expertise (Service Partners)
   - Location and service areas
3. Changes saved immediately
4. Public profile visible to other users

**Requirements:**
- Profile completion percentage
- Avatar upload with validation
- Service Partners can showcase portfolio/work samples
- Patrons can view their job history
- Service Partners can view ratings and reviews

## Non-Functional Requirements (Localhost Alignment)

### Performance
- Page load time < 2 seconds on local network
- Real-time chat latency < 100ms on localhost
- Support single-developer local manual testing (no high concurrency requirements needed for local college project; 10,000+ concurrent users is out of scope for local deployment)
- API response time < 100ms for localhost requests

### Security & Local Setup
- HTTP for local communication (HTTPS is marked as out of scope for local dev, though optional via local self-signed certificates)
- Password hashing with bcrypt (12 rounds)
- JWT token-based authentication (HS256)
- Local rate limiting with express-rate-limit (can be disabled or set high in development to prevent lockouts during manual testing)
- SQL injection prevention via Sequelize ORM parameterization
- XSS protection & Input validation/sanitization via Joi

### Scalability (Simplified for Localhost)
- Local Database indexing for query performance
- Serve static assets directly from local Express backend (`/uploads` static folder serving; CDN for static assets is out of scope for local project)
- In-memory data structures for fast dev iteration (Enterprise load balancing and horizontal scaling are out of scope for local project)

### Reliability & Maintenance
- Single-instance local reliability
- Manual PostgreSQL local backups via `pg_dump` (Automated cloud backups are out of scope for local project)
- Standard Node console logging and local log files (`logs/error.log`) for debugging (Cloud/Sentry error monitoring is out of scope for local project)
- Clear error logs

### Usability
- Responsive design (mobile, tablet, desktop) using Material-UI
- Intuitive browser-based navigation
- Clear local user feedback and error messages

## User Stories

### Authentication & Profile
- As a user, I want to register with my email so I can use the platform
- As a user, I want to log in securely so I can access my account
- As a user, I want to reset my password if I forget it
- As a user, I want to update my profile information so it stays current
- As a user, I want to upload a profile picture so others can recognize me

### Job Posting (Patron)
- As a Patron, I want to post a job with all relevant details so Service Partners understand what I need
- As a Patron, I want to save job drafts so I can complete them later
- As a Patron, I want to edit my job posts before they're approved
- As a Patron, I want to see all proposals for my jobs so I can choose the best Service Partner
- As a Patron, I want to accept or reject proposals so I can move forward with the right partner

### Job Browsing (Service Partner)
- As a Service Partner, I want to browse available jobs so I can find work
- As a Service Partner, I want to filter jobs by category, location, and budget so I find relevant opportunities
- As a Service Partner, I want to search for jobs by keywords so I can find specific work
- As a Service Partner, I want to view detailed job descriptions so I understand the requirements
- As a Service Partner, I want to submit proposals so I can apply for jobs

### Communication
- As a user, I want to chat in real-time with other users so we can discuss project details
- As a user, I want to send images and files in chat so I can share relevant documents
- As a user, I want to see when others are typing so I know they're responding
- As a user, I want to see read receipts so I know my messages were seen

### Booking Management
- As a Service Partner, I want to see my accepted bookings so I know my commitments
- As a Patron, I want to track the progress of my jobs so I stay informed
- As a user, I want to cancel bookings if needed so I'm not locked into unwanted commitments

### Ratings & Reviews
- As a Patron, I want to rate Service Partners after job completion so others can see their quality
- As a Service Partner, I want to rate Patrons so others know what it's like to work with them
- As a user, I want to read reviews before working with someone so I can make informed decisions

### Admin (Steward)
- As a Steward, I want to review job posts before approval so I can ensure quality and compliance
- As a Steward, I want to manage user accounts so I can handle violations or issues
- As a Steward, I want to view system analytics so I can monitor platform health
- As a Steward, I want to manage service categories so the platform stays organized

## Acceptance Criteria

### Registration
- [ ] User can register with email and password
- [ ] Email verification is required before account activation
- [ ] Password must meet complexity requirements
- [ ] User must select role (Patron or Service Partner)
- [ ] Registration form validates all inputs

### Job Posting
- [ ] Patron can create job with title, description, category, budget, location
- [ ] Job requires steward approval before becoming visible
- [ ] Patron receives notification when job is approved/rejected
- [ ] Patron can edit draft jobs
- [ ] Jobs have proper status tracking

### Job Browsing
- [ ] Service Partners can view all approved jobs
- [ ] Filters work correctly (category, location, budget, etc.)
- [ ] Search returns relevant results
- [ ] Pagination works for large result sets
- [ ] Job details show all relevant information

### Proposals & Bookings
- [ ] Service Partners can submit one proposal per job
- [ ] Proposals include cover letter, price, and timeline
- [ ] Patrons can accept or reject proposals
- [ ] Accepted proposals create bookings
- [ ] Booking status updates correctly through workflow

### Chat
- [ ] Real-time messaging works between users
- [ ] Messages are delivered instantly
- [ ] Typing indicators show correctly
- [ ] Read receipts update when messages are viewed
- [ ] Images and files can be shared
- [ ] Chat history persists

### Ratings
- [ ] Both parties can rate after job completion
- [ ] Ratings are 1-5 stars with optional comments
- [ ] Average ratings display on profiles
- [ ] Reviews are visible on user profiles
- [ ] Ratings cannot be changed after submission

### Admin
- [ ] Stewards can approve/reject job posts
- [ ] Stewards can view all users and their activity
- [ ] Stewards can deactivate user accounts
- [ ] Admin dashboard shows key metrics
- [ ] Stewards can manage service categories

## Out of Scope (Future Releases)

- Payment processing and escrow services
- Advanced analytics and reporting
- Mobile native applications (iOS/Android)
- Multi-language support
- Advanced search with AI recommendations
- Service Partner verification/badge system
- Subscription plans for premium features
- Dispute resolution system
- Automated matching algorithm
- Calendar integration for scheduling