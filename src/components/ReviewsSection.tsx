import React from 'react';
import { Star, ShieldCheck, CheckCircle, ThumbsUp } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  location: string;
  verified: boolean;
  rating: number;
  product: string;
  headline: string;
  comment: string;
  date: string;
}

const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Barrister Ifeanyi K.',
    location: 'Victoria Island, Lagos',
    verified: true,
    rating: 5,
    product: '2-Burner + 5-Burner Combo',
    headline: 'Got both models for main kitchen and service kitchen',
    comment: 'I ordered the combo for my newly renovated duplex. The dispatch team brought them to my house in VI, I inspected both boxes, confirmed everything in good condition before doing transfer. The tempered glass is thick and the flame is hot blue!',
    date: '3 days ago'
  },
  {
    id: 'r2',
    author: 'Mrs. Folashade Adeyemi',
    location: 'Ikeja, Lagos',
    verified: true,
    rating: 5,
    product: 'Premium 2-Burner Glass Gas Cooker',
    headline: 'Super neat and very easy to clean after cooking',
    comment: 'The glass finish transforms the entire kitchen. Just one wipe with moist cloth and all oil splashes are gone. Delivered in less than 24 hours to Ikeja. Highly recommended.',
    date: '5 days ago'
  },
  {
    id: 'r3',
    author: 'Engr. Mahmud Usman',
    location: 'Maitama, Abuja',
    verified: true,
    rating: 5,
    product: 'Executive 5-Burner Gas & Electric Hybrid',
    headline: 'The electric central plate saved us when gas ran out!',
    comment: 'The hybrid feature is a game changer in Nigeria. Last Sunday my gas cylinder ran dry midway through Sunday lunch, we simply switched on the electric radiant hotplate and finished cooking without delay. The digital timer is also very smart.',
    date: '1 week ago'
  },
  {
    id: 'r4',
    author: 'Dr. (Mrs) Ngozi Eze',
    location: 'GRA Phase 2, Port Harcourt',
    verified: true,
    rating: 5,
    product: 'Premium 2-Burner Glass Gas Cooker',
    headline: 'Smooth payment on delivery, very honest seller',
    comment: 'I was skeptical at first about ordering appliances online, but paying on delivery gave me complete peace of mind. The cooker arrived well padded. Good cast iron stands that don’t slip.',
    date: '2 weeks ago'
  }
];

interface ReviewsSectionProps {
  onOrderClick: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ onOrderClick }) => {
  return (
    <section id="reviews" className="py-16 md:py-24 bg-white border-b border-neutral-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>4.9 / 5.0 Rating from 340+ Verified Nigerian Buyers</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            WHAT OUR CUSTOMERS ARE SAYING
          </h2>
          <p className="text-base text-neutral-600">
            Real feedback from homeowners, builders, and chefs who upgraded to MAX LUXURY cooktops with Payment on Delivery.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Rating & Product Tag */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                    {rev.product}
                  </span>
                </div>

                <h3 className="font-bold text-neutral-900 text-base leading-snug">
                  "{rev.headline}"
                </h3>

                <p className="text-sm text-neutral-600 leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              {/* Author & Verification */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <span>{rev.author}</span>
                    {rev.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                    )}
                  </div>
                  <span className="text-neutral-500 text-[11px]">{rev.location}</span>
                </div>

                <span className="text-neutral-400 text-[11px] font-medium">
                  {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Bottom Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-red-50/60 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div>
              <div className="font-bold text-neutral-900 text-sm">
                Ready to experience the difference in your kitchen?
              </div>
              <div className="text-xs text-neutral-600">
                Place your order now with zero upfront payment. Pay only when delivered to your door.
              </div>
            </div>
          </div>

          <button
            onClick={onOrderClick}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider transition-all shadow-md shadow-red-600/20 cursor-pointer animate-order-loop whitespace-nowrap"
          >
            ORDER NOW — PAY ON DELIVERY
          </button>
        </div>
      </div>
    </section>
  );
};
