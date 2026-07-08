import { GraduationCap } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-3xl bg-blue-100 text-blue-600">
          <GraduationCap className="h-10 w-10" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          Loading CampusHub...
        </h1>

        <p className="mt-2 text-slate-500">
          Preparing your portal.
        </p>
      </div>
    </main>
  );
}