# Project Index

This document provides a comprehensive index of all files in the HackKentucky-KYX project.

## Project Overview

This repository contains multiple game projects:
- A 16-bit style 2D platformer game
- A multi-room platformer game with room transitions
- A web-based mod creator interface for "Bottle Episodes" zombie game

---

## File Index

### Core Game Files

#### `main.py`
- **Type**: Python script
- **Description**: Main entry point for a 16-bit style 2D platformer game
- **Technology**: pygame-ce, pygbag
- **Features**:
  - Player movement with physics (left/right, jump)
  - Multiple platforms with collision detection
  - 16-bit inspired pixel art graphics
  - Gravity and friction mechanics
  - Web-ready with pygbag support
- **Controls**: Arrow Keys/WASD (move), Space/Up/W (jump), ESC (quit)
- **Lines**: 305

#### `Hack Game run 1.py`
- **Type**: Python script
- **Description**: Multi-room platformer game with room transitions
- **Technology**: pygame
- **Features**:
  - Player with advanced physics (variable jump height, friction)
  - Multiple rooms (5 rooms) with different platform layouts
  - Room transitions when walking off screen edges
  - Ground collision and platform collision detection
  - Visual feedback (velocity indicators, on-ground indicators)
- **Controls**: WASD/Arrow Keys (move), Space/Up (jump)
- **Lines**: 373

---

### Web Interface

#### `index.html`
- **Type**: HTML file
- **Description**: Web-based mod creator interface for "Bottle Episodes" zombie game
- **Features**:
  - Tabbed interface (Game Settings, Characters, Environment, Items)
  - Real-time JSON generation
  - Form-based mod configuration
  - JSON validation and download
  - Character preview
  - Modern dark theme UI with gradient backgrounds
- **Technology**: HTML5, CSS3, JavaScript (vanilla)
- **Lines**: 822

---

### Configuration Files

#### `requirements.txt`
- **Type**: Python dependencies file
- **Description**: Lists Python package dependencies
- **Dependencies**:
  - `pygame-ce>=2.3.0` - Community Edition of pygame
  - `pygbag>=0.6.0` - For web deployment of pygame games
- **Notes**: Includes instructions about uninstalling original pygame before installing pygame-ce

#### `example_mod.json`
- **Type**: JSON configuration file
- **Description**: Example mod configuration for the "Bottle Episodes" game
- **Content**: 
  - Mod info (name, description, version, author)
  - Game settings (difficulty, resources, spawn rates)
  - Player configuration (stats, abilities, color)
  - Environment settings (map, time of day, weather, hazards)
  - Items configuration (starting inventory, crafting)
- **Example Mod**: "Shadow Runner Mod (Shadow Runner theme)"

---

### Documentation

#### `README.md`
- **Type**: Markdown documentation
- **Description**: Main project documentation for the 16-bit platformer game
- **Contents**:
  - Project overview and features
  - Installation instructions (pygame-ce vs pygame)
  - Running instructions (local and web)
  - Controls and game mechanics
  - Project structure
  - Customization guide
  - Future feature suggestions
- **Lines**: 111

#### `INDEX.md` (this file)
- **Type**: Markdown documentation
- **Description**: Comprehensive index of all project files
- **Purpose**: Quick reference for project structure and file purposes

---

### Version Control

#### `.gitignore`
- **Type**: Git ignore rules
- **Description**: Specifies files and directories to ignore in version control
- **Ignores**:
  - Python cache files (`__pycache__/`, `*.pyc`)
  - Virtual environments (`venv/`, `env/`)
  - IDE files (`.vscode/`, `.idea/`)
  - OS files (`.DS_Store`, `Thumbs.db`)
  - Build artifacts (`build/`, `web/`, `*.wasm`, `*.data`)

---

## Project Structure

```
HackKentucky-KYX/
├── main.py                 # 16-bit platformer game
├── Hack Game run 1.py      # Multi-room platformer game
├── index.html              # Mod creator web interface
├── example_mod.json        # Example mod configuration
├── requirements.txt        # Python dependencies
├── README.md              # Main documentation
├── INDEX.md               # This file (project index)
└── .gitignore             # Git ignore rules
```

---

## Quick Reference

### Running the Games

**16-bit Platformer:**
```bash
python main.py
```

**Multi-room Platformer:**
```bash
python "Hack Game run 1.py"
```

**Web Mod Creator:**
- Open `index.html` in a web browser

### Installing Dependencies

```bash
pip install -r requirements.txt
```

**Note**: If you have the original `pygame` installed, uninstall it first:
```bash
pip uninstall pygame
pip install pygame-ce
```

---

## File Statistics

- **Total Python Files**: 2
- **Total HTML Files**: 1
- **Total JSON Files**: 1
- **Total Markdown Files**: 2
- **Total Configuration Files**: 2 (.gitignore, requirements.txt)

---

## Notes

- The project uses **pygame-ce** (Community Edition) instead of the original pygame
- Both Python games are platformers but with different mechanics and features
- The `index.html` file is a standalone web application (no server required)
- The `example_mod.json` demonstrates the expected format for mod configurations

---

*Last updated: Generated automatically*

