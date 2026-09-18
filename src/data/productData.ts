import { FAQItem, PricingTier, ProductImage, ProductId, ProductOption } from '../types';
export type { ProductId, ProductOption };

export const BRAND_NAME = 'MAX LUXURY BATHROOMS';
export const OFFICIAL_WEBSITE = 'https://www.maxluxurybathrooms.shop/';
export const OFFICIAL_WEBSITE_MIRROR = 'https://www.maxluxurybathrooms.online/';
export const PRODUCT_NAME = 'Premium 2-Burner Glass Gas Cooker';
export const PRODUCT_NAME_2B = 'Premium 2-Burner Glass Gas Cooker';
export const PRODUCT_NAME_5B = 'Executive 5-Burner Gas & Electric Hybrid Cooktop (With Timer & Auto-Off)';
export const PHONE_NUMBER = '08147778029';
export const PHONE_NUMBER_INTL = '+2348147778029';
export const CALL_LINK = 'tel:08147778029';
export const WHATSAPP_LINK = 'https://wa.me/2348147778029?text=Hello%20MAX%20LUXURY%20BATHROOMS%2C%20I%20am%20interested%20in%20your%20cookers.';
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqpkvnkj';
export const META_PIXEL_ID = '1730802201545460';
export const META_PIXEL_ID_2 = '2580381385456107';
export const META_PIXEL_IDS = ['1730802201545460', '2580381385456107'];

export const PRICING_TIERS_2B: PricingTier[] = [
  {
    quantity: 1,
    unitPrice: 170000,
    totalPrice: 170000,
    label: '1 PIECE',
    savingsNote: 'Standard Single Unit'
  },
  {
    quantity: 2,
    unitPrice: 165000,
    totalPrice: 330000,
    label: '2 PIECES',
    savingsNote: 'Save ₦10,000 total (₦165,000 each)',
    isPopular: true
  },
  {
    quantity: 3,
    unitPrice: 160000,
    totalPrice: 480000,
    label: '3 PIECES',
    savingsNote: 'Save ₦30,000 total (₦160,000 each)'
  },
  {
    quantity: 4,
    unitPrice: 150000,
    totalPrice: 600000,
    label: '4 PIECES & ABOVE',
    savingsNote: 'Best Value: ₦150,000 each (Save ₦20,000/unit)'
  }
];

export const PRICING_TIERS_5B: PricingTier[] = [
  {
    quantity: 1,
    unitPrice: 280000,
    totalPrice: 280000,
    label: '1 PIECE',
    savingsNote: 'Standard Single Unit (Gas + Electric)'
  },
  {
    quantity: 2,
    unitPrice: 275000,
    totalPrice: 550000,
    label: '2 PIECES',
    savingsNote: 'Save ₦10,000 total (₦275,000 each)',
    isPopular: true
  },
  {
    quantity: 3,
    unitPrice: 270000,
    totalPrice: 810000,
    label: '3 PIECES',
    savingsNote: 'Save ₦30,000 total (₦270,000 each)'
  },
  {
    quantity: 4,
    unitPrice: 265000,
    totalPrice: 1060000,
    label: '4 PIECES & ABOVE',
    savingsNote: 'Best Value: ₦265,000 each (Save ₦15,000/unit)'
  }
];

export const PRODUCT_OPTIONS: Record<ProductId, ProductOption> = {
  '2-burner': {
    id: '2-burner',
    name: 'Premium 2-Burner Glass Gas Cooker',
    shortName: '2-Burner Glass Cooker',
    tagline: 'Compact, Elegant & Dual-Use (Desktop or Built-In)',
    description: 'Double gas burner with toughened black tempered glass, battery impulse ignition, and heavy-duty trivets. Perfect for standard family kitchens and space-efficient modern countertops.',
    basePrice: 170000,
    mainImage: '/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg',
    dimensions: '750 × 450 mm',
    cutout: '630 × 350 mm',
    fuelType: 'LPG Gas (Battery Ignition)',
    burnerCount: '2 High-Efficiency Gas Burners',
    features: [
      'Desktop & Built-in dual installation flexibility (with rubber feet)',
      'High-grade black tempered shatter-resistant glass',
      'High-velocity blue flame for fast, soot-free cooking',
      'Electronic impulse ignition with smooth rotary dials',
      'Durable non-slip cast iron pan supports'
    ],
    pricingTiers: PRICING_TIERS_2B
  },
  '5-burner': {
    id: '5-burner',
    name: 'Executive 5-Burner Gas & Electric Hybrid Cooktop (With Timer & Auto-Off)',
    shortName: '5-Burner Gas + Electric Hybrid',
    tagline: 'Dual-Fuel Hybrid: 4 Gas Burners + 1 Central Radiant Ceramic Hotplate',
    description: 'Executive 900×510mm hybrid cooktop featuring 4 heavy-duty flip-up hinged gas burners, 1 central radiant ceramic electric plate, digital countdown touch timer with auto power cutoff, and 1-touch automatic safety key.',
    basePrice: 280000,
    mainImage: '/images/Hd84f5f7654644224945b4ea055aa07a1Y.png',
    dimensions: '900 × 510 mm',
    cutout: '870 × 480 mm',
    fuelType: 'Dual-Fuel: Gas + Electric (Never Stuck)',
    burnerCount: '4 Gas Burners + 1 Radiant Ceramic Zone',
    features: [
      'Dual-Fuel capability: Switch between gas and electric whenever cylinder finishes',
      'Digital touch countdown timer (1 to 99 min) with auto power cutoff',
      'Master 1-touch Automatic-Off emergency safety key & toddler lock',
      'Innovative flip-up hinged burners for 10-second 1-wipe cleaning',
      'Executive 900×510mm flush built-in seamless fitment'
    ],
    pricingTiers: PRICING_TIERS_5B
  }
};

export function getUnitPrice(quantity: number, productId: ProductId = '2-burner'): number {
  if (productId === '5-burner') {
    if (quantity === 1) return 280000;
    if (quantity === 2) return 275000;
    if (quantity === 3) return 270000;
    return 265000;
  }
  if (quantity === 1) return 170000;
  if (quantity === 2) return 165000;
  if (quantity === 3) return 160000;
  return 150000;
}

export function getTotalPrice(quantity: number, productId: ProductId = '2-burner'): number {
  return quantity * getUnitPrice(quantity, productId);
}

export interface MultiProductCalculation {
  price2B: number;
  qty2B: number;
  total2B: number;
  price5B: number;
  qty5B: number;
  total5B: number;
  comboDiscount: number;
  totalUnits: number;
  grandTotal: number;
}

export function calculateMultiProductTotals(cart: Record<ProductId, number>): MultiProductCalculation {
  const qty2B = Math.max(0, cart['2-burner'] || 0);
  const qty5B = Math.max(0, cart['5-burner'] || 0);

  const price2B = qty2B > 0 ? getUnitPrice(qty2B, '2-burner') : 0;
  const total2B = qty2B * price2B;

  const price5B = qty5B > 0 ? getUnitPrice(qty5B, '5-burner') : 0;
  const total5B = qty5B * price5B;

  // If ordering BOTH products (combo), give an additional ₦20,000 combo bonus discount!
  const comboDiscount = qty2B > 0 && qty5B > 0 ? 20000 : 0;

  const totalUnits = qty2B + qty5B;
  const grandTotal = Math.max(0, total2B + total5B - comboDiscount);

  return {
    price2B,
    qty2B,
    total2B,
    price5B,
    qty5B,
    total5B,
    comboDiscount,
    totalUnits,
    grandTotal
  };
}

export function formatNaira(amount: number): string {

  return '₦' + amount.toLocaleString('en-NG');
}

export const PRICING_TIERS = PRICING_TIERS_2B;

export const NIGERIAN_STATES = [
  'Lagos',
  'Abuja (FCT)',
  'Rivers',
  'Oyo',
  'Kano',
  'Ogun',
  'Delta',
  'Anambra',
  'Edo',
  'Enugu',
  'Kaduna',
  'Abia',
  'Akwa Ibom',
  'Adamawa',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Ebonyi',
  'Ekiti',
  'Gombe',
  'Imo',
  'Jigawa',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Nasarawa',
  'Niger',
  'Ondo',
  'Osun',
  'Plateau',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara'
];

export const PRODUCT_IMAGES: ProductImage[] = [
  {
    id: 'hero-persp',
    filename: 'He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg',
    url: '/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg',
    title: 'Double-Burner Cooker Overview',
    description: 'Clean perspective view highlighting the black glass cooktop, dual burners with foldable pan supports, digital display, and rotary knobs.',
    category: 'cooktop',
    badge: 'Overview'
  },
  {
    id: 'parts-diagram',
    filename: '11bb45a3-5549-4fdd-9bc1-7023275b3a13.png',
    url: '/images/11bb45a3-5549-4fdd-9bc1-7023275b3a13.png',
    title: 'Complete Component Guide',
    description: 'Pan Support / Pot Stand, Left Burner, Right Burner, Premium Glass Surface, Control Knobs, Digital Display, Non-Slip Feet, and Safety Guide.',
    category: 'cooktop',
    badge: 'Components'
  },
  {
    id: 'cooktop-front',
    filename: 'Hf3fea0e1fc4e46d4ac33b8a45f21785ex.jpg',
    url: '/images/Hf3fea0e1fc4e46d4ac33b8a45f21785ex.jpg',
    title: 'Frontal Glass Cooktop View',
    description: 'Sleek black reflective surface with symmetrical dual burner placement and intuitive center controls.',
    category: 'cooktop',
    badge: 'Design'
  },
  {
    id: 'smart-controls',
    filename: 'H6452756b08ba47fea9e256a8e5ff398eo.jpg',
    url: '/images/H6452756b08ba47fea9e256a8e5ff398eo.jpg',
    title: 'Smart Control Interface',
    description: 'Precise power levels with digital display, battery level monitor, and brushed metallic control knobs.',
    category: 'controls',
    badge: 'Controls'
  },
  {
    id: 'display-detail',
    filename: 'Hf2133c8b4c394a919ba6426a8448fce4z.jpg',
    url: '/images/Hf2133c8b4c394a919ba6426a8448fce4z.jpg',
    title: 'Digital Display & Rotary Knobs',
    description: 'Close-up of the center digital timer panel, battery indicator, and MIN/MAX flame indicators.',
    category: 'controls',
    badge: 'Display'
  },
  {
    id: 'cleaning-demo',
    filename: 'Hc8520771f71b451d96ae3caee5e55e9a5.jpg',
    url: '/images/Hc8520771f71b451d96ae3caee5e55e9a5.jpg',
    title: 'Effortless Cleaning Surface',
    description: 'Smooth glass surface allows quick, single-wipe cleaning to keep your kitchen spotless after cooking.',
    category: 'lifestyle',
    badge: 'Easy Clean'
  },
  {
    id: 'burner-cap-distribution',
    filename: 'Hb703478da96c4d06ac439666db478fb5s.jpg',
    url: '/images/Hb703478da96c4d06ac439666db478fb5s.jpg',
    title: 'Burner Cap & Heat Distribution',
    description: 'Engineered circular multi-ring burner cap geometry designed for uniform heat distribution across cookware.',
    category: 'burners',
    badge: 'Heat Distribution'
  },
  {
    id: 'right-burner-detail',
    filename: 'Hb9c8e9ca38f44abbbdb7f174825a70a1y.jpg',
    url: '/images/Hb9c8e9ca38f44abbbdb7f174825a70a1y.jpg',
    title: 'Multi-Jet Burner Crown',
    description: 'Close-up of the right burner crown featuring 8 flame ports and solid pot support stand.',
    category: 'burners',
    badge: 'Burner Head'
  },
  {
    id: 'left-burner-detail',
    filename: 'H8787481c4acb4f6090aac0b922281e25m.jpg',
    url: '/images/H8787481c4acb4f6090aac0b922281e25m.jpg',
    title: 'Left Burner & Ignition Probe',
    description: 'Detailed view of the left burner assembly, pot support, and integrated ignition needle.',
    category: 'burners',
    badge: 'Burner Detail'
  },
  {
    id: 'precision-engineering',
    filename: 'Hccaf409c308a41e4a507c495dab8ffb6u.jpg',
    url: '/images/Hccaf409c308a41e4a507c495dab8ffb6u.jpg',
    title: 'Precision Engineering & Brass Nozzles',
    description: 'Solid brass nozzles and optimized airflow chamber built for reliable, instant ignition.',
    category: 'burners',
    badge: 'Engineering'
  },
  {
    id: 'kitchen-marble-lifestyle',
    filename: 'Hebaafe7677f84003942e806feac863ad1.jpg',
    url: '/images/Hebaafe7677f84003942e806feac863ad1.jpg',
    title: 'Modern Kitchen Countertop Setup',
    description: 'Sleek low-profile cooker installed on luxury marble countertop, blending seamlessly into modern kitchens.',
    category: 'lifestyle',
    badge: 'Modern Kitchen'
  },
  {
    id: 'chef-lifestyle',
    filename: 'H133eb5b944574834be14201900e73e0bZ.jpg',
    url: '/images/H133eb5b944574834be14201900e73e0bZ.jpg',
    title: 'Wok & Everyday Cookware Support',
    description: 'Stable pot supports accommodate heavy woks, pots, and frying pans for convenient daily cooking.',
    category: 'lifestyle',
    badge: 'Cookware'
  },
  {
    id: 'top-down-view',
    filename: 'Hdb9c0c43cbc4438d8d77325727a4474dz.jpg',
    url: '/images/Hdb9c0c43cbc4438d8d77325727a4474dz.jpg',
    title: 'Top-Down Layout View',
    description: 'Balanced symmetrical layout showing burner spacing, center digital display, and safety caution badge.',
    category: 'cooktop',
    badge: 'Top View'
  },
  {
    id: 'install-dimensions',
    filename: 'H137f07cc70424452ada679ac752fcf43l.jpg',
    url: '/images/H137f07cc70424452ada679ac752fcf43l.jpg',
    title: 'Dimensions & Installation Size',
    description: 'Product Dimensions: 750mm × 450mm. Recommended Cutout Size: 650mm × 350mm.',
    category: 'dimensions',
    badge: 'Dimensions'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'WHAT ARE THE PRICES FOR EACH MODEL?',
    answer: 'For the 2-Burner Glass Cooker: 1 piece is ₦170,000; 2 pieces are ₦165,000 each (₦330,000); 3 pieces are ₦160,000 each (₦480,000); 4+ pieces are ₦150,000 each. For the Executive 5-Burner Gas + Electric Hybrid Cooktop: 1 piece is ₦280,000; 2 pieces are ₦275,000 each (₦550,000); 3 pieces are ₦270,000 each (₦810,000); 4+ pieces are ₦265,000 each.'
  },
  {
    id: 'faq-2',
    question: 'DO YOU OFFER PAYMENT ON DELIVERY?',
    answer: 'Yes. Payment on delivery is available for all models nationwide across Nigeria. You do not need to make any upfront online payment to place your order.'
  },
  {
    id: 'faq-alternative',
    question: 'WHAT IS THE DIFFERENCE BETWEEN THE 2-BURNER AND 5-BURNER HYBRID MODELS?',
    answer: 'The 2-Burner model (750×450mm, ₦170,000) features two high-efficiency gas burners and supports both tabletop rubber feet and built-in countertop cutout. The 5-Burner Executive model (900×510mm, ₦280,000) is a built-in hybrid cooktop featuring 4 flip-up hinged gas burners PLUS 1 central radiant ceramic electric hotplate, digital touch countdown timer (1-99 mins) with automatic shutoff, and a one-touch automatic off safety key.'
  },
  {
    id: 'faq-3',
    question: 'HOW DO I PLACE AN ORDER?',
    answer: 'Select your preferred product model and quantity, enter your delivery details on the order form below and submit. Our team will contact you to confirm your order and delivery details.'
  },
  {
    id: 'faq-4',
    question: 'CAN I ORDER MULTIPLE UNITS OR COMBINE MODELS?',
    answer: 'Yes. The page automatically calculates the applicable bulk price when you select multiple units. You can also combine both 2-burner and 5-burner models in your shopping cart or select our Combo package on the order form below.'
  },
  {
    id: 'faq-5',
    question: 'WHAT ARE THE DIMENSIONS OF BOTH COOKERS?',
    answer: 'The 2-Burner cooker measures 750mm × 450mm (Cutout: 630-650mm × 350mm). The 5-Burner Hybrid cooktop measures 900mm × 510mm (Cutout: 870mm × 480mm). Please check your kitchen countertop dimensions carefully.'
  },
  {
    id: 'faq-6',
    question: 'HOW DO I CLEAN THE COOKER?',
    answer: 'Use a soft microfiber cleaning cloth with warm water and mild detergent on the tempered glass. On the 5-burner model, you can also tilt the hinged burners upward for effortless 1-wipe cleaning of any spills.'
  },
  {
    id: 'faq-7',
    question: 'HOW CAN I CONTACT MAX LUXURY BATHROOMS?',
    answer: 'You can call our official customer care line directly on 08147778029.'
  }
];

// Multi-Platform Pixel & Conversions API Tracking Helper (Meta + TikTok + GTM)
// Sends client-side pixel events and mirrors them to server-side APIs with shared eventID for deduplication
export function trackPixelEvent(
  eventName: string,
  data?: Record<string, unknown>,
  options?: {
    eventId?: string;
    user?: {
      email?: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
      city?: string;
      state?: string;
      country?: string;
    };
  }
) {
  // Generate consistent eventId for deduplication between browser pixel and server API
  const generatedEventId = options?.eventId || (data?.order_id as string) || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);

  // 1. Browser Meta Pixel Dispatch
  if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
    try {
      const pixelParams = data ? { ...data } : {};
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', eventName, pixelParams, {
        eventID: generatedEventId
      });
    } catch {
      // Ignore tracking errors in sandboxed environments
    }
  }

  // 2. Browser TikTok Pixel Dispatch (Pixel ID: DAMG8E3C77UF5LAHFVF0)
  if (typeof window !== 'undefined' && (window as unknown as { ttq?: { page: () => void; track: (...args: unknown[]) => void; identify: (params: Record<string, unknown>) => void } }).ttq) {
    try {
      const ttq = (window as unknown as { ttq: { page: () => void; track: (...args: unknown[]) => void; identify: (params: Record<string, unknown>) => void } }).ttq;

      // Identify user if contact information is available
      if (options?.user?.phone || options?.user?.email) {
        ttq.identify({
          phone_number: options.user.phone,
          email: options.user.email
        });
      }

      const eventOpts = { event_id: generatedEventId };
      const val = typeof data?.value === 'number' ? data.value : 0;
      const curr = (data?.currency as string) || 'NGN';
      const cName = (data?.content_name as string) || 'Premium Gas Cooker';
      const cId = ((data?.content_ids as string[])?.[0]) || (data?.order_id as string) || 'cooker';

      if (eventName === 'PageView') {
        ttq.page();
      } else if (eventName === 'ViewContent') {
        ttq.track('ViewContent', {
          content_id: cId,
          content_type: 'product',
          content_name: cName,
          value: val,
          currency: curr
        }, eventOpts);
      } else if (eventName === 'AddToCart') {
        ttq.track('AddToCart', {
          content_id: cId,
          content_type: 'product',
          content_name: cName,
          quantity: (data?.num_items as number) || 1,
          value: val,
          currency: curr
        }, eventOpts);
      } else if (eventName === 'Lead') {
        ttq.track('SubmitForm', {
          content_name: cName,
          value: val,
          currency: curr
        }, eventOpts);
      } else if (eventName === 'Purchase') {
        ttq.track('CompletePayment', {
          content_id: cId,
          content_type: 'product',
          content_name: cName,
          quantity: (data?.num_items as number) || 1,
          value: val,
          currency: curr
        }, eventOpts);
        ttq.track('PlaceAnOrder', {
          content_id: cId,
          content_type: 'product',
          content_name: cName,
          value: val,
          currency: curr
        }, eventOpts);
      }
    } catch {
      // Ignore TikTok tracking errors in sandboxed/offline environments
    }
  }

  // 3. Server-Side Conversions & Events API Dispatch (Meta CAPI + TikTok Events API)
  if (typeof window !== 'undefined') {
    try {
      // Extract browser cookies if present (_fbp, _fbc, _ttp, ttclid)
      let fbp: string | undefined;
      let fbc: string | undefined;
      let ttp: string | undefined;
      let ttclid: string | undefined;

      if (document.cookie) {
        const cookies = document.cookie.split('; ');
        for (const c of cookies) {
          if (c.startsWith('_fbp=')) fbp = c.substring(5);
          if (c.startsWith('_fbc=')) fbc = c.substring(5);
          if (c.startsWith('_ttp=')) ttp = c.substring(5);
          if (c.startsWith('ttclid=')) ttclid = c.substring(7);
        }
      }

      // Meta Conversions API
      fetch('/api/meta-conversions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          eventName,
          eventId: generatedEventId,
          eventSourceUrl: window.location.href,
          user: {
            ...options?.user,
            fbp,
            fbc
          },
          customData: data
        })
      }).catch(() => {});

      // TikTok Events API
      fetch('/api/tiktok-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          eventName,
          eventId: generatedEventId,
          eventSourceUrl: window.location.href,
          user: {
            ...options?.user,
            ttp,
            ttclid
          },
          customData: data
        })
      }).catch(() => {});
    } catch {
      // Silent error fallback
    }
  }

  return generatedEventId;
}
