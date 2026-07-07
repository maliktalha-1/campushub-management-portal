import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function AdminLoginPage() {
  return (
    <AuthLayout
      title="Admin Login"
      subtitle="Manage students, faculty, departments and analytics."
    >
      <LoginForm role="admin" />
    </AuthLayout>
  );
}