# ArtFit - Quick Start Guide

## 🚀 Start the Application

### Prerequisites
- Docker and Docker Compose installed
- Node.js and npm installed
- Ports 8000, 5173, and 5432 available

### 1. Start Backend & Database
```bash
docker-compose up -d
```

This will:
- Start PostgreSQL database on port 5432
- Start Django backend on port 8000
- Run migrations automatically
- Wait for database to be ready

**Backend Status:** http://localhost:8000/admin

### 2. Start Frontend (New Terminal)
```bash
cd frontend
npm install  # First time only
npm run dev
```

**Frontend Status:** http://localhost:5173

## ✅ Verify Everything Works

### Test Backend
```bash
curl http://localhost:8000/api/accounts/me/
# Should return: {"detail":"Authentication credentials were not provided."}
```

### Test Registration
1. Visit http://localhost:5173/register
2. Fill in username, email, password
3. Select Developer or Designer role
4. Click "Create account"
5. Should redirect to skills page

### Test Login
1. Visit http://localhost:5173/login
2. Enter your username and password
3. Click "Login"
4. Should redirect to homepage

## 🔑 Superuser Access

A superuser was already created:
- **Username:** `admin`
- **Password:** `admin123`
- **Admin Panel:** http://localhost:8000/admin

## 🔧 Optional: Enable Google OAuth

### 1. Get Google Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → APIs & Services → Credentials
3. Create OAuth Client ID (Web application)
4. Add origin: `http://localhost:5173`
5. Copy the Client ID

### 2. Configure Backend
Create `.env` in project root:
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 3. Configure Frontend
Create `frontend/.env`:
```bash
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 4. Restart Services
```bash
docker-compose restart backend
# Restart frontend dev server (Ctrl+C, then npm run dev)
```

### 5. Test Google Login
1. Visit http://localhost:5173/login
2. Click "Continue with Google" button
3. Sign in with Google account
4. Should redirect to homepage

## 📝 API Endpoints

All endpoints use base URL: `http://localhost:8000/api`

### Public Endpoints (No Auth Required)
- `POST /accounts/register/` - Create new account
- `POST /token/` - Login with username/password
- `POST /accounts/google-auth/` - Login with Google

### Protected Endpoints (Auth Required)
- `GET /accounts/me/` - Get current user info
- `PATCH /accounts/profile/` - Update profile
- `GET /accounts/works/` - List user's portfolio
- `POST /accounts/works/` - Add portfolio item

### Auth Header Format
```
Authorization: Bearer <access_token>
```

## 🛠 Common Commands

### View Backend Logs
```bash
docker-compose logs backend -f
```

### Restart Backend
```bash
docker-compose restart backend
```

### Stop Everything
```bash
docker-compose down
```

### Reset Database (⚠️ Deletes all data)
```bash
docker-compose down -v
docker-compose up -d
```

### Create New Superuser
```bash
docker-compose exec backend python manage.py createsuperuser
```

## 📚 Documentation

- **AUTHENTICATION_GUIDE.md** - Complete API reference
- **GOOGLE_OAUTH_SETUP.md** - Detailed OAuth setup
- **IMPLEMENTATION_SUMMARY.md** - Technical details
- **SETUP.md** - Original setup instructions

## 🐛 Troubleshooting

### Backend won't start
```bash
docker-compose logs backend
# Look for errors, usually database connection or migrations
```

### Frontend can't connect to backend
- Check backend is running: `curl http://localhost:8000/api/accounts/me/`
- Check CORS settings in `backend/artfit/settings.py`
- Verify `VITE_API_BASE` in frontend/.env

### Google OAuth not working
- Ensure `GOOGLE_CLIENT_ID` is set in both backend and frontend
- Check authorized origins in Google Cloud Console
- Look for errors in browser console
- Verify frontend/.env is loaded (restart dev server)

### Port already in use
```bash
# Find process using port
lsof -i :8000  # or :5173 or :5432

# Kill the process
kill -9 <PID>
```

## 🎯 What's Working

✅ User registration with auto-login  
✅ Username/password login  
✅ JWT authentication with auto-refresh  
✅ Google OAuth (when configured)  
✅ Protected API endpoints  
✅ User profiles  
✅ Portfolio/works management  
✅ Admin panel  

## 🎉 You're Ready!

The application is now running and ready for development. Start by:

1. Creating a user account at http://localhost:5173/register
2. Exploring the API at http://localhost:8000/api
3. Checking the admin panel at http://localhost:8000/admin

Happy coding! 🚀

