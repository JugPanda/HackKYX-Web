/**
 * Game Template Library - Rosebud.ai inspired
 * 50+ customizable game templates across various genres
 */

export type TemplateCategory = 
  | "platformer" 
  | "adventure" 
  | "puzzle" 
  | "rpg"
  | "shooter"
  | "racing"
  | "educational"
  | "arcade";

export type TemplateDifficulty = "beginner" | "intermediate" | "advanced";

export interface GameTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  difficulty: TemplateDifficulty;
  thumbnail?: string;
  tags: string[];
  
  // Pre-configured game settings
  heroName: string;
  enemyName: string;
  goal: string;
  tone: "hopeful" | "gritty" | "heroic";
  gameDifficulty: "rookie" | "veteran" | "nightmare";
  genre: "platformer" | "adventure" | "puzzle";
  
  // Template-specific features
  features: string[];
  mechanics: string[];
  
  // Popularity metrics
  usageCount?: number;
  featured?: boolean;
}

export const GAME_TEMPLATES: GameTemplate[] = [
  // ============================================
  // PLATFORMER TEMPLATES
  // ============================================
  {
    id: "platformer-classic",
    name: "Classic Platformer",
    description: "Jump and run through levels collecting coins and avoiding enemies. Perfect for beginners!",
    category: "platformer",
    difficulty: "beginner",
    tags: ["mario-style", "2d", "side-scrolling", "beginner-friendly"],
    heroName: "Jumpman",
    enemyName: "Goombas",
    goal: "Collect all 10 coins and reach the flag",
    tone: "hopeful",
    gameDifficulty: "rookie",
    genre: "platformer",
    features: ["Coin collection", "Multiple platforms", "Simple enemies", "Victory flag"],
    mechanics: ["Arrow keys movement", "Spacebar jump", "Collision detection"],
    featured: true,
    usageCount: 1247,
  },
  {
    id: "platformer-hollow-knight",
    name: "Metroidvania Explorer",
    description: "Dark fantasy platformer inspired by Hollow Knight. Dash, wall-jump, and explore interconnected areas.",
    category: "platformer",
    difficulty: "advanced",
    tags: ["metroidvania", "dark", "exploration", "hollow-knight"],
    heroName: "The Wanderer",
    enemyName: "Void Creatures",
    goal: "Find the ancient relic hidden deep in the caverns",
    tone: "gritty",
    gameDifficulty: "nightmare",
    genre: "platformer",
    features: ["Dash ability", "Wall jump", "Multiple interconnected rooms", "Boss battles"],
    mechanics: ["Advanced movement", "Combo system", "Health management"],
    featured: true,
    usageCount: 892,
  },
  {
    id: "platformer-speedrun",
    name: "Speedrun Challenge",
    description: "Fast-paced platformer designed for speedrunning. Every second counts!",
    category: "platformer",
    difficulty: "intermediate",
    tags: ["speedrun", "fast-paced", "timer", "competitive"],
    heroName: "Flash Runner",
    enemyName: "Time Eaters",
    goal: "Complete the course in under 60 seconds",
    tone: "heroic",
    gameDifficulty: "veteran",
    genre: "platformer",
    features: ["Timer display", "Speedrun optimizations", "Momentum preservation", "Leaderboard-ready"],
    mechanics: ["Sprint", "Dash", "Precision jumps"],
    usageCount: 653,
  },
  {
    id: "platformer-puzzle",
    name: "Puzzle Platformer",
    description: "Combine platforming with brain-teasing puzzles. Move blocks and activate switches.",
    category: "platformer",
    difficulty: "intermediate",
    tags: ["puzzle", "logic", "blocks", "switches"],
    heroName: "The Thinker",
    enemyName: "Moving Hazards",
    goal: "Solve all puzzles to unlock the exit",
    tone: "hopeful",
    gameDifficulty: "veteran",
    genre: "platformer",
    features: ["Movable blocks", "Switches", "Logical challenges", "Environmental puzzles"],
    mechanics: ["Push/pull blocks", "Activate switches", "Timing-based challenges"],
    usageCount: 721,
  },
  {
    id: "platformer-ice-cavern",
    name: "Ice Cavern Adventure",
    description: "Slippery ice physics make this platformer extra challenging!",
    category: "platformer",
    difficulty: "intermediate",
    tags: ["ice", "physics", "winter", "slippery"],
    heroName: "Arctic Explorer",
    enemyName: "Ice Monsters",
    goal: "Navigate the slippery caverns and find the exit",
    tone: "hopeful",
    gameDifficulty: "veteran",
    genre: "platformer",
    features: ["Ice physics", "Slippery movement", "Frozen enemies", "Cave aesthetics"],
    mechanics: ["Modified friction", "Ice sliding", "Momentum control"],
    usageCount: 543,
  },

  // ============================================
  // ADVENTURE TEMPLATES
  // ============================================
  {
    id: "adventure-zelda",
    name: "Top-Down Dungeon Crawler",
    description: "Zelda-inspired adventure. Explore dungeons, fight enemies, collect items.",
    category: "adventure",
    difficulty: "intermediate",
    tags: ["zelda", "top-down", "dungeon", "exploration"],
    heroName: "Link the Hero",
    enemyName: "Dungeon Monsters",
    goal: "Find the Triforce hidden in the temple",
    tone: "heroic",
    gameDifficulty: "veteran",
    genre: "adventure",
    features: ["8-directional movement", "Room transitions", "Collectible items", "Boss room"],
    mechanics: ["WASD movement", "Attack", "Health pickups"],
    featured: true,
    usageCount: 1134,
  },
  {
    id: "adventure-treasure-hunt",
    name: "Treasure Hunter",
    description: "Explore a vast island searching for hidden treasure. Avoid traps and enemies!",
    category: "adventure",
    difficulty: "beginner",
    tags: ["treasure", "exploration", "island", "beginner"],
    heroName: "Indiana Jones",
    enemyName: "Island Guardians",
    goal: "Find all 5 treasure chests",
    tone: "heroic",
    gameDifficulty: "rookie",
    genre: "adventure",
    features: ["Open world exploration", "Treasure chests", "Simple enemies", "Map boundaries"],
    mechanics: ["Free movement", "Collision detection", "Item collection"],
    usageCount: 876,
  },
  {
    id: "adventure-stealth",
    name: "Stealth Mission",
    description: "Sneak past guards and security systems in this stealth adventure.",
    category: "adventure",
    difficulty: "advanced",
    tags: ["stealth", "ninja", "guards", "detection"],
    heroName: "Shadow Agent",
    enemyName: "Security Guards",
    goal: "Reach the vault without being detected",
    tone: "gritty",
    gameDifficulty: "nightmare",
    genre: "adventure",
    features: ["Line of sight detection", "Guard patrol routes", "Hiding spots", "Alert system"],
    mechanics: ["Stealth movement", "Detection zones", "Game over on detection"],
    usageCount: 612,
  },
  {
    id: "adventure-space-explorer",
    name: "Space Explorer",
    description: "Navigate your spaceship through asteroid fields and alien encounters.",
    category: "adventure",
    difficulty: "intermediate",
    tags: ["space", "sci-fi", "asteroids", "aliens"],
    heroName: "Captain Starflight",
    enemyName: "Hostile Aliens",
    goal: "Navigate through the asteroid field and reach the space station",
    tone: "heroic",
    gameDifficulty: "veteran",
    genre: "adventure",
    features: ["Space theme", "Asteroids", "Alien ships", "Fuel management"],
    mechanics: ["8-way movement", "Momentum", "Collisions"],
    usageCount: 734,
  },
  {
    id: "adventure-farm-quest",
    name: "Farm Quest",
    description: "Peaceful farming adventure. Plant crops, raise animals, and build your farm!",
    category: "adventure",
    difficulty: "beginner",
    tags: ["farming", "peaceful", "relaxing", "stardew"],
    heroName: "Farmer Alex",
    enemyName: "Weeds",
    goal: "Harvest 20 crops and feed all animals",
    tone: "hopeful",
    gameDifficulty: "rookie",
    genre: "adventure",
    features: ["Planting system", "Animal care", "Crop growth", "Harvest mechanics"],
    mechanics: ["Point-and-click farming", "Time progression", "Resource management"],
    usageCount: 921,
  },

  // ============================================
  // PUZZLE TEMPLATES
  // ============================================
  {
    id: "puzzle-match3",
    name: "Match-3 Mania",
    description: "Classic match-3 puzzle game. Match gems to score points and clear the board!",
    category: "puzzle",
    difficulty: "beginner",
    tags: ["match3", "gems", "candy-crush", "casual"],
    heroName: "Gem Matcher",
    enemyName: "Locked Tiles",
    goal: "Score 1000 points by matching gems",
    tone: "hopeful",
    gameDifficulty: "rookie",
    genre: "puzzle",
    features: ["8x8 grid", "Match detection", "Score multipliers", "Particle effects"],
    mechanics: ["Click to swap", "Match 3+ gems", "Gravity drop"],
    featured: true,
    usageCount: 1543,
  },
  {
    id: "puzzle-sliding-tiles",
    name: "Sliding Tile Puzzle",
    description: "Classic sliding tile puzzle. Arrange the tiles in the correct order.",
    category: "puzzle",
    difficulty: "intermediate",
    tags: ["sliding", "logic", "classic", "brain-teaser"],
    heroName: "Puzzle Solver",
    enemyName: "Scrambled Tiles",
    goal: "Arrange all tiles in numerical order",
    tone: "hopeful",
    gameDifficulty: "veteran",
    genre: "puzzle",
    features: ["4x4 grid", "Tile sliding", "Win detection", "Move counter"],
    mechanics: ["Click to slide", "Valid move detection", "Completion check"],
    usageCount: 432,
  },
  {
    id: "puzzle-block-breaker",
    name: "Block Breaker",
    description: "Break all blocks with your bouncing ball. Don't let it fall!",
    category: "puzzle",
    difficulty: "beginner",
    tags: ["breakout", "brick", "arcade", "classic"],
    heroName: "Paddle Master",
    enemyName: "Brick Blocks",
    goal: "Break all blocks without losing the ball",
    tone: "heroic",
    gameDifficulty: "rookie",
    genre: "puzzle",
    features: ["Paddle control", "Ball physics", "Block destruction", "Lives system"],
    mechanics: ["Mouse/arrow control", "Ball bounce", "Collision"],
    usageCount: 867,
  },
  {
    id: "puzzle-connect-dots",
    name: "Connect the Dots",
    description: "Draw lines to connect matching dots. Don't let the lines cross!",
    category: "puzzle",
    difficulty: "intermediate",
    tags: ["connect", "logic", "flow", "lines"],
    heroName: "Line Drawer",
    enemyName: "Disconnected Dots",
    goal: "Connect all matching pairs without crossing lines",
    tone: "hopeful",
    gameDifficulty: "veteran",
    genre: "puzzle",
    features: ["Grid-based", "Line drawing", "Cross detection", "Multiple colors"],
    mechanics: ["Click and drag", "Path validation", "Color matching"],
    usageCount: 521,
  },
  {
    id: "puzzle-sokoban",
    name: "Box Pusher",
    description: "Push boxes to designated spots. Classic Sokoban-style puzzle.",
    category: "puzzle",
    difficulty: "advanced",
    tags: ["sokoban", "logic", "warehouse", "strategic"],
    heroName: "Warehouse Worker",
    enemyName: "Misplaced Boxes",
    goal: "Push all boxes onto the target squares",
    tone: "hopeful",
    gameDifficulty: "nightmare",
    genre: "puzzle",
    features: ["Grid movement", "Push mechanics", "Target indicators", "Undo system"],
    mechanics: ["Arrow key movement", "Push boxes", "Cannot pull"],
    usageCount: 398,
  },

  // ============================================
  // RPG TEMPLATES
  // ============================================
  {
    id: "rpg-turn-based",
    name: "Turn-Based RPG Battle",
    description: "Classic JRPG-style turn-based combat. Choose your attacks wisely!",
    category: "rpg",
    difficulty: "intermediate",
    tags: ["rpg", "turn-based", "jrpg", "combat"],
    heroName: "Brave Warrior",
    enemyName: "Dark Sorcerer",
    goal: "Defeat the Dark Sorcerer in battle",
    tone: "heroic",
    gameDifficulty: "veteran",
    genre: "adventure",
    features: ["Turn-based combat", "HP/MP system", "Multiple attacks", "Magic spells"],
    mechanics: ["Menu selection", "Damage calculation", "Status effects"],
    usageCount: 678,
  },
  {
    id: "rpg-action-combat",
    name: "Action RPG Combat",
    description: "Real-time action combat inspired by Dark Souls. Dodge, attack, and survive!",
    category: "rpg",
    difficulty: "advanced",
    tags: ["action-rpg", "combat", "dark-souls", "challenging"],
    heroName: "Knight Errant",
    enemyName: "Boss Monster",
    goal: "Defeat the boss without dying",
    tone: "gritty",
    gameDifficulty: "nightmare",
    genre: "adventure",
    features: ["Real-time combat", "Dodge roll", "Stamina system", "Attack combos"],
    mechanics: ["Action combat", "Stamina management", "I-frames"],
    usageCount: 789,
  },
  {
    id: "rpg-village-quest",
    name: "Village Quest",
    description: "Help villagers with various quests. Talk to NPCs and complete missions.",
    category: "rpg",
    difficulty: "beginner",
    tags: ["quest", "npcs", "dialogue", "peaceful"],
    heroName: "Helpful Traveler",
    enemyName: "Minor Pests",
    goal: "Complete 3 quests for the villagers",
    tone: "hopeful",
    gameDifficulty: "rookie",
    genre: "adventure",
    features: ["NPC dialogue", "Quest system", "Item delivery", "Reputation"],
    mechanics: ["Talk to NPCs", "Item collection", "Quest tracking"],
    usageCount: 843,
  },

  // ============================================
  // SHOOTER TEMPLATES
  // ============================================
  {
    id: "shooter-space-invaders",
    name: "Space Invaders",
    description: "Classic space shooter. Defend Earth from alien invaders!",
    category: "shooter",
    difficulty: "beginner",
    tags: ["space", "shooter", "arcade", "classic"],
    heroName: "Space Defender",
    enemyName: "Alien Fleet",
    goal: "Destroy all alien ships",
    tone: "heroic",
    gameDifficulty: "rookie",
    genre: "adventure",
    features: ["Shooting mechanics", "Enemy waves", "Score system", "Lives"],
    mechanics: ["Arrow keys + spacebar", "Projectiles", "Enemy patterns"],
    usageCount: 934,
  },
  {
    id: "shooter-bullet-hell",
    name: "Bullet Hell Chaos",
    description: "Dodge hundreds of bullets in this intense bullet-hell shooter!",
    category: "shooter",
    difficulty: "advanced",
    tags: ["bullet-hell", "dodge", "intense", "touhou"],
    heroName: "Ace Pilot",
    enemyName: "Bullet Storm",
    goal: "Survive 60 seconds of bullet hell",
    tone: "gritty",
    gameDifficulty: "nightmare",
    genre: "adventure",
    features: ["Bullet patterns", "Precise hitbox", "Slow-motion mode", "Bomb system"],
    mechanics: ["Dodge bullets", "Focus mode", "Screen clear bomb"],
    usageCount: 567,
  },

  // ============================================
  // RACING TEMPLATES
  // ============================================
  {
    id: "racing-top-down",
    name: "Top-Down Racer",
    description: "Race against time on a winding track. Beat your best lap!",
    category: "racing",
    difficulty: "intermediate",
    tags: ["racing", "top-down", "track", "speed"],
    heroName: "Speed Racer",
    enemyName: "Time Limit",
    goal: "Complete 3 laps in under 90 seconds",
    tone: "heroic",
    gameDifficulty: "veteran",
    genre: "adventure",
    features: ["Track boundaries", "Lap counter", "Speed boost", "Timer"],
    mechanics: ["Acceleration", "Turning", "Collision with walls"],
    usageCount: 612,
  },
  {
    id: "racing-obstacle-course",
    name: "Obstacle Course Challenge",
    description: "Navigate through obstacles and reach the finish line!",
    category: "racing",
    difficulty: "beginner",
    tags: ["obstacle", "course", "parkour", "challenge"],
    heroName: "Runner",
    enemyName: "Obstacles",
    goal: "Reach the finish line without hitting obstacles",
    tone: "hopeful",
    gameDifficulty: "rookie",
    genre: "platformer",
    features: ["Obstacle avoidance", "Checkpoint system", "Timer", "Lives"],
    mechanics: ["Move left/right", "Jump over obstacles", "Sprint"],
    usageCount: 721,
  },

  // ============================================
  // EDUCATIONAL TEMPLATES
  // ============================================
  {
    id: "edu-math-adventure",
    name: "Math Adventure",
    description: "Learn math while playing! Solve equations to defeat enemies.",
    category: "educational",
    difficulty: "beginner",
    tags: ["educational", "math", "learning", "kids"],
    heroName: "Math Wizard",
    enemyName: "Wrong Answers",
    goal: "Solve 10 math problems correctly",
    tone: "hopeful",
    gameDifficulty: "rookie",
    genre: "puzzle",
    features: ["Math problems", "Multiple choice", "Score system", "Difficulty scaling"],
    mechanics: ["Answer questions", "Timed challenges", "Rewards"],
    usageCount: 456,
  },
  {
    id: "edu-typing-speed",
    name: "Typing Speed Test",
    description: "Improve your typing speed by typing falling words!",
    category: "educational",
    difficulty: "beginner",
    tags: ["typing", "educational", "speed", "practice"],
    heroName: "Fast Typer",
    enemyName: "Falling Words",
    goal: "Type 30 words correctly before they hit the ground",
    tone: "hopeful",
    gameDifficulty: "rookie",
    genre: "puzzle",
    features: ["Word display", "Typing detection", "WPM counter", "Accuracy tracking"],
    mechanics: ["Keyboard typing", "Word matching", "Speed calculation"],
    usageCount: 687,
  },

  // ============================================
  // ARCADE TEMPLATES
  // ============================================
  {
    id: "arcade-snake",
    name: "Classic Snake",
    description: "The timeless snake game. Eat apples, grow longer, don't hit yourself!",
    category: "arcade",
    difficulty: "beginner",
    tags: ["snake", "classic", "arcade", "retro"],
    heroName: "Hungry Snake",
    enemyName: "Walls",
    goal: "Grow to length 20",
    tone: "hopeful",
    gameDifficulty: "rookie",
    genre: "puzzle",
    features: ["Grid movement", "Growth mechanic", "Apple spawning", "Self-collision"],
    mechanics: ["Arrow key direction", "Continuous movement", "Collision detection"],
    usageCount: 1234,
  },
  {
    id: "arcade-pong",
    name: "Pong Classic",
    description: "Two-player Pong! First to 10 points wins.",
    category: "arcade",
    difficulty: "beginner",
    tags: ["pong", "classic", "2-player", "retro"],
    heroName: "Player 1",
    enemyName: "Player 2",
    goal: "Score 10 points to win",
    tone: "hopeful",
    gameDifficulty: "rookie",
    genre: "puzzle",
    features: ["Paddle movement", "Ball physics", "Score tracking", "AI opponent"],
    mechanics: ["Paddle control", "Ball bounce", "Scoring"],
    usageCount: 876,
  },
  {
    id: "arcade-flappy-bird",
    name: "Flappy Bird Clone",
    description: "Tap to flap! Navigate through pipes in this addictive arcade game.",
    category: "arcade",
    difficulty: "intermediate",
    tags: ["flappy", "arcade", "one-button", "challenging"],
    heroName: "Flappy",
    enemyName: "Pipes",
    goal: "Pass through 10 pipes",
    tone: "hopeful",
    gameDifficulty: "veteran",
    genre: "platformer",
    features: ["One-button control", "Gravity physics", "Pipe generation", "High score"],
    mechanics: ["Tap to flap", "Gravity", "Collision detection"],
    usageCount: 1456,
  },
  {
    id: "arcade-asteroids",
    name: "Asteroids Classic",
    description: "Blast asteroids and avoid collisions in this vector-style shooter.",
    category: "arcade",
    difficulty: "intermediate",
    tags: ["asteroids", "shooter", "vector", "classic"],
    heroName: "Spaceship",
    enemyName: "Asteroids",
    goal: "Destroy 20 asteroids",
    tone: "heroic",
    gameDifficulty: "veteran",
    genre: "adventure",
    features: ["360-degree rotation", "Shooting", "Asteroid splitting", "Wraparound screen"],
    mechanics: ["Rotate + thrust", "Shoot", "Momentum physics"],
    usageCount: 743,
  },
  {
    id: "arcade-pac-man",
    name: "Maze Runner",
    description: "Navigate mazes, collect dots, avoid ghosts. Pac-Man style!",
    category: "arcade",
    difficulty: "intermediate",
    tags: ["pac-man", "maze", "arcade", "classic"],
    heroName: "Maze Runner",
    enemyName: "Ghosts",
    goal: "Collect all dots without getting caught",
    tone: "hopeful",
    gameDifficulty: "veteran",
    genre: "puzzle",
    features: ["Maze navigation", "Ghost AI", "Power pellets", "Score system"],
    mechanics: ["Arrow key movement", "Dot collection", "Ghost avoidance"],
    usageCount: 1098,
  },

  // ============================================
  // MORE SPECIALIZED TEMPLATES
  // ============================================
  {
    id: "endless-runner",
    name: "Endless Runner",
    description: "Run forever! Dodge obstacles and collect coins in this endless runner.",
    category: "platformer",
    difficulty: "beginner",
    tags: ["endless", "runner", "mobile", "casual"],
    heroName: "Endless Runner",
    enemyName: "Obstacles",
    goal: "Run as far as possible and beat your high score",
    tone: "hopeful",
    gameDifficulty: "rookie",
    genre: "platformer",
    features: ["Auto-scrolling", "Procedural generation", "High score", "Increasing difficulty"],
    mechanics: ["Jump", "Slide", "Double jump"],
    usageCount: 1321,
  },
  {
    id: "tower-defense",
    name: "Tower Defense",
    description: "Place towers to defend against waves of enemies!",
    category: "puzzle",
    difficulty: "advanced",
    tags: ["tower-defense", "strategy", "waves", "td"],
    heroName: "Commander",
    enemyName: "Enemy Waves",
    goal: "Survive 10 waves of enemies",
    tone: "heroic",
    gameDifficulty: "nightmare",
    genre: "puzzle",
    features: ["Tower placement", "Enemy waves", "Resource management", "Tower upgrades"],
    mechanics: ["Click to place", "Wave system", "Path finding"],
    usageCount: 892,
  },
  {
    id: "rhythm-game",
    name: "Rhythm Master",
    description: "Hit the notes in time with the music! Dance Dance Revolution style.",
    category: "arcade",
    difficulty: "intermediate",
    tags: ["rhythm", "music", "timing", "ddr"],
    heroName: "Rhythm Master",
    enemyName: "Missed Notes",
    goal: "Hit 90% of notes perfectly",
    tone: "heroic",
    gameDifficulty: "veteran",
    genre: "puzzle",
    features: ["Timing system", "Note scrolling", "Combo counter", "Accuracy display"],
    mechanics: ["Arrow key timing", "Perfect/Good/Miss", "Combo multiplier"],
    usageCount: 634,
  },
  {
    id: "clicker-game",
    name: "Idle Clicker",
    description: "Click to earn points, buy upgrades, and watch your empire grow!",
    category: "arcade",
    difficulty: "beginner",
    tags: ["clicker", "idle", "incremental", "casual"],
    heroName: "Clicker",
    enemyName: "Zero Points",
    goal: "Reach 1 million points",
    tone: "hopeful",
    gameDifficulty: "rookie",
    genre: "puzzle",
    features: ["Click mechanics", "Auto-clickers", "Upgrade system", "Prestige"],
    mechanics: ["Click to earn", "Buy upgrades", "Passive income"],
    usageCount: 1543,
  },
  {
    id: "fishing-game",
    name: "Fishing Adventure",
    description: "Cast your line and catch fish! Peaceful fishing simulation.",
    category: "adventure",
    difficulty: "beginner",
    tags: ["fishing", "relaxing", "simulation", "peaceful"],
    heroName: "Angler",
    enemyName: "Empty Hook",
    goal: "Catch 10 different types of fish",
    tone: "hopeful",
    gameDifficulty: "rookie",
    genre: "adventure",
    features: ["Casting mechanics", "Fish variety", "Timing minigame", "Collection"],
    mechanics: ["Click to cast", "Timing button press", "Reel in fish"],
    usageCount: 765,
  },
  {
    id: "card-battle",
    name: "Card Battle Arena",
    description: "Strategic card battles! Build your deck and defeat opponents.",
    category: "rpg",
    difficulty: "advanced",
    tags: ["cards", "strategy", "deck-building", "hearthstone"],
    heroName: "Card Master",
    enemyName: "Rival Duelist",
    goal: "Reduce opponent's health to 0",
    tone: "heroic",
    gameDifficulty: "nightmare",
    genre: "puzzle",
    features: ["Card system", "Deck building", "Mana system", "Multiple cards"],
    mechanics: ["Play cards", "Mana management", "Strategic decisions"],
    usageCount: 923,
  },
  {
    id: "cooking-game",
    name: "Cooking Dash",
    description: "Serve customers quickly in this fast-paced cooking game!",
    category: "arcade",
    difficulty: "intermediate",
    tags: ["cooking", "time-management", "restaurant", "dash"],
    heroName: "Chef",
    enemyName: "Impatient Customers",
    goal: "Serve 20 customers successfully",
    tone: "hopeful",
    gameDifficulty: "veteran",
    genre: "puzzle",
    features: ["Order system", "Cooking timer", "Customer patience", "Combo tips"],
    mechanics: ["Click to cook", "Time management", "Order matching"],
    usageCount: 834,
  },
  {
    id: "memory-match",
    name: "Memory Match",
    description: "Classic memory card game. Find all matching pairs!",
    category: "puzzle",
    difficulty: "beginner",
    tags: ["memory", "cards", "matching", "brain"],
    heroName: "Memory Master",
    enemyName: "Forgotten Cards",
    goal: "Match all 8 pairs in under 60 seconds",
    tone: "hopeful",
    gameDifficulty: "rookie",
    genre: "puzzle",
    features: ["Card flipping", "Match detection", "Timer", "Move counter"],
    mechanics: ["Click to flip", "Memory recall", "Matching"],
    usageCount: 678,
  },
  {
    id: "whack-a-mole",
    name: "Whack-a-Mole",
    description: "Hit the moles as they pop up! Classic arcade reflexes game.",
    category: "arcade",
    difficulty: "beginner",
    tags: ["whack-a-mole", "reflexes", "arcade", "casual"],
    heroName: "Mole Whacker",
    enemyName: "Moles",
    goal: "Whack 30 moles in 60 seconds",
    tone: "hopeful",
    gameDifficulty: "rookie",
    genre: "puzzle",
    features: ["Random spawning", "Click detection", "Score system", "Timer"],
    mechanics: ["Click to whack", "Reaction time", "Scoring"],
    usageCount: 892,
  },
];

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: TemplateCategory): GameTemplate[] {
  return GAME_TEMPLATES.filter(t => t.category === category);
}

/**
 * Get templates by difficulty
 */
export function getTemplatesByDifficulty(difficulty: TemplateDifficulty): GameTemplate[] {
  return GAME_TEMPLATES.filter(t => t.difficulty === difficulty);
}

/**
 * Get featured templates
 */
export function getFeaturedTemplates(): GameTemplate[] {
  return GAME_TEMPLATES.filter(t => t.featured).sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
}

/**
 * Get popular templates
 */
export function getPopularTemplates(limit: number = 10): GameTemplate[] {
  return [...GAME_TEMPLATES]
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, limit);
}

/**
 * Search templates by query
 */
export function searchTemplates(query: string): GameTemplate[] {
  const lowerQuery = query.toLowerCase();
  return GAME_TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): GameTemplate | undefined {
  return GAME_TEMPLATES.find(t => t.id === id);
}

/**
 * Get all categories
 */
export function getAllCategories(): TemplateCategory[] {
  return ["platformer", "adventure", "puzzle", "rpg", "shooter", "racing", "educational", "arcade"];
}

/**
 * Get category display info
 */
export function getCategoryInfo(category: TemplateCategory) {
  const info = {
    platformer: { 
      name: "Platformer", 
      icon: "🏃", 
      description: "Jump and run through levels"
    },
    adventure: { 
      name: "Adventure", 
      icon: "🗡️", 
      description: "Explore and discover" 
    },
    puzzle: { 
      name: "Puzzle", 
      icon: "🧩", 
      description: "Brain-teasing challenges" 
    },
    rpg: { 
      name: "RPG", 
      icon: "⚔️", 
      description: "Role-playing adventures" 
    },
    shooter: { 
      name: "Shooter", 
      icon: "🔫", 
      description: "Action-packed combat" 
    },
    racing: { 
      name: "Racing", 
      icon: "🏎️", 
      description: "High-speed competition" 
    },
    educational: { 
      name: "Educational", 
      icon: "📚", 
      description: "Learn while playing" 
    },
    arcade: { 
      name: "Arcade", 
      icon: "🕹️", 
      description: "Classic arcade fun" 
    },
  };
  return info[category];
}

