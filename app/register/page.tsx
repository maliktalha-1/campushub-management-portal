import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Register to access your CampusHub portal."
    >
      <RegisterForm />
    </AuthLayout>
  );
}