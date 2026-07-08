import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { BookOpen, ClipboardCheck, UserCheck, Bell } from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Student Dashboard
          </h1>
          <p className="mt-2 text-slate-500">
            View your courses, assignments, attendance, and announcements.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Enrolled Courses" value="6" description="Active courses this semester" icon={BookOpen} color="blue" />
          <StatCard title="Pending Assignments" value="4" description="Assignments waiting for submission" icon={ClipboardCheck} color="orange" />
          <StatCard title="Attendance" value="92%" description="Overall attendance percentage" icon={UserCheck} color="emerald" />
          <StatCard title="Announcements" value="8" description="Latest university updates" icon={Bell} color="violet" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Recent Assignments</h2>
            <div className="mt-6 space-y-4">
              {["Database ERD", "React Components", "Networking Quiz"].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <span className="font-medium text-slate-700">{item}</span>
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Attendance Summary</h2>
            <div className="mt-6 h-56 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
              <p className="text-5xl font-bold text-blue-600">92%</p>
              <p className="mt-3 text-slate-600">Your current attendance record is good.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}