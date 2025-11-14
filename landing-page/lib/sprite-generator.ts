/**
 * Client-side sprite generation helpers
 */

export type SpriteStyle = 
  | "pixel art"
  | "cartoon"
  | "realistic"
  | "minimalist"
  | "hand-drawn"
  | "3d render"
  | "retro";

export type SpriteType = "player" | "enemy" | "item" | "background";

export interface GenerateSpriteRequest {
  description: string;
  type?: SpriteType;
  style?: SpriteStyle;
}

export interface GenerateSpriteResponse {
  ok: boolean;
  imageUrl?: string;
  revisedPrompt?: string;
  error?: string;
}

/**
 * Generate a game sprite using AI
 */
export async function generateSprite(
  request: GenerateSpriteRequest
): Promise<GenerateSpriteResponse> {
  try {
    const response = await fetch("/api/generate-sprite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate sprite");
    }

    return await response.json();
  } catch (error) {
    console.error("Sprite generation error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to generate sprite",
    };
  }
}

/**
 * Get style presets for sprite generation
 */
export function getSpriteStylePresets(): Array<{
  value: SpriteStyle;
  label: string;
  description: string;
  icon: string;
}> {
  return [
    {
      value: "pixel art",
      label: "Pixel Art",
      description: "Classic retro game style",
      icon: "🎮",
    },
    {
      value: "cartoon",
      label: "Cartoon",
      description: "Colorful and friendly",
      icon: "🎨",
    },
    {
      value: "realistic",
      label: "Realistic",
      description: "Detailed and lifelike",
      icon: "📸",
    },
    {
      value: "minimalist",
      label: "Minimalist",
      description: "Simple and clean",
      icon: "⚪",
    },
    {
      value: "hand-drawn",
      label: "Hand-Drawn",
      description: "Sketchy and artistic",
      icon: "✏️",
    },
    {
      value: "3d render",
      label: "3D Render",
      description: "Modern 3D look",
      icon: "🎲",
    },
    {
      value: "retro",
      label: "Retro",
      description: "80s/90s arcade style",
      icon: "👾",
    },
  ];
}

/**
 * Get character description examples
 */
export function getCharacterExamples(): Array<{
  type: SpriteType;
  examples: string[];
}> {
  return [
    {
      type: "player",
      examples: [
        "heroic knight with shining armor",
        "ninja in black outfit",
        "space explorer in futuristic suit",
        "wizard with blue robes and staff",
        "robot with jetpack",
        "pirate captain with tricorn hat",
        "cyberpunk hacker with neon visor",
        "medieval archer with bow",
      ],
    },
    {
      type: "enemy",
      examples: [
        "fire-breathing dragon",
        "zombie warrior",
        "alien creature with tentacles",
        "dark sorcerer with purple aura",
        "mechanical spider bot",
        "ghost with glowing eyes",
        "orc warrior with axe",
        "shadow demon",
      ],
    },
    {
      type: "item",
      examples: [
        "golden treasure chest",
        "health potion bottle",
        "magic crystal",
        "ancient sword",
        "key with ornate design",
        "shield with emblem",
        "power-up coin",
        "ammunition pack",
      ],
    },
    {
      type: "background",
      examples: [
        "mystical forest",
        "futuristic city",
        "underground cave",
        "floating sky islands",
        "cyberpunk street",
        "medieval castle",
        "alien planet",
        "space station interior",
      ],
    },
  ];
}

/**
 * Download an image from URL as a file
 */
export async function downloadImageAsFile(
  url: string,
  filename: string = "sprite.png"
): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: "image/png" });
}

/**
 * Convert data URL to File object
 */
export function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

