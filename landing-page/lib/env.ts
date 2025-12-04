/**
 * Environment variable validation and type-safe access
 * This ensures all required environment variables are present and valid
 */

import { z } from "zod";

// Define the schema for environment variables
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Invalid Supabase URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "Supabase service role key is required"),
  
  // OpenAI (optional - only needed for AI features)
  OPENAI_API_KEY: z.string().optional(),
  
  // Build Service
  BUILD_SERVICE_URL: z.string().url("Invalid build service URL").optional(),
  BUILD_SERVICE_SECRET: z.string().optional(),
  
  // Site Configuration
  NEXT_PUBLIC_SITE_URL: z.string().url("Invalid site URL"),
  
  // Stripe (optional - only needed for payments)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_ID_PRO: z.string().optional(),
  STRIPE_PRICE_ID_PREMIUM: z.string().optional(),
  
  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Parse and validate environment variables
function validateEnv() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    BUILD_SERVICE_URL: process.env.BUILD_SERVICE_URL,
    BUILD_SERVICE_SECRET: process.env.BUILD_SERVICE_SECRET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_ID_PRO: process.env.STRIPE_PRICE_ID_PRO,
    STRIPE_PRICE_ID_PREMIUM: process.env.STRIPE_PRICE_ID_PREMIUM,
    NODE_ENV: process.env.NODE_ENV || "development",
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(result.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  return result.data;
}

// Export validated environment variables
export const env = validateEnv();

/**
 * Check if a specific feature is enabled based on environment variables
 */
export const features = {
  ai: !!env.OPENAI_API_KEY,
  buildService: !!env.BUILD_SERVICE_URL && !!env.BUILD_SERVICE_SECRET,
  stripe: !!env.STRIPE_SECRET_KEY && !!env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
} as const;

/**
 * Check if we're in production
 */
export const isProduction = env.NODE_ENV === "production";

/**
 * Check if we're in development
 */
export const isDevelopment = env.NODE_ENV === "development";
