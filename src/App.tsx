import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TopAlternativeBanner } from './components/TopAlternativeBanner';
import { UrgencyStockBar } from './components/UrgencyStockBar';
import { HeroSection } from './components/HeroSection';
import { ProblemSolutionSection } from './components/ProblemSolutionSection';
import { FeaturesSection } from './components/FeaturesSection';
import { CookerDiagramSection } from './components/CookerDiagramSection';
import { AlternativeProductSection } from './components/AlternativeProductSection';
import { ProductComparisonSection } from './components/ProductComparisonSection';
import { ProductGallery } from './components/ProductGallery';
import { DimensionsSection } from './components/DimensionsSection';
import { WhyYouWillLoveIt } from './components/WhyYouWillLoveIt';
import { LifestyleSection } from './components/LifestyleSection';
import { HowItWorks } from './components/HowItWorks';
import { PricingSection } from './components/PricingSection';
import { TrustSection } from './components/TrustSection';
import { FAQSection } from './components/FAQSection';
import { FinalOfferSection } from './components/FinalOfferSection';
import { OrderForm } from './components/OrderForm';
import { Footer } from './components/Footer';
import { MobileStickyCTA } from './components/MobileStickyCTA';
import { FloatingOrderNow } from './components/FloatingOrderNow';
import { CartDrawer } from './components/CartDrawer';
import { RecentSalesPopup } from './components/RecentSalesPopup';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { GeminiChatBot } from './components/GeminiChatBot';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { PolicyModals } from './components/PolicyModals';
import { AlternativeProductModal } from './components/AlternativeProductModal';
import { AdDeepLinksModal } from './components/AdDeepLinksModal';
import { ALTERNATIVE_PRODUCTS, AlternativeProductData } from './data/alternativeProductsData';
import { PolicyType, ProductId, CartState } from './types';
import { Sparkles, X, Target } from 'lucide-react';
import {
  trackPixelEvent,
  PRODUCT_NAME,
  PRODUCT_NAME_2B,
  PRODUCT_NAME_5B,
  calculateMultiProductTotals
} from './data/productData';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<ProductId>('2-burner');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Multi-product cart state
  const [cart, setCart] = useState<CartState>({
    '2-burner': 1,
    '5-burner': 0
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [hasPlacedOrder, setHasPlacedOrder] = useState<boolean>(false);
  const [orderWhatsappUrl, setOrderWhatsappUrl] = useState<string>('');

  const [resetOrderSignal, setResetOrderSignal] = useState<number>(0);

  // Alternative product modal state
  const [modalAlternativeProduct, setModalAlternativeProduct] = useState<AlternativeProductData | null>(null);
  const [isAlternativeModalOpen, setIsAlternativeModalOpen] = useState<boolean>(false);

  // Ad Campaign Deep Links Generator Modal & Notification Banner
  const [isAdLinksModalOpen, setIsAdLinksModalOpen] = useState<boolean>(false);
  const [adLandingNotice, setAdLandingNotice] = useState<string | null>(null);

  const handleOpenAlternativeModal = (product: AlternativeProductData) => {
    setModalAlternativeProduct(product);
    setIsAlternativeModalOpen(true);
  };

  const handleOrderSuccess = (details: { whatsappUrl?: string }) => {
    setHasPlacedOrder(true);
    if (details?.whatsappUrl) {
      setOrderWhatsappUrl(details.whatsappUrl);
    }
  };

  const handleResetOrder = () => {
    setHasPlacedOrder(false);
    setOrderWhatsappUrl('');
  };

  // Initialize PageView and ViewContent tracking on mount & handle Ad Deep Links
  useEffect(() => {
    trackPixelEvent('PageView');
    trackPixelEvent('ViewContent', {
      content_name: PRODUCT_NAME,
      value: 170000,
      currency: 'NGN'
    });

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash;

      // 1. If advertiser/tester visits with ?test_purchase=1 or ?trigger_purchase=1 in URL
      if (params.get('test_purchase') === '1' || params.get('trigger_purchase') === '1' || params.get('test_event') === 'purchase') {
        const testOrderId = `ORD-TEST-${Date.now().toString().slice(-4)}`;
        trackPixelEvent(
          'Purchase',
          {
            value: 170000,
            currency: 'NGN',
            content_name: PRODUCT_NAME,
            content_type: 'product',
            content_ids: ['2-burner'],
            num_items: 1,
            order_id: testOrderId
          },
          {
            eventId: testOrderId,
            user: {
              phone: '+2348147778029',
              firstName: 'Test',
              lastName: 'Buyer',
              city: 'Lagos',
              state: 'Lagos',
              country: 'ng'
            }
          }
        );
        console.log(`[Pixel Verification] Fired test Purchase event (#${testOrderId}) from URL parameter.`);
      }

      // 2. Open Ad Deep Links Generator Tool from URL
      if (
        params.get('ad_links') === '1' ||
        params.get('tools') === 'ad-links' ||
        params.get('tools') === 'ad_links' ||
        params.get('deep_links') === '1'
      ) {
        setIsAdLinksModalOpen(true);
      }

      // 3. Ad UTM Tracking Preservation
      const utmSource = params.get('utm_source');
      const utmCampaign = params.get('utm_campaign');
      const utmMedium = params.get('utm_medium');
      if (utmSource) {
        try {
          sessionStorage.setItem('ad_utm_source', utmSource);
          if (utmCampaign) sessionStorage.setItem('ad_utm_campaign', utmCampaign);
          if (utmMedium) sessionStorage.setItem('ad_utm_medium', utmMedium);
        } catch (e) {
          // ignore storage error
        }
      }

      // 4. Ad Campaign Product Deep Link Handling
      const rawProduct = (params.get('product') || params.get('p') || params.get('model') || '').toLowerCase();
      const rawAction = (params.get('action') || '').toLowerCase();
      const rawQty = parseInt(params.get('qty') || params.get('quantity') || '1', 10);
      const validQty = isNaN(rawQty) || rawQty < 1 ? 1 : rawQty;

      if (rawProduct === 'piano-sink' || rawProduct === 'sink' || rawProduct === 'pianosink') {
        setSelectedProduct('piano-sink');
        setCart((prev) => ({ ...prev, 'piano-sink': validQty }));
        setAdLandingNotice('🎯 Ad Offer Applied: Smart Kitchen Piano Sink Workstation (₦140,000) selected with Nationwide Pay-on-Delivery!');

        trackPixelEvent('ViewContent', {
          content_name: 'Smart Kitchen Piano Sink Workstation',
          content_ids: ['piano-sink'],
          value: 140000,
          currency: 'NGN'
        });

        if (rawAction === 'specs' || params.get('modal') === '1' || params.get('view') === 'specs') {
          handleOpenAlternativeModal(ALTERNATIVE_PRODUCTS[0]);
        } else if (rawAction === 'order' || hash === '#order-form' || hash === '#order') {
          setTimeout(() => scrollToOrderForm('piano-sink'), 350);
        } else if (rawAction === 'showcase' || hash === '#alternative-product' || hash === '#showcase') {
          setTimeout(() => {
            const el = document.getElementById('alternative-products-section') || document.getElementById('alternative-product');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 350);
        }
      } else if (rawProduct === '5-burner' || rawProduct === '5burner' || rawProduct === 'hybrid') {
        setSelectedProduct('5-burner');
        setCart((prev) => ({ ...prev, '5-burner': validQty }));
        setAdLandingNotice('🎯 Ad Offer Applied: Executive 5-Burner Gas + Electric Hybrid Cooktop (₦280,000) selected!');

        trackPixelEvent('ViewContent', {
          content_name: PRODUCT_NAME_5B,
          content_ids: ['5-burner'],
          value: 280000,
          currency: 'NGN'
        });

        if (rawAction === 'specs' || params.get('modal') === '1' || params.get('view') === 'specs') {
          handleOpenAlternativeModal(ALTERNATIVE_PRODUCTS[1]);
        } else if (rawAction === 'order' || hash === '#order-form' || hash === '#order') {
          setTimeout(() => scrollToOrderForm('5-burner'), 350);
        } else if (rawAction === 'compare' || hash === '#comparison') {
          setTimeout(() => {
            document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' });
          }, 350);
        }
      } else if (rawProduct === '2-burner' || rawProduct === '2burner') {
        setSelectedProduct('2-burner');
        setCart((prev) => ({ ...prev, '2-burner': validQty }));
        setAdLandingNotice('🎯 Ad Offer Applied: 2-Flip-Up Double Burner Cooktop (₦170,000) selected with Nationwide Pay-on-Delivery!');

        if (rawAction === 'order' || hash === '#order-form' || hash === '#order') {
          setTimeout(() => scrollToOrderForm('2-burner'), 350);
        }
      } else if (rawProduct === 'combo' || rawProduct === 'bundle') {
        setSelectedProduct('2-burner');
        setCart((prev) => ({ ...prev, '2-burner': 1, 'piano-sink': 1 }));
        setAdLandingNotice('🔥 Kitchen Duo Combo Offer: 2-Burner Cooker + Smart Piano Sink selected with ₦10,000 Combo Discount!');
        setTimeout(() => scrollToOrderForm(), 350);
      } else {
        // No specific product in query, but action or hash navigation
        if (rawAction === 'order' || hash === '#order-form' || hash === '#order') {
          setTimeout(() => scrollToOrderForm(), 350);
        } else if (rawAction === 'showcase' || hash === '#alternative-product') {
          setTimeout(() => {
            const el = document.getElementById('alternative-products-section') || document.getElementById('alternative-product');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 350);
        } else if (rawAction === 'compare' || hash === '#comparison') {
          setTimeout(() => {
            document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' });
          }, 350);
        } else if (rawAction === 'gallery' || hash === '#gallery') {
          setTimeout(() => {
            document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
          }, 350);
        }
      }
    }
  }, []);

  const scrollToOrderForm = (modelPreference?: unknown) => {
    // Check if modelPreference matches any valid ProductId
    const isValidProduct =
      typeof modelPreference === 'string' &&
      (modelPreference === '2-burner' || modelPreference === '5-burner' || modelPreference === 'piano-sink');

    const pref = isValidProduct ? (modelPreference as ProductId) : selectedProduct;

    if (isValidProduct) {
      setSelectedProduct(modelPreference as ProductId);
    }

    // Fire InitiateCheckout conversion tracking for TikTok, Meta, and GTM
    const checkoutItem =
      pref === '5-burner'
        ? { name: PRODUCT_NAME_5B, price: 280000 }
        : pref === 'piano-sink'
        ? { name: 'Smart Kitchen Piano Sink Workstation', price: 140000 }
        : { name: PRODUCT_NAME_2B, price: 170000 };

    trackPixelEvent('InitiateCheckout', {
      content_name: checkoutItem.name,
      content_ids: [pref],
      value: checkoutItem.price,
      currency: 'NGN',
      num_items: 1
    });

    // If an order was already placed, unlock the form so customer can place a new order
    if (hasPlacedOrder) {
      handleResetOrder();
      setResetOrderSignal((prev) => prev + 1);
    }

    const element =
      document.getElementById('order-form') ||
      document.getElementById('order-form-section');

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToAlternatives = () => {
    const element = document.getElementById('alternative-product') || document.getElementById('comparison');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAddToCart = (productId: ProductId, qty: number = 1) => {
    setCart((prev) => {
      const currentQty = prev[productId] || 0;
      return {
        ...prev,
        [productId]: currentQty + qty
      };
    });

    // Track AddToCart pixel
    trackPixelEvent('AddToCart', {
      content_name: productId === '5-burner' ? '5-Burner Hybrid Cooktop' : '2-Burner Gas Cooker',
      currency: 'NGN',
      value: productId === '5-burner' ? 280000 * qty : 170000 * qty
    });

    setIsCartOpen(true);
  };

  const handleUpdateCart = (newCart: CartState) => {
    setCart(newCart);
  };

  const handleUpdateCartQuantity = (productId: ProductId, qty: number) => {
    setCart((prev) => ({
      ...prev,
      [productId]: Math.max(0, qty)
    }));
  };

  const handleOpenLightbox = (url: string, title: string) => {
    setLightboxImage({ url, title });
  };

  const handleCloseLightbox = () => {
    setLightboxImage(null);
  };

  const handleNavigateLightbox = (url: string, title: string) => {
    setLightboxImage({ url, title });
  };

  const [alternativeTab, setAlternativeTab] = useState<'5-burner' | 'piano-sink'>('5-burner');

  const scrollToAlternative = () => {
    setSelectedProduct('5-burner');
    setAlternativeTab('5-burner');
    const el = document.getElementById('alternative-product');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAlternativeSink = () => {
    setAlternativeTab('piano-sink');
    const el = document.getElementById('alternative-product');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Compute live cart figures
  const cartTotals = calculateMultiProductTotals(cart);
  const totalCartCount = (cart['2-burner'] || 0) + (cart['5-burner'] || 0) + (cart['piano-sink'] || 0);

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col selection:bg-red-600 selection:text-white">
      {/* Navigation Header with Cart Trigger & Ad Deep Links */}
      <Header
        onOrderClick={scrollToOrderForm}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdLinks={() => setIsAdLinksModalOpen(true)}
        cartCount={totalCartCount}
        cartTotal={cartTotals.grandTotal}
      />

      {/* Top Moving Button to Alternative Products (Matching Cooktops & Sinks) */}
      <TopAlternativeBanner
        onViewProduct={handleOpenAlternativeModal}
        onSelectForOrder={(pid) => {
          setSelectedProduct(pid);
          handleAddToCart(pid, 1);
          scrollToOrderForm();
        }}
      />

      {/* Scarcity / Countdown / Stock Bar (Inspired by luxury home tech store) */}
      <UrgencyStockBar onOrderClick={scrollToOrderForm} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onOrderClick={scrollToOrderForm}
          onAddToCart={(pid) => handleAddToCart(pid, 1)}
          onImageClick={handleOpenLightbox}
        />

        {/* Problem vs Solution */}
        <ProblemSolutionSection />

        {/* Features Section with supplied images */}
        <FeaturesSection
          onOrderClick={scrollToOrderForm}
          onImageClick={handleOpenLightbox}
        />

        {/* Component Guide & Labeled Diagram Section */}
        <CookerDiagramSection
          onImageClick={handleOpenLightbox}
        />

        {/* Alternative Product Showcase: 5-Burner Gas & Electric Hybrid & Smart Piano Sink */}
        <AlternativeProductSection
          activeAlternativeTab={alternativeTab}
          onTabChange={setAlternativeTab}
          onSelectProduct={(pid) => {
            setSelectedProduct(pid);
            handleAddToCart(pid, 1);
          }}
          onAddToCart={(pid) => handleAddToCart(pid, 1)}
          onImageClick={handleOpenLightbox}
          onOrderClick={scrollToOrderForm}
        />

        {/* Side-by-Side Model Comparison */}
        <ProductComparisonSection
          selectedProduct={selectedProduct}
          onSelectProduct={(pid) => {
            setSelectedProduct(pid);
          }}
          onAddToCart={(pid) => handleAddToCart(pid, 1)}
          onOrderClick={scrollToOrderForm}
        />

        {/* Complete 14-Photo Authentic Product Gallery */}
        <ProductGallery
          onImageClick={handleOpenLightbox}
        />

        {/* Dimensions & Installation Guide */}
        <DimensionsSection
          onImageClick={handleOpenLightbox}
          onOrderClick={scrollToOrderForm}
        />

        {/* Why You'll Love It */}
        <WhyYouWillLoveIt
          onOrderClick={scrollToOrderForm}
        />

        {/* Kitchen Lifestyle Showcase */}
        <LifestyleSection
          onImageClick={handleOpenLightbox}
          onOrderClick={scrollToOrderForm}
        />

        {/* 4-Step Process */}
        <HowItWorks />

        {/* Tiered Pricing Section */}
        <PricingSection
          selectedProduct={selectedProduct}
          onSelectProduct={(pid) => setSelectedProduct(pid)}
          selectedQuantity={selectedQuantity}
          onSelectQuantity={(qty) => {
            setSelectedQuantity(qty);
          }}
          onAddToCart={(pid, qty) => {
            handleAddToCart(pid, qty);
          }}
          onOrderClick={scrollToOrderForm}
        />

        {/* Payment on Delivery Trust & Assurance */}
        <TrustSection />

        {/* Frequently Asked Questions */}
        <FAQSection
          onOrderClick={scrollToOrderForm}
        />

        {/* Final Conversion Offer */}
        <FinalOfferSection
          onOrderClick={scrollToOrderForm}
          onAddToCart={(pid) => handleAddToCart(pid, 1)}
        />

        {/* Order Form with Multi-Product Cart Support */}
        <OrderForm
          cart={cart}
          onUpdateCart={handleUpdateCart}
          initialModel={selectedProduct}
          initialQuantity={selectedQuantity}
          onOrderSuccess={handleOrderSuccess}
          onResetOrder={handleResetOrder}
          resetSignal={resetOrderSignal}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenPolicy={(policy) => setActivePolicy(policy)}
        onOrderClick={scrollToOrderForm}
        onOpenAdLinks={() => setIsAdLinksModalOpen(true)}
      />

      {/* Ad Campaign Deep Link Welcome Toast / Floating Notice */}
      {adLandingNotice && (
        <div className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-40 max-w-md bg-slate-950/95 text-white border border-amber-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-fade-in flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                Special Ad Promotion Activated
              </div>
              <p className="text-xs text-slate-200 mt-0.5 leading-snug">
                {adLandingNotice}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                scrollToOrderForm();
                setAdLandingNotice(null);
              }}
              className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Order Now
            </button>
            <button
              onClick={() => setAdLandingNotice(null)}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              aria-label="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom CTA Bar with Cart Trigger (Shows WhatsApp only after order) */}
      {!isCartOpen && (
        <MobileStickyCTA
          onOrderClick={scrollToOrderForm}
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={totalCartCount}
          hasPlacedOrder={hasPlacedOrder}
          whatsappUrl={orderWhatsappUrl}
          isChatOpen={isChatOpen}
        />
      )}

      {/* Floating Order Now Pay on Delivery Button with Black & Red Color Transition */}
      <FloatingOrderNow
        onOrderClick={scrollToOrderForm}
        hasPlacedOrder={hasPlacedOrder}
        isCartOpen={isCartOpen}
      />

      {/* Slide-out Shopping Cart Drawer with Mobile Reduced Size & Minimize Bar */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onCheckout={() => {
          setIsCartOpen(false);
          scrollToOrderForm();
        }}
        onScrollToAlternatives={scrollToAlternatives}
      />

      {/* Live Social Proof Recent Sales Popup */}
      <RecentSalesPopup onOrderClick={scrollToOrderForm} />

      {/* Floating WhatsApp Chat Button (Only visible after order is placed) */}
      <FloatingWhatsApp
        hasPlacedOrder={hasPlacedOrder}
        whatsappUrl={orderWhatsappUrl}
      />

      {/* Official Max Luxury Bathrooms Gemini AI Customer Support Assistant */}
      <GeminiChatBot
        onOrderClick={scrollToOrderForm}
        onOpenChange={setIsChatOpen}
      />

      {/* Fullscreen Product Image Lightbox Modal */}
      <ImageLightboxModal
        currentImageUrl={lightboxImage?.url || null}
        currentImageTitle={lightboxImage?.title}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigateLightbox}
      />

      {/* Policy Modals */}
      <PolicyModals
        activePolicy={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

      {/* Alternative Product Detail Modal */}
      <AlternativeProductModal
        product={modalAlternativeProduct}
        isOpen={isAlternativeModalOpen}
        onClose={() => setIsAlternativeModalOpen(false)}
        onSelectForOrder={(pid) => {
          setIsAlternativeModalOpen(false);
          setSelectedProduct(pid);
          handleAddToCart(pid, 1);
          scrollToOrderForm();
        }}
        onAddToCart={(pid) => {
          handleAddToCart(pid, 1);
          setIsCartOpen(true);
        }}
      />

      {/* Ad Campaign Deep Links Generator Hub Modal */}
      <AdDeepLinksModal
        isOpen={isAdLinksModalOpen}
        onClose={() => setIsAdLinksModalOpen(false)}
      />
    </div>
  );
}
