# Erki Dashboard

**Personal Operating System Dashboard** with Apple-grade aesthetics and enterprise-level architecture.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/Tailwind-v3-38B2AC?style=for-the-badge&logo=tailwind-css" />
</p>

---

## 🎯 Project Overview

Erki Dashboard is a modular, Bento-style personal dashboard that acts as your digital operating system. Built with cutting-edge technologies and designed with Apple Intelligence aesthetics.

### ✨ Key Features

- **🔐 Gatekeeper Security**: WhitelistRLS-based approval system
- **🎨 Apple-Grade UI**: Glassmorphism, physics-based animations
- **📱 Progressive Web App**: Install on any device
- **🎮 Rainbow Six Integration**: Live stats tracking
- **👑 Admin Panel**: User management dashboard
- **⚡ Performance**: Server Components + Turbopack

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (SSR) |
| **Styling** | Tailwind CSS v3.4 |
| **UI Components** | Shadcn UI (Radix) |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **External API** | r6api.js (Ubisoft) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17+
- Supabase account
- Ubisoft account (for R6 stats)

### Installation

1. **Run the setup script:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Setup Supabase:**
   - Create a project at [supabase.com](https://supabase.com)
   - Run `supabase-schema.sql` in SQL Editor
   - Copy API credentials

3. **Configure environment:**
   ```bash
   # Edit .env.local with your credentials
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   UBI_EMAIL=your_ubisoft_email
   UBI_PASSWORD=your_ubisoft_password
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

5. **Create first admin:**
   - Sign up through the app
   - Run in Supabase SQL Editor:
     ```sql
     UPDATE public.profiles
     SET role = 'admin', is_approved = true
     WHERE id = 'your-user-id';
     ```

For detailed instructions, see [SETUP-GUIDE.md](SETUP-GUIDE.md).

---

## 📁 Project Structure

```
/app
  /(auth)              # Authentication routes
  /(dashboard)         # Protected dashboard routes
  /api/r6              # R6 Stats API proxy
/components
  /ui                  # Shadcn primitives
  /shared              # Global components
  /features            # Feature-specific components
/lib
  /supabase            # Supabase clients (browser/server/middleware)
  /services            # Business logic
  /utils               # Helper functions
/types
  database.types.ts    # Generated Supabase types
```

---

## 🎨 Design Philosophy

### Visual Language
- **Glassmorphism**: `backdrop-blur-xl` + translucent backgrounds
- **Rounded Corners**: `rounded-3xl` (Apple-style)
- **Color Palette**: Black base + purple/blue accents
- **Typography**: Inter variable font
- **Spacing**: 8px grid system

### Animation Principles
- **Physics-Based**: Spring animations via Framer Motion
- **Micro-interactions**: Hover states, touch feedback
- **Page Transitions**: Smooth AnimatePresence

### Responsive Strategy
- **Mobile**: Bottom navigation, single column grid
- **Tablet**: 2-column Bento grid
- **Desktop**: 4-column grid + persistent sidebar

---

## 🔒 Security Model

### Authentication Flow
1. User signs up → Profile created with `is_approved = false`
2. Redirect to `/pending` page
3. Admin approves via Admin Panel
4. User gains dashboard access

### Row Level Security (RLS)
- Users can only view their own data
- Admins can view/edit all profiles
- Automatic profile creation via trigger
- Cascade deletions on user removal

### Middleware (The Gatekeeper)
- Enforces authentication on all routes
- Checks approval status
- Validates admin access for `/admin`
- Handles session refresh

---

## 🎮 Features

### Implemented
- ✅ Authentication system (login/signup)
- ✅ Middleware gatekeeping
- ✅ Admin panel (user management)
- ✅ Responsive Bento grid dashboard
- ✅ Glassmorphism UI components
- ✅ Mobile PWA support

### In Progress
- 🚧 Rainbow Six stats integration
- 🚧 User settings page
- 🚧 Dark mode toggle (currently dark-only)

### Planned
- 📋 Weather widget
- 📋 Calendar integration
- 📋 Spotify now playing
- 📋 Custom widget system

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
npm run supabase:types  # Generate Supabase types
```

### Code Standards
- **TypeScript**: Strict mode, no `any` types
- **Formatting**: Prettier with Tailwind plugin
- **Linting**: ESLint with Next.js config
- **Commits**: Conventional commits recommended

---

## 📱 PWA Configuration

The app is installable as a Progressive Web App:

- **Manifest**: `/public/manifest.json`
- **Theme Color**: `#000000` (black)
- **Display Mode**: Standalone
- **Orientation**: Portrait (mobile), any (desktop)

### iOS Specific
- Apple Touch Icon support
- Status bar styling
- Safe area handling
- Viewport zoom prevention

---

## 🔌 API Integration

### Rainbow Six Stats
- **Library**: `r6api.js`
- **Caching**: 15-minute TTL in `r6_cache` table
- **Platform Support**: PC, PSN, XBL
- **Endpoint**: `/api/r6?username=NAME&platform=PLATFORM`

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel
```
Add environment variables in Vercel Dashboard.

### Self-Hosted
Requires Node.js server + PostgreSQL (or continue using Supabase hosted).

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 🤝 Contributing

This is a personal project. Contributions are not currently accepted.

---

## 📞 Support

For issues or questions, contact the project maintainer.

---

**Built with ❤️ using Next.js 15 and Supabase**

*Architecture approved by Lead Staff Engineer*
*Security verified with RLS policies*
*Type safety enforced with strict TypeScript*
