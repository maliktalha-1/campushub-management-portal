import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Building2, Plus, Search, MoreVertical, BookOpen, UserCog } from "lucide-react";

const departments = [
  {
    name: "Computer Science",
    head: "Dr. Sarah Ahmed",
    faculty: 45,
    courses: 18,
    status: "Active",
  },
  {
    name: "Software Engineering",
    head: "Prof. Usman Malik",
    faculty: 32,
    courses: 14,
    status: "Active",
  },
  {
    name: "Information Technology",
    head: "Dr. Hina Tariq",
    faculty: 28,
    courses: 12,
    status: "Active",
  },
];

export default function AdminDepartmentsPage() {
  return (
    <ProtectedRoute role="admin">
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage Departments
            </h1>
            <p className="mt-2 text-slate-500">
              Create, update, and monitor university departments.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-5 w-5" />
            Add Department
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">25</h3>
            <p className="text-slate-500">Total Departments</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <UserCog className="h-8 w-8 text-emerald-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">180</h3>
            <p className="text-slate-500">Faculty Members</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <BookOpen className="h-8 w-8 text-violet-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">96</h3>
            <p className="text-slate-500">Department Courses</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 lg:w-96">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                placeholder="Search departments..."
                className="w-full bg-transparent outline-none"
              />
            </div>

            <select className="rounded-2xl border border-slate-200 px-4 py-3 outline-none">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b text-sm text-slate-500">
                  <th className="py-4">Department</th>
                  <th>Head of Department</th>
                  <th>Faculty</th>
                  <th>Courses</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {departments.map((department) => (
                  <tr key={department.name} className="border-b last:border-0">
                    <td className="py-5 font-semibold text-slate-900">
                      {department.name}
                    </td>
                    <td className="text-slate-600">{department.head}</td>
                    <td className="text-slate-600">{department.faculty}</td>
                    <td className="text-slate-600">{department.courses}</td>
                    <td>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                        {department.status}
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
        </div>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
}