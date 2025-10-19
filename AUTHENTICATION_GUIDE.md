# Authentication Guide

## Overview
ArtFit now supports two authentication methods:
1. **Traditional Registration/Login** - Username & password with JWT tokens
2. **Google OAuth** - Sign in with Google account

## Features Implemented

### ✅ Traditional Authentication
- **Registration** (`/accounts/register/`)
  - Users register with username, email, password, and role
  - Automatically generates JWT tokens upon registration
  - Users are logged in immediately after registration
  - Redirects based on role (Developer/Designer/Both)

- **Login** (`/token/`)
  - Standard username/password login
  - Returns JWT access and refresh tokens
  - Access token expires after 5 minutes
  - Refresh token used to obtain new access tokens

### ✅ Google OAuth
- **Google Sign-In** (`/accounts/google-auth/`)
  - One-click sign in with Google
  - Creates new user account if first time
  - Logs in existing users
  - Returns same JWT tokens as traditional login
  - Populates profile with Google information

## API Endpoints

### POST `/api/accounts/register/`
Register a new user with traditional method.

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "DEV"  // or "DES" or "BOTH"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "DEV",
    "first_name": "",
    "last_name": "",
    "profile": {...},
    "works": []
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### POST `/api/token/`
Login with username and password.

**Request:**
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### POST `/api/token/refresh/`
Refresh access token using refresh token.

**Request:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### POST `/api/accounts/google-auth/`
Authenticate with Google ID token.

**Request:**
```json
{
  "token": "google-id-token-from-frontend"
}
```

**Response:**
```json
{
  "user": {
    "id": 2,
    "username": "john_abc12345",
    "email": "john@gmail.com",
    "role": "BOTH",
    "first_name": "John",
    "last_name": "Doe",
    "profile": {
      "display_name": "John Doe",
      ...
    },
    "works": []
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "is_new_user": true
}
```

### GET `/api/accounts/me/`
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "DEV",
  "first_name": "John",
  "last_name": "Doe",
  "profile": {
    "display_name": "John Doe",
    "bio": "Full-stack developer",
    "location": "New York, NY",
    "portfolio_url": "https://johndoe.com",
    "hourly_rate": "100.00",
    "availability": "Available",
    "avatar": null
  },
  "works": []
}
```

## Frontend Implementation

### Token Storage
Tokens are stored in `localStorage`:
- `access` - JWT access token
- `refresh` - JWT refresh token

### Auto-Refresh
The frontend automatically refreshes the access token when it expires using the refresh token. See `frontend/src/lib/api.ts` for implementation.

### Protected Routes
To make authenticated requests:
```typescript
import { api } from '../lib/api'

// Access token is automatically added to headers
const response = await api.get('/accounts/me/')
```

### Google OAuth Flow
1. User clicks "Continue with Google"
2. Google Sign-In popup appears
3. User authenticates with Google
4. Google returns ID token to frontend
5. Frontend sends token to backend `/accounts/google-auth/`
6. Backend verifies token, creates/finds user, returns JWT tokens
7. Frontend stores tokens and redirects user

## Configuration

### Backend Environment Variables
```bash
# Required for Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com

# Optional (have defaults)
SECRET_KEY=your-secret-key
DEBUG=1
DB_NAME=artfit
DB_USER=artfit
DB_PASSWORD=artfit
DB_HOST=db
DB_PORT=5432
ALLOWED_HOSTS=*
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend Environment Variables
Create `frontend/.env`:
```bash
VITE_API_BASE=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

## Security Features

### Password Hashing
- Passwords are hashed using Django's PBKDF2 algorithm
- Never stored in plain text
- Automatic via `user.set_password()`

### JWT Tokens
- Access tokens expire after 5 minutes (configurable in settings)
- Refresh tokens have longer expiration
- Tokens signed with SECRET_KEY

### Google OAuth
- ID tokens verified with Google's servers
- Email verification through Google
- No password needed for OAuth users

### CORS
- Configured to allow requests from frontend
- Restricted origins in production

## Testing

### Test Traditional Registration
```bash
curl -X POST http://localhost:8000/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "role": "DEV"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

### Test Authenticated Request
```bash
# Get access token from login/register response
curl http://localhost:8000/api/accounts/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### "Invalid credentials" on login
- Check username and password are correct
- Username is case-sensitive
- Make sure user exists (try registering first)

### "Authentication credentials were not provided"
- Make sure Authorization header is included
- Format: `Bearer <token>` (note the space)
- Check if token has expired

### Google OAuth not working
- Verify GOOGLE_CLIENT_ID is set in both frontend and backend
- Check browser console for errors
- Ensure Google Cloud project is properly configured
- Verify authorized origins include your frontend URL

### CORS errors
- Check CORS_ALLOWED_ORIGINS includes your frontend URL
- Restart backend after changing environment variables
- Browser may cache CORS errors - try incognito mode

## Database Schema

### User Model
```python
class User(AbstractUser):
    role = models.CharField(max_length=5, choices=ROLE_CHOICES, default="BOTH")
    # Inherits: username, email, password, first_name, last_name, etc.
```

### Profile Model
```python
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=80, blank=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=120, blank=True)
    portfolio_url = models.URLField(blank=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2)
    availability = models.CharField(max_length=80, blank=True)
    avatar = models.ImageField(upload_to="avatars/")
```

## Next Steps

Consider implementing:
- Email verification for traditional registration
- Password reset functionality
- Two-factor authentication
- OAuth with other providers (GitHub, LinkedIn)
- Session management (logout all devices)
- User activity tracking

