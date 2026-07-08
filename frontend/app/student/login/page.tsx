import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import PublicRoute from "@/components/auth/PublicRoute";

export default function StudentLoginPage() {
  return (
    <PublicRoute>
      <AuthLayout
        title="Student Login"
        subtitle="Access your courses, assignments and attendance."
      >
        <LoginForm role="student" />
      </AuthLayout>
    </PublicRoute>
  );
}