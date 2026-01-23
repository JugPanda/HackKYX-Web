import { SignInForm } from "@/components/auth/sign-in-form";
import { SupabaseStatus } from "@/components/auth/supabase-status";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <SupabaseStatus />
        <SignInForm />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="underline hover:text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

