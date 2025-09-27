# SAP Vibeathon – Full Stack Registration Platform

A comprehensive event registration platform for SAP Vibeathon, built with Next.js, React, TypeScript, Tailwind CSS, and Supabase. Supports dual registration flows, real-time validation, dashboards, and modern UI/UX.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm (comes with Node.js)
- Supabase account (for database)

### 2. Local Development
1. **Clone the repository**
	```powershell
	git clone <repository-url>
	cd startup-nextjs-main
	```
2. **Install dependencies**
	```powershell
	npm install
	```
3. **Set up Supabase**
	- Create a Supabase project
	- Run the SQL schema from `database-schema.sql` and `agenda-schema.sql`
	- Add your Supabase credentials to `.env.local`:
	  ```env
	  NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
	  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
	  ```
4. **Start the development server**
	```powershell
	npm run dev
	```

### 3. Deployment
- **Vercel**: One-click deploy using the Vercel button in the project README
- **Render**: Follow `DEPLOYMENT.md` for Render deployment steps

---

## 📋 Features
- Dual registration flows: Professional & Student
- Real-time validation (email uniqueness, required fields)
- Supabase integration with Row Level Security
- User dashboard with event stats
- Responsive design (mobile & desktop)
- Dark/Light mode
- TypeScript for type safety
- Modern UI/UX with Tailwind CSS

---

## 🛠️ Technology Stack
- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel, Render

---

## 📦 Scripts
- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm start` – Start production server
- `npm run lint` – Lint code
- `npm run lint:fix` – Auto-fix lint issues
- `npm run type-check` – TypeScript type checking

---

## 📄 License
MIT – Free for personal and commercial use.

---

## 💡 Support & Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Render Documentation](https://render.com/docs)

---

## 🙌 Credits
Created for SAP Vibeathon. If you find this project useful, please star the repository!
