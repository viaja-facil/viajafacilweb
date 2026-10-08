"use client";

import { useState, useId } from "react";
import { faqItems } from "@/lib/data/faq";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Sparkles, ChevronDown } from "lucide-react";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <h3><button type="button" id={`${id}-button`} aria-expanded={open} aria-controls={`${id}-panel`} onClick={() => setOpen(!open)} className="flex min-h-12 w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900">
        {question}<ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 ${open ? "rotate-180" : ""}`} />
      </button></h3>
      <div id={`${id}-panel`} aria-labelledby={`${id}-button`} hidden={!open} className="px-5 pb-4"><p className="text-sm leading-relaxed text-slate-600">{answer}</p></div>
    </div>
  );
}

export default function FaqSection() {
  return (
    <section id="perguntas" className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <ScrollReveal>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#f97316]/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-[var(--action)]" />
            <span className="text-sm font-semibold text-[var(--action)]">Dúvidas?</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Perguntas Frequentes
          </h2>
          <p className="text-gray-500">Tudo o que precisa de saber antes de viajar</p>
        </div>
      </ScrollReveal>
      <div className="space-y-3">
        {faqItems.map((item, i) => (
          <ScrollReveal key={i} delay={i * 100}>
            <FaqItem question={item.question} answer={item.answer} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
