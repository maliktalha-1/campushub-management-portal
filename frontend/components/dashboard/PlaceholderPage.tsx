import { LucideIcon, ArrowRight } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function PlaceholderPage({
  title,
  description,
  icon: Icon,
}: PlaceholderPageProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
        <Icon className="h-8 w-8" />
      </div>

      <h1 className="mt-8 text-3xl font-bold text-slate-900">{title}</h1>

      <p className="mt-3 max-w-2xl text-slate-500">{description}</p>

      <button className="mt-8 flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white">
        Coming Soon
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}