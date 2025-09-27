# SAP Vibeathon - Quick Deployment Guide

## 🚀 Deploy to Render in 5 Minutes

### Prerequisites
- GitHub repository with your code
- Supabase project set up
- Render account (free)

### Quick Steps

1. **Set up Supabase Database**
   - Run the SQL scripts from `database-schema.sql` and `agenda-schema.sql` in your Supabase SQL Editor

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will auto-detect the `render.yaml` configuration

3. **Add Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Deploy!**
   - Click "Apply" and wait for deployment
   - Your app will be live at `https://your-app-name.onrender.com`

### Environment Variables Setup

Get these from your Supabase project dashboard → Settings → API:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Database Setup

Run these SQL scripts in your Supabase SQL Editor:

1. **Attendees Table**: Copy content from `database-schema.sql`
2. **Event Sessions**: Copy content from `agenda-schema.sql`

### Testing

After deployment, test:
- ✅ User registration/login
- ✅ Professional registration form
- ✅ Student registration form
- ✅ Agenda management
- ✅ All navigation

### Troubleshooting

- **Build fails**: Check `package.json` dependencies
- **Database errors**: Verify Supabase credentials and table setup
- **App crashes**: Check Render logs for error details

### Support

- Full deployment guide: See `DEPLOYMENT.md`
- Render docs: [render.com/docs](https://render.com/docs)
- Supabase docs: [supabase.com/docs](https://supabase.com/docs)

---

**Your SAP Vibeathon app is now live! 🎉**
