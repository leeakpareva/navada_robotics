# Vercel Automatic Deployment Setup

This repository is configured for automatic deployment to Vercel production on every push to the `main` branch.

## Required GitHub Secrets

To enable automatic deployments, you need to add the following secrets to your GitHub repository:

### 1. Get your Vercel Token
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it (e.g., "GitHub Actions Deploy")
4. Copy the token

### 2. Add Secrets to GitHub
Go to your repository settings: https://github.com/leeakpareva/navada_robotics/settings/secrets/actions

Add these secrets:

1. **VERCEL_TOKEN**
   - Value: Your Vercel token from step 1

2. **VERCEL_ORG_ID**
   - Value: `team_59KUg0Mwb0cL3fOCUVYwbskp`

3. **VERCEL_PROJECT_ID**
   - Value: `prj_fzZhsgSYHbYeON1ISsJPJZ9N9wTU`

## How It Works

1. **Automatic Deployment**: Every push to `main` branch triggers deployment
2. **Build Process**: Uses Vercel's build system with your custom build script
3. **Production URL**: Deploys to https://www.navadarobotics.com
4. **Notifications**: Comments on commits with deployment URL

## Manual Deployment

If you need to manually deploy:

```bash
# Using Vercel CLI
npx vercel --prod

# Or trigger GitHub Action manually
# Go to Actions tab > Vercel Production Deployment > Run workflow
```

## Deployment Status

- Check GitHub Actions: https://github.com/leeakpareva/navada_robotics/actions
- View Vercel Dashboard: https://vercel.com/leeakparevas-projects/navada-robotics

## Troubleshooting

If deployments fail:
1. Check GitHub Actions logs
2. Verify all secrets are set correctly
3. Ensure `vercel.json` is valid
4. Check Vercel dashboard for errors

## Custom Domain

The production deployment automatically serves at:
- https://www.navadarobotics.com (primary)
- https://navadarobotics.com (redirects to www)