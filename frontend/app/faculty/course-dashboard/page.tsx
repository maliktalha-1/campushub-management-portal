import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { BookOpen, Users, ClipboardCheck, BarChart3 } from "lucide-react";

export default function FacultyCourseDashboardPage() {
  return (
    <ProtectedRoute role="faculty">
    <DashboardLayout role="faculty">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Course Dashboard</h1>
          <p className="mt-2 text-slate-500">Overview of your course performance and activities.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Courses" value="5" description="Assigned courses" icon={BookOpen} color="emerald" />
          <StatCard title="Students" value="240" description="Total enrolled students" icon={Users} color="blue" />
          <StatCard title="Assignments" value="18" description="Uploaded assignments" icon={ClipboardCheck} color="orange" />
          <StatCard title="Progress" value="84%" description="Course activity progress" icon={BarChart3} color="violet" />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Course Activity</h2>

          <div className="mt-8 space-y-6">
            {[
              { label: "Assignment Submission", value: "72%", color: "bg-emerald-600" },
              { label: "Attendance Average", value: "88%", color: "bg-blue-600" },
              { label: "Course Completion", value: "64%", color: "bg-violet-600" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="text-slate-500">{item.value}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div className={`h-3 rounded-full ${item.color}`} style={{ width: item.value }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
}