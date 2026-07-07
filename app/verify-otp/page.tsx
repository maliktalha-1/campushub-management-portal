import AuthLayout from "@/components/auth/AuthLayout";
import OTPVerificationForm from "@/components/auth/OTPVerificationForm";

export default function VerifyOTPPage() {
  return (
    <AuthLayout
      title="Verify OTP"
      subtitle="Enter the verification code sent to your email."
    >
      <OTPVerificationForm />
    </AuthLayout>
  );
}