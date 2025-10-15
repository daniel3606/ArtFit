# ArtFit Setup Guide

## 🔐 Environment Variables

###Backend Setup

1. Create a `.env` file in the `backend/` directory with your Google OAuth credentials.

2. Add your Google OAuth credentials to `backend/.env`:

```env
# Google OAuth (Get these from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret

# Django Settings
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

3. Load environment variables in Django by adding to `settings.py`:

```python
from dotenv import load_dotenv
load_dotenv()
```

### Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to **Settings → Environment Variables**
3. Add your Google OAuth credentials as environment variables

**Note:** Vercel will only deploy the frontend. Your backend needs to be deployed separately (e.g., on Railway, Render, or Heroku).

## 📦 Installation

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 🚀 Deployment

The project includes `vercel.json` which configures:
- Frontend build from `frontend/` directory
- SPA routing support (fixes 404 errors)
- Output from `frontend/dist`

To deploy:
1. Push your changes to GitHub
2. Vercel will automatically deploy from the connected repository

## ⚠️ Security Notes

- **Never commit `.env` files** - they're in `.gitignore`
- Secrets are loaded from environment variables
- Use Vercel's environment variable settings for production

