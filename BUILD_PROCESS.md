# How KYX Creates Games with Python & Pygbag

## Overview

When you click "Build & Publish Game", the KYX platform creates a real Python-based platformer game that runs in your browser. Here's how it works:

## The Build Pipeline

### 1. **User Input Collection** (`/lab` page)
- You describe your game (hero, enemies, goal)
- Choose mood and difficulty
- This data gets structured into a game configuration object

### 2. **Game Creation** (`/api/games/create`)
- Your configuration is validated against a schema
- A database entry is created with status: "draft"
- The game gets a unique slug (URL) based on your hero name

### 3. **Build Queue** (`/api/games/build`)
- The game is added to a build queue
- Status changes to "building"
- A background process is triggered

### 4. **Python Game Assembly** (`/api/games/process-build`)

This is where the magic happens:

#### Step A: Copy Base Game
```
demo-game/  (base Python game template)
  ├── main.py          # Core game engine
  ├── game_config.json # Configuration file
  └── assets/          # Sprites, sounds, etc.
```

The system copies these files to a temporary build directory.

#### Step B: Inject Your Configuration
```python
# Your custom config is written to game_config.json
{
  "story": {
    "title": "Astra Quinn",
    "leadName": "Astra Quinn",
    "rivalName": "The Mireborn",
    "goal": "Seal the rift beneath the lab",
    "tone": "hopeful",
    "difficulty": "nightmare"
  },
  "tuning": {
    "playerMaxHealth": 2,  # Because you chose "nightmare"
    "enemyBaseSpeed": 2.0
  },
  "colors": {
    "accent": "#10b981"  # Green for "hopeful"
  }
}
```

The Python game (`main.py`) reads this config file at runtime and applies:
- Character names in the HUD
- Enemy speed based on difficulty
- UI colors based on mood
- Health/damage values

#### Step C: Run Pygbag
```bash
pygbag --build build-directory/
```

**What is Pygbag?**
- Pygbag is a tool that converts Python games to WebAssembly
- It packages your Python code + Pygame into browser-compatible files
- Creates an `index.html` that runs Python in the browser using Pyodide

**Output:**
```
build-directory/
  ├── index.html       # Loads the WebAssembly module
  ├── main.py          # Your customized game code
  ├── game_config.json # Your settings
  └── build/
      ├── pygbag.js    # JavaScript loader
      └── python.wasm  # Python interpreter for browser
```

#### Step D: Upload to Supabase Storage
- The entire build folder is zipped
- Uploaded to Supabase Storage bucket: `game-bundles`
- A public URL is generated: `https://[project].supabase.co/storage/v1/object/public/game-bundles/[user]/[game-slug]/index.html`

### 5. **Game Ready!**
- Status changes to "published"
- Your game is now playable at: `/community/[username]/[game-slug]`
- The page embeds an iframe pointing to your game's `index.html`

## How Python Runs in the Browser

This is the coolest part:

1. **Pyodide**: A version of Python compiled to WebAssembly
2. **Pygame-ce**: A browser-compatible version of Pygame
3. **WebAssembly (WASM)**: Allows compiled languages to run in browsers at near-native speed

When someone visits your game:
```
Browser loads index.html
  → Loads python.wasm (Python interpreter)
  → Loads main.py (Your game code)
  → Loads game_config.json (Your settings)
  → Pygame renders to HTML5 Canvas
  → Game runs!
```

## The Python Game Engine

The `demo-game/main.py` file (1170+ lines) is a complete platformer engine:

**Features:**
- Multi-room system with portals
- Physics (gravity, jumping, collision)
- Enemy AI with patrol patterns
- Health system
- HUD rendering
- Configuration-driven (reads your JSON)

**Config Integration:**
```python
def load_config():
    with open('game_config.json') as f:
        config = json.load(f)
    
    # Apply your settings
    player.name = config['story']['leadName']
    player.max_health = config['tuning']['playerMaxHealth']
    ui_color = pygame.Color(config['colors']['accent'])
    
    # Generate enemies based on difficulty
    if config['story']['difficulty'] == 'nightmare':
        spawn_more_enemies()
```

## Why This Approach?

**Advantages:**
- ✅ Real Python code = powerful game logic
- ✅ Pygame = proven game framework
- ✅ WebAssembly = runs anywhere, no installs
- ✅ Configuration-driven = easy customization
- ✅ No backend servers needed = scales easily

**Limitations:**
- First load is slower (downloading Python interpreter)
- File size is larger (~10-15 MB)
- Some Pygame features aren't supported in browser

## Build Time

Typical build process:
- Config validation: < 1 second
- File copying: < 1 second
- Pygbag compilation: 10-30 seconds (depending on system)
- Upload to storage: 2-5 seconds

**Total: ~15-40 seconds**

## Future Enhancements

Potential improvements:
1. **Pre-compiled base**: Keep a cached pygbag build, only swap config
2. **Asset customization**: Upload custom sprites/sounds
3. **Code extensions**: Let users add custom Python behaviors
4. **Multiplayer**: Use WebSockets for real-time play
5. **Mobile builds**: Generate APK/IPA files

## Summary

Your simple form inputs → JSON config → Python game + config → Pygbag (WebAssembly) → Hosted game URL

That's how KYX turns "Astra Quinn vs The Mireborn" into a real playable game! 🎮

