"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import ThemeToggle from "@/components/theme/ThemeToggle";

import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Shield,
  Upload,
  UserCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

type Role = "student" | "faculty" | "admin";

interface DashboardLayoutProps {
  role: Role;
  children: ReactNode;
}

const roleInfo = {
  student: {
    title: "Student Portal",
    fallbackName: "Student User",
    accent: "bg-blue-600",
  },
  faculty: {
    title: "Faculty Portal",
    fallbackName: "Faculty Member",
    accent: "bg-emerald-600",
  },
  admin: {
    title: "Admin Portal",
    fallbackName: "Administrator",
    accent: "bg-violet-600",
  },
};

const menus = {
  student: [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "My Courses", href: "/student/courses", icon: BookOpen },
    { label: "Assignments", href: "/student/assignments", icon: ClipboardCheck },
    { label: "Submit Assignment", href: "/student/submit-assignment", icon: Upload },
    { label: "Announcements", href: "/student/announcements", icon: Bell },
    { label: "Attendance", href: "/student/attendance", icon: UserCheck },
    { label: "Profile", href: "/student/profile", icon: Users },
  ],
  faculty: [
    { label: "Dashboard", href: "/faculty/dashboard", icon: LayoutDashboard },
    { label: "Assigned Courses", href: "/faculty/courses", icon: BookOpen },
    { label: "Upload Assignments", href: "/faculty/assignments", icon: Upload },
    { label: "Announcements", href: "/faculty/announcements", icon: Bell },
    { label: "Attendance", href: "/faculty/attendance", icon: ClipboardCheck },
    { label: "Course Dashboard", href: "/faculty/course-dashboard", icon: BarChart3 },
  ],
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Students", href: "/admin/students", icon: GraduationCap },
    { label: "Faculty", href: "/admin/faculty", icon: UserCog },
    { label: "Departments", href: "/admin/departments", icon: Building2 },
    { label: "Courses", href: "/admin/courses", icon: BookOpen },
    { label: "Assign Faculty", href: "/admin/assign-faculty", icon: UserCheck },
    { label: "Enroll Students", href: "/admin/enroll-students", icon: ClipboardCheck },
    { label: "User Accounts", href: "/admin/users", icon: Shield },
    { label: "Create User", href: "/admin/create-user", icon: UserCheck },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ],
};

export default function DashboardLayout({
  role,
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const info = roleInfo[role];
  const menu = menus[role];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const displayName = mounted && user?.name ? user.name : info.fallbackName;

  function handleLogout() {
    toast.success("Logged out successfully.");

    dispatch(logout());
    localStorage.clear();

    setTimeout(() => {
      router.push("/#portals");
    }, 800);
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-xl bg-white dark:bg-slate-900 p-3 shadow dark:bg-slate-900 dark:text-white lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
            <Link href="/" className="flex items-center gap-3">
              <div className={`rounded-xl p-2.5 text-white ${info.accent}`}>
                <GraduationCap className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-xl font-bold">CampusHub</h1>
                <p className="text-xs text-slate-400">{info.title}</p>
              </div>
            </Link>

            <button onClick={() => setOpen(false)} className="lg:hidden">
              <X />
            </button>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-white dark:bg-slate-900 text-slate-950"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-800 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white dark:bg-slate-900/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex h-20 items-center justify-between px-6 lg:px-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white dark:text-white">
                {info.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400">
                Welcome back, {displayName}
              </p>
            </div>

            <div className="hidden items-center gap-4 md:flex">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  placeholder="Search..."
                  className="w-56 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:text-white"
                />
              </div>

              <button className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 dark:border-slate-700 dark:bg-slate-900">
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300 dark:text-slate-300" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>

              <ThemeToggle />
            </div>
          </div>
        </header>

        <section className="p-6 lg:p-10">{children}</section>
      </main>
    </div>
  );
}
