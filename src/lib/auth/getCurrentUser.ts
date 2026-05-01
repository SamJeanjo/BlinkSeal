import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabase/admin";

export type AppUser = {
  id: string;
  clerk_user_id: string;
  email: string | null;
  name: string | null;
  created_at: string;
};

export async function getCurrentUser() {
  const session = await auth();
  if (!session.userId) {
    return null;
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress ?? null;
  const name =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.username ||
    null;

  if (!hasSupabaseAdminConfig()) {
    return {
      id: session.userId,
      clerk_user_id: session.userId,
      email,
      name,
      created_at: new Date().toISOString()
    } satisfies AppUser;
  }

  const supabase = getSupabaseAdmin();

  const { data: existing, error: existingError } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", session.userId)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    return existing as AppUser;
  }

  const { data, error } = await supabase
    .from("users")
    .insert({
      clerk_user_id: session.userId,
      email,
      name
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as AppUser;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}
