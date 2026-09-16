import React from 'react';
import { formatNaira, PRODUCT_OPTIONS } from '../data/productData';
import { ProductId } from '../types';
import { Check, ArrowRight, Sparkles, Flame, Zap, ShoppingBag } from 'lucide-react';

interface ProductComparisonSectionProps {
  selectedProduct: ProductId;
  onSelectProduct: (productId: ProductId) => void;
  onAddToCart?: (productId: ProductId) => void;
  onOrderClick: () => void;
}

export const ProductComparisonSection: React.FC<ProductComparisonSectionProps> = ({
  selectedProduct,
  onSelectProduct,
  onAddToCart,
  onOrderClick
}) => {
  const p2 = PRODUCT_OPTIONS['2-burner'];
  const p5 = PRODUCT_OPTIONS['5-burner'];


  const comparisonRows = [
    {
      feature: 'Fuel Compatibility',
      p2: 'LPG Cooking Gas (Battery Impulse Ignition)',
      p5: 'Dual-Fuel: Gas + Electric Hybrid (Never Stuck)'
    },
    {
      feature: 'Cooking Stations',
      p2: '2 High-Efficiency Gas Burners',
      p5: '4 Gas Burners + 1 Radiant Ceramic Zone (2000W)'
    },
    {
      feature: 'Installation Type',
      p2: 'Dual-Use: Tabletop (rubber feet) OR Built-In',
      p5: 'Seamless Flush Built-In Countertop Fitment'
    },
    {
      feature: 'Panel Dimensions',
      p2: '750 mm × 450 mm',
      p5: '900 mm × 510 mm'
    },
    {
      feature: 'Countertop Cutout',
      p2: '630 – 650 mm × 350 mm',
      p5: '870 mm × 480 mm'
    },
    {
      feature: 'Timer & Safety Key',
      p2: 'Standard safety control valves',
      p5: 'Digital 1-99m Touch Timer + 1-Touch Auto-Off'
    },
    {
      feature: 'Burner Cleaning Mechanism',
      p2: 'Removable heavy-duty trivets & burner caps',
      p5: 'Articulated flip-up hinged burners (1-wipe)'
    },
    {
      feature: 'Payment Terms',
      p2: 'Payment on Delivery Nationwide',
      p5: 'Payment on Delivery Nationwide'
    }
  ];

  return (
    <section id="comparison" className="py-16 md:py-24 bg-white border-b border-neutral-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs uppercase font-bold tracking-wider text-red-600">
            Side-By-Side Comparison
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            WHICH COOKER IS RIGHT FOR YOUR KITCHEN?
          </h2>
          <p className="text-base text-neutral-600">
            Compare both models side-by-side to choose the best fit for your space, cooking volume, and budget.
          </p>
        </div>

        {/* 2-Column Product Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Card 1: 2-Burner */}
          <div
            className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all border ${
              selectedProduct === '2-burner'
                ? 'bg-white border-2 border-red-600 shadow-xl scale-[1.01]'
                : 'bg-white border-neutral-200 shadow-sm hover:border-red-300'
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-red-600" />
                  Everyday Efficiency
                </span>
                {selectedProduct === '2-burner' && (
                  <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Selected Model
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-bold text-neutral-900">
                  {p2.name}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {p2.description}
                </p>
              </div>

              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-neutral-50 border border-neutral-200 flex items-center justify-center p-3">
                <img
                  src={p2.mainImage}
                  alt={p2.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-4 rounded-xl bg-red-50/50 border border-red-200 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-neutral-500 block font-medium">Single Unit Price</span>
                  <div className="text-2xl font-extrabold text-red-600">
                    {formatNaira(p2.basePrice)}
                  </div>
                </div>
                <span className="text-xs text-emerald-700 font-bold">
                  Bulk from ₦150,000
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-200 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  onSelectProduct('2-burner');
                  onOrderClick();
                }}
                className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  selectedProduct === '2-burner'
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20 animate-order-loop'
                    : 'bg-neutral-900 text-white hover:bg-red-600'
                }`}
              >
                SELECT 2-BURNER & ORDER
              </button>

              {onAddToCart && (
                <button
                  type="button"
                  onClick={() => onAddToCart('2-burner')}
                  className="py-3.5 px-4 rounded-xl border border-neutral-300 hover:border-red-400 bg-white text-neutral-800 hover:text-red-600 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              )}
            </div>
          </div>

          {/* Card 2: 5-Burner Hybrid */}
          <div
            className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all border ${
              selectedProduct === '5-burner'
                ? 'bg-white border-2 border-red-600 shadow-xl scale-[1.01]'
                : 'bg-white border-neutral-200 shadow-sm hover:border-red-300'
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-red-600" />
                  Dual-Fuel Gas + Electric Hybrid
                </span>
                {selectedProduct === '5-burner' && (
                  <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Selected Model
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-bold text-neutral-900">
                  {p5.name}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {p5.description}
                </p>
              </div>

              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-neutral-50 border border-neutral-200 flex items-center justify-center p-3">
                <img
                  src={p5.mainImage}
                  alt={p5.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-4 rounded-xl bg-red-50/50 border border-red-200 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-neutral-500 block font-medium">Single Unit Price</span>
                  <div className="text-2xl font-extrabold text-red-600">
                    {formatNaira(p5.basePrice)}
                  </div>
                </div>
                <span className="text-xs text-emerald-700 font-bold">
                  Bulk from ₦265,000
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-200 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  onSelectProduct('5-burner');
                  onOrderClick();
                }}
                className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  selectedProduct === '5-burner'
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20 animate-order-loop'
                    : 'bg-neutral-900 text-white hover:bg-red-600'
                }`}
              >
                SELECT 5-BURNER & ORDER
              </button>

              {onAddToCart && (
                <button
                  type="button"
                  onClick={() => onAddToCart('5-burner')}
                  className="py-3.5 px-4 rounded-xl border border-neutral-300 hover:border-red-400 bg-white text-neutral-800 hover:text-red-600 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-md">
          <div className="p-4 sm:p-5 bg-red-600 font-bold text-sm text-white">
            Detailed Technical Specification Comparison
          </div>

          <div className="divide-y divide-neutral-100">
            {comparisonRows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 p-4 text-xs sm:text-sm hover:bg-red-50/40 transition-colors"
              >
                <div className="md:col-span-4 font-bold text-neutral-900 mb-1 md:mb-0">
                  {row.feature}
                </div>
                <div className="md:col-span-4 text-neutral-600">
                  <span className="md:hidden font-bold text-neutral-800 mr-1">2-Burner:</span>
                  {row.p2}
                </div>
                <div className="md:col-span-4 text-neutral-900 font-semibold mt-1 md:mt-0">
                  <span className="md:hidden font-bold text-red-600 mr-1">5-Burner:</span>
                  {row.p5}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
