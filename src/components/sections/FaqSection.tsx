"use client";

import { useState, useEffect, useRef } from "react";
import { faqItems } from "@/lib/data/faq";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Sparkles, ChevronDown } from "lucide-react";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [answer]);

  return (
    <div className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
      open ? "border-[#f97316]/30 shadow-lg shadow-orange-500/10" : "border-gray-200 hover:border-gray-300"
    }`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left group"
      >
        <span className={`text-sm font-semibold pr-4 transition-colors ${
          open ? "text-[#f97316]" : "text-gray-900 group-hover:text-[#f97316]"
        }`}>{question}</span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 transition-all duration-300 ${
            open ? "rotate-180 text-[#f97316]" : "text-gray-400 group-hover:text-[#f97316]"
          }`}
        />
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? `${contentHeight}px` : "0" }}
      >
        <div className="px-5 pb-4">
          <p className="text-sm text-gray-500 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <ScrollReveal>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#f97316]/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#f97316]" />
            <span className="text-sm font-semibold text-[#f97316]">Dúvidas?</span>
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
