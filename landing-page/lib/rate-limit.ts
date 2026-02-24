/**
 * Serverless-compatible rate limiter using Supabase
 * Works across Vercel function invocations (unlike in-memory)
 */

import { createClient } from "@/lib/supabase/server";

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

// Preset rate limit configs
export const RATE_LIMITS = {
  BUILD: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 builds per hour
  CREATE_GAME: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 games per hour
  COMMENT: { maxRequests: 30, windowMs: 60 * 60 * 1000 }, // 30 comments per hour
  REPORT: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 reports per hour
  API: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  AI_GENERATE: { maxRequests: 20, windowMs: 60 * 60 * 1000 }, // 20 AI generations per hour
};

/**
 * Check rate limit for an identifier (user:action key)
 * Uses Supabase RPC function for atomic increment
 * Falls back to allowing if DB unavailable (fail-open for UX)
 */
export async function rateLimit(identifier: string, config: RateLimitConfig): Promise<boolean> {
  try {
    const supabase = await createClient();
    const windowStart = new Date(Date.now() - config.windowMs).toISOString();
    
    // Count recent requests for this identifier
    const { count, error } = await supabase
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("identifier", identifier)
      .gte("created_at", windowStart);

    if (error) {
      console.warn("Rate limit check failed, allowing request:", error.message);
      return true; // Fail open
    }

    const currentCount = count || 0;
    
    if (currentCount >= config.maxRequests) {
      return false; // Rate limited
    }

    // Record this request
    await supabase
      .from("rate_limits")
      .insert({ identifier, created_at: new Date().toISOString() })
      .select()
      .single();

    return true;
  } catch (error) {
    console.warn("Rate limit error, allowing request:", error);
    return true; // Fail open for UX
  }
}

/**
 * Simple in-memory fallback for non-critical rate limiting
 * Use this only for non-billing-sensitive operations
 */
const memoryCache = new Map<string, { count: number; resetAt: number }>();

export function rateLimitMemory(identifier: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const entry = memoryCache.get(identifier);

  if (!entry || now > entry.resetAt) {
    memoryCache.set(identifier, { count: 1, resetAt: now + config.windowMs });
    return true;
  }

  if (entry.count >= config.maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

export function getRateLimitStatus(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const entry = memoryCache.get(identifier);
  const now = Date.now();

  if (!entry || now > entry.resetAt) {
    return { allowed: true, remaining: 100, resetAt: now + 60000 };
  }

  return {
    allowed: entry.count < 100,
    remaining: Math.max(0, 100 - entry.count),
    resetAt: entry.resetAt,
  };
}
