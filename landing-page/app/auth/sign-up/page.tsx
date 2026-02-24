import { SignUpForm } from "@/components/auth/sign-up-form";
import { SupabaseStatus } from "@/components/auth/supabase-status";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-[#010409] dark:via-[#0d1117] dark:to-[#010409]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Your Account 🎮</h1>
          <p className="text-muted-foreground">
            Join thousands of game creators. It&apos;s free!
          </p>
        </div>
        <SupabaseStatus />
        <SignUpForm />
        <div className="space-y-3">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="underline hover:text-primary font-medium">
              Sign in
            </Link>
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">✓ No credit card needed</span>
            <span className="flex items-center gap-1">✓ Create games instantly</span>
          </div>
        </div>
      </div>
    </div>
  );
}

