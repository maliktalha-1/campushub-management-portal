import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Mail, Phone, MapPin, GraduationCap, Save } from "lucide-react";

export default function StudentProfilePage() {
  return (
    <ProtectedRoute role="student">
      <DashboardLayout role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Update Profile
          </h1>
          <p className="mt-2 text-slate-500">
            Manage your personal and academic information.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-600">
              AR
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Ali Raza
            </h2>

            <p className="mt-1 text-slate-500">BSCS Student</p>

            <div className="mt-6 rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-blue-600">
              Semester 4
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900">
              Personal Information
            </h2>

            <form className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  defaultValue="Ali Raza"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <input
                    defaultValue="ali.raza@campushub.edu"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <input
                    defaultValue="+92 300 1234567"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Department
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                  <GraduationCap className="h-5 w-5 text-slate-400" />
                  <input
                    defaultValue="Computer Science"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Address
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <input
                    defaultValue="Lahore, Pakistan"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              <button className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white md:col-span-2">
                <Save className="h-5 w-5" />
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  </ProtectedRoute>
);
}