# Supabase Integration Setup

## ✅ Completed Setup

Your Next.js project has been successfully integrated with Supabase! Here's what has been configured:

### 1. Dependencies Installed
- `@supabase/supabase-js` - Official Supabase JavaScript client

### 2. Environment Variables
Created `.env.local` with your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: https://cvxuuacbrhdylrsxtema.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon key

### 3. Configuration Files Created
- `lib/supabase.ts` - Supabase client configuration
- `lib/auth.ts` - Authentication helper functions
- `lib/database.ts` - Database operation examples
- `components/SupabaseTest.tsx` - Connection test component

### 4. Test Component
Added a Supabase connection test to your homepage that will show:
- Connection status
- Any connection errors
- Your Supabase URL

## 🚀 Next Steps

### 1. Database Schema Setup
You'll need to create tables in your Supabase dashboard. Here are some example schemas:

#### Users/Profiles Table
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

#### Posts Table
```sql
-- Create posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = author_id);
```

### 2. Authentication Setup
Your Supabase project should have authentication enabled. You can configure:
- Email/Password authentication
- OAuth providers (Google, GitHub, etc.)
- Magic links

### 3. Row Level Security (RLS)
Make sure to enable RLS on your tables and create appropriate policies for data access control.

## 🔧 Usage Examples

### Authentication
```typescript
import { auth } from '@/lib/auth';

// Sign up
const { data, error } = await auth.signUp('user@example.com', 'password');

// Sign in
const { data, error } = await auth.signIn('user@example.com', 'password');

// Sign out
await auth.signOut();

// Get current user
const { user, error } = await auth.getCurrentUser();
```

### Database Operations
```typescript
import { database } from '@/lib/database';

// Get all posts
const { data: posts, error } = await database.getPosts();

// Create a post
const { data, error } = await database.createPost(
  'My Post Title',
  'Post content here',
  'user-id'
);
```

## 🌐 Testing Your Connection

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Look for the "Supabase Connection Test" component
4. Check if it shows "Connected successfully!" or any error messages

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🔒 Security Notes

- Never expose your service role key in client-side code
- Always use RLS policies to secure your data
- Validate user input before database operations
- Use environment variables for sensitive configuration
