import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Registration Restricted
        </h1>

        <p className="mt-4 text-slate-600">
          Account creation is handled by the administrator only.
          Please contact the admin office to receive your credentials.
        </p>

        <Link
          href="/#portals"
          className="mt-8 inline-flex rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white"
        >
          Back to Login
        </Link>
      </div>
    </main>
  );
}