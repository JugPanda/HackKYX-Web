"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Check if Supabase is configured
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = isConfigured ? createClient() : null;

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase) {
      setMessage({ 
        type: "error", 
        text: "Supabase is not configured. Please add environment variables." 
      });
      return;
    }
    
    setLoading(true);
    setMessage(null);

    // Get the current origin for the redirect URL
    const redirectUrl = `${window.location.origin}/auth/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ 
        type: "success", 
        text: "Check your email for a password reset link. It may take a few minutes to arrive." 
      });
      setEmail(""); // Clear the form
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConfigured && (
          <div className="p-3 mb-4 text-sm rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            ⚠️ Supabase not configured. Please add your environment variables to <code className="font-mono">.env.local</code>
          </div>
        )}
        <form onSubmit={handleResetRequest} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {message && (
            <div
              className={`p-3 text-sm rounded ${
                message.type === "error"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                  : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading || !isConfigured}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <Link href="/auth/sign-in" className="underline hover:text-primary">
              Back to Sign In
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
