"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SupabaseStatus {
  configured: boolean;
  connected: boolean | null;
  error: string | null;
  url: string;
}

export function SupabaseStatus() {
  const [status, setStatus] = useState<SupabaseStatus>({
    configured: false,
    connected: null,
    error: null,
    url: "",
  });
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSupabase = async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !key) {
        setStatus({
          configured: false,
          connected: false,
          error: "Environment variables not set",
          url: "",
        });
        setChecking(false);
        return;
      }

      setStatus((prev) => ({ ...prev, configured: true, url }));

      try {
        const supabase = createClient();
        
        // Try to get the session to test connectivity
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus((prev) => ({
            ...prev,
            connected: false,
            error: `Connection error: ${error.message}`,
          }));
        } else {
          setStatus((prev) => ({
            ...prev,
            connected: true,
            error: null,
          }));
        }
      } catch (err) {
        setStatus((prev) => ({
          ...prev,
          connected: false,
          error: `Failed to connect: ${err instanceof Error ? err.message : 'Network error'}`,
        }));
      }
      
      setChecking(false);
    };

    checkSupabase();
  }, []);

  if (checking) {
    return (
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
        <CardContent className="pt-6">
          <p className="text-sm">Checking Supabase connection...</p>
        </CardContent>
      </Card>
    );
  }

  if (!status.configured) {
    return (
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900">
        <CardHeader>
          <CardTitle className="text-yellow-800 dark:text-yellow-400">⚠️ Supabase Not Configured</CardTitle>
          <CardDescription>Environment variables are missing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">Please add these to your <code className="font-mono bg-yellow-100 dark:bg-yellow-900/30 px-1 py-0.5 rounded">.env.local</code> file:</p>
          <pre className="text-xs bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
          </pre>
        </CardContent>
      </Card>
    );
  }

  if (status.connected === false) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-800 dark:text-red-400">❌ Supabase Connection Failed</CardTitle>
          <CardDescription>Cannot connect to Supabase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p><strong>Error:</strong> {status.error}</p>
            <p><strong>Project URL:</strong> <code className="text-xs bg-red-100 dark:bg-red-900/30 px-1 py-0.5 rounded">{status.url}</code></p>
          </div>
          
          <div className="text-sm border-t border-red-200 dark:border-red-900 pt-3 mt-3">
            <p className="font-semibold mb-2">Common fixes:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Check if your Supabase project is active (not paused)</li>
              <li>Verify the URL and API key are correct</li>
              <li>Add your site URL to Supabase Auth settings:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Go to Supabase Dashboard → Authentication → URL Configuration</li>
                  <li>Add <code className="bg-red-100 dark:bg-red-900/30 px-1 rounded">http://localhost:3000</code> to allowed URLs</li>
                  <li>Add your production domain when deploying</li>
                </ul>
              </li>
              <li>Check browser console for CORS errors</li>
              <li>Try restarting your development server</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status.connected === true) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
        <CardContent className="pt-6">
          <p className="text-sm text-green-800 dark:text-green-400">
            ✅ Supabase connected successfully
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
}
