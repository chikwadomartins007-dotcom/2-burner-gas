import React from 'react';
import { ArrowRight, Phone, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';
import { PHONE_NUMBER, CALL_LINK } from '../data/productData';
import { ProductId } from '../types';

interface FinalOfferSectionProps {
  onOrderClick: () => void;
  onAddToCart?: (productId: ProductId) => void;
}

export const FinalOfferSection: React.FC<FinalOfferSectionProps> = ({ onOrderClick, onAddToCart }) => {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-600 border border-amber-600 text-neutral-950 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
            Limited Daily Dispatch Slots • 100% Payment On Delivery
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">
            READY TO UPGRADE YOUR KITCHEN?
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Experience powerful flame cooking, effortless cleaning, and luxury aesthetics in your home today. Order 1 model or both together with zero upfront risk.
          </p>
        </div>

        {/* Pricing & Terms Recap Card */}
        <div className="max-w-xl mx-auto p-6 rounded-2xl bg-neutral-50 border border-neutral-200 text-left space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <div>
              <span className="text-sm font-bold text-neutral-900 block">2-Burner Glass Gas Cooker</span>
              <span className="text-xs text-neutral-500">Dual-use: Desktop or Built-in</span>
            </div>
            <span className="text-lg font-extrabold text-red-600">₦170,000</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <div>
              <span className="text-sm font-bold text-neutral-900 block">5-Burner Gas & Electric Hybrid</span>
              <span className="text-xs text-neutral-500">4 Gas + 1 Ceramic Electric Hotplate + Timer</span>
            </div>
            <span className="text-lg font-extrabold text-red-600">₦280,000</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Combo Pack Special:
            </span>
            <span className="text-xs font-extrabold text-emerald-800">
              Save Extra ₦10,000 When Ordering Both!
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-600 pt-1">
            <span className="flex items-center gap-1.5 font-bold text-neutral-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Payment Method:
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              PAYMENT ON DELIVERY NATIONWIDE
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onOrderClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-red-600 text-white font-bold text-base hover:bg-red-700 transition-all shadow-xl shadow-red-600/30 active:scale-95 cursor-pointer animate-order-loop"
          >
            <span>ORDER NOW — PAY ON DELIVERY</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {onAddToCart && (
            <button
              onClick={() => onAddToCart('2-burner')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl border-2 border-red-600 bg-white hover:bg-red-50 text-red-600 font-bold text-sm transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <ShoppingBag className="w-4 h-4 text-red-600" />
              <span>ADD TO CART</span>
            </button>
          )}

          <a
            href={CALL_LINK}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 text-sm font-semibold transition-all shadow-2xs"
          >
            <Phone className="w-4 h-4 text-red-600" />
            <span>CALL {PHONE_NUMBER}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
