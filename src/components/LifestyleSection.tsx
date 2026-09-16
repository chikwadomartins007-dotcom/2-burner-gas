import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface LifestyleSectionProps {
  onImageClick: (url: string, title: string) => void;
  onOrderClick: () => void;
}

export const LifestyleSection: React.FC<LifestyleSectionProps> = ({ onImageClick, onOrderClick }) => {
  const lifestyleImage1 = '/images/Hebaafe7677f84003942e806feac863ad1.jpg';
  const lifestyleImage2 = '/images/H133eb5b944574834be14201900e73e0bZ.jpg';

  return (
    <section className="py-16 md:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: 2 lifestyle images layout */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="relative rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-md group cursor-pointer"
              onClick={() => onImageClick(lifestyleImage1, 'Modern Kitchen Island Integration')}
            >
              <img
                src={lifestyleImage1}
                alt="Modern Kitchen Countertop Setup"
                className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute bottom-3 left-3 bg-neutral-900/80 text-white backdrop-blur-md px-2.5 py-1 rounded text-xs font-semibold">
                Marble Countertop Setup
              </div>
            </div>

            <div
              className="relative rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-md group cursor-pointer sm:translate-y-6"
              onClick={() => onImageClick(lifestyleImage2, 'Wok & Pan Everyday Cooking')}
            >
              <img
                src={lifestyleImage2}
                alt="Chef placing cookware on burner"
                className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute bottom-3 left-3 bg-neutral-900/80 text-white backdrop-blur-md px-2.5 py-1 rounded text-xs font-semibold">
                Everyday Cookware Support
              </div>
            </div>
          </div>

          {/* Right: Lifestyle Text & Points */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase font-bold tracking-wider text-red-600">
              Kitchen Aesthetics & Practicality
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              MADE TO FIT INTO YOUR MODERN KITCHEN
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
              From everyday meals to busy cooking sessions, enjoy a practical cooking setup with a sleek appearance that complements your kitchen.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0 mt-0.5 text-red-600">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm text-neutral-700">
                  <strong className="text-neutral-900">Contemporary Glass Aesthetic:</strong> Designed to look pristine in minimalist, modern, or traditional Nigerian home kitchens.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0 mt-0.5 text-red-600">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm text-neutral-700">
                  <strong className="text-neutral-900">Sturdy Pot & Wok Stability:</strong> The cast supports cradle light frying pans and heavy family-size pots securely.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0 mt-0.5 text-red-600">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm text-neutral-700">
                  <strong className="text-neutral-900">Quick Counter Cleanliness:</strong> Cooking oil splatters and sauces wipe away smoothly without scratching the toughened glass.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onOrderClick}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/25 active:scale-95 cursor-pointer animate-order-loop"
              >
                <span>ORDER NOW — PAY ON DELIVERY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
