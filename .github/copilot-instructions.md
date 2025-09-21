# NAVADA Robotics Copilot Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap Repository (5-10 minutes)
- Install dependencies: `npm install --ignore-scripts` 
  - Takes ~60 seconds, installs all packages
  - Use `--ignore-scripts` to avoid Prisma network issues in sandboxed environments
- Generate Prisma client if network available: `npx prisma generate` 
  - May fail with network error: "getaddrinfo ENOTFOUND binaries.prisma.sh"
  - If this fails, skip Prisma-dependent features and note the limitation

### Development Server (2 seconds startup)
- Start development server: `npm run dev`
  - Starts in ~1.5 seconds
  - Available at http://localhost:3000
  - Hot reload enabled
  - Can run without database connection for basic functionality

### Build Process (30-45 seconds with warnings)
- Build application: `npm run build` 
  - Takes ~30-45 seconds when working
  - **NEVER CANCEL** - Set timeout to 90+ seconds
  - Will fail if Prisma client not generated: "Cannot find module '.prisma/client/default'"
  - Produces warnings about Prisma/OpenTelemetry dependencies (normal)
  - Uses custom vercel-build script for production

### Testing Infrastructure (Comprehensive Suite)
- **Unit Tests**: `npm run test:unit:run` 
  - Takes ~10-30 seconds when working
  - May fail with rollup dependency issues: "Cannot find module @rollup/rollup-linux-x64-gnu"
  - **NEVER CANCEL** - Set timeout to 60+ seconds
- **E2E Tests**: `npm run test:e2e`
  - Requires Playwright browsers: `npx playwright install`
  - Browser install takes 10-15 minutes, **NEVER CANCEL** 
  - **NEVER CANCEL** E2E tests - Set timeout to 60+ minutes
  - May fail in sandboxed environments due to browser download restrictions
- **API Tests**: `npm run test:api` - Test all 35+ API endpoints
- **Integration Tests**: `npm run test:integration` - Full workflow testing
- **All Tests**: `npm run test:all` - Complete test suite

### Linting and Type Checking (5-15 seconds)
- Lint code: `npm run lint`
  - Takes ~5 seconds
  - Currently has ESLint configuration issues: "Definition for rule '@typescript-eslint/no-unused-vars' was not found"
  - Many files show linting errors, but command completes
- Type checking: `npx tsc --noEmit`
  - Takes ~12 seconds  
  - Currently has 113+ TypeScript errors across 30 files
  - Will exit with code 2, but provides detailed error listing

## Validation Scenarios

### CRITICAL: Always Test After Changes
1. **Start Development Server**: Verify `npm run dev` starts successfully (~2 seconds)
2. **Homepage Loads**: Load http://localhost:3000 and verify "NAVADA Robotics" page renders
3. **Agent Lee Access**: Navigate to `/agent-lee` and verify authentication requirement shows
4. **About Page**: Navigate to `/about` and verify Lee Akpareva profile displays
5. **API Testing**: Test at least one API endpoint if modifying backend
6. **Build Testing**: Run `npm run build` and verify it completes without new errors

### End-to-End Testing Scenarios
- **Homepage Navigation**: Verify http://localhost:3000 loads with "NAVADA Robotics" branding
- **Agent Lee Authentication**: Navigate to `/agent-lee` - should show "Authentication Required" message
- **About Page**: Navigate to `/about` - should display Lee Akpareva profile and company info
- **Learning Platform**: Test course enrollment and progress tracking at `/learning`
- **Authentication**: Test user registration and login flows
- **Payment Processing**: Verify Stripe integration (test mode)
- **Admin Dashboard**: Test course management functionality

## Common Issues and Workarounds

### Network/Dependency Issues
- **Prisma client generation fails**: Use `npm install --ignore-scripts`, accept Prisma features won't work
- **Rollup dependency missing**: Clean install with `rm -rf node_modules package-lock.json && npm install --ignore-scripts`
- **Playwright browser install fails**: Skip E2E tests in sandboxed environments

### Build Failures  
- **Prisma client missing**: Run `npx prisma generate` first
- **TypeScript errors**: Build may still succeed with `ignoreBuildErrors: true` in next.config.mjs
- **ESLint configuration**: Build continues with `ignoreDuringBuilds: true`

### Development Workflow
- Port conflicts: Use `npx kill-port 3000` or `npm run dev -- -p 3001`
- Database issues: Check DATABASE_URL in .env.local
- API key errors: Verify all required environment variables are set

## Environment Setup

### Required Software
- **Node.js**: Version 18.x or 20.x (verified working on 20.19.5)
- **npm**: Version 10+ (verified working on 10.8.2)
- **Git**: For version control

### Environment Variables (.env.local)
```env
# Database (optional for basic functionality)
DATABASE_URL="postgresql://username:password@localhost:5432/navada_robotics"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OpenAI Configuration (required for AI features)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ASSISTANT_ID=your_assistant_id_here
VOICE_PROMPT_ID=your_voice_prompt_id_here

# Optional APIs
BRAVE_SEARCH_API_KEY=your_brave_search_api_key_here
```

## Key Project Structure

### Critical Files
- `package.json` - Dependencies and 28 npm scripts
- `next.config.mjs` - Next.js configuration with Sentry integration
- `prisma/schema.prisma` - Database schema
- `.github/workflows/ci.yml` - CI pipeline (Node 18.x, 20.x)
- `vitest.config.ts` - Test configuration
- `playwright.config.ts` - E2E test configuration

### Main Directories
```
navada_robotics/
├── app/                      # Next.js App Router pages and API routes
│   ├── (auth)/              # Authentication pages  
│   ├── admin/               # Admin dashboard
│   ├── agent-lee/           # AI assistant interface
│   ├── api/                 # 35+ API endpoints
│   └── learning/            # Learning management system
├── components/              # Reusable React components
│   └── ui/                 # shadcn/ui component library
├── lib/                    # Utility functions and services
├── prisma/                 # Database schema and migrations
├── tests/                  # Comprehensive test suite
│   ├── api/                # API endpoint tests
│   ├── e2e/                # Playwright end-to-end tests
│   ├── integration/        # Integration tests
│   └── database/           # Database operation tests
└── scripts/                # Build and setup scripts
```

## Technology Stack

### Core Framework
- **Next.js 14** with App Router
- **TypeScript** (currently has type errors)
- **Tailwind CSS** with custom animations
- **Radix UI** + shadcn/ui components

### Backend Services
- **Prisma ORM** with PostgreSQL
- **NextAuth.js** for authentication
- **OpenAI API** for AI features
- **Stripe** for payment processing
- **Sentry** for error tracking

### Testing Stack
- **Vitest** for unit and integration tests
- **Playwright** for E2E testing  
- **@testing-library/react** for component testing
- **Jest DOM** for DOM testing utilities

## Build and Deployment

### Local Build Process
1. `npm install --ignore-scripts` (60 seconds)
2. `npx prisma generate` (if network available)
3. `npm run build` (30-45 seconds, **NEVER CANCEL**)
4. `npm run start` (production server)

### Production Deployment (Vercel)
- Custom build script: `scripts/vercel-build.js`
- Automatic Prisma client generation
- Sentry source map upload
- Environment variable configuration required

### CI/CD Pipeline
- Runs on Node.js 18.x and 20.x
- Tests: linting, type checking, unit tests, build, E2E tests
- Build artifacts retained for 30 days on failure

## Timing Expectations and Warnings

### NEVER CANCEL Operations
- **`npm install`**: Up to 10 minutes - **NEVER CANCEL**
- **`npm run build`**: Up to 5 minutes - **NEVER CANCEL**  
- **`npm run test:e2e`**: Up to 30 minutes - **NEVER CANCEL**
- **`npx playwright install`**: Up to 15 minutes - **NEVER CANCEL**
- **`npm run test:all`**: Up to 45 minutes - **NEVER CANCEL**

### Quick Operations (under 30 seconds)
- `npm run dev` - 2 seconds
- `npm run lint` - 5 seconds
- `npx tsc --noEmit` - 12 seconds
- `npm run test:unit:run` - 10-30 seconds

### Always Set These Timeouts
- Build commands: 300+ seconds (5+ minutes)
- Test commands: 1800+ seconds (30+ minutes)  
- Browser installs: 900+ seconds (15+ minutes)
- Full test suite: 2700+ seconds (45+ minutes)

## Known Limitations in Sandboxed Environments

1. **Prisma client generation may fail** due to network restrictions
2. **Playwright browser downloads may fail** preventing E2E tests
3. **TypeScript has 113+ current errors** but build may still work
4. **ESLint configuration issues** but linting provides useful feedback
5. **Rollup dependencies may be missing** affecting Vitest

## Validation Commands (Always Run)

Before committing changes, always run:
```bash
# Quick validation (under 30 seconds total)
npm run lint           # Check code style
npx tsc --noEmit      # Check types  
npm run dev           # Verify dev server starts

# Full validation (5+ minutes, **NEVER CANCEL**)
npm run build         # Verify production build
npm run test:all      # Run complete test suite
```

## Common Tasks Reference

### Development Workflow
1. `git checkout -b feature/your-feature`
2. Make changes following existing patterns
3. `npm run dev` - test changes locally
4. `npm run lint` - check code style
5. `npm run build` - verify build works
6. Commit and push for CI validation

### Debugging Failed Tests
- Check test output for specific error details
- Verify environment variables are set correctly
- Check if database connection is required
- Use `npm run test:unit:run` for faster feedback
- Check `tests/setup.ts` for test configuration

### API Development
- 35+ existing API routes in `app/api/`
- Add new routes following existing patterns
- Test with `npm run test:api`
- Check `lib/` for shared utilities and types

This application is a sophisticated Next.js platform with AI integration, comprehensive testing, and production deployment capabilities. Work within these established patterns and always validate your changes thoroughly.