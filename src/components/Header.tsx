import React, { useState } from 'react';
import { Menu, X, Phone, ShoppingBag, ShieldCheck, Target } from 'lucide-react';
import { BRAND_NAME, PHONE_NUMBER, CALL_LINK, formatNaira } from '../data/productData';

interface HeaderProps {
  onOrderClick: () => void;
  onOpenCart?: () => void;
  onOpenAdLinks?: () => void;
  cartCount?: number;
  cartTotal?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOrderClick,
  onOpenCart,
  onOpenAdLinks,
  cartCount = 0,
  cartTotal = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-red-100 shadow-sm transition-colors">
      {/* Slim Top Promotional Bar in Red with Dark Yellow / Gold Highlights */}
      <div className="w-full bg-red-700 text-white text-xs py-2 px-4 text-center font-semibold tracking-wide shadow-inner border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="bg-amber-400 text-neutral-950 font-extrabold px-2 py-0.5 rounded-xs text-[10px] uppercase tracking-wider">
            Verified
          </span>
          <span className="font-bold">100% PAYMENT ON DELIVERY NATIONWIDE</span>
          <span className="text-amber-300 hidden sm:inline">•</span>
          <span className="text-amber-200 hidden sm:inline">INSPECT PHYSICALLY BEFORE MAKING PAYMENT</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Name */}
        <a href="#" className="flex flex-col group">
          <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-neutral-900 group-hover:text-red-600 transition-colors">
            {BRAND_NAME}
          </span>
          <span className="text-[10px] tracking-widest text-red-600 uppercase font-bold">
            Premium Home & Kitchen
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7 text-sm font-semibold text-neutral-700">
          <button
            onClick={() => scrollToSection('hero')}
            className="hover:text-red-600 transition-colors cursor-pointer"
          >
            HOME
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-red-600 transition-colors cursor-pointer"
          >
            FEATURES
          </button>
          <button
            onClick={() => scrollToSection('alternative-product')}
            className="hover:text-red-700 transition-colors cursor-pointer flex items-center gap-1.5 text-red-600 font-bold"
          >
            <span>ALTERNATIVES</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 border border-red-200 text-red-700 font-bold">
              2 Models
            </span>
          </button>
          <button
            onClick={() => scrollToSection('comparison')}
            className="hover:text-red-600 transition-colors cursor-pointer"
          >
            COMPARE MODELS
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="hover:text-red-600 transition-colors cursor-pointer"
          >
            GALLERY
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-red-600 transition-colors cursor-pointer"
          >
            HOW IT WORKS
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="hover:text-red-600 transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Ad Deep Links Hub Trigger */}
          {onOpenAdLinks && (
            <button
              onClick={onOpenAdLinks}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-red-600 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-300 px-3 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Open Ad Campaign Deep Links Hub for Facebook, TikTok & IG Ads"
            >
              <Target className="w-3.5 h-3.5 text-red-600" />
              <span>Ad Links</span>
              <span className="bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                Ads
              </span>
            </button>
          )}

          <a
            href={CALL_LINK}
            className="flex items-center gap-2 text-xs font-bold text-neutral-800 hover:text-red-600 px-3 py-2.5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-100 transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-red-600" />
            <span>{PHONE_NUMBER}</span>
          </a>

          {/* Cart Drawer Trigger Button */}
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-900 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-red-600" />
              <span>CART</span>
              {cartCount > 0 ? (
                <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              ) : null}
              {cartTotal > 0 && (
                <span className="text-red-600 font-bold ml-0.5">
                  ({formatNaira(cartTotal)})
                </span>
              )}
            </button>
          )}

          {/* Looping Order Now Button */}
          <button
            onClick={onOrderClick}
            className="inline-flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all shadow-md shadow-red-600/20 active:scale-95 cursor-pointer animate-order-loop"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>ORDER NOW</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              className="relative p-2 text-neutral-700 hover:text-red-600"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={onOrderClick}
            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm active:scale-95 animate-order-loop"
          >
            ORDER NOW
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 hover:text-red-600 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-red-100 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-2 text-base font-semibold text-neutral-800">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-left py-2 hover:text-red-600 border-b border-neutral-100"
            >
              HOME
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-left py-2 hover:text-red-600 border-b border-neutral-100"
            >
              FEATURES
            </button>
            <button
              onClick={() => scrollToSection('alternative-product')}
              className="text-left py-2 text-red-600 font-bold border-b border-neutral-100 flex items-center justify-between"
            >
              <span>ALTERNATIVE PRODUCTS</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                5-Burner & Piano Sink
              </span>
            </button>
            <button
              onClick={() => scrollToSection('comparison')}
              className="text-left py-2 hover:text-red-600 border-b border-neutral-100"
            >
              COMPARE 2-BURNER VS 5-BURNER
            </button>
            <button
              onClick={() => scrollToSection('diagram')}
              className="text-left py-2 hover:text-red-600 border-b border-neutral-100"
            >
              PARTS GUIDE
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="text-left py-2 hover:text-red-600 border-b border-neutral-100"
            >
              PRODUCT GALLERY
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left py-2 hover:text-red-600 border-b border-neutral-100"
            >
              HOW IT WORKS
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-left py-2 hover:text-red-600 border-b border-neutral-100"
            >
              FREQUENTLY ASKED QUESTIONS
            </button>
            {onOpenAdLinks && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdLinks();
                }}
                className="text-left py-2 text-red-600 font-bold flex items-center justify-between border-b border-neutral-100"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-600" />
                  <span>AD CAMPAIGN DEEP LINKS</span>
                </div>
                <span className="text-[10px] bg-red-100 text-red-700 font-extrabold px-2 py-0.5 rounded-full">
                  Tools
                </span>
              </button>
            )}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <a
              href={CALL_LINK}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-neutral-300 bg-neutral-50 text-sm font-bold text-neutral-800 hover:bg-red-50 hover:text-red-600"
            >
              <Phone className="w-4 h-4 text-red-600" />
              <span>CALL {PHONE_NUMBER}</span>
            </a>
            <button
              onClick={onOrderClick}
              className="w-full py-3.5 rounded-xl bg-red-600 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>ORDER NOW — PAY ON DELIVERY</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
