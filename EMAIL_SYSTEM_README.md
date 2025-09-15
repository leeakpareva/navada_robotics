# Email Collection System

A secure SQLite-based email collection system for storing user email addresses.

## ✅ What's Been Set Up

### 1. Database Schema
- **SQLite database** with Prisma ORM
- **EmailSubscriber model** with fields:
  - `id` (auto-increment)
  - `email` (unique)
  - `source` (where collected from)
  - `subscribedAt` (timestamp)
  - `isActive` (boolean)

### 2. API Endpoints

#### **POST `/api/emails/subscribe`**
Collect new email addresses:
```javascript
fetch('/api/emails/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    source: 'homepage'
  })
})
```

#### **GET `/api/emails/subscribe`**
Get subscription statistics (public):
```javascript
fetch('/api/emails/subscribe')
// Returns: { totalActiveSubscribers: 123 }
```

#### **GET `/api/emails/admin`** (Protected)
View all subscribers (admin only):
```javascript
fetch('/api/emails/admin', {
  headers: {
    'Authorization': 'Bearer YOUR_ADMIN_KEY'
  }
})
```

### 3. UI Components

#### **EmailSignup Component**
Ready-to-use React component with 3 variants:
```tsx
import { EmailSignup } from '@/components/ui/email-signup'

// Purple theme (matches Agent Lee)
<EmailSignup
  variant="purple"
  source="agent-lee"
  placeholder="Stay updated with AI innovations"
  buttonText="Join Now"
/>

// Default theme
<EmailSignup
  source="homepage"
  placeholder="Get updates"
  buttonText="Subscribe"
/>

// Minimal theme
<EmailSignup
  variant="minimal"
  source="newsletter"
/>
```

### 4. Admin Dashboard
Visit `/admin/emails` to view collected emails (requires admin key).

## 🔧 Setup Instructions

### 1. Add Environment Variable
Add to your `.env.local` file:
```
EMAIL_ADMIN_KEY=your_secure_admin_key_here
```

### 2. Database is Ready
The SQLite database has been created and is ready to use.

### 3. Use Anywhere
Add the EmailSignup component to any page:
```tsx
import { EmailSignup } from '@/components/ui/email-signup'

export default function YourPage() {
  return (
    <div>
      <h1>Subscribe for Updates</h1>
      <EmailSignup
        variant="purple"
        source="your-page-name"
        placeholder="Enter your email"
        buttonText="Subscribe"
      />
    </div>
  )
}
```

## 📊 Features

### ✅ Security
- Email validation
- Duplicate prevention
- Admin authentication
- Soft deletes (deactivation)

### ✅ User Experience
- Multiple design variants
- Loading states
- Success/error feedback
- Responsive design

### ✅ Data Management
- Source tracking
- Subscription statistics
- Admin dashboard
- Reactivation support

## 🎯 Usage Examples

### Homepage Newsletter
```tsx
<EmailSignup
  source="homepage"
  placeholder="Get robotics course updates"
  buttonText="Get Updates"
  className="max-w-md mx-auto"
/>
```

### Agent Lee Integration
```tsx
<EmailSignup
  variant="purple"
  source="agent-lee"
  placeholder="Stay updated with AI innovations"
  buttonText="Join the Future"
/>
```

### Footer Subscription
```tsx
<EmailSignup
  variant="minimal"
  source="footer"
  placeholder="Subscribe to newsletter"
  buttonText="Subscribe"
/>
```

## 🔒 Admin Access

1. Set `EMAIL_ADMIN_KEY` in `.env.local`
2. Visit `/admin/emails`
3. Enter your admin key
4. View all subscribers and statistics

## 📁 Files Created

```
prisma/
  schema.prisma           # Database schema
lib/
  prisma.ts              # Database client
app/api/emails/
  subscribe/route.ts     # Public email collection
  admin/route.ts         # Admin email management
components/ui/
  email-signup.tsx       # React component
app/admin/emails/
  page.tsx              # Admin dashboard
```

## ⚡ Quick Start

1. The system is already set up and ready to use
2. Add `EMAIL_ADMIN_KEY=mysecretkey123` to your `.env.local`
3. Use the component anywhere: `<EmailSignup variant="purple" source="test" />`
4. Visit `/admin/emails` to view collected emails

**The SQLite database is safely storing emails and ready for production use!** 🚀