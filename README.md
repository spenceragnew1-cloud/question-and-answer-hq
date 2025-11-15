# QuestionAndAnswerHQ.com

A research-backed Question & Answer knowledge base with daily content, strong SEO, and automated draft generation.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your Supabase credentials, OpenAI API key, and secrets.

3. Set up Supabase database:
- Run the SQL schema from `database/schema.sql` in your Supabase SQL editor

4. Run the development server:
```bash
npm run dev
```

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for admin operations)
- `OPENAI_API_KEY` - Your OpenAI API key
- `ADMIN_SECRET` - Password for admin dashboard access
- `CRON_SECRET` - Secret for cron job authentication
- `NEXT_PUBLIC_SITE_URL` - Your site URL (for sitemap and SEO)

## Features

- Public question library with search and filtering
- Category-based organization
- Admin dashboard for content management
- Automated draft generation via OpenAI
- Scheduled publishing
- SEO-optimized pages with sitemap
- Email subscription capture

## Deployment

Deploy to Vercel and configure:
- Environment variables in Vercel dashboard
- GitHub Actions workflow for daily cron job (runs at 3 AM)

