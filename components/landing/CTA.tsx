"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, MonitorSmartphone } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-20 text-center shadow-2xl"
        >
          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <h2 className="relative text-4xl font-bold text-white md:text-5xl">
            Ready to Transform Your University?
          </h2>

          <p className="relative mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-50">
            Bring students, faculty, and administrators together in one secure,
            modern, and easy-to-use academic management platform.
          </p>

          <a
            href="#portals"
            className="relative mt-10 inline-flex items-center rounded-full bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
          >
            Choose Your Portal
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>

          <div className="relative mt-10 flex flex-wrap justify-center gap-6 text-sm font-medium text-white">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Secure
            </span>

            <span className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Fast
            </span>

            <span className="flex items-center gap-2">
              <MonitorSmartphone className="h-5 w-5" />
              Responsive
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}