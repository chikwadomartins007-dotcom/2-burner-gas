import React, { useState, useEffect, useMemo } from 'react';
import {
  PHONE_NUMBER,
  FORMSPREE_ENDPOINT,
  NIGERIAN_STATES,
  formatNaira,
  trackPixelEvent,
  PRODUCT_OPTIONS
} from '../data/productData';
import { ProductId, CartState } from '../types';
import {
  Package,
  Flame,
  Zap,
  Sparkles,
  Truck,
  ArrowRight,
  ShieldCheck,
  Check,
  CheckCircle2,
  X,
  AlertCircle,
  MessageSquare,
  Minus,
  Plus
} from 'lucide-react';

interface OrderFormProps {
  cart?: CartState;
  onUpdateCart?: (cart: CartState) => void;
  initialModel?: ProductId | 'combo';
  initialQuantity?: number;
  onOrderSuccess?: (details: any) => void;
  onResetOrder?: () => void;
  resetSignal?: number;
}

export type SelectionModel = '2-burner' | '5-burner' | 'combo';

function calculateOrderDetails(
  model: SelectionModel,
  qty2B: number,
  qty5B: number
) {
  let T = Math.max(0, qty2B);
  let j = Math.max(0, qty5B);

  if (model === '2-burner') {
    T = Math.max(1, T);
    j = 0;
  } else if (model === '5-burner') {
    T = 0;
    j = Math.max(1, j);
  } else if (model === 'combo') {
    T = Math.max(1, T);
    j = Math.max(1, j);
  }

  // 2-Burner tiers (Normal: 170k, 2 pcs: 165k, 3+ pcs: 150k)
  let U = 170000;
  if (T === 1) U = 170000;
  else if (T === 2) U = 165000;
  else if (T >= 3) U = 150000;

  // 5-Burner tiers (Normal: 280k, 2 pcs: 275k, 3 pcs: 270k, 4+ pcs: 250k)
  let D = 280000;
  if (j === 1) D = 280000;
  else if (j === 2) D = 275000;
  else if (j === 3) D = 270000;
  else if (j >= 4) D = 250000;

  const C = T * U;
  const Y = j * D;
  const isCombo = T > 0 && j > 0;
  const comboDiscount = isCombo ? 20000 : 0;
  const total = Math.max(0, C + Y - comboDiscount);
  const regularTotal = T * (170000 + 30000) + j * 350000;
  const savings = Math.max(0, regularTotal - total);

  let productName = '2-Flip-Up Double Burner';
  let shortName = '2-Flip-Up Double Burner';
  let itemsSummary = '';

  if (isCombo) {
    shortName = 'Combo (2-Burner + 5-Burner)';
    productName = `COMBO: ${T}x 2-Flip-Up (75×45cm) + ${j}x 5-Burner Hybrid (90×51cm)`;
    itemsSummary = `${T}x 2-Flip-Up Double Burner (75 × 45cm) + ${j}x 5-Burner Hybrid Cooktop (90 × 51cm)`;
  } else if (j > 0) {
    shortName = '5-Burner Hybrid Cooktop';
    productName = `5-Burner Built-In Gas + Electric Cooktop (90 × 51 cm)`;
    itemsSummary = `${j}x 5-Burner Hybrid Cooktop (90 × 51cm)`;
  } else {
    shortName = '2-Flip-Up Double Burner';
    productName = `2-Flip-Up Double Gas Burner (75 × 45 cm)`;
    itemsSummary = `${T}x 2-Flip-Up Double Gas Burner (75 × 45 cm)`;
  }

  return {
    mode: (isCombo ? 'combo' : j > 0 ? '5-burner' : '2-burner') as SelectionModel,
    isCombo,
    qty2Burner: T,
    qty5Burner: j,
    totalQuantity: T + j,
    unitPrice2Burner: U,
    unitPrice5Burner: D,
    subtotal2Burner: C,
    subtotal5Burner: Y,
    comboDiscount,
    total,
    regularTotal,
    savings,
    productName,
    shortName,
    itemsSummary
  };
}

function formatPhoneForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '234' + cleaned.slice(1);
  } else if (!cleaned.startsWith('234') && cleaned.length === 10) {
    cleaned = '234' + cleaned;
  }
  return cleaned;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  cart,
  onUpdateCart,
  initialModel = '2-burner',
  initialQuantity = 1,
  onOrderSuccess,
  onResetOrder,
  resetSignal
}) => {
  // Determine initial state based on props or cart
  const [selectedModel, setSelectedModel] = useState<SelectionModel>(() => {
    if (cart && cart['2-burner'] && cart['5-burner'] && cart['2-burner'] > 0 && cart['5-burner'] > 0) {
      return 'combo';
    }
    if (cart && cart['5-burner'] && cart['5-burner'] > 0) {
      return '5-burner';
    }
    return (initialModel as SelectionModel) || '2-burner';
  });

  const [qty2Burner, setQty2Burner] = useState<number>(() => {
    if (cart && typeof cart['2-burner'] === 'number') {
      if (cart['2-burner'] > 0) return cart['2-burner'];
      if (cart['5-burner'] && cart['5-burner'] > 0) return 0;
    }
    return initialModel === '5-burner' ? 0 : Math.max(1, initialQuantity);
  });

  const [qty5Burner, setQty5Burner] = useState<number>(() => {
    if (cart && typeof cart['5-burner'] === 'number') {
      return cart['5-burner'];
    }
    return initialModel === '5-burner' ? Math.max(1, initialQuantity) : initialModel === 'combo' ? 1 : 0;
  });

  // Customer delivery details
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    whatsappNumber: '',
    deliveryAddress: '',
    city: '',
    state: 'Lagos',
    email: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedOrderId, setSubmittedOrderId] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Auto-dismiss toast notification after 5 seconds
  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [showToast]);

  // Reset submitted state if parent signals a new order attempt via Order Now click
  useEffect(() => {
    if (resetSignal && resetSignal > 0) {
      setIsSubmitted(false);
      setShowToast(false);
      setErrorMessage('');
    }
  }, [resetSignal]);

  // Sync when initialModel / initialQuantity change
  useEffect(() => {
    if (initialModel) {
      setSelectedModel(initialModel);
      if (initialModel === 'combo') {
        setQty2Burner(1);
        setQty5Burner(1);
      } else if (initialModel === '5-burner') {
        setQty2Burner(0);
        setQty5Burner(initialQuantity >= 1 ? initialQuantity : 1);
      } else {
        setQty2Burner(initialQuantity >= 1 ? initialQuantity : 1);
        setQty5Burner(0);
      }
    }
  }, [initialModel, initialQuantity]);

  // Sync from parent cart changes if passed
  useEffect(() => {
    if (cart) {
      const q2 = cart['2-burner'] || 0;
      const q5 = cart['5-burner'] || 0;
      if (q2 > 0 && q5 > 0) {
        setSelectedModel('combo');
        setQty2Burner(q2);
        setQty5Burner(q5);
      } else if (q5 > 0 && q2 === 0) {
        setSelectedModel('5-burner');
        setQty2Burner(0);
        setQty5Burner(q5);
      } else if (q2 > 0 && q5 === 0) {
        setSelectedModel('2-burner');
        setQty2Burner(q2);
        setQty5Burner(0);
      }
    }
  }, [cart]);

  // Model selection handler
  const handleSelectModel = (model: SelectionModel) => {
    setSelectedModel(model);
    if (model === 'combo') {
      const next2 = qty2Burner > 0 ? qty2Burner : 1;
      const next5 = qty5Burner > 0 ? qty5Burner : 1;
      setQty2Burner(next2);
      setQty5Burner(next5);
      if (onUpdateCart) onUpdateCart({ '2-burner': next2, '5-burner': next5 });
    } else if (model === '5-burner') {
      const next5 = qty5Burner > 0 ? qty5Burner : 1;
      setQty2Burner(0);
      setQty5Burner(next5);
      if (onUpdateCart) onUpdateCart({ '2-burner': 0, '5-burner': next5 });
    } else {
      const next2 = qty2Burner > 0 ? qty2Burner : 1;
      setQty2Burner(next2);
      setQty5Burner(0);
      if (onUpdateCart) onUpdateCart({ '2-burner': next2, '5-burner': 0 });
    }
  };

  // Live order calculations
  const orderCalc = useMemo(() => {
    return calculateOrderDetails(selectedModel, qty2Burner, qty5Burner);
  }, [selectedModel, qty2Burner, qty5Burner]);

  // Input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  // WhatsApp confirmation message builder
  const getWhatsAppConfirmationUrl = () => {
    const targetPhone = formatPhoneForWhatsApp(PHONE_NUMBER);
    let itemsText = '';
    if (orderCalc.qty2Burner > 0 && orderCalc.qty5Burner > 0) {
      itemsText = `BOTH COOKERS (COMBO PACK):\n• ${orderCalc.qty2Burner}x 2-Flip-Up Double Burner (75 × 45 cm)\n• ${orderCalc.qty5Burner}x 5-Burner Built-In Gas + Electric (90 × 51 cm)`;
    } else if (orderCalc.qty5Burner > 0) {
      itemsText = `${orderCalc.qty5Burner} unit(s) of 5-Burner Built-In Gas + Electric Cooktop (90 × 51 cm)`;
    } else {
      itemsText = `${orderCalc.qty2Burner} unit(s) of 2-Flip-Up Double Gas Burner (75 × 45 cm)`;
    }

    const orderId = submittedOrderId || 'ORD-' + Date.now().toString().slice(-6);
    const msg = `Hello! I just placed an order on your website.
Order ID: #${orderId}
Product: ${itemsText}
Total Payable: ${formatNaira(orderCalc.total)}
Name: ${formData.fullName}
Phone: ${formData.phoneNumber}
Delivery Destination: ${formData.deliveryAddress}, ${formData.city}, ${formData.state}
Please confirm my delivery dispatch.`;

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Order submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (orderCalc.totalQuantity <= 0) {
      setErrorMessage('Please select at least 1 cooker unit to order.');
      const el = document.getElementById('order-form') || document.getElementById('order-form-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      const el = document.getElementById('fullName');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setErrorMessage('Please provide your active phone number for delivery confirmation.');
      const el = document.getElementById('phoneNumber');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (!formData.deliveryAddress.trim()) {
      setErrorMessage('Please provide your complete delivery street address.');
      const el = document.getElementById('deliveryAddress');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (!formData.city.trim()) {
      setErrorMessage('Please enter your city/town.');
      const el = document.getElementById('city');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (!formData.state) {
      setErrorMessage('Please select your state.');
      const el = document.getElementById('state');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const formspreeUrl = FORMSPREE_ENDPOINT || 'https://formspree.io/f/xljevqpk';
    const orderId = 'ORD-' + Date.now().toString().slice(-6);
    setSubmittedOrderId(orderId);

    const payload = {
      orderId,
      productModel: orderCalc.mode,
      product: orderCalc.productName,
      itemsOrdered: orderCalc.itemsSummary,
      qty2Burner: `${orderCalc.qty2Burner} unit(s)`,
      qty5Burner: `${orderCalc.qty5Burner} unit(s)`,
      totalQuantity: `${orderCalc.totalQuantity} unit(s)`,
      comboDiscount: orderCalc.comboDiscount > 0 ? formatNaira(orderCalc.comboDiscount) : 'None',
      totalAmount: formatNaira(orderCalc.total),
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      whatsappNumber: (formData.whatsappNumber || formData.phoneNumber).trim(),
      deliveryAddress: formData.deliveryAddress.trim(),
      city: formData.city.trim(),
      state: formData.state,
      email: formData.email ? formData.email.trim() : 'Not provided',
      _subject: `New Order #${orderId}: ${orderCalc.shortName} (${orderCalc.totalQuantity} units) - ${formData.fullName.trim()} (${formData.city.trim()}, ${formData.state})`
    };

    try {
      await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Error dispatching order to Formspree:', err);
    } finally {
      try {
        const stored = JSON.parse(localStorage.getItem('burner_orders') || '[]');
        stored.unshift({
          id: orderId,
          ...formData,
          productModel: orderCalc.mode,
          productName: orderCalc.productName,
          itemsOrdered: orderCalc.itemsSummary,
          qty2Burner: orderCalc.qty2Burner,
          qty5Burner: orderCalc.qty5Burner,
          quantity: orderCalc.totalQuantity,
          totalPrice: orderCalc.total,
          comboDiscount: orderCalc.comboDiscount,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('burner_orders', JSON.stringify(stored));
      } catch {
        // Ignore localStorage error
      }

      trackPixelEvent('Purchase', {
        value: orderCalc.total,
        currency: 'NGN',
        content_name: orderCalc.productName,
        content_type: 'product',
        num_items: orderCalc.totalQuantity,
        order_id: orderId
      });
      trackPixelEvent('Lead');

      setIsSubmitting(false);
      setIsSubmitted(true);
      setShowToast(true);

      if (onOrderSuccess) {
        onOrderSuccess({
          fullName: formData.fullName.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          state: formData.state,
          city: formData.city.trim(),
          quantity: orderCalc.totalQuantity,
          total: orderCalc.total,
          orderId,
          productModel: orderCalc.mode,
          productName: orderCalc.productName,
          qty2Burner: orderCalc.qty2Burner,
          qty5Burner: orderCalc.qty5Burner,
          whatsappUrl: getWhatsAppConfirmationUrl()
        });
      }

      setTimeout(() => {
        const el = document.getElementById('order-form') || document.getElementById('order-form-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setShowToast(false);
    if (onResetOrder) onResetOrder();
  };

  return (
    <section id="order-form" className="py-14 sm:py-20 px-4 bg-slate-50 text-slate-900 relative scroll-mt-20">
      <div id="order-form-section" className="scroll-mt-20 -mt-20 absolute" />

      {/* Floating Order Success Toast Notification */}
      {showToast && (
        <div
          id="order-success-toast"
          role="status"
          aria-live="polite"
          className="fixed top-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-bounce-short bg-slate-900/95 backdrop-blur-md text-white border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl transition-all flex items-start gap-3.5"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Order Registered!
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-sm font-bold text-white mt-0.5 leading-snug">
              Thank you, {formData.fullName.trim() || 'Valued Customer'}!
            </p>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Your request for <span className="text-amber-300 font-semibold">{orderCalc.productName}</span> ({formatNaira(orderCalc.total)}) has been confirmed. Pay on Delivery.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowToast(false)}
            aria-label="Close notification"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-3">
            <Package className="w-3.5 h-3.5" />
            <span>Direct Order Request</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            PLACE YOUR ORDER NOW
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Choose your preferred model or order both cookers together with our special combo discount. Free nationwide delivery across Nigeria.
          </p>
        </div>

        {isSubmitted ? (
          /* ================= SUCCESS STATE ================= */
          <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-10 shadow-2xl text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto mb-5">
              <Check className="w-9 h-9" />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest block mb-1">
              Order Registered Successfully
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              ORDER RECEIVED!
            </h3>
            <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto mb-6 leading-relaxed">
              Thank you for your order. Our team will contact you shortly on your phone number to confirm your order details and delivery dispatch timeline.
            </p>

            {/* Receipt Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left max-w-md mx-auto mb-8 space-y-2.5 text-xs sm:text-sm">
              <div className="pb-2 border-b border-slate-200">
                <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-semibold">
                  Items Ordered:
                </span>
                <div className="mt-1 space-y-1">
                  {orderCalc.qty2Burner > 0 && (
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="flex items-center gap-1.5 text-blue-800">
                        <Flame className="w-3.5 h-3.5 text-blue-600" />
                        2-Flip-Up Burner (75 × 45 cm)
                      </span>
                      <span>{orderCalc.qty2Burner} Unit(s)</span>
                    </div>
                  )}
                  {orderCalc.qty5Burner > 0 && (
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="flex items-center gap-1.5 text-amber-900">
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        5-Burner Hybrid (90 × 51 cm)
                      </span>
                      <span>{orderCalc.qty5Burner} Unit(s)</span>
                    </div>
                  )}
                </div>
              </div>

              {orderCalc.comboDiscount > 0 && (
                <div className="flex justify-between pb-2 border-b border-slate-200 text-emerald-700 font-bold">
                  <span>Combo Bonus Savings:</span>
                  <span>- {formatNaira(orderCalc.comboDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Customer Name:</span>
                <span className="font-semibold text-slate-900">{formData.fullName}</span>
              </div>

              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Contact Phone:</span>
                <span className="font-semibold text-slate-900">{formData.phoneNumber}</span>
              </div>

              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Delivery Destination:</span>
                <span className="font-semibold text-slate-900">
                  {formData.city}, {formData.state}
                </span>
              </div>

              <div className="flex justify-between pt-1 text-sm sm:text-base">
                <span className="font-bold text-slate-700">Total Payable:</span>
                <span className="font-black text-blue-700">{formatNaira(orderCalc.total)}</span>
              </div>

              <div className="text-[11px] text-emerald-700 font-semibold text-center pt-1">
                ✓ Free Nationwide Delivery Included • Pay on Delivery
              </div>
            </div>

            {/* Fast-Track WhatsApp CTA */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-md mx-auto mb-6 text-center">
              <p className="text-emerald-900 text-xs sm:text-sm font-semibold mb-3">
                ⚡ <strong className="text-emerald-800">Fast-Track Your Dispatch:</strong> Click below to confirm your delivery address directly with our warehouse team on WhatsApp.
              </p>
              <a
                href={getWhatsAppConfirmationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow-emerald w-full inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-sm sm:text-base py-4 px-6 rounded-xl shadow-xl transition-all"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>CONFIRM ORDER ON WHATSAPP</span>
              </a>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleReset}
                className="text-slate-500 hover:text-slate-800 text-xs py-2 px-4 underline cursor-pointer transition-colors"
              >
                Need another order? Click here to fill a new form
              </button>
            </div>
          </div>
        ) : (
          /* ================= ORDER FORM ================= */
          <div className="bg-white border border-blue-200/80 rounded-3xl p-6 sm:p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error banner */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs sm:text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Step 1: Select What You Want to Order */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center justify-between">
                  <span>Step 1: Select What You Want to Order</span>
                  <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Combo Available
                  </span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  {/* Option 1: 2-Burner */}
                  <button
                    type="button"
                    onClick={() => handleSelectModel('2-burner')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedModel === '2-burner' && qty2Burner > 0 && qty5Burner === 0
                        ? 'border-blue-600 bg-blue-50/90 shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          <Flame className="w-3 h-3 text-blue-600 fill-current" />
                          75 × 45 cm Panel
                        </span>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            selectedModel === '2-burner' && qty2Burner > 0 && qty5Burner === 0
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-slate-300'
                          }`}
                        >
                          {selectedModel === '2-burner' && qty2Burner > 0 && qty5Burner === 0 && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                        2-Flip-Up Double Burner
                      </h4>
                      <div className="mt-1 text-[11px] text-blue-700 font-semibold">
                        Panel Size: 75 by 45 cm
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                        2 gas cooking zones, 90° flip-up burners, digital LED timer & tempered glass.
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 flex items-baseline justify-between">
                      <span className="text-[10px] text-slate-500 font-medium">From</span>
                      <strong className="text-sm font-black text-blue-700">
                        {formatNaira(150000)} - {formatNaira(170000)}
                      </strong>
                    </div>
                  </button>

                  {/* Option 2: 5-Burner */}
                  <button
                    type="button"
                    onClick={() => handleSelectModel('5-burner')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedModel === '5-burner' && qty5Burner > 0 && qty2Burner === 0
                        ? 'border-amber-500 bg-amber-50/90 shadow-md ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                          <Zap className="w-3 h-3 text-amber-600 fill-current" />
                          90 × 51 cm Panel
                        </span>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            selectedModel === '5-burner' && qty5Burner > 0 && qty2Burner === 0
                              ? 'border-amber-600 bg-amber-600'
                              : 'border-slate-300'
                          }`}
                        >
                          {selectedModel === '5-burner' && qty5Burner > 0 && qty2Burner === 0 && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                        5-Burner Gas + Electric
                      </h4>
                      <div className="mt-1 text-[11px] text-amber-800 font-semibold">
                        Panel Size: 90 by 51 cm
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                        4 gas + 1 central 2000W electric zone, digital countdown timer & auto-off key.
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 flex items-baseline justify-between">
                      <span className="text-[10px] text-slate-500 font-medium">From</span>
                      <strong className="text-sm font-black text-amber-700">
                        {formatNaira(250000)} - {formatNaira(280000)}
                      </strong>
                    </div>
                  </button>

                  {/* Option 3: COMBO PACK */}
                  <button
                    type="button"
                    onClick={() => handleSelectModel('combo')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedModel === 'combo' || (qty2Burner > 0 && qty5Burner > 0)
                        ? 'border-emerald-600 bg-emerald-50/90 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-emerald-300 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          <Sparkles className="w-3 h-3 text-emerald-600 fill-current" />
                          Order Both (Save ₦20,000)
                        </span>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            selectedModel === 'combo' || (qty2Burner > 0 && qty5Burner > 0)
                              ? 'border-emerald-600 bg-emerald-600'
                              : 'border-slate-300'
                          }`}
                        >
                          {(selectedModel === 'combo' || (qty2Burner > 0 && qty5Burner > 0)) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                        BOTH COOKERS (COMBO)
                      </h4>
                      <div className="mt-1 text-[11px] text-emerald-700 font-bold">
                        1x 2-Burner (75×45cm) + 1x 5-Burner (90×51cm)
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                        Equip your kitchen with both models or share with family! Delivered in one shipment.
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 flex items-baseline justify-between">
                      <span className="text-[10px] text-slate-500 font-medium">Bundle Price</span>
                      <strong className="text-sm font-black text-emerald-700">
                        {formatNaira(170000 + 280000 - 20000)}
                      </strong>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Set Quantity for Your Order */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center justify-between">
                  <span>Step 2: Set Quantity for Your Order</span>
                  {orderCalc.isCombo || (qty2Burner > 0 && qty5Burner > 0) ? (
                    <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> ₦20,000 Combo Discount Active!
                    </span>
                  ) : (
                    <span className="text-slate-500 text-xs">Adjust quantities below</span>
                  )}
                </label>

                {selectedModel === 'combo' || (qty2Burner > 0 && qty5Burner > 0) ? (
                  /* COMBO VIEW: Dual steppers + incentive banner */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* 2-Burner in Combo */}
                      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold text-slate-900">2-Burner Flip-Up</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            75 × 45 cm
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mb-3">
                          Rate: {formatNaira(orderCalc.unitPrice2Burner)} each
                        </p>
                        <div className="flex items-center justify-between bg-white border border-blue-200 rounded-xl p-2.5">
                          <span className="text-xs text-slate-600 font-medium">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const next = Math.max(1, qty2Burner - 1);
                                setQty2Burner(next);
                                if (onUpdateCart) onUpdateCart({ '2-burner': next, '5-burner': qty5Burner });
                              }}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center font-bold cursor-pointer transition-colors"
                              aria-label="Decrease 2-burner quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center font-bold text-slate-900 font-mono text-sm">
                              {qty2Burner}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const next = qty2Burner + 1;
                                setQty2Burner(next);
                                if (onUpdateCart) onUpdateCart({ '2-burner': next, '5-burner': qty5Burner });
                              }}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center font-bold cursor-pointer transition-colors"
                              aria-label="Increase 2-burner quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-right text-xs font-bold text-blue-900">
                          Subtotal: {formatNaira(orderCalc.subtotal2Burner)}
                        </div>
                      </div>

                      {/* 5-Burner in Combo */}
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-bold text-slate-900">5-Burner Hybrid</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                            90 × 51 cm
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mb-3">
                          Rate: {formatNaira(orderCalc.unitPrice5Burner)} each
                        </p>
                        <div className="flex items-center justify-between bg-white border border-amber-200 rounded-xl p-2.5">
                          <span className="text-xs text-slate-600 font-medium">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const next = Math.max(1, qty5Burner - 1);
                                setQty5Burner(next);
                                if (onUpdateCart) onUpdateCart({ '2-burner': qty2Burner, '5-burner': next });
                              }}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center font-bold cursor-pointer transition-colors"
                              aria-label="Decrease 5-burner quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center font-bold text-slate-900 font-mono text-sm">
                              {qty5Burner}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const next = qty5Burner + 1;
                                setQty5Burner(next);
                                if (onUpdateCart) onUpdateCart({ '2-burner': qty2Burner, '5-burner': next });
                              }}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center font-bold cursor-pointer transition-colors"
                              aria-label="Increase 5-burner quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-right text-xs font-bold text-amber-950">
                          Subtotal: {formatNaira(orderCalc.subtotal5Burner)}
                        </div>
                      </div>
                    </div>

                    {/* Combo incentive banner */}
                    <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        Combo Bundle Incentive: Extra ₦20,000 off applied automatically!
                      </span>
                      <span className="font-black text-emerald-700">- ₦20,000</span>
                    </div>
                  </div>
                ) : selectedModel === '5-burner' ? (
                  /* 5-BURNER SINGLE VIEW: 5 quick select boxes + Stepper + Upsell */
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-3">
                      {[1, 2, 3, 4, 5].map((v) => {
                        const isSelected = qty5Burner === v || (v === 5 && qty5Burner >= 5);
                        let tierPrice = 280000;
                        if (v === 2) tierPrice = 275000;
                        if (v === 3) tierPrice = 270000;
                        if (v >= 4) tierPrice = 250000;

                        return (
                          <button
                            key={v}
                            type="button"
                            onClick={() => {
                              setQty5Burner(v);
                              if (onUpdateCart) onUpdateCart({ '2-burner': 0, '5-burner': v });
                            }}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 border-amber-500 font-black shadow-md scale-102'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-300'
                            }`}
                          >
                            <span className="text-base sm:text-lg font-bold">
                              {v === 5 ? '5+ PCS' : `${v} PC`}
                            </span>
                            <span
                              className={`text-[10px] mt-0.5 ${
                                isSelected ? 'text-slate-900 font-bold' : 'text-amber-700 font-medium'
                              }`}
                            >
                              {formatNaira(tierPrice)} ea
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="text-xs text-slate-600">
                        Units of 5-Burner (90×51cm):{' '}
                        <strong className="text-slate-900 text-sm ml-1">{qty5Burner}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const next = Math.max(1, qty5Burner - 1);
                            setQty5Burner(next);
                            if (onUpdateCart) onUpdateCart({ '2-burner': 0, '5-burner': next });
                          }}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
                          aria-label="Decrease 5-burner quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-slate-900 font-mono">
                          {qty5Burner}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = qty5Burner + 1;
                            setQty5Burner(next);
                            if (onUpdateCart) onUpdateCart({ '2-burner': 0, '5-burner': next });
                          }}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
                          aria-label="Increase 5-burner quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Combo upsell */}
                    <div className="mt-3 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Flame className="w-5 h-5 text-blue-600 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            Also need the 2-Burner Cooker (75 × 45 cm)?
                          </p>
                          <p className="text-[11px] text-slate-600">
                            Order both together and instantly unlock an extra ₦20,000 combo discount!
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedModel('combo');
                          setQty2Burner(1);
                          if (onUpdateCart) onUpdateCart({ '2-burner': 1, '5-burner': qty5Burner });
                        }}
                        className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-3.5 rounded-lg shadow transition-all cursor-pointer"
                      >
                        + Add 2-Burner
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 2-BURNER SINGLE VIEW: 5 quick select boxes + Stepper + Upsell */
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-3">
                      {[1, 2, 3, 4, 5].map((v) => {
                        const isSelected = qty2Burner === v || (v === 5 && qty2Burner >= 5);
                        let tierPrice = 170000;
                        if (v === 2) tierPrice = 165000;
                        if (v >= 3) tierPrice = 150000;

                        return (
                          <button
                            key={v}
                            type="button"
                            onClick={() => {
                              setQty2Burner(v);
                              if (onUpdateCart) onUpdateCart({ '2-burner': v, '5-burner': 0 });
                            }}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 font-black shadow-md scale-102'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300'
                            }`}
                          >
                            <span className="text-base sm:text-lg font-bold">
                              {v === 5 ? '5+ PCS' : `${v} PC`}
                            </span>
                            <span
                              className={`text-[10px] mt-0.5 ${
                                isSelected ? 'text-blue-100 font-bold' : 'text-blue-600 font-medium'
                              }`}
                            >
                              {formatNaira(tierPrice)} ea
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="text-xs text-slate-600">
                        Units of 2-Burner (75×45cm):{' '}
                        <strong className="text-slate-900 text-sm ml-1">{qty2Burner}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const next = Math.max(1, qty2Burner - 1);
                            setQty2Burner(next);
                            if (onUpdateCart) onUpdateCart({ '2-burner': next, '5-burner': 0 });
                          }}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
                          aria-label="Decrease 2-burner quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-slate-900 font-mono">
                          {qty2Burner}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = qty2Burner + 1;
                            setQty2Burner(next);
                            if (onUpdateCart) onUpdateCart({ '2-burner': next, '5-burner': 0 });
                          }}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
                          aria-label="Increase 2-burner quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Combo upsell */}
                    <div className="mt-3 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Zap className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            Want the 5-Burner Hybrid Cooktop (90 × 51 cm) too?
                          </p>
                          <p className="text-[11px] text-slate-600">
                            Order both together and get an automatic ₦20,000 combo discount!
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedModel('combo');
                          setQty5Burner(1);
                          if (onUpdateCart) onUpdateCart({ '2-burner': qty2Burner, '5-burner': 1 });
                        }}
                        className="shrink-0 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2 px-3.5 rounded-lg shadow transition-all cursor-pointer"
                      >
                        + Add 5-Burner
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary & Total Calculation Box */}
              <div
                className={`border-2 rounded-2xl p-4 sm:p-5 shadow-sm ${
                  orderCalc.isCombo || (qty2Burner > 0 && qty5Burner > 0)
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : selectedModel === '5-burner'
                    ? 'bg-amber-50/80 border-amber-300'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-xs uppercase tracking-widest block font-bold text-slate-800">
                      ORDER SUMMARY & TOTAL CALCULATION
                    </span>
                    <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                      {orderCalc.qty2Burner > 0 && (
                        <div>
                          • 2-Burner Flip-Up (75 × 45 cm): {orderCalc.qty2Burner} ×{' '}
                          {formatNaira(orderCalc.unitPrice2Burner)} ={' '}
                          <strong className="text-slate-900">
                            {formatNaira(orderCalc.subtotal2Burner)}
                          </strong>
                        </div>
                      )}
                      {orderCalc.qty5Burner > 0 && (
                        <div>
                          • 5-Burner Hybrid (90 × 51 cm): {orderCalc.qty5Burner} ×{' '}
                          {formatNaira(orderCalc.unitPrice5Burner)} ={' '}
                          <strong className="text-slate-900">
                            {formatNaira(orderCalc.subtotal5Burner)}
                          </strong>
                        </div>
                      )}
                      {orderCalc.comboDiscount > 0 && (
                        <div className="text-emerald-700 font-bold">
                          • Combo Bundle Bonus Discount: -{formatNaira(orderCalc.comboDiscount)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[11px] text-slate-500 block font-semibold uppercase">
                      TOTAL PAYABLE
                    </span>
                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                      {formatNaira(orderCalc.total)}
                    </div>
                    {orderCalc.savings > 0 && (
                      <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Total Savings: {formatNaira(orderCalc.savings)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <Truck className="w-3.5 h-3.5" /> FREE Nationwide Delivery Included
                  </span>
                  <span className="text-slate-500 font-medium">Pay on Delivery Available</span>
                </div>
              </div>

              {/* Step 3: Enter Delivery Details */}
              <div className="space-y-4 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Step 3: Enter Delivery Details
                </label>

                <div>
                  <label htmlFor="fullName" className="block text-xs font-medium text-slate-600 mb-1">
                    FULL NAME <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Adebayo Ogunlesi"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phoneNumber" className="block text-xs font-medium text-slate-600 mb-1">
                      PHONE NUMBER <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. 08012345678"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsappNumber" className="block text-xs font-medium text-slate-600 mb-1">
                      WHATSAPP NUMBER (If different)
                    </label>
                    <input
                      type="tel"
                      id="whatsappNumber"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. 08012345678"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="deliveryAddress" className="block text-xs font-medium text-slate-600 mb-1">
                    DELIVERY ADDRESS <span className="text-blue-600">*</span>
                  </label>
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    rows={2}
                    required
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="e.g. House 14, Admiralty Way, Lekki Phase 1"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-xs font-medium text-slate-600 mb-1">
                      CITY / TOWN <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Ikeja, Ibadan, Port Harcourt"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-xs font-medium text-slate-600 mb-1">
                      STATE <span className="text-blue-600">*</span>
                    </label>
                    <select
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                    >
                      {NIGERIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-slate-600 mb-1">
                    EMAIL ADDRESS <span className="text-slate-400">(Optional for receipt)</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. adebayo@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Error banner above submit button */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border-2 border-rose-300 text-rose-800 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 animate-pulse shadow-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                  <span className="font-bold">{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="submit-order-btn"
                  className={`btn-glow w-full font-black text-base sm:text-lg py-4 px-6 rounded-xl shadow-xl transition-all flex flex-col items-center justify-center cursor-pointer active:scale-98 ${
                    orderCalc.isCombo || (qty2Burner > 0 && qty5Burner > 0)
                      ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white disabled:bg-slate-400'
                      : selectedModel === '5-burner'
                      ? 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 disabled:bg-slate-400'
                      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white disabled:bg-slate-400'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 text-white">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Your Order...
                    </span>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span>PLACE YOUR ORDER NOW — PAY ON DELIVERY ({formatNaira(orderCalc.total)})</span>
                        <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5 opacity-90">
                        <Truck className="w-3.5 h-3.5" /> FREE NATIONWIDE DELIVERY • NO UPFRONT PAYMENT
                      </div>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Your contact details are encrypted and used solely for delivery confirmation.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
