import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShieldCheck, Truck } from 'lucide-react';

export const UrgencyStockBar: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(14520); // ~4 hours countdown
  const stockUnitsRemaining = 7;

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 14400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsLeft / 3600);
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
            Today's Dispatch Batch:
          </span>
          <span className="font-semibold text-neutral-800">
            Only <span className="font-extrabold text-red-600 underline">{stockUnitsRemaining} units</span> remaining for same-day packing
          </span>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-600" />
          <span className="text-neutral-700 font-medium">Promo Rate Ends In:</span>
          <div className="flex items-center gap-1 font-mono font-bold text-red-700">
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
