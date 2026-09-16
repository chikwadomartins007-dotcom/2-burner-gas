import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface RecentSale {
  id: string;
  customer: string;
  location: string;
  product: string;
  timeAgo: string;
  image: string;
}

const RECENT_SALES: RecentSale[] = [
  {
    id: 's1',
    customer: 'Dr. Stella O.',
    location: 'Lekki Phase 1, Lagos',
    product: '2-Burner + 5-Burner Combo (Both Cookers)',
    timeAgo: '3 minutes ago',
    image: '/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg'
  },
  {
    id: 's2',
    customer: 'Alhaji Haruna M.',
    location: 'Wuse 2, Abuja',
    product: '5-Burner Gas & Electric Hybrid Cooktop',
    timeAgo: '7 minutes ago',
    image: '/images/Hd84f5f7654644224945b4ea055aa07a1Y.png'
  },
  {
    id: 's3',
    customer: 'Chief Emeka N.',
    location: 'GRA Phase 2, Port Harcourt',
    product: 'Premium 2-Burner Glass Gas Cooker',
    timeAgo: '11 minutes ago',
    image: '/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg'
  },
  {
    id: 's4',
    customer: 'Engr. Babatunde K.',
    location: 'Ikeja GRA, Lagos',
    product: '5-Burner Hybrid Cooktop with Timer',
    timeAgo: '16 minutes ago',
    image: '/images/Hd84f5f7654644224945b4ea055aa07a1Y.png'
  },
  {
    id: 's5',
    customer: 'Mrs. Cynthia A.',
    location: 'Asaba, Delta State',
    product: '2-Burner + 5-Burner Combo Pack',
    timeAgo: '21 minutes ago',
    image: '/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg'
  }
];

export const RecentSalesPopup: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Show initial popup after 4 seconds
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    // Cycle every 16 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_SALES.length);
        setIsVisible(true);
      }, 1500);
    }, 16000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed || !isVisible) return null;

  const current = RECENT_SALES[currentIndex];

  return (
    <aside aria-label="Recent buyer notification" className="fixed bottom-20 sm:bottom-6 left-4 z-40 max-w-xs sm:max-w-sm bg-white rounded-2xl p-3 shadow-2xl border border-neutral-200 flex items-center gap-3 animate-fade-in transition-all">
      <img
        src={current.image}
        alt={current.product}
        className="w-12 h-12 object-contain rounded-xl bg-neutral-50 p-1 border border-neutral-100 flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verified Order Received</span>
        </div>
        <div className="text-xs font-bold text-neutral-900 truncate">
          {current.customer} • {current.location}
        </div>
        <div className="text-[11px] text-red-600 font-semibold truncate">
          {current.product}
        </div>
        <span className="text-[10px] text-neutral-400">
          {current.timeAgo} • Pay on Delivery
        </span>
      </div>

      <button
        onClick={() => setIsDismissed(true)}
        className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md"
        aria-label="Dismiss order notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
