import React, { useState, useEffect, useMemo } from 'react';
import {
  Zap,
  X,
  RotateCcw,
  Sparkles,
  Truck,
  Banknote,
  ShieldCheck,
  Check,
  User,
  Phone,
  MapPin,
  Building,
  ChevronDown,
  ArrowRight,
  Clock,
  Play,
  Pause,
  AlertCircle,
  PackageCheck,
  CheckCircle2,
  Flame,
  Minus,
  Plus
} from 'lucide-react';
import { CartState, ProductId, OrderSuccessDetails } from '../types';
import {
  NIGERIAN_STATES,
  FORMSPREE_ENDPOINT,
  formatNaira,
  calculateMultiProductTotals,
  trackPixelEvent
} from '../data/productData';

interface QuickOrderPopupProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  cart: CartState;
  onUpdateCart: (cart: CartState) => void;
  onOrderSuccess: (details: OrderSuccessDetails) => void;
  onOpenFullExpressCheckout: () => void;
  hasPlacedOrder: boolean;
  isCartOpen?: boolean;
  isLightboxOpen?: boolean;
}

const REPLAY_INTERVAL_SECONDS = 30;

export function QuickOrderPopup({
  isOpen,
  onOpen,
  onClose,
  cart,
  onUpdateCart,
  onOrderSuccess,
  onOpenFullExpressCheckout,
  hasPlacedOrder,
  isCartOpen = false,
  isLightboxOpen = false
}: QuickOrderPopupProps) {
  // Auto-replay countdown timer in seconds (30s)
  const [countdown, setCountdown] = useState<number>(REPLAY_INTERVAL_SECONDS);
  const [isAutoReplayEnabled, setIsAutoReplayEnabled] = useState<boolean>(true);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const productImages = [
    {
      url: '/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg',
      alt: '2-Flip-Up Double Burner Glass Gas Cooker Overview'
    },
    {
      url: '/images/Hf3fea0e1fc4e46d4ac33b8a45f21785ex.jpg',
      alt: 'Sleek Black Tempered Glass Top View'
    },
    {
      url: '/images/Hc8520771f71b451d96ae3caee5e55e9a5.jpg',
      alt: '90-Degree Hinged Flip-Up Burners Easy Cleaning'
    }
  ];

  // Main product quantity state (1, 2, or 3 units)
  const [quantity, setQuantity] = useState<number>(() => Math.max(1, cart['2-burner'] || 1));

  // Form Fields State (High visibility, clean validation)
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [state, setState] = useState<string>('Lagos');
  const [city, setCity] = useState<string>('');

  // UI status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ensure cart is synchronized with ONLY the main product (2-burner) whenever pop-up is opened
  useEffect(() => {
    if (isOpen) {
      const currentQty = Math.max(1, cart['2-burner'] || quantity);
      setQuantity(currentQty);
      onUpdateCart({
        '2-burner': currentQty,
        '5-burner': 0,
        'piano-sink': 0
      });
      const checkoutTotals = calculateMultiProductTotals({
        '2-burner': currentQty,
        '5-burner': 0,
        'piano-sink': 0
      });
      trackPixelEvent('InitiateCheckout', {
        value: checkoutTotals.grandTotal,
        currency: 'NGN',
        content_name: 'Premium 2-Flip-Up Double Burner Glass Gas Cooker',
        content_type: 'product',
        content_ids: ['2-burner'],
        num_items: currentQty
      });
    }
  }, [isOpen]);

  const handleUpdateQuantity = (newQty: number) => {
    const validQty = Math.max(1, Math.min(10, newQty));
    setQuantity(validQty);
    onUpdateCart({
      '2-burner': validQty,
      '5-burner': 0,
      'piano-sink': 0
    });
  };

  // Price calculations strictly for the main 2-burner product
  const mainProductTotals = useMemo(() => {
    return calculateMultiProductTotals({
      '2-burner': quantity,
      '5-burner': 0,
      'piano-sink': 0
    });
  }, [quantity]);

  // AUTO-REPLAY TIMER EFFECT: Replays every 30 seconds
  useEffect(() => {
    // If order has been placed, disable replay permanently
    if (hasPlacedOrder) return;

    // If auto-replay is paused by user, do not countdown
    if (!isAutoReplayEnabled) return;

    // If the pop-up is currently open, reset countdown to 30 for the next replay
    if (isOpen) {
      setCountdown(REPLAY_INTERVAL_SECONDS);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Time to auto-replay!
          if (!isCartOpen && !isLightboxOpen && !hasPlacedOrder) {
            onOpen();
          }
          return REPLAY_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isAutoReplayEnabled, hasPlacedOrder, isCartOpen, isLightboxOpen, onOpen]);

  // Initial prompt after 12 seconds if not yet opened
  useEffect(() => {
    if (hasPlacedOrder) return;
    const initialDelay = setTimeout(() => {
      if (!isOpen && !isCartOpen && !isLightboxOpen && !hasPlacedOrder) {
        onOpen();
      }
    }, 12000);
    return () => clearTimeout(initialDelay);
  }, [hasPlacedOrder, onOpen]);

  // Escape key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // WhatsApp confirmation message builder
  const getWhatsAppConfirmationUrl = (orderId: string, finalTotal: number) => {
    const targetPhone = '2348147778029';
    const msg = `Hello MAX LUXURY BATHROOMS! I just placed a QUICK ORDER for the 2-FLIP-UP DOUBLE BURNER COOKER.
Order ID: #${orderId}
Product: Premium 2-Flip-Up Double Burner Glass Gas Cooker (75 × 45 cm)
Quantity: ${quantity} Unit(s)
Total Payable: ${formatNaira(finalTotal)} (Payment on Delivery)
Customer Name: ${fullName.trim()}
Phone Number: ${phoneNumber.trim()}
Delivery Destination: ${deliveryAddress.trim()}, ${city.trim() || 'LGA'}, ${state}
Please confirm my priority express dispatch.`;
    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter an active Phone Number for delivery call.');
      return;
    }
    if (!deliveryAddress.trim()) {
      setErrorMessage('Please enter your Street Delivery Address with landmark.');
      return;
    }
    if (!city.trim()) {
      setErrorMessage('Please enter your City or LGA.');
      return;
    }

    setIsSubmitting(true);

    const orderId = `ORD-QCK-${Date.now().toString().slice(-6)}`;
    const productName = `Premium 2-Flip-Up Double Burner Glass Gas Cooker (${quantity} Unit${quantity > 1 ? 's' : ''})`;
    const grandTotal = mainProductTotals.grandTotal;

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    const userParam = {
      phone: phoneNumber.trim(),
      firstName,
      lastName,
      city: city.trim(),
      state,
      country: 'ng'
    };

    // 1. Fire conversion tracking (Meta & TikTok CAPI)
    trackPixelEvent(
      'Purchase',
      {
        value: grandTotal,
        currency: 'NGN',
        content_name: productName,
        content_type: 'product',
        content_ids: ['2-burner'],
        num_items: quantity,
        order_id: orderId
      },
      {
        eventId: orderId,
        user: userParam
      }
    );

    trackPixelEvent(
      'Lead',
      {
        value: grandTotal,
        currency: 'NGN',
        content_name: productName,
        content_type: 'product',
        content_ids: ['2-burner'],
        num_items: quantity,
        order_id: orderId
      },
      {
        eventId: `lead_${orderId}`,
        user: userParam
      }
    );

    // 2. Persist in localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('burner_orders') || '[]');
      stored.unshift({
        id: orderId,
        orderType: 'quick_order_main_product',
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        deliveryAddress: deliveryAddress.trim(),
        city: city.trim(),
        state,
        itemsOrdered: `${quantity}x 2-Flip-Up Cooker`,
        qty2Burner: quantity,
        qty5Burner: 0,
        qtyPianoSink: 0,
        quantity,
        totalPrice: grandTotal,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('burner_orders', JSON.stringify(stored));
    } catch {
      // Storage error ignored
    }

    // 3. Dispatch to Formspree
    const formspreePayload = {
      orderId,
      orderType: 'Quick Order Pop-Up (Main 2-Burner Cooker)',
      product: 'Premium 2-Flip-Up Double Burner Glass Gas Cooker (75 × 45 cm)',
      quantity,
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      deliveryAddress: deliveryAddress.trim(),
      city: city.trim(),
      state,
      grandTotal: formatNaira(grandTotal),
      paymentMethod: 'Payment on Delivery (Cash or Bank Transfer on Arrival)',
      _subject: `⚡ QUICK ORDER #${orderId}: ${fullName.trim()} - 2-Burner Cooker (${formatNaira(grandTotal)})`
    };

    try {
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formspreePayload)
      });
    } catch (err) {
      console.error('Error submitting quick order to Formspree:', err);
    } finally {
      setIsSubmitting(false);

      const whatsappUrl = getWhatsAppConfirmationUrl(orderId, grandTotal);

      // Close quick order pop-up & trigger celebration
      onClose();

      onOrderSuccess({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        state,
        city: city.trim(),
        quantity,
        total: grandTotal,
        orderId,
        productName: 'Premium 2-Flip-Up Double Burner Glass Gas Cooker (75 × 45 cm)',
        qty2Burner: quantity,
        qty5Burner: 0,
        whatsappUrl
      });
    }
  };

  // If user placed an order, stop displaying completely
  if (hasPlacedOrder) return null;

  // Percentage progress for the 30-second replay timer
  const progressPercent = Math.max(0, Math.min(100, ((REPLAY_INTERVAL_SECONDS - countdown) / REPLAY_INTERVAL_SECONDS) * 100));

  return (
    <>
      {/* 1. Minimized Floating Status Pill (Visible when pop-up is closed) */}
      {!isOpen && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 sm:bottom-26 left-4 z-40 max-w-[280px] sm:max-w-xs bg-neutral-950/95 text-white rounded-2xl p-3 shadow-2xl border-2 border-amber-400 backdrop-blur-md animate-fade-in flex flex-col gap-2 transition-all select-none"
        >
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onOpen}
              className="flex items-center gap-2 min-w-0 text-left cursor-pointer group"
              title="Click to open 2-Burner Quick Order Pop-Up now"
            >
              <img
                src="/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg"
                alt="2-Burner Gas Cooker"
                className="w-9 h-9 rounded-xl object-cover bg-white border border-amber-400 shrink-0 group-hover:scale-105 transition-transform shadow-xs"
              />
              <div className="min-w-0">
                <div className="text-xs font-black text-amber-300 uppercase tracking-tight flex items-center gap-1.5">
                  <span>Quick Order Pop-Up</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-[11px] text-neutral-300 truncate font-medium">
                  {isAutoReplayEnabled
                    ? `Auto-replaying in ${countdown}s`
                    : 'Auto-replay paused'}
                </div>
              </div>
            </button>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsAutoReplayEnabled(!isAutoReplayEnabled)}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer text-xs"
                title={isAutoReplayEnabled ? 'Pause 30s auto-replay' : 'Resume 30s auto-replay'}
                aria-label={isAutoReplayEnabled ? 'Pause 30s auto-replay' : 'Resume 30s auto-replay'}
              >
                {isAutoReplayEnabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={onOpen}
                className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer active:scale-95 shadow-md"
              >
                Order
              </button>
            </div>
          </div>

          {/* 30-Second Countdown Progress Bar */}
          {isAutoReplayEnabled && (
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 via-amber-300 to-red-500 h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* 2. Expanded Quick Order Pop-Up Window — High Visibility & Main Product Only */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-order-popup-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          {/* High Contrast Dark Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-950/85 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
            onClick={onClose}
          />

          {/* Main Pop-Up Modal Card — Bold, Prominent, Highly Visible */}
          <div className="relative z-50 w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-red-600 overflow-hidden transform transition-all duration-300 animate-celebration-in my-auto max-h-[94vh] flex flex-col">
            {/* Top Header Bar */}
            <div className="relative bg-gradient-to-r from-neutral-950 via-neutral-900 to-red-950 text-white p-4 sm:p-5 shrink-0 border-b-2 border-amber-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-md">
                    <Zap className="w-5 h-5 fill-neutral-950" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2
                        id="quick-order-popup-title"
                        className="text-base sm:text-lg font-black tracking-tight uppercase text-white"
                      >
                        Quick Order Form
                      </h2>
                      <span className="bg-amber-400 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-xs">
                        <RotateCcw className="w-3 h-3 animate-spin" />
                        <span>Replays Every 30s</span>
                      </span>
                    </div>
                    <p className="text-xs text-amber-200 font-bold flex items-center gap-1.5 mt-0.5">
                      <Banknote className="w-3.5 h-3.5 text-amber-400" />
                      <span>100% Payment on Delivery Nationwide • Inspect Before Paying</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Auto-Replay Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setIsAutoReplayEnabled(!isAutoReplayEnabled)}
                    title={isAutoReplayEnabled ? '30s auto-replay active (click to pause)' : '30s auto-replay paused (click to resume)'}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
                  >
                    {isAutoReplayEnabled ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-amber-300" />
                        <span className="hidden sm:inline">30s Loop On</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">Paused</span>
                      </>
                    )}
                  </button>

                  {/* Close (X) Button */}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-neutral-800 hover:bg-red-600 text-neutral-300 hover:text-white transition-colors cursor-pointer shadow-md"
                    aria-label="Close quick order form"
                    title="Close & auto-replay in 30 seconds"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Delivery assurance ribbon */}
              <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-xs text-neutral-200">
                <div className="flex items-center gap-1.5 text-amber-300 font-extrabold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Promo Price Reserved: ₦160,000</span>
                </div>
                <div className="text-emerald-300 font-extrabold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Free Dispatch to All 36 States</span>
                </div>
              </div>
            </div>

            {/* Scrollable Form Body — Ultra-Visible Layout */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white">
              {errorMessage && (
                <div className="p-3 bg-red-100 border-2 border-red-500 rounded-2xl text-red-900 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-bounce-short">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* EXCLUSIVE MAIN PRODUCT SHOWCASE BOX WITH REAL PRODUCT IMAGE */}
              <div className="bg-gradient-to-br from-amber-50/70 via-red-50/40 to-neutral-50 rounded-2xl p-3.5 sm:p-4 border-2 border-red-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Large Product Image + Quick Angle Switcher */}
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <div className="relative">
                      <img
                        src={productImages[activeImageIndex].url}
                        alt={productImages[activeImageIndex].alt}
                        className="w-44 h-36 sm:w-32 sm:h-32 rounded-2xl object-cover bg-white border-2 border-red-200 shadow-md"
                      />
                      <span className="absolute -top-2 -left-2 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs uppercase">
                        Main Product
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {productImages.map((img, idx) => (
                        <button
                          key={img.url}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          aria-label={`View product image ${idx + 1}`}
                          className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                            activeImageIndex === idx
                              ? 'border-red-600 ring-2 ring-red-200 scale-105'
                              : 'border-neutral-200 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={img.alt}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                      <span className="bg-neutral-900 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                        75 × 45 cm Standard Cutout
                      </span>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        90° Flip-Up Burners
                      </span>
                    </div>

                    <h3 className="font-black text-sm sm:text-base text-neutral-950 mt-1.5 leading-snug">
                      Premium 2-Flip-Up Double Burner Glass Gas Cooker
                    </h3>

                    <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-1">
                      <span className="text-lg sm:text-xl font-black text-red-600 font-mono">
                        ₦160,000
                      </span>
                      <span className="text-xs text-neutral-400 line-through font-medium">
                        ₦220,000
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-xs">
                        SAVE ₦60,000
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-600 mt-1 font-medium">
                      8mm toughened crystal glass, cast-iron pan stands, LED timer & battery pulse auto-ignition.
                    </p>
                  </div>
                </div>

                {/* Package / Quantity Fast-Selector */}
                <div className="pt-2 border-t border-neutral-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-neutral-800 uppercase tracking-wide">
                      Select Quantity:
                    </span>
                    <span className="text-xs font-bold text-red-600">
                      Total: {formatNaira(mainProductTotals.grandTotal)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Option 1: 1 Cooker */}
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(1)}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        quantity === 1
                          ? 'border-red-600 bg-red-600 text-white shadow-md font-black'
                          : 'border-neutral-300 bg-white hover:border-neutral-400 text-neutral-800 font-bold'
                      }`}
                    >
                      <div className="text-xs">1 Cooker</div>
                      <div className="text-[11px] mt-0.5 opacity-90 font-mono">₦160,000</div>
                    </button>

                    {/* Option 2: 2 Cookers (Couple / Gift Deal) */}
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(2)}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer relative ${
                        quantity === 2
                          ? 'border-red-600 bg-red-600 text-white shadow-md font-black'
                          : 'border-neutral-300 bg-white hover:border-neutral-400 text-neutral-800 font-bold'
                      }`}
                    >
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-neutral-950 text-[8px] font-black px-1.5 py-0.2 rounded-xs uppercase shadow-xs">
                        Save ₦10k
                      </span>
                      <div className="text-xs">2 Cookers</div>
                      <div className="text-[11px] mt-0.5 opacity-90 font-mono">₦310,000</div>
                    </button>

                    {/* Option 3: 3 Cookers (Family / Bulk Deal) */}
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(3)}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer relative ${
                        quantity === 3
                          ? 'border-red-600 bg-red-600 text-white shadow-md font-black'
                          : 'border-neutral-300 bg-white hover:border-neutral-400 text-neutral-800 font-bold'
                      }`}
                    >
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-xs uppercase shadow-xs">
                        Save ₦30k
                      </span>
                      <div className="text-xs">3 Cookers</div>
                      <div className="text-[11px] mt-0.5 opacity-90 font-mono">₦450,000</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* HIGH-VISIBILITY FORM FIELDS */}
              <div className="space-y-3.5 pt-1">
                <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-1.5">
                  <label className="text-xs sm:text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>Enter Your Delivery Details (Pay on Delivery)</span>
                  </label>
                  <span className="text-[10px] text-red-600 font-extrabold uppercase">
                    * Required Fields
                  </span>
                </div>

                {/* 1. Full Name */}
                <div>
                  <label className="block text-xs font-black text-neutral-800 mb-1">
                    Customer Full Name <span className="text-red-600 text-sm">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-red-600 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Chief Emeka Adeleke / Dr. Mrs. Fatima Bello"
                      className="w-full pl-10 pr-3.5 py-3 bg-neutral-50 hover:bg-white focus:bg-white border-2 border-neutral-300 focus:border-red-600 focus:ring-4 focus:ring-red-100 rounded-xl text-sm font-bold text-neutral-900 placeholder:text-neutral-400 placeholder:font-normal transition-all outline-none"
                    />
                  </div>
                </div>

                {/* 2. Active Phone Number */}
                <div>
                  <label className="block text-xs font-black text-neutral-800 mb-1">
                    Phone Number (Active for Delivery Call) <span className="text-red-600 text-sm">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-red-600 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 08012345678 or 08147778029"
                      className="w-full pl-10 pr-3.5 py-3 bg-neutral-50 hover:bg-white focus:bg-white border-2 border-neutral-300 focus:border-red-600 focus:ring-4 focus:ring-red-100 rounded-xl text-sm font-bold text-neutral-900 placeholder:text-neutral-400 placeholder:font-normal transition-all outline-none"
                    />
                  </div>
                </div>

                {/* 3. Delivery Street Address */}
                <div>
                  <label className="block text-xs font-black text-neutral-800 mb-1">
                    Complete Street Address & Landmark <span className="text-red-600 text-sm">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-red-600 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. No 14, Admiralty Way, Near Ebeano Supermarket"
                      className="w-full pl-10 pr-3.5 py-3 bg-neutral-50 hover:bg-white focus:bg-white border-2 border-neutral-300 focus:border-red-600 focus:ring-4 focus:ring-red-100 rounded-xl text-sm font-bold text-neutral-900 placeholder:text-neutral-400 placeholder:font-normal transition-all outline-none"
                    />
                  </div>
                </div>

                {/* 4. State & City/Town in 2 Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-neutral-800 mb-1">
                      Delivery State <span className="text-red-600 text-sm">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full pl-3.5 pr-8 py-3 bg-neutral-50 hover:bg-white focus:bg-white border-2 border-neutral-300 focus:border-red-600 focus:ring-4 focus:ring-red-100 rounded-xl text-sm font-bold text-neutral-900 transition-all outline-none appearance-none cursor-pointer"
                      >
                        {NIGERIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st} State
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-neutral-800 mb-1">
                      City / Town / LGA <span className="text-red-600 text-sm">*</span>
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Ikeja, Lekki, Wuse 2"
                        className="w-full pl-10 pr-3.5 py-3 bg-neutral-50 hover:bg-white focus:bg-white border-2 border-neutral-300 focus:border-red-600 focus:ring-4 focus:ring-red-100 rounded-xl text-sm font-bold text-neutral-900 placeholder:text-neutral-400 placeholder:font-normal transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Three High-Trust Reassurance Badges */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2.5 rounded-xl bg-emerald-50 border-2 border-emerald-200">
                  <Banknote className="w-4 h-4 text-emerald-700 mx-auto mb-0.5" />
                  <div className="text-[11px] font-black text-emerald-950">Pay on Arrival</div>
                  <div className="text-[9px] text-emerald-700 font-semibold">Zero Advance Fee</div>
                </div>
                <div className="p-2.5 rounded-xl bg-red-50 border-2 border-red-200">
                  <Truck className="w-4 h-4 text-red-700 mx-auto mb-0.5" />
                  <div className="text-[11px] font-black text-red-950">Free Shipping</div>
                  <div className="text-[9px] text-red-700 font-semibold">1-3 Days Nationwide</div>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 border-2 border-blue-200">
                  <ShieldCheck className="w-4 h-4 text-blue-700 mx-auto mb-0.5" />
                  <div className="text-[11px] font-black text-blue-950">2-Yr Warranty</div>
                  <div className="text-[9px] text-blue-700 font-semibold">Inspect Before Paying</div>
                </div>
              </div>

              {/* STICKY BOTTOM SUBMIT AREA */}
              <div className="pt-3 border-t-2 border-neutral-200 space-y-2.5">
                <div className="flex items-baseline justify-between bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                  <div>
                    <span className="text-xs text-neutral-500 font-bold block uppercase tracking-wide">
                      Total Payable on Arrival:
                    </span>
                    <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Nationwide Free Delivery Included
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-red-600 font-mono tracking-tight">
                      {formatNaira(mainProductTotals.grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Big Vibrant Order Confirmation Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-5 bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-98 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-red-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-500 animate-order-loop"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Confirming Your Order & Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 fill-white" />
                      <span>CONFIRM QUICK ORDER — PAY ON DELIVERY</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Footer options */}
                <div className="flex items-center justify-between text-xs pt-1 text-neutral-500">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenFullExpressCheckout();
                    }}
                    className="hover:text-red-600 font-bold underline cursor-pointer"
                  >
                    Open Express Checkout Modal
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="hover:text-neutral-900 font-medium cursor-pointer"
                  >
                    Close (Replays in 30s)
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
