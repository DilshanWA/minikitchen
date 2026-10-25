"use client";

import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/actions/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState<AuthState, FormData>(signIn, { status: "idle" });

  return (
    <main className="relative z-[60] flex min-h-screen items-center justify-center bg-white px-5 py-12 text-[#18251f] sm:px-6">
      <section className="w-full max-w-[440px] border border-[#e7e8e4] bg-white p-6 shadow-[0_20px_60px_rgba(24,37,31,0.06)] sm:p-10" aria-label="Sign in to your account">
        <div className="mb-8 text-center">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-[#d96e3d]">Welcome back</p>
          <p className="font-serif text-3xl font-normal tracking-[-1px]">Sign in to Mini Kitchen</p>
          <p className="mt-3 text-xs leading-5 text-[#7b847c]">Enter your details to continue to your workspace.</p>
        </div>

        <form action={formAction} className="grid gap-2">
          <label htmlFor="login-email" className="mt-2 text-[11px] font-bold text-[#424d45]">Email address</label>
          <div className="flex min-h-11 items-center gap-2.5 border border-[#dfe3dd] px-3 transition focus-within:border-[#a6b8a0] focus-within:ring-4 focus-within:ring-[#a6b8a0]/15">
            <Mail size={17} className="shrink-0 text-[#929c93]" aria-hidden="true" />
            <input id="login-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required className="w-full bg-transparent text-xs text-[#18251f] outline-none placeholder:text-[#a8aea8]" />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <label htmlFor="login-password" className="text-[11px] font-bold text-[#424d45]">Password</label>
            <Link href="/admin/forgot-password" className="text-[10px] text-[#d96e3d] hover:underline">Forgot password?</Link>
          </div>
          <div className="flex min-h-11 items-center gap-2.5 border border-[#dfe3dd] px-3 transition focus-within:border-[#a6b8a0] focus-within:ring-4 focus-within:ring-[#a6b8a0]/15">
            <LockKeyhole size={17} className="shrink-0 text-[#929c93]" aria-hidden="true" />
            <input id="login-password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" required className="w-full bg-transparent text-xs text-[#18251f] outline-none placeholder:text-[#a8aea8]" />
            <button type="button" className="grid place-items-center text-[#89958b] hover:text-[#18251f]" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {state.status === "error" && <p role="alert" className="mt-2 text-xs text-red-700">{state.message}</p>}
          <button type="submit" disabled={pending} className="mt-5 mb-4 flex min-h-12 items-center justify-center gap-2 bg-[#18251f] text-xs font-bold text-white transition hover:bg-[#2b3d31] disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? "Signing in..." : "Sign in"} {!pending && <ArrowRight size={17} />}
          </button>
        </form>

        <p className="mt-10 text-center text-[11px] text-[#858e86]">
          Don&apos;t have an account?{" "}
          <Link href="/admin/signup" className="font-bold text-[#18251f] hover:text-[#d96e3d]">Create one</Link>
        </p>
      </section>
    </main>
  );
}
