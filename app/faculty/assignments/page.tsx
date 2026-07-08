import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Upload, FileText, Calendar } from "lucide-react";

const assignments = [
  { title: "ERD Design Task", course: "Database Systems", due: "20 July 2026" },
  { title: "React Components Lab", course: "Web Engineering", due: "24 July 2026" },
  { title: "Subnetting Practice", course: "Computer Networks", due: "28 July 2026" },
];

export default function FacultyAssignmentsPage() {
  return (
    <DashboardLayout role="faculty">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Upload Assignments</h1>
          <p className="mt-2 text-slate-500">Create and manage course assignments.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">New Assignment</h2>

            <form className="mt-6 space-y-5">
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Assignment title" />
              <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                <option>Database Systems</option>
                <option>Web Engineering</option>
                <option>Computer Networks</option>
              </select>
              <textarea className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Instructions" />
              <input type="date" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" />

              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 font-semibold text-white">
                <Upload className="h-5 w-5" />
                Upload Assignment
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Recent Assignments</h2>

            <div className="mt-6 space-y-4">
              {assignments.map((item) => (
                <div key={item.title} className="rounded-2xl bg-slate-50 p-5">
                  <FileText className="h-6 w-6 text-emerald-600" />
                  <h3 className="mt-3 font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.course}</p>
                  <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    Due: {item.due}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}