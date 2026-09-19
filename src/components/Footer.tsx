import React from 'react';
import { Phone, ShieldCheck, ArrowUp, ExternalLink } from 'lucide-react';
import { BRAND_NAME, PHONE_NUMBER, CALL_LINK } from '../data/productData';
import { PolicyType } from '../types';

interface FooterProps {
  onOpenPolicy: (type: PolicyType) => void;
  onOrderClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicy, onOrderClick }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 pt-16 pb-24 md:pb-16 text-neutral-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-200">
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-neutral-900 tracking-tight">
                {BRAND_NAME}
              </span>
              <span className="text-xs uppercase font-bold text-red-600 tracking-wider">
                PREMIUM PRODUCTS FOR MODERN LIVING.
              </span>
            </div>

            <p className="text-sm text-neutral-600 max-w-sm leading-relaxed">
              Supplying premium kitchen and home essentials engineered for longevity, modern elegance, and everyday convenience.
            </p>

            <div className="flex items-center gap-2 text-xs text-neutral-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Payment on Delivery Nationwide Across Nigeria</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase text-neutral-900 tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#hero" className="hover:text-red-600 transition-colors">
                  2-Burner Overview
                </a>
              </li>
              <li>
                <a href="#alternative-product" className="hover:text-red-600 transition-colors">
                  5-Burner Hybrid Cooktop
                </a>
              </li>
              <li>
                <a href="#alternative-product" className="hover:text-red-600 transition-colors">
                  Smart Piano Sink Workstation
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-red-600 transition-colors">
                  Features & Burners
                </a>
              </li>
              <li>
                <a href="#comparison" className="hover:text-red-600 transition-colors">
                  Compare Both Models
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-red-600 transition-colors">
                  Bulk Pricing Tiers
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-red-600 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Support & Orders */}
          <div className="md:col-span-4 space-y-4 text-left">
            <h4 className="text-xs font-bold uppercase text-neutral-900 tracking-wider">
              Customer Support & Orders
            </h4>
            <p className="text-sm text-neutral-600">
              Have questions about your order or need assistance? Reach our support desk directly:
            </p>

            <div className="space-y-2">
              <a
                href={CALL_LINK}
                className="flex items-center gap-2.5 text-sm font-semibold text-neutral-800 hover:text-red-600 transition-colors"
              >
                <Phone className="w-4 h-4 text-red-600" />
                <span>Call: {PHONE_NUMBER}</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={onOrderClick}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition-all shadow-md shadow-red-600/20 cursor-pointer animate-order-loop"
              >
                ORDER NOW — PAY ON DELIVERY
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Policies & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © 2026 {BRAND_NAME}. ALL RIGHTS RESERVED.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => onOpenPolicy('delivery')}
              className="hover:text-neutral-900 transition-colors cursor-pointer"
            >
              Delivery Policy
            </button>
            <button
              onClick={() => onOpenPolicy('return')}
              className="hover:text-neutral-900 transition-colors cursor-pointer"
            >
              Return Policy
            </button>
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-neutral-900 transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-neutral-900 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer"
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
