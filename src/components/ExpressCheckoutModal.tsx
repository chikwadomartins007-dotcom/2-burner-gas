import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Zap,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Banknote,
  Sparkles,
  Check,
  ChevronDown,
  Phone,
  User,
  MapPin,
  Building,
  Plus,
  Minus,
  ArrowRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { CartState, ProductId, OrderSuccessDetails } from '../types';
import {
  PRODUCT_OPTIONS,
  NIGERIAN_STATES,
  PHONE_NUMBER,
  FORMSPREE_ENDPOINT,
  formatNaira,
  calculateMultiProductTotals,
  trackPixelEvent
} from '../data/productData';

interface ExpressCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartState;
  onUpdateCart: (cart: CartState) => void;
  onOrderSuccess: (details: OrderSuccessDetails) => void;
  onScrollToFullForm?: () => void;
  initialProductId?: ProductId;
}

export function ExpressCheckoutModal({
  isOpen,
  onClose,
  cart,
  onUpdateCart,
  onOrderSuccess,
  onScrollToFullForm,
  initialProductId = '2-burner'
}: ExpressCheckoutModalProps) {
  // If cart is empty, set default item & fire InitiateCheckout when opened
  useEffect(() => {
    if (isOpen) {
      const totalUnits = (cart['2-burner'] || 0) + (cart['5-burner'] || 0) + (cart['piano-sink'] || 0);
      const effectiveCart =
        totalUnits === 0
          ? {
              ...cart,
              [initialProductId]: 1
            }
          : cart;

      if (totalUnits === 0) {
        onUpdateCart(effectiveCart);
      }

      const openTotals = calculateMultiProductTotals(effectiveCart);
      const openIds: string[] = [];
      if (openTotals.qty2B > 0) openIds.push('2-burner');
      if (openTotals.qty5B > 0) openIds.push('5-burner');
      if (openTotals.qtySink > 0) openIds.push('piano-sink');

      trackPixelEvent('InitiateCheckout', {
        value: openTotals.grandTotal,
        currency: 'NGN',
        content_name: 'Express Checkout Order',
        content_type: 'product',
        content_ids: openIds.length > 0 ? openIds : ['2-burner'],
        num_items: Math.max(1, openTotals.totalUnits)
      });
    }
  }, [isOpen, initialProductId]);

  // Form Fields State
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [altPhoneNumber, setAltPhoneNumber] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('Lagos');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'items' | 'shipping'>('shipping');

  // Urgency reservation countdown timer (15 minutes)
  const [timeLeft, setTimeLeft] = useState<number>(899);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 899));
    }, 1000);
    return () => clearInterval(interval);
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

  // Live order calculations
  const totals = useMemo(() => calculateMultiProductTotals(cart), [cart]);

  const handleUpdateItemQty = (pid: ProductId, delta: number) => {
    const current = cart[pid] || 0;
    const next = Math.max(0, current + delta);
    onUpdateCart({
      ...cart,
      [pid]: next
    });
  };

  const handleSetSingleProduct = (pid: ProductId) => {
    onUpdateCart({
      '2-burner': pid === '2-burner' ? 1 : 0,
      '5-burner': pid === '5-burner' ? 1 : 0,
      'piano-sink': pid === 'piano-sink' ? 1 : 0
    });
  };

  const handleApplyComboBundle = () => {
    onUpdateCart({
      '2-burner': 1,
      '5-burner': 0,
      'piano-sink': 1
    });
  };

  // WhatsApp confirmation message builder
  const getWhatsAppConfirmationUrl = (orderId: string, finalTotal: number, itemsText: string) => {
    const targetPhone = '2348147778029';
    const msg = `Hello MAX LUXURY BATHROOMS! I just placed an EXPRESS CHECKOUT order on your website.
Order ID: #${orderId}
Products: ${itemsText}
Total Payable: ${formatNaira(finalTotal)} (Pay on Delivery)
Customer Name: ${fullName.trim()}
Phone: ${phoneNumber.trim()}
Delivery Destination: ${deliveryAddress.trim()}, ${city.trim()}, ${state}
Please confirm my express priority dispatch.`;
    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (totals.totalUnits <= 0) {
      setErrorMessage('Please select at least 1 unit to order.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Please provide an active phone number for delivery confirmation.');
      return;
    }
    if (!deliveryAddress.trim()) {
      setErrorMessage('Please provide your complete street delivery address.');
      return;
    }
    if (!city.trim()) {
      setErrorMessage('Please enter your city/town.');
      return;
    }
    if (!state) {
      setErrorMessage('Please select your state.');
      return;
    }

    setIsSubmitting(true);

    const orderId = `ORD-EXP-${Date.now().toString().slice(-6)}`;

    // Build items description
    const itemLines: string[] = [];
    if (totals.qty2B > 0) itemLines.push(`${totals.qty2B}x 2-Flip-Up Cooker`);
    if (totals.qty5B > 0) itemLines.push(`${totals.qty5B}x 5-Burner Hybrid`);
    if (totals.qtySink > 0) itemLines.push(`${totals.qtySink}x Smart Piano Sink`);
    const itemsSummary = itemLines.join(' + ') || 'Kitchen Appliances';

    const primaryProductName =
      totals.qty2B > 0 && totals.qty5B === 0 && totals.qtySink === 0
        ? 'Premium 2-Burner Glass Gas Cooker'
        : totals.qty5B > 0 && totals.qty2B === 0 && totals.qtySink === 0
        ? 'Executive 5-Burner Hybrid Cooktop'
        : totals.qtySink > 0 && totals.qty2B === 0 && totals.qty5B === 0
        ? 'Smart Kitchen Piano Sink Workstation'
        : `Kitchen Bundle (${itemsSummary})`;

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

    const activeProductIds: string[] = [];
    if (totals.qty2B > 0) activeProductIds.push('2-burner');
    if (totals.qty5B > 0) activeProductIds.push('5-burner');
    if (totals.qtySink > 0) activeProductIds.push('piano-sink');
    const finalContentIds = activeProductIds.length > 0 ? activeProductIds : ['2-burner'];

    // 1. Dispatch conversion tracking (Meta, TikTok, CAPI)
    trackPixelEvent(
      'Purchase',
      {
        value: totals.grandTotal,
        currency: 'NGN',
        content_name: primaryProductName,
        content_type: 'product',
        content_ids: finalContentIds,
        num_items: totals.totalUnits,
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
        value: totals.grandTotal,
        currency: 'NGN',
        content_name: primaryProductName,
        content_type: 'product',
        content_ids: finalContentIds,
        num_items: totals.totalUnits,
        order_id: orderId
      },
      {
        eventId: `lead_${orderId}`,
        user: userParam
      }
    );

    // 2. Save in localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('burner_orders') || '[]');
      stored.unshift({
        id: orderId,
        orderType: 'express_checkout',
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        altPhoneNumber: altPhoneNumber.trim(),
        deliveryAddress: deliveryAddress.trim(),
        city: city.trim(),
        state,
        deliveryNotes: deliveryNotes.trim(),
        itemsOrdered: itemsSummary,
        qty2Burner: totals.qty2B,
        qty5Burner: totals.qty5B,
        qtyPianoSink: totals.qtySink,
        quantity: totals.totalUnits,
        totalPrice: totals.grandTotal,
        comboDiscount: totals.comboDiscount,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('burner_orders', JSON.stringify(stored));
    } catch {
      // Ignore storage errors
    }

    // 3. Dispatch to Formspree
    const formspreePayload = {
      orderId,
      orderType: 'Express Checkout Pop-up',
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      altPhoneNumber: altPhoneNumber.trim() || 'Not provided',
      deliveryAddress: deliveryAddress.trim(),
      city: city.trim(),
      state,
      deliveryNotes: deliveryNotes.trim() || 'None',
      itemsSummary,
      totalUnits: totals.totalUnits,
      grandTotal: formatNaira(totals.grandTotal),
      paymentMethod: 'Payment on Delivery (Cash or Bank Transfer)',
      _subject: `⚡ EXPRESS ORDER #${orderId}: ${fullName.trim()} (${city.trim()}, ${state}) - ${formatNaira(totals.grandTotal)}`
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
      console.error('Error submitting express order to Formspree:', err);
    } finally {
      setIsSubmitting(false);

      const whatsappUrl = getWhatsAppConfirmationUrl(orderId, totals.grandTotal, itemsSummary);

      // Close express modal and trigger confetti & celebration in App.tsx!
      onClose();

      onOrderSuccess({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        state,
        city: city.trim(),
        quantity: totals.totalUnits,
        total: totals.grandTotal,
        orderId,
        productName: primaryProductName,
        qty2Burner: totals.qty2B,
        qty5Burner: totals.qty5B,
        whatsappUrl
      });
    }
  };

  if (!isOpen) return null;

  const p2 = PRODUCT_OPTIONS['2-burner'];
  const p5 = PRODUCT_OPTIONS['5-burner'];
  const pSink = PRODUCT_OPTIONS['piano-sink'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="express-checkout-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/75 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Main Modal Dialog Box */}
      <div className="relative z-50 w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-red-200/80 overflow-hidden transform transition-all duration-300 animate-celebration-in my-auto max-h-[92vh] flex flex-col">
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-neutral-900 text-white p-4 sm:p-5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-xs">
                <Zap className="w-5 h-5 fill-neutral-950" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="express-checkout-title" className="text-base sm:text-lg font-black tracking-tight uppercase">
                    Express Checkout
                  </h2>
                  <span className="bg-amber-400 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                    1-Min Order
                  </span>
                </div>
                <p className="text-xs text-red-100 flex items-center gap-1.5 mt-0.5">
                  <Banknote className="w-3.5 h-3.5 text-amber-300" />
                  <span>100% Payment on Delivery Nationwide • Inspect Before Paying</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close express checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scarcity / Price Hold Bar */}
          <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] text-red-100">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>Promo Price Reserved: {timeFormatted}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-300 font-bold">
              <Truck className="w-3.5 h-3.5" />
              <span>Free Nationwide Dispatch</span>
            </div>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-bounce-short">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Choose or Review Items */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-red-600" />
                <span>1. Appliance & Package Selection</span>
              </label>

              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                100% Pay on Delivery
              </span>
            </div>

            {/* Single Product Card */}
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl border-2 border-red-600 bg-red-50/40 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg"
                    alt="2-Burner Cooker"
                    className="w-14 h-14 rounded-xl object-cover bg-white border border-neutral-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-neutral-900 truncate">
                        Premium 2-Flip-Up Double Burner
                      </span>
                      <span className="bg-neutral-900 text-white text-[9px] font-black px-1.5 py-0.2 rounded-xs">
                        75×45cm
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-red-600 mt-0.5">
                      ₦160,000{' '}
                      <span className="text-[10px] text-neutral-400 line-through font-normal">
                        ₦200,000
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stepper */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleUpdateItemQty('2-burner', -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center text-xs font-black text-neutral-900 font-mono">
                    {cart['2-burner'] || 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUpdateItemQty('2-burner', 1)}
                    className="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Package Quick Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateCart({ '2-burner': 1, '5-burner': 0, 'piano-sink': 0 })}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                    (cart['2-burner'] || 1) === 1
                      ? 'border-red-600 bg-red-600 text-white font-bold shadow-xs'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:bg-white'
                  }`}
                >
                  <div className="text-xs">1 Cooker</div>
                  <div className="text-[10px] opacity-90 font-mono">₦160,000</div>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateCart({ '2-burner': 2, '5-burner': 0, 'piano-sink': 0 })}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer relative ${
                    cart['2-burner'] === 2
                      ? 'border-red-600 bg-red-600 text-white font-bold shadow-xs'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:bg-white'
                  }`}
                >
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-amber-400 text-neutral-950 text-[8px] font-black px-1 rounded-xs uppercase">
                    Save ₦10k
                  </span>
                  <div className="text-xs">2 Cookers</div>
                  <div className="text-[10px] opacity-90 font-mono">₦310,000</div>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateCart({ '2-burner': 3, '5-burner': 0, 'piano-sink': 0 })}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer relative ${
                    cart['2-burner'] === 3
                      ? 'border-red-600 bg-red-600 text-white font-bold shadow-xs'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:bg-white'
                  }`}
                >
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[8px] font-black px-1 rounded-xs uppercase">
                    Save ₦30k
                  </span>
                  <div className="text-xs">3 Cookers</div>
                  <div className="text-[10px] opacity-90 font-mono">₦450,000</div>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Fast Delivery Details */}
          <div className="space-y-3 pt-1 border-t border-neutral-100">
            <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>2. Delivery Destination & Contact</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Chief Emeka Adeleke"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Active Phone Number */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Phone Number (Active for Call) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 08012345678"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Street Address (Home / Office / Landmark) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="House No., Street Name, Near Famous Landmark or Bus Stop"
                className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
              />
            </div>

            {/* State and City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  State <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white appearance-none cursor-pointer"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  City / Town / LGA <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Ikeja, Lekki, Wuse 2"
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Optional Alternative Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Alternative Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={altPhoneNumber}
                  onChange={(e) => setAltPhoneNumber(e.target.value)}
                  placeholder="e.g. 08147778029"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Delivery Date / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Call before coming"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <Truck className="w-3.5 h-3.5 text-red-600 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-neutral-800">Free Dispatch</div>
              <div className="text-[9px] text-neutral-500">All 36 States</div>
            </div>
            <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <Banknote className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-neutral-800">Pay on Delivery</div>
              <div className="text-[9px] text-neutral-500">Zero Advance</div>
            </div>
            <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-neutral-800">2-Yr Warranty</div>
              <div className="text-[9px] text-neutral-500">Direct Support</div>
            </div>
          </div>

          {/* Sticky-like Footer Submit Area */}
          <div className="pt-3 border-t border-neutral-200 space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-neutral-500 font-medium block">Total Payable on Arrival:</span>
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Nationwide Free Delivery Included
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-black text-red-600 font-mono tracking-tight">
                {formatNaira(totals.grandTotal)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || totals.totalUnits <= 0}
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 animate-order-loop"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Securing Order & Reserving Dispatch...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>CONFIRM EXPRESS ORDER — PAY ON DELIVERY</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Switch to full page form link */}
            {onScrollToFullForm && (
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onScrollToFullForm();
                  }}
                  className="text-xs text-neutral-500 hover:text-neutral-900 underline transition-colors cursor-pointer"
                >
                  Prefer our full detailed order page? Click here to view in-page form
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
