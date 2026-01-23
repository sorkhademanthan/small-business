# ReBook 📅 ⭐

![Next.js 15](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> **The "Set-and-Forget" Growth Engine for Local Service Businesses.**

**ReBook** is a specialized SaaS platform designed for high-volume local businesses (gyms, salons, clinics) to automate reputation management and minimize appointment no-shows[cite: 2, 6, 28].

---

## 🚀 The Problem

Local business owners are losing revenue in two invisible ways:

1.  **Revenue Bleed (No-Shows):** Last-minute cancellations and no-shows leave empty slots that cannot be refilled, directly killing revenue[cite: 28, 66].
2.  **Invisible Reputation:** Happy customers rarely leave reviews, while unhappy ones are vocal. Without a system, online trust and search visibility remain low[cite: 6, 65].

## 🛠️ The Solution

ReBook plugs into existing workflows (WhatsApp, Google Calendar) to solve these problems automatically:

* **🛡️ No-Show Killer:** Automated SMS/WhatsApp reminders sent 24 hours and 3 hours before appointments. Customers can confirm or reschedule with one tap[cite: 30, 32, 33].
* **⭐ Review Autopilot:** Triggers a "Happy Moment" request after a successful visit. High ratings go to Google; low ratings go to a private feedback form (Smart Filtering)[cite: 13, 15, 16].
* **🤝 Referral Engine:** Tracks "Invite a Friend" links to identify top customer advocates and attribute revenue to specific referrers[cite: 18, 20].
* **📊 Zero-Learning Dashboard:** A single-view dashboard showing "Recovered Revenue," "New Reviews," and "Today's Schedule"[cite: 21, 42].

---

## 🏗️ Tech Stack

This project is built for scale using a modern, type-safe stack.

| Category | Technology | Reasoning |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15** (App Router) | React Server Components for performance & SEO[cite: 92]. |
| **Language** | **TypeScript** | Strict type safety for business logic. |
| **Styling** | **Tailwind CSS** + **shadcn/ui** | Rapid UI development with accessible components[cite: 94]. |
| **Database** | **PostgreSQL** (Supabase/Neon) | Relational data for complex booking/referral links[cite: 96]. |
| **ORM** | **Drizzle ORM** | Lightweight, type-safe SQL wrapper. |
| **Auth** | **Clerk** | Secure, multi-tenant authentication. |
| **Messaging** | **WhatsApp Business API** | High open rates for reminders in target markets (India/Global)[cite: 98]. |
| **Queues** | **Inngest** or **Vercel Cron** | Reliable scheduling for "24h before" reminders[cite: 153]. |

---

## 📂 Project Structure

The project follows a feature-based architecture within the `src` directory, organized by user role/context.

```
/src/app
├── (public)                 # Routes accessible to anyone
│   ├── page.tsx             # Marketing Landing Page (Hero, Pricing, Login)
│   ├── login/page.tsx       # Clerk Sign-in
│   └── signup/page.tsx      # Clerk Sign-up
│
├── (auth)                   # Routes requiring Owner Login
│   ├── layout.tsx           # Dashboard Shell (Sidebar + Topbar)
│   ├── onboarding/          # First-time setup (Business Name, Timezone)
│   ├── dashboard/           # Main "Today" View
│   ├── calendar/            # Full monthly calendar view
│   ├── customers/           # List of all customers
│   ├── settings/            # API Keys, Message Templates, Billing
│   └── analytics/           # ROI Charts & Deep dive stats
│
├── (external)               # Routes for End-Customers (No Login Required)
│   ├── book/[id]/page.tsx   # Public booking/rescheduling link
│   ├── review/[id]/page.tsx # "Happy Moment" feedback form
│   └── ref/[code]/page.tsx  # Referral landing page
│
└── api/                     # Backend Routes
    ├── webhooks/            # Clerk & Stripe listeners
    ├── cron/                # Vercel Cron (Reminders)
    └── whatsapp/            # Meta API callbacks
```

---

## 📂 Database Schema (High Level)

Based on the MVP scope[cite: 140, 141, 142, 143]:

* `businesses`: Stores settings, timezone, and Google Review links.
* `customers`: Profiles linked to a business.
* `appointments`: Stores time, status (confirmed/no-show), and reminder logs.
* `visits`: Historical data for triggering review requests.
* `automations`: Config for reminder timing and message templates.

---

## ⚡ Getting Started

### 1. Prerequisites
* Node.js 18+
* pnpm (`npm install -g pnpm`)
* A Supabase project (or local Postgres)
* A Clerk account

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/sorkhademanthan/small-business.git
cd small-business

# Install dependencies
pnpm install

# Install UI & Logic libraries
pnpm add clsx tailwind-merge lucide-react class-variance-authority date-fns framer-motion canvas-confetti react-hook-form @hookform/resolvers zod @clerk/nextjs drizzle-orm postgres
pnpm add -D drizzle-kit dotenv @types/canvas-confetti
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Database (Drizzle/Supabase)
DATABASE_URL="postgres://..."
DIRECT_URL="postgres://..."

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/login"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/signup"
```