"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const router = useRouter();
  
  // Check if Supabase is configured
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = isConfigured ? createClient() : null;

  useEffect(() => {
    // Check if user has a valid session (from the password reset link)
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setHasSession(!!session);
        if (!session) {
          setMessage({ 
            type: "error", 
            text: "Invalid or expired reset link. Please request a new password reset." 
          });
        }
      });
    }
  }, [supabase]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase) {
      setMessage({ 
        type: "error", 
        text: "Supabase is not configured. Please add environment variables." 
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
      setLoading(false);
    } else {
      setMessage({ 
        type: "success", 
        text: "Password updated successfully! Redirecting to sign in..." 
      });
      
      // Sign out and redirect to sign in after 2 seconds
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push("/auth/sign-in");
      }, 2000);
    }
  };

  if (!isConfigured) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 mb-4 text-sm rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            ⚠️ Supabase not configured. Please add your environment variables to <code className="font-mono">.env.local</code>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasSession && !message) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasSession ? (
          <div>
            {message && (
              <div className="p-3 text-sm rounded bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 mb-4">
                {message.text}
              </div>
            )}
            <div className="text-center">
              <Link href="/auth/forgot-password" className="underline hover:text-primary">
                Request a new password reset
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
