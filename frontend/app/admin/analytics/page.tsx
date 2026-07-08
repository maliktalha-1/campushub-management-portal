import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  BarChart3,
  TrendingUp,
  GraduationCap,
  ClipboardCheck,
} from "lucide-react";

const bars = [
  { label: "Jan", value: 80 },
  { label: "Feb", value: 120 },
  { label: "Mar", value: 95 },
  { label: "Apr", value: 150 },
  { label: "May", value: 130 },
  { label: "Jun", value: 170 },
];

export default function AdminAnalyticsPage() {
  return (
    <ProtectedRoute role="admin">
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            University Analytics
          </h1>
          <p className="mt-2 text-slate-500">
            View statistics for attendance, assignments, students and departments.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">18%</h3>
            <p className="text-slate-500">Student Growth</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <ClipboardCheck className="h-8 w-8 text-emerald-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">96%</h3>
            <p className="text-slate-500">Attendance Rate</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <GraduationCap className="h-8 w-8 text-violet-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">2,540</h3>
            <p className="text-slate-500">Total Students</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Student Growth
              </h2>
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>

            <div className="mt-8 flex h-72 items-end gap-4">
              {bars.map((bar) => (
                <div key={bar.label} className="flex flex-1 flex-col items-center gap-3">
                  <div
                    className="w-full rounded-t-2xl bg-blue-600"
                    style={{ height: `${bar.value}px` }}
                  />
                  <span className="text-sm text-slate-500">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Assignment Statistics
            </h2>

            <div className="mt-8 space-y-6">
              {[
                { label: "Submitted", value: "78%", color: "bg-emerald-600" },
                { label: "Pending", value: "16%", color: "bg-orange-500" },
                { label: "Late", value: "6%", color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="text-slate-500">{item.value}</span>
                  </div>

                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className={`h-3 rounded-full ${item.color}`}
                      style={{ width: item.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
}