"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = isConfigured ? createClient() : null;

  const handleSignUp = async (e: React.FormEvent) => {
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

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        // Handle specific error types
        if (error.message.includes("fetch")) {
          setMessage({ 
            type: "error", 
            text: "Connection failed. Please check if Supabase is configured correctly and your internet connection is working." 
          });
        } else if (error.message.includes("already registered")) {
          setMessage({ type: "error", text: "This email is already registered. Please sign in instead." });
        } else {
          setMessage({ type: "error", text: error.message });
        }
      } else {
        setMessage({
          type: "success",
          text: "Check your email to confirm your account!",
        });
      }
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: `Network error: ${err instanceof Error ? err.message : 'Failed to connect to server. Please check your internet connection and Supabase configuration.'}` 
      });
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Join JugGames to create and share your platformer games with JG Engine</CardDescription>
      </CardHeader>
      <CardContent>
        {!isConfigured && (
          <div className="p-3 mb-4 text-sm rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            ⚠️ Supabase not configured. Please add your environment variables to <code className="font-mono">.env.local</code>
          </div>
        )}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

