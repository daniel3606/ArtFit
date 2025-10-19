# ArtFit Deployment Guide - Render + AWS S3

Complete guide to deploy your Django backend to Render with AWS S3 for media storage, and frontend to Vercel.

## Architecture

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Vercel    │──────▶│    Render    │──────▶│  Render DB   │       │    AWS S3    │
│  (Frontend) │       │  (Backend)   │       │ (PostgreSQL) │       │(Media Files) │
└─────────────┘       └──────────────┘       └──────────────┘       └──────────────┘
```

## Part 1: AWS S3 Setup (15 minutes)

### Step 1.1: Create AWS Account
1. Go to https://aws.amazon.com
2. Sign up for a free account (includes 5GB free S3 storage)
3. Verify your email and add payment method

### Step 1.2: Create S3 Bucket

1. **Go to S3 Console**: https://s3.console.aws.amazon.com
2. **Click "Create bucket"**
3. **Configure bucket:**
   - **Bucket name**: `artfit-media` (must be globally unique, add random numbers if taken)
   - **Region**: `us-east-1` (or your preferred region)
   - **Object Ownership**: ACLs enabled
   - **Block Public Access**: UNCHECK all boxes (we need public read access)
   - **Bucket Versioning**: Disabled (optional)
   - **Encryption**: Server-side encryption with Amazon S3 managed keys (SSE-S3)
   - Click **Create bucket**

4. **Configure CORS**:
   - Go to your bucket → **Permissions** tab
   - Scroll to **Cross-origin resource sharing (CORS)**
   - Click **Edit** and paste:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "POST", "PUT", "DELETE", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```

5. **Configure Bucket Policy**:
   - Go to **Permissions** tab → **Bucket policy**
   - Click **Edit** and paste (replace `artfit-media` with your bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::artfit-media/*"
        }
    ]
}
```

### Step 1.3: Create IAM User for Django

1. **Go to IAM Console**: https://console.aws.amazon.com/iam/
2. **Click "Users"** → **"Add users"**
3. **User details:**
   - User name: `artfit-django`
   - Access type: ✓ Access key - Programmatic access
   - Click **Next**

4. **Set permissions:**
   - Click **Attach existing policies directly**
   - Search for `AmazonS3FullAccess`
   - ✓ Check the box
   - Click **Next** → **Next** → **Create user**

5. **Save credentials** (IMPORTANT - shown only once):
   ```
   Access Key ID: AKIA...
   Secret Access Key: wJalr...
   ```
   **Copy these! You'll need them for Render.**

### Step 1.4: Test S3 Access (Optional)

Test that your bucket is working:
```bash
# Install AWS CLI (optional)
pip install awscli

# Configure AWS CLI
aws configure
# Enter your Access Key ID and Secret Access Key

# Test upload
echo "test" > test.txt
aws s3 cp test.txt s3://artfit-media/test.txt

# Verify it's accessible
curl https://artfit-media.s3.amazonaws.com/test.txt
```

---

## Part 2: Render Backend Deployment (20 minutes)

### Step 2.1: Prepare Repository

1. **Commit all changes**:
```bash
cd /Users/daniel/Documents/Coding/ArtFit
git add .
git commit -m "Prepare for Render deployment with S3 support"
git push origin main
```

2. **Ensure your repo is on GitHub/GitLab**

### Step 2.2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub/GitLab
3. Verify your email

### Step 2.3: Create PostgreSQL Database

1. **In Render Dashboard**, click **"New +"** → **"PostgreSQL"**
2. **Configure database:**
   - Name: `artfit-db`
   - Database: `artfit`
   - User: `artfit` (auto-generated)
   - Region: `Ohio (US East)` (or nearest to you)
   - PostgreSQL Version: `15`
   - Plan: **Free** (0.1GB RAM, 1GB storage)
3. **Click "Create Database"**
4. **Wait 2-3 minutes** for provisioning
5. **Copy the Internal Database URL** (starts with `postgres://`)

### Step 2.4: Create Web Service

1. **In Render Dashboard**, click **"New +"** → **"Web Service"**
2. **Connect your repository** (authorize GitHub if needed)
3. **Select your repository**: `ArtFit`

4. **Configure service:**
   - **Name**: `artfit-backend`
   - **Region**: Same as database (`Ohio (US East)`)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn artfit.wsgi:application`
   - **Plan**: **Free** (512MB RAM)

5. **Advanced Settings** - Add Environment Variables:

Click **"Add Environment Variable"** for each:

```bash
# Django Settings
DEBUG=0
SECRET_KEY=your-super-secret-key-change-this-to-something-random
ALLOWED_HOSTS=artfit-backend.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Database (use Internal Database URL from Step 2.3)
DATABASE_URL=postgres://artfit:password@dpg-xxx.oregon-postgres.render.com/artfit

# AWS S3 Credentials
USE_S3=True
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJalr...
AWS_STORAGE_BUCKET_NAME=artfit-media
AWS_S3_REGION_NAME=us-east-1

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Python Version
PYTHON_VERSION=3.12.0
```

6. **Click "Create Web Service"**

### Step 2.5: Monitor Deployment

1. Watch the **Logs** tab for build progress
2. Build takes ~5-10 minutes
3. Look for: `Your service is live 🎉`
4. Your backend will be at: `https://artfit-backend.onrender.com`

### Step 2.6: Create Superuser

After deployment succeeds:

1. Go to **Shell** tab in Render dashboard
2. Run:
```bash
python manage.py createsuperuser
```
3. Follow prompts to create admin user

---

## Part 3: Frontend Deployment to Vercel (10 minutes)

### Step 3.1: Configure Frontend

1. Create `frontend/.env.production`:
```bash
VITE_API_BASE=https://artfit-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

2. Update CORS in Render:
   - Go to Render dashboard → Your web service → Environment
   - Update `CORS_ALLOWED_ORIGINS` to: `https://your-app.vercel.app`
   - Click **Save Changes** (will redeploy)

### Step 3.2: Deploy to Vercel

1. **Push changes**:
```bash
git add frontend/.env.production
git commit -m "Add production environment config"
git push origin main
```

2. **Go to Vercel**: https://vercel.com
3. **Sign up/Login** with GitHub
4. **Click "Add New Project"**
5. **Import your repository**: `ArtFit`

6. **Configure project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

7. **Environment Variables** (click "Add"):
```bash
VITE_API_BASE=https://artfit-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

8. **Click "Deploy"**

9. **Wait 2-3 minutes** for deployment

10. **Your frontend will be at**: `https://your-app.vercel.app`

### Step 3.3: Update Backend CORS (Again)

Now that you have the real Vercel URL:

1. Go to Render → artfit-backend → Environment
2. Update `CORS_ALLOWED_ORIGINS`:
```bash
CORS_ALLOWED_ORIGINS=https://your-actual-app.vercel.app
```
3. Also update `ALLOWED_HOSTS`:
```bash
ALLOWED_HOSTS=artfit-backend.onrender.com,your-custom-domain.com
```
4. Click **Save Changes**

---

## Part 4: Google OAuth Update (5 minutes)

Update your Google Cloud Console:

1. Go to https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. **Add Authorized JavaScript origins**:
   - `https://your-app.vercel.app`
4. **Add Authorized redirect URIs** (if needed):
   - `https://your-app.vercel.app`
5. Click **Save**

---

## Part 5: Testing (10 minutes)

### Test Backend

1. **API Health Check**:
```bash
curl https://artfit-backend.onrender.com/api/accounts/me/
# Should return: {"detail":"Authentication credentials were not provided."}
```

2. **Admin Panel**:
   - Visit: `https://artfit-backend.onrender.com/admin`
   - Login with superuser credentials
   - Should see Django admin

3. **S3 Media Upload Test**:
   - In admin, go to Users
   - Edit a user → Upload avatar
   - Save
   - Image should upload to S3
   - Verify URL is: `https://artfit-media.s3.amazonaws.com/avatars/...`

### Test Frontend

1. **Visit your Vercel app**: `https://your-app.vercel.app`
2. **Test Registration**:
   - Go to `/register`
   - Create account
   - Should redirect after registration
3. **Test Login**:
   - Login with your account
   - Should work and redirect to home
4. **Test File Upload** (if you have profile edit):
   - Upload avatar
   - Should upload to S3
   - Image should display from S3 URL

---

## Troubleshooting

### Backend Issues

#### "Application failed to start"
```bash
# Check Render logs for errors
# Common issues:
1. Missing environment variables
2. Database connection failed
3. Static files not collected

# Solution:
- Verify all env vars are set
- Check DATABASE_URL is correct
- Ensure build.sh ran successfully
```

#### "502 Bad Gateway"
```bash
# Render is restarting or crashed
# Check logs for Python errors
# Common causes:
1. Syntax errors in code
2. Missing dependencies in requirements.txt
3. Database migration failed

# Solution:
- Check logs for specific error
- Manually trigger deploy from Render dashboard
```

#### S3 Upload Fails
```bash
# Error: "Access Denied"
# Check:
1. AWS credentials are correct
2. IAM user has S3FullAccess
3. Bucket name is correct
4. USE_S3=True is set

# Error: "Bucket does not exist"
# Check:
1. Bucket name matches AWS_STORAGE_BUCKET_NAME
2. Region matches AWS_S3_REGION_NAME
```

### Frontend Issues

#### "Failed to fetch" / CORS Errors
```bash
# Backend is blocking frontend requests
# Solution:
1. Check CORS_ALLOWED_ORIGINS includes your Vercel URL
2. Restart Render backend after CORS change
3. Check browser console for exact CORS error
4. Ensure no trailing slash in CORS origins
```

#### Environment Variables Not Working
```bash
# Vercel env vars not loading
# Solution:
1. Ensure they start with VITE_
2. Redeploy after adding env vars
3. Check in Vercel dashboard → Settings → Environment Variables
4. Variables are case-sensitive
```

---

## Cost Breakdown

### Free Tier (Development)
- **Render Web Service**: Free (spins down after 15 min inactivity)
- **Render PostgreSQL**: Free (1GB storage, 0.1GB RAM)
- **AWS S3**: Free first year (5GB storage, 20K GET requests)
- **Vercel**: Free (hobby plan, unlimited bandwidth)
- **Total**: $0/month ✅

### Paid Tier (Production)
- **Render Web Service**: $7/month (always on, more resources)
- **Render PostgreSQL**: $7/month (10GB storage, better performance)
- **AWS S3**: ~$0.50-2/month (depends on usage)
- **Vercel**: Free (or $20/month for Pro features)
- **Total**: ~$15-35/month

---

## Production Checklist

Before going live:

- [ ] Change SECRET_KEY to a random 50-character string
- [ ] Set DEBUG=0
- [ ] Configure proper ALLOWED_HOSTS
- [ ] Set up custom domain (optional)
- [ ] Configure SSL (automatic on Render/Vercel)
- [ ] Set up error monitoring (Sentry)
- [ ] Configure database backups
- [ ] Set up email service (SendGrid, AWS SES)
- [ ] Review S3 bucket permissions
- [ ] Set up S3 lifecycle policies (delete old files)
- [ ] Configure CDN for S3 (CloudFront - optional)
- [ ] Set up monitoring/alerts
- [ ] Test all features in production
- [ ] Load test with expected traffic

---

## Maintenance

### Database Backups

Render auto-backs up PostgreSQL daily on paid plans. For free tier:

```bash
# Manual backup from Render shell
pg_dump $DATABASE_URL > backup.sql

# Or use Render's backup feature in dashboard
```

### S3 Storage Management

Monitor your S3 usage:

1. Go to AWS S3 Console
2. Click your bucket → Metrics tab
3. View storage size and request metrics

Set up lifecycle policy to delete old files:
1. Bucket → Management tab
2. Create lifecycle rule
3. Example: Delete files older than 90 days

### Monitoring

Set up monitoring tools:
- **Render**: Built-in metrics and logs
- **Sentry**: Error tracking (sentry.io)
- **LogRocket**: Frontend monitoring
- **AWS CloudWatch**: S3 monitoring

---

## Environment Variables Quick Reference

### Backend (Render)

```bash
# Required
DEBUG=0
SECRET_KEY=<random-50-char-string>
DATABASE_URL=<from-render-postgresql>
ALLOWED_HOSTS=artfit-backend.onrender.com
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app

# S3 (Required for file uploads)
USE_S3=True
AWS_ACCESS_KEY_ID=<from-iam-user>
AWS_SECRET_ACCESS_KEY=<from-iam-user>
AWS_STORAGE_BUCKET_NAME=artfit-media
AWS_S3_REGION_NAME=us-east-1

# Optional
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
PYTHON_VERSION=3.12.0
```

### Frontend (Vercel)

```bash
# Required
VITE_API_BASE=https://artfit-backend.onrender.com/api

# Optional
VITE_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
```

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **AWS S3 Docs**: https://docs.aws.amazon.com/s3/
- **Django Storages**: https://django-storages.readthedocs.io/
- **Vercel Docs**: https://vercel.com/docs
- **Need Help?**: Check Render community forum or open GitHub issue

---

## Next Steps

After successful deployment:

1. Set up custom domain (Render + Vercel support this)
2. Configure email notifications (Django + SendGrid)
3. Add error tracking (Sentry)
4. Set up analytics (Google Analytics, Mixpanel)
5. Configure automated testing in CI/CD
6. Set up staging environment
7. Create deployment documentation for your team
8. Plan scaling strategy

Congratulations! Your app is now live! 🎉

