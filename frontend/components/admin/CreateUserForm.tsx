"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { adminService } from "@/services/adminService";

export default function CreateUserForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      setLoading(true);

      await adminService.createUser({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        role: formData.get("role") as "ADMIN" | "FACULTY" | "STUDENT",
      });

      toast.success("User account created successfully.");
      e.currentTarget.reset();
    } catch {
      toast.error("Failed to create user. Email may already exist.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        name="name"
        placeholder="Full name"
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email address"
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Temporary password"
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        required
      />

      <select
        name="role"
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        required
      >
        <option value="STUDENT">Student</option>
        <option value="FACULTY">Faculty</option>
        <option value="ADMIN">Administrator</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
      >
        <UserPlus className="h-5 w-5" />
        {loading ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}