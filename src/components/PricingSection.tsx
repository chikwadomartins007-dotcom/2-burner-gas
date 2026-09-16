import React from 'react';
import {
  PRICING_TIERS_2B,
  PRICING_TIERS_5B,
  PRODUCT_OPTIONS,
  formatNaira
} from '../data/productData';
import { ProductId } from '../types';
import { Check, ShieldCheck, ArrowRight, Tag, Flame, Zap, ShoppingBag } from 'lucide-react';

interface PricingSectionProps {
  selectedProduct: ProductId;
  onSelectProduct: (productId: ProductId) => void;
  selectedQuantity: number;
  onSelectQuantity: (qty: number) => void;
  onAddToCart?: (productId: ProductId, qty: number) => void;
  onOrderClick: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  selectedProduct,
  onSelectProduct,
  selectedQuantity,
  onSelectQuantity,
  onAddToCart,
  onOrderClick
}) => {
  const activeTiers = selectedProduct === '5-burner' ? PRICING_TIERS_5B : PRICING_TIERS_2B;
  const currentProduct = PRODUCT_OPTIONS[selectedProduct];

  return (
    <section id="pricing" className="py-16 md:py-24 bg-white border-b border-neutral-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <span className="text-xs uppercase font-bold tracking-wider text-red-600 flex items-center justify-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-red-600" />
            Transparent Bulk Pricing & Volume Discounts
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            BUY MORE. SAVE MORE.
          </h2>
          <p className="text-base text-neutral-600">
            Enjoy generous bulk discounts when outfitting multiple properties, gifting loved ones, or stocking your business.
          </p>

          {/* Model Switcher Pill */}
          <div className="pt-4 flex items-center justify-center">
            <div className="inline-flex p-1 rounded-2xl bg-neutral-100 border border-neutral-200">
              <button
                type="button"
                onClick={() => onSelectProduct('2-burner')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedProduct === '2-burner'
                    ? 'bg-white text-red-600 shadow-sm border border-neutral-200'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-red-600" />
                <span>2-Burner Gas (from ₦170k)</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectProduct('5-burner')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedProduct === '5-burner'
                    ? 'bg-white text-red-600 shadow-sm border border-neutral-200'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>5-Burner Hybrid (from ₦280k)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product context banner */}
        <div className="max-w-md mx-auto text-center mb-8">
          <span className="text-xs text-neutral-500">
            Showing pricing for: <strong className="text-neutral-900">{currentProduct.name}</strong>
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeTiers.map((tier) => {
            const isSelected = selectedQuantity === tier.quantity || (tier.quantity === 4 && selectedQuantity >= 4);

            return (
              <div
                key={tier.quantity}
                onClick={() => {
                  onSelectQuantity(tier.quantity);
                }}
                className={`relative rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between bg-white ${
                  isSelected
                    ? 'border-2 border-red-600 shadow-xl ring-2 ring-red-100 scale-[1.02]'
                    : 'border border-neutral-200 shadow-sm hover:border-red-300 hover:shadow-md'
                }`}
              >
                {/* Popular Badge */}
                {tier.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide shadow-sm">
                    Most Popular
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-lg text-neutral-900">
                      {tier.label}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected
                          ? 'border-red-600 bg-red-600 text-white'
                          : 'border-neutral-300 bg-neutral-100 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  </div>

                  {/* Unit Price */}
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-red-600">
                      {formatNaira(tier.unitPrice)}
                      <span className="text-xs font-normal text-neutral-500 ml-1">each</span>
                    </div>
                    <div className="text-xs text-neutral-500 mt-1 font-medium">
                      Total: <span className="text-neutral-900 font-bold">{formatNaira(tier.totalPrice)}</span>
                    </div>
                  </div>

                  {/* Savings Note */}
                  <div className="text-xs py-2 px-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                    {tier.savingsNote}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-100 space-y-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectQuantity(tier.quantity);
                      onOrderClick();
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-md animate-order-loop'
                        : 'bg-neutral-900 text-white hover:bg-red-600'
                    }`}
                  >
                    Select & Order Now
                  </button>

                  {onAddToCart && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(selectedProduct, tier.quantity);
                      }}
                      className="w-full py-2 rounded-xl text-xs font-bold border border-neutral-300 hover:border-red-400 bg-white text-neutral-700 hover:text-red-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Guarantee Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-neutral-700 text-center sm:text-left">
            <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Zero Risk Ordering:</strong> No online card details required. You pay cash or bank transfer only when your package is delivered to you.
            </span>
          </div>

          <button
            onClick={onOrderClick}
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-all shadow-md shadow-red-600/20 cursor-pointer animate-order-loop"
          >
            <span>ORDER NOW — PAY ON DELIVERY</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
