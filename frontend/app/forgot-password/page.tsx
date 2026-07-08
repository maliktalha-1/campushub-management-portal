import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import PublicRoute from "@/components/auth/PublicRoute";

export default function ForgotPasswordPage() {
  return (
    <PublicRoute>
      <AuthLayout
        title="Forgot Password"
        subtitle="Enter your email and we will send you a verification code."
      >
        <ForgotPasswordForm />
      </AuthLayout>
    </PublicRoute>
  );
}