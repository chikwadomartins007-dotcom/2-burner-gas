import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, ChevronRight } from 'lucide-react';

interface FloatingOrderNowProps {
  onOrderClick: () => void;
  hasPlacedOrder?: boolean;
  isCartOpen?: boolean;
}

export const FloatingOrderNow: React.FC<FloatingOrderNowProps> = ({
  onOrderClick,
  hasPlacedOrder = false,
  isCartOpen = false
}) => {
  const [visible, setVisible] = useState(false);
  const [isNearForm, setIsNearForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA after scrolling down 180px
      if (window.scrollY > 180) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      // Check if order form is currently in view so the floating button doesn't block inputs
      const orderFormEl = document.getElementById('order-form') || document.getElementById('order-form-section');
      if (orderFormEl) {
        const rect = orderFormEl.getBoundingClientRect();
        const inView = rect.top < window.innerHeight - 80 && rect.bottom > 120;
        setIsNearForm(inView);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide if order was placed, if cart is open, if not scrolled enough, or if user is already at the form
  if (!visible || hasPlacedOrder || isCartOpen || isNearForm) {
    return null;
  }

  return (
    <aside
      id="floating-order-cta-container"
      aria-label="Floating Order CTA"
      className="hidden md:flex fixed z-40 transition-all duration-300 bottom-8 right-8 animate-fade-in"
    >
      <button
        onClick={onOrderClick}
        id="floating-order-now-btn"
        className="animate-black-red group relative flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl md:rounded-full border-2 cursor-pointer select-none shadow-2xl active:scale-95 transition-all"
        title="Order Now — Pay on Delivery"
      >
        {/* Animated pulse dot */}
        <span className="relative flex h-3.5 w-3.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400" />
        </span>

        {/* Icon */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs text-white shrink-0 group-hover:rotate-6 transition-transform">
          <ShoppingBag className="w-4 h-4" />
        </div>

        {/* Text Block */}
        <div className="text-left flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-tight">
            <span className="text-xs sm:text-sm md:text-base font-black tracking-wider uppercase drop-shadow-xs">
              ORDER NOW — PAY ON DELIVERY
            </span>
            <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-neutral-200/90 flex items-center gap-1 mt-0.5 tracking-tight">
            <Truck className="w-3 h-3 text-amber-300 shrink-0" />
            <span>Pay Zero Upfront • Inspect Before Paying</span>
          </div>
        </div>
      </button>
    </aside>
  );
};
