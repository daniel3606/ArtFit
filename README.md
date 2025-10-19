# ArtFit - Designer & Developer Collaboration Platform

A full-stack web application connecting designers and developers for project collaboration.

## 🚀 Quick Start

### Local Development

```bash
# Start backend and database
docker-compose up -d

# Start frontend (in new terminal)
cd frontend
npm install
npm run dev

# Visit:
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# Admin: http://localhost:8000/admin
```

**Superuser:** `admin` / `admin123`

---

## 📚 Documentation

### Deployment
- **`README_DEPLOYMENT.md`** - Start here! Overview of all deployment options
- **`RENDER_FULL_STACK_DEPLOYMENT.md`** - ⭐ Recommended: Deploy everything to Render (~1 hour)
- **`RENDER_CHECKLIST.md`** - Checklist for Render-only deployment
- **`RENDER_S3_DEPLOYMENT.md`** - Alternative: Split between Render & Vercel (~1.5 hours)
- **`DEPLOYMENT_CHECKLIST.md`** - Checklist for Render+Vercel deployment
- **`DEPLOYMENT_COMPARISON.md`** - Compare deployment options

### Setup & Configuration
- **`QUICK_START.md`** - Detailed local development guide
- **`GOOGLE_OAUTH_SETUP.md`** - Configure Google Sign-In
- **`AUTHENTICATION_GUIDE.md`** - API endpoints & authentication docs
- **`IMPLEMENTATION_SUMMARY.md`** - Technical implementation details

---

## ✨ Features

- 🔐 JWT Authentication
- 🔑 Google OAuth (optional)
- 👤 User Profiles (Developer/Designer/Both)
- 🎨 Portfolio Management
- 📸 Image Uploads (AWS S3)
- 🔍 User Search & Discovery
- 🛠️ Skill Tags & Categories
- 📱 Responsive Design

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

**Backend:**
- Django 5.2
- Django REST Framework
- PostgreSQL
- JWT + Google OAuth
- AWS S3 (boto3)

---

## 🌐 Deployment Options

### Option 1: Render Full-Stack (Recommended)
Deploy everything to Render:
- ✅ Simpler (1 platform)
- ✅ Faster setup (~1 hour)
- ✅ Free tier available
- ✅ Great for MVP/portfolio projects

### Option 2: Render + Vercel
Frontend on Vercel, Backend on Render:
- ✅ Best frontend performance
- ✅ Global CDN
- ✅ Great for production apps
- Takes ~1.5 hours

**See `README_DEPLOYMENT.md` for details**

---

## 📖 Getting Started

1. **Local Development**: Follow "Quick Start" above
2. **Deploy**: Read `README_DEPLOYMENT.md`
3. **Choose Option**: Render-only or Render+Vercel
4. **Follow Guide**: Step-by-step instructions provided

---

## 🔧 Environment Variables

### Development (Docker)
Already configured in `docker-compose.yml`

### Production
See deployment guides for required variables

---

## 📝 API Endpoints

### Authentication
- `POST /api/accounts/register/` - Register new user
- `POST /api/token/` - Login (get JWT tokens)
- `POST /api/token/refresh/` - Refresh access token
- `POST /api/accounts/google-auth/` - Google OAuth

### User
- `GET /api/accounts/me/` - Get current user
- `PATCH /api/accounts/profile/` - Update profile

### Portfolio
- `GET /api/accounts/works/` - List user's work
- `POST /api/accounts/works/` - Upload portfolio item

**Full API docs: `AUTHENTICATION_GUIDE.md`**

---

## 🤝 Contributing

This is an educational/portfolio project. Feel free to:
- Fork and customize
- Submit issues
- Suggest improvements

---

## 📄 License

MIT License - Use freely for your projects

---

## 🆘 Support

**Documentation:**
- All guides in project root (`.md` files)
- Each guide has troubleshooting section

**Issues:**
- Check deployment guide troubleshooting
- Review error logs
- Verify environment variables

---

**Built with ❤️ for designer-developer collaboration**
