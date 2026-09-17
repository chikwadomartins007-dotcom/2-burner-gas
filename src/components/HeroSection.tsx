import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Check,
  Phone,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { PHONE_NUMBER, CALL_LINK } from '../data/productData';
import { ProductId } from '../types';

interface HeroSectionProps {
  onOrderClick: () => void;
  onAddToCart?: (productId: ProductId) => void;
  onImageClick: (url: string, title: string) => void;
}

// Hand-picked authentic product showcase slides matching moonlightluxuryhometech.shop
const HERO_SLIDES = [
  {
    id: 'hero-persp',
    url: '/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg',
    title: 'Double-Burner Cooker Overview',
    badge: 'Flagship Design',
    desc: 'Sleek bevelled crystal black tempered glass surface with dual burners, digital battery display & timer.'
  },
  {
    id: 'parts-diagram',
    url: '/images/11bb45a3-5549-4fdd-9bc1-7023275b3a13.png',
    title: 'Complete Component Guide',
    badge: 'Exploded View',
    desc: 'Heavy-duty foldable pot stands, dual burners, digital timer display, pulse ignition box & non-slip feet.'
  },
  {
    id: 'cooktop-front',
    url: '/images/Hf3fea0e1fc4e46d4ac33b8a45f21785ex.jpg',
    title: 'Frontal Glass Cooktop View',
    badge: 'Pure Crystal Glass',
    desc: '8mm explosion-proof toughened glass engineered for heat resistance and effortless one-wipe cleaning.'
  },
  {
    id: 'smart-controls',
    url: '/images/H6452756b08ba47fea9e256a8e5ff398eo.jpg',
    title: 'Smart LED Display & Rotary Knobs',
    badge: 'Digital Timer',
    desc: 'Precise flame control with digital cooking timer and real-time battery level status display.'
  },
  {
    id: 'burner-cap',
    url: '/images/Hb703478da96c4d06ac439666db478fb5s.jpg',
    title: 'Honeycomb Multi-Ring Burner Crown',
    badge: 'High Heat Efficiency',
    desc: 'Fierce, pure blue windproof flame for fast Nigerian family cooking and uniform heat distribution.'
  },
  {
    id: 'cleaning-demo',
    url: '/images/Hc8520771f71b451d96ae3caee5e55e9a5.jpg',
    title: 'Hinged 90° Flip-Up Burners',
    badge: 'Easy Clean',
    desc: 'Lift the burners completely up to 90 degrees to wipe away food residue and oil without disassembling.'
  },
  {
    id: 'kitchen-marble',
    url: '/images/Hebaafe7677f84003942e806feac863ad1.jpg',
    title: 'Modern Countertop Setup',
    badge: 'Dual Setup',
    desc: 'Use directly on the tabletop with rubber feet or install flush inside your kitchen cabinet cutout.'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOrderClick,
  onAddToCart,
  onImageClick
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play slideshow every 4.5 seconds when not hovered
  useEffect(() => {
    if (isPaused) {
      if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
      return;
    }

    autoSlideTimerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
    };
  }, [isPaused, currentSlide]);

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <section
      id="hero"
      className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-red-100 bg-gradient-to-b from-red-50/70 via-white to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Product Information & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Trust Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-red-200 text-red-700 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                PAYMENT ON DELIVERY AVAILABLE
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-amber-500 hover:bg-amber-600 text-neutral-950 border border-amber-600 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
                FROM ₦170,000 PROMO
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-yellow-600 text-white shadow-xs">
                ★ 4.9 RATED
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.15]">
              UPGRADE YOUR KITCHEN WITH A PREMIUM <span className="text-red-600">2-BURNER GLASS</span> GAS COOKER
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
              A sleek double-burner cooker designed for convenient everyday cooking, easy flame control, flip-up 90° easy cleaning and a clean modern kitchen setup.
            </p>

            {/* Benefit Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-800">
                <div className="w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>2-BURNER COOKING</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-800">
                <div className="w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>MODERN GLASS COOKTOP</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-800">
                <div className="w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>EASY FLAME CONTROL</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-800">
                <div className="w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>SLEEK MODERN DESIGN</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-900 sm:col-span-2">
                <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-red-600">PAYMENT ON DELIVERY NATIONWIDE</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onOrderClick}
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-red-600 text-white font-bold text-base hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 active:scale-[0.99] cursor-pointer animate-order-loop"
              >
                <span>ORDER NOW — PAY ON DELIVERY</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {onAddToCart && (
                <button
                  type="button"
                  onClick={() => onAddToCart('2-burner')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl border-2 border-red-600 bg-white hover:bg-red-50 text-red-600 text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4 text-red-600" />
                  <span>ADD TO CART</span>
                </button>
              )}

              <a
                href={CALL_LINK}
                className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-xl border border-neutral-300 bg-white hover:bg-red-50 text-neutral-800 hover:text-red-600 text-sm font-bold transition-all shadow-sm"
                title="Call our support team directly"
              >
                <Phone className="w-4 h-4 text-red-600" />
                <span>CALL {PHONE_NUMBER}</span>
              </a>
            </div>

            {/* Simple Assurance Note */}
            <p className="text-xs text-neutral-500 pt-1">
              Order now with zero upfront payment. We verify your order via phone and you pay when received.
            </p>
          </div>

          {/* Right Column: Interactive Product Showcase Slideshow */}
          <div className="lg:col-span-5 relative">
            <div
              className="relative rounded-2xl overflow-hidden border-2 border-red-100 bg-white p-3 shadow-xl group"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Main Slideshow Stage */}
              <div
                className="relative overflow-hidden rounded-xl bg-neutral-100 aspect-[4/3] sm:aspect-[16/11] cursor-pointer"
                onClick={() => onImageClick(activeSlide.url, activeSlide.title)}
              >
                {/* Image Transition View */}
                {HERO_SLIDES.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      idx === currentSlide
                        ? 'opacity-100 z-10 scale-100'
                        : 'opacity-0 z-0 pointer-events-none scale-102'
                    }`}
                  >
                    <img
                      src={slide.url}
                      alt={slide.title}
                      className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                ))}

                {/* Floating Badge on Slide */}
                <div className="absolute top-3 left-3 z-20 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  <span>{activeSlide.badge}</span>
                </div>

                {/* Fullscreen Enlarge Hint */}
                <div className="absolute top-3 right-3 z-20 bg-neutral-900/75 hover:bg-neutral-900 text-white backdrop-blur-md p-1.5 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                {/* Left & Right Slide Navigation Arrows */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 hover:text-red-600 shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
                  aria-label="Previous product image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 hover:text-red-600 shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
                  aria-label="Next product image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Slide Caption Bottom Overlay */}
                <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-neutral-950/85 via-neutral-950/50 to-transparent p-3 pt-6 text-white text-left">
                  <div className="text-xs font-bold truncate text-white">
                    {activeSlide.title}
                  </div>
                  <div className="text-[10px] text-neutral-300 line-clamp-1">
                    {activeSlide.desc}
                  </div>
                </div>
              </div>

              {/* Thumbnail Strip / Slideshow Selector */}
              <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`relative shrink-0 w-12 sm:w-14 h-10 sm:h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      idx === currentSlide
                        ? 'border-red-600 ring-2 ring-red-400/40 scale-105'
                        : 'border-neutral-200 opacity-60 hover:opacity-100 hover:border-neutral-400'
                    }`}
                    title={slide.title}
                  >
                    <img
                      src={slide.url}
                      alt={slide.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>

              {/* Progress Dots & Slide Counter */}
              <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-neutral-500">
                <div className="flex items-center gap-1">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === currentSlide
                          ? 'w-5 bg-red-600'
                          : 'w-1.5 bg-neutral-300 hover:bg-neutral-400'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <span className="font-mono text-xs font-bold text-neutral-700">
                  {currentSlide + 1} / {HERO_SLIDES.length}
                </span>
              </div>

              {/* Quick Spec Bar Underneath Slideshow */}
              <div className="mt-3 pt-2.5 border-t border-neutral-100 grid grid-cols-3 gap-2 text-center text-xs text-neutral-600 divide-x divide-neutral-200">
                <div className="px-2">
                  <div className="font-bold text-neutral-900">Double Burner</div>
                  <div className="text-[10px] text-red-600 font-semibold">Fast Cooking</div>
                </div>
                <div className="px-2">
                  <div className="font-bold text-neutral-900">Toughened Glass</div>
                  <div className="text-[10px] text-red-600 font-semibold">Effortless Wipe</div>
                </div>
                <div className="px-2">
                  <div className="font-bold text-neutral-900">Cash on Delivery Available</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Zero Risk</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

