"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Who can use CampusHub?",
    answer:
      "CampusHub is designed for Students, Faculty Members, and Administrators. Each role has a dedicated dashboard and permissions.",
  },
  {
    question: "Is CampusHub secure?",
    answer:
      "Yes. CampusHub uses JWT Authentication, Role-Based Access, Protected Routes and Email OTP verification.",
  },
  {
    question: "Can I access CampusHub on mobile?",
    answer:
      "Absolutely. CampusHub is fully responsive and works perfectly on desktop, tablet and mobile devices.",
  },
  {
    question: "How is attendance managed?",
    answer:
      "Faculty members record attendance while students can view their attendance history in real time.",
  },
  {
    question: "Can administrators manage departments and faculty?",
    answer:
      "Yes. Administrators can manage students, faculty members, departments, courses and university analytics.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-16 text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Frequently Asked Questions
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Got Questions?
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            Everything you need to know about CampusHub.
          </p>
        </div>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              whileHover={{ scale: 1.01 }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {faq.question}
                </h3>

                {openIndex === index ? (
                  <Minus className="h-5 w-5 text-blue-600" />
                ) : (
                  <Plus className="h-5 w-5 text-blue-600" />
                )}
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-6 pb-6 text-slate-600 leading-7">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}