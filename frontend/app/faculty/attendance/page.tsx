import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ClipboardCheck, Save } from "lucide-react";

const students = ["Ali Raza", "Ayesha Khan", "Hamza Ahmed", "Zain Malik"];

export default function FacultyAttendancePage() {
  return (
    <ProtectedRoute role="faculty">
    <DashboardLayout role="faculty">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Record Attendance</h1>
          <p className="mt-2 text-slate-500">Mark and manage student attendance.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <select className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
              <option>Database Systems</option>
              <option>Web Engineering</option>
            </select>
            <input type="date" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            <button className="rounded-2xl bg-emerald-600 py-3 font-semibold text-white">
              Load Students
            </button>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b text-sm text-slate-500">
                  <th className="py-4">Student</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student} className="border-b last:border-0">
                    <td className="py-5 font-semibold text-slate-900">{student}</td>
                    <td>
                      <select className="rounded-xl border border-slate-200 px-4 py-2 outline-none">
                        <option>Present</option>
                        <option>Absent</option>
                        <option>Late</option>
                      </select>
                    </td>
                    <td>
                      <input className="rounded-xl border border-slate-200 px-4 py-2 outline-none" placeholder="Optional" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="mt-6 flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white">
            <Save className="h-5 w-5" />
            Save Attendance
          </button>
        </div>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
}