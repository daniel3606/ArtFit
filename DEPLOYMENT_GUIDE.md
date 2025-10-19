# ArtFit Production Deployment Guide

## Architecture Overview

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│   Vercel    │──────▶│   Railway    │──────▶│  PostgreSQL  │
│  (Frontend) │       │  (Backend)   │       │  (Database)  │
└─────────────┘       └──────────────┘       └──────────────┘
```

## ✅ Deployment Checklist

### 1. Backend Deployment (Railway)

- [ ] Create Railway account: https://railway.app
- [ ] Create new project from GitHub repo
- [ ] Add PostgreSQL service to project
- [ ] Set environment variables:
  - [ ] `DEBUG=0`
  - [ ] `SECRET_KEY=<generate-random-key>`
  - [ ] `ALLOWED_HOSTS=<your-railway-domain>`
  - [ ] `CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app`
  - [ ] `GOOGLE_CLIENT_ID=<your-google-client-id>` (optional)
  - [ ] Database variables (auto-provided by Railway)
- [ ] Deploy backend
- [ ] Run migrations: `python manage.py migrate`
- [ ] Create superuser: `python manage.py createsuperuser`
- [ ] Test backend: `https://your-backend.railway.app/api/accounts/me/`

### 2. Frontend Deployment (Vercel)

- [ ] Push code to GitHub
- [ ] Connect repo to Vercel
- [ ] Set root directory to `/` (or leave default)
- [ ] Set environment variables:
  - [ ] `VITE_API_BASE=https://your-backend.railway.app/api`
  - [ ] `VITE_GOOGLE_CLIENT_ID=<your-google-client-id>` (optional)
- [ ] Deploy frontend
- [ ] Test frontend: `https://your-app.vercel.app`

### 3. Database Setup

- [ ] Railway PostgreSQL is automatically provisioned
- [ ] Connection details available in Railway dashboard
- [ ] Backup strategy (optional): Set up automated backups

### 4. Google OAuth (Optional)

- [ ] Go to Google Cloud Console
- [ ] Update authorized JavaScript origins:
  - [ ] Add: `https://your-app.vercel.app`
- [ ] Update authorized redirect URIs (if needed):
  - [ ] Add: `https://your-app.vercel.app`
- [ ] Update `GOOGLE_CLIENT_ID` in both frontend and backend

### 5. Static Files & Media

- [ ] Configure static files serving (Django Whitenoise recommended)
- [ ] Set up media storage (AWS S3, Cloudinary, or Railway volumes)

### 6. Security

- [ ] Generate strong `SECRET_KEY`
- [ ] Set `DEBUG=0` in production
- [ ] Configure HTTPS (automatic on Railway/Vercel)
- [ ] Set up proper CORS origins (not `*`)
- [ ] Review ALLOWED_HOSTS

### 7. Testing

- [ ] Test registration
- [ ] Test login
- [ ] Test authenticated endpoints
- [ ] Test Google OAuth (if configured)
- [ ] Test CORS from frontend to backend

## Environment Variables

### Backend (Railway)

```bash
# Django Settings
DEBUG=0
SECRET_KEY=your-long-random-secret-key-here
ALLOWED_HOSTS=your-backend.railway.app
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app

# Database (auto-provided by Railway PostgreSQL)
DATABASE_URL=postgresql://...
# Or individual variables:
# DB_NAME=railway
# DB_USER=postgres
# DB_PASSWORD=...
# DB_HOST=...
# DB_PORT=5432

# Google OAuth (optional)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

### Frontend (Vercel)

```bash
# API Configuration
VITE_API_BASE=https://your-backend.railway.app/api

# Google OAuth (optional)
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

## Backend Code Changes for Production

### 1. Update settings.py for production

```python
# backend/artfit/settings.py

import os
import dj_database_url  # Install: pip install dj-database-url

# Security
DEBUG = os.getenv("DEBUG", "0") == "1"
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is not set")

# Hosts
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost").split(",")

# Database - Railway provides DATABASE_URL
DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL"),
        conn_max_age=600
    )
}

# CORS
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")

# Static files (use whitenoise)
MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

# Media files - consider using S3 or Cloudinary in production
if not DEBUG:
    # Use cloud storage for media files
    # Configure AWS S3, Cloudinary, etc.
    pass
```

### 2. Update requirements.txt

Add production dependencies:

```txt
# Add to backend/requirements.txt
dj-database-url==2.1.0
whitenoise==6.6.0
gunicorn==21.2.0
```

### 3. Create Procfile for Railway

```bash
# backend/Procfile
web: gunicorn artfit.wsgi --log-file -
release: python manage.py migrate
```

### 4. Create railway.json (optional)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "gunicorn artfit.wsgi:application --bind 0.0.0.0:$PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Alternative: Deploy Everything to Railway

If you want to deploy frontend + backend + database all on Railway:

1. **Deploy Backend** (as described above)
2. **Deploy Frontend separately**:
   - Create new Railway service
   - Connect to same GitHub repo
   - Set root directory to `frontend/`
   - Railway will auto-detect Vite and deploy
3. **Use Railway's provided domains** for both services

## Troubleshooting

### Backend won't connect to database
- Check DATABASE_URL is set correctly
- Verify PostgreSQL service is running
- Check network connectivity in Railway dashboard

### Frontend can't reach backend (CORS errors)
- Verify CORS_ALLOWED_ORIGINS includes your Vercel domain
- Check VITE_API_BASE points to correct backend URL
- Ensure backend is actually deployed and running

### Google OAuth not working
- Verify authorized origins in Google Cloud Console
- Check GOOGLE_CLIENT_ID matches in both frontend and backend
- Ensure domains use HTTPS (required by Google)

### Static files not loading
- Run `python manage.py collectstatic` in production
- Verify STATIC_ROOT and STATIC_URL are configured
- Check whitenoise is in MIDDLEWARE

## Cost Estimates

### Free Tier (Good for MVP/Testing)
- **Vercel**: Free (hobby plan)
- **Railway**: $5/month credit (free for small apps)
- **Total**: ~$0-5/month

### Production Ready
- **Vercel**: $20/month (Pro plan)
- **Railway**: ~$10-20/month (depending on usage)
- **Total**: ~$30-40/month

## Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure SSL certificates (automatic on Railway/Vercel)
3. Set up monitoring (Sentry, LogRocket)
4. Configure automated backups
5. Set up CI/CD pipeline
6. Add error tracking
7. Set up analytics

## Resources

- Railway Documentation: https://docs.railway.app
- Vercel Documentation: https://vercel.com/docs
- Django Deployment Checklist: https://docs.djangoproject.com/en/stable/howto/deployment/checklist/
- Whitenoise Documentation: http://whitenoise.evans.io/

