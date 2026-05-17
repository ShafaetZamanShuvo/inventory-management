# InvenTrack — Inventory Control System

A transparent, corruption-resistant inventory management system built with Next.js, TailwindCSS, Prisma, PostgreSQL (Neon), and deployed on Vercel.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | TailwindCSS |
| ORM | Prisma |
| Database | PostgreSQL via Neon |
| Auth | NextAuth.js (Credentials) |
| Deployment | Vercel |

---

## User Roles

| Role | Can Do |
|------|--------|
| **ENTRY_CLERK** | Create inventory entries (IN/OUT) |
| **APPROVER** | Everything above + approve or reject entries |
| **ADMIN** | Everything above + manage users + view reports |

---

## Setup Instructions

### 1. Clone and install

```bash
npm install
```

### 2. Set up Neon (PostgreSQL)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the **Connection string** from the dashboard

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:
- `DATABASE_URL` — your Neon connection string
- `NEXTAUTH_SECRET` — run `openssl rand -base64 32` to generate one
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev

### 4. Push the database schema

```bash
npx prisma db push
```

### 5. Seed default users

```bash
npm run db:seed
```

This creates:
- `admin@company.com` — Admin (password: `password123`)
- `approver@company.com` — Approver (password: `password123`)
- `clerk@company.com` — Entry Clerk (password: `password123`)

**Change these passwords immediately in production!**

### 6. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push your code to GitHub
2. Connect repo to [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL, e.g. `https://your-app.vercel.app`)
4. Deploy!

---

## Project Structure

```
inventory-app/
├── app/
│   ├── api/auth/[...nextauth]/   # NextAuth API route
│   ├── login/                    # Login page
│   ├── dashboard/                # Protected dashboard
│   │   ├── layout.tsx            # Auth guard + sidebar layout
│   │   ├── page.tsx              # Dashboard home (stats)
│   │   ├── entries/              # List all entries
│   │   ├── new-entry/            # Create new entry form
│   │   ├── approvals/            # Pending approvals (APPROVER+)
│   │   ├── reports/              # Reports (ADMIN only)
│   │   └── users/                # User management (ADMIN only)
│   ├── globals.css
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── Sidebar.tsx
│   └── TopBar.tsx
├── lib/
│   ├── auth.ts                   # NextAuth config
│   └── prisma.ts                 # Prisma client singleton
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.js                  # Default users
└── .env.local.example
```

---

## Next Pages to Build

- `/dashboard/entries` — Table of all entries with filters
- `/dashboard/new-entry` — Form: date, type, product, issuer, reason, quantity
- `/dashboard/approvals` — Pending entries for APPROVER to approve/reject
- `/dashboard/reports` — Summary charts by date/product/type
- `/dashboard/users` — Add/edit users (ADMIN)
