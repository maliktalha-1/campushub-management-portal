import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Search,
  Plus,
  MoreVertical,
  GraduationCap,
} from "lucide-react";

const students = [
  {
    name: "Ali Raza",
    email: "ali.raza@campushub.edu",
    department: "Computer Science",
    semester: "4th",
    status: "Active",
  },
  {
    name: "Ayesha Khan",
    email: "ayesha.khan@campushub.edu",
    department: "Software Engineering",
    semester: "6th",
    status: "Active",
  },
  {
    name: "Hamza Ahmed",
    email: "hamza.ahmed@campushub.edu",
    department: "Information Technology",
    semester: "2nd",
    status: "Inactive",
  },
];

export default function AdminStudentsPage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage Students
            </h1>
            <p className="mt-2 text-slate-500">
              View, search, filter, activate and deactivate student accounts.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-5 w-5" />
            Add Student
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">2,540</h3>
            <p className="text-slate-500">Total Students</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <GraduationCap className="h-8 w-8 text-emerald-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">2,410</h3>
            <p className="text-slate-500">Active Students</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <GraduationCap className="h-8 w-8 text-orange-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">130</h3>
            <p className="text-slate-500">Inactive Students</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 lg:w-96">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                placeholder="Search students..."
                className="w-full bg-transparent outline-none"
              />
            </div>

            <div className="flex gap-3">
              <select className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                <option>All Departments</option>
                <option>Computer Science</option>
                <option>Software Engineering</option>
                <option>Information Technology</option>
              </select>

              <select className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="border-b text-sm text-slate-500">
                  <th className="py-4">Student</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.email} className="border-b last:border-0">
                    <td className="py-5">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {student.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {student.email}
                        </p>
                      </div>
                    </td>

                    <td className="text-slate-600">{student.department}</td>
                    <td className="text-slate-600">{student.semester}</td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          student.status === "Active"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td className="text-right">
                      <button className="rounded-xl p-2 hover:bg-slate-100">
                        <MoreVertical className="h-5 w-5 text-slate-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing 1 to 3 of 2,540 students
            </p>

            <div className="flex gap-2">
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium">
                Previous
              </button>
              <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                1
              </button>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}