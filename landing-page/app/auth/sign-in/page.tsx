import { SignInForm } from "@/components/auth/sign-in-form";
import { SupabaseStatus } from "@/components/auth/supabase-status";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-[#010409] dark:via-[#0d1117] dark:to-[#010409]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome Back! 👋</h1>
          <p className="text-muted-foreground">
            Sign in to continue creating awesome games
          </p>
        </div>
        <SupabaseStatus />
        <SignInForm />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="underline hover:text-primary font-medium">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}

