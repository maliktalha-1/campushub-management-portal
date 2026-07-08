import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RegisterForm from "@/components/auth/RegisterForm";

export default function AdminCreateUserPage() {
  return (
    <ProtectedRoute role="admin">
      <DashboardLayout role="admin">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Create User Account
            </h1>

            <p className="mt-2 text-slate-500">
              Create accounts for students, faculty members, or administrators.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <RegisterForm />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}