// Persistent rate limiter using Supabase
// This version persists across server restarts

import { createClient } from "@/lib/supabase/server";

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  limit: number;
  remaining: number;
  resetAt: string;
}

export async function rateLimitPersistent(
  identifier: string,
  action: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  try {
    const supabase = await createClient();

    // Call the rate limit function
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_identifier: identifier,
      p_action: action,
      p_max_requests: config.maxRequests,
      p_window_ms: config.windowMs,
    });

    if (error) {
      console.error("Rate limit check error:", error);
      // Fail open - allow the request if rate limit check fails
      return {
        allowed: true,
        count: 0,
        limit: config.maxRequests,
        remaining: config.maxRequests,
        resetAt: new Date(Date.now() + config.windowMs).toISOString(),
      };
    }

    return {
      allowed: data.allowed,
      count: data.count,
      limit: data.limit,
      remaining: data.remaining,
      resetAt: data.resetAt,
    };
  } catch (error) {
    console.error("Rate limit error:", error);
    // Fail open - allow the request if rate limit check fails
    return {
      allowed: true,
      count: 0,
      limit: config.maxRequests,
      remaining: config.maxRequests,
      resetAt: new Date(Date.now() + config.windowMs).toISOString(),
    };
  }
}

// Preset rate limit configs (same as before)
export const RATE_LIMITS_PERSISTENT = {
  BUILD: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 builds per hour
  CREATE_GAME: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 games per hour
  COMMENT: { maxRequests: 30, windowMs: 60 * 60 * 1000 }, // 30 comments per hour
  REPORT: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 reports per hour
  API: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
};

// Convenience wrapper that returns boolean (for backwards compatibility)
export async function checkRateLimit(
  identifier: string,
  action: string,
  config: RateLimitConfig
): Promise<boolean> {
  const result = await rateLimitPersistent(identifier, action, config);
  return result.allowed;
}
