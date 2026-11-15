import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UrgencyStockBar } from './components/UrgencyStockBar';
import { HeroSection } from './components/HeroSection';
import { ProblemSolutionSection } from './components/ProblemSolutionSection';
import { FeaturesSection } from './components/FeaturesSection';
import { CookerDiagramSection } from './components/CookerDiagramSection';
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
import { CartDrawer } from './components/CartDrawer';
import { RecentSalesPopup } from './components/RecentSalesPopup';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { GeminiChatBot } from './components/GeminiChatBot';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { PolicyModals } from './components/PolicyModals';
import { AdDeepLinksModal } from './components/AdDeepLinksModal';
import { OrderSuccessCelebration } from './components/OrderSuccessCelebration';
import { ExpressCheckoutModal } from './components/ExpressCheckoutModal';
import { QuickOrderPopup } from './components/QuickOrderPopup';
import { PolicyType, ProductId, CartState, OrderSuccessDetails } from './types';
import { Sparkles, X, Target } from 'lucide-react';
import {
  trackPixelEvent,
  PRODUCT_NAME,
  PRODUCT_NAME_2B,
  calculateMultiProductTotals
} from './data/productData';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<ProductId>('2-burner');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Cart state strictly for the main cooker
  const [cart, setCart] = useState<CartState>({
    '2-burner': 1
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [hasPlacedOrder, setHasPlacedOrder] = useState<boolean>(false);
  const [orderWhatsappUrl, setOrderWhatsappUrl] = useState<string>('');
  const [orderSuccessDetails, setOrderSuccessDetails] = useState<OrderSuccessDetails | null>(null);
  const [showSuccessCelebration, setShowSuccessCelebration] = useState<boolean>(false);

  const [resetOrderSignal, setResetOrderSignal] = useState<number>(0);

  // Ad Campaign Deep Links Generator Modal & Notification Banner
  const [isAdLinksModalOpen, setIsAdLinksModalOpen] = useState<boolean>(false);
  const [adLandingNotice, setAdLandingNotice] = useState<string | null>(null);

  // Express Checkout Pop-Up Form Modal state
  const [isExpressCheckoutOpen, setIsExpressCheckoutOpen] = useState<boolean>(false);
  const [expressInitialProduct, setExpressInitialProduct] = useState<ProductId>('2-burner');

  // Quick Order Pop-Up state (auto-replays every 30s)
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState<boolean>(false);

  const handleOpenExpressCheckout = (preferredProduct?: ProductId) => {
    const targetProduct = preferredProduct || selectedProduct || '2-burner';
    setExpressInitialProduct(targetProduct);
    setSelectedProduct(targetProduct);
    setCart((prev) => ({
      ...prev,
      [targetProduct]: Math.max(1, prev[targetProduct] || 0)
    }));
    setIsExpressCheckoutOpen(true);
  };

  const handleOpenQuickOrder = (preferredProduct?: ProductId) => {
    const targetProduct = preferredProduct || selectedProduct || '2-burner';
    setSelectedProduct(targetProduct);
    setCart((prev) => ({
      ...prev,
      [targetProduct]: Math.max(1, prev[targetProduct] || 0)
    }));
    setIsQuickOrderOpen(true);
  };

  const handleOrderSuccess = (details: OrderSuccessDetails) => {
    setHasPlacedOrder(true);
    if (details?.whatsappUrl) {
      setOrderWhatsappUrl(details.whatsappUrl);
    }
    setOrderSuccessDetails(details);
    setShowSuccessCelebration(true);
    setIsQuickOrderOpen(false);
  };

  const handleResetOrder = () => {
    setHasPlacedOrder(false);
    setOrderWhatsappUrl('');
    setShowSuccessCelebration(false);
    setOrderSuccessDetails(null);
    setIsQuickOrderOpen(false);
  };

  // Initialize PageView and ViewContent tracking on mount & handle Ad Deep Links
  useEffect(() => {
    trackPixelEvent('PageView');
    trackPixelEvent('ViewContent', {
      content_name: PRODUCT_NAME,
      content_type: 'product',
      content_ids: ['2-burner'],
      num_items: 1,
      value: 160000,
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
            value: 160000,
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

      // Test celebratory confetti overlay preview via URL: ?test_confetti=1 or ?celebration=1
      if (
        params.get('test_confetti') === '1' ||
        params.get('test_celebration') === '1' ||
        params.get('celebration') === '1' ||
        params.get('confetti') === '1'
      ) {
        setOrderSuccessDetails({
          orderId: `ORD-${Date.now().toString().slice(-6)}`,
          fullName: 'Chikwado Martins',
          productName: '2-Flip-Up Double Burner (75 × 45 cm)',
          total: 160000,
          quantity: 1,
          state: 'Lagos',
          city: 'Ikeja',
          whatsappUrl: 'https://wa.me/2348147778029'
        });
        setShowSuccessCelebration(true);
      }

      // Check if user or ad deep link requests Express Checkout Pop-up Modal
      if (
        params.get('express') === '1' ||
        params.get('quick') === '1' ||
        params.get('checkout') === '1' ||
        params.get('quick_order') === '1' ||
        params.get('popup') === '1' ||
        params.get('pop_up') === '1'
      ) {
        setIsExpressCheckoutOpen(true);
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
      const rawAction = (params.get('action') || '').toLowerCase();
      const rawQty = parseInt(params.get('qty') || params.get('quantity') || '1', 10);
      const validQty = isNaN(rawQty) || rawQty < 1 ? 1 : rawQty;

      setSelectedProduct('2-burner');
      setCart((prev) => ({ ...prev, '2-burner': validQty }));

      if (rawAction === 'order' || hash === '#order-form' || hash === '#order') {
        setAdLandingNotice('🎯 Special Offer Applied: 2-Flip-Up Double Burner Cooktop (₦160,000 Promo Price) selected with Nationwide Pay-on-Delivery!');
        setTimeout(() => scrollToOrderForm(), 350);
      } else if (rawAction === 'gallery' || hash === '#gallery') {
        setTimeout(() => {
          document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
        }, 350);
      }
    }
  }, []);

  const scrollToOrderForm = () => {
    setSelectedProduct('2-burner');

    // Fire InitiateCheckout conversion tracking for TikTok, Meta, and GTM
    trackPixelEvent('InitiateCheckout', {
      content_name: PRODUCT_NAME_2B,
      content_type: 'product',
      content_ids: ['2-burner'],
      value: 160000,
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

  const handleAddToCart = (_productId: ProductId = '2-burner', qty: number = 1) => {
    setCart((prev) => {
      const currentQty = prev['2-burner'] || 0;
      return {
        ...prev,
        '2-burner': currentQty + qty
      };
    });

    // Track AddToCart pixel
    trackPixelEvent('AddToCart', {
      content_name: '2-Burner Gas Cooker',
      content_type: 'product',
      content_ids: ['2-burner'],
      num_items: qty,
      currency: 'NGN',
      value: 160000 * qty
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

  // Compute live cart figures
  const cartTotals = calculateMultiProductTotals(cart);
  const totalCartCount = cart['2-burner'] || 0;

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col selection:bg-red-600 selection:text-white">
      {/* Navigation Header with Cart Trigger & Ad Deep Links */}
      <Header
        onOrderClick={scrollToOrderForm}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdLinks={() => setIsAdLinksModalOpen(true)}
        onOpenExpressCheckout={() => handleOpenExpressCheckout()}
        cartCount={totalCartCount}
        cartTotal={cartTotals.grandTotal}
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
          onOpenExpressCheckout={(pid) => handleOpenExpressCheckout(pid || selectedProduct)}
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
          onOpenExpressCheckout={() => handleOpenExpressCheckout()}
          cartCount={totalCartCount}
          hasPlacedOrder={hasPlacedOrder}
          whatsappUrl={orderWhatsappUrl}
          isChatOpen={isChatOpen}
        />
      )}

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
        onOpenExpressCheckout={() => {
          setIsCartOpen(false);
          handleOpenExpressCheckout();
        }}
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

      {/* Ad Campaign Deep Links Generator Hub Modal */}
      <AdDeepLinksModal
        isOpen={isAdLinksModalOpen}
        onClose={() => setIsAdLinksModalOpen(false)}
      />

      {/* Express Checkout Pop-Up Form Modal (1-Minute Quick Order) */}
      <ExpressCheckoutModal
        isOpen={isExpressCheckoutOpen}
        onClose={() => setIsExpressCheckoutOpen(false)}
        cart={cart}
        onUpdateCart={handleUpdateCart}
        onOrderSuccess={handleOrderSuccess}
        initialProductId={expressInitialProduct}
        onScrollToFullForm={() => scrollToOrderForm()}
      />

      {/* Quick Order Pop-Up with Automatic 30-Second Replay Loop */}
      <QuickOrderPopup
        isOpen={isQuickOrderOpen}
        onOpen={() => setIsQuickOrderOpen(true)}
        onClose={() => setIsQuickOrderOpen(false)}
        cart={cart}
        onUpdateCart={handleUpdateCart}
        onOrderSuccess={handleOrderSuccess}
        onOpenFullExpressCheckout={() => handleOpenExpressCheckout()}
        hasPlacedOrder={hasPlacedOrder}
        isCartOpen={isCartOpen}
        isLightboxOpen={lightboxImage !== null}
      />

      {/* Order Success Confetti & Subtle Overlay Celebration Animation */}
      <OrderSuccessCelebration
        isOpen={showSuccessCelebration}
        onClose={() => setShowSuccessCelebration(false)}
        orderDetails={orderSuccessDetails}
        onScrollToSummary={() => {
          const el = document.getElementById('order-form') || document.getElementById('order-form-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      />
    </div>
  );
}
