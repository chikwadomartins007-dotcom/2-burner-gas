import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturesSectionProps {
  onOrderClick: () => void;
  onImageClick: (url: string, title: string) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onOrderClick, onImageClick }) => {
  const features = [
    {
      num: 'FEATURE 01',
      title: 'TWO-BURNER COOKING',
      description: 'A practical two-burner setup for everyday meal preparation. Easily manage boiling, frying, and simmering side-by-side.',
      image: '/images/Hf3fea0e1fc4e46d4ac33b8a45f21785ex.jpg',
      alt: 'Two-Burner Cooktop Layout'
    },
    {
      num: 'FEATURE 02',
      title: 'EASY FLAME CONTROL',
      description: 'Convenient control knobs allow you to adjust the flame smoothly while cooking, complete with clear level indicators.',
      image: '/images/H6452756b08ba47fea9e256a8e5ff398eo.jpg',
      alt: 'Smart Controls & Flame Adjustment'
    },
    {
      num: 'FEATURE 03',
      title: 'SLEEK GLASS COOKTOP',
      description: 'A clean black glass surface that gives your kitchen a sleek, polished modern appearance and complements contemporary counter designs.',
      image: '/images/Hdb9c0c43cbc4438d8d77325727a4474dz.jpg',
      alt: 'Sleek Black Glass Cooktop Surface'
    },
    {
      num: 'FEATURE 04',
      title: 'DESIGNED BURNER SYSTEM',
      description: 'Multi-ring burner crown with engineered distribution flame ports and sturdy pot supports built for even heat delivery.',
      image: '/images/Hb703478da96c4d06ac439666db478fb5s.jpg',
      alt: 'Designed Burner System Close-Up'
    },
    {
      num: 'FEATURE 05',
      title: 'EASY TO WIPE CLEAN',
      description: 'The smooth tempered glass surface resists stubborn grease and oil stains, allowing you to wipe it spotless with a single stroke.',
      image: '/images/Hc8520771f71b451d96ae3caee5e55e9a5.jpg',
      alt: 'Easy to Wipe Clean Glass Surface'
    },
    {
      num: 'FEATURE 06',
      title: 'MODERN KITCHEN APPEARANCE',
      description: 'Designed to fit cleanly into countertops and island setups, giving your kitchen an elevated luxury aesthetic.',
      image: '/images/Hebaafe7677f84003942e806feac863ad1.jpg',
      alt: 'Modern Kitchen Appearance'
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs uppercase font-bold tracking-wider text-red-600">
            Crafted for Daily Utility
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            DESIGNED FOR EVERYDAY COOKING
          </h2>
          <p className="text-base text-neutral-600">
            Every component is engineered for reliability, convenient control, and effortless upkeep in your home kitchen.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-neutral-200 shadow-sm overflow-hidden hover:border-red-300 hover:shadow-lg transition-all flex flex-col group"
            >
              {/* Feature Image */}
              <div
                className="relative h-56 overflow-hidden bg-neutral-100 cursor-pointer"
                onClick={() => onImageClick(item.image, item.title)}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-red-600 text-white font-bold px-2.5 py-1 rounded-md text-[11px] shadow-sm">
                  {item.num}
                </div>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-neutral-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  View photo
                </div>
              </div>

              {/* Feature Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-neutral-900 tracking-tight group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner following features */}
        <div className="mt-14 text-center">
          <button
            onClick={onOrderClick}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-red-600 text-white font-bold text-base hover:bg-red-700 transition-all shadow-lg shadow-red-600/25 active:scale-95 cursor-pointer animate-order-loop"
          >
            <span>ORDER NOW — PAY ON DELIVERY</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
