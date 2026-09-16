import React, { useState } from 'react';
import {
  PRODUCT_OPTIONS,
  formatNaira
} from '../data/productData';
import { ProductId } from '../types';
import {
  Flame,
  Zap,
  Clock,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Check,
  Maximize2,
  ExternalLink,
  Tag,
  ShoppingBag
} from 'lucide-react';

interface AlternativeProductSectionProps {
  onSelectProduct: (productId: '2-burner' | '5-burner') => void;
  onAddToCart?: (productId: ProductId) => void;
  onImageClick: (url: string, title: string) => void;
  onOrderClick: () => void;
}

export const AlternativeProductSection: React.FC<AlternativeProductSectionProps> = ({
  onSelectProduct,
  onAddToCart,
  onImageClick,
  onOrderClick
}) => {
  const product = PRODUCT_OPTIONS['5-burner'];
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const images = [
    {
      url: '/images/Hd84f5f7654644224945b4ea055aa07a1Y.png',
      title: '5-Burner Hybrid Cooktop Blueprint & Overview',
      subtitle: '4 Gas Burners + 1 Radiant Ceramic Electric Zone'
    },
    {
      url: '/images/H4183961f34a64d47a5f116fa6bfddf7eE.png',
      title: 'Articulated Flip-Up Hinged Burners',
      subtitle: 'Lifts Upward for Effortless 10-Second 1-Wipe Cleaning'
    },
    {
      url: '/images/Hfcba7190a6324ecf8c6f0db5852a902fC.jpg',
      title: 'Official Dimension Blueprint (900 × 510 mm)',
      subtitle: 'Cutout: 870 × 480 mm • Package: 970 × 570 × 250 mm'
    },
    {
      url: '/images/H6d042f563b4c47b08ba59b298031b8c1A.jpg',
      title: 'Simultaneous Multi-Pot Cooking Experience',
      subtitle: '5 Well-Spaced Cooking Stations with Zero Crowding'
    }
  ];

  return (
    <section id="alternative-product" className="py-16 md:py-24 bg-white border-b border-neutral-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 border border-red-200 text-red-600 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            Alternative Kitchen Upgrade Option
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight">
            LOOKING FOR LARGER CAPACITY?
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            Upgrade to the <strong className="text-neutral-900">5-Burner Gas & Electric Hybrid Cooktop</strong> — featuring 4 hinged gas burners, a central radiant ceramic electric hotplate, digital countdown timer, and automatic off safety key.
          </p>
        </div>

        {/* Main Product Showcase Box */}
        <div className="rounded-3xl bg-gradient-to-b from-white to-red-50/20 border-2 border-red-100 p-6 sm:p-10 shadow-xl space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Image Carousel / Preview */}
            <div className="lg:col-span-6 space-y-4">
              <div
                className="relative rounded-2xl bg-white border border-neutral-200 overflow-hidden aspect-[4/3] flex items-center justify-center cursor-pointer group shadow-md"
                onClick={() => onImageClick(images[activeImageIdx].url, images[activeImageIdx].title)}
              >
                <img
                  src={images[activeImageIdx].url}
                  alt={images[activeImageIdx].title}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                  {images[activeImageIdx].subtitle}
                </div>

                <div className="absolute bottom-3 right-3 bg-neutral-900/80 text-white backdrop-blur-md px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5 text-white" />
                  <span>Tap to Enlarge</span>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`rounded-xl bg-white border overflow-hidden p-1.5 transition-all aspect-square flex items-center justify-center cursor-pointer ${
                      activeImageIdx === i
                        ? 'border-2 border-red-600 shadow-md scale-95 ring-2 ring-red-100'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Detailed Highlights & Specs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-red-600">
                  Dual-Fuel Gas + Electric Built-In Hob
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-900">
                  5-Burner Gas & Electric Cooktop with Digital Timer
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Never get stranded when your gas cylinder finishes in the middle of a meal. With 4 heavy-duty gas burners and 1 central radiant ceramic electric hotplate, you enjoy uninterrupted cooking flexibility at all times.
                </p>
              </div>

              {/* Highlight Bullets */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-sm text-neutral-900 block">Dual-Fuel Gas + Electric Power:</strong>
                    <span className="text-xs text-neutral-600">
                      4 high-speed gas burners + 1 radiant ceramic electric zone (2000W). If gas finishes, switch to electric instantly.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-sm text-neutral-900 block">Digital Touch Timer (1 to 99 Mins):</strong>
                    <span className="text-xs text-neutral-600">
                      Countdown timer with automatic power cutoff on the digital display so sauces and stews never burn.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600 mt-0.5">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-sm text-neutral-900 block">Automatic-Off Safety Key & Child Lock:</strong>
                    <span className="text-xs text-neutral-600">
                      One-touch master emergency shutdown immediately cuts active heating for maximum household safety.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-sm text-neutral-900 block">Flip-Up Hinged Burners for 10-Second Cleaning:</strong>
                    <span className="text-xs text-neutral-600">
                      Simply tilt each burner upward to wipe underneath without dismantling dirty caps or soaking parts.
                    </span>
                  </div>
                </div>
              </div>

              {/* Dimensions Card */}
              <div className="p-4 rounded-xl bg-white border border-red-200 shadow-sm flex items-center justify-between text-xs text-neutral-700">
                <div>
                  <span className="text-neutral-500 block font-medium">Panel Dimensions:</span>
                  <strong className="text-neutral-900 font-bold">900 × 510 mm</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block font-medium">Cutout Dimensions:</span>
                  <strong className="text-neutral-900 font-bold">870 × 480 mm</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block font-medium">Starting Price:</span>
                  <strong className="text-red-600 font-extrabold text-sm">₦280,000</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectProduct('5-burner');
                    onOrderClick();
                  }}
                  className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition-all shadow-lg shadow-red-600/25 active:scale-95 flex items-center justify-center gap-2 cursor-pointer animate-order-loop"
                >
                  <span>ORDER 5-BURNER NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onAddToCart && (
                  <button
                    type="button"
                    onClick={() => onAddToCart('5-burner')}
                    className="w-full sm:w-auto py-3.5 px-5 rounded-xl border-2 border-red-600 bg-white hover:bg-red-50 text-red-600 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4 text-red-600" />
                    <span>ADD TO CART</span>
                  </button>
                )}

                <a
                  href="https://www.maxluxurybathrooms.online/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-white border border-neutral-300 hover:border-red-300 text-neutral-800 hover:text-red-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Original Website</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                </a>
              </div>
            </div>
          </div>

          {/* 5-Burner Bulk Pricing Tiers */}
          <div className="border-t border-neutral-200 pt-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-red-600" />
                5-Burner Hybrid Bulk Pricing Tiers (Payment on Delivery)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {product.pricingTiers.map((tier) => (
                <div
                  key={tier.quantity}
                  onClick={() => {
                    onSelectProduct('5-burner');
                    onOrderClick();
                  }}
                  className="p-4 rounded-xl bg-white border border-neutral-200 shadow-sm hover:border-red-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-neutral-900">{tier.label}</span>
                      {tier.isPopular && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-600 text-white shadow-sm">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="text-xl font-extrabold text-red-600">
                      {formatNaira(tier.unitPrice)}
                      <span className="text-xs font-normal text-neutral-500 ml-1">each</span>
                    </div>
                    <div className="text-xs text-neutral-500">
                      Total: <span className="text-neutral-900 font-bold">{formatNaira(tier.totalPrice)}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-emerald-700 font-bold">
                    {tier.savingsNote}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
