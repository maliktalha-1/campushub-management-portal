import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { GraduationCap, UserCog, Building2, BarChart3 } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Administrator Dashboard
          </h1>
          <p className="mt-2 text-slate-500">
            Manage students, faculty, departments, accounts, and statistics.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Students" value="2,540" description="Registered student accounts" icon={GraduationCap} color="blue" />
          <StatCard title="Faculty Members" value="180" description="Active faculty members" icon={UserCog} color="emerald" />
          <StatCard title="Departments" value="25" description="University departments" icon={Building2} color="violet" />
          <StatCard title="Attendance Rate" value="96%" description="Overall attendance statistics" icon={BarChart3} color="orange" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">University Statistics</h2>
            <div className="mt-6 h-64 rounded-2xl bg-gradient-to-br from-violet-50 to-blue-50 p-6">
              <p className="text-slate-600">Analytics chart placeholder</p>
              <div className="mt-8 flex h-40 items-end gap-4">
                {[60, 90, 70, 120, 100, 140].map((h, i) => (
                  <div key={i} className="w-full rounded-t-xl bg-violet-500" style={{ height: `${h}px` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Recent Admin Actions</h2>
            <div className="mt-6 space-y-4">
              {[
                "New faculty member added",
                "Department updated",
                "Student account activated",
                "Course assigned to faculty",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 p-4 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}