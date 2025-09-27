# SAP Vibeathon - Deployment Guide for Render

This guide will help you deploy the SAP Vibeathon application to Render.

## Prerequisites

1. **Supabase Account**: You need a Supabase project with the database schema set up
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Render Account**: Sign up at [render.com](https://render.com)

## Step 1: Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following SQL scripts in order:

### Create Attendees Table
```sql
-- Run the database-schema.sql file content
CREATE TABLE IF NOT EXISTS attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mobile VARCHAR(20),
  company VARCHAR(255),
  designation VARCHAR(255),
  college VARCHAR(255),
  education_level VARCHAR(10),
  year_of_study VARCHAR(20),
  food_choice VARCHAR(10) NOT NULL DEFAULT 'Veg',
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('professional', 'student')),
  country VARCHAR(100),
  gender VARCHAR(20),
  blood_group VARCHAR(5),
  emergency_contact_name VARCHAR(255),
  emergency_contact_number VARCHAR(20),
  consent_notifications BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON attendees FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON attendees FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for users based on email" ON attendees FOR UPDATE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_attendees_email ON attendees(email);
CREATE INDEX IF NOT EXISTS idx_attendees_user_type ON attendees(user_type);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_attendees_updated_at BEFORE UPDATE ON attendees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Create Event Sessions and Agenda Tables
```sql
-- Run the agenda-schema.sql file content
CREATE TABLE IF NOT EXISTS event_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  speaker VARCHAR(255),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  category VARCHAR(100),
  track VARCHAR(100),
  max_capacity INTEGER DEFAULT 50,
  current_attendees INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS personalized_agenda (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attendee_id UUID REFERENCES attendees(id) ON DELETE CASCADE,
  session_id UUID REFERENCES event_sessions(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(attendee_id, session_id)
);

-- Enable RLS
ALTER TABLE event_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalized_agenda ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON event_sessions FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON personalized_agenda FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON personalized_agenda FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON personalized_agenda FOR DELETE USING (true);
```

## Step 2: Deploy to Render

### Option 1: Using render.yaml (Recommended)

1. **Push to GitHub**: Make sure your code is pushed to a GitHub repository
2. **Connect to Render**:
   - Go to [render.com](https://render.com) and sign in
   - Click "New +" and select "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Set Environment Variables**:
   - In the Render dashboard, go to your service
   - Navigate to "Environment" tab
   - Add the following environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

### Option 2: Manual Setup

1. **Create New Web Service**:
   - Go to [render.com](https://render.com)
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:
   - **Name**: `sap-vibeathon`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan)

3. **Set Environment Variables**:
   - Add the same environment variables as above

## Step 3: Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to "Settings" → "API"
3. Copy the following values:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 4: Configure Domain (Optional)

1. In Render dashboard, go to your service
2. Navigate to "Settings" → "Custom Domains"
3. Add your custom domain if you have one
4. Update DNS records as instructed

## Step 5: Test Deployment

1. Wait for the deployment to complete (usually 2-5 minutes)
2. Visit your Render URL (e.g., `https://sap-vibeathon.onrender.com`)
3. Test the following features:
   - User registration and login
   - Professional/Student registration forms
   - Agenda management
   - All navigation and functionality

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version compatibility
   - Check build logs in Render dashboard

2. **Database Connection Issues**:
   - Verify Supabase credentials are correct
   - Check that database tables exist
   - Ensure RLS policies are set up correctly

3. **Environment Variables**:
   - Make sure all required environment variables are set
   - Check that variable names match exactly
   - Restart the service after adding new variables

### Useful Commands:

```bash
# Check build locally
npm run build

# Test production build locally
npm run build && npm start

# Check for linting issues
npm run lint
```

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to your repository
2. **Database Security**: Use Row Level Security (RLS) policies
3. **HTTPS**: Render provides HTTPS by default
4. **Headers**: Security headers are configured in `next.config.js`

## Performance Optimization

1. **Static Generation**: The app uses Next.js static generation
2. **Image Optimization**: Images are optimized for web delivery
3. **Bundle Optimization**: CSS and JS are optimized for production
4. **Caching**: Render provides automatic caching

## Monitoring

1. **Logs**: Check Render dashboard for application logs
2. **Metrics**: Monitor performance metrics in Render dashboard
3. **Uptime**: Render provides uptime monitoring
4. **Errors**: Set up error tracking if needed

## Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)

---

Your SAP Vibeathon application should now be successfully deployed on Render! 🚀
