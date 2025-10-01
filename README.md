
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
OPENAI_API_KEY=your_openai_api_key
OPENAI_ASSISTANT_ID=your_assistant_id
VOICE_PROMPT_ID=your_voice_prompt_id
```

**Note**: For production deployment on Vercel, ensure these environment variables are set in your Vercel project settings.

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

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

## Feature Flags

This application supports feature flags for temporarily hiding features during development or maintenance:

### Temporarily Hidden Features (Environment Flags)

**Current Status**: Learning Hub and Admin Pages are temporarily disabled.

**To restore these features:**

1. Edit `.env.local` and set:
```env
ENABLE_LEARNING_HUB=true
ENABLE_ADMIN_PAGES=true
```

2. Restart the development server:
```bash
npm run dev
```

**What's affected when disabled:**

**Learning Hub:**
- `/learning` page shows maintenance message
- Navigation links hidden in all headers:
  - Agent Lee page (desktop & mobile nav)
  - About page (desktop & mobile nav)
  - Contact page (desktop & mobile nav)
  - Solutions page (desktop & mobile nav)
  - All solutions subpages (ai-research-platforms, educational-robotics, iot-integration, raspberry-pi-automation)
- Learning course routes remain accessible via direct URL (if needed for testing)

**Admin Pages:**
- `/admin/courses` page shows maintenance message
- `/admin/emails` page shows maintenance message
- `/admin/lms` page shows maintenance message
- Admin login links hidden from Learning page navigation (desktop & mobile)

**Removed Features (Permanently Deleted):**
- News page (`/news`) and all related files completely removed
- Dashboard page (`/dashboard`) and all related files completely removed
- RSS parser dependency removed for performance optimization

**Files Modified:**
- `.env.local` - Added feature flags
- `lib/feature-flags.ts` - Created utility functions
- Multiple page components updated with conditional rendering
- Navigation components cleaned of news and dashboard references
- Test files updated to reflect removed features
- Dependencies cleaned up (rss-parser removed)

**Safe Restoration**: Learning Hub and Admin Pages use non-destructive feature flags and can be instantly restored by changing environment variables. News and Dashboard pages were permanently removed for performance optimization.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `OPENAI_ASSISTANT_ID` | OpenAI Assistant ID for Agent Lee | Yes |
| `VOICE_PROMPT_ID` | Voice prompt configuration ID | Yes |
| `OPENAI_EMBEDDING_MODEL` | Optional embedding model used for knowledge vectorization (defaults to `text-embedding-3-small`) | No |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry Data Source Name for error tracking | Yes |
| `SENTRY_ORG` | Sentry organization slug | Yes |
| `SENTRY_PROJECT` | Sentry project name | Yes |
| `SENTRY_AUTH_TOKEN` | Sentry auth token for source map upload | Yes (for production) |
| `ENABLE_LEARNING_HUB` | Feature flag to enable/disable Learning Hub | No (defaults to false) |
| `ENABLE_ADMIN_PAGES` | Feature flag to enable/disable Admin Pages | No (defaults to false) |

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

## Recent Changes

### Latest Updates (September 2025)

- **Claude AI Integration**: Enhanced AI tutoring system with Claude AI for more sophisticated educational interactions
- **AI Tutors Platform**: Comprehensive learning management system with PostgreSQL backend
  - Learning paths with structured modules
  - Interactive quizzes and assessments
  - Progress tracking and session management
  - Real-time chat with AI tutors
- **3D Animations**: Replaced static graphics with interactive Spline 3D animations
  - Hero section with animated 3D scenes
  - Agent Lee interface with 3D robot arm animation
  - Voice-synchronized robot movements
- **Performance Optimizations**: Removed News and Dashboard pages to improve load times
- **Database Integration**: Full PostgreSQL setup with Prisma ORM for data persistence
- **Error Tracking**: Comprehensive Sentry integration for monitoring and debugging

## License

© 2024 NAVADA. All rights reserved.

## Support

For support or inquiries, please visit the Contact page or reach out through the website.
