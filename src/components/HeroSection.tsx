import React from 'react';
import { ShieldCheck, Check, Phone, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { PHONE_NUMBER, CALL_LINK } from '../data/productData';
import { ProductId } from '../types';

interface HeroSectionProps {
  onOrderClick: () => void;
  onAddToCart?: (productId: ProductId) => void;
  onImageClick: (url: string, title: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOrderClick, onAddToCart, onImageClick }) => {
  const heroImageUrl = '/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg';


  return (
    <section id="hero" className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-red-100 bg-gradient-to-b from-red-50/70 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Product Information & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Trust Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-red-200 text-red-700 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                PAYMENT ON DELIVERY AVAILABLE
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                FROM ₦170,000
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.15]">
              UPGRADE YOUR KITCHEN WITH A PREMIUM <span className="text-red-600">2-BURNER GLASS</span> GAS COOKER
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
              A sleek double-burner cooker designed for convenient everyday cooking, easy flame control and a clean modern kitchen setup.
            </p>

            {/* Benefit Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-800">
                <div className="w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>2-BURNER COOKING</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-800">
                <div className="w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>MODERN GLASS COOKTOP</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-800">
                <div className="w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>EASY FLAME CONTROL</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-800">
                <div className="w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>SLEEK MODERN DESIGN</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-900 sm:col-span-2">
                <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-red-600">PAYMENT ON DELIVERY NATIONWIDE</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onOrderClick}
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-red-600 text-white font-bold text-base hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 active:scale-[0.99] cursor-pointer animate-order-loop"
              >
                <span>ORDER NOW — PAY ON DELIVERY</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {onAddToCart && (
                <button
                  type="button"
                  onClick={() => onAddToCart('2-burner')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl border-2 border-red-600 bg-white hover:bg-red-50 text-red-600 text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4 text-red-600" />
                  <span>ADD TO CART</span>
                </button>
              )}

              <a
                href={CALL_LINK}
                className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-xl border border-neutral-300 bg-white hover:bg-red-50 text-neutral-800 hover:text-red-600 text-sm font-bold transition-all shadow-sm"
                title="Call our support team directly"
              >
                <Phone className="w-4 h-4 text-red-600" />
                <span>CALL {PHONE_NUMBER}</span>
              </a>
            </div>

            {/* Simple Assurance Note */}
            <p className="text-xs text-neutral-500 pt-1">
              Order now with zero upfront payment. We verify your order via phone and you pay when received.
            </p>
          </div>

          {/* Right Column: Hero Product Image Display */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-red-100 bg-white p-3 shadow-xl group">
              <div 
                className="relative overflow-hidden rounded-xl bg-neutral-100 cursor-pointer"
                onClick={() => onImageClick(heroImageUrl, 'Premium 2-Burner Glass Gas Cooker')}
              >
                <img
                  src={heroImageUrl}
                  alt="Premium 2-Burner Glass Gas Cooker"
                  className="w-full h-auto object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />

                {/* Subtle Image Overlay Badge */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md border border-neutral-200 px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-800 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Authentic Product Photo</span>
                </div>

                <div className="absolute top-3 right-3 bg-red-600/90 text-white backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to enlarge
                </div>
              </div>

              {/* Quick Spec Bar Underneath Image */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-neutral-600 divide-x divide-neutral-200">
                <div className="px-2">
                  <div className="font-bold text-neutral-900">Double Burner</div>
                  <div className="text-[10px] text-red-600 font-semibold">Fast Cooking</div>
                </div>
                <div className="px-2">
                  <div className="font-bold text-neutral-900">Toughened Glass</div>
                  <div className="text-[10px] text-red-600 font-semibold">Effortless Wipe</div>
                </div>
                <div className="px-2">
                  <div className="font-bold text-neutral-900">COD Available</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Zero Risk</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
