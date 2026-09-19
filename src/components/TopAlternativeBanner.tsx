import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { ALTERNATIVE_PRODUCTS, AlternativeProductData } from '../data/alternativeProductsData';
import { formatNaira } from '../data/productData';
import { ProductId } from '../types';

interface TopAlternativeBannerProps {
  onViewProduct: (product: AlternativeProductData) => void;
  onSelectForOrder?: (productId: ProductId) => void;
}

export const TopAlternativeBanner: React.FC<TopAlternativeBannerProps> = ({
  onViewProduct,
  onSelectForOrder
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  // Smooth auto-scroll across cards (every 4 seconds)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft >= scrollWidth - clientWidth - 5) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 220, behavior: 'smooth' });
        }
        checkScroll();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const distance = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: distance, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div
      id="alternative-products-top"
      className="bg-white/95 border-b border-slate-200/80 py-1.5 px-3 sm:px-6 relative z-30 shadow-2xs"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        {/* Left Indicator & Mobile Controls */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#0a192f] whitespace-nowrap">
              Matching Kitchen Appliances:
            </span>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className="p-1 rounded bg-slate-100 text-slate-600 disabled:opacity-30 transition-all cursor-pointer"
              title="Scroll left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className="p-1 rounded bg-slate-100 text-slate-600 disabled:opacity-30 transition-all cursor-pointer"
              title="Scroll right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container with Desktop Nav Arrows */}
        <div className="relative flex-1 min-w-0 flex items-center">
          {/* Left Arrow Desktop */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className="hidden md:flex p-1 rounded-full bg-white/90 border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-0 transition-all shadow-xs cursor-pointer absolute -left-2.5 z-10"
            title="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Cards Track */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth w-full"
          >
            {ALTERNATIVE_PRODUCTS.map((prod) => {
              const savings = prod.normalPrice - prod.price;
              const is5Burner = prod.id === '5-burner';
              const isSink = prod.id === 'piano-sink';

              return (
                <div
                  key={prod.id}
                  onClick={() => onViewProduct(prod)}
                  className="group bg-slate-50/90 hover:bg-blue-50/50 border border-slate-200/90 hover:border-blue-400 rounded-lg p-1.5 transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0 w-[240px] sm:w-[255px]"
                >
                  {/* Thumbnail */}
                  <div className="relative w-10 h-10 rounded-md overflow-hidden bg-slate-200 border border-slate-200 shrink-0">
                    <img
                      src={prod.images[0].url}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-0 left-0 bg-[#0a192f]/90 text-white px-0.5 rounded-br text-[7px] font-bold">
                      {isSink ? 'SINK' : is5Burner ? '5-BURN' : '2-BURN'}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-bold text-[#0a192f] group-hover:text-blue-700 transition-colors truncate">
                        {prod.shortName || prod.name}
                      </span>
                      <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200 shrink-0">
                        -{formatNaira(savings)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-0.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-black text-[#0a192f] font-mono">
                          {formatNaira(prod.price)}
                        </span>
                        <span className="text-[9px] text-slate-400 line-through">
                          {formatNaira(prod.normalPrice)}
                        </span>
                      </div>
                      <span className="text-[9px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5">
                        View →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Internal Catalog Link Button */}
            <button
              type="button"
              onClick={() => {
                const target = document.getElementById('alternative-products-section') || document.getElementById('alternative-product');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/80 rounded-lg p-1.5 transition-all flex items-center gap-1.5 text-xs text-blue-700 font-bold shrink-0 px-2.5 cursor-pointer"
            >
              <span>Explore Matching Appliances</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Right Arrow Desktop */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className="hidden md:flex p-1 rounded-full bg-white/90 border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-0 transition-all shadow-xs cursor-pointer absolute -right-2.5 z-10"
            title="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
