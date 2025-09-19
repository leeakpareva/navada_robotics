# Deployment Guide

Complete guide for deploying NAVADA Robotics to production environments.

## 🚀 Deployment Options

### Recommended: Vercel (Primary)
- **Zero-config deployment**
- **Automatic SSL certificates**
- **Global CDN**
- **Serverless functions**
- **Built-in CI/CD**

### Alternative Options
- **Netlify**: Similar to Vercel
- **Railway**: Full-stack platform
- **DigitalOcean**: Custom VPS setup
- **AWS**: Enterprise-grade infrastructure

## 🎯 Vercel Deployment (Recommended)

### Prerequisites
- GitHub repository
- Vercel account
- Environment variables ready

### Step 1: Connect Repository

1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Import Project"
4. Select your `navada_robotics` repository

### Step 2: Configure Build Settings

Vercel auto-detects Next.js projects, but verify these settings:

```bash
# Build Command
npm run build

# Output Directory
.next

# Install Command
npm install

# Development Command
npm run dev
```

### Step 3: Environment Variables

Add these environment variables in Vercel dashboard:

#### Required Variables
```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret

# OpenAI
OPENAI_API_KEY=sk-your-openai-key
OPENAI_ASSISTANT_ID=asst_your-assistant-id

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_your-publishable-key
STRIPE_SECRET_KEY=sk_live_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Application
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

#### Optional Variables
```env
# Anthropic (if using Claude)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Analytics
VERCEL_ANALYTICS_ID=your-analytics-id

# Email
EMAIL_ADMIN_KEY=your-email-admin-key

# MCP Servers
BRAVE_SEARCH_API_KEY=your-brave-api-key
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Vercel will provide a deployment URL

### Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatic

## 🔧 Production Configuration

### Database Setup

#### Neon Database (Recommended)
```bash
# 1. Create Neon project
# 2. Copy connection string
# 3. Add to Vercel environment variables
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require
```

#### Supabase Database
```bash
# Alternative PostgreSQL option
DATABASE_URL=postgresql://user:password@host.supabase.co/postgres
```

### Stripe Configuration

#### Production Keys
1. Switch to "Live" mode in Stripe dashboard
2. Get live API keys
3. Update Vercel environment variables
4. Configure webhooks for production domain

#### Webhook Setup
```bash
# Webhook endpoint
https://your-domain.vercel.app/api/stripe/webhook

# Events to listen for
- payment_intent.succeeded
- invoice.payment_succeeded
- customer.subscription.updated
- customer.subscription.deleted
```

### NextAuth Configuration

```bash
# Production URL
NEXTAUTH_URL=https://your-domain.vercel.app

# Generate secure secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

## 🔄 CI/CD Pipeline

Your repository includes GitHub Actions that run automatically:

### Build & Test Pipeline
```yaml
# .github/workflows/ci.yml
- Runs on push to main
- Tests on Node.js 18.x and 20.x
- Runs linting, type checking, tests
- Builds application
- Runs E2E tests
```

### Vercel Integration
- **Automatic deployments** on push to main
- **Preview deployments** for pull requests
- **Build logs** available in Vercel dashboard

## 🛡️ Security Configuration

### Environment Variables Security
- Never commit secrets to repository
- Use Vercel's encrypted environment variables
- Rotate keys regularly
- Use different keys for staging/production

### Database Security
```sql
-- Create read-only user for analytics
CREATE USER analytics_user WITH PASSWORD 'secure_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_user;

-- Enable SSL connections only
ALTER SYSTEM SET ssl = on;
```

### API Security
- Rate limiting configured in middleware
- CORS restrictions in place
- Authentication required for sensitive endpoints
- Input validation on all API routes

## 📊 Monitoring & Analytics

### Vercel Analytics
```bash
# Enable in Vercel dashboard
# Automatic page view tracking
# Performance metrics included
```

### Custom Analytics
```javascript
// Track custom events
await fetch('/api/analytics', {
  method: 'POST',
  body: JSON.stringify({
    event: 'course_completion',
    properties: { courseId, userId }
  })
});
```

### Error Monitoring
- Console errors logged in Vercel
- Database errors tracked
- API errors with stack traces
- Performance monitoring included

## 🔧 Advanced Configuration

### Custom Build Process

Create `vercel.json` for advanced configuration:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store, max-age=0"
        }
      ]
    }
  ]
}
```

### Edge Runtime Configuration

For optimal performance:

```typescript
// app/api/some-route/route.ts
export const runtime = 'edge';
export const preferredRegion = 'iad1';
```

## 🌍 Multi-Region Deployment

### Global Distribution
```bash
# Configure regions in vercel.json
"regions": ["iad1", "sfo1", "lhr1"]

# Edge functions for global performance
export const config = {
  runtime: 'edge',
  regions: ['iad1', 'sfo1', 'lhr1']
}
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Database migrations complete
- [ ] Tests passing locally
- [ ] Build successful locally
- [ ] Stripe webhooks configured
- [ ] Domain DNS configured (if custom domain)

### Post-Deployment
- [ ] Application loads correctly
- [ ] Database connections working
- [ ] Authentication functioning
- [ ] Payment processing working
- [ ] API endpoints responding
- [ ] Analytics tracking
- [ ] Error monitoring active

### Production Testing
- [ ] User registration/login
- [ ] Course enrollment
- [ ] Payment processing
- [ ] AI assistant functionality
- [ ] Video streaming
- [ ] Mobile responsiveness

## 🚨 Rollback Strategy

### Quick Rollback
1. Go to Vercel dashboard
2. Find previous deployment
3. Click "Promote to Production"
4. Instant rollback (usually < 30 seconds)

### Database Rollback
```bash
# If database changes need rollback
npx prisma migrate reset
npx prisma db push
```

## 🔍 Troubleshooting Deployment

### Common Issues

#### Build Failures
```bash
# Check build logs in Vercel
# Common fixes:
- npm run build locally first
- Check TypeScript errors
- Verify environment variables
```

#### Database Connection Issues
```bash
# Verify connection string
# Check firewall settings
# Ensure SSL mode if required
```

#### Environment Variable Issues
```bash
# Check variable names (case sensitive)
# Verify no trailing spaces
# Ensure all required variables set
```

### Debug Tools
```bash
# Vercel CLI
npm i -g vercel
vercel logs

# Local production build
npm run build
npm run start
```

## 📈 Performance Optimization

### Build Optimization
- Bundle analysis with `@next/bundle-analyzer`
- Image optimization with Next.js Image component
- Code splitting automatically handled
- CSS optimization with Tailwind

### Runtime Optimization
- Edge runtime for API routes
- Static generation where possible
- Incremental Static Regeneration (ISR)
- CDN caching strategies

## 🔄 Staging Environment

### Setup Staging
1. Create separate Vercel project
2. Connect to `develop` branch
3. Use test environment variables
4. Different database instance

### Staging Workflow
```bash
# Development → Staging → Production
develop branch → staging.domain.com
main branch → production.domain.com
```

---

*Deployment guide last updated: September 2025*