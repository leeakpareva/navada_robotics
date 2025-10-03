Quickstart Guide: NAVADA Robotics Platform
=========================================

NAVADA Robotics is a Next.js 14 application that presents the studio's AI, robotics, and digital innovation capabilities while exposing operational tooling used to power the experience. The site now blends immersive storytelling, multi-model AI assistance, research data capture, and payment-enabled programs inside a single codebase.

## Overview of the Current Experience

- **Immersive marketing site** with a Spline-powered hero, animated backgrounds, and responsive navigation across desktop and mobile views.【F:app/page.tsx†L19-L114】
- **Solutions storytelling** that links to deep dives for AI agent development, computer vision, robotics, and strategic partnerships, all built with shared UI primitives from `components/ui`.【F:app/solutions/page.tsx†L10-L203】
- **Agent Lee conversational lab** that supports OpenAI, Anthropic, Mistral, and DeepSeek models, optional Brave Search MCP lookups, vector-augmented responses, and speech recognition for voice capture.【F:app/agent-lee/page.tsx†L32-L153】【F:app/api/agent-lee/route.ts†L1-L210】
- **Data Initiative portal** featuring a gated survey flow, automated windowing logic, and rich research, insights, and rewards content for both individuals and businesses.【F:app/data/page.tsx†L1-L120】【F:lib/surveyConfig.ts†L1-L87】
- **Operational dashboards** for MCP server management, admin maintenance pages, Stripe-backed subscriptions, and Sentry diagnostics for debugging and monitoring.【F:app/mcp-dashboard/page.tsx†L1-L120】【F:app/subscription/page.tsx†L1-L160】【F:sentry.server.config.ts†L1-L120】

## Application Architecture

| Layer | Details |
| --- | --- |
| **Framework** | Next.js 14 App Router with TypeScript, React 18, and server actions where required. |
| **UI System** | Tailwind CSS, shadcn/ui, custom animated backgrounds (`AnimatedGridBackground`, `BeamsBackground`), and optimized media helpers (`OptimizedImage`).【F:app/page.tsx†L19-L114】【F:components/ui/animated-grid-background.tsx†L1-L160】 |
| **Data & Auth** | Prisma ORM targeting PostgreSQL (`prisma/schema.prisma`), NextAuth for credential-based sessions, and survey models for research programs.【F:prisma/schema.prisma†L1-L120】【F:app/api/auth/[...nextauth]/route.ts†L1-L60】 |
| **Payments** | Stripe checkout, portal, and webhook handlers for paid programs or stipends.【F:app/api/stripe/create-checkout-session/route.ts†L1-L80】【F:app/api/stripe/webhook/route.ts†L1-L120】 |
| **AI & Automation** | Multi-provider chat via OpenAI, Anthropic, Mistral, DeepSeek; Brave Search MCP integration; RAG service; safe website generator tooling and MCP dashboard for server orchestration.【F:app/api/agent-lee/route.ts†L1-L210】【F:app/test-website-generator/page.tsx†L1-L120】 |
| **Monitoring** | Sentry client, server, and edge configurations plus instrumentation helpers for tracing.【F:sentry.client.config.ts†L1-L160】【F:instrumentation.ts†L1-L200】 |

## Key Site Sections

### Marketing & Engagement
- `/` Home — hero story, capability highlights, and CTA links.【F:app/page.tsx†L19-L246】
- `/solutions` — program overview linking to robotics, AI agents, and partnerships.【F:app/solutions/page.tsx†L10-L203】
- `/blog` (Engagement) — embedded Claude artifacts and case studies for community storytelling.【F:app/blog/page.tsx†L1-L96】
- `/about`, `/contact`, `/subscription`, `/subscription/success` — brand narrative, contact channel, and subscription enrollment experience.【F:app/about/page.tsx†L1-L200】【F:app/contact/page.tsx†L1-L200】【F:app/subscription/page.tsx†L1-L160】

### Specialized Programs
- `/ai-agent-development`, `/computer-vision`, `/robotics` — solution-specific landing pages with capability matrices and callouts.【F:app/ai-agent-development/page.tsx†L1-L200】【F:app/computer-vision/page.tsx†L1-L200】【F:app/robotics/page.tsx†L1-L120】
- `/data` — NAVADA Data Initiative survey, insights tabs, authentication gating, and payout messaging.【F:app/data/page.tsx†L1-L200】
- `/learning` — feature-flag-ready learning hub (disabled by default) that can be re-enabled for LMS experiences via environment flags.【F:app/learning/page.tsx†L1-L200】【F:lib/feature-flags.ts†L1-L11】
- `/agent-lee` — real-time chat, speech input, API provider selector, and analytics hooks.【F:app/agent-lee/page.tsx†L32-L153】
- `/mcp-dashboard` — monitors Model Context Protocol servers and exposes enable/disable actions.【F:app/mcp-dashboard/page.tsx†L1-L120】
- `/test-website-generator` — internal tooling to validate safe website generation flows and download artifacts.【F:app/test-website-generator/page.tsx†L1-L120】

## Project Structure

```
navada_robotics/
├── app/
│   ├── (marketing pages, e.g., page.tsx, solutions/, robotics/, ai-agent-development/)
│   ├── agent-lee/ (conversational assistant UI)
│   ├── data/ (survey portal wrapped in AuthModal)
│   ├── mcp-dashboard/ (MCP monitoring interface)
│   ├── subscription/ (Stripe checkout flow)
│   ├── api/ (REST and edge routes for auth, AI, surveys, payments, MCP, website generator)
│   └── global-error.tsx, globals.css, layout.tsx
├── components/
│   ├── ui/ (design system primitives, animations, image optimization)
│   ├── data/ (survey forms, secure notices, intro content)
│   └── auth/ (modal + credential flows)
├── lib/
│   ├── feature-flags.ts, prisma.ts, surveyConfig.ts
│   ├── rag-service.ts, website-generator/, mcp/
│   └── database-analytics.ts, stripe-payments.ts
├── prisma/
│   └── schema.prisma (PostgreSQL schema for auth, contacts, surveys, analytics)
├── tests/
│   ├── api/, integration/, database/, e2e/
│   └── rag-service.test.ts (vector search coverage)
├── docs/, wiki/ (operational runbooks, deployment guides)
└── scripts/
    └── vercel-build.js (build orchestration fallback)
```

## Getting Started

1. **Prerequisites**
   - Node.js 18+
   - npm 9+ (pnpm/yarn also supported)
   - PostgreSQL database (Neon, Supabase, or self-hosted)
   - Accounts/API keys for OpenAI (or Azure), Anthropic, Mistral, DeepSeek, Stripe, Sentry, and Brave Search as needed.

2. **Install dependencies**
   ```bash
   npm install
   # prisma client is generated automatically via postinstall
   ```

3. **Environment variables** (create `.env.local`)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma.【F:prisma/schema.prisma†L1-L20】 |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | NextAuth session URLs and signing secret.【F:app/api/auth/[...nextauth]/route.ts†L1-L60】 |
| `OPENAI_API_KEY`, `OPENAI_ASSISTANT_ID`, `VOICE_PROMPT_ID`, `VECTOR_STORE_ID` | Core Agent Lee configuration and voice/vector capabilities.【F:app/api/agent-lee/route.ts†L93-L133】 |
| `ANTHROPIC_API_KEY`/`CLAUDE_API_KEY`, `MISTRAL_API_KEY`, `DEEPSEEK_API_KEY` | Optional AI providers surfaced in the Agent Lee selector.【F:app/api/agent-lee/route.ts†L93-L133】 |
| `BRAVE_SEARCH_API_KEY` | Enables Brave Search MCP lookups for up-to-date results.【F:app/api/agent-lee/route.ts†L93-L133】 |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Required for subscription checkout, portal, and webhook validation.【F:app/api/stripe/create-checkout-session/route.ts†L1-L80】【F:app/api/stripe/webhook/route.ts†L1-L120】 |
| `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `NEXT_PUBLIC_SENTRY_DSN` | Activate Sentry monitoring in all runtimes.【F:sentry.server.config.ts†L1-L120】 |
| `ENABLE_LEARNING_HUB`, `ENABLE_ADMIN_PAGES` | Optional feature flags for reviving the LMS or admin surfaces.【F:lib/feature-flags.ts†L1-L11】 |

4. **Database setup**
   ```bash
   npx prisma migrate dev
   npx prisma db seed # optional if seed script provided
   ```

5. **Run locally**
   ```bash
   npm run dev
   # visit http://localhost:3000
   ```

## Available Scripts

- `npm run dev` — start the development server.
- `npm run build` / `npm run start` — production build and serve.
- `npm run lint` — lint with ESLint config tuned for Next.js 14.
- `npm run test` / `npm run test:run` — Vitest watch or single run.
- `npm run test:unit`, `npm run test:api`, `npm run test:integration`, `npm run test:db`, `npm run test:rag` — focused test suites.
- `npm run test:e2e`, `npm run test:e2e:headed`, `npm run test:e2e:report`, `npm run test:perf` — Playwright regression and performance coverage.
- `npm run vercel-build` — production build helper that falls back to Prisma generate before running `next build`.

## Quality, Monitoring, and Safety

- **Sentry** captures client, server, and edge errors with release tracking, performance metrics, and replay sampling.【F:sentry.client.config.ts†L1-L160】【F:sentry.edge.config.ts†L1-L160】
- **RAG knowledge base** stores embeddings via OpenAI (configurable) and powers semantic retrieval during Agent Lee conversations.【F:app/api/agent-lee/route.ts†L1-L210】
- **Website generation sandbox** validates generated files for safety and exposes manual download/testing utilities.【F:app/test-website-generator/page.tsx†L1-L120】
- **Stripe event logging** ensures webhook verification before fulfilling subscription state changes.【F:app/api/stripe/webhook/route.ts†L1-L120】

## Additional Resources

- `docs/` and `wiki/` — deployment runbooks, troubleshooting, and feature-specific guides.
- `AUTH_SYSTEM_README.md`, `PRISMA-DATABASE.md`, `WEBSITE_GENERATION_SAFETY.md` — deep dives into authentication, database schema, and generation safeguards.

## Support

Reach out through the `/contact` form or the official NAVADA channels highlighted on the site for partnership or program inquiries.【F:app/contact/page.tsx†L1-L200】
