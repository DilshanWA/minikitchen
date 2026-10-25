import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/token";
import { getSupabaseServerClient } from "@/lib/supabase";

export type CurrentUser = {
  userId: unknown;
  id: string;
  name: string;
  email: string;
  role: "admin";
};

export async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  const payload = await verifyToken(token);

  return payload?.userId ?? null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const { data, error } = await getSupabaseServerClient()
    .from("admin_users")
    .select("id, name, email, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Current user lookup failed:", error.message);
    return null;
  }

  if (!data || data.role !== "admin") return null;
  return data as CurrentUser;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}