# Deploying to Vercel Using the Dashboard

Since you encountered build issues with the Vercel CLI, here's a step-by-step guide to deploy using the Vercel Dashboard:

## Step 1: Prepare Your Repository

If your code is not already in a Git repository (GitHub, GitLab, or Bitbucket):
1. Create a new repository on GitHub/GitLab/Bitbucket
2. Initialize Git in your project folder if not already done:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Add your remote repository:
   ```
   git remote add origin <your-repository-url>
   ```
4. Push your code:
   ```
   git push -u origin main
   ```

## Step 2: Log in to Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Log in with your account (GitHub, GitLab, or Bitbucket)

## Step 3: Import Your Project

1. Click "Add New..." > "Project"
2. Select your Git provider and repository
3. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./  (or the directory containing your Next.js app)

## Step 4: Configure Environment Variables

This is the most important step to use your .env.local data:

1. Scroll down to the "Environment Variables" section
2. Add the following variables from your .env.local:

```
# NextAuth Configuration
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# MongoDB
MONGODB_URI=[YOUR_PRODUCTION_MONGODB_URI]
MONGODB_DB=epicesports
MONGODB_CONNECT_TIMEOUT=30000
MONGODB_SOCKET_TIMEOUT=45000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xbmfrgpaodddvavuclms.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibWZyZ3Bhb2RkZHZhdnVjbG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MTkxMTEsImV4cCI6MjA1OTk5NTExMX0.L8SAmjGN1kdyCjzxpBMUUN2XVc6KQYPJlxG59PZzjOg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibWZyZ3Bhb2RkZHZhdnVjbG1zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDQxOTExMSwiZXhwIjoyMDU5OTk1MTExfQ.Yhi964yfrGm1Ch7KAwjrjk--SGN2HHuUbRU3-AzrOq8
```

**IMPORTANT NOTES:**
- Replace `[YOUR_PRODUCTION_MONGODB_URI]` with a cloud MongoDB URI (like MongoDB Atlas)
- Update `NEXTAUTH_URL` to match your Vercel deployment URL (not localhost)

## Step 5: Deploy

1. Click "Deploy"
2. Wait for the build and deployment process to complete
3. Once done, you'll get a deployment URL like: `https://your-project-name.vercel.app`

## Step 6: Verify Deployment

1. Open your deployment URL in a browser
2. Test functionality to ensure everything is working correctly
3. Check that database connections are working properly

## Step 7: Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Navigate to "Settings" > "Domains"
3. Add your custom domain and follow the instructions to set up DNS

## Troubleshooting

If you encounter deployment issues:

1. Check the build logs in Vercel Dashboard
2. Verify that your environment variables are correctly set
3. Make sure your MongoDB URI is accessible from Vercel's servers
4. Check for any other dependency or configuration issues 