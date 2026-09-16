import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShieldCheck, Truck } from 'lucide-react';

interface UrgencyStockBarProps {
  onOrderClick?: () => void;
}

const FIVE_DAYS_IN_SECONDS = 5 * 24 * 60 * 60; // 432,000 seconds = 5 days

export const UrgencyStockBar: React.FC<UrgencyStockBarProps> = ({ onOrderClick }) => {
  // Store an initial deadline in localStorage so it stays consistent for the visitor across refreshes, or defaults to 5 days
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    try {
      const savedDeadline = localStorage.getItem('promo_countdown_deadline_v1');
      const now = Date.now();
      if (savedDeadline) {
        const remaining = Math.floor((parseInt(savedDeadline, 10) - now) / 1000);
        if (remaining > 0 && remaining <= FIVE_DAYS_IN_SECONDS) {
          return remaining;
        }
      }
      const newDeadline = now + FIVE_DAYS_IN_SECONDS * 1000;
      localStorage.setItem('promo_countdown_deadline_v1', newDeadline.toString());
      return FIVE_DAYS_IN_SECONDS;
    } catch {
      return FIVE_DAYS_IN_SECONDS;
    }
  });

  const stockUnitsRemaining = 7;

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : FIVE_DAYS_IN_SECONDS));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(secondsLeft / (24 * 3600));
  const hours = Math.floor((secondsLeft % (24 * 3600)) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="w-full bg-red-50 border-y border-red-200 py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Scarcity / Stock Alert */}
        <div className="flex items-center gap-2 text-neutral-900">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span className="font-bold text-red-600 uppercase tracking-wide">
            Special Promo Batch:
          </span>
          <span className="font-semibold text-neutral-800">
            Only <span className="font-extrabold text-red-600 underline">{stockUnitsRemaining} units</span> remaining for this dispatch round
          </span>
        </div>

        {/* Countdown Timer */}
        <div
          onClick={onOrderClick}
          className={`flex items-center gap-2 ${onOrderClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
        >
          <Clock className="w-4 h-4 text-red-600 animate-pulse" />
          <span className="text-neutral-700 font-medium">Promo Ends In:</span>
          <div className="flex items-center gap-1 font-mono font-bold text-red-700">
            <span className="bg-white border border-red-200 px-1.5 py-0.5 rounded shadow-xs">
              {days}d
            </span>
            <span>:</span>
            <span className="bg-white border border-red-200 px-1.5 py-0.5 rounded shadow-xs">
              {hours.toString().padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-white border border-red-200 px-1.5 py-0.5 rounded shadow-xs">
              {minutes.toString().padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="bg-white border border-red-200 px-1.5 py-0.5 rounded shadow-xs">
              {seconds.toString().padStart(2, '0')}s
            </span>
          </div>
        </div>

        {/* Guarantees */}
        <div className="hidden lg:flex items-center gap-4 text-neutral-600 font-medium">
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            Nationwide Delivery
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            100% Payment on Delivery
          </span>
        </div>
      </div>
    </div>
  );
};
