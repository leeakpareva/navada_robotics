# Getting Started

This guide will help you set up and run the NAVADA Robotics application locally for development or testing.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js**: Version 18.x or 20.x
- **npm**: Comes with Node.js (or use pnpm/yarn)
- **Git**: For version control

### Required Accounts & API Keys
- **OpenAI Account**: For AI assistant functionality
- **Stripe Account**: For payment processing (can use test mode)
- **Neon Database**: PostgreSQL database (or local PostgreSQL)
- **Vercel Account**: For deployment (optional for local development)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/leeakpareva/navada_robotics.git
cd navada_robotics
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Configure the following environment variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_ASSISTANT_ID=asst_your-assistant-id
VOICE_PROMPT_ID=your_voice_prompt_id_here
VECTOR_STORE_ID=vs_your-vector-store-id

# Anthropic Configuration
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Database Setup

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
navada_robotics/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   ├── admin/               # Admin dashboard
│   ├── agent-lee/           # AI assistant interface
│   ├── api/                 # API routes
│   ├── learning/            # Learning management
│   └── ...                  # Other pages
├── components/              # Reusable components
│   └── ui/                 # UI component library
├── lib/                    # Utility functions
├── prisma/                 # Database schema
├── tests/                  # Test files
├── .github/workflows/      # CI/CD configuration
└── wiki/                   # Documentation (this wiki)
```

## 🔧 Configuration Details

### OpenAI Setup

1. Create an OpenAI account at [platform.openai.com](https://platform.openai.com)
2. Generate an API key in the API section
3. Create an Assistant for Agent Lee functionality
4. Set up a Vector Store for knowledge management

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your test API keys from the Stripe dashboard
3. Configure webhook endpoints for subscription management
4. Set up products and pricing in your Stripe dashboard

### Database Setup

#### Option 1: Neon Database (Recommended)
1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

#### Option 2: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database for the project
3. Update `DATABASE_URL` with local connection details

### NextAuth Configuration

1. Generate a secret key: `openssl rand -base64 32`
2. Set `NEXTAUTH_SECRET` in your environment
3. Configure OAuth providers if needed (currently using credentials)

## 🧪 Running Tests

### Unit Tests
```bash
npm run test:unit
```

### End-to-End Tests
```bash
npm run test:e2e
```

### API Tests
```bash
npm run test:api
```

### All Tests
```bash
npm run test:all
```

## 📦 Building for Production

```bash
npm run build
npm run start
```

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### Database Connection Issues
- Check your `DATABASE_URL` format
- Ensure database is accessible
- Run `npx prisma db push` to sync schema

### API Key Issues
- Verify all API keys are correctly set
- Check for trailing spaces in environment variables
- Ensure keys have proper permissions

### Build Failures
- Clear Next.js cache: `rm -rf .next`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check the [Troubleshooting Guide](Troubleshooting) for specific errors

## 🔄 Development Workflow

1. **Create a new branch**: `git checkout -b feature/your-feature`
2. **Make changes**: Follow the coding standards
3. **Run tests**: `npm run test:all`
4. **Build check**: `npm run build`
5. **Commit changes**: Follow conventional commit format
6. **Push and create PR**: GitHub Actions will run CI

## 📚 Next Steps

- Explore the [API Reference](API-Reference) for backend development
- Check [Architecture](Architecture) to understand the system design
- Review [Development](Development) for coding guidelines
- Read [Deployment](Deployment) for production setup

## 🆘 Need Help?

- Check the [Troubleshooting](Troubleshooting) guide
- Look through [GitHub Issues](https://github.com/leeakpareva/navada_robotics/issues)
- Review the [FAQ](FAQ) section

---

*Having trouble? Create an issue on GitHub with detailed error messages and steps to reproduce.*