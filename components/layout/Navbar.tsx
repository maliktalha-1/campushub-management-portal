"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Portals", href: "#portals" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl"
          : "bg-white/70 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="#home" className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-2.5 text-white shadow-md">
            <GraduationCap className="h-6 w-6" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            CampusHub
          </h1>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Login
          </Link>

          <a
            href="#portals"
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
          >
            Choose Portal
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-6 lg:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-slate-700 hover:text-blue-600"
              >
                {link.label}
              </a>
            ))}

            <Link
              href="/login"
              className="rounded-full border border-slate-200 px-5 py-3 text-center font-semibold text-slate-700"
            >
              Login
            </Link>

            <a
              href="#portals"
              onClick={() => setMobileOpen(false)}
              className="rounded-full bg-blue-600 px-5 py-3 text-center font-semibold text-white"
            >
              Choose Portal
            </a>
          </div>
        </div>
      )}
    </header>
  );
}