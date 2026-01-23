import { SignUpForm } from "@/components/auth/sign-up-form";
import { SupabaseStatus } from "@/components/auth/supabase-status";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <SupabaseStatus />
        <SignUpForm />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="underline hover:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

