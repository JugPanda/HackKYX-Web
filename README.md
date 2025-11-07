# HackKentucky-KYX - 2D 16-bit Platformer

A 2D platformer game built with Python and Pygame, featuring a 16-bit retro aesthetic. Playable both on desktop and in web browsers!

## Features

- 🎮 Classic 2D platformer gameplay
- 🎨 16-bit inspired pixel art style
- 🏃 Smooth player movement and jumping
- 🏗️ Platform system with collision detection
- 📷 Camera system that follows the player
- ⚡ 60 FPS gameplay
- 🌐 Web-compatible using pygbag

## Requirements

- Python 3.7 or higher
- Pygame 2.5.0 or higher
- pygbag 0.7.0 or higher (for web deployment)

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## How to Play

### Desktop Version

1. Run the game:
```bash
python main.py
```

2. Controls:
   - **A** or **Left Arrow**: Move left
   - **D** or **Right Arrow**: Move right
   - **Space**: Jump
   - **ESC**: Quit game

### Web Version

1. Build for web:
```bash
python -m pygbag main.py
```

2. This will:
   - Compile the game to WebAssembly
   - Start a local web server
   - Open the game in your browser

3. The game will be available at `http://localhost:8000`

4. To build for production deployment:
```bash
python -m pygbag --build main.py
```

   Or use the convenience scripts:
   - Windows: `build_web.bat`
   - Linux/Mac: `./build_web.sh`

5. Deploy the `build/web` directory to any web hosting service

**Note**: Web controls work the same as desktop. Make sure your browser window has focus for keyboard input.

### Quick Test in Browser

Use the convenience scripts to quickly test in browser:
- Windows: `run_web.bat`
- Linux/Mac: `./run_web.sh`

## Game Structure

- `main.py`: Main game loop and initialization
- `player.py`: Player class with movement and physics
- `platform.py`: Platform class for level geometry
- `camera.py`: Camera system for following the player

## Future Enhancements

- Sprite animations
- Multiple levels
- Enemies and combat
- Collectibles and power-ups
- Sound effects and music
- More detailed 16-bit style graphics
- Level editor

## License

This project is part of HackKentucky-KYX.
