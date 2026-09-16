import React from 'react';
import { Flame, Sparkles, Sliders, Brush, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';

interface WhyYouWillLoveItProps {
  onOrderClick: () => void;
}

export const WhyYouWillLoveIt: React.FC<WhyYouWillLoveItProps> = ({ onOrderClick }) => {
  const benefits = [
    {
      title: 'Two burners for everyday cooking',
      description: 'Prepare breakfast, lunch, and dinner efficiently with two full-sized burners working simultaneously.',
      icon: Flame,
      color: 'text-amber-400'
    },
    {
      title: 'Sleek modern appearance',
      description: 'Deep glossy black glass surface provides a sophisticated focal point for your kitchen space.',
      icon: Sparkles,
      color: 'text-purple-400'
    },
    {
      title: 'Convenient flame adjustment',
      description: 'Smooth-turning dial knobs give you quick and accurate flame regulation for all cooking styles.',
      icon: Sliders,
      color: 'text-blue-400'
    },
    {
      title: 'Easy-to-clean cooking surface',
      description: 'Tempered glass wipes clean with water and mild cleaner. No stubborn dirt traps or rust.',
      icon: Brush,
      color: 'text-emerald-400'
    },
    {
      title: 'Practical kitchen setup',
      description: 'Compact 750×450mm profile fits countertops seamlessly either built-in or freestanding with rubber feet.',
      icon: CheckCircle,
      color: 'text-teal-400'
    },
    {
      title: 'Payment on delivery',
      description: 'Zero upfront risk. Place your order now and complete payment only when the cooker reaches your hands.',
      icon: ShieldCheck,
      color: 'text-emerald-400'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs uppercase font-bold tracking-wider text-red-600">
            Real Kitchen Advantages
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            WHY YOU'LL LOVE YOUR NEW COOKER
          </h2>
          <p className="text-base text-neutral-600">
            Designed to bring convenience, speed, and elevated style into your daily home cooking routine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-red-300 hover:shadow-lg transition-all flex flex-col space-y-4 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
                  {b.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onOrderClick}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-md shadow-red-600/20 cursor-pointer animate-order-loop"
          >
            <span>CLAIM YOUR COOKER TODAY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
