# Multi-Room Platformer & KYX Builder

This repo bundles **three** components of the KYX experience:

1. **`demo-game/`** – a pygame-ce + pygbag multi-room platformer inspired by Hollow Knight, complete with sprinting, dashing, dust FX, and smarter enemy AI.
2. **`landing-page/`** – a Next.js 14 site with AI-powered game creation, user authentication, community features, and a dashboard for managing games.
3. **`build-service/`** – a Python Flask service that builds games using pygbag and deploys them to Supabase Storage.

## 🎮 Full Platform Features

- **AI Game Generation**: Describe your game idea and GPT-4 generates the Python code
- **Community Platform**: Share games, like, comment, and discover other creators
- **User Authentication**: Sign up with email/password via Supabase
- **Build System**: Separate Python service converts games to WebAssembly
- **Cloud Storage**: Games hosted on Supabase Storage
- **Dashboard**: Track build status and manage your published games

## Gameplay Features

- Multi-room exploration with wraparound transitions, parallax silhouettes, and ambient fireflies
- Sprint (Shift) and dash (Ctrl/J) with cooldown, reduced gravity, and runway dust particles
- Variable jump height, friction-based movement, and Hollow Knight-inspired character art
- Health system with glowing HUD orbs, invulnerability frames, knockback, and game-over overlays
- Enemies driven by patrol/chase/attack states, edge awareness, and vertical navigation
- JSON-configured lore injected via the Madlib lab and surfaced in the playable iframe

## Repository Layout

- `demo-game/main.py` – Python/pygame game logic
- `demo-game/build/` – Output of `pygbag main.py` (WebAssembly bundle + APK)
- `demo-game/game_config.json` – Story + tuning values merged into the runtime at launch
- `landing-page/` – Next.js marketing site, game creator, and community platform
- `build-service/` – **Python Flask build service** (see [Build Service Guide](./build-service/DEPLOY_GUIDE.md))
- Root docs (`README.md`, `INDEX.md`, `SETUP.md`, `ARCHITECTURE.md`)

## 🚀 Quick Start (Full Platform)

### 1. Deploy the Build Service First

The build service is required for users to build and publish games. See the [Build Service Deploy Guide](./build-service/DEPLOY_GUIDE.md) for step-by-step instructions.

**TL;DR**: Deploy `build-service/` to Railway (free), set environment variables, get the service URL.

### 2. Configure Vercel Environment Variables

Add these to your Vercel project (in addition to Supabase and OpenAI keys):
- `BUILD_SERVICE_URL` - Your deployed build service URL
- `BUILD_SERVICE_SECRET` - Shared secret for authentication

### 3. Done!

Users can now:
1. Create games with AI on your site
2. Build and publish games (processed by the build service)
3. Share games in the community
4. Play games directly in the browser

## Requirements

- Python 3.8+ (3.12 used here)
- `pygame-ce` and `pygbag` (installed via `requirements.txt`)
- Node 18+ (for the Next.js site)

## Python Game Setup

### Install Dependencies

> ⚠️ This project uses **pygame-ce**, not the original pygame.

```bash
pip uninstall pygame          # only if vanilla pygame is installed
pip install -r requirements.txt
```

Verify:

```bash
python -c "import pygame; print(pygame.version.ver)"
```

### Run Locally

```bash
cd demo-game
python main.py
```

### Build for the Web (pygbag)

```bash
cd demo-game
pygbag main.py
```

This compiles to WebAssembly, serves a preview at <http://localhost:8000>, and writes the distributable bundle into `demo-game/build/web/`.

To update the website embed, copy the build into the Next.js public folder:

```bash
rm -rf landing-page/public/demo-game
cp -r demo-game/build/web landing-page/public/demo-game
```

After copying, re-run `npm run build` inside `landing-page/` and redeploy (e.g., via Vercel) so `/demo-game/index.html` serves the refreshed build.

## Controls

| Action | Input |
| --- | --- |
| Move | Arrow keys or WASD |
| Sprint | Left/Right Shift |
| Dash | Ctrl / J (short cooldown) |
| Jump | Space / Up Arrow (hold for higher) |
| Room change | Walk off screen edges |

## Key Mechanics

- **Physics** – Variable jumps, friction, reduced-gravity dashes
- **FX** – Hollow Knight-inspired palette, cloak animation, dust particles, fireflies, parallax layers
- **Health** – Orb HUD, invulnerability flashes, knockback, death overlay
- **AI** – Patrol/chase/attack state machine, edge detection, jump decisions, separate horizontal/vertical collision resolution
- **HUD** – Instruction stack, health orbs, dynamic game-over messaging

## Game Config (no JSON editing required)

The Python runtime merges `demo-game/game_config.json` with hard-coded defaults at start-up. Update this file (or supply a generated payload from the Madlib lab) to change:

- Story beats: lead/codename, rival, hub name/description, victory text, tone/difficulty labels
- HUD copy: game-over title/message, up to three custom instruction lines
- Visual palette: accent, HUD glow, background gradient (hex or RGB tuples)
- Tuning knobs: player max health, run multiplier, dash speed, enemy base speed

If a field is missing, the engine falls back to defaults—safe for untrusted configs.

## Customization

Beyond the config file, `demo-game/main.py` exposes constants for window size, gravity, dash timings, palette, and room layouts. Add new `Room` instances or enemies, tweak the Hollow Knight palette, or hook up new sprites as needed.

### Automated Build Script

The helper script wraps the manual steps:

```bash
python tools/build_game.py --config ~/Downloads/madlib.json --slug campus-demo
```

It validates the JSON, writes `demo-game/game_config.json`, runs `pygbag main.py`, and copies `demo-game/build/web` into `dist/campus-demo/`. Pass `--skip-build` if you only want to update the config.

## Website (landing-page/)

```bash
cd landing-page
npm install
npm run dev   # local preview
npm run lint  # strict Next.js preset
npm run build # production build
```

Key files:

- `app/page.tsx` – marketing content, iframe embed, engine pipeline explanation
- `app/lab/page.tsx` – Madlib UI that emits the JSON stored in `lib/schemas.ts`
- `lib/schemas.ts` – Zod schema + TypeScript types shared by UI and API
- `app/api/madlib/route.ts` – Validates payloads and echoes the config consumed by `demo-game/main.py`
- `public/demo-game/` – static pygbag bundle served at `/demo-game/index.html`

### Recommended Deployment Settings

- Framework preset: **Next.js**
- Build command: `npm run build` (default)
- Output: `.next`

### Build API (experimental)

`POST /api/build` accepts the same payload produced by the Madlib lab, writes it to `demo-game/game_config.json`, runs `tools/build_game.py`, and copies the bundle into `landing-page/public/generated/<slug>/`. The response includes a permalink such as `/generated/<slug>/index.html`.

> **Important**: This route shells out to Python. In production you must provide a runtime with Python 3.12, `pygbag`, and `pygame-ce` installed (set `KYX_PYTHON` to the interpreter path if `python3` is not on `$PATH`). On Vercel or other serverless platforms, consider offloading builds to a queue/worker or GitHub Action.

### Prompt-to-config API

`POST /api/generate-config` body:

```json
{ "prompt": "I want a neon rooftop game about hopeful couriers" }
```

The route applies lightweight heuristics (keywords, fallback names, palette themes) to emit a `game_config` payload you can feed directly into `/api/build` or the CLI helper. Replace the AI layer later if you integrate a real LLM.

## Workflow Recap

1. Adjust story/lore via the Madlib lab and download the JSON.
2. Drop the payload into `demo-game/game_config.json` (or merge it server-side).
3. Run `pygbag main.py` from `demo-game/` (or use `python tools/build_game.py --config payload.json`).
4. Copy `demo-game/build/web/*` into `landing-page/public/demo-game/` **or** let the build API publish to `/generated/<slug>`.
5. `npm run build` in `landing-page/` and redeploy (Vercel, etc.).

## New Features (Community Platform)

The KYX platform now includes a full-featured community system:

- **User Accounts**: Sign up with email or GitHub OAuth
- **Game Creation**: Describe your game in natural language, get a fully configured platformer
- **Async Builds**: Queue-based build system with status tracking
- **Community Pages**: Browse, play, and comment on games created by others
- **Dashboard**: Manage your games, track stats, publish/unpublish
- **Moderation**: Content filters, rate limiting, and admin tools

### Quick Start (New Platform)

1. **Set up Supabase**: Follow `SETUP.md` for complete instructions
2. **Configure environment**: Copy `.env.local.example` and fill in your Supabase credentials
3. **Run migrations**: Execute `landing-page/supabase-schema.sql` in your Supabase SQL editor
4. **Start the server**: `cd landing-page && npm run dev`
5. **Create an account**: Visit `/auth/sign-up`
6. **Build your game**: Go to `/lab` and describe your game!

See `SETUP.md` for detailed setup instructions.

## License

Open source – modify, extend, and redistribute freely.
