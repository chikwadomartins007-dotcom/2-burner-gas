import React, { useState } from 'react';
import {
  Sparkles,
  Eye,
  CheckCircle2,
  Maximize2,
  Droplets,
  Sliders,
  ShieldCheck,
  Truck,
  CreditCard,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Flame,
  Layers,
  Cpu,
  Ruler,
  Star,
  RotateCw,
  Box,
  Palette,
  PackageCheck,
  Hammer,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { ProductId } from '../types';
import { formatNaira, WHATSAPP_LINK } from '../data/productData';
import {
  ALTERNATIVE_PRODUCTS,
  AlternativeProductData,
  PIANO_SINK_REVIEWS,
  PIANO_SINK_FAQS
} from '../data/alternativeProductsData';
import { AlternativeProductModal } from './AlternativeProductModal';

interface AlternativeProductSectionProps {
  onSelectProduct: (productId: ProductId) => void;
  onAddToCart?: (productId: ProductId) => void;
  onImageClick: (url: string, title: string) => void;
  onOrderClick: () => void;
  activeAlternativeTab?: '5-burner' | 'piano-sink';
  onTabChange?: (tab: '5-burner' | 'piano-sink') => void;
}

export const AlternativeProductSection: React.FC<AlternativeProductSectionProps> = ({
  onSelectProduct,
  onAddToCart,
  onImageClick,
  onOrderClick
}) => {
  // Modal state for "VIEW SPECS & PHOTOS"
  const [modalProduct, setModalProduct] = useState<AlternativeProductData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Deep dive toggle for full Piano Sink showcase
  const [showFullSinkShowcase, setShowFullSinkShowcase] = useState<boolean>(true);

  // Gallery filter in Piano Sink showcase
  const [activeGalleryTag, setActiveGalleryTag] = useState<string>('all');
  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number>(0);

  // FAQ accordion state
  const [openFaqId, setOpenFaqId] = useState<string | null>('sink-faq-1');

  const sinkProduct = ALTERNATIVE_PRODUCTS.find((p) => p.id === 'piano-sink')!;
  const cookerProduct = ALTERNATIVE_PRODUCTS.find((p) => p.id === '5-burner')!;

  const handleOpenModal = (prod: AlternativeProductData) => {
    setModalProduct(prod);
    setIsModalOpen(true);
  };

  const filteredGalleryImages =
    activeGalleryTag === 'all'
      ? sinkProduct.images
      : sinkProduct.images.filter((img) => img.tag === activeGalleryTag);

  const galleryTags = [
    { id: 'all', label: 'All Photos' },
    { id: 'main', label: 'Main Sink' },
    { id: 'console', label: 'Piano Keys & LED' },
    { id: 'details', label: 'Dimensions & Cutout' },
    { id: 'unboxing', label: 'Unboxing Kit' }
  ];

  return (
    <section
      id="alternative-product"
      className="py-14 sm:py-20 bg-[#0a0e14] text-slate-100 border-t border-b border-slate-800/80 relative scroll-mt-14"
    >
      {/* Target anchor for alternative-products-section */}
      <div id="alternative-products-section" className="absolute -top-16 left-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Matching Appliances Grid */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 text-slate-900 mb-12 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                <span>Matching Kitchen Appliances</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#0a192f] tracking-tight">
                Optional Cooktops & Sinks from Max Luxury Bathrooms
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Easily pair your smart piano sink with a matching built-in luxury cooktop or vice-versa.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const form = document.getElementById('order-form');
                if (form) {
                  form.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#0a192f] hover:text-blue-600 font-bold self-start md:self-auto bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <span>Order With Pay On Delivery</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALTERNATIVE_PRODUCTS.map((prod) => {
              const savings = prod.normalPrice - prod.price;
              const is5Burner = prod.id === '5-burner';
              const isSink = prod.id === 'piano-sink';

              return (
                <div
                  key={prod.id}
                  className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-blue-500/50 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-4"
                >
                  <div
                    onClick={() => handleOpenModal(prod)}
                    className="relative w-full sm:w-36 h-32 sm:h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-pointer group"
                  >
                    <img
                      src={prod.images[0].url}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-[#0a192f]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                      {isSink ? 'SMART PIANO SINK' : is5Burner ? '5-BURNER HYBRID' : '90° FLIP-UP'}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        {prod.dimensions.split('(')[0].trim()}
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Save {formatNaira(savings)}
                      </span>
                    </div>

                    <h4
                      onClick={() => handleOpenModal(prod)}
                      className="text-sm font-bold text-[#0a192f] hover:text-blue-600 cursor-pointer line-clamp-1"
                    >
                      {prod.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {prod.tagline}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-200/80">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-[#0a192f] font-mono">
                          {formatNaira(prod.price)}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          {formatNaira(prod.normalPrice)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenModal(prod)}
                        className="inline-flex items-center gap-1 text-xs font-bold bg-[#0a192f] hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>View Specs</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ALTERNATIVE & MATCHING KITCHEN APPLIANCES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Complete Your Modern Kitchen Setup
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base mt-2.5 leading-relaxed">
            Looking for luxury appliances designed to complement each other? Explore our official{' '}
            <strong className="text-amber-400 font-semibold">Smart Kitchen Piano Sink Workstation</strong> and{' '}
            <strong className="text-amber-400 font-semibold">Executive 5-Burner Gas + Electric Hybrid Cooktop</strong> directly from Max Luxury Bathrooms.
          </p>
        </div>

        {/* The Two Main Alternative Product Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Card 1: SMART KITCHEN PIANO SINK */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col group">
            {/* Image Box */}
            <div
              onClick={() => handleOpenModal(sinkProduct)}
              className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer"
            >
              <img
                src={sinkProduct.images[0].url}
                alt={sinkProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />

              {/* Top Badge */}
              <div className="absolute top-3.5 left-3.5 bg-black/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>{sinkProduct.badge}</span>
              </div>

              {/* Source Tag */}
              <div className="absolute top-3.5 right-3.5 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                MAX LUXURY EXCLUSIVE
              </div>

              {/* Bottom Dimensions Tag */}
              <div className="absolute bottom-3.5 right-3.5 bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono text-slate-300 border border-slate-700">
                Panel: 750 × 450 mm
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                    {sinkProduct.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    In Stock • Ships Nationwide
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                  {sinkProduct.name}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                  {sinkProduct.description}
                </p>

                {/* Key Features List */}
                <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-4">
                  {sinkProduct.keyFeatures.slice(0, 4).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-xs text-slate-400 block">Promotional Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-amber-400 font-display">
                        {formatNaira(sinkProduct.price)}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-500 line-through">
                        {formatNaira(sinkProduct.normalPrice)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Save {formatNaira(sinkProduct.normalPrice - sinkProduct.price)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(sinkProduct)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer uppercase tracking-wider"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>VIEW SPECS & PHOTOS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectProduct('piano-sink');
                      onOrderClick();
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider"
                  >
                    <span>ORDER PIANO SINK</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {onAddToCart && (
                  <button
                    type="button"
                    onClick={() => onAddToCart('piano-sink')}
                    className="w-full mt-2 inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2.5 px-3 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add to Cart</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: EXECUTIVE 5-BURNER DUAL-FUEL HYBRID COOKTOP */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col group">
            {/* Image Box */}
            <div
              onClick={() => handleOpenModal(cookerProduct)}
              className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer"
            >
              <img
                src={cookerProduct.images[0].url}
                alt={cookerProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />

              {/* Top Badge */}
              <div className="absolute top-3.5 left-3.5 bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>{cookerProduct.badge}</span>
              </div>

              {/* Bottom Dimensions Tag */}
              <div className="absolute bottom-3.5 right-3.5 bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono text-slate-300 border border-slate-700">
                Panel: 900 × 510 mm
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                    {cookerProduct.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    In Stock • Ships Nationwide
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                  {cookerProduct.name}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                  {cookerProduct.description}
                </p>

                {/* Key Features List */}
                <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-4">
                  {cookerProduct.keyFeatures.slice(0, 4).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-xs text-slate-400 block">Promotional Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-amber-400 font-display">
                        {formatNaira(cookerProduct.price)}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-500 line-through">
                        {formatNaira(cookerProduct.normalPrice)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Save {formatNaira(cookerProduct.normalPrice - cookerProduct.price)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(cookerProduct)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer uppercase tracking-wider"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>VIEW SPECS & PHOTOS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectProduct('5-burner');
                      onOrderClick();
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider"
                  >
                    <span>ORDER 5-BURNER</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {onAddToCart && (
                  <button
                    type="button"
                    onClick={() => onAddToCart('5-burner')}
                    className="w-full mt-2 inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2.5 px-3 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add to Cart</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Combo Discount Note Banner */}
        <div className="bg-slate-900/70 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-center max-w-3xl mx-auto mb-12 shadow-lg">
          <p className="text-xs sm:text-sm text-slate-200">
            💡 <strong className="text-amber-400">Want to order a Cooker + Piano Sink Combo?</strong> You can add both items in your order with an automatic <strong>₦10,000 combo discount</strong>, free combined packaging, and zero upfront risk with nationwide Payment on Delivery!
          </p>
        </div>

        {/* EXPANDABLE COMPLETE SHOWCASE FOR SMART KITCHEN PIANO SINK */}
        <div className="border border-slate-800 rounded-3xl bg-slate-950/60 overflow-hidden shadow-2xl">
          {/* Header Toggle */}
          <div
            onClick={() => setShowFullSinkShowcase((prev) => !prev)}
            className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-900 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block">
                  DEEP DIVE DISPLAY • MAX LUXURY WORKSTATION
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Smart Kitchen Piano Sink: Full Workstation & Engineering Showcase
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
              <span className="hidden sm:inline">
                {showFullSinkShowcase ? 'Hide Detailed Display' : 'Expand Full Display'}
              </span>
              {showFullSinkShowcase ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>

          {/* Full Display Body */}
          {showFullSinkShowcase && (
            <div className="p-6 sm:p-8 space-y-12 animate-fade-in">
              {/* 1. Core Feature Highlights Grid */}
              <div>
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    Hydroelectric Precision Engineering
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Every Functional Detail of the Piano Sink
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    A smarter, cleaner way to wash, chop, prep, and organize your kitchen workflow.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Feature 1 */}
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <h5 className="text-sm font-bold text-white">4 Piano Keys Controls</h5>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Mechanical push buttons switch effortlessly between waterfall, pull-out tap, cup washer, and drinking tap.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <h5 className="text-sm font-bold text-white">Hydroelectric LED Temp Display</h5>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Real-time temperature (°C) and ambient light powered 100% by internal water flow. Zero batteries or electrical wiring!
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <h5 className="text-sm font-bold text-white">Flying Rain Waterfall</h5>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Soft horizontal water curtain makes washing fruits and greens effortless without water splashing across countertops.
                    </p>
                  </div>

                  {/* Feature 4 */}
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h5 className="text-sm font-bold text-white">Double-Track Workstation</h5>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Includes custom solid wood chopping board, colander basket, and prep basin that glide smoothly over double rails.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Interactive Photo Gallery with Category Filters */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      Authentic Product Photo Gallery
                    </h4>
                    <p className="text-xs text-slate-400">
                      Tap any photo to view full resolution details
                    </p>
                  </div>

                  {/* Filter Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {galleryTags.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveGalleryTag(tab.id);
                          setActiveGalleryIdx(0);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          activeGalleryTag === tab.id
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Showcase Photo */}
                <div className="space-y-3">
                  <div
                    onClick={() =>
                      onImageClick(
                        filteredGalleryImages[activeGalleryIdx]?.url || sinkProduct.images[0].url,
                        filteredGalleryImages[activeGalleryIdx]?.title || sinkProduct.name
                      )
                    }
                    className="relative aspect-[16/9] max-h-[460px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 group cursor-pointer shadow-xl"
                  >
                    <img
                      src={
                        filteredGalleryImages[activeGalleryIdx]?.url || sinkProduct.images[0].url
                      }
                      alt={
                        filteredGalleryImages[activeGalleryIdx]?.title || sinkProduct.name
                      }
                      className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                    />

                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-300 border border-emerald-500/40">
                      {filteredGalleryImages[activeGalleryIdx]?.subtitle || 'Smart Piano Sink Workstation'}
                    </div>

                    <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-slate-700">
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Tap to Enlarge</span>
                    </div>
                  </div>

                  {/* Thumbnails Row */}
                  <div className="flex gap-2.5 overflow-x-auto pb-1">
                    {filteredGalleryImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveGalleryIdx(i)}
                        className={`w-20 sm:w-24 h-14 sm:h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                          activeGalleryIdx === i
                            ? 'border-emerald-400 scale-105 shadow-md shadow-emerald-500/20'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Detailed Specifications Sheet */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-emerald-400" />
                  <span>Technical Specifications & Dimensions</span>
                </h4>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="divide-y divide-slate-800/80 text-xs sm:text-sm">
                    {sinkProduct.specifications.map((spec, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-1 sm:grid-cols-3 p-3.5 sm:p-4 hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="font-bold text-slate-300 sm:col-span-1">
                          {spec.feature}
                        </div>
                        <div className="text-slate-400 sm:col-span-2 mt-1 sm:mt-0">
                          {spec.detail}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Verified Nigerian Customer Reviews */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span>Verified Customer Reviews (Nigeria)</span>
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>5.0 / 5.0 Rating (48+ verified reviews)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PIANO_SINK_REVIEWS.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-white">{rev.name}</div>
                          <div className="text-xs text-slate-400">{rev.location}</div>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                        "{rev.review}"
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                        <span className="text-emerald-400 font-medium">✓ Verified Purchase</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Comprehensive Sink FAQs */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-400" />
                  <span>Frequently Asked Questions</span>
                </h4>

                <div className="space-y-2.5">
                  {PIANO_SINK_FAQS.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="border border-slate-800 rounded-xl bg-slate-900/70 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                          className="w-full text-left p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          <span>{faq.question}</span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 text-xs sm:text-sm text-slate-300 border-t border-slate-800/80 pt-3 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Final Order CTA Bar inside Sink Showcase */}
              <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/40 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase">
                    Ready to elevate your kitchen?
                  </div>
                  <div className="text-lg sm:text-xl font-black text-white">
                    Get the Complete Smart Piano Sink Set for {formatNaira(sinkProduct.price)}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Includes all accessories: solid cutting board, colander, faucet, valves & pipes.
                  </div>
                </div>

                <div className="flex gap-2.5 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectProduct('piano-sink');
                      onOrderClick();
                    }}
                    className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                  >
                    ORDER PIANO SINK NOW
                  </button>

                  <a
                    href="https://wa.me/2348147778029?text=Hello%20I%20want%20to%20order%20the%20Smart%20Kitchen%20Piano%20Sink%20Set%20(N140,000)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Detail Modal */}
      <AlternativeProductModal
        product={modalProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectForOrder={(pid) => {
          onSelectProduct(pid);
          onOrderClick();
        }}
        onAddToCart={onAddToCart}
      />
    </section>
  );
};
