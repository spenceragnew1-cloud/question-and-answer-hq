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

### Netlify (via GitHub)

1. **Connect to Netlify**:
   - Go to [Netlify](https://www.netlify.com/) and sign in
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account and select this repository
   - Netlify will automatically detect the `netlify.toml` configuration

2. **Configure environment variables**:
   - In your Netlify site dashboard, go to Site settings → Environment variables
   - Add all the environment variables listed above:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `OPENAI_API_KEY`
     - `ADMIN_SECRET`
     - `CRON_SECRET`
     - `NEXT_PUBLIC_SITE_URL`

3. **Deploy**:
   - Netlify will automatically build and deploy your site
   - Future pushes to your main branch will trigger automatic deployments

4. **Configure cron jobs** (for daily question generation):
   - Go to Site settings → Functions → Scheduled functions
   - Or set up a Netlify Scheduled Function or use an external service to ping your `/api/cron/generate-questions` endpoint

### Alternative: Vercel

Deploy to Vercel and configure:
- Environment variables in Vercel dashboard
- GitHub Actions workflow for daily cron job (runs at 3 AM)

