# API Endpoints

## Base URL
```
/api/v1
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Error Response Format
All error responses follow this format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // Optional additional details
  }
}
```

## Success Response Format
All success responses follow this format:
```json
{
  "success": true,
  "data": { /* response data */ },
  "pagination": { /* if applicable */ }
}
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "role": "patron" // "patron" or "service_partner"
}
```
**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Login
```
POST /auth/login
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Refresh Token
```
POST /auth/refresh
```
**Request Body:**
```json
{
  "refreshToken": "valid_refresh_token"
}
```
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token"
  }
}
```

### Logout
```
POST /auth/logout
```
**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Forgot Password
```
POST /auth/forgot-password
```
**Request Body:**
```json
{
  "email": "user@example.com"
}
```
**Response:** `200 OK`

### Reset Password
```
POST /auth/reset-password
```
**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePassword123!"
}
```
**Response:** `200 OK`

### Verify Email
```
POST /auth/verify-email
```
**Request Body:**
```json
{
  "token": "verification_token"
}
```
**Response:** `200 OK`

---

## User Management Endpoints

### Get Current User Profile
```
GET /users/me
```
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "username": "johndoe",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patron",
    "avatarUrl": "http://localhost:5000/uploads/avatars/user-default.png",
    "bio": "User bio...",
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update Profile
```
PUT /users/me
```
**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio...",
  "phone": "+1234567890"
}
```
**Response:** `200 OK`

### Upload Avatar
```
POST /users/me/avatar
```
**Request:** multipart/form-data with `avatar` file field
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "avatarUrl": "http://localhost:5000/uploads/avatars/user-default.png"
  }
}
```

### Get User by ID (Public Profile)
```
GET /users/:userId
```
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "role": "service_partner",
    "avatarUrl": "http://localhost:5000/uploads/avatars/service-partner-1.jpg",
    "bio": "Professional bio...",
    "rating": 4.8,
    "totalJobs": 25,
    "memberSince": "2024-01-01"
  }
}
```

### Get Service Partner Reviews
```
GET /users/:userId/reviews
```
**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [ /* array of rating objects */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

## Service Categories Endpoints

### Get All Categories
```
GET /categories
```
**Query Parameters:**
- `parent` (optional): Filter by parent category ID
- `active` (optional): Filter by active status (default: true)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "categoryId": "uuid",
      "name": "Plumbing",
      "description": "Plumbing services",
      "iconUrl": "http://localhost:5000/uploads/icons/plumbing.png",
      "parentId": null,
      "children": [ /* nested categories */ ]
    }
  ]
}
```

### Get Category by ID
```
GET /categories/:categoryId
```
**Response:** `200 OK`

### Create Category (Steward only)
```
POST /categories
```
**Request Body:**
```json
{
  "name": "Electrical",
  "description": "Electrical services",
  "parentId": "uuid" // optional
}
```
**Response:** `201 Created`

### Update Category (Steward only)
```
PUT /categories/:categoryId
```
**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "isActive": true
}
```
**Response:** `200 OK`

---

## Job Posts Endpoints

### Get All Jobs (Browse Catalog)
```
GET /jobs
```
**Query Parameters:**
- `category` (optional): Filter by category ID
- `status` (optional): Filter by status (default: 'approved')
- `location` (optional): Filter by location
- `locationType` (optional): 'onsite', 'remote', or 'flexible'
- `minBudget` (optional): Minimum budget filter
- `maxBudget` (optional): Maximum budget filter
- `priority` (optional): Filter by priority
- `search` (optional): Full-text search in title/description
- `sortBy` (optional): 'createdAt', 'budget_max', 'priority' (default: 'createdAt')
- `sortOrder` (optional): 'asc' or 'desc' (default: 'desc')
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "jobId": "uuid",
      "title": "Fix Leaky Faucet",
      "description": "Kitchen faucet is leaking...",
      "category": {
        "categoryId": "uuid",
        "name": "Plumbing"
      },
      "patron": {
        "userId": "uuid",
        "username": "johndoe",
        "avatarUrl": "http://localhost:5000/uploads/avatars/user-default.png"
      },
      "budgetMin": 50,
      "budgetMax": 100,
      "location": "New York, NY",
      "locationType": "onsite",
      "priority": "medium",
      "deadline": "2024-02-01",
      "status": "approved",
      "viewedCount": 45,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Get Job by ID
```
GET /jobs/:jobId
```
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "jobId": "uuid",
    "title": "Fix Leaky Faucet",
    "description": "Kitchen faucet is leaking...",
    "category": { /* full category object */ },
    "patron": { /* patron info */ },
    "budgetMin": 50,
    "budgetMax": 100,
    "location": "New York, NY",
    "locationType": "onsite",
    "priority": "medium",
    "deadline": "2024-02-01",
    "status": "approved",
    "viewedCount": 46,
    "bookings": [ /* array of related bookings */ ],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### Create Job Post (Patron only)
```
POST /jobs
```
**Request Body:**
```json
{
  "title": "Fix Leaky Faucet",
  "description": "Kitchen faucet is leaking and needs repair.",
  "categoryId": "uuid",
  "budgetMin": 50,
  "budgetMax": 100,
  "location": "New York, NY",
  "locationType": "onsite",
  "priority": "medium",
  "deadline": "2024-02-01"
}
```
**Response:** `201 Created`

### Update Job Post
```
PUT /jobs/:jobId
```
**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description...",
  "categoryId": "uuid",
  "budgetMin": 75,
  "budgetMax": 150,
  "location": "Brooklyn, NY",
  "locationType": "flexible",
  "priority": "high",
  "deadline": "2024-01-25"
}
```
**Response:** `200 OK`

### Delete Job Post
```
DELETE /jobs/:jobId
```
**Response:** `200 OK`

### Get My Jobs (Patron's own jobs)
```
GET /jobs/my-jobs
```
**Query Parameters:** Same as GET /jobs
**Response:** `200 OK` (array of jobs posted by current user)

---

## Booking Endpoints

### Get All Bookings
```
GET /bookings
```
**Query Parameters:**
- `jobId` (optional): Filter by job ID
- `status` (optional): Filter by status
- `role` (optional): 'patron' or 'service_partner' (filters based on current user's role)
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "bookingId": "uuid",
      "job": { /* job summary */ },
      "servicePartner": { /* partner info */ },
      "patron": { /* patron info */ },
      "proposalText": "I can fix this...",
      "proposedPrice": 75,
      "proposedTimeline": 2,
      "status": "accepted",
      "startDate": "2024-01-20",
      "endDate": "2024-01-22",
      "createdAt": "2024-01-16T10:00:00Z"
    }
  ],
  "pagination": { /* pagination info */ }
}
```

### Get Booking by ID
```
GET /bookings/:bookingId
```
**Response:** `200 OK`

### Create Booking (Service Partner applies to job)
```
POST /bookings
```
**Request Body:**
```json
{
  "jobId": "uuid",
  "proposalText": "I have 10 years of experience in plumbing and can fix this issue quickly.",
  "proposedPrice": 75,
  "proposedTimeline": 2
}
```
**Response:** `201 Created`

### Accept Booking (Patron accepts a proposal)
```
PUT /bookings/:bookingId/accept
```
**Response:** `200 OK`

### Reject Booking (Patron rejects a proposal)
```
PUT /bookings/:bookingId/reject
```
**Request Body (optional):**
```json
{
  "reason": "Selected another partner"
}
```
**Response:** `200 OK`

### Complete Booking (Mark job as completed)
```
PUT /bookings/:bookingId/complete
```
**Response:** `200 OK`

### Cancel Booking
```
PUT /bookings/:bookingId/cancel
```
**Request Body:**
```json
{
  "reason": "Customer requested cancellation"
}
```
**Response:** `200 OK`

---

## Rating Endpoints

### Create Rating (After booking completion)
```
POST /ratings
```
**Request Body:**
```json
{
  "bookingId": "uuid",
  "patronRating": 5,
  "patronComment": "Excellent work, very professional!",
  "partnerRating": 4,
  "partnerComment": "Great communication from the patron."
}
```
**Response:** `201 Created`

### Get Rating by Booking
```
GET /ratings/booking/:bookingId
```
**Response:** `200 OK`

### Get Service Partner's Ratings
```
GET /ratings/partner/:partnerId
```
**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:** `200 OK`

---

## Chat Endpoints

### Get Conversations
```
GET /chat/conversations
```
**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "conversationId": "uuid",
      "otherParticipant": { /* user info */ },
      "lastMessage": { /* last message preview */ },
      "unreadCount": 3,
      "lastMessageAt": "2024-01-16T15:30:00Z"
    }
  ]
}
```

### Get Conversation Messages
```
GET /chat/conversations/:conversationId/messages
```
**Query Parameters:**
- `before` (optional): Get messages before this timestamp
- `limit` (optional): Number of messages (default: 50)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "messageId": "uuid",
      "senderId": "uuid",
      "sender": { /* sender info */ },
      "messageType": "text",
      "content": "Hello, are you available?",
      "mediaUrl": null,
      "isRead": true,
      "sentAt": "2024-01-16T15:30:00Z",
      "readAt": "2024-01-16T15:31:00Z"
    }
  ]
}
```

### Mark Messages as Read
```
PUT /chat/conversations/:conversationId/read
```
**Response:** `200 OK`

---

## Notification Endpoints

### Get Notifications
```
GET /notifications
```
**Query Parameters:**
- `unreadOnly` (optional): Only return unread notifications
- `type` (optional): Filter by notification type
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "notificationId": "uuid",
      "type": "booking_received",
      "title": "New Booking Request",
      "message": "You have a new booking request for your job post.",
      "entityType": "booking",
      "entityId": "uuid",
      "isRead": false,
      "actionUrl": "/bookings/abc-123",
      "createdAt": "2024-01-16T10:00:00Z"
    }
  ],
  "pagination": { /* pagination info */ }
}
```

### Mark Notification as Read
```
PUT /notifications/:notificationId/read
```
**Response:** `200 OK`

### Mark All Notifications as Read
```
PUT /notifications/read-all
```
**Response:** `200 OK`

---

## Admin Endpoints (Steward only)

### Approve Job Post
```
PUT /admin/jobs/:jobId/approve
```
**Response:** `200 OK`

### Reject Job Post
```
PUT /admin/jobs/:jobId/reject
```
**Request Body:**
```json
{
  "reason": "Job description violates guidelines"
}
```
**Response:** `200 OK`

### Get All Users
```
GET /admin/users
```
**Query Parameters:**
- `role` (optional): Filter by role
- `isVerified` (optional): Filter by verification status
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:** `200 OK`

### Update User Role (Steward only)
```
PUT /admin/users/:userId/role
```
**Request Body:**
```json
{
  "role": "service_partner"
}
```
**Response:** `200 OK`

### Deactivate User
```
DELETE /admin/users/:userId
```
**Response:** `200 OK`

### Get System Statistics
```
GET /admin/stats
```
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalUsers": 1500,
    "totalJobs": 3200,
    "totalBookings": 2800,
    "activeUsersToday": 245,
    "revenueThisMonth": 45000
  }
}
```

---

## WebSocket Events (Socket.IO)

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: accessToken
  }
});
```

### Chat Events

**Send Message:**
```javascript
socket.emit('chat:message', {
  conversationId: 'uuid',
  content: 'Hello',
  messageType: 'text'
});
```

**Receive Message:**
```javascript
socket.on('chat:message', (message) => {
  console.log('New message:', message);
});
```

**Typing Indicator:**
```javascript
socket.emit('chat:typing', {
  conversationId: 'uuid',
  isTyping: true
});
```

**Message Read:**
```javascript
socket.emit('chat:read', {
  conversationId: 'uuid',
  messageId: 'uuid'
});
```

### Notification Events

**Receive Notification:**
```javascript
socket.on('notification', (notification) => {
  console.log('New notification:', notification);
});
```

### Booking Events

**Booking Status Update:**
```javascript
socket.on('booking:update', (booking) => {
  console.log('Booking updated:', booking);
});
```

---

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **General API endpoints**: 100 requests per minute
- **Chat endpoints**: 30 requests per minute
- **File upload**: 10 requests per minute

## API Versioning

The API uses URL versioning (`/api/v1`). Future versions will be accessible at `/api/v2`, etc.

## CORS Configuration

- Allowed origins: Configurable via environment variables
- Allowed methods: GET, POST, PUT, DELETE, PATCH
- Allowed headers: Content-Type, Authorization, X-Requested-With
- Credentials: true (for cookie-based sessions if needed)