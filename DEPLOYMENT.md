# Deployment Guide - Finance Tracker

This guide will walk you through deploying your Finance Tracker application to Vercel.

## Prerequisites

- ✅ All code is committed to git
- GitHub account (create one at https://github.com if you don't have one)
- Vercel account (you can sign up with your GitHub account at https://vercel.com)

## Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface

1. Go to https://github.com/new
2. Repository name: `finance-tracker`
3. Description: "Business finance management system with Google Sheets integration"
4. Visibility: **Private** (recommended for business app) or Public
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Option B: Using GitHub CLI (if you have it installed)

```bash
gh repo create finance-tracker --private --source=. --remote=origin
```

## Step 2: Push Code to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/finance-tracker.git

# Push all commits to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Deploy to Vercel

### 3.1 Sign Up / Sign In to Vercel

1. Go to https://vercel.com
2. Click "Sign Up" or "Log In"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### 3.2 Import Your Project

1. On Vercel dashboard, click "Add New..." → "Project"
2. You'll see a list of your GitHub repositories
3. Find `finance-tracker` and click "Import"
4. Vercel will automatically detect it's a Next.js project

### 3.3 Configure Project

**Framework Preset**: Next.js (auto-detected)
**Root Directory**: `./` (leave as default)
**Build Command**: `npm run build` (default)
**Output Directory**: `.next` (default)

### 3.4 Add Environment Variables

Click on "Environment Variables" and add the following:

#### Required Variables:

```
GOOGLE_CLIENT_ID
```
Value: Your Google OAuth Client ID from Google Cloud Console

```
GOOGLE_CLIENT_SECRET
```
Value: Your Google OAuth Client Secret from Google Cloud Console

```
GOOGLE_SHEETS_SPREADSHEET_ID
```
Value: Your Google Spreadsheet ID (from the sheet URL)

```
NEXTAUTH_SECRET
```
Value: Generate a new secret with: `openssl rand -base64 32`
Or use this one-liner to generate it in terminal and copy it

```
NEXTAUTH_URL
```
Value: Will be your Vercel URL (you can add this after deployment)
For now, you can leave it blank or use a placeholder

**Important**: Make sure all variables are added to the **Production** environment

### 3.5 Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. This typically takes 2-3 minutes
4. You'll see build logs in real-time

### 3.6 Update NEXTAUTH_URL

After deployment:

1. Vercel will provide you a URL like: `https://finance-tracker-xxx.vercel.app`
2. Go to Vercel dashboard → Your Project → Settings → Environment Variables
3. Edit `NEXTAUTH_URL` and set it to your production URL
4. Redeploy the application (Settings → Deployments → Click ⋯ on latest → Redeploy)

## Step 4: Update Google Cloud OAuth Settings

### 4.1 Add Production Redirect URI

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" → "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Under "Authorized redirect URIs", add:
   ```
   https://your-vercel-url.vercel.app/api/auth/callback/google
   ```
6. Replace `your-vercel-url` with your actual Vercel URL
7. Click "Save"

### 4.2 Update OAuth Consent Screen (if needed)

1. Go to "OAuth consent screen"
2. Add your production domain to "Authorized domains" if required
3. Save changes

## Step 5: Test Your Deployment

1. Visit your Vercel URL: `https://finance-tracker-xxx.vercel.app`
2. Click "Sign in with Google"
3. Authorize the application
4. Test creating a transaction, client, and invoice
5. Verify data is being saved to your Google Sheet

## Step 6: Configure Custom Domain (Optional)

If you have a custom domain:

1. Go to Vercel dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `finance.yourdomain.com`)
3. Follow Vercel's DNS configuration instructions
4. Update `NEXTAUTH_URL` to your custom domain
5. Update Google OAuth redirect URI to use custom domain
6. Redeploy

## Troubleshooting

### Build Fails

**Error**: "Type error" during build
- Check TypeScript errors locally: `npm run build`
- Fix any type errors before deploying

**Error**: Missing dependencies
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

### OAuth Errors After Deployment

**Error**: "Redirect URI mismatch"
- Verify the redirect URI in Google Cloud Console matches exactly
- Format: `https://your-vercel-url.vercel.app/api/auth/callback/google`
- No trailing slash

**Error**: "Invalid client"
- Double-check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Vercel
- Make sure there are no extra spaces or newlines

### Data Not Saving

**Error**: "Failed to save transaction/client/invoice"
- Verify `GOOGLE_SHEETS_SPREADSHEET_ID` is correct
- Ensure your Google Sheet is shared with your Google account (the one you sign in with)
- Check that Google Sheets API is enabled in Google Cloud Console

### Session Errors

**Error**: "No session" or constant redirects
- Verify `NEXTAUTH_SECRET` is set and is a strong random string
- Verify `NEXTAUTH_URL` matches your production domain exactly
- Try generating a new `NEXTAUTH_SECRET`

## Environment Variables Checklist

Before deploying, make sure you have:

- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud OAuth 2.0 Client
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud OAuth 2.0 Client
- [ ] `GOOGLE_SHEETS_SPREADSHEET_ID` - From Google Sheets URL
- [ ] `NEXTAUTH_SECRET` - Generated with `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` - Your production Vercel URL

## Post-Deployment

### Monitor Your Application

1. **Vercel Analytics**: Enable analytics in Vercel dashboard to track usage
2. **Error Monitoring**: Check Vercel logs for any runtime errors
3. **Performance**: Monitor build times and function execution

### Continuous Deployment

After initial deployment, Vercel automatically:
- Deploys on every push to `main` branch
- Creates preview deployments for pull requests
- Runs builds in an isolated environment

To deploy new changes:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically detect the push and deploy!

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files to git
2. **Google Sheet Sharing**: Only share with users who need access
3. **OAuth Scopes**: Review requested scopes periodically
4. **Access Control**: Consider adding role-based permissions in future
5. **HTTPS**: Vercel provides HTTPS by default - always use it

## Backup Strategy

Your data is stored in Google Sheets, which provides:
- **Version History**: View and restore previous versions
- **Automatic Backups**: Google handles backups
- **Export Options**: Download as Excel/CSV anytime

Consider setting up regular exports for critical data.

## Need Help?

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Google Cloud Support**: https://console.cloud.google.com/support

## Success! 🎉

Once deployed, you'll have:
- ✅ Production finance tracker accessible from anywhere
- ✅ Automatic HTTPS and CDN
- ✅ Automatic deployments on git push
- ✅ Professional business finance management system

Your finance tracker is now live and ready to use!
