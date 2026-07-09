import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CreateUserForm from "@/components/admin/CreateUserForm";

export default function AdminCreateUserPage() {
  return (
    <ProtectedRoute role="admin">
      <DashboardLayout role="admin">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Create User Account
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Create accounts for students, faculty members, or administrators.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CreateUserForm />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}