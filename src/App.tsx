import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
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
import { ReviewsSection } from './components/ReviewsSection';
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
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { PolicyModals } from './components/PolicyModals';
import { PolicyType, ProductId, CartState } from './types';
import {
  trackPixelEvent,
  PRODUCT_NAME,
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
  const [hasPlacedOrder, setHasPlacedOrder] = useState<boolean>(false);
  const [orderWhatsappUrl, setOrderWhatsappUrl] = useState<string>('');

  const [resetOrderSignal, setResetOrderSignal] = useState<number>(0);

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

  // Initialize PageView and ViewContent tracking on mount
  useEffect(() => {
    trackPixelEvent('PageView');
    trackPixelEvent('ViewContent', {
      content_name: PRODUCT_NAME,
      value: 170000,
      currency: 'NGN'
    });
  }, []);

  const scrollToOrderForm = (modelPreference?: ProductId) => {
    if (modelPreference) {
      setSelectedProduct(modelPreference);
    }
    // If an order was already placed, unlock the form so customer can place a new order
    if (hasPlacedOrder) {
      handleResetOrder();
      setResetOrderSignal((prev) => prev + 1);
    }
    const element =
      document.getElementById('order-form') ||
      document.getElementById('order-form-section') ||
      document.querySelector('form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const firstInput = element.querySelector('input[name="fullName"], input') as HTMLInputElement;
        if (firstInput && document.activeElement !== firstInput) {
          firstInput.focus({ preventScroll: true });
        }
      }, 450);
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

  // Compute live cart figures
  const cartTotals = calculateMultiProductTotals(cart);
  const totalCartCount = (cart['2-burner'] || 0) + (cart['5-burner'] || 0);

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col selection:bg-red-600 selection:text-white">
      {/* Navigation Header with Cart Trigger */}
      <Header
        onOrderClick={scrollToOrderForm}
        onOpenCart={() => setIsCartOpen(true)}
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

        {/* Alternative Product Showcase: 5-Burner Gas & Electric Hybrid */}
        <AlternativeProductSection
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

        {/* Customer Reviews & Testimonials Section (Imitating live user feedback) */}
        <ReviewsSection onOrderClick={scrollToOrderForm} />

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
      />

      {/* Mobile Sticky Bottom CTA Bar with Cart Trigger (Shows WhatsApp only after order) */}
      {!isCartOpen && (
        <MobileStickyCTA
          onOrderClick={scrollToOrderForm}
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={totalCartCount}
          hasPlacedOrder={hasPlacedOrder}
          whatsappUrl={orderWhatsappUrl}
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

      {/* Live Social Proof Recent Sales Popup (from moonlightluxuryhometech.shop) */}
      <RecentSalesPopup onOrderClick={scrollToOrderForm} />

      {/* Floating WhatsApp Chat Button (Only visible after order is placed) */}
      <FloatingWhatsApp
        hasPlacedOrder={hasPlacedOrder}
        whatsappUrl={orderWhatsappUrl}
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
    </div>
  );
}
