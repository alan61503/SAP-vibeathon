# VIBE - SAP Vibeathon Registration Platform

VIBE is a comprehensive registration platform built with Next.js for the SAP Vibeathon event. It provides a complete solution for event registration with dual registration flows for professionals and students, integrated with Supabase for data management.

This platform offers a modern, responsive design with comprehensive registration management, user authentication, and real-time event statistics.

### ✨ Key Features
- **Dual Registration Flows**: Separate forms for professionals and students
- **Real-time Validation**: Email uniqueness and required field validation
- **Supabase Integration**: Complete database management with Row Level Security
- **User Dashboard**: Personal registration details and event statistics
- **Responsive Design**: Works perfectly on all devices
- **Dark/Light Mode**: Automatic theme switching
- **TypeScript Support**: Full type safety throughout the application
- **Modern UI/UX**: Clean, professional design with smooth animations

### 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd startup-nextjs-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL schema from `database-schema.sql`
   - Add your Supabase credentials to `.env.local`

4. **Start the development server**
   ```bash
   npm run dev
   ```

### 📋 Registration System

- **Professional Registration**: Name, Email, Mobile, Company, Designation, Food Choice
- **Student Registration**: Name, Email, Mobile, College, Education Level, Year of Study, Food Choice
- **Validation**: Required fields and unique email validation
- **Database**: Supabase integration with Row Level Security

### 🛠️ Technology Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel/Netlify ready

### 📄 License
VIBE is 100% free and open-source, feel free to use with your personal and commercial projects.

### 💜 Support
If you like the platform, please star this repository to inspire the team to create more innovative solutions!

### 🚀 Live Demo
Visit the registration page to see the platform in action: `/registration`
