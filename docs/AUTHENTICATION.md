# OBHASH Authentication Architecture

**Phase:** 2 of 8  
**Provider:** Supabase Auth (`@supabase/ssr`)  
**Security Model:** HTTP-only secure cookie session synchronization  

---

## 1. Authentication Flow Architecture

```
User Browser                       Next.js Server                       Supabase Auth
     │                                    │                                    │
     │ 1. POST /signup (FormData)         │                                    │
     ├───────────────────────────────────►│                                    │
     │                                    │ 2. supabase.auth.signUp()          │
     │                                    ├───────────────────────────────────►│
     │                                    │                                    │
     │                                    │ 3. Session tokens / confirm email  │
     │                                    │◄───────────────────────────────────┤
     │ 4. Redirect to /onboarding         │                                    │
     │◄───────────────────────────────────┤                                    │
     │                                    │                                    │
     │ 5. GET /dashboard (Cookie: sb-...) │                                    │
     ├───────────────────────────────────►│                                    │
     │                                    │ 6. middleware validates session    │
     │                                    ├───────────────────────────────────►│
     │ 7. Renders personalized dashboard  │                                    │
     │◄───────────────────────────────────┤                                    │
```

---

## 2. Authentication Routes & Handlers

| Route | Type | Purpose | Access Control |
|---|---|---|---|
| `/login` | Page (Client) | User sign-in with email and password | Public (Redirects to `/dashboard` if authenticated) |
| `/signup` | Page (Client) | User registration with input validation | Public (Redirects to `/dashboard` if authenticated) |
| `/forgot-password` | Page (Client) | Password recovery request form | Public |
| `/reset-password` | Page (Client) | Secure password update form | Authenticated / Recovery token session |
| `/auth/callback` | Route Handler | Supabase OAuth & email confirmation code exchange | Public |

---

## 3. Server Actions (`src/lib/auth/actions.ts`)

- **`signUpAction(formData)`**:
  - Validates email syntax, password length (minimum 8 characters), and matching confirmation.
  - Invokes `supabase.auth.signUp()`.
  - Upserts starting profile row and redirects to `/onboarding`.
- **`signInAction(formData)`**:
  - Validates credentials and calls `supabase.auth.signInWithPassword()`.
  - Checks user profile `onboarding_completed` flag.
  - Redirects to `/onboarding` if incomplete, or `/dashboard` if complete.
- **`signOutAction()`**:
  - Calls `supabase.auth.signOut()`.
  - Invalidates session cookies and redirects to `/login`.
- **`resetPasswordForEmailAction(formData)`**:
  - Calls `supabase.auth.resetPasswordForEmail()`.
  - Generates recovery link targeting `/auth/callback?next=/reset-password`.
- **`updatePasswordAction(formData)`**:
  - Calls `supabase.auth.updateUser({ password })`.

---

## 4. Route Protection (`src/middleware.ts`)

The Next.js root middleware:
1. Refreshes the Supabase auth session token using `@supabase/ssr` cookies handler.
2. Identifies protected routes:
   - `/dashboard`
   - `/dashboard/:path*`
   - `/onboarding`
   - `/settings`
3. If an unauthenticated user requests a protected route:
   Redirects to `/login?redirectTo=${pathname}`.
4. If an authenticated user requests an auth route (`/login`, `/signup`, `/forgot-password`):
   Redirects to `/dashboard`.
5. Graceful handling: In environments where Supabase is not yet provisioned, middleware safely bypasses redirects to prevent infinite redirect loops, allowing pages to display configuration instructions.
