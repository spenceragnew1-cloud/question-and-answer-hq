# Setup Instructions

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the schema from `database/schema.sql`
3. Copy your Supabase URL and keys from Settings > API

## 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Admin
ADMIN_SECRET=your_secure_admin_password_here

# Cron
CRON_SECRET=your_secure_cron_secret_here

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, update `NEXT_PUBLIC_SITE_URL` to your production domain.

## 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 5. Set Up GitHub Actions (for Production)

1. Go to your GitHub repository Settings > Secrets and variables > Actions
2. Add the following secrets:
   - `SITE_URL`: Your production site URL (e.g., https://questionandanswerhq.com)
   - `CRON_SECRET`: The same value as in your `.env.local`

3. The workflow will automatically run daily at 3 AM UTC to generate questions

## 6. Initial Setup

1. Log in to the admin dashboard at `/admin/login` using your `ADMIN_SECRET` password
2. Add some hack ideas in the admin panel at `/admin/ideas`
3. The cron job will automatically generate drafts from these ideas daily
4. Review and publish questions from the admin dashboard

## Database Schema

The database schema is defined in `database/schema.sql`. Run this in your Supabase SQL Editor to create all necessary tables and indexes.

## Features

- ✅ Public question library with search and filtering
- ✅ Category-based organization
- ✅ Admin dashboard for content management
- ✅ Automated draft generation via OpenAI
- ✅ Scheduled publishing
- ✅ SEO-optimized pages with sitemap
- ✅ Email subscription capture
- ✅ Related questions suggestions
- ✅ Question of the Day feature

