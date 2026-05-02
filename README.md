# 📄 Paperly

[![CI/CD → Vercel Production](https://github.com/N1kunj1998/paperly/actions/workflows/deploy.yml/badge.svg)](https://github.com/N1kunj1998/paperly/actions/workflows/deploy.yml)

**Professional documents in under 60 seconds.**
Create invoices, receipts, and quotes. Download as PDF or share a link. No account needed.

🚀 **[Try it live → app-eta-liart-srjrvylfxi.vercel.app](https://app-eta-liart-srjrvylfxi.vercel.app)**

---

## Features

- ⚡ **Live preview** — see your document update as you type
- 📄 **3 templates** — Invoice, Receipt, Quote
- 🔗 **Shareable links** — every doc gets a unique URL
- 📥 **PDF download** — one-click browser print to PDF
- 🔐 **No signup required** — just fill and go

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (Postgres) |
| Deployment | Vercel |
| CI/CD | GitHub Actions |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/N1kunj1998/paperly.git
cd paperly

# Install dependencies
npm install

# Set up env vars
cp .env.example .env.local
# Fill in your Supabase URL and anon key

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
create table documents (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('invoice', 'receipt', 'quote')),
  slug text unique not null,
  data jsonb not null default '{}',
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) on delete cascade
);

alter table documents enable row level security;
create policy "Public read by slug" on documents for select using (true);
create policy "Public insert" on documents for insert with check (true);
```

## CI/CD

Every push to `main` triggers:
1. TypeScript type check
2. Production build
3. Auto-deploy to Vercel

## License

MIT
