# OLP - Vite React TypeScript Starter

This project is a demo online learning platform built with Vite + React + TypeScript and Tailwind.

## Production build

Build the app:

```powershell
npm install
npm run build
```

The production-ready files are generated in `dist/`.

## Environment variables (Supabase)

If you plan to use Supabase in production, set these environment variables at build time. Vite requires env vars exposed to client code to start with `VITE_`.

- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — your Supabase public anon key

Local development: create a `.env.local` (do NOT commit it) with:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
```

## Deploying to Vercel (recommended)

1. Push your repo to GitHub.
2. Sign in to Vercel and click "New Project" → Import Git Repository.
3. Configure (Vercel often autodetects Vite):
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables in Vercel Dashboard (Project → Settings → Environment Variables):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy. Vercel will build at deploy time using the provided env vars.

## Deploying to Netlify

1. Push your repo to GitHub.
2. Sign in to Netlify → "Add new site" → "Import from Git".
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in Site settings → Build & deploy → Environment → Environment variables.
5. Deploy.

## Notes about routing

- Vercel and Netlify handle SPA routing correctly. If you choose GitHub Pages, prefer `HashRouter` or add a redirect fallback because Pages doesn't support SPA fallback out-of-the-box.

## Quick push to GitHub (PowerShell)

```powershell
# run in project root
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Where the Supabase client lives

- `src/utils/supabaseClient.ts` — uses `import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Next steps I can do for you

- Connect the repo to Vercel/Netlify and configure env vars.
- Add GitHub Actions to build and deploy automatically.
- Replace localStorage with Supabase-backed auth/data.

Tell me what you'd like me to do next.