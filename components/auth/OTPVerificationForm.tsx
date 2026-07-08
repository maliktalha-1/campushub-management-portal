"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, MailCheck } from "lucide-react";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import { addNotification } from "@/store/slices/notificationSlice";

type Role = "student" | "faculty" | "admin";

export default function OTPVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const role = (searchParams.get("role") || "student") as Role;
  const mode = searchParams.get("mode") || "login";

  const [otp, setOtp] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const pendingUser = localStorage.getItem("pendingUser");

    if (mode === "forgot-password") {
      dispatch(
        addNotification({
          message: "OTP verified. You can reset your password now.",
          type: "success",
        })
      );

      router.push("/forgot-password");
      return;
    }

    if (pendingUser) {
      dispatch(login(JSON.parse(pendingUser)));
      localStorage.removeItem("pendingUser");
    } else {
      dispatch(
        login({
          name: role === "admin" ? "Administrator" : role === "faculty" ? "Faculty Member" : "Student User",
          email: `${role}@campushub.edu`,
          role,
        })
      );
    }

    dispatch(
      addNotification({
        message: "Login successful",
        type: "success",
      })
    );

    router.push(`/${role}/dashboard`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center">
        <div className="rounded-3xl bg-blue-100 p-5 text-blue-600">
          <MailCheck className="h-10 w-10" />
        </div>
      </div>

      <p className="text-center text-sm text-slate-600">
        We sent a 6-digit verification code to your email.
      </p>

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
    </form>
  );
}