import React from 'react';
import { X, ShieldCheck, Truck, RefreshCw, FileText } from 'lucide-react';
import { PolicyType } from '../types';
import { BRAND_NAME, PHONE_NUMBER } from '../data/productData';

interface PolicyModalsProps {
  activePolicy: PolicyType;
  onClose: () => void;
}

export const PolicyModals: React.FC<PolicyModalsProps> = ({ activePolicy, onClose }) => {
  if (!activePolicy) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {activePolicy === 'delivery' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-display text-xl font-bold text-white">Delivery Policy</h3>
            </div>
            <div className="text-sm text-neutral-300 space-y-3 leading-relaxed">
              <p>
                At <strong>{BRAND_NAME}</strong>, we offer reliable nationwide delivery across Nigeria.
              </p>
              <h4 className="font-bold text-white text-base">1. Order Verification</h4>
              <p>
                Before dispatching your cooker, our customer support team will call or message you on your provided phone number to confirm your delivery address, availability, and order details.
              </p>
              <h4 className="font-bold text-white text-base">2. Dispatch & Delivery Timelines</h4>
              <p>
                - <strong>Lagos & Nearby Cities:</strong> 24 to 48 hours.<br />
                - <strong>Other States:</strong> 2 to 4 working days depending on location.
              </p>
              <h4 className="font-bold text-white text-base">3. Payment on Delivery</h4>
              <p>
                You only pay when the rider or courier brings the package to your provided doorstep. You may inspect the outer package before completing payment via cash or instant bank transfer.
              </p>
            </div>
          </div>
        )}

        {activePolicy === 'return' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-blue-400" />
              <h3 className="font-display text-xl font-bold text-white">Return & Inspection Policy</h3>
            </div>
            <div className="text-sm text-neutral-300 space-y-3 leading-relaxed">
              <h4 className="font-bold text-white text-base">1. Inspection at Delivery</h4>
              <p>
                We advise every customer to inspect the cooker upon arrival. If the product arrives with transit damage or factory defect, please notify the delivery personnel immediately or call our support line at <strong>{PHONE_NUMBER}</strong>.
              </p>
              <h4 className="font-bold text-white text-base">2. Defect Replacement</h4>
              <p>
                In the rare event of a functional manufacturer defect reported within 48 hours of receipt, {BRAND_NAME} will promptly arrange a direct replacement unit at no extra charge.
              </p>
              <h4 className="font-bold text-white text-base">3. Usage Conditions</h4>
              <p>
                Items must remain in their original condition and packaging. Damage caused by improper installation, dropping, or incorrect gas regulators is not covered under the replacement guarantee.
              </p>
            </div>
          </div>
        )}

        {activePolicy === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-amber-400" />
              <h3 className="font-display text-xl font-bold text-white">Terms & Conditions</h3>
            </div>
            <div className="text-sm text-neutral-300 space-y-3 leading-relaxed">
              <p>
                Welcome to <strong>{BRAND_NAME}</strong>. By submitting an order through this website, you agree to the following terms:
              </p>
              <h4 className="font-bold text-white text-base">1. Genuine Commitment to Order</h4>
              <p>
                Because we cover logistics and courier expenses to dispatch orders on a Payment on Delivery basis, we kindly ask that you only submit an order if you are genuinely ready to receive and pay for the item upon delivery.
              </p>
              <h4 className="font-bold text-white text-base">2. Pricing Transparency</h4>
              <p>
                The prices stated on this website (₦170,000 for 1 piece, ₦165,000 each for 2 pieces, ₦160,000 each for 3 pieces, and ₦150,000 each for 4 pieces or more) are fixed and transparent.
              </p>
              <h4 className="font-bold text-white text-base">3. Customer Support</h4>
              <p>
                For any inquiries regarding your purchase, reach our customer care line directly at <strong>{PHONE_NUMBER}</strong>.
              </p>
            </div>
          </div>
        )}

        {activePolicy === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-display text-xl font-bold text-white">Privacy Policy</h3>
            </div>
            <div className="text-sm text-neutral-300 space-y-3 leading-relaxed">
              <p>
                Your privacy is of utmost importance to <strong>{BRAND_NAME}</strong>.
              </p>
              <h4 className="font-bold text-white text-base">1. Information We Collect</h4>
              <p>
                We only collect your name, phone number, and delivery address strictly for the purpose of verifying, processing, and delivering your ordered cooker.
              </p>
              <h4 className="font-bold text-white text-base">2. Protection & Sharing</h4>
              <p>
                We do not sell, rent, or trade your contact information with any unauthorized third parties. Your details are only shared with our internal dispatchers and logistics courier partners to fulfill your delivery.
              </p>
              <h4 className="font-bold text-white text-base">3. Data Security</h4>
              <p>
                All order submissions are handled securely, and no sensitive credit card information is collected on this website.
              </p>
            </div>
          </div>
        )}

        <div className="pt-6 mt-6 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
