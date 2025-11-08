# Multi-Room Platformer & KYX Builder

This repo bundles two halves of the KYX experience:

1. `demo-game/` – a pygame-ce + pygbag multi-room platformer inspired by Hollow Knight, complete with sprinting, dashing, dust FX, and smarter enemy AI.
2. `landing-page/` – a Next.js 14 site that markets the engine, embeds the latest pygbag build, and hosts a Madlib-style config editor that outputs the JSON consumed by the Python game.

Use the Madlib lab to define characters and tone, run `pygbag` to regenerate the WebAssembly build, copy the bundle into `landing-page/public/demo-game/`, and redeploy so visitors can instantly play the refresh.

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
- `landing-page/` – Next.js marketing site and Madlib lab
- `landing-page/public/demo-game/` – Static copy of the latest pygbag build served by the site
- Root docs (`README.md`, `INDEX.md`, `notes.txt`) plus `requirements.txt`

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

## Customization

`demo-game/main.py` is heavily parameterized. Modify constants to change window size, gravity, dash speed, palette, and room layouts. Add new `Room` instances or enemies, tweak the Madlib-driven storyline, or hook up additional sprites.

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

## Workflow Recap

1. Adjust story/lore via the Madlib lab (or edit JSON manually).
2. Feed the payload into `demo-game/main.py` logic if needed.
3. Run `pygbag main.py` from `demo-game/` to regenerate the WebAssembly bundle.
4. Copy `demo-game/build/web/*` into `landing-page/public/demo-game/`.
5. `npm run build` in `landing-page/` and redeploy (Vercel, etc.).

## License

Open source – modify, extend, and redistribute freely.
