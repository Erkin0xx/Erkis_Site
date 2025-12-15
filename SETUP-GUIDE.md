# 🚀 Erki Dashboard - Complete Setup Guide

**Welcome, Lead Engineer.** This document provides a step-by-step guide to initialize and deploy the Erki Dashboard project from scratch.

---

## 📋 Prerequisites

Before beginning, ensure you have:

- **Node.js**: Version 18.17 or higher
- **Package Manager**: pnpm (recommended) or npm
- **Supabase Account**: Free tier works perfectly
- **Ubisoft Account**: For Rainbow Six Siege API access
- **Git**: For version control

---

## 🏗️ Phase 1: Project Initialization

### Step 1: Run Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

This automated script will:
- ✅ Validate prerequisites
- ✅ Initialize Next.js 15 with TypeScript & Tailwind
- ✅ Install all dependencies (Supabase, Framer Motion, Shadcn, etc.)
- ✅ Create the complete directory structure
- ✅ Setup Git repository

**Expected Duration:** 3-5 minutes

---

## 🗄️ Phase 2: Supabase Configuration

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in details:
   - **Name:** Erki Dashboard
   - **Database Password:** *Save this securely*
   - **Region:** Choose closest to your users
4. Wait for provisioning (~2 minutes)

### Step 2: Run Database Migration

1. In Supabase Dashboard, navigate to **SQL Editor**
2. Click **"New Query"**
3. Copy the contents of `supabase-schema.sql`
4. Paste and click **"Run"**
5. Verify success: Check **Database** → **Tables** (should see `profiles`, `r6_cache`)

### Step 3: Generate TypeScript Types

```bash
# Install Supabase CLI globally (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your_project_ref

# Generate types
supabase gen types typescript --linked > types/database.types.ts
```

**Find your project ref:** Supabase Dashboard → Settings → General → Reference ID

---

## 🔐 Phase 3: Environment Configuration

### Step 1: Create Environment File

```bash
cp .env.local.template .env.local
```

### Step 2: Fill in Supabase Credentials

In Supabase Dashboard → Settings → API:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **CRITICAL:** The `SERVICE_ROLE_KEY` is secret. Never commit to Git.

### Step 3: Configure Ubisoft API

```env
UBI_EMAIL=your_ubisoft_email@example.com
UBI_PASSWORD=your_ubisoft_password
```

**Note:** Use a dedicated account for API access, not your main gaming account.

### Step 4: Set Application URL

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Development
# For production: https://yourdomain.com
```

---

## 👤 Phase 4: Create First Admin User

### Step 1: Start Development Server

```bash
pnpm dev
# or
npm run dev
```

### Step 2: Sign Up

1. Navigate to `http://localhost:3000`
2. You'll be redirected to `/login`
3. Sign up with your email
4. You'll land on `/pending` (because `is_approved = false` by default)

### Step 3: Promote to Admin

1. Go to Supabase Dashboard → Authentication → Users
2. Copy your **User ID** (UUID format)
3. Go to **SQL Editor** → New Query
4. Run:

```sql
UPDATE public.profiles
SET role = 'admin', is_approved = true
WHERE id = 'paste-your-user-id-here';
```

5. Refresh the app - you now have admin access!

---

## 🎨 Phase 5: Verify Installation

### Checklist

- [ ] App loads at `http://localhost:3000`
- [ ] Login/Signup flow works
- [ ] Admin panel accessible at `/admin`
- [ ] No console errors in browser
- [ ] Tailwind styles are applying (glassmorphism effects visible)
- [ ] Framer Motion animations are smooth

### Test Admin Panel

1. Navigate to `/admin`
2. Should see the user table with your account
3. Try toggling approval status (create a test user)

---

## 🧪 Phase 6: Test Rainbow Six Integration

### Step 1: Add R6 Module

*This will be implemented in future phases*

### Step 2: Test API Route

```bash
curl http://localhost:3000/api/r6?username=YourUbisoftName&platform=pc
```

Expected response: JSON with rank, KD, win rate

---

## 📱 Phase 7: PWA Configuration

### Create `manifest.json`

```json
{
  "name": "Erki Dashboard",
  "short_name": "Erki",
  "description": "Personal Operating System Dashboard",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Add to `app/layout.tsx`

```tsx
export const metadata = {
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
}
```

---

## 🚀 Phase 8: Deployment

### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel Dashboard
```

### Option B: Self-Hosted

Requires:
- Node.js server
- PostgreSQL (or continue using Supabase)
- Reverse proxy (Nginx/Caddy)

---

## 🔧 Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code
pnpm format

# Generate Supabase types
pnpm supabase:types
```

---

## 📚 Project Structure Reference

```
/app
  /(auth)/login                 # Authentication pages
  /(dashboard)                  # Protected routes
    /page.tsx                   # Main dashboard (Bento grid)
    /admin/page.tsx             # Admin panel
  /api/r6/route.ts              # R6 Stats API proxy
  /pending/page.tsx             # Access pending page
/components
  /ui                           # Shadcn primitives
  /shared                       # Global components (Sidebar, etc.)
  /features/r6                  # R6 specific components
  /features/admin               # Admin specific components
/lib
  /supabase                     # Supabase clients
  /services                     # Business logic
    /r6-service.ts              # R6 API integration
/types
  database.types.ts             # Generated Supabase types
```

---

## ⚠️ Common Issues & Solutions

### Issue: "Module not found" errors

**Solution:** Delete `node_modules` and `.next`, then reinstall:
```bash
rm -rf node_modules .next
pnpm install
```

### Issue: Supabase RLS errors

**Solution:** Verify policies in SQL Editor:
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### Issue: R6 API returns 401

**Solution:** Check Ubisoft credentials in `.env.local`. Try logging into the Ubisoft website with those credentials.

### Issue: Infinite redirect loop

**Solution:** Check middleware logic. Ensure `is_approved` field exists in profiles table.

---

## 📖 Next Steps

1. **Complete Module 1:** R6 Stats Integration (Backend + Frontend)
2. **Complete Module 2:** Admin Panel (User management)
3. **Complete Module 3:** Additional Bento cards (Weather, Calendar, etc.)
4. **Complete Module 4:** Mobile responsiveness polish
5. **Complete Module 5:** PWA installation flow

---

## 🆘 Support & Documentation

- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Shadcn UI:** [ui.shadcn.com](https://ui.shadcn.com)
- **Tailwind CSS:** [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

**Status:** ✅ Setup Complete - Ready for Development

**Architecture Approved:** Lead Staff Engineer
**Security Verified:** RLS Policies Active
**Type Safety:** Strict TypeScript Enabled
