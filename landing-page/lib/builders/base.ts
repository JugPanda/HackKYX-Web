/**
 * Abstract Builder System for Multi-Language Game Support
 * 
 * This provides a unified interface for building games in different languages/frameworks.
 * Each builder handles its own compilation, bundling, and deployment process.
 */

import { GameConfig } from "@/lib/schemas";
import { SubscriptionTier } from "@/lib/db-types";

export interface BuildResult {
  success: boolean;
  bundleUrl?: string;
  bundleSize?: number;
  error?: string;
  buildTime?: number;
}

export interface TemplateInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: string;
  requiredTier: SubscriptionTier;
  language: string;
  codeTemplate: string;
}

export interface LanguageInfo {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  status: 'stable' | 'beta' | 'alpha' | 'coming_soon' | 'legacy';
  requiredTier: SubscriptionTier;
  features: string[];
  limitations: string[];
  estimatedBuildTime: string;
  supportedPlatforms: string[];
}

/**
 * Abstract base class for all game builders
 */
export abstract class GameBuilder {
  abstract readonly language: string;
  abstract readonly languageInfo: LanguageInfo;

  /**
   * Check if this builder can build the given game config
   */
  abstract canBuild(config: GameConfig, userTier: SubscriptionTier): boolean;

  /**
   * Build the game and return the result
   * @param gameId - Unique game identifier
   * @param code - Generated or template code
   * @param config - Game configuration
   */
  abstract build(
    gameId: string,
    code: string,
    config: GameConfig
  ): Promise<BuildResult>;

  /**
   * Get available templates for this language
   */
  abstract getTemplates(): TemplateInfo[];

  /**
   * Generate code from a text prompt using AI
   * @param prompt - User's game description
   * @param config - Game configuration
   */
  abstract generateCode(prompt: string, config: GameConfig): Promise<string>;

  /**
   * Validate the generated code before building
   */
  abstract validateCode(code: string): { valid: boolean; errors: string[] };

  /**
   * Get the default starter code for this language
   */
  abstract getStarterCode(config: GameConfig): string;

  /**
   * Check if user's subscription tier allows this language
   */
  canUseLanguage(userTier: SubscriptionTier): boolean {
    const tierHierarchy: Record<SubscriptionTier, number> = {
      free: 0,
      pro: 1,
      premium: 2,
    };

    const requiredLevel = tierHierarchy[this.languageInfo.requiredTier];
    const userLevel = tierHierarchy[userTier];

    return userLevel >= requiredLevel;
  }
}

/**
 * Helper function to get file extension for a language
 */
export function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    javascript: 'html',
    python: 'py',
    lua: 'lua',
    unity: 'cs',
  };

  return extensions[language] || 'txt';
}

/**
 * Helper function to get syntax highlighting language
 */
export function getSyntaxLanguage(language: string): string {
  const syntaxMap: Record<string, string> = {
    javascript: 'javascript',
    python: 'python',
    lua: 'lua',
    unity: 'csharp',
  };

  return syntaxMap[language] || 'text';
}
