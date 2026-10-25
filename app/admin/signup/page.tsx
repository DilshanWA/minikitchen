"use client";

import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { useState } from "react";
import { useActionState } from "react";
import { signUp, type AuthState } from "@/app/actions/auth";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState<AuthState, FormData>(signUp, { status: "idle" });

  return (
    <main className="relative z-[60] flex min-h-screen items-center justify-center bg-white px-5 py-12 text-[#18251f] sm:px-6">
      <section className="w-full max-w-[440px] border border-[#e7e8e4] bg-white p-6 shadow-[0_20px_60px_rgba(24,37,31,0.06)] sm:p-10" aria-label="Create your account">
        <div className="mb-8 text-center">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[2px] text-[#d96e3d]">Welcome in</p>
          <p className="font-serif text-3xl font-normal tracking-[-1px]">Create your account</p>
          <p className="mt-3 text-xs leading-5 text-[#7b847c]">Start managing your kitchen in a few simple steps.</p>
        </div>

        <form action={formAction} className="grid gap-2">
          <label htmlFor="signup-name" className="mt-2 text-[11px] font-bold text-[#424d45]">Full name</label>
          <div className="flex min-h-11 items-center gap-2.5 border border-[#dfe3dd] px-3 transition focus-within:border-[#a6b8a0] focus-within:ring-4 focus-within:ring-[#a6b8a0]/15">
            <UserRound size={17} className="shrink-0 text-[#929c93]" aria-hidden="true" />
            <input id="signup-name" name="name" type="text" placeholder="Your name" autoComplete="name" required className="w-full bg-transparent text-xs text-[#18251f] outline-none placeholder:text-[#a8aea8]" />
          </div>

          <label htmlFor="signup-email" className="mt-2 text-[11px] font-bold text-[#424d45]">Email address</label>
          <div className="flex min-h-11 items-center gap-2.5 border border-[#dfe3dd] px-3 transition focus-within:border-[#a6b8a0] focus-within:ring-4 focus-within:ring-[#a6b8a0]/15">
            <span className="w-[17px] text-center text-base text-[#929c93]" aria-hidden="true">@</span>
            <input id="signup-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required className="w-full bg-transparent text-xs text-[#18251f] outline-none placeholder:text-[#a8aea8]" />
          </div>

          <label htmlFor="signup-password" className="mt-2 text-[11px] font-bold text-[#424d45]">Password</label>
          <div className="flex min-h-11 items-center gap-2.5 border border-[#dfe3dd] px-3 transition focus-within:border-[#a6b8a0] focus-within:ring-4 focus-within:ring-[#a6b8a0]/15">
            <LockKeyhole size={17} className="shrink-0 text-[#929c93]" aria-hidden="true" />
            <input id="signup-password" name="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" minLength={8} autoComplete="new-password" required className="w-full bg-transparent text-xs text-[#18251f] outline-none placeholder:text-[#a8aea8]" />
            <button type="button" className="grid place-items-center text-[#89958b] hover:text-[#18251f]" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <label className="my-3 flex items-start gap-2 text-[10px] leading-4 text-[#818a82]">
            <input type="checkbox" required className="mt-0.5 accent-[#d96e3d]" />
            <span>I agree to the <Link href="/terms" className="text-[#18251f] underline underline-offset-2">terms of service</Link> and <Link href="/privacy" className="text-[#18251f] underline underline-offset-2">privacy policy</Link>.</span>
          </label>

          {state.status === "error" && <p role="alert" className="text-xs text-red-700">{state.message}</p>}
          <button type="submit" disabled={pending} className="flex min-h-12 mb-4 items-center justify-center gap-2 bg-[#18251f] text-xs font-bold text-white transition hover:bg-[#2b3d31] disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? "Creating account..." : "Create account"} {!pending && <ArrowRight size={17} />}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-[#858e86]">
          Already have an account?{" "}
          <Link href="/admin/login" className="font-bold text-[#18251f] hover:text-[#d96e3d]">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
