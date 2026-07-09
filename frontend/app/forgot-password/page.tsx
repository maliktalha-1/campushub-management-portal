"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authService } from "@/services/authService";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();

    try {
      setLoading(true);
      const data = await authService.forgotPassword({ email });

      toast.success("Reset link generated.");
      setResetLink(data.resetLink || "");
    } catch {
      toast.error("Failed to generate reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Forgot Password
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Enter your email to generate a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            required
          />

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white disabled:opacity-70"
          >
            {loading ? "Generating..." : "Generate Reset Link"}
          </button>
        </form>

        {resetLink && (
          <div className="mt-6 rounded-2xl bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
            <p className="font-semibold">Reset Link:</p>
            <Link href={resetLink.replace("http://localhost:3000", "")}>
              {resetLink}
            </Link>
          </div>
        )}

        <Link
          href="/#portals"
          className="mt-6 block text-center text-sm font-semibold text-blue-600"
        >
          Back to login
        </Link>
      </div>
    </main>
  );
}