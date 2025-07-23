# Deployment Guide - ActoGraph Pro

This guide explains how to deploy ActoGraph Pro to Vercel with Supabase backend.

## Prerequisites

1. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)  
3. **GitHub Repository** - Fork or clone this repository

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a project name, database password, and region
3. Wait for the project to be fully provisioned (2-3 minutes)

### 2. Configure Supabase Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Run the SQL script from `saas/supabase-setup.sql`
3. This will create all necessary tables and security policies

### 3. Get Supabase Keys

From your Supabase project **Settings > API**:
- Copy the **Project URL** 
- Copy the **anon/public key**
- Copy the **service_role key** (for admin operations)

### 4. Deploy to Vercel

#### Option A: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJulientalbot%2Fclone_actograph)

#### Option B: Manual Deploy

1. Connect your GitHub account to Vercel
2. Import the repository
3. Vercel will automatically detect it's a Next.js project

### 5. Configure Environment Variables

In your Vercel project settings, go to **Environment Variables** and add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

⚠️ **Important**: Without these variables, the build will fail.

### 6. Redeploy

After adding environment variables:
1. Go to **Deployments** tab in Vercel
2. Click **Redeploy** on the latest deployment
3. The build should now succeed

## Verification

Once deployed successfully:

1. Visit your Vercel URL
2. You should see the ActoGraph Pro landing page
3. Try signing up for an account
4. Login and access the dashboard

## Troubleshooting

### Build Fails with Supabase Error
- **Cause**: Missing environment variables
- **Solution**: Add all required environment variables in Vercel settings

### Authentication Not Working
- **Cause**: Incorrect Supabase URL or keys
- **Solution**: Double-check your Supabase project settings

### Database Errors
- **Cause**: Database tables not created
- **Solution**: Run the `supabase-setup.sql` script in your Supabase SQL Editor

### Static Generation Errors
- **Cause**: Server components trying to access environment variables during build
- **Solution**: Environment variables are now set with fallbacks for build-time

## Production Considerations

### Security
- Enable Row Level Security (RLS) on all tables ✅ (Already configured)
- Use service role key only for admin operations ✅
- Never expose service role key to client-side ✅

### Performance
- Enable Supabase Edge Functions for better performance
- Configure CDN for static assets
- Monitor database performance in Supabase dashboard

### Monitoring
- Set up Vercel Analytics
- Monitor Supabase usage and quotas
- Configure error tracking (Sentry recommended)

## Support

If you encounter issues:

1. Check the Vercel build logs
2. Verify all environment variables are set correctly
3. Ensure Supabase project is active and configured
4. Review this deployment guide

For additional help, create an issue in the GitHub repository.