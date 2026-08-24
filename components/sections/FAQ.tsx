"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { Section, SectionHeading } from "@/components/Section";
import { FAQS } from "@/lib/data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq">
      <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />

      <div className="reveal mx-auto mt-14 flex max-w-3xl flex-col gap-3">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={faq.question}
              className="overflow-hidden rounded-xl2 border border-white/10 bg-white/[0.02]"
            >
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-trigger-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-white/90 sm:text-base">
                    {faq.question}
                  </span>
                  <Icon
                    name="arrow"
                    className={`h-4 w-4 shrink-0 text-gold-400 transition-transform duration-300 ${
                      isOpen ? "rotate-90" : "rotate-0"
                    }`}
                  />
                </button>
              </h3>
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-trigger-${i}`}
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-white/55">{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
