# 📋 Deployment Checklist

Use this checklist while deploying to Render + AWS S3.

---

## Pre-Deployment

- [ ] Code is committed to GitHub
- [ ] All tests pass locally
- [ ] Environment files are NOT committed (.env should be in .gitignore)
- [ ] AWS account created
- [ ] Render account created (sign up with GitHub)
- [ ] Vercel account created (sign up with GitHub)

---

## Part 1: AWS S3 Setup ⏱️ 15 min

### S3 Bucket
- [ ] Go to https://s3.console.aws.amazon.com
- [ ] Create bucket named `artfit-media` (or similar)
- [ ] Region: `us-east-1`
- [ ] ✅ Uncheck "Block all public access"
- [ ] Create bucket

### Bucket Configuration
- [ ] Add CORS configuration (see guide)
- [ ] Add bucket policy for public read access
- [ ] Test bucket is accessible

### IAM User
- [ ] Go to https://console.aws.amazon.com/iam
- [ ] Create user: `artfit-django`
- [ ] Attach policy: `AmazonS3FullAccess`
- [ ] Create access key
- [ ] **SAVE CREDENTIALS**:
  ```
  Access Key ID: ___________________________
  Secret Access Key: _______________________
  ```

---

## Part 2: Render Backend ⏱️ 20 min

### PostgreSQL Database
- [ ] Render Dashboard → New → PostgreSQL
- [ ] Name: `artfit-db`
- [ ] Region: Choose nearest
- [ ] Plan: Free
- [ ] Create Database
- [ ] Wait for provisioning (2-3 min)
- [ ] **SAVE**: Internal Database URL

### Web Service
- [ ] Render Dashboard → New → Web Service
- [ ] Connect GitHub repository: `ArtFit`
- [ ] Configure:
  ```
  Name: artfit-backend
  Region: [Same as database]
  Root Directory: backend
  Runtime: Python 3
  Build Command: ./build.sh
  Start Command: gunicorn artfit.wsgi:application
  Plan: Free
  ```

### Environment Variables
Add these 11 variables:

- [ ] `DEBUG=0`
- [ ] `SECRET_KEY=` *(generate 50 random characters)*
- [ ] `DATABASE_URL=` *(from PostgreSQL service)*
- [ ] `ALLOWED_HOSTS=artfit-backend.onrender.com`
- [ ] `CORS_ALLOWED_ORIGINS=https://YOUR-APP.vercel.app` *(update later)*
- [ ] `USE_S3=True`
- [ ] `AWS_ACCESS_KEY_ID=` *(from AWS IAM)*
- [ ] `AWS_SECRET_ACCESS_KEY=` *(from AWS IAM)*
- [ ] `AWS_STORAGE_BUCKET_NAME=artfit-media`
- [ ] `AWS_S3_REGION_NAME=us-east-1`
- [ ] `GOOGLE_CLIENT_ID=` *(optional)*

### Deploy & Verify
- [ ] Click "Create Web Service"
- [ ] Watch logs for ~5-10 min
- [ ] Look for: "Your service is live 🎉"
- [ ] **SAVE URL**: `https://artfit-backend.onrender.com`
- [ ] Test: `curl https://artfit-backend.onrender.com/api/accounts/me/`

### Create Superuser
- [ ] Go to Shell tab in Render
- [ ] Run: `python manage.py createsuperuser`
- [ ] **SAVE CREDENTIALS**:
  ```
  Username: _____________
  Password: _____________
  ```

---

## Part 3: Vercel Frontend ⏱️ 10 min

### Deploy
- [ ] Go to https://vercel.com
- [ ] New Project → Import from GitHub
- [ ] Select repository: `ArtFit`
- [ ] Configure:
  ```
  Framework Preset: Vite
  Root Directory: frontend
  Build Command: npm run build
  Output Directory: dist
  ```

### Environment Variables
- [ ] `VITE_API_BASE=https://artfit-backend.onrender.com/api`
- [ ] `VITE_GOOGLE_CLIENT_ID=` *(optional)*

### Deploy & Verify
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes
- [ ] **SAVE URL**: `https://YOUR-APP.vercel.app`
- [ ] Visit site and check it loads

---

## Part 4: Final Configuration ⏱️ 10 min

### Update CORS (IMPORTANT!)
- [ ] Go to Render → artfit-backend → Environment
- [ ] Update `CORS_ALLOWED_ORIGINS` with real Vercel URL
- [ ] Update `ALLOWED_HOSTS` if using custom domain
- [ ] Save Changes (will trigger redeploy)

### Google OAuth (if using)
- [ ] Go to https://console.cloud.google.com/apis/credentials
- [ ] Edit OAuth 2.0 Client
- [ ] Add authorized origin: Vercel URL
- [ ] Add authorized redirect: Vercel URL
- [ ] Save

---

## Part 5: Testing ⏱️ 10 min

### Backend Tests
- [ ] Visit: `https://artfit-backend.onrender.com/admin`
- [ ] Login with superuser
- [ ] Test API: `curl https://artfit-backend.onrender.com/api/accounts/me/`

### Frontend Tests
- [ ] Visit: `https://YOUR-APP.vercel.app`
- [ ] Test registration (create new account)
- [ ] Test login
- [ ] Test Google OAuth (if configured)
- [ ] Upload a file (avatar/portfolio)
- [ ] Verify file uploaded to S3

### S3 Verification
- [ ] Go to AWS S3 console
- [ ] Check bucket for uploaded files
- [ ] Try accessing S3 URL directly
- [ ] Verify it's public-readable

---

## Post-Deployment

### Security
- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Verify `DEBUG=0` in production
- [ ] Review CORS allowed origins (not `*`)
- [ ] Check database connection is secure (SSL)

### Monitoring
- [ ] Set up error tracking (Sentry - optional)
- [ ] Configure uptime monitoring (optional)
- [ ] Set up backup strategy

### Documentation
- [ ] Document your deployment URLs
- [ ] Save all credentials securely (password manager)
- [ ] Share access with team if needed

---

## URLs & Credentials Record

Fill this out as you deploy:

```
BACKEND URL: https://________________________________
FRONTEND URL: https://________________________________
ADMIN USERNAME: ________________
ADMIN PASSWORD: ________________

AWS BUCKET: ________________
AWS ACCESS KEY: ________________
AWS SECRET KEY: ________________

RENDER POSTGRESQL: postgres://________________

GOOGLE CLIENT ID: ________________
```

---

## Common Issues

### "Application failed to start"
→ Check Render logs for missing environment variables

### "CORS error" in browser
→ Update `CORS_ALLOWED_ORIGINS` with exact Vercel URL (no trailing slash)

### "S3 Access Denied"
→ Verify IAM user has S3FullAccess and credentials are correct

### "502 Bad Gateway"
→ Backend is starting or crashed, check Render logs

---

## Estimated Total Time: ~1 hour

- AWS S3: 15 min
- Render Backend: 20 min
- Vercel Frontend: 10 min
- Configuration: 10 min
- Testing: 10 min

---

## Success Criteria

✅ Backend API responds at Render URL  
✅ Frontend loads at Vercel URL  
✅ Can register new user  
✅ Can login  
✅ Can upload files (stored in S3)  
✅ Google OAuth works (if configured)  
✅ Admin panel accessible  
✅ No CORS errors in browser console  

---

## Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure email service (optional)
3. Add error tracking (Sentry)
4. Set up CI/CD for auto-testing
5. Plan scaling strategy

---

**Need help?** See `RENDER_S3_DEPLOYMENT.md` for detailed instructions!

🎉 Happy deploying!

