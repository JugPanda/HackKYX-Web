# 16-bit Style 2D Platformer

A retro-style 2D platformer game built with pygame-ce and pygbag, featuring classic 16-bit inspired graphics and smooth platforming mechanics.

## Features

- Classic 16-bit style pixel art graphics
- Smooth player movement with physics
- Jump mechanics with gravity
- Multiple platforms to navigate
- Collision detection
- Web-ready with pygbag support

## Requirements

- Python 3.8 or higher
- pygame-ce
- pygbag (for web deployment)

## Installation

### Important: pygame-ce vs pygame

This project uses **pygame-ce** (Community Edition), not the original pygame. If you have the original pygame installed, it may conflict. Follow these steps:

1. **Uninstall original pygame (if installed):**
```bash
pip uninstall pygame
```

2. **Install pygame-ce and other dependencies:**
```bash
pip install -r requirements.txt
```

3. **Verify installation:**
```bash
python -c "import pygame; print(pygame.version.ver)"
```

If you see an import error, make sure:
- You're using the correct Python environment
- pygame-ce is installed (not the original pygame)
- Your IDE is using the correct Python interpreter

## Running the Game

### Local Development

Run the game locally:
```bash
python main.py
```

### Web Deployment with pygbag

To build and run the game in a web browser:

```bash
pygbag main.py
```

This will start a local server and open the game in your browser. The game will be accessible at `http://localhost:8000`

## Controls

- **Arrow Keys** or **WASD**: Move left/right
- **Space** or **Up Arrow** or **W**: Jump
- **ESC**: Quit game

## Game Mechanics

- **Gravity**: Player falls naturally when not on a platform
- **Jumping**: Press space to jump when on the ground
- **Movement**: Smooth horizontal movement with friction
- **Collision**: Precise collision detection with platforms

## Project Structure

```
.
├── main.py              # Main game file
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Customization

You can easily customize the game by modifying constants in `main.py`:

- `SCREEN_WIDTH` / `SCREEN_HEIGHT`: Game window size
- `GRAVITY`: How fast the player falls
- `JUMP_STRENGTH`: How high the player jumps
- `PLAYER_SPEED`: Horizontal movement speed
- Colors: Modify the color constants for different palettes

## Adding More Features

The game structure makes it easy to add:
- Enemies
- Collectibles
- Multiple levels
- Sound effects
- Sprite animations
- Power-ups

## License

This project is open source and available for modification and distribution.

