import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  Flame,
  Zap,
  Sparkles,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CartState, ProductId } from '../types';
import { PRODUCT_OPTIONS, formatNaira, calculateMultiProductTotals } from '../data/productData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartState;
  onUpdateQuantity: (productId: ProductId, quantity: number) => void;
  onCheckout: () => void;
  onScrollToAlternatives?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onCheckout,
  onScrollToAlternatives
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(599); // 10 minutes countdown

  const totals = calculateMultiProductTotals(cart);
  const p2 = PRODUCT_OPTIONS['2-burner'];
  const p5 = PRODUCT_OPTIONS['5-burner'];

  const qty2B = cart['2-burner'] || 0;
  const qty5B = cart['5-burner'] || 0;
  const hasItems = totals.totalUnits > 0;

  // Track item count changes to auto-expand when user adds another product while minimized
  const prevUnitsRef = useRef<number>(totals.totalUnits);

  useEffect(() => {
    if (totals.totalUnits > prevUnitsRef.current) {
      // User just added another item - open/un-minimize so they see what was added!
      setIsMinimized(false);
    }
    prevUnitsRef.current = totals.totalUnits;
  }, [totals.totalUnits]);

  // When reopened freshly from closed state, reset minimize
  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
    }
  }, [isOpen]);

  // Urgency reservation timer
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

  if (!isOpen) return null;

  // MINIMIZED VIEW: compact floating bottom dock on mobile/desktop so customer can scroll freely & choose another cooker
  if (isMinimized) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-2.5 sm:p-3 pointer-events-none animate-slide-up">
        <aside
          aria-label="Minimized Shopping Cart"
          className="pointer-events-auto max-w-lg mx-auto bg-neutral-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-neutral-700/80 px-3 py-2 sm:px-3.5 sm:py-2.5 flex items-center justify-between gap-2"
        >
          {/* Tap to expand */}
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2.5 text-left flex-1 min-w-0 group cursor-pointer"
            title="Tap to expand cart"
          >
            <div className="relative flex-shrink-0 w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-red-600 text-[10px] font-black flex items-center justify-center border border-neutral-300 shadow-xs">
                {totals.totalUnits}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs font-bold text-white">
                  Cart ({totals.totalUnits}):
                </span>
                <span className="text-xs font-extrabold text-red-400">
                  {formatNaira(totals.grandTotal)}
                </span>
              </div>
              <div className="text-[10px] text-amber-400 flex items-center gap-1 font-medium">
                <ChevronUp className="w-3 h-3 animate-bounce" />
                <span>Tap to expand & view items</span>
              </div>
            </div>
          </button>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {onScrollToAlternatives && (
              <button
                onClick={onScrollToAlternatives}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-neutral-200 text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer"
                title="Scroll down to choose another cooker model"
              >
                <span>+ Choose Other</span>
              </button>
            )}

            <button
              onClick={() => {
                onCheckout();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-red-600/30 active:scale-95 transition-all whitespace-nowrap cursor-pointer animate-order-loop"
            >
              <span>Order POD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Close cart"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      </div>
    );
  }

  // EXPANDED VIEW: Mobile bottom sheet with reduced size (max-h-[68vh]) + Desktop slide-out drawer
  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop: Clicking outside minimizes or closes */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsMinimized(true)}
      />

      {/* Sheet Container: Positioned at bottom on mobile (reduced size), on right on desktop */}
      <div className="fixed bottom-0 left-0 right-0 md:top-0 md:left-auto md:w-full md:max-w-md pointer-events-none flex justify-end">
        <aside
          aria-label="Shopping Cart Drawer"
          className="pointer-events-auto w-full max-w-full md:max-w-md bg-white shadow-2xl flex flex-col rounded-t-3xl md:rounded-none border-t md:border-t-0 md:border-l border-neutral-200 max-h-[70vh] sm:max-h-[74vh] md:max-h-full md:h-screen animate-slide-up"
        >
          {/* Mobile Drag Handle (Tap to minimize) */}
          <button
            onClick={() => setIsMinimized(true)}
            className="w-full flex items-center justify-center pt-2.5 pb-1 md:hidden cursor-pointer hover:bg-neutral-50 transition-colors"
            title="Tap to minimize"
            aria-label="Minimize cart"
          >
            <span className="w-12 h-1.5 bg-neutral-300 hover:bg-neutral-400 rounded-full transition-colors" />
          </button>

          {/* Header */}
          <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-neutral-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-sm sm:text-base text-neutral-900 leading-tight">
                  Your Shopping Cart
                </h2>
                <span className="text-[11px] sm:text-xs text-neutral-500 font-medium">
                  {totals.totalUnits} {totals.totalUnits === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>

            {/* Minimize and Close Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMinimized(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
                title="Minimize cart to choose another cooker"
                aria-label="Minimize cart"
              >
                <ChevronDown className="w-3.5 h-3.5 text-neutral-600" />
                <span>Minimize</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Close cart"
                title="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Notification: Inform customer they can minimize & choose another cooker */}
          <div className="bg-amber-50 border-b border-amber-200/70 px-3.5 py-1.5 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span className="text-[11px]">
                Want another model? Tap <strong>Minimize</strong> to choose both!
              </span>
            </div>
            {onScrollToAlternatives && (
              <button
                onClick={() => {
                  setIsMinimized(true);
                  onScrollToAlternatives();
                }}
                className="text-[11px] font-bold text-red-600 underline hover:text-red-700 ml-2 whitespace-nowrap cursor-pointer"
              >
                Browse Other
              </button>
            )}
          </div>

          {/* Urgency & Shipping Notice */}
          <div className="bg-red-50/70 border-b border-red-100 px-3.5 py-1 text-[11px] text-red-800 flex items-center justify-between font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-red-600 animate-spin" />
              <span>Items reserved for:</span>
            </span>
            <span className="font-bold font-mono text-red-700 bg-white px-1.5 py-0.5 rounded border border-red-200">
              {timeFormatted}
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3">
            {!hasItems ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-neutral-100 mx-auto flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-neutral-800">Your cart is empty</h3>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    Select one or both cookers below to start your order with payment on delivery.
                  </p>
                </div>

                <div className="pt-2 space-y-2 max-w-xs mx-auto">
                  <button
                    onClick={() => onUpdateQuantity('2-burner', 1)}
                    className="w-full py-2 px-3 rounded-xl border border-neutral-300 hover:border-red-500 bg-white text-neutral-900 text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span>+ Add 2-Burner Gas Cooker</span>
                    <span className="text-red-600">₦170,000</span>
                  </button>

                  <button
                    onClick={() => onUpdateQuantity('5-burner', 1)}
                    className="w-full py-2 px-3 rounded-xl border border-neutral-300 hover:border-red-500 bg-white text-neutral-900 text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span>+ Add 5-Burner Hybrid Cooktop</span>
                    <span className="text-red-600">₦280,000</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* 2-Burner Line Item */}
                {qty2B > 0 && (
                  <div className="p-3 sm:p-3.5 rounded-xl border border-neutral-200 bg-white shadow-2xs space-y-2.5">
                    <div className="flex gap-2.5 items-center">
                      <img
                        src={p2.mainImage}
                        alt={p2.shortName}
                        className="w-14 h-14 object-contain rounded-lg bg-neutral-50 border border-neutral-100 p-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-red-600">
                          <Flame className="w-3 h-3" />
                          <span>2-Burner Glass Gas Cooker</span>
                        </div>
                        <h4 className="text-xs font-bold text-neutral-900 truncate">
                          {p2.shortName}
                        </h4>
                        <div className="text-[11px] text-neutral-500">
                          {formatNaira(totals.price2B)} each
                        </div>
                        <div className="text-xs font-extrabold text-neutral-900 mt-0.5">
                          Subtotal: {formatNaira(totals.total2B)}
                        </div>
                      </div>

                      <button
                        onClick={() => onUpdateQuantity('2-burner', 0)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer self-start"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <span className="text-[11px] text-neutral-500 font-medium">Quantity:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onUpdateQuantity('2-burner', qty2B - 1)}
                          className="w-6 h-6 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-800 cursor-pointer"
                          aria-label="Decrease 2-burner quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-xs text-neutral-900">
                          {qty2B}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity('2-burner', qty2B + 1)}
                          className="w-6 h-6 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-800 cursor-pointer"
                          aria-label="Increase 2-burner quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5-Burner Line Item */}
                {qty5B > 0 && (
                  <div className="p-3 sm:p-3.5 rounded-xl border border-neutral-200 bg-white shadow-2xs space-y-2.5">
                    <div className="flex gap-2.5 items-center">
                      <img
                        src={p5.mainImage}
                        alt={p5.shortName}
                        className="w-14 h-14 object-contain rounded-lg bg-neutral-50 border border-neutral-100 p-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-red-600">
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span>5-Burner Gas + Electric Hybrid</span>
                        </div>
                        <h4 className="text-xs font-bold text-neutral-900 truncate">
                          {p5.shortName}
                        </h4>
                        <div className="text-[11px] text-neutral-500">
                          {formatNaira(totals.price5B)} each
                        </div>
                        <div className="text-xs font-extrabold text-neutral-900 mt-0.5">
                          Subtotal: {formatNaira(totals.total5B)}
                        </div>
                      </div>

                      <button
                        onClick={() => onUpdateQuantity('5-burner', 0)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer self-start"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <span className="text-[11px] text-neutral-500 font-medium">Quantity:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onUpdateQuantity('5-burner', qty5B - 1)}
                          className="w-6 h-6 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-800 cursor-pointer"
                          aria-label="Decrease 5-burner quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-xs text-neutral-900">
                          {qty5B}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity('5-burner', qty5B + 1)}
                          className="w-6 h-6 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 flex items-center justify-center text-neutral-800 cursor-pointer"
                          aria-label="Increase 5-burner quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Combo Upsell Banner if only 1 product added */}
                {qty2B > 0 && qty5B === 0 && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2.5">
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-bold flex items-center gap-1 text-[11px] text-amber-900">
                        <Sparkles className="w-3 h-3 text-amber-600 flex-shrink-0" />
                        <span>Combine with 5-Burner Cooktop</span>
                      </div>
                      <p className="text-[10px] text-amber-800 leading-tight">
                        Save ₦10,000 extra bonus discount when adding both!
                      </p>
                    </div>
                    <button
                      onClick={() => onUpdateQuantity('5-burner', 1)}
                      className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] whitespace-nowrap shadow-xs cursor-pointer"
                    >
                      + Add 5-Burner
                    </button>
                  </div>
                )}

                {qty5B > 0 && qty2B === 0 && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2.5">
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-bold flex items-center gap-1 text-[11px] text-amber-900">
                        <Sparkles className="w-3 h-3 text-amber-600 flex-shrink-0" />
                        <span>Combine with 2-Burner Cooker</span>
                      </div>
                      <p className="text-[10px] text-amber-800 leading-tight">
                        Save ₦10,000 extra bonus discount when adding both!
                      </p>
                    </div>
                    <button
                      onClick={() => onUpdateQuantity('2-burner', 1)}
                      className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] whitespace-nowrap shadow-xs cursor-pointer"
                    >
                      + Add 2-Burner
                    </button>
                  </div>
                )}

                {qty2B > 0 && qty5B > 0 && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-[11px]">
                      <strong>₦10,000 Combo Bonus Discount</strong> applied to your order!
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer / Summary / Actions */}
          {hasItems && (
            <div className="p-3.5 sm:p-4 border-t border-neutral-200 bg-neutral-50/90 space-y-2.5">
              <div className="space-y-1 text-xs text-neutral-600">
                {totals.comboDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold text-[11px]">
                    <span>Combo Bonus Discount:</span>
                    <span>- {formatNaira(totals.comboDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-1 border-t border-neutral-200 text-xs sm:text-sm">
                  <span className="font-bold text-neutral-900">Total Payable:</span>
                  <span className="font-display font-extrabold text-base sm:text-lg text-red-600">
                    {formatNaira(totals.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Minimize to choose another & Checkout */}
              <div className="space-y-1.5 pt-1">
                <button
                  onClick={() => {
                    onCheckout();
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer animate-order-loop active:scale-98"
                >
                  <span>PROCEED TO ORDER — PAY ON DELIVERY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary Button to minimize and choose another */}
                <button
                  onClick={() => {
                    setIsMinimized(true);
                    onScrollToAlternatives?.();
                  }}
                  className="w-full py-2 rounded-xl border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-100 text-neutral-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-98"
                >
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Minimize & Choose Another Cooker</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 text-center">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Zero Risk • Inspect Package Before Paying</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
