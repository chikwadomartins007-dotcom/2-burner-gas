import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Flame,
  Check,
  Clock,
  Zap
} from 'lucide-react';
import { CartState, ProductId } from '../types';
import { PRODUCT_OPTIONS, formatNaira, calculateMultiProductTotals } from '../data/productData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartState;
  onUpdateQuantity: (productId: ProductId, quantity: number) => void;
  onCheckout: () => void;
  onOpenExpressCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onCheckout,
  onOpenExpressCheckout
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(599); // 10 minutes countdown

  const totals = calculateMultiProductTotals(cart);
  const p2 = PRODUCT_OPTIONS['2-burner'];
  const qty2B = cart['2-burner'] || 0;
  const hasItems = qty2B > 0;

  // Track item count changes to auto-expand when user adds while minimized
  const prevUnitsRef = useRef<number>(totals.totalUnits);
  useEffect(() => {
    if (totals.totalUnits > prevUnitsRef.current && isMinimized) {
      setIsMinimized(false);
    }
    prevUnitsRef.current = totals.totalUnits;
  }, [totals.totalUnits, isMinimized]);

  // Countdown timer for scarcity reservation
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 599));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Keyboard escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Your Shopping Cart"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop (hidden if minimized) */}
      {!isMinimized && (
        <div
          className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Slide-over panel / Minimized Floating Bar */}
      <div
        className={`fixed transition-all duration-300 ease-in-out ${
          isMinimized
            ? 'bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm w-full'
            : 'inset-y-0 right-0 max-w-md w-full'
        }`}
      >
        <aside
          className={`h-full bg-white shadow-2xl flex flex-col justify-between overflow-hidden ${
            isMinimized
              ? 'rounded-2xl border-2 border-red-500 shadow-red-500/20 max-h-[88px] p-2 bg-neutral-900 text-white'
              : 'border-l border-neutral-200'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 leading-tight">
                  Your Cart
                </h3>
                <p className="text-[11px] text-neutral-500">
                  {qty2B} {qty2B === 1 ? 'Unit' : 'Units'} Selected • Pay on Delivery
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Reserved banner */}
          <div className="bg-red-50/80 border-b border-red-100 px-3.5 py-1.5 text-xs text-red-800 flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-red-600 animate-spin" />
              <span>Promo Price Reserved:</span>
            </span>
            <span className="font-bold font-mono text-red-700 bg-white px-2 py-0.5 rounded border border-red-200">
              {timeFormatted}
            </span>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {!hasItems ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 mx-auto flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-neutral-800">Your cart is empty</h4>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    Add the 2-Burner Flip-Up Gas Cooker to proceed with free nationwide delivery.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity('2-burner', 1)}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  + Add 2-Burner Gas Cooker (₦160,000)
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl border-2 border-red-200 bg-red-50/30 space-y-3">
                <div className="flex gap-3 items-center">
                  <img
                    src={p2.mainImage}
                    alt={p2.shortName}
                    className="w-16 h-16 object-cover rounded-xl bg-white border border-neutral-200 p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-900 text-amber-300">
                      75 × 45 cm Glass Panel
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-neutral-950 truncate mt-0.5">
                      Premium 2-Flip-Up Double Burner
                    </h4>
                    <div className="text-xs font-black text-red-600 mt-0.5">
                      {formatNaira(totals.price2B)} each
                    </div>
                  </div>

                  <button
                    onClick={() => onUpdateQuantity('2-burner', 0)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="pt-2 border-t border-red-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity('2-burner', qty2B - 1)}
                      className="w-7 h-7 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 flex items-center justify-center font-bold text-xs text-neutral-800 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-black text-neutral-900 font-mono">
                      {qty2B}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity('2-burner', qty2B + 1)}
                      className="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 block font-normal">Subtotal</span>
                    <strong className="text-sm font-black text-neutral-900 font-mono">
                      {formatNaira(totals.price2B * qty2B)}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Volume Bulk Discount Notification */}
            {qty2B >= 2 && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Bulk volume savings applied:</strong> You get a discounted price on 2+ units!
                </span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {hasItems && (
            <div className="p-4 border-t border-neutral-200 bg-neutral-50/90 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-neutral-500 font-bold block uppercase tracking-wide">
                    Total Payable on Delivery:
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Nationwide Free Delivery
                  </span>
                </div>
                <span className="text-2xl font-black text-red-600 font-mono">
                  {formatNaira(totals.grandTotal)}
                </span>
              </div>

              <div className="space-y-2">
                {onOpenExpressCheckout && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenExpressCheckout();
                    }}
                    className="w-full py-3 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-amber-300 font-black text-xs sm:text-sm tracking-wide transition-all border border-amber-400/60 shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Zap className="w-4 h-4 fill-amber-300" />
                    <span>⚡ EXPRESS CHECKOUT (60s POP-UP)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onCheckout();
                    onClose();
                  }}
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer animate-order-loop active:scale-98"
                >
                  <span>PROCEED TO ORDER — PAY ON DELIVERY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Risk • Inspect & Test Package Before Paying</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
