import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { BookOpen, Upload, Users, ClipboardCheck } from "lucide-react";

export default function FacultyDashboardPage() {
  return (
    <DashboardLayout role="faculty">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Faculty Dashboard
          </h1>
          <p className="mt-2 text-slate-500">
            Manage assigned courses, assignments, announcements, and attendance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Assigned Courses" value="5" description="Courses assigned this semester" icon={BookOpen} color="emerald" />
          <StatCard title="Assignments Uploaded" value="18" description="Total uploaded assignments" icon={Upload} color="blue" />
          <StatCard title="Students" value="240" description="Students across your courses" icon={Users} color="violet" />
          <StatCard title="Attendance Records" value="64" description="Attendance sessions recorded" icon={ClipboardCheck} color="orange" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Assigned Courses</h2>
            <div className="mt-6 space-y-4">
              {["Web Engineering", "Database Systems", "Computer Networks"].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-800">{item}</p>
                  <p className="mt-1 text-sm text-slate-500">View course dashboard and students</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
            <div className="mt-6 grid gap-4">
              <button className="rounded-2xl bg-emerald-600 px-5 py-4 font-semibold text-white">
                Upload Assignment
              </button>
              <button className="rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white">
                Record Attendance
              </button>
              <button className="rounded-2xl border border-slate-200 px-5 py-4 font-semibold text-slate-700">
                Post Announcement
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}