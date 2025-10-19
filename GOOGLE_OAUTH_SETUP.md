# Google OAuth Setup Guide

## Prerequisites
You need a Google Cloud Project with OAuth 2.0 credentials configured.

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Choose **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
7. Add authorized redirect URIs (if needed):
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
8. Copy your **Client ID** (it will look like: `xxxxx.apps.googleusercontent.com`)

## Step 2: Configure Backend

Create a `.env` file in the project root with:

```bash
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

Or export it as an environment variable:

```bash
export GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

## Step 3: Configure Frontend

Create a `.env` file in the `frontend/` directory with:

```bash
VITE_API_BASE=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

**Note:** The `VITE_GOOGLE_CLIENT_ID` must match the backend `GOOGLE_CLIENT_ID`.

## Step 4: Rebuild and Restart

```bash
# Rebuild backend to install new packages
docker-compose build backend

# Restart services
docker-compose up -d

# Restart frontend (if running)
cd frontend
npm run dev
```

## Testing

1. Navigate to `http://localhost:5173/login`
2. Click "Continue with Google" button
3. Sign in with your Google account
4. You should be automatically logged in and redirected to the homepage

## Features

### Auto-Login After Registration
- When users register via the form, they are automatically logged in
- JWT tokens are stored in localStorage
- No need to manually log in after registration

### Google OAuth
- Users can sign in or sign up with Google
- New users are automatically created in the database
- Existing users are logged in
- Profile information is populated from Google

### JWT Authentication
- Access tokens expire after 5 minutes (configurable)
- Refresh tokens are used to automatically renew access tokens
- Tokens are stored securely in localStorage

## Troubleshooting

### "Google OAuth not configured" error
- Make sure `GOOGLE_CLIENT_ID` is set in the backend environment
- Restart the backend container after setting the variable

### Google button doesn't appear
- Check browser console for errors
- Ensure `VITE_GOOGLE_CLIENT_ID` is set in frontend/.env
- Restart the frontend dev server

### "Invalid token" error
- The Google Client ID in frontend and backend must match
- Make sure the Client ID is from a valid Google Cloud project
- Check that authorized origins are configured correctly

