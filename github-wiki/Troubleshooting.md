# Troubleshooting Guide

Common issues and solutions for NAVADA Robotics development and deployment.

## 🚨 Build Issues

### Build Fails with TypeScript Errors

**Error**:
```
Type error: Property 'X' does not exist on type 'Y'
```

**Solutions**:
```bash
# 1. Check TypeScript configuration
npx tsc --noEmit

# 2. Update type definitions
npm update @types/node @types/react @types/react-dom

# 3. Clear Next.js cache
rm -rf .next
npm run build

# 4. Check for missing imports
# Ensure all components are properly imported
```

### ESLint Configuration Issues

**Error**:
```
Invalid Options: Unknown options: useEslintrc
```

**Solution**:
```bash
# Update to latest ESLint configuration
npm install eslint@^8.57.0 --save-dev

# Use legacy .eslintrc.json instead of flat config
# Check .eslintrc.json exists with proper configuration
```

### Vercel Build Failures

**Error**:
```
Command "npm run vercel-build" exited with 1
```

**Solution**:
```bash
# 1. Check last working build
git log --oneline

# 2. Compare configurations
git diff <last-working-commit>..HEAD

# 3. Revert to working configuration
git checkout <last-working-commit> -- vercel.json next.config.mjs

# 4. Ensure proper environment variables in Vercel
```

**Reference**: See [Build Troubleshooting](https://github.com/leeakpareva/navada_robotics#build-troubleshooting) in README

## 🗄️ Database Issues

### Database Connection Failures

**Error**:
```
Error: P1001: Can't reach database server
```

**Solutions**:
```bash
# 1. Check DATABASE_URL format
postgresql://user:password@host:port/database?sslmode=require

# 2. Verify database is running
pg_isready -h your-host -p 5432

# 3. Check firewall/network access
telnet your-host 5432

# 4. Regenerate Prisma client
npx prisma generate
npx prisma db push
```

### Prisma Migration Issues

**Error**:
```
Error: Schema drift detected
```

**Solutions**:
```bash
# 1. Reset database (DANGER: loses data)
npx prisma migrate reset

# 2. Push schema without migration
npx prisma db push

# 3. Create new migration
npx prisma migrate dev --name fix-schema-drift

# 4. Generate client after schema changes
npx prisma generate
```

### Database Performance Issues

**Symptoms**:
- Slow query responses
- Connection timeouts
- High CPU usage

**Solutions**:
```sql
-- 1. Add database indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_courses_category ON courses(category);

-- 2. Optimize queries
EXPLAIN ANALYZE SELECT * FROM courses WHERE category = 'ai';

-- 3. Enable connection pooling
-- In DATABASE_URL: ?connection_limit=10&pool_timeout=20
```

## 🔐 Authentication Issues

### NextAuth Session Problems

**Error**:
```
[next-auth][error][SIGNIN_EMAIL_ERROR]
```

**Solutions**:
```bash
# 1. Check NEXTAUTH_SECRET is set
echo $NEXTAUTH_SECRET

# 2. Verify NEXTAUTH_URL matches domain
NEXTAUTH_URL=https://your-domain.com

# 3. Clear browser cookies and localStorage
# In browser DevTools: Application → Storage → Clear All

# 4. Check database user table schema
npx prisma studio
```

### API Authentication Failures

**Error**:
```
401 Unauthorized
```

**Solutions**:
```typescript
// 1. Check session in API route
import { getServerSession } from "next-auth"
const session = await getServerSession(authOptions)

// 2. Verify API key format
const apiKey = request.headers.get('authorization')?.replace('Bearer ', '')

// 3. Check CORS settings
// Ensure origin is allowed in middleware
```

## 🤖 AI Integration Issues

### OpenAI API Errors

**Error**:
```
RateLimitError: Rate limit exceeded
```

**Solutions**:
```typescript
// 1. Implement retry logic
const retryWithBackoff = async (fn, retries = 3) => {
  try {
    return await fn()
  } catch (error) {
    if (retries > 0 && error.status === 429) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return retryWithBackoff(fn, retries - 1)
    }
    throw error
  }
}

// 2. Check API key permissions
// Ensure key has sufficient quota and permissions

// 3. Implement request queuing
const queue = new PQueue({ concurrency: 1, interval: 1000 })
```

### Assistant API Issues

**Error**:
```
Assistant not found or inactive
```

**Solutions**:
```typescript
// 1. Verify assistant ID
const assistant = await openai.beta.assistants.retrieve(assistantId)

// 2. Check assistant configuration
// Ensure tools and functions are properly configured

// 3. Create new assistant if needed
const assistant = await openai.beta.assistants.create({
  name: "Agent Lee",
  instructions: "You are Agent Lee...",
  tools: [{ type: "code_interpreter" }],
  model: "gpt-4-turbo-preview"
})
```

## 💳 Payment Issues

### Stripe Integration Problems

**Error**:
```
No such price: 'price_xxx'
```

**Solutions**:
```bash
# 1. Check Stripe dashboard for price ID
# Verify price exists and is active

# 2. Use lookup_key instead of price ID
const prices = await stripe.prices.list({
  lookup_keys: ['monthly_subscription']
})

# 3. Check Stripe API keys
# Ensure using correct keys (test vs live)
```

### Webhook Verification Failures

**Error**:
```
400 Webhook signature verification failed
```

**Solutions**:
```typescript
// 1. Check webhook secret
const sig = request.headers.get('stripe-signature')
const payload = await request.text()

// 2. Verify endpoint URL in Stripe
// Should be: https://your-domain.com/api/stripe/webhook

// 3. Check content-type
// Ensure raw body is used, not parsed JSON
```

## 🎥 Video Streaming Issues

### YouTube Embed Problems

**Error**:
```
Video unavailable or won't play
```

**Solutions**:
```typescript
// 1. Check video URL format
const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|embed\/|watch\?v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match?.[2]?.length === 11 ? match[2] : null
}

// 2. Update iframe parameters
const embedUrl = `https://www.youtube.com/embed/${videoId}?
  enablejsapi=1&controls=1&modestbranding=1&rel=0&playsinline=1`

// 3. Check for CORS issues
// Add origin parameter to embed URL
```

### Video Performance Issues

**Symptoms**:
- Slow loading
- Buffering problems
- App lag during video playback

**Solutions**:
```typescript
// 1. Implement lazy loading
const [isInView, setIsInView] = useState(false)
useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) setIsInView(true)
  })
  observer.observe(containerRef.current)
}, [])

// 2. Use optimized iframe parameters
// Remove autoplay, add loading="lazy"

// 3. Implement click-to-load for performance
// Show thumbnail first, load iframe on click
```

## 🌐 Environment Issues

### Environment Variables Not Loading

**Error**:
```
process.env.VARIABLE_NAME is undefined
```

**Solutions**:
```bash
# 1. Check file naming
# Must be .env.local (not .env)

# 2. Restart development server
npm run dev

# 3. Check variable naming
# Client-side variables need NEXT_PUBLIC_ prefix

# 4. Verify no trailing spaces
# Use quotes for values with spaces
DATABASE_URL="postgresql://user:password@host/db"
```

### CORS Issues

**Error**:
```
CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solutions**:
```typescript
// 1. Update middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  return response
}

// 2. Check API route headers
return NextResponse.json(data, {
  headers: {
    'Access-Control-Allow-Origin': '*',
  }
})
```

## 📱 Mobile Issues

### Mobile Layout Problems

**Symptoms**:
- UI elements overlapping
- Touch events not working
- Performance issues

**Solutions**:
```css
/* 1. Fix viewport meta tag */
<meta name="viewport" content="width=device-width, initial-scale=1" />

/* 2. Fix touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* 3. Optimize for mobile performance */
.mobile-optimized {
  transform: translateZ(0); /* Enable hardware acceleration */
  will-change: transform;
}
```

### iOS Safari Issues

**Common Problems**:
- Video autoplay blocked
- 100vh issues
- Touch scroll problems

**Solutions**:
```css
/* Fix 100vh on mobile */
.full-height {
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height */
}

/* Fix iOS touch scrolling */
.scrollable {
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}
```

## 🔧 Development Issues

### Hot Reload Not Working

**Symptoms**:
- Changes not reflecting
- Need to manually refresh

**Solutions**:
```bash
# 1. Clear Next.js cache
rm -rf .next

# 2. Check file watching limits (Linux/Mac)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf

# 3. Restart development server
npm run dev

# 4. Check for naming conflicts
# Ensure no duplicate component names
```

### TypeScript Intellisense Issues

**Solutions**:
```bash
# 1. Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"

# 2. Check tsconfig.json paths
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# 3. Update TypeScript
npm update typescript
```

## 🚀 Performance Issues

### Slow Build Times

**Solutions**:
```bash
# 1. Enable SWC minification
# In next.config.js
swcMinify: true

# 2. Optimize imports
# Use dynamic imports for large components
const HeavyComponent = dynamic(() => import('./HeavyComponent'))

# 3. Check bundle size
npm run build
npx @next/bundle-analyzer
```

### Runtime Performance Issues

**Solutions**:
```typescript
// 1. Implement proper memoization
const MemoizedComponent = React.memo(Component)
const memoizedValue = useMemo(() => expensiveCalculation(a, b), [a, b])

// 2. Use proper loading states
const [loading, setLoading] = useState(false)

// 3. Implement virtual scrolling for long lists
// Use libraries like react-window or react-virtualized
```

## 🔍 Debugging Tools

### Local Debugging

```bash
# 1. Enable debug mode
DEBUG=* npm run dev

# 2. Check database queries
# Add to .env.local
DATABASE_URL="postgresql://...?log=query"

# 3. API debugging
# Add console.log statements in API routes
console.log('API Request:', req.method, req.url)
```

### Production Debugging

```bash
# 1. Check Vercel logs
vercel logs --follow

# 2. Database monitoring
# Use database provider's monitoring tools

# 3. Error tracking
# Implement Sentry or similar service
```

## 📞 Getting Help

### When to Create an Issue

1. **Bug Reports**: Include error messages, steps to reproduce
2. **Feature Requests**: Describe use case and expected behavior
3. **Documentation**: Request clarification or improvements

### Issue Template

```markdown
## Bug Report

**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Environment**
- OS: [e.g. macOS, Windows, Linux]
- Node.js version: [e.g. 18.17.0]
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. v0.1.0]

**Additional context**
Add any other context about the problem here.
```

### Community Resources

- **GitHub Discussions**: General questions and discussions
- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: This wiki and README
- **Code Examples**: Check the codebase for implementation patterns

---

*Troubleshooting guide last updated: September 2025*