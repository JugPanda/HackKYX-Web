import { createClient } from "@/lib/supabase/server";

export type UserRole = 'user' | 'moderator' | 'admin';

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.role as UserRole;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin';
}

export async function isModerator(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'moderator' || role === 'admin';
}

export async function checkAdminAccess(): Promise<{
  hasAccess: boolean;
  user: any;
  role: UserRole | null;
}> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { hasAccess: false, user: null, role: null };
  }

  const role = await getUserRole(user.id);
  const hasAccess = role === 'admin';

  return { hasAccess, user, role };
}

export async function checkModeratorAccess(): Promise<{
  hasAccess: boolean;
  user: any;
  role: UserRole | null;
}> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { hasAccess: false, user: null, role: null };
  }

  const role = await getUserRole(user.id);
  const hasAccess = role === 'admin' || role === 'moderator';

  return { hasAccess, user, role };
}
