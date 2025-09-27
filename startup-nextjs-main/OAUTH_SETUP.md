# OAuth Authentication Setup Guide

## 🔐 Complete OAuth Setup for VIBE Platform

Your VIBE platform now includes GitHub and Google OAuth authentication! Follow this guide to configure the OAuth providers in Supabase.

## 🚀 Quick Setup Steps

### 1. Configure GitHub OAuth

#### A. Create GitHub OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: `VIBE - SAP Vibeathon`
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `https://cvxuuacbrhdylrsxtema.supabase.co/auth/v1/callback`
4. Click "Register application"
5. Copy the **Client ID** and **Client Secret**

#### B. Configure in Supabase
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** → **Providers**
3. Find **GitHub** and click **Configure**
4. Enable GitHub provider
5. Enter your GitHub **Client ID** and **Client Secret**
6. Set **Redirect URL** to: `https://cvxuuacbrhdylrsxtema.supabase.co/auth/v1/callback`
7. Click **Save**

### 2. Configure Google OAuth

#### A. Create Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API** and **Google OAuth2 API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `https://cvxuuacbrhdylrsxtema.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
7. Copy the **Client ID** and **Client Secret**

#### B. Configure in Supabase
1. In Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** and click **Configure**
3. Enable Google provider
4. Enter your Google **Client ID** and **Client Secret**
5. Set **Redirect URL** to: `https://cvxuuacbrhdylrsxtema.supabase.co/auth/v1/callback`
6. Click **Save**

## 🔧 Environment Variables

Make sure your `.env.local` file has the correct Supabase URL and anon key:

```env
NEXT_PUBLIC_SUPABASE_URL=https://cvxuuacbrhdylrsxtema.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🎯 How It Works

### Authentication Flow
1. **User clicks "Continue with GitHub/Google"**
2. **Redirected to OAuth provider** (GitHub/Google)
3. **User authorizes the application**
4. **Redirected back to your app** via `/auth/callback`
5. **Supabase creates user session**
6. **User redirected to dashboard**

### User Experience
- **First-time users**: OAuth → Dashboard → Complete registration
- **Returning users**: OAuth → Dashboard (if already registered)
- **Email users**: Can still use email registration as fallback

## 📱 Features Implemented

### ✅ OAuth Components
- **OAuthLogin**: GitHub and Google login buttons
- **AuthCallback**: Handles OAuth redirects
- **Dashboard**: User dashboard after authentication

### ✅ Authentication Flow
- **Automatic session management**
- **Auth state persistence**
- **Automatic redirects**
- **Logout functionality**

### ✅ User Experience
- **Loading states** during authentication
- **Error handling** for failed auth
- **Responsive design** for all devices
- **Dark mode support**

## 🧪 Testing OAuth

### 1. Test GitHub OAuth
1. Go to `/registration`
2. Click "Continue with GitHub"
3. Authorize the application
4. Should redirect to `/dashboard`

### 2. Test Google OAuth
1. Go to `/registration`
2. Click "Continue with Google"
3. Authorize the application
4. Should redirect to `/dashboard`

### 3. Test Email Fallback
1. Go to `/registration`
2. Click "Register with Email"
3. Complete registration form
4. Should work as before

## 🔒 Security Features

### Row Level Security (RLS)
- **Enabled on attendees table**
- **Proper policies for data access**
- **User-specific data isolation**

### OAuth Security
- **Secure redirect URLs**
- **Token-based authentication**
- **Automatic session management**
- **CSRF protection**

## 🚀 Production Deployment

### Update OAuth URLs for Production
1. **GitHub OAuth App**:
   - Update Homepage URL to your production domain
   - Update Authorization callback URL to your Supabase callback

2. **Google OAuth App**:
   - Add production domain to authorized origins
   - Add production callback URL

3. **Supabase Configuration**:
   - Update redirect URLs in Supabase dashboard
   - Test OAuth flow in production

## 🐛 Troubleshooting

### Common Issues

#### 1. "Invalid redirect URI"
- Check that callback URLs match exactly
- Ensure no trailing slashes or extra characters

#### 2. "OAuth provider not configured"
- Verify Client ID and Secret are correct
- Check that provider is enabled in Supabase

#### 3. "User not found after OAuth"
- Check if user exists in attendees table
- Verify email matching logic

#### 4. "Redirect loop"
- Check redirect URLs configuration
- Verify callback page is working

### Debug Steps
1. **Check browser console** for errors
2. **Check Supabase logs** in dashboard
3. **Verify environment variables**
4. **Test OAuth URLs** manually

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all URLs and credentials are correct
3. Test with a fresh browser session
4. Check Supabase dashboard for error logs

## 🎉 Success!

Once configured, users can:
- ✅ **Login with GitHub** - One-click authentication
- ✅ **Login with Google** - Seamless OAuth flow
- ✅ **Register with Email** - Fallback option
- ✅ **Access Dashboard** - Personalized experience
- ✅ **Complete Registration** - Event registration flow

Your VIBE platform now has professional-grade OAuth authentication! 🚀
