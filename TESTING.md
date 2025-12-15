# Erki Dashboard - Testing Guide

This comprehensive guide will walk you through testing the complete authentication flow for the Erki Dashboard.

## Table of Contents
- [Prerequisites](#prerequisites)
- [A. First User Setup (Admin Creation)](#a-first-user-setup-admin-creation)
- [B. Testing the Approval Flow](#b-testing-the-approval-flow)
- [C. Testing Admin Features](#c-testing-admin-features)
- [D. Testing Navigation](#d-testing-navigation)
- [E. Testing Edge Cases](#e-testing-edge-cases)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin testing, ensure:

1. All environment variables are set in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `UBI_EMAIL`
   - `UBI_PASSWORD`

2. The database schema has been executed in Supabase:
   - Go to Supabase Dashboard > SQL Editor
   - Run the contents of `supabase-schema.sql`

3. The development server is running:
   ```bash
   npm run dev
   ```

4. You have access to your Supabase project dashboard at:
   https://supabase.com/dashboard/project/YOUR_PROJECT_ID

---

## A. First User Setup (Admin Creation)

The first user must be manually promoted to admin in the database. Follow these steps:

### Step 1: Create Your First Account

1. Navigate to `http://localhost:3000/login`
2. Click "Don't have an account? Sign up"
3. Enter your email and password (minimum 6 characters)
4. Click "Sign Up"
5. You should see: "Account created! Check your email for verification..."

### Step 2: Verify Your Email

1. Check your email inbox for a verification email from Supabase
2. Click the verification link
3. You'll be redirected to the app
4. You should land on the **Pending Approval page** (`/pending`)

### Step 3: Find Your User ID in Supabase

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to: **Authentication > Users**
4. Find your email in the list
5. Copy the **User ID** (it looks like: `12345678-1234-1234-1234-123456789abc`)

Alternatively, you can find it in the Table Editor:
1. Navigate to: **Table Editor > profiles**
2. Find your email in the table
3. Copy the `id` column value

### Step 4: Promote Yourself to Admin

1. In Supabase Dashboard, go to: **SQL Editor**
2. Click "New Query"
3. Paste the following SQL command (replace with your email):

```sql
-- Promote user to admin and approve them
UPDATE public.profiles
SET
  role = 'admin',
  is_approved = TRUE
WHERE email = 'your-email@example.com';
```

4. Click **Run** or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)
5. You should see: "Success. No rows returned"

### Step 5: Verify Admin Access

1. Return to the app at `http://localhost:3000`
2. You should be automatically redirected from `/pending` to the dashboard (`/`)
3. In the sidebar (desktop) or bottom nav (mobile), you should now see:
   - Dashboard
   - Analytics
   - Settings
   - **Admin** (this confirms you're an admin)

---

## B. Testing the Approval Flow

Now that you're an admin, test the complete user approval workflow:

### Step 1: Create a Test User Account

1. **Log out** from your admin account:
   - Click your profile in the sidebar
   - Click "Sign Out"

2. You'll be redirected to `/login`

3. Sign up with a new test email:
   - Click "Don't have an account? Sign up"
   - Use a different email (e.g., `testuser@example.com`)
   - Set a password (min 6 characters)
   - Click "Sign Up"

4. Check the test user's email and verify the account

### Step 2: Verify Pending State

After email verification, the test user should:

1. Be redirected to `/pending` page
2. See the "Access Pending" screen with:
   - Lock icon (animated)
   - "Your account has been created successfully..."
   - "Awaiting approval from administrator"
   - "What happens next?" instructions
   - "Sign Out" button

3. Try to access protected routes manually:
   - Type `http://localhost:3000/` in the browser
   - You should be **redirected back to `/pending`**
   - Try `http://localhost:3000/admin`
   - You should be **redirected back to `/pending`**

This confirms the middleware is working correctly!

### Step 3: Log Back in as Admin

1. Click "Sign Out" on the pending page
2. Log in with your admin credentials
3. You should land on the dashboard

### Step 4: Approve the Test User

1. Click **Admin** in the sidebar/bottom nav
2. You should see the Admin Panel with:
   - Total Users: 2
   - Approved: 1 (you)
   - Pending: 1 (test user)

3. In the User Management table, you should see:
   - Your admin account (with Shield icon, "Approved" status, "Revoke" button)
   - Test user account (with User icon, "Pending" status, "Approve" button)

4. Click **Approve** on the test user row
5. The button should change to "Updating..."
6. After a moment, the page will refresh and show:
   - Total Users: 2
   - Approved: 2
   - Pending: 0
   - Test user now shows "Approved" status and "Revoke" button

### Step 5: Verify Test User Can Access Dashboard

1. Log out from admin account
2. Log in with the test user credentials
3. Test user should now:
   - Successfully land on the dashboard (`/`)
   - See all navigation items EXCEPT "Admin"
   - Be able to navigate freely

4. Try to access admin panel manually:
   - Type `http://localhost:3000/admin` in browser
   - You should be **redirected to `/`** (dashboard)

This confirms non-admins are blocked from admin routes!

---

## C. Testing Admin Features

Test all admin panel functionality:

### 1. User Statistics

Verify the stats cards display correctly:
- **Total Users**: Should match the number of rows in the table
- **Approved**: Count of users with green "Approved" badges
- **Pending**: Count of users with yellow "Pending" badges

### 2. User Management Table

The table should display:
- User avatar (first letter of email in gradient circle)
- Email address
- Full name (if set, otherwise just email)
- Role badge (red "admin" or blue "user")
- Status badge (green "Approved" or yellow "Pending")
- Joined date (formatted as "MMM DD, YYYY")
- Action button ("Approve" or "Revoke")

### 3. Approval Toggle Functionality

Test approving and revoking:

1. As admin, create another test user (or use the previous one)
2. In the Admin panel, click **Revoke** on an approved user
3. Verify:
   - Button shows "Updating..."
   - Page refreshes
   - User now shows "Pending" status
   - "Pending" count increases
   - "Approved" count decreases

4. Click **Approve** to restore access
5. Verify stats update correctly

### 4. Real-time Testing

1. Keep admin panel open in one browser
2. Open a new incognito window
3. In incognito, log in as a pending user
4. They should see `/pending` page
5. In the admin panel, approve them
6. In incognito window, refresh the page
7. User should now access the dashboard

---

## D. Testing Navigation

Test navigation on both desktop and mobile:

### Desktop Navigation (Sidebar)

1. Resize browser to desktop width (> 768px)
2. Sidebar should be visible on the left
3. Test each navigation item:
   - **Dashboard** → Should navigate to `/` and highlight
   - **Analytics** → Future feature (may not be implemented yet)
   - **Settings** → Future feature
   - **Admin** (if admin) → Should navigate to `/admin` and highlight

4. Verify active route highlighting:
   - Current page should have gradient background
   - Icon and text should be white/highlighted

5. Profile section at bottom should show:
   - Avatar with first letter of email
   - Email address
   - Hover effect

### Mobile Navigation (Bottom Bar)

1. Resize browser to mobile width (< 768px)
2. Sidebar should disappear
3. Bottom navigation bar should appear
4. Test each icon:
   - Home icon → `/`
   - Chart icon → `/analytics`
   - Settings icon → `/settings`
   - Shield icon (if admin) → `/admin`

5. Verify:
   - Active route is highlighted
   - Icons are tappable
   - Navigation is fixed at bottom

### Route Protection

Manually test these URL patterns:

| Route | Unauthenticated | Pending User | Approved User | Admin |
|-------|----------------|--------------|---------------|-------|
| `/login` | ✓ Allowed | → Redirect to `/` | → Redirect to `/` | → Redirect to `/` |
| `/pending` | → Redirect to `/login` | ✓ Allowed | → Redirect to `/` | → Redirect to `/` |
| `/` (dashboard) | → Redirect to `/login` | → Redirect to `/pending` | ✓ Allowed | ✓ Allowed |
| `/admin` | → Redirect to `/login` | → Redirect to `/pending` | → Redirect to `/` | ✓ Allowed |

---

## E. Testing Edge Cases

### 1. Session Persistence

1. Log in as a user
2. Close the browser tab
3. Open a new tab to `http://localhost:3000`
4. You should still be logged in (no redirect to login)

### 2. Middleware Cookie Refresh

1. Stay logged in for 5+ minutes
2. Navigate between pages
3. Session should remain active (middleware refreshes cookies)

### 3. Profile Creation

1. Create a new user via signup
2. Go to Supabase Dashboard > Table Editor > profiles
3. Verify a profile was automatically created with:
   - `id` matching the auth user ID
   - `email` from signup
   - `role` = "user"
   - `is_approved` = false
   - `created_at` timestamp

### 4. Email Already Exists

1. Try to sign up with an email that already exists
2. You should see an error: "User already registered"

### 5. Invalid Credentials

1. Try to log in with wrong password
2. You should see an error message
3. Should not redirect or show pending page

### 6. Logout Flow

1. Log in as any user
2. Click "Sign Out"
3. You should be redirected to `/login`
4. Try to access `/` or `/admin`
5. Should redirect back to `/login`

---

## Troubleshooting

### Issue: "Profile not found" in console

**Solution**: The database trigger to create profiles on signup may not be working.

Manually create profile:
```sql
INSERT INTO public.profiles (id, email, role, is_approved)
VALUES (
  'USER_ID_FROM_AUTH_USERS',
  'user@example.com',
  'user',
  false
);
```

### Issue: Stuck on pending page even after approval

**Solution**:
1. Clear browser cookies
2. Log out and log back in
3. Check Supabase Table Editor to verify `is_approved = true`

### Issue: Can't access admin panel as admin

**Solution**:
1. Verify in Supabase: `role = 'admin'` AND `is_approved = true`
2. Check middleware logs in console
3. Try hard refresh (Ctrl+Shift+R)

### Issue: Middleware not redirecting

**Solution**:
1. Check `middleware.ts` is in the project root
2. Verify `matcher` config is correct
3. Restart dev server: `npm run dev`

### Issue: Types errors in IDE

**Solution**:
1. Install Supabase CLI: `npm install -g supabase`
2. Link project: `npm run supabase:link`
3. Generate types: `npm run supabase:types`
4. Restart TypeScript server in your IDE

---

## Success Criteria

You can consider the authentication flow fully tested when:

- [ ] First user can be promoted to admin via SQL
- [ ] New signups land on pending page
- [ ] Pending users cannot access protected routes
- [ ] Admin can see and approve pending users
- [ ] Approved users can access dashboard
- [ ] Non-admins cannot access `/admin` route
- [ ] Admin panel displays accurate statistics
- [ ] Approval/revoke toggle works correctly
- [ ] Navigation highlights active routes
- [ ] Mobile and desktop layouts work correctly
- [ ] Logout redirects to login page
- [ ] Session persists across page refreshes
- [ ] Middleware enforces all security rules

---

## Next Steps

After successful testing:

1. **Generate Types**: Install Supabase CLI and run `npm run supabase:types`
2. **Build for Production**: Run `npm run build` to check for errors
3. **Deploy**: Follow `DEPLOYMENT-CHECKLIST.md`
4. **Monitor**: Set up error tracking and logging
5. **Iterate**: Add more features (R6 stats, analytics, etc.)

---

**Need Help?**

- Check the console for errors
- Review middleware logs
- Inspect Supabase Dashboard > Table Editor
- Check Authentication > Users for account status
- Refer to `README.md` for project overview
