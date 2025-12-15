#!/bin/bash

# ================================================================
# ERKI DASHBOARD - AUTOMATED INITIALIZATION SCRIPT
# ================================================================
# Lead Staff Engineer: Setup Script v1.0
# Strict execution mode: Exit on any error
# ================================================================

set -e

echo "┌─────────────────────────────────────────────────────────┐"
echo "│  🚀 ERKI DASHBOARD - PROJECT INITIALIZATION            │"
echo "│  Apple-Grade Personal Operating System                 │"
echo "└─────────────────────────────────────────────────────────┘"
echo ""

# ================================================================
# PHASE 1: Validation & Prerequisites
# ================================================================

echo "📋 Phase 1: Validating Prerequisites..."

# Check Node.js version (Required: 18.17+)
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18.17 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check pnpm (Recommended) or npm
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    echo "✅ pnpm detected - Using pnpm as package manager"
elif command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
    echo "⚠️  Using npm (pnpm recommended for better performance)"
else
    echo "❌ No package manager found. Please install npm or pnpm."
    exit 1
fi

echo ""

# ================================================================
# PHASE 2: Next.js 15 Project Initialization
# ================================================================

echo "📦 Phase 2: Initializing Next.js 15 Project..."

# Create Next.js app with TypeScript, Tailwind, App Router
if [ "$PKG_MANAGER" = "pnpm" ]; then
    pnpm create next-app@latest . --typescript --tailwind --app --use-pnpm --turbopack --no-src-dir --import-alias "@/*"
else
    npx create-next-app@latest . --typescript --tailwind --app --use-npm --turbopack --no-src-dir --import-alias "@/*"
fi

echo "✅ Next.js 15 initialized with TypeScript & Tailwind"
echo ""

# ================================================================
# PHASE 3: Install Core Dependencies
# ================================================================

echo "📚 Phase 3: Installing Dependencies..."

if [ "$PKG_MANAGER" = "pnpm" ]; then
    # Production dependencies
    pnpm add @supabase/supabase-js @supabase/ssr
    pnpm add r6api.js
    pnpm add framer-motion
    pnpm add lucide-react
    pnpm add next-themes
    pnpm add swr
    pnpm add date-fns
    pnpm add clsx tailwind-merge class-variance-authority

    # Dev dependencies
    pnpm add -D @types/node typescript
    pnpm add -D prettier prettier-plugin-tailwindcss
    pnpm add -D @tailwindcss/typography
else
    # npm version
    npm install @supabase/supabase-js @supabase/ssr
    npm install r6api.js
    npm install framer-motion lucide-react next-themes swr date-fns
    npm install clsx tailwind-merge class-variance-authority
    npm install -D @types/node typescript
    npm install -D prettier prettier-plugin-tailwindcss
    npm install -D @tailwindcss/typography
fi

echo "✅ Core dependencies installed"
echo ""

# ================================================================
# PHASE 4: Shadcn UI Setup
# ================================================================

echo "🎨 Phase 4: Setting up Shadcn UI..."

# Initialize shadcn with default config
if [ "$PKG_MANAGER" = "pnpm" ]; then
    pnpm dlx shadcn@latest init -d
else
    npx shadcn@latest init -d
fi

# Install essential shadcn components
COMPONENTS="button card dropdown-menu input label separator switch table badge avatar skeleton dialog tabs"

for component in $COMPONENTS; do
    echo "  Installing $component..."
    if [ "$PKG_MANAGER" = "pnpm" ]; then
        pnpm dlx shadcn@latest add $component -y
    else
        npx shadcn@latest add $component -y
    fi
done

echo "✅ Shadcn UI components installed"
echo ""

# ================================================================
# PHASE 5: Directory Structure Generation
# ================================================================

echo "📁 Phase 5: Creating Project Structure..."

# Create main app directory structure
mkdir -p app/\(auth\)/login
mkdir -p app/\(auth\)/auth/callback
mkdir -p app/\(dashboard\)/admin
mkdir -p app/api/r6
mkdir -p app/pending

# Create components structure
mkdir -p components/ui
mkdir -p components/shared
mkdir -p components/features/r6
mkdir -p components/features/admin

# Create lib structure
mkdir -p lib/supabase
mkdir -p lib/services
mkdir -p lib/utils

# Create types directory
mkdir -p types

# Create public directory assets
mkdir -p public/icons

echo "✅ Directory structure created"
echo ""

# ================================================================
# PHASE 6: Environment Setup
# ================================================================

echo "🔐 Phase 6: Creating Environment Template..."

cat > .env.local.template << 'EOF'
# ================================================================
# ERKI DASHBOARD - ENVIRONMENT VARIABLES
# ================================================================
# INSTRUCTIONS:
# 1. Copy this file to .env.local
# 2. Fill in all values
# 3. NEVER commit .env.local to version control
# ================================================================

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Ubisoft API Credentials (Rainbow Six)
UBI_EMAIL=your_ubisoft_email
UBI_PASSWORD=your_ubisoft_password

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

# Add to .gitignore
cat >> .gitignore << 'EOF'

# Environment variables
.env.local
.env.production
.env

# Supabase
supabase/.branches
supabase/.temp
EOF

echo "✅ Environment template created (.env.local.template)"
echo ""

# ================================================================
# PHASE 7: Git Initialization
# ================================================================

echo "📝 Phase 7: Git Setup..."

if [ ! -d .git ]; then
    git init
    echo "✅ Git repository initialized"
else
    echo "⚠️  Git repository already exists"
fi

echo ""

# ================================================================
# COMPLETION
# ================================================================

echo "┌─────────────────────────────────────────────────────────┐"
echo "│  ✅ INITIALIZATION COMPLETE                             │"
echo "└─────────────────────────────────────────────────────────┘"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. 🗄️  Setup Supabase:"
echo "   - Create a new project at https://supabase.com"
echo "   - Run the SQL migration: supabase-schema.sql"
echo "   - Generate types: npm run supabase:types"
echo ""
echo "2. 🔐 Configure Environment:"
echo "   - Copy .env.local.template to .env.local"
echo "   - Fill in all required values"
echo ""
echo "3. 🚀 Start Development:"
echo "   - Run: $PKG_MANAGER dev"
echo "   - Open: http://localhost:3000"
echo ""
echo "4. 📖 Read SETUP-GUIDE.md for detailed instructions"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
