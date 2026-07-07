"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, MailCheck } from "lucide-react";
import { useState } from "react";

export default function OTPVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role") || "student";
  const mode = searchParams.get("mode") || "login";

  const [otp, setOtp] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (mode === "forgot-password") {
      router.push("/forgot-password");
      return;
    }

    if (role === "admin") router.push("/admin/dashboard");
    else if (role === "faculty") router.push("/faculty/dashboard");
    else router.push("/student/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center">
        <div className="rounded-3xl bg-blue-100 p-5 text-blue-600">
          <MailCheck className="h-10 w-10" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-slate-600">
          We sent a 6-digit verification code to your email.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Verification Code
        </label>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="Enter 6-digit code"
          className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-center text-2xl font-bold tracking-[0.4em] outline-none focus:border-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-2xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700"
      >
        Verify OTP
        <ArrowRight className="ml-2 h-5 w-5" />
      </button>

      <p className="text-center text-sm text-slate-600">
        Didn&apos;t receive code?{" "}
        <button type="button" className="font-semibold text-blue-600">
          Resend
        </button>
      </p>
    </form>
  );
}