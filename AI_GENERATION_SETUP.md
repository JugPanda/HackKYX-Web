# AI Game Generation Setup

## Overview

KYX now uses OpenAI's GPT-4 to **generate unique Python game code** for each game, rather than just configuring a template. Each game is truly unique!

## How It Works

```
User Input → OpenAI GPT-4 → Python Code → Pygbag → Playable Game
```

1. User describes their game
2. System generates a detailed prompt
3. GPT-4 creates custom Python/Pygame code
4. Code is validated and stored
5. Pygbag compiles it to WebAssembly
6. Game is deployed and playable

## Setup Instructions

### 1. Get an OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)
5. **Important**: This will cost money per generation (~$0.10-0.30 per game)

### 2. Add to Environment Variables

Add this to your `.env.local` file:

```env
# OpenAI API Configuration
OPENAI_API_KEY=sk-your-actual-key-here
```

### 3. Run the Database Migration

```bash
# In the Supabase dashboard SQL editor, run:
cat landing-page/supabase-migration-generated-code.sql
```

Or manually:
```sql
ALTER TABLE games
ADD COLUMN IF NOT EXISTS generated_code TEXT;
```

### 4. Restart Your Dev Server

```bash
cd landing-page
npm run dev
```

## Testing

Try creating a game:

1. Go to `/lab`
2. Fill in: Hero = "Captain Nova", Enemy = "Space Pirates", Goal = "Rescue the station"
3. Click "Build & Publish Game"
4. Watch the console logs:
   - "Generating game code with AI..."
   - "Using AI-generated game code"
   - "Build completed successfully"

## What Gets Generated

For each game, GPT-4 creates:

- **Complete Python game code** (~500-1000 lines)
- **Custom game mechanics** based on your description
- **Unique enemy AI** tailored to the difficulty
- **Custom level layouts** that match the theme
- **Themed color palettes** based on mood
- **Win/lose conditions** matching your goal

### Example Generated Code Structure

```python
import asyncio
import pygame

# Colors based on tone (hopeful = greens, gritty = grays, heroic = golds)
COLOR_PLAYER = (0, 200, 150)
COLOR_ENEMY = (200, 50, 50)
COLOR_PLATFORM = (100, 100, 100)

class Player:
    def __init__(self):
        self.health = 3  # Based on difficulty
        self.x = 100
        self.y = 100
        # ... custom player logic

class Enemy:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.speed = 1.5  # Based on difficulty
        # ... unique AI behavior

class Game:
    def __init__(self):
        # ... game setup
        self.rooms = self.generate_rooms()  # Custom level generation!
        
    async def run(self):
        while True:
            await asyncio.sleep(0)  # Required for pygbag
            self.update()
            self.draw()
            
async def main():
    game = Game()
    await game.run()

asyncio.run(main())
```

## Cost Estimation

Using GPT-4 Turbo:
- ~4,000 tokens per generation
- Input: ~1,000 tokens (~$0.01)
- Output: ~3,000 tokens (~$0.09)
- **Total per game: ~$0.10**

For 100 games: ~$10
For 1,000 games: ~$100

## Fallback Mode

If OpenAI is not configured or fails:
- System falls back to the demo-game template
- Uses JSON configuration instead of generated code
- Still works, just less unique

To disable AI generation entirely, don't set `OPENAI_API_KEY`.

## Safety & Validation

The system validates generated code for:

1. ✅ Required imports (`pygame`, `asyncio`)
2. ✅ Async main function (pygbag requirement)
3. ✅ No malicious code patterns
4. ✅ Proper game loop structure

If validation fails, it falls back to the template.

## Prompt Engineering

The prompt includes:
- Game description (hero, enemy, goal)
- Tone and difficulty settings
- Technical requirements (pygbag compatibility)
- Code structure expectations
- Color/aesthetic guidelines

You can customize the prompt in:
`landing-page/lib/game-generator.ts` → `buildGameGenerationPrompt()`

## Troubleshooting

### "AI game generation not configured"
- Check that `OPENAI_API_KEY` is set in `.env.local`
- Restart the dev server

### "Failed to generate game code"
- Check OpenAI API status: https://status.openai.com/
- Verify your API key has credits
- Check console logs for detailed error

### Generated game doesn't run
- Check browser console for Python errors
- The generated code might not be pygbag-compatible
- System should fall back to template automatically

### Games are too similar
- Try adding more detail in the description field
- Adjust temperature in `generate-game-code/route.ts` (currently 0.7)
- Higher = more creative, Lower = more consistent

## Advanced Configuration

### Change AI Model

In `landing-page/app/api/generate-game-code/route.ts`:

```typescript
model: "gpt-4-turbo-preview", // Current
// Options:
// "gpt-4" - Better quality, slower, more expensive
// "gpt-4-turbo-preview" - Balanced (recommended)
// "gpt-3.5-turbo" - Faster, cheaper, lower quality
```

### Adjust Creativity

```typescript
temperature: 0.7, // Current
// 0.0 = Deterministic, consistent
// 0.7 = Balanced (recommended)
// 1.0 = Very creative, unpredictable
```

### Increase Code Length

```typescript
max_tokens: 4000, // Current (~1000 lines of code)
// Can go up to 16,000 for GPT-4 Turbo
// Warning: Higher = more expensive
```

## Future Enhancements

Planned improvements:
1. **Asset Generation**: Use DALL-E to create custom sprites
2. **Music Generation**: Use AI to create theme music
3. **Code Optimization**: Post-process generated code for performance
4. **Multi-file Games**: Support for larger, modular games
5. **Multiplayer**: Generate networked game logic
6. **Custom Mechanics**: Let users specify gameplay features

## Database Schema

New column in `games` table:

```sql
generated_code TEXT
  - NULL = uses demo-game template
  - Non-null = stores AI-generated Python code
```

## Summary

✅ **Pros:**
- Every game is unique
- Highly customizable
- Real Python code
- Full Pygame power

⚠️ **Cons:**
- Costs money per generation
- Takes 10-30 seconds to generate
- Quality varies
- Requires validation

**Recommendation**: Start with template mode, enable AI for premium users or special occasions.

