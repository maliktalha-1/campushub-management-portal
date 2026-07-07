import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function StudentLoginPage() {
  return (
    <AuthLayout
      title="Student Login"
      subtitle="Access your courses, assignments and attendance."
    >
      <LoginForm role="student" />
    </AuthLayout>
  );
}