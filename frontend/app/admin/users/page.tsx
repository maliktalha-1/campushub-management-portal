"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminService } from "@/services/adminService";
import { Search, UserCheck, UserX, Shield, MoreVertical } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "FACULTY" | "STUDENT";
  status: "ACTIVE" | "INACTIVE";
}

export default function UserAccountsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch {
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  async function handleStatusChange(
    id: number,
    currentStatus: "ACTIVE" | "INACTIVE"
  ) {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      await adminService.updateUserStatus(id, newStatus);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user
        )
      );

      toast.success(
        newStatus === "ACTIVE"
          ? "User activated successfully."
          : "User deactivated successfully."
      );
    } catch {
      toast.error("Failed to update user status.");
    }
  }

  const activeUsers = users.filter((user) => user.status === "ACTIVE").length;
  const inactiveUsers = users.filter((user) => user.status === "INACTIVE").length;

  return (
    <ProtectedRoute role="admin">
      <DashboardLayout role="admin">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              User Accounts
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Activate, deactivate and manage all CampusHub users.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <UserCheck className="h-8 w-8 text-emerald-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {activeUsers}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Active Accounts
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <UserX className="h-8 w-8 text-red-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {inactiveUsers}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Inactive Accounts
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Shield className="h-8 w-8 text-blue-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {users.length}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Total Users
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex max-w-md items-center rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
              <Search className="mr-3 h-5 w-5 text-slate-400" />

              <input
                placeholder="Search user..."
                className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b text-left text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <th className="py-4">User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500">
                        Loading users...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b last:border-0 dark:border-slate-800"
                      >
                        <td className="py-5">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {user.name}
                          </p>

                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {user.email}
                          </p>
                        </td>

                        <td className="text-slate-700 dark:text-slate-300">
                          {user.role}
                        </td>

                        <td>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              user.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>

                        <td className="text-right">
                          <button
                            onClick={() =>
                              handleStatusChange(user.id, user.status)
                            }
                            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                              user.status === "ACTIVE"
                                ? "bg-red-100 text-red-600 hover:bg-red-200"
                                : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                            }`}
                          >
                            {user.status === "ACTIVE"
                              ? "Deactivate"
                              : "Activate"}
                          </button>

                          <button className="ml-2 rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                            <MoreVertical className="h-5 w-5 text-slate-500" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
