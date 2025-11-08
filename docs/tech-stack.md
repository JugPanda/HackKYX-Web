# KYX Platform Tech Stack

## At a Glance
- Dual surface: `landing-page/` (Next.js marketing + community UI) and `demo-game/` (Python/pygame platformer shipped through pygbag)
- Shared config JSON generated via the Madlib lab UI or `/api/generate-config`, consumed by both the Python runtime and Next.js APIs
- Supabase handles PostgreSQL data, authentication, and storage for published WebAssembly bundles

## Frontend (landing-page/)
- **Next.js 14 (App Router) & React 18** for server components, streaming routes, and client-side interactivity
- **TypeScript** across app routes, API handlers, and shared schema utilities
- **Tailwind CSS** plus **shadcn/ui** primitives for layout, theming, and accessible components
- **Lucide React** icons and **next-themes** for light/dark mode support
- Madlib lab UI on `/lab` that emits config JSON and posts to the build pipeline
- Community surfaces: `/community`, `/dashboard`, `/auth/*` built atop Supabase auth helpers and route middleware

## Backend & APIs
- Next.js API routes (`app/api/*`) for game CRUD, build queue orchestration, prompt-to-config generation, comments, reports, and moderation
- Supabase client for server-side actions plus RLS-protected access from the browser
- Rate limiting + content filtering utilities (in-memory guards plus heuristics on user-generated text)
- Build processor endpoints (`/api/games/build`, `/api/games/process-build`) shell out to Python, monitor status rows, and upload bundles to storage

## Game Engine (demo-game/)
- **Python 3.12** runtime with `pygame-ce` for rendering, physics, and input
- **pygbag** compiles the platformer to WebAssembly for iframe embedding
- `tools/build_game.py` CLI wraps config writing, pygbag execution, and artifact copying
- `game_config.json` merges Madlib output with engine defaults at launch

## Data & Infrastructure
- **Supabase PostgreSQL** tables: `profiles`, `games`, `build_queue`, `likes`, `comments`, `reports`
- **Supabase Auth** (email/password + GitHub OAuth) with RLS policies enforced per table
- **Supabase Storage** `game-bundles` bucket holds public WebAssembly builds referenced by `/community/[username]/[slug]`
- Recommended deployment: Next.js on Vercel + worker/queue (Railway/Fly/etc.) for long-running pygbag builds

## Developer Tooling & Workflow
- Node 18+ toolchain: `npm run dev`, `npm run lint`, `npm run build`
- Python requirements pinned via `requirements.txt`; local loop is `python main.py` for the game and `pygbag main.py` for web builds
- Automated workflow summary:
  1. Author lore in Madlib lab or via `/api/generate-config`
  2. Persist config, queue build with `/api/games/build`, and monitor `build_queue`
  3. Python worker runs pygbag, uploads artifacts, and marks the game `built`
  4. Publish through `/api/games/publish` to surface in community feeds
