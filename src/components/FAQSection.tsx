import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/productData';
import { ChevronDown, ArrowRight, HelpCircle } from 'lucide-react';

interface FAQSectionProps {
  onOrderClick: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOrderClick }) => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-white border-b border-neutral-200 scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-14">
          <span className="text-xs uppercase font-bold tracking-wider text-red-600 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Clear Answers
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-base text-neutral-600">
            Everything you need to know about pricing, nationwide delivery, dimensions, and multi-product ordering.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-xs hover:border-neutral-300 transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-neutral-900 hover:text-red-600 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/50">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Action Prompt */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-xs text-neutral-500">
            Still have questions? Our customer service team is on standby to assist you.
          </p>
          <button
            onClick={onOrderClick}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/20 active:scale-95 cursor-pointer animate-order-loop"
          >
            <span>PROCEED TO ORDER — PAY ON DELIVERY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
