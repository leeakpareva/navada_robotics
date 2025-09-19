#!/usr/bin/env node

const { execSync } = require('child_process');

function runCommand(command, description) {
  console.log(`\n🔨 ${description}...`);
  try {
    execSync(command, {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        SKIP_VALIDATION: 'true',
        CI: 'true'
      }
    });
    console.log(`✅ ${description} completed successfully`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    console.error('Error details:', error.toString());
    process.exit(1);
  }
}

console.log('🚀 Starting Vercel build process...');
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  SKIP_VALIDATION: process.env.SKIP_VALIDATION,
  CI: process.env.CI
});

// Generate Prisma client
runCommand('prisma generate', 'Prisma client generation');

// Build Next.js application
runCommand('next build', 'Next.js application build');

console.log('🎉 Vercel build completed successfully!');