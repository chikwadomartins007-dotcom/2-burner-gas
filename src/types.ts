export interface ProductImage {
  id: string;
  filename: string;
  url: string;
  title: string;
  description: string;
  category: 'all' | 'cooktop' | 'burners' | 'controls' | 'lifestyle' | 'dimensions';
  aspectRatio?: string;
  badge?: string;
}

export interface PricingTier {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  label: string;
  savingsNote?: string;
  isPopular?: boolean;
}

export type ProductId = '2-burner' | '5-burner';

export interface ProductOption {
  id: ProductId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  basePrice: number;
  mainImage: string;
  dimensions: string;
  cutout: string;
  fuelType: string;
  burnerCount: string;
  features: string[];
  pricingTiers: PricingTier[];
}

export interface CartItem {
  productId: ProductId;
  quantity: number;
}

export type CartState = Record<ProductId, number>;

export interface OrderFormData {
  products: CartState;
  selected_product?: ProductId;
  quantity?: number;
  full_name: string;
  phone: string;
  alternative_phone: string;
  delivery_address: string;
  city: string;
  state: string;
  delivery_notes: string;
  confirm_cod: boolean;
}


export type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export type PolicyType = 'delivery' | 'return' | 'terms' | 'privacy' | null;
