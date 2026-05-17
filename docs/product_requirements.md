# 📋 Product Requirements Specification — Moseva

This document lists the actual, production-ready functional specifications, workflows, and regulatory compliance standards of the **Moseva Service Marketplace** platform.

---

## 🌟 1. Core Platform Workflows

Moseva coordinates a multi-party service marketplace between **Patrons** (customers), **Service Partners** (professionals), and **Stewards** (administrators).

### 🔄 The Marketplace Value Chain Lifecycle
```
[Patron]                         [Steward]                    [Service Partner]
   |                                 |                                |
   |--- 1. Post New Job (Pending) -->|                                |
   |                                 |--- 2. Review Job ------------->|
   |                                 |       (Approve / Reject)       |
   |                                 |                                |
   |<-- 3. Notification (Approved) --|--- 3. List in Exploration ---->|
   |                                                                  |
   |                                  <-- 4. Review Details ----------|
   |                                                                  |
   |<-- 5. Receive Timeline Bid --------------------------------------|--- 5. Submit bid proposal
   |                                                                  |
   |--- 6. Accept Bid / Booking ----->|                                |
   |                                  |--- 6. Lock Booking inDB ------>|
   |                                                                  |
   |<================== 7. Duplex Socket Chat Negotiation ===========>|
   |                                                                  |
   |--- 8. Complete & Rate ---------->|                                |
   |                                  |--- 8. Log Review & Feedback -->|
```

---

## 🛠️ 2. Comprehensive Feature Specification

### 👥 2.1 User Onboarding & Profiles
* **Frictionless Sign-Up**: Users register with standard credentials or through the native **Google OAuth** flow.
* **Role Selection**: Accounts register as either a `patron` or `service_partner`. Stewards and Superadmin roles are assigned through secure backoffice seeder scripts.
* **Google Identity Sync**: Automatically imports Google display names, emails, and primary profile pictures (`avatarUrl`) into customer records.

### 💼 2.2 Job Management & Bidding
* **Detailed Job Creation**: Patrons list job requests by specifying title, details, category, budget range, deadlines, location, arrangement type (`onsite`, `remote`, `flexible`), and priority level (`low`, `medium`, `high`, `urgent`).
* **Approved Job Listings**: Service partners browse a directory of approved jobs, filtered by category, location type, and title search queries.
* **Timeline Bids (Proposals)**: Service partners bid on jobs by specifying custom prices, cover letters, and completion timelines (in days).
* **Booking Creation**: Patrons accept a bid to automatically close job bidding, generate a new booking, and set the job status to `in_progress`.

### 🛡️ 2.3 Steward Moderation & Admin Operations
Stewards manage the marketplace from the central glassmorphic **Admin Operations Dashboard**:
* **Real-time Performance Metrics**: Displays live stats, including total active users, jobs posted, and total proposals submitted.
* **Job Moderation Cell**: A review queue of pending jobs. Stewards can **Approve** a job to publish it or **Reject** it by providing specific rejection reasons (which notify the patron).
* **User Registry Cell**: A master list of all registered users. Admins can deactivate/activate user accounts and update RBAC roles on the fly.

---

## ⚖️ 3. Regulatory DPDP Act Grievance & Erasure Compliance

To comply with India's **Digital Personal Data Protection (DPDP) Act**, Moseva implements complete regulatory compliance cells:
* **Support & Grievances Tab**: A portal for all users to submit formal complaints or invoke data erasure claims.
* **DPDP Data Erasure Cell**: A queue in the Admin Panel showing all pending erasure claims.
* **Erasure & Deactivation Execution**: Stewards can execute erasures to immediately flag accounts as inactive (`isActive = false`), remove personal metadata, log the compliance history, and record completed timestamps (`completedAt`), maintaining a clean, legally-compliant registry.