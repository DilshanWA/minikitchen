"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createToken } from "@/lib/token";

export type AuthState = { status: "idle" } | { status: "error"; message: string };

const SESSION_COOKIE = "auth_token";
const ONE_HOUR = 60 * 60;

function getValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function startSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, await createToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_HOUR,
  });
}

export async function signUp(_previousState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = getSupabaseServerClient();
  const name = getValue(formData, "name");
  const email = getValue(formData, "email").toLowerCase();
  const password = getValue(formData, "password");

  if (name.length < 2 || name.length > 100 || !validEmail(email) || password.length < 8) {
    return { status: "error", message: "Enter a valid name, email, and password of at least 8 characters." };
  }

  const { data: existingUser, error: lookupError } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    console.error("Admin lookup failed:", lookupError.message);
    return { status: "error", message: "We couldn't create your account. Please try again." };
  }
  if (existingUser) {
    return { status: "error", message: "An account with that email already exists." };
  }

  const { data: user, error } = await supabase
    .from("admin_users")
    .insert({ name, email, password_hash: hashPassword(password), role: "admin" })
    .select("id")
    .single();

  if (error || !user) {
    console.error("Admin signup failed:", error?.message ?? "No user returned");
    return { status: "error", message: "We couldn't create your account. Please try again." };
  }

  await startSession(user.id);
  redirect("/admin/dashboard");
}

export async function signIn(_previousState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = getSupabaseServerClient();
  const email = getValue(formData, "email").toLowerCase();
  const password = getValue(formData, "password");

  if (!validEmail(email) || !password) {
    return { status: "error", message: "Enter a valid email and password." };
  }

  const { data: user, error } = await supabase
    .from("admin_users")
    .select("id, password_hash, role")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("Admin login lookup failed:", error.message);
    return { status: "error", message: "We couldn't sign you in. Please try again." };
  }
  if (!user || user.role !== "admin" || !verifyPassword(password, user.password_hash)) {
    return { status: "error", message: "Invalid email or password." };
  }

  await startSession(user.id);
  redirect("/admin/dashboard");
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
