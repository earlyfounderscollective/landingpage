"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin/training";

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Incorrect password");
      }
      router.push(next);
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Incorrect password";
      setError(msg);
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[400px] bg-white border border-line/60 rounded-2xl p-7 md:p-8 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]"
      >
        <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brass">
          Early Founders · Admin
        </p>
        <h1 className="mt-5 font-serif text-[26px] leading-[1.2] tracking-[-0.012em] text-forest">
          Sign in.
        </h1>
        <p className="mt-3 text-[13.5px] text-ink/65 leading-[1.55]">
          Enter the admin password to manage training, sequences, and content.
        </p>

        <div className="mt-7">
          <label className="block">
            <span className="text-[12px] font-medium text-forest mb-1.5 block">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="w-full px-4 py-[14px] bg-white border border-line rounded-md text-[15px] focus:outline-none focus:border-forest"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={status === "submitting" || !password}
          className="mt-5 w-full bg-forest text-ivory px-5 py-[14px] rounded-full text-[14px] font-medium tracking-[0.02em] hover:bg-ink transition-colors disabled:opacity-60"
        >
          {status === "submitting" ? "Signing in…" : "Sign in"}
        </button>

        {error && (
          <p className="mt-4 text-[12.5px] text-[#a13a1a] text-center" role="alert">
            {error}
          </p>
        )}
      </form>
    </main>
  );
}
