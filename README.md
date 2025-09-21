
# NAVADA Robotics

**Navigating Artistic Vision with Advanced Digital Assistance**

A Next.js web application showcasing NAVADA's innovations at the intersection of AI, robotics, and creative technology.

## Features

- **Company Website**: Professional pages for Solutions, Services, About, and Contact
- **Agent Lee AI Assistant**: Interactive AI chat with text-to-speech capabilities
- **Modern UI/UX**: Dark theme with purple accents, fully responsive design
- **Animations**: Smooth transitions and interactive elements
- **Mobile Optimized**: Bottom navigation and hamburger menu for mobile devices

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **AI Integration**: OpenAI API
- **Analytics**: Vercel Analytics

## Prerequisites

- Node.js 18+ 
- npm or pnpm
- OpenAI API key
- Database (Neon PostgreSQL recommended, or local PostgreSQL)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd navada_robotics
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/navada_robotics

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_ASSISTANT_ID=your_assistant_id
VOICE_PROMPT_ID=your_voice_prompt_id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

**Note**: For production deployment on Vercel, ensure these environment variables are set in your Vercel project settings.

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Setup

NAVADA Robotics uses PostgreSQL as its primary database with Prisma ORM for database management. You can choose between a cloud-hosted Neon database (recommended) or a local PostgreSQL installation.

### Option 1: Neon Database (Recommended)

[Neon](https://neon.tech) is a serverless PostgreSQL platform that's perfect for development and production. It offers a generous free tier and scales automatically.

#### Why Neon?
- **Serverless**: No database server management required
- **Free Tier**: Generous limits for development and small projects
- **Instant Setup**: Database ready in seconds
- **Automatic Scaling**: Scales down to zero when not in use
- **Built-in Branching**: Create database branches for feature development

#### Setup Steps:

1. **Create a Neon Account**
   - Visit [neon.tech](https://neon.tech) and sign up for a free account
   - Verify your email address

2. **Create a New Project**
   - Click "Create a project" in your Neon dashboard
   - Choose a project name (e.g., "navada-robotics")
   - Select your preferred region (closest to your users)
   - Choose PostgreSQL version (latest recommended)

3. **Get Your Connection String**
   - In your project dashboard, click "Dashboard" → "Connection Details"
   - Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

4. **Configure Environment Variables**
   - Add your Neon connection string to `.env.local`:
   ```env
   DATABASE_URL="postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

5. **Initialize the Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

#### Neon Features for Development:
- **Database Branching**: Create branches for testing schema changes
- **Time Travel**: Restore your database to any point in time
- **Connection Pooling**: Built-in connection pooling for better performance
- **Monitoring**: Real-time database metrics and query insights

### Option 2: Local PostgreSQL

If you prefer running PostgreSQL locally or need offline development capabilities, you can set up a local PostgreSQL instance.

#### Prerequisites:
- PostgreSQL 12+ installed on your system
- Basic knowledge of PostgreSQL commands

#### Installation:

**On macOS (using Homebrew):**
```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create a database
createdb navada_robotics
```

**On Ubuntu/Debian:**
```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user and create database
sudo -u postgres createdb navada_robotics

# Create a new user (optional)
sudo -u postgres createuser --interactive
```

**On Windows:**
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the postgres user
4. Use pgAdmin or command line to create a database named `navada_robotics`

#### Configuration:

1. **Set up Database Connection**
   - Update your `.env.local` file with local connection details:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/navada_robotics"
   ```
   
   Replace:
   - `username`: Your PostgreSQL username (often `postgres`)
   - `password`: Your PostgreSQL password
   - `navada_robotics`: Your database name

2. **Test Connection**
   ```bash
   # Test if you can connect to the database
   psql postgresql://username:password@localhost:5432/navada_robotics
   ```

3. **Initialize Database Schema**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Database Schema Overview

The application uses Prisma ORM with the following key models:

- **Users**: User accounts and authentication
- **Courses**: Learning platform content
- **Lessons**: Individual course lessons
- **ChatSession/ChatMessage**: AI assistant conversations  
- **KnowledgeBase**: Vector embeddings for RAG
- **StripeActivity**: Payment and subscription tracking

### Common Database Commands

```bash
# Generate Prisma client (run after schema changes)
npx prisma generate

# Push schema changes to database
npx prisma db push

# View database in browser
npx prisma studio

# Reset database (development only)
npx prisma db reset

# View current schema
npx prisma db pull
```

### Database Troubleshooting

#### Connection Issues:

**Error: "Can't reach database server"**
- Check if PostgreSQL is running (local setup)
- Verify connection string format
- Ensure database exists
- Check firewall settings

**Neon-specific issues:**
- Verify your connection string includes `?sslmode=require`
- Check if you're within your Neon plan limits
- Ensure your IP is not blocked (Neon allows all IPs by default)

**Local PostgreSQL issues:**
- Ensure PostgreSQL service is running:
  ```bash
  # macOS
  brew services list | grep postgresql
  
  # Linux
  sudo systemctl status postgresql
  
  # Windows
  services.msc (look for PostgreSQL service)
  ```

#### Schema Issues:

**Error: "Table doesn't exist"**
```bash
# Reset and recreate schema
npx prisma db push --force-reset
```

**Error: "Prisma client out of sync"**
```bash
# Regenerate Prisma client
npx prisma generate
```

#### Performance Tips:

**For Local Development:**
- Use connection pooling in production
- Regular maintenance: `VACUUM ANALYZE` on large tables
- Index optimization for frequently queried fields

**For Neon:**
- Use database branching for schema experiments
- Monitor usage in Neon dashboard
- Consider connection pooling for high-traffic applications

### Environment Variables

The following database-related environment variables are available:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@host:5432/db` |
| `DATABASE_POOL_SIZE` | Connection pool size | No | `10` |
| `DATABASE_SSL` | Enable SSL connections | No | `true` |

### Production Considerations

When deploying to production:

1. **Use Neon for Production**: Recommended for its reliability and scaling
2. **Enable SSL**: Always use SSL connections in production
3. **Connection Pooling**: Configure appropriate pool sizes
4. **Monitoring**: Set up database monitoring and alerts
5. **Backups**: Neon provides automatic backups; configure additional backups as needed

For more detailed deployment instructions, see the [Deployment Guide](./wiki/Deployment.md).

## Project Management & Planning

**GitHub Project Board**: [Navada_Robotics Planning View](https://github.com/users/leeakpareva/projects/7)

**Planning Workflow:**
1. **Backlog**: New features, bugs, and improvements
2. **Ready**: Prioritized items ready for development
3. **In Progress**: Currently being worked on
4. **In Review**: Code review, testing, validation
5. **Done**: Completed and deployed

**Planning Features:**
- **Priority Levels**: P0 (Critical), P1 (High), P2 (Medium)
- **Size Estimation**: XS (1-2h), S (3-5h), M (1-2d), L (3-5d), XL (1w+)
- **Sprint Planning**: 5 iterations planned (Sep 18 - Nov 13, 2025)
- **Roadmap View**: Long-term feature planning and timeline

**How to Use:**
- Add new issues/features to the project board
- Set priority and size estimates for planning
- Move items through workflow columns
- Use iterations for sprint planning

## Project Structure

```
navada_robotics/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── services/          # Services page
│   ├── solutions/         # Solutions page
│   ├── contact/           # Contact page
│   ├── agent-lee/         # AI Assistant interface
│   └── api/               # API routes
│       └── agent-lee/     # AI Assistant endpoints
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/              # Static assets
└── styles/              # Global styles

```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test:unit` - Run unit tests with Vitest
- `npm run test:e2e` - Run Playwright tests
- `npm run test:e2e:headed` - Run Playwright tests with browser UI
- `npm run test:e2e:report` - Show Playwright HTML report

## Testing

This project includes comprehensive test coverage using [Vitest](https://vitest.dev/) for unit and integration testing, and [Playwright](https://playwright.dev/) for end-to-end testing.

### Test Structure

```
tests/
├── api/                    # API endpoint tests
│   ├── agent-lee.test.ts  # AI assistant API tests
│   ├── auth.test.ts       # Authentication tests
│   └── learning.test.ts   # Learning platform API tests
├── database/              # Database operation tests
│   └── database-operations.test.ts
├── e2e/                   # End-to-end tests
│   ├── navada.spec.ts    # Main E2E tests
│   └── performance.spec.ts # Performance tests
├── integration/           # Integration tests
│   └── full-integration.test.ts
├── mcp/                   # MCP integration tests
│   └── mcp-integration.test.ts
├── payment/               # Payment processing tests
│   └── stripe.test.ts
└── rag-service.test.ts   # RAG and vector search tests
```

### Running Tests

#### All Tests
```bash
npm run test:all          # Run all tests once
npm run test              # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
```

#### Specific Test Categories
```bash
# API Tests
npm run test:api          # Test all API endpoints

# Database Tests
npm run test:db           # Test database operations

# MCP Integration Tests
npm run test:mcp          # Test MCP server integrations

# Payment Tests
npm run test:payment      # Test Stripe payment processing

# Integration Tests
npm run test:integration  # Test full integration flows

# RAG/Vector Tests
npm run test:rag          # Test RAG service and vector search
```

#### Unit Tests
```bash
npm run test:unit         # Run unit tests in watch mode
npm run test:unit:run     # Run unit tests once
```

#### End-to-End Tests
```bash
npm run test:e2e          # Run E2E tests headless
npm run test:e2e:headed   # Run E2E tests with browser UI
npm run test:e2e:report   # Show HTML test report
```

#### Performance Tests
```bash
npm run test:perf         # Run performance tests

# Performance metrics measured:
# - Page load times
# - Core Web Vitals (LCP, FID, CLS)
# - Network idle timing
# - Resource loading performance
```

### Test Coverage Areas

#### API Endpoints (35 routes tested)
- **AI Assistant**: Agent Lee chat, TTS, session management
- **Authentication**: Registration, login, session handling
- **Learning Platform**: Courses, enrollment, progress tracking, notes
- **Payment**: Stripe checkout, webhooks, subscriptions
- **MCP**: Server control, statistics, tool usage
- **Admin**: Course management, analytics

#### Database Operations
- User CRUD operations
- Course management
- Chat sessions and messages
- Knowledge base with vector embeddings
- Subscription management
- Transaction handling

#### Integration Flows
- User registration → course enrollment
- AI chat with RAG and MCP integration
- Payment → subscription activation
- Full learning journey with notes and progress
- Error handling and recovery

#### MCP Integrations
- Brave Search API
- GitHub operations
- File system operations
- Tool recommendation system
- Server management

#### Payment Processing
- Checkout session creation
- Webhook handling
- Subscription management
- Customer portal
- Activity tracking

### Writing New Tests

When adding new features, create corresponding tests:

1. **API Tests**: Add to `tests/api/` for new endpoints
2. **Integration Tests**: Add to `tests/integration/` for complex flows
3. **Unit Tests**: Place alongside components in `app/` directory
4. **E2E Tests**: Add to `tests/e2e/` for user journeys

### Continuous Integration

Tests are automatically run on:
- Pull requests
- Commits to main branch
- Pre-deployment checks

### Test Results

Test results show:
- ✅ Passed tests in green
- ❌ Failed tests in red with error details
- ⏱️ Test execution time
- 📊 Coverage percentages (when using `test:coverage`)

## Pages

- **Home** (`/`) - Landing page with company overview
- **Solutions** (`/solutions`) - AI and robotics solutions
- **Services** (`/services`) - Service offerings
- **About** (`/about`) - Company information and vision
- **Contact** (`/contact`) - Contact information
- **Agent Lee** (`/agent-lee`) - AI assistant chat interface

## API Endpoints

### AI Assistant APIs
- `POST /api/agent-lee` - Main AI assistant endpoint
- `POST /api/agent-lee/tts` - Text-to-speech conversion
- `POST /api/agent-lee/init` - Initialize chat session
- `GET /api/agent-lee/session/[threadId]` - Get session details
- `GET /api/agent-lee/history/[threadId]` - Get chat history

### Authentication APIs
- `/api/auth/[...nextauth]` - NextAuth authentication handlers
- `POST /api/auth/register` - User registration

### Learning Platform APIs
- `GET /api/learning/courses` - Get all courses
- `GET /api/learning/courses/[courseId]` - Get specific course
- `POST /api/learning/generate-course` - Generate new course with AI
- `POST /api/learning/enhance-course` - Enhance existing course
- `POST /api/learning/generate-quiz` - Generate quiz questions
- `POST /api/learning/enroll` - Enroll in a course
- `GET/POST /api/learning/progress` - Track learning progress
- `GET/POST /api/learning/notes` - Manage learning notes
- `GET/POST /api/learning/reading-progress` - Track reading progress
- `POST /api/learning/text-to-speech` - Convert lesson text to speech
- `GET /api/learning/analytics` - Get learning analytics
- `POST /api/learning/seed-courses` - Seed initial courses

### Admin APIs
- `GET/POST /api/admin/courses` - Course administration

### MCP (Model Context Protocol) APIs
- `GET/POST /api/mcp/control` - Control MCP servers
- `GET /api/mcp/servers` - Get MCP server status
- `GET /api/mcp/stats` - Get MCP usage statistics

### Payment APIs (Stripe)
- `POST /api/stripe/create-checkout-session` - Create Stripe checkout
- `POST /api/stripe/create-portal-session` - Create customer portal
- `POST /api/stripe/webhook` - Handle Stripe webhooks

### Utility APIs
- `POST /api/analytics` - Track analytics events
- `GET /api/user/chat-sessions` - Get user chat sessions
- `POST /api/emails/subscribe` - Email newsletter subscription
- `POST /api/emails/admin` - Admin email notifications
- `POST /api/generate-website` - Generate website with AI
- `POST /api/anthropic/codegen` - Generate code with Claude

### Debug APIs (Development Only)
- `GET /api/debug/db` - Database debugging tools
- `GET /api/debug/env` - Environment variable checker

## Knowledge Base & Vector Search

- Knowledge entries saved through the RAG service automatically generate vector embeddings (via OpenAI by default) that are stored directly in the database for semantic retrieval.
- The `search` API first performs cosine similarity lookups against the stored vectors and gracefully falls back to keyword search when embeddings are unavailable.
- Unit tests in `tests/rag-service.test.ts` demonstrate how embeddings influence ranking. Run `npm run test` to verify the vector search pipeline end-to-end.

## Error Tracking with Sentry

This application includes comprehensive error tracking and monitoring using [Sentry](https://sentry.io).

### Sentry Features

- **Automatic Error Capture**: All unhandled errors are automatically captured
- **Performance Monitoring**: Track transaction performance and identify bottlenecks
- **Session Replay**: Records user sessions when errors occur (10% sampling, 100% on errors)
- **Custom Context**: Errors include user context, tags, and custom metadata
- **Source Maps**: Full stack traces in production with source map upload
- **Release Tracking**: Track errors by release version

### How Sentry Works

**Automatic Tracking** (Default):
- Sentry automatically captures all unhandled errors in both client and server code
- No code changes needed - errors are tracked automatically once configured
- Works in development (`npm run dev`) and production environments

**Manual Error Capture** (When needed):
```typescript
import * as Sentry from '@sentry/nextjs';

// Capture exceptions
try {
  // Your code
} catch (error) {
  Sentry.captureException(error);
}

// Send custom messages
Sentry.captureMessage('Custom event', 'info');

// Add user context
Sentry.setUser({ id: userId, email: userEmail });

// Add custom tags
Sentry.setTag('feature', 'payment');
```

### Testing Sentry

#### Option 1: Test Page (Recommended)
Visit http://localhost:3000/sentry-test for an interactive test interface with buttons to trigger various error scenarios.

#### Option 2: API Testing
```bash
# Test server-side error tracking
curl "http://localhost:3000/api/sentry-test?type=basic"

# Test custom message
curl "http://localhost:3000/api/sentry-test?type=message"

# Test with context
curl "http://localhost:3000/api/sentry-test?type=context"
```

#### Option 3: Automated Test Script
```bash
# Run comprehensive test suite
node test-sentry.js
```

This script tests:
- Client and server errors
- Async errors
- Custom messages
- User context
- Custom tags and metadata

### Verifying Sentry Integration

1. **Trigger a test error** using any method above
2. **Check the console** for error logs
3. **Visit Sentry Dashboard**: https://sentry.io
4. **Navigate to your project**: `generali-ki / sentry-purple-lamp`
5. **View captured events** in the Issues tab

### Sentry Configuration Files

- `sentry.client.config.ts` - Client-side configuration
- `sentry.server.config.ts` - Server-side configuration
- `sentry.edge.config.ts` - Edge runtime configuration
- `next.config.mjs` - Sentry webpack plugin configuration

### When Errors Are Captured

- **Development**: All errors are captured with debug information
- **Production**: Errors are captured with source maps for debugging
- **User Sessions**: 10% of sessions are recorded, 100% when errors occur
- **Performance**: All transactions are monitored (configurable sample rate)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL for authentication | Yes |
| `NEXTAUTH_SECRET` | Secret key for authentication | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `OPENAI_ASSISTANT_ID` | OpenAI Assistant ID for Agent Lee | Yes |
| `VOICE_PROMPT_ID` | Voice prompt configuration ID | Yes |
| `VECTOR_STORE_ID` | OpenAI Vector Store ID for knowledge base | Yes |
| `OPENAI_EMBEDDING_MODEL` | Optional embedding model used for knowledge vectorization (defaults to `text-embedding-3-small`) | No |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for payments | Yes (if using payments) |
| `STRIPE_SECRET_KEY` | Stripe secret key for payments | Yes (if using payments) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret for payment processing | Yes (if using payments) |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry Data Source Name for error tracking | Yes |
| `SENTRY_ORG` | Sentry organization slug | Yes |
| `SENTRY_PROJECT` | Sentry project name | Yes |
| `SENTRY_AUTH_TOKEN` | Sentry auth token for source map upload | Yes (for production) |
| `BRAVE_SEARCH_API_KEY` | Brave Search API key for MCP integration | No |

## Deployment

This application is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Build Troubleshooting

If you encounter Vercel build failures:

1. **Check the last working build**: Use `git log --oneline` to identify the last successful build commit
2. **Compare configurations**: Use `git diff <last-working-commit>..HEAD` to see what changed
3. **Focus on these critical files**:
   - `package.json` (scripts and dependencies)
   - `next.config.mjs` (Next.js configuration)
   - `vercel.json` (Vercel build settings)
   - `.eslintrc.json` (ESLint configuration)

**Example troubleshooting workflow:**
```bash
# Find the last working build commit (e.g., debab58)
git log --oneline

# Compare what changed since then
git diff debab58..HEAD --name-only

# Check specific file differences
git show debab58:vercel.json
git show debab58:next.config.mjs

# Revert to working configuration if needed
git checkout debab58 -- vercel.json next.config.mjs
```

**Common issues:**
- Custom build scripts in `package.json` can interfere with Vercel's build process
- Complex environment variable overrides in `vercel.json` may cause conflicts
- ESLint version mismatches with `eslint-config-next`

**Working configuration reference (commit `debab58`):**
- Uses standard `npm run build` command
- Minimal `vercel.json` with basic environment variables
- Simple `next.config.mjs` without complex webpack modifications

## License

© 2024 NAVADA. All rights reserved.

## Support

For support or inquiries, please visit the Contact page or reach out through the website.
