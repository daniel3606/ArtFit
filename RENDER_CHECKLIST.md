# 📋 Render Full-Stack Deployment Checklist

Deploy Frontend + Backend + Database all on Render (no Vercel needed)

---

## Pre-Deployment

- [ ] Code pushed to GitHub
- [ ] Render account created (https://render.com)
- [ ] AWS account created (for S3)

---

## Part 1: AWS S3 ⏱️ 15 min

### S3 Bucket
- [ ] Create bucket: `artfit-media-XXXXX`
- [ ] Region: `us-east-1`
- [ ] Disable "Block all public access"
- [ ] Add CORS configuration
- [ ] Add bucket policy (public read)

### IAM User
- [ ] Create user: `artfit-render`
- [ ] Attach policy: `AmazonS3FullAccess`
- [ ] **Save credentials**:
  ```
  Access Key: _________________________
  Secret Key: _________________________
  Bucket Name: _______________________
  ```

---

## Part 2: Render Database ⏱️ 5 min

- [ ] Render Dashboard → New → PostgreSQL
- [ ] Name: `artfit-db`
- [ ] Region: Oregon (US West) or nearest
- [ ] Plan: Free
- [ ] Create Database
- [ ] **Save URL**: `postgres://...`

---

## Part 3: Backend (Django) ⏱️ 15 min

### Create Web Service
- [ ] Render Dashboard → New → Web Service
- [ ] Connect repository: `ArtFit`
- [ ] Configure:
  ```
  Name: artfit-backend
  Root Directory: backend
  Build: ./build.sh
  Start: gunicorn artfit.wsgi:application
  Plan: Free
  ```

### Environment Variables (11 total)
- [ ] `DEBUG=0`
- [ ] `SECRET_KEY=` *(generate 50 chars)*
- [ ] `PYTHON_VERSION=3.12.0`
- [ ] `DATABASE_URL=` *(from database)*
- [ ] `ALLOWED_HOSTS=artfit-backend.onrender.com`
- [ ] `CORS_ALLOWED_ORIGINS=https://artfit-frontend.onrender.com`
- [ ] `USE_S3=True`
- [ ] `AWS_ACCESS_KEY_ID=` *(from AWS)*
- [ ] `AWS_SECRET_ACCESS_KEY=` *(from AWS)*
- [ ] `AWS_STORAGE_BUCKET_NAME=` *(from AWS)*
- [ ] `AWS_S3_REGION_NAME=us-east-1`

### Deploy & Test
- [ ] Click "Create Web Service"
- [ ] Wait 5-10 minutes
- [ ] Look for "Your service is live 🎉"
- [ ] **Save URL**: `https://artfit-backend.onrender.com`
- [ ] Test: `curl https://artfit-backend.onrender.com/api/accounts/me/`

### Create Superuser
- [ ] Go to Shell tab
- [ ] Run: `python manage.py createsuperuser`
- [ ] **Save credentials**:
  ```
  Username: __________
  Password: __________
  ```

---

## Part 4: Frontend (React) ⏱️ 15 min

### Prepare Code
- [ ] Create `frontend/.env.production`:
  ```
  VITE_API_BASE=https://artfit-backend.onrender.com/api
  VITE_GOOGLE_CLIENT_ID=your-optional-client-id
  ```
- [ ] Commit and push to GitHub

### Create Static Site
- [ ] Render Dashboard → New → Static Site
- [ ] Connect repository: `ArtFit`
- [ ] Configure:
  ```
  Name: artfit-frontend
  Root Directory: frontend
  Build: npm install && npm run build
  Publish: frontend/dist
  ```

### Environment Variables
- [ ] `VITE_API_BASE=https://artfit-backend.onrender.com/api`
- [ ] `VITE_GOOGLE_CLIENT_ID=` *(optional)*

### Deploy & Test
- [ ] Click "Create Static Site"
- [ ] Wait 3-5 minutes
- [ ] **Save URL**: `https://artfit-frontend.onrender.com`
- [ ] Visit site and verify it loads

---

## Part 5: Final Configuration ⏱️ 10 min

### Update Backend CORS
- [ ] Backend service → Environment
- [ ] Update `CORS_ALLOWED_ORIGINS` with real frontend URL
- [ ] Save Changes (triggers redeploy)

### Google OAuth (if using)
- [ ] Google Console → OAuth Client
- [ ] Add authorized origin: Frontend URL
- [ ] Save

### Custom Domains (optional)
- [ ] Frontend → Settings → Custom Domains
- [ ] Add your domain
- [ ] Configure DNS records
- [ ] Wait for SSL provisioning

---

## Part 6: Testing ⏱️ 10 min

### Backend Tests
- [ ] Visit admin: `https://artfit-backend.onrender.com/admin`
- [ ] Login with superuser
- [ ] Test API endpoint

### Frontend Tests
- [ ] Visit: `https://artfit-frontend.onrender.com`
- [ ] Test registration
- [ ] Test login
- [ ] Test Google OAuth (if configured)
- [ ] Upload a file (avatar)

### S3 Verification
- [ ] Check AWS S3 console
- [ ] Verify file was uploaded
- [ ] Try accessing S3 URL directly

---

## Success Criteria

✅ Backend responds at Render URL  
✅ Frontend loads at Render URL  
✅ Can register new users  
✅ Can login  
✅ Files upload to S3  
✅ Admin panel accessible  
✅ No CORS errors  

---

## Your URLs

Record your deployment URLs:

```
FRONTEND: https://________________________________
BACKEND:  https://________________________________
DATABASE: postgres://___________________________

S3 BUCKET: ___________________________________
AWS KEY:   ___________________________________

ADMIN USER: ________________
ADMIN PASS: ________________
```

---

## Total Time: ~60 minutes

- AWS S3: 15 min
- Database: 5 min
- Backend: 15 min
- Frontend: 15 min
- Configuration: 10 min

---

## Benefits of Render-Only Deployment

✅ **Simpler**: Everything on one platform  
✅ **Easier**: No CORS configuration headaches  
✅ **Cheaper**: All free tier services  
✅ **Unified**: Single dashboard for monitoring  
✅ **Fast**: Direct connection between services  

---

## Quick Fixes

**Backend won't start:**
→ Check logs for missing environment variables

**Frontend can't reach backend:**
→ Update CORS_ALLOWED_ORIGINS with exact frontend URL

**S3 upload fails:**
→ Verify USE_S3=True and AWS credentials

**Database connection error:**
→ Check DATABASE_URL is correct

---

**Need detailed instructions?** See `RENDER_FULL_STACK_DEPLOYMENT.md`

🎉 Happy deploying!

