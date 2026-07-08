import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Search,
  UserCheck,
  UserX,
  Shield,
  MoreVertical,
} from "lucide-react";

const users = [
  {
    name: "Ali Raza",
    email: "ali.raza@campushub.edu",
    role: "Student",
    status: "Active",
  },
  {
    name: "Dr. Sarah Ahmed",
    email: "sarah.ahmed@campushub.edu",
    role: "Faculty",
    status: "Active",
  },
  {
    name: "Admin Office",
    email: "admin@campushub.edu",
    role: "Administrator",
    status: "Active",
  },
  {
    name: "Hamza Ahmed",
    email: "hamza@campushub.edu",
    role: "Student",
    status: "Inactive",
  },
];

export default function UserAccountsPage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            User Accounts
          </h1>

          <p className="mt-2 text-slate-500">
            Activate, deactivate and manage all CampusHub users.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <UserCheck className="h-8 w-8 text-emerald-600" />

            <h2 className="mt-4 text-3xl font-bold">
              2,755
            </h2>

            <p className="text-slate-500">
              Active Accounts
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <UserX className="h-8 w-8 text-red-600" />

            <h2 className="mt-4 text-3xl font-bold">
              145
            </h2>

            <p className="text-slate-500">
              Inactive Accounts
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <Shield className="h-8 w-8 text-blue-600" />

            <h2 className="mt-4 text-3xl font-bold">
              2,900
            </h2>

            <p className="text-slate-500">
              Total Users
            </p>
          </div>

        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center rounded-2xl border border-slate-200 px-4 py-3 max-w-md">
            <Search className="mr-3 h-5 w-5 text-slate-400" />

            <input
              placeholder="Search user..."
              className="w-full bg-transparent outline-none"
            />
          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>

                <tr className="border-b text-left text-sm text-slate-500">

                  <th className="py-4">User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>

                </tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr
                    key={user.email}
                    className="border-b last:border-0"
                  >

                    <td className="py-5">
                      <p className="font-semibold">
                        {user.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        {user.email}
                      </p>
                    </td>

                    <td>{user.role}</td>

                    <td>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {user.status}
                      </span>

                    </td>

                    <td className="text-right">

                      <button
                        className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                          user.status === "Active"
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                        }`}
                      >
                        {user.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button className="ml-2 rounded-xl p-2 hover:bg-slate-100">
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
  );
}