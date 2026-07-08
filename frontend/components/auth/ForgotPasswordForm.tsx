"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail } from "lucide-react";

export default function ForgotPasswordForm() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/verify-otp?mode=forgot-password");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Email Address
        </label>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-blue-500">
          <Mail className="h-5 w-5 text-slate-400" />
          <input
            type="email"
            placeholder="Enter your registered email"
            className="w-full bg-transparent outline-none"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-2xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700"
      >
        Send OTP
        <ArrowRight className="ml-2 h-5 w-5" />
      </button>

      <p className="text-center text-sm text-slate-600">
        Remember your password?{" "}
        <Link href="/#portals" className="font-semibold text-blue-600">
          Login
        </Link>
      </p>
    </form>
  );
}