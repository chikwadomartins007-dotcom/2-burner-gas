import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Maximize2,
  Flame,
  Droplets,
  Ruler,
  ShieldCheck,
  Truck,
  CreditCard,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { AlternativeProductData } from '../data/alternativeProductsData';
import { formatNaira, WHATSAPP_LINK } from '../data/productData';
import { ProductId } from '../types';

interface AlternativeProductModalProps {
  product: AlternativeProductData | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForOrder: (productId: ProductId) => void;
  onAddToCart?: (productId: ProductId) => void;
}

export const AlternativeProductModal: React.FC<AlternativeProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSelectForOrder,
  onAddToCart
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  // Reset active image index whenever the product changes or opens
  useEffect(() => {
    setActiveImageIdx(0);
  }, [product, isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const currentImage = product.images[activeImageIdx] || product.images[0];
  const isSink = product.id === 'piano-sink';

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : product.images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev < product.images.length - 1 ? prev + 1 : 0));
  };

  const encodedWhatsAppMessage = encodeURIComponent(product.whatsappMessage);
  const directWhatsAppUrl = `https://wa.me/2348147778029?text=${encodedWhatsAppMessage}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#0e141d] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
              ALTERNATIVE LUXURY APPLIANCE • {product.shortName.toUpperCase()}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto space-y-6">
          {/* Main Photo Gallery Box */}
          <div className="space-y-2.5">
            <div className="relative aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 group shadow-inner">
              <img
                src={currentImage.url}
                alt={currentImage.alt || product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
                loading="eager"
              />

              {/* Tag / Badge Overlay */}
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow-md">
                {isSink ? (
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                )}
                <span>{product.badge}</span>
              </div>

              {/* Image Counter */}
              <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-mono text-slate-300 border border-slate-700">
                {activeImageIdx + 1} / {product.images.length}
              </div>

              {/* Image Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all cursor-pointer border border-white/10 hover:scale-110 active:scale-95"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all cursor-pointer border border-white/10 hover:scale-110 active:scale-95"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Subtitle Caption */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 text-left">
                <p className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                  {currentImage.title}
                </p>
                <p className="text-[11px] text-slate-300 line-clamp-1">
                  {currentImage.subtitle}
                </p>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 sm:w-20 h-12 sm:h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImageIdx === idx
                        ? 'border-amber-500 scale-105 shadow-md shadow-amber-500/20'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price Header */}
          <div className="border-b border-slate-800 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-display">
                  {formatNaira(product.price)}
                </span>
                <span className="text-sm text-slate-500 line-through">
                  {formatNaira(product.normalPrice)}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  SAVE {formatNaira(product.normalPrice - product.price)}
                </span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {product.name}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
              {product.tagline}
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Ruler className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                  Outer Dimensions
                </span>
                <span className="text-sm font-bold text-white">
                  {product.dimensions}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                {isSink ? <Droplets className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                  Countertop Cutout Needed
                </span>
                <span className="text-sm font-bold text-white">
                  {product.cutout}
                </span>
              </div>
            </div>
          </div>

          {/* Key Features Bullet List */}
          <div>
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Why Homeowners Love This Appliance:</span>
            </h4>
            <div className="space-y-2">
              {product.keyFeatures.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span className="leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Points */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CreditCard className="w-4 h-4" />
              <span>Payment on Delivery Available</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Truck className="w-4 h-4" />
              <span>Ships Nationwide Across Nigeria</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>1-Year Manufacturer Warranty</span>
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  onSelectForOrder(product.id);
                  onClose();
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <span>ORDER THIS ITEM (PAY ON DELIVERY)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onAddToCart && (
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product.id);
                    onClose();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl border border-slate-600 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>ADD TO CART</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>INQUIRE ON WHATSAPP</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  onSelectForOrder(product.id);
                  onClose();
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs py-3 px-4 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                <span>Select & Scroll to Order Form</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
