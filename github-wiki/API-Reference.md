# API Reference

Complete documentation for all API endpoints in the NAVADA Robotics application.

## 🔗 Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://www.navadarobotics.com/api`

## 🔐 Authentication

Most API endpoints require authentication via NextAuth.js session cookies or API keys.

### Authentication Methods

- **Session Cookies**: For web application requests
- **API Keys**: For external integrations (where applicable)

## 🤖 AI Assistant APIs

### Agent Lee Chat

**Endpoint**: `POST /api/agent-lee`

**Description**: Main AI assistant endpoint for chat interactions

**Request Body**:

```json
{
  "message": "Your question or message",
  "threadId": "optional-thread-id",
  "userId": "user-id"
}
```

**Response**:

```json
{
  "response": "AI assistant response",
  "threadId": "thread-id-for-session",
  "messageId": "unique-message-id"
}
```

**Example**:

```javascript
const response = await fetch('/api/agent-lee', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: "Help me understand AI robotics",
    threadId: "existing-thread-id"
  })
});
```

### Text-to-Speech

**Endpoint**: `POST /api/agent-lee/tts`

**Description**: Convert text to speech audio

**Request Body**:

```json
{
  "text": "Text to convert to speech",
  "voice": "alloy"
}
```

**Response**: Audio file stream

### Session Management

**Endpoint**: `POST /api/agent-lee/init`

**Description**: Initialize a new chat session

**Response**:

```json
{
  "threadId": "new-thread-id",
  "sessionId": "session-id"
}
```

**Endpoint**: `GET /api/agent-lee/session/[threadId]`

**Description**: Get session details

**Response**:

```json
{
  "threadId": "thread-id",
  "messageCount": 5,
  "lastActivity": "2025-09-19T10:30:00Z",
  "status": "active"
}
```

**Endpoint**: `GET /api/agent-lee/history/[threadId]`

**Description**: Get chat history for a session

**Response**:

```json
{
  "messages": [
    {
      "id": "msg-id",
      "role": "user",
      "content": "User message",
      "timestamp": "2025-09-19T10:30:00Z"
    },
    {
      "id": "msg-id-2",
      "role": "assistant",
      "content": "AI response",
      "timestamp": "2025-09-19T10:30:05Z"
    }
  ]
}
```

## 🎓 Learning Management APIs

### Courses

**Endpoint**: `GET /api/learning/courses`

**Description**: Get all available courses

**Query Parameters**:

- `category`: Filter by category
- `difficulty`: Filter by difficulty level
- `featured`: Show only featured courses

**Response**:

```json
{
  "courses": [
    {
      "id": "course-id",
      "title": "Course Title",
      "description": "Course description",
      "difficulty": "beginner",
      "duration": "4 weeks",
      "price": 99.99,
      "featured": true
    }
  ]
}
```

**Endpoint**: `GET /api/learning/courses/[courseId]`

**Description**: Get specific course details

**Response**:

```json
{
  "id": "course-id",
  "title": "Course Title",
  "description": "Detailed description",
  "modules": [
    {
      "id": "module-id",
      "title": "Module Title",
      "lessons": [
        {
          "id": "lesson-id",
          "title": "Lesson Title",
          "content": "Lesson content",
          "lessonType": "text|video|quiz",
          "videoUrl": "https://youtube.com/watch?v=..."
        }
      ]
    }
  ]
}
```

### Course Generation

**Endpoint**: `POST /api/learning/generate-course`

**Description**: Generate a new course using AI

**Request Body**:

```json
{
  "title": "Course Title",
  "description": "Course description",
  "difficulty": "beginner|intermediate|advanced",
  "duration": "4 weeks"
}
```

**Response**:

```json
{
  "courseId": "generated-course-id",
  "title": "Generated Course Title",
  "modules": [...],
  "status": "generated"
}
```

### Enrollment

**Endpoint**: `POST /api/learning/enroll`

**Description**: Enroll user in a course

**Request Body**:

```json
{
  "courseId": "course-id",
  "userId": "user-id"
}
```

**Response**:

```json
{
  "enrollmentId": "enrollment-id",
  "courseId": "course-id",
  "enrolledAt": "2025-09-19T10:30:00Z"
}
```

### Progress Tracking

**Endpoint**: `GET /api/learning/progress`

**Description**: Get user's learning progress

**Query Parameters**:

- `courseId`: Specific course progress
- `userId`: User ID (optional if authenticated)

**Response**:

```json
{
  "userId": "user-id",
  "courses": [
    {
      "courseId": "course-id",
      "progress": 65.5,
      "completedLessons": 13,
      "totalLessons": 20,
      "lastAccessed": "2025-09-19T10:30:00Z"
    }
  ]
}
```

**Endpoint**: `POST /api/learning/progress`

**Description**: Update learning progress

**Request Body**:

```json
{
  "courseId": "course-id",
  "lessonId": "lesson-id",
  "completed": true,
  "timeSpent": 1800
}
```

### Notes and Bookmarks

**Endpoint**: `GET /api/learning/notes`

**Description**: Get user's notes and bookmarks

**Response**:

```json
{
  "notes": [
    {
      "id": "note-id",
      "courseId": "course-id",
      "lessonId": "lesson-id",
      "content": "Note content",
      "createdAt": "2025-09-19T10:30:00Z"
    }
  ]
}
```

**Endpoint**: `POST /api/learning/notes`

**Description**: Create a new note

**Request Body**:

```json
{
  "courseId": "course-id",
  "lessonId": "lesson-id",
  "content": "Note content",
  "type": "note|bookmark"
}
```

## 💰 Payment APIs (Stripe)

### Create Checkout Session

**Endpoint**: `POST /api/stripe/create-checkout-session`

**Description**: Create Stripe checkout session

**Request Body**:

```json
{
  "lookup_key": "product-lookup-key",
  "customer_email": "user@example.com"
}
```

**Response**:

```json
{
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

### Customer Portal

**Endpoint**: `POST /api/stripe/create-portal-session`

**Description**: Create customer portal session

**Request Body**:

```json
{
  "customer_id": "stripe-customer-id"
}
```

### Webhook Handler

**Endpoint**: `POST /api/stripe/webhook`

**Description**: Handle Stripe webhooks (internal use)

**Events Handled**:

- `payment_intent.succeeded`
- `invoice.payment_succeeded`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## 👤 Authentication APIs

### User Registration

**Endpoint**: `POST /api/auth/register`

**Description**: Register a new user

**Request Body**:

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "secure-password"
}
```

**Response**:

```json
{
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com"
  },
  "message": "User created successfully"
}
```

### NextAuth Endpoints

**Endpoint**: `POST /api/auth/[...nextauth]`

**Description**: NextAuth.js authentication handlers

**Supported Providers**:

- Credentials (email/password)
- OAuth providers (configurable)

## 📊 Analytics APIs

**Endpoint**: `POST /api/analytics`

**Description**: Track analytics events

**Request Body**:

```json
{
  "event": "page_view|user_action|course_completion",
  "properties": {
    "page": "/learning/course/123",
    "userId": "user-id",
    "courseId": "course-id"
  }
}
```

**Endpoint**: `GET /api/learning/analytics`

**Description**: Get learning analytics

**Response**:

```json
{
  "totalUsers": 1250,
  "activeCourses": 45,
  "completionRate": 78.5,
  "averageProgress": 65.2
}
```

## 🔧 Admin APIs

### Course Management

**Endpoint**: `GET /api/admin/courses`

**Description**: Get all courses (admin view)

**Endpoint**: `POST /api/admin/courses`

**Description**: Create/update courses

**Request Body**:

```json
{
  "title": "Course Title",
  "description": "Course description",
  "modules": [...],
  "published": true
}
```

## 🚀 MCP (Model Context Protocol) APIs

**Endpoint**: `GET /api/mcp/servers`

**Description**: Get MCP server status

**Response**:

```json
{
  "servers": [
    {
      "name": "brave-search",
      "status": "active",
      "capabilities": ["search", "web_fetch"]
    }
  ]
}
```

**Endpoint**: `POST /api/mcp/control`

**Description**: Control MCP servers

**Request Body**:

```json
{
  "action": "start|stop|restart",
  "server": "server-name"
}
```

## 🔧 Utility APIs

### Email Subscription

**Endpoint**: `POST /api/emails/subscribe`

**Description**: Subscribe to newsletter

**Request Body**:

```json
{
  "email": "user@example.com",
  "interests": ["ai", "robotics"]
}
```

### Website Generation

**Endpoint**: `POST /api/generate-website`

**Description**: Generate website with AI

**Request Body**:

```json
{
  "description": "Website description",
  "style": "modern",
  "colors": ["blue", "purple"]
}
```

## 🐛 Debug APIs (Development Only)

**Endpoint**: `GET /api/debug/db`

**Description**: Database debugging tools

**Endpoint**: `GET /api/debug/env`

**Description**: Environment variable checker

## 📝 Error Responses

All APIs return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details",
  "timestamp": "2025-09-19T10:30:00Z"
}
```

### Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Rate Limited
- `500`: Internal Server Error

## 🔄 Rate Limiting

- **General APIs**: 100 requests per minute per IP
- **AI APIs**: 20 requests per minute per user
- **Payment APIs**: 10 requests per minute per user

## 📚 SDK Examples

### JavaScript/TypeScript

```typescript
import { NavadaAPI } from '@navada/sdk';

const api = new NavadaAPI({
  baseURL: 'https://www.navadarobotics.com/api',
  apiKey: 'your-api-key'
});

// Chat with Agent Lee
const response = await api.chat.send({
  message: "Hello Agent Lee!",
  threadId: "thread-123"
});

// Get courses
const courses = await api.learning.getCourses({
  category: 'ai-fundamentals'
});
```

---

*API Reference last updated: September 2025*
