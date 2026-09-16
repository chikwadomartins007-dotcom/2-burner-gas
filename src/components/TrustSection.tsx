import React from 'react';
import { ShieldCheck, Phone, CheckCircle2, Lock, Truck, Eye } from 'lucide-react';
import { PHONE_NUMBER, CALL_LINK } from '../data/productData';

export const TrustSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Zero Risk Commitment
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            ORDER WITH CONFIDENCE
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            You don't need to make an upfront online payment to place your order. Place your order online and our team will contact you to confirm your order and delivery details. Payment is made when your order is delivered.
          </p>
        </div>

        {/* 4 Pillars of Genuine Trust */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900">
              Payment on Delivery
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              No credit cards or advance bank deposits required online. You pay only after the package is brought to you.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900">
              Inspect Upon Arrival
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Open and examine your cooker package upon delivery to confirm you received the exact genuine product.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900">
              Direct Phone Verification
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Our team speaks with you directly on {PHONE_NUMBER} to verify your address before dispatching from our hub.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900">
              Doorstep Delivery
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Reliable courier delivery across Nigeria straight to your residential address or commercial workplace.
            </p>
          </div>
        </div>

        {/* Contact Banner */}
        <div className="mt-10 p-6 rounded-2xl bg-neutral-50 border border-neutral-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <div className="text-sm font-bold text-neutral-900">Have questions before placing your order?</div>
            <div className="text-xs text-neutral-600">Speak directly with our customer support team today.</div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={CALL_LINK}
              className="px-4 py-2.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 text-xs font-semibold text-neutral-800 transition-colors flex items-center gap-2 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-red-600" />
              <span>Call {PHONE_NUMBER}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
