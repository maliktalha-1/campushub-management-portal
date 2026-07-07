import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function FacultyLoginPage() {
  return (
    <AuthLayout
      title="Faculty Login"
      subtitle="Manage courses, assignments and attendance."
    >
      <LoginForm role="faculty" />
    </AuthLayout>
  );
}