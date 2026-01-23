/**
 * Language Registry
 * 
 * Central registry for all supported languages and their builders.
 * Used for language selection, validation, and routing to appropriate builders.
 */

import { GameBuilder, LanguageInfo } from "./base";
import { javascriptBuilder } from "./javascript";
import { pythonBuilder } from "./python";
import { SubscriptionTier } from "@/lib/db-types";

// Registry of all available builders
const builders: Map<string, GameBuilder> = new Map([
  ["javascript", javascriptBuilder],
  ["python", pythonBuilder],
  // Future builders will be added here:
  // ["lua", luaBuilder],
  // ["unity", unityBuilder],
]);

/**
 * Get a builder by language ID
 */
export function getBuilder(language: string): GameBuilder | null {
  return builders.get(language) || null;
}

/**
 * Get all available language information
 */
export function getAllLanguages(): LanguageInfo[] {
  return Array.from(builders.values()).map(builder => builder.languageInfo);
}

/**
 * Get languages available for a specific subscription tier
 */
export function getLanguagesForTier(tier: SubscriptionTier): LanguageInfo[] {
  return getAllLanguages().filter(lang => {
    const builder = getBuilder(lang.id);
    return builder && builder.canUseLanguage(tier);
  });
}

/**
 * Get the recommended default language for new users
 */
export function getDefaultLanguage(): string {
  return "javascript";
}

/**
 * Check if a language is supported
 */
export function isLanguageSupported(language: string): boolean {
  return builders.has(language);
}

/**
 * Get language display name
 */
export function getLanguageDisplayName(language: string): string {
  const builder = getBuilder(language);
  return builder?.languageInfo.displayName || language;
}

/**
 * Get language icon/emoji
 */
export function getLanguageIcon(language: string): string {
  const builder = getBuilder(language);
  return builder?.languageInfo.icon || "📝";
}

/**
 * Get language status
 */
export function getLanguageStatus(language: string): string {
  const builder = getBuilder(language);
  return builder?.languageInfo.status || "unknown";
}

/**
 * Language configuration for UI display
 */
export const LANGUAGE_CONFIG = {
  javascript: {
    color: "#f7df1e",
    bgColor: "#323330",
    badge: "Recommended",
    badgeColor: "green",
  },
  python: {
    color: "#3776ab",
    bgColor: "#ffd43b",
    badge: "Legacy",
    badgeColor: "yellow",
  },
  lua: {
    color: "#000080",
    bgColor: "#ffffff",
    badge: "Coming Soon",
    badgeColor: "blue",
  },
  unity: {
    color: "#000000",
    bgColor: "#ffffff",
    badge: "Premium",
    badgeColor: "purple",
  },
} as const;

/**
 * Get all builders (for internal use)
 */
export function getAllBuilders(): GameBuilder[] {
  return Array.from(builders.values());
}

/**
 * Export individual builders for direct access
 */
export { javascriptBuilder, pythonBuilder };
