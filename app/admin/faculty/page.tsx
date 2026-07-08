import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Search, Plus, MoreVertical, UserCog } from "lucide-react";

const facultyMembers = [
  {
    name: "Dr. Sarah Ahmed",
    email: "sarah.ahmed@campushub.edu",
    department: "Computer Science",
    courses: 4,
    status: "Active",
  },
  {
    name: "Prof. Usman Malik",
    email: "usman.malik@campushub.edu",
    department: "Software Engineering",
    courses: 3,
    status: "Active",
  },
  {
    name: "Dr. Hina Tariq",
    email: "hina.tariq@campushub.edu",
    department: "Information Technology",
    courses: 2,
    status: "Inactive",
  },
];

export default function AdminFacultyPage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage Faculty
            </h1>
            <p className="mt-2 text-slate-500">
              Manage faculty members, assigned courses and account status.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-5 w-5" />
            Add Faculty
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <UserCog className="h-8 w-8 text-blue-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">180</h3>
            <p className="text-slate-500">Total Faculty</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <UserCog className="h-8 w-8 text-emerald-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">165</h3>
            <p className="text-slate-500">Active Faculty</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <UserCog className="h-8 w-8 text-orange-600" />
            <h3 className="mt-4 text-3xl font-bold text-slate-900">15</h3>
            <p className="text-slate-500">Inactive Faculty</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 lg:w-96">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                placeholder="Search faculty..."
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
                  <th className="py-4">Faculty Member</th>
                  <th>Department</th>
                  <th>Assigned Courses</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {facultyMembers.map((faculty) => (
                  <tr key={faculty.email} className="border-b last:border-0">
                    <td className="py-5">
                      <p className="font-semibold text-slate-900">
                        {faculty.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {faculty.email}
                      </p>
                    </td>

                    <td className="text-slate-600">{faculty.department}</td>
                    <td className="text-slate-600">{faculty.courses}</td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          faculty.status === "Active"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {faculty.status}
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
              Showing 1 to 3 of 180 faculty members
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