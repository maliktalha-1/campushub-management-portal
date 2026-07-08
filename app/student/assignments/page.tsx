import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Download, FileText, Calendar } from "lucide-react";

const assignments = [
  {
    title: "ERD Design Task",
    course: "Database Systems",
    due: "20 July 2026",
    status: "Pending",
  },
  {
    title: "React Components Lab",
    course: "Web Engineering",
    due: "24 July 2026",
    status: "Submitted",
  },
  {
    title: "Subnetting Practice",
    course: "Computer Networks",
    due: "28 July 2026",
    status: "Pending",
  },
];

export default function StudentAssignmentsPage() {
  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            My Assignments
          </h1>
          <p className="mt-2 text-slate-500">
            Download assignments and track your submission status.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b text-sm text-slate-500">
                  <th className="py-4">Assignment</th>
                  <th>Course</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th className="text-right">Download</th>
                </tr>
              </thead>

              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment.title} className="border-b last:border-0">
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-slate-900">
                          {assignment.title}
                        </span>
                      </div>
                    </td>

                    <td className="text-slate-600">{assignment.course}</td>

                    <td className="text-slate-600">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {assignment.due}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          assignment.status === "Submitted"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </td>

                    <td className="text-right">
                      <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}