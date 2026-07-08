import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import PublicRoute from "@/components/auth/PublicRoute";

export default function AdminLoginPage() {
  return (
    <PublicRoute>
      <AuthLayout
        title="Admin Login"
        subtitle="Manage students, faculty, departments and analytics."
      >
        <LoginForm role="admin" />
      </AuthLayout>
    </PublicRoute>
  );
}