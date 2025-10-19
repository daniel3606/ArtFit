# ArtFit Full-Stack Deployment - Render Only

Deploy your entire application (Frontend + Backend + Database) on Render with AWS S3 for media storage.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  RENDER                         │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────┐│
│  │   Static     │  │  Web Service │  │  DB   ││
│  │  (Frontend)  │→ │  (Backend)   │→ │ (PG)  ││
│  └──────────────┘  └──────────────┘  └───────┘│
└─────────────────────────────────────────────────┘
                       ↓
                  ┌─────────┐
                  │  AWS S3 │
                  │ (Media) │
                  └─────────┘
```

**Benefits:**
- ✅ Everything on one platform (easier management)
- ✅ No CORS issues (same domain possible)
- ✅ Single billing
- ✅ Simpler networking
- ✅ Free tier available for all services

---

## Part 1: Prerequisites (5 min)

### 1.1 Accounts Needed
- [ ] **Render Account**: Sign up at https://render.com (use GitHub)
- [ ] **AWS Account**: For S3 storage (see Part 2)
- [ ] **GitHub Account**: With your ArtFit repository

### 1.2 Prepare Repository

```bash
cd /Users/daniel/Documents/Coding/ArtFit

# Make sure all changes are committed
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## Part 2: AWS S3 Setup (15 min)

### 2.1 Create S3 Bucket

1. Go to https://s3.console.aws.amazon.com
2. Click **"Create bucket"**
3. Configure:
   - **Bucket name**: `artfit-media-RANDOM` (add random numbers for uniqueness)
   - **Region**: `us-east-1`
   - **Object Ownership**: ACLs enabled
   - **Block Public Access**: ❌ Uncheck all boxes
   - Click **Create bucket**

### 2.2 Configure Bucket Permissions

**CORS Configuration:**

Go to bucket → Permissions → CORS → Edit:

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

**Bucket Policy:**

Go to bucket → Permissions → Bucket policy → Edit (replace `YOUR-BUCKET-NAME`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```

### 2.3 Create IAM User

1. Go to https://console.aws.amazon.com/iam/
2. Users → Add users
3. **User name**: `artfit-render`
4. **Access type**: ✓ Access key - Programmatic access
5. **Permissions**: Attach `AmazonS3FullAccess`
6. **Create user**
7. **SAVE CREDENTIALS** ⚠️ (shown only once):
   ```
   Access Key ID: ____________________
   Secret Access Key: ____________________
   ```

---

## Part 3: Render Database (5 min)

### 3.1 Create PostgreSQL Database

1. **Render Dashboard** → **New +** → **PostgreSQL**
2. Configure:
   ```
   Name: artfit-db
   Database: artfit
   User: artfit (auto-generated)
   Region: Oregon (US West) or nearest
   PostgreSQL Version: 16
   Instance Type: Free (shared CPU, 256MB RAM, 1GB storage)
   ```
3. Click **"Create Database"**
4. Wait 2-3 minutes for provisioning
5. **Copy and save**:
   - **Internal Database URL**: `postgres://...` (for backend)
   - **External Database URL**: `postgres://...` (for external access)

---

## Part 4: Render Backend (Django) (15 min)

### 4.1 Create Web Service

1. **Render Dashboard** → **New +** → **Web Service**
2. **Connect Repository**:
   - Authorize GitHub if needed
   - Select: `ArtFit` repository
3. **Configure Service**:
   ```
   Name: artfit-backend
   Region: Oregon (US West) - same as database
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: ./build.sh
   Start Command: gunicorn artfit.wsgi:application
   Instance Type: Free (shared CPU, 512MB RAM)
   ```

### 4.2 Environment Variables

Click **"Advanced"** → **Add Environment Variable** for each:

```bash
# Django Core
DEBUG=0
SECRET_KEY=CHANGE-THIS-TO-RANDOM-50-CHARS
PYTHON_VERSION=3.12.0

# Database (from Step 3.1)
DATABASE_URL=postgres://artfit:password@dpg-xxx-oregon-postgres.render.com/artfit

# Hosts & CORS
ALLOWED_HOSTS=artfit-backend.onrender.com
CORS_ALLOWED_ORIGINS=https://artfit-frontend.onrender.com

# AWS S3 (from Step 2.3)
USE_S3=True
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJalr...
AWS_STORAGE_BUCKET_NAME=artfit-media-12345
AWS_S3_REGION_NAME=us-east-1

# Optional
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Generate SECRET_KEY:**
```python
# Run in Python to generate random key:
import secrets
print(secrets.token_urlsafe(50))
```

### 4.3 Deploy Backend

1. Click **"Create Web Service"**
2. Watch **Logs** tab (takes 5-10 minutes)
3. Look for: `Your service is live 🎉`
4. **Your backend URL**: `https://artfit-backend.onrender.com`

### 4.4 Create Superuser

After deployment succeeds:

1. Go to your web service → **Shell** tab
2. Click **"Launch Shell"**
3. Run:
   ```bash
   python manage.py createsuperuser
   ```
4. Follow prompts:
   ```
   Username: admin
   Email: admin@artfit.com
   Password: [your-secure-password]
   Password (again): [your-secure-password]
   ```

### 4.5 Test Backend

```bash
# Test API
curl https://artfit-backend.onrender.com/api/accounts/me/
# Should return: {"detail":"Authentication credentials were not provided."}

# Test Admin Panel
open https://artfit-backend.onrender.com/admin
# Should show login page
```

---

## Part 5: Render Frontend (React) (15 min)

### 5.1 Create Environment File

Create `frontend/.env.production`:

```bash
VITE_API_BASE=https://artfit-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Commit this file:
```bash
git add frontend/.env.production
git commit -m "Add production environment config"
git push origin main
```

### 5.2 Create Static Site

1. **Render Dashboard** → **New +** → **Static Site**
2. **Connect Repository**:
   - Select: `ArtFit` repository
3. **Configure Site**:
   ```
   Name: artfit-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: frontend/dist
   ```

### 5.3 Environment Variables

Add these environment variables:

```bash
VITE_API_BASE=https://artfit-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 5.4 Deploy Frontend

1. Click **"Create Static Site"**
2. Watch **Logs** tab (takes 3-5 minutes)
3. Look for: `Site is live`
4. **Your frontend URL**: `https://artfit-frontend.onrender.com`

### 5.5 Update Backend CORS

Now that you have the real frontend URL:

1. Go to Backend Web Service → **Environment**
2. Update `CORS_ALLOWED_ORIGINS`:
   ```
   CORS_ALLOWED_ORIGINS=https://artfit-frontend.onrender.com
   ```
3. If using custom domain, add it too:
   ```
   CORS_ALLOWED_ORIGINS=https://artfit-frontend.onrender.com,https://artfit.com
   ```
4. Click **"Save Changes"** (will trigger redeploy)

---

## Part 6: Custom Domains (Optional, 10 min)

### 6.1 Add Custom Domain to Frontend

1. Buy domain (Namecheap, GoDaddy, etc.)
2. **Frontend Static Site** → **Settings** → **Custom Domains**
3. Click **"Add Custom Domain"**
4. Enter: `artfit.com` and `www.artfit.com`
5. **Add DNS records** at your domain registrar:
   ```
   Type: CNAME
   Name: www
   Value: artfit-frontend.onrender.com
   
   Type: A
   Name: @
   Value: 216.24.57.1 (Render's IP)
   ```
6. Wait for DNS propagation (5-30 minutes)
7. Render auto-provisions SSL certificate

### 6.2 Add Custom Domain to Backend (Optional)

1. **Backend Web Service** → **Settings** → **Custom Domains**
2. Add: `api.artfit.com`
3. Add DNS CNAME record:
   ```
   Type: CNAME
   Name: api
   Value: artfit-backend.onrender.com
   ```
4. Update backend environment:
   ```
   ALLOWED_HOSTS=artfit-backend.onrender.com,api.artfit.com
   CORS_ALLOWED_ORIGINS=https://artfit.com,https://www.artfit.com
   ```
5. Update frontend .env.production:
   ```
   VITE_API_BASE=https://api.artfit.com/api
   ```

---

## Part 7: Google OAuth Update (5 min)

### 7.1 Update Google Console

1. Go to https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. **Authorized JavaScript origins** - Add:
   ```
   https://artfit-frontend.onrender.com
   https://artfit.com (if using custom domain)
   https://www.artfit.com (if using custom domain)
   ```
4. **Authorized redirect URIs** - Add:
   ```
   https://artfit-frontend.onrender.com
   https://artfit.com
   https://www.artfit.com
   ```
5. Click **Save**

---

## Part 8: Testing (10 min)

### 8.1 Backend Tests

```bash
# Test API health
curl https://artfit-backend.onrender.com/api/accounts/me/

# Test registration
curl -X POST https://artfit-backend.onrender.com/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"pass123","role":"DEV"}'

# Test admin panel
open https://artfit-backend.onrender.com/admin
```

### 8.2 Frontend Tests

1. **Visit**: `https://artfit-frontend.onrender.com`
2. **Test Registration**:
   - Go to `/register`
   - Create a new account
   - Should redirect after registration
3. **Test Login**:
   - Go to `/login`
   - Login with credentials
   - Should redirect to home
4. **Test Google OAuth**:
   - Click "Continue with Google"
   - Should authenticate and login
5. **Test File Upload**:
   - Upload avatar or portfolio image
   - Should upload to S3
   - Verify image URL is: `https://your-bucket.s3.amazonaws.com/...`

### 8.3 S3 Verification

1. Go to AWS S3 Console
2. Click your bucket
3. Check uploaded files in `avatars/` or `works/` folders
4. Click a file → Copy URL
5. Paste in browser - should be publicly accessible

---

## Infrastructure as Code (Optional)

### render.yaml

Create `render.yaml` in your project root to define all services:

```yaml
services:
  # PostgreSQL Database
  - type: pserv
    name: artfit-db
    env: docker
    plan: free
    region: oregon
    
  # Django Backend
  - type: web
    name: artfit-backend
    env: python
    region: oregon
    plan: free
    branch: main
    rootDir: backend
    buildCommand: ./build.sh
    startCommand: gunicorn artfit.wsgi:application
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: artfit-db
          property: connectionString
      - key: DEBUG
        value: 0
      - key: SECRET_KEY
        generateValue: true
      - key: ALLOWED_HOSTS
        value: artfit-backend.onrender.com
      - key: USE_S3
        value: True
      - key: AWS_ACCESS_KEY_ID
        sync: false
      - key: AWS_SECRET_ACCESS_KEY
        sync: false
      - key: AWS_STORAGE_BUCKET_NAME
        sync: false
      - key: AWS_S3_REGION_NAME
        value: us-east-1
  
  # React Frontend
  - type: static
    name: artfit-frontend
    env: static
    region: oregon
    branch: main
    rootDir: frontend
    buildCommand: npm install && npm run build
    staticPublishPath: frontend/dist
    envVars:
      - key: VITE_API_BASE
        value: https://artfit-backend.onrender.com/api
```

With this file, you can deploy everything at once from the Render dashboard by clicking "New" → "Blueprint" and connecting your repo.

---

## Troubleshooting

### Backend Issues

#### "Application failed to start"
**Check:**
- Render logs for Python errors
- All environment variables are set
- DATABASE_URL is correct
- build.sh has execute permissions

**Solution:**
```bash
# Verify build.sh is executable (in your repo)
chmod +x backend/build.sh
git add backend/build.sh
git commit -m "Make build.sh executable"
git push
```

#### "502 Bad Gateway"
**Cause:** Backend crashed or still starting

**Check:**
- Logs for errors
- Database connection working
- Gunicorn command is correct

#### Database Connection Failed
**Check:**
- DATABASE_URL includes `?sslmode=require` if needed
- Database is in same region as backend
- Database is running

### Frontend Issues

#### "Failed to fetch" / CORS errors
**Solution:**
1. Check `CORS_ALLOWED_ORIGINS` includes exact frontend URL
2. No trailing slash in CORS origins
3. Restart backend after CORS change
4. Clear browser cache

#### Environment Variables Not Working
**Solution:**
1. Ensure they start with `VITE_`
2. Redeploy frontend after adding env vars
3. Check in Render dashboard they're set correctly

#### Build Failed
**Check:**
- `package.json` has correct build script
- All dependencies in `package.json`
- Node version compatibility

### S3 Issues

#### Upload Fails with "Access Denied"
**Check:**
- `USE_S3=True` is set
- AWS credentials are correct
- IAM user has S3FullAccess policy
- Bucket name matches `AWS_STORAGE_BUCKET_NAME`

#### Images Not Loading
**Check:**
- Bucket policy allows public read
- CORS is configured on bucket
- Image URLs are correct (check S3 console)

---

## Cost Breakdown

### Free Tier (Perfect for testing/portfolio)

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Static Site (Frontend) | ✅ 100GB bandwidth/month | More than enough |
| Web Service (Backend) | ✅ 750 hours/month | Spins down after 15 min inactivity |
| PostgreSQL | ✅ 1GB storage, 256MB RAM | Good for small apps |
| AWS S3 | ✅ 5GB storage, 20K requests | First 12 months |
| **Total** | **$0/month** | ✅ Great for development |

**Limitations:**
- Backend spins down after 15 min inactivity (first request takes ~30 seconds)
- 1GB database storage
- Shared resources

### Paid Tier (Production ready)

| Service | Cost | Upgrade When |
|---------|------|-------------|
| Static Site | Still FREE | N/A |
| Web Service | $7/month | Need always-on + more resources |
| PostgreSQL | $7/month | Need >1GB data or better performance |
| AWS S3 | ~$1-2/month | Pay per usage |
| **Total** | **$15-16/month** | When you have real users |

**Benefits:**
- Backend always on (no cold starts)
- 10GB+ database storage
- Better performance
- Daily automatic backups

---

## Monitoring & Maintenance

### Built-in Render Features

**Logs:**
- Render Dashboard → Your Service → Logs
- Real-time log streaming
- Filter by severity

**Metrics:**
- CPU usage
- Memory usage
- Request rate
- Response times

**Health Checks:**
- Automatic health monitoring
- Email alerts on failures
- Automatic restarts

### Set Up Alerts

1. Service → Settings → Health & Alerts
2. Enable email notifications
3. Set up custom health check path (optional)

### Database Backups

**Free tier:**
- No automatic backups
- Manual backup:
  ```bash
  # In Render Shell
  pg_dump $DATABASE_URL > backup.sql
  ```

**Paid tier:**
- Daily automatic backups
- 7-day retention
- One-click restore

### Update Your Application

**Automatic deploys:**
- Push to GitHub main branch
- Render auto-detects and deploys
- Zero-downtime for static sites
- Rolling updates for web services

**Manual deploy:**
- Render Dashboard → Your Service → Manual Deploy

---

## Production Checklist

Before going live:

**Security:**
- [ ] Change `SECRET_KEY` to 50+ random characters
- [ ] Set `DEBUG=0`
- [ ] Review `ALLOWED_HOSTS`
- [ ] Use strong database password
- [ ] Enable 2FA on Render account
- [ ] Review S3 bucket permissions

**Performance:**
- [ ] Enable CDN (Render provides this)
- [ ] Optimize images before upload
- [ ] Set S3 lifecycle policies
- [ ] Review database indexes

**Monitoring:**
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up email alerts
- [ ] Test backup/restore process

**Testing:**
- [ ] Test all user flows
- [ ] Test file uploads
- [ ] Test authentication
- [ ] Load test with expected traffic
- [ ] Test on mobile devices

---

## Scaling Strategy

### When to Upgrade

**Database:**
- Upgrade when: >800MB data or slow queries
- Next tier: $7/month (10GB, 256MB RAM)

**Backend:**
- Upgrade when: Response times >2s or high error rate
- Next tier: $7/month (always on, 512MB RAM)

**S3:**
- Scales automatically
- Pay only for what you use

### Performance Optimization

1. **Database:**
   - Add indexes for frequent queries
   - Use connection pooling (built-in with Render)
   - Analyze slow queries

2. **Backend:**
   - Enable caching (Redis - $7/month on Render)
   - Optimize Django queries
   - Use Django Debug Toolbar locally

3. **Frontend:**
   - Code splitting
   - Lazy loading images
   - Compress assets (Vite does this)

---

## Next Steps

After successful deployment:

1. **Set up custom domain** (Optional)
2. **Configure email service** (SendGrid, AWS SES)
3. **Add error tracking** (Sentry - free tier available)
4. **Set up analytics** (Google Analytics, Plausible)
5. **Create staging environment** (separate Render services)
6. **Document runbooks** for common operations
7. **Plan backup strategy**

---

## Summary

✅ **What You Get:**
- Full-stack app on one platform (Render)
- Automatic HTTPS
- Auto-deploy on git push
- Built-in monitoring
- Free tier available
- Scalable architecture

✅ **Deployment Time:**
- AWS S3: 15 min
- Database: 5 min
- Backend: 15 min
- Frontend: 15 min
- **Total: ~50 minutes**

✅ **Cost:**
- Development: FREE
- Production: ~$15/month

---

## Support

- **Render Docs**: https://render.com/docs
- **Community**: https://community.render.com
- **Status**: https://status.render.com
- **Support**: support@render.com

---

**Congratulations! 🎉** Your full-stack application is now running on Render with AWS S3 storage!

