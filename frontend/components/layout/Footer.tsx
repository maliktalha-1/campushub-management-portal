"use client";

import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Globe,
  BriefcaseBusiness,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-slate-950 text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Logo */}

          <div>

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-blue-600 p-3">
                <GraduationCap className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  CampusHub
                </h2>

                <p className="text-sm text-slate-400">
                  University Management Portal
                </p>

              </div>

            </div>

            <p className="mt-6 leading-7 text-slate-400">
              A modern platform connecting students,
              faculty members and administrators through
              one secure academic management system.
            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="mb-6 text-xl font-semibold">
              Quick Links
            </h3>

            <div className="space-y-4">

              <Link href="#home" className="block text-slate-400 hover:text-white">
                Home
              </Link>

              <Link href="#features" className="block text-slate-400 hover:text-white">
                Features
              </Link>

              <Link href="#how-it-works" className="block text-slate-400 hover:text-white">
                How It Works
              </Link>

              <Link href="#portals" className="block text-slate-400 hover:text-white">
                Portals
              </Link>

            </div>

          </div>

          {/* Resources */}

          <div>

            <h3 className="mb-6 text-xl font-semibold">
              Resources
            </h3>

            <div className="space-y-4">

              <a className="block cursor-pointer text-slate-400 hover:text-white">
                Documentation
              </a>

              <a className="block cursor-pointer text-slate-400 hover:text-white">
                Privacy Policy
              </a>

              <a className="block cursor-pointer text-slate-400 hover:text-white">
                Terms & Conditions
              </a>

              <a className="block cursor-pointer text-slate-400 hover:text-white">
                Help Center
              </a>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-6 text-xl font-semibold">
              Contact
            </h3>

            <div className="space-y-5">

              <div className="flex items-center gap-3 text-slate-400">
                <Mail className="h-5 w-5 text-blue-500" />
                support@campushub.com
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <Phone className="h-5 w-5 text-blue-500" />
                +92 300 1234567
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <MapPin className="h-5 w-5 text-blue-500" />
                Lahore, Pakistan
              </div>

            </div>

            {/* Social */}

            <div className="mt-8 flex gap-4">

              <button className="rounded-xl bg-slate-800 p-3 transition hover:bg-blue-600">
                <Globe className="h-5 w-5" />
              </button>

              <button className="rounded-xl bg-slate-800 p-3 transition hover:bg-blue-600">
                <BriefcaseBusiness className="h-5 w-5" />
              </button>

            </div>

          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-800 pt-8 md:flex-row">

          <p className="text-slate-400">
            © 2026 CampusHub. All rights reserved.
          </p>

          <a
            href="#home"
            className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 transition hover:bg-blue-700"
          >
            Back to Top

            <ArrowUp className="h-4 w-4" />

          </a>

        </div>

      </div>
    </footer>
  );
}