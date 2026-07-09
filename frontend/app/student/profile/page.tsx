"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { StudentProfile } from "@/services/adminService";
import { studentService } from "@/services/studentService";
import {
  CalendarDays,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await studentService.getMyProfile();
      setProfile(data);
    } catch {
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, [fetchProfile]);

  const initials = profile?.user.name
    ? profile.user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "ST";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const phone = String(formData.get("phone") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const dateOfBirth = String(formData.get("dateOfBirth") || "").trim();

    try {
      setSaving(true);
      const updatedProfile = await studentService.updateMyProfile({
        phone,
        address,
        ...(dateOfBirth ? { dateOfBirth } : {}),
      });

      setProfile(updatedProfile);
      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute role="student">
      <DashboardLayout role="student">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Profile
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              View your academic profile and update your contact details.
            </p>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              Loading profile...
            </div>
          ) : !profile ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              No student profile found.
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-600 dark:bg-blue-950/40">
                  {initials}
                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
                  {profile.user.name}
                </h2>

                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  {profile.studentId}
                </p>

                <div className="mt-6 rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-blue-600 dark:bg-blue-950/30">
                  Semester {profile.semester}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Personal Information
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="mt-6 grid gap-5 md:grid-cols-2"
                >
                  <ProfileField
                    label="Full Name"
                    icon={<User className="h-5 w-5 text-slate-400" />}
                    value={profile.user.name}
                  />

                  <ProfileField
                    label="Email"
                    icon={<Mail className="h-5 w-5 text-slate-400" />}
                    value={profile.user.email}
                  />

                  <ProfileField
                    label="Student ID"
                    icon={
                      <GraduationCap className="h-5 w-5 text-slate-400" />
                    }
                    value={profile.studentId}
                  />

                  <ProfileField
                    label="Department"
                    icon={
                      <GraduationCap className="h-5 w-5 text-slate-400" />
                    }
                    value={profile.department.name}
                  />

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Phone
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                      <Phone className="h-5 w-5 text-slate-400" />
                      <input
                        name="phone"
                        defaultValue={profile.phone ?? ""}
                        placeholder="Phone number"
                        className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Date of Birth
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                      <CalendarDays className="h-5 w-5 text-slate-400" />
                      <input
                        name="dateOfBirth"
                        type="date"
                        defaultValue={
                          profile.dateOfBirth
                            ? profile.dateOfBirth.slice(0, 10)
                            : ""
                        }
                        className="w-full bg-transparent text-slate-900 outline-none dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Address
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                      <MapPin className="h-5 w-5 text-slate-400" />
                      <input
                        name="address"
                        defaultValue={profile.address ?? ""}
                        placeholder="Address"
                        className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70 md:col-span-2"
                  >
                    {saving ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="h-5 w-5" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function ProfileField({
  label,
  icon,
  value,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
        {icon}
        <input
          value={value}
          readOnly
          className="w-full bg-transparent text-slate-600 outline-none dark:text-slate-300"
        />
      </div>
    </div>
  );
}
