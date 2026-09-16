import React, { useState, useEffect } from 'react';
import { ShoppingBag, MessageSquare, Phone } from 'lucide-react';
import { WHATSAPP_LINK, CALL_LINK, PHONE_NUMBER } from '../data/productData';

interface MobileStickyCTAProps {
  onOrderClick: () => void;
  onOpenCart?: () => void;
  cartCount?: number;
  hasPlacedOrder?: boolean;
  whatsappUrl?: string;
}

export const MobileStickyCTA: React.FC<MobileStickyCTAProps> = ({
  onOrderClick,
  onOpenCart,
  cartCount = 0,
  hasPlacedOrder = false,
  whatsappUrl
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past hero (~300px) or always if order was placed
      if (hasPlacedOrder || window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasPlacedOrder]);

  if (!visible) return null;

  // After order is placed, show dedicated WhatsApp Fast-Track Dispatch CTA
  if (hasPlacedOrder) {
    return (
      <aside
        id="sticky-mobile-cta"
        aria-label="Order registered confirmation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-300 px-3.5 py-2.5 shadow-2xl animate-slide-up"
      >
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-emerald-700 uppercase font-black tracking-wider flex items-center gap-1">
              ✓ ORDER REGISTERED
            </span>
            <div className="text-xs font-bold text-slate-800 leading-tight">
              Instant Dispatch Confirmation
            </div>
          </div>

          <a
            href={whatsappUrl || WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-display font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
            title="Confirm dispatch on WhatsApp"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>CONFIRM ON WHATSAPP</span>
          </a>
        </div>
      </aside>
    );
  }

  // Before order is placed: NO WhatsApp button or number is visible
  return (
    <aside
      id="sticky-mobile-cta"
      aria-label="Quick order actions"
      className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-white/95 backdrop-blur-md border border-neutral-300/80 rounded-2xl px-3 py-2.5 shadow-2xl animate-slide-up max-w-md mx-auto"
    >
      <div className="flex items-center gap-2">
        {onOpenCart && (
          <button
            onClick={onOpenCart}
            className="relative flex-shrink-0 w-11 h-11 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-5 h-5 text-neutral-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        )}

        <a
          href={CALL_LINK}
          className="flex-shrink-0 w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center shadow-xs active:scale-95 transition-all"
          title={`Call ${PHONE_NUMBER}`}
        >
          <Phone className="w-4 h-4 text-red-600" />
        </a>

        <button
          onClick={onOrderClick}
          className="animate-black-red flex-1 h-11 rounded-xl font-display font-black text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 border-2 shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>ORDER NOW — PAY ON DELIVERY</span>
        </button>
      </div>
    </aside>
  );
};
