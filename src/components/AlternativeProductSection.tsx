import React, { useState } from 'react';
import { ProductId } from '../types';
import {
  formatNaira
} from '../data/productData';
import {
  ArrowRight,
  ShoppingBag,
  Maximize2,
  CheckCircle2,
  Zap
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
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const images = [
    {
      url: '/images/Hd84f5f7654644224945b4ea055aa07a1Y.png',
      title: '5-Burner Hybrid Cooktop Overview'
    },
    {
      url: '/images/H4183961f34a64d47a5f116fa6bfddf7eE.png',
      title: 'Flip-Up Hinged Burners for 10-Second Cleaning'
    },
    {
      url: '/images/Hfcba7190a6324ecf8c6f0db5852a902fC.jpg',
      title: '5-Burner Dimensions (900 × 510 mm)'
    }
  ];

  return (
    <section id="alternative-product" className="py-12 md:py-16 bg-slate-50 border-b border-slate-200 scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Simple Section Header */}
        <div className="text-center space-y-1.5 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700">
            <Zap className="w-3.5 h-3.5" />
            <span>Alternative Model</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Need More Cooking Space?
          </h2>
          <p className="text-sm text-slate-600">
            For large families or simultaneous cooking, we also offer the 5-Burner Gas & Electric Hybrid Cooktop.
          </p>
        </div>

        {/* Simple, Streamlined Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Product Image & Mini Thumbnails */}
            <div className="space-y-3">
              <div
                className="relative rounded-xl bg-slate-100 border border-slate-200 aspect-[4/3] flex items-center justify-center cursor-pointer overflow-hidden group"
                onClick={() => onImageClick(images[activeImageIdx].url, images[activeImageIdx].title)}
              >
                <img
                  src={images[activeImageIdx].url}
                  alt={images[activeImageIdx].title}
                  className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[11px] font-semibold px-2 py-1 rounded-md flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3 h-3" />
                  <span>Enlarge</span>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 justify-center">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImageIdx(i)}
                    className={`w-14 h-12 rounded-lg bg-slate-50 border overflow-hidden p-1 transition-all cursor-pointer ${
                      activeImageIdx === i
                        ? 'border-2 border-red-600 ring-2 ring-red-100'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
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

            {/* Right: Essential Info & Action */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wide">
                  5-Burner Gas & Electric Hybrid
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  Executive 5-Burner Cooktop
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Dimensions: 900 × 510 mm (Cutout: 870 × 480 mm)
                </p>
              </div>

              {/* Price Tag */}
              <div className="bg-red-50/70 border border-red-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-600 block">Starting Price:</span>
                  <span className="text-2xl font-black text-red-600">{formatNaira(280000)}</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md">
                  Pay on Delivery
                </span>
              </div>

              {/* Simple Feature Highlights */}
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Dual-Fuel:</strong> 4 gas burners + 1 electric hotplate (2000W)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Flip-Up Hinges:</strong> Lifts up for quick 10-second wipe cleaning</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Digital Timer:</strong> Auto-cutoff countdown & emergency child lock</span>
                </li>
              </ul>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onSelectProduct('5-burner');
                    onOrderClick();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>ORDER 5-BURNER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onAddToCart && (
                  <button
                    type="button"
                    onClick={() => onAddToCart('5-burner')}
                    className="py-3 px-4 rounded-xl border border-red-600 hover:bg-red-50 text-red-600 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO CART</span>
                  </button>
                )}
              </div>

              <div className="text-center text-[11px] text-slate-500">
                ✓ Free nationwide delivery included • 1-Year warranty
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
