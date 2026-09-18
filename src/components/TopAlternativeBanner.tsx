import React from 'react';
import { ArrowRight } from 'lucide-react';

interface TopAlternativeBannerProps {
  onNavigateToAlternative: () => void;
}

export const TopAlternativeBanner: React.FC<TopAlternativeBannerProps> = ({
  onNavigateToAlternative
}) => {
  const renderButton = (key: string | number) => (
    <button
      key={key}
      type="button"
      onClick={onNavigateToAlternative}
      className="cursor-pointer group flex items-center gap-2 sm:gap-2.5 pl-1.5 pr-3.5 py-1 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-xs shadow-md border border-red-500 transition-all hover:scale-105 active:scale-95 shrink-0 select-none"
      title="Click to view the 5-Burner Gas & Electric Hybrid Cooktop"
    >
      {/* Tiny Image of the Alternative Product */}
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white p-0.5 border-2 border-amber-300 shrink-0 overflow-hidden flex items-center justify-center shadow-xs">
        <img
          src="/images/Hd84f5f7654644224945b4ea055aa07a1Y.png"
          alt="5-Burner Hybrid Cooktop Alternative"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>

      {/* Live Indicator Dot */}
      <span className="flex h-2 w-2 relative shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300" />
      </span>

      {/* Text Label */}
      <span className="tracking-wide flex items-center gap-1">
        <strong className="text-amber-200 uppercase font-black mr-0.5">Alternative Product:</strong>
        <span className="text-white font-bold">5-Burner Gas & Electric Hybrid Cooktop</span>
      </span>

      {/* Action Pill */}
      <span className="bg-white text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs group-hover:bg-amber-300 group-hover:text-neutral-950 transition-colors shrink-0">
        <span>View Model</span>
        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );

  return (
    <div
      className="w-full bg-white border-b border-slate-200 relative overflow-hidden h-12 select-none shadow-xs z-30 flex items-center"
      aria-label="Alternative Product Shortcut Banner"
    >
      {/* Left & Right Soft White Edge Fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10" />

      {/* Continuously moving track in ONE direction */}
      <div className="animate-one-direction flex items-center gap-12 sm:gap-20">
        {/* Set A */}
        <div className="flex items-center gap-12 sm:gap-20 shrink-0">
          {renderButton('btn-1')}
          {renderButton('btn-2')}
        </div>

        {/* Set B (Exact duplicate for seamless infinite one-direction loop) */}
        <div className="flex items-center gap-12 sm:gap-20 shrink-0">
          {renderButton('btn-3')}
          {renderButton('btn-4')}
        </div>
      </div>
    </div>
  );
};
