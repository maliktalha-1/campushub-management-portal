"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/authService";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newPassword = String(formData.get("newPassword") || "");

    if (!token) {
      toast.error("Reset token is missing.");
      return;
    }

    try {
      setLoading(true);

      await authService.resetPassword({
        token,
        newPassword,
      });

      toast.success("Password reset successfully.");
      router.push("/#portals");
    } catch {
      toast.error("Invalid or expired reset token.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Reset Password
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Enter your new password.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            name="newPassword"
            type="password"
            placeholder="New password"
            minLength={6}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            required
          />

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white disabled:opacity-70"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </main>
  );
}