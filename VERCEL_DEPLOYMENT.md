# Deploying EpicEsports to Vercel

## Pre-Deployment Steps

1. **Update Environment Variables**
   - Ensure you have set up a production MongoDB database (MongoDB Atlas recommended)
   - Update the `.env` file with the production MongoDB URI
   - Ensure all other environment variables are correctly set

2. **Prepare for Deployment**
   - Make sure all dependencies are correctly installed
   - Run `npm run build` locally to verify everything builds correctly

## Deployment Options

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy the project:
   ```
   vercel
   ```

4. Follow the interactive prompts:
   - When asked to link to an existing project, select "N" to create a new one
   - When asked for environment variables, make sure to input your production values

### Option 2: Using Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "Add New..." > "Project"

4. Import your Git repository

5. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./epicesports-production

6. Add Environment Variables:
   - Copy all variables from `.env` file
   - Make sure to update MONGODB_URI to a production database
   - Update NEXTAUTH_URL to match your Vercel deployment URL

7. Click "Deploy"

## Post-Deployment

1. After deployment, check the provided Vercel URL to verify your site is working

2. Set up a custom domain if needed in the Vercel Dashboard > Project Settings > Domains

3. Monitor your application in the Vercel Dashboard 