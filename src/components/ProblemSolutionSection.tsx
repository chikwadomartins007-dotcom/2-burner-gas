import React from 'react';
import { Flame, Sparkles, CheckCircle2, SlidersHorizontal, Layers, ShieldCheck } from 'lucide-react';

export const ProblemSolutionSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs uppercase font-bold tracking-wider text-red-600">
            A Better Cooking Experience
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            COOKING SHOULD BE SIMPLE, CONVENIENT AND LOOK GOOD IN YOUR KITCHEN
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed">
            Many traditional kitchen stoves are cumbersome to clean, hard to control, or make a modern kitchen look outdated. Our cooker is designed to solve these everyday frustrations with balanced functionality and clean aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col space-y-4 hover:border-red-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
              Practical Two-Burner Everyday Setup
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Cook your main dish and side soup or boil water simultaneously without feeling cramped. The two burners provide the optimal balance for everyday family meals.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col space-y-4 hover:border-red-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
              Convenient Flame & Heat Control
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Ergonomic rotary knobs with clear MIN and MAX indicators give you smooth, continuous flame regulation from a gentle simmer up to high heat.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col space-y-4 hover:border-red-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
              Effortless Wipe-Down Glass Cooktop
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Spills and splatters wipe clean in seconds with a damp microfiber cloth. No hard-to-reach crevices or rusted metal plates to scrub.
            </p>
          </div>
        </div>

        {/* Additional Comparison / Real Kitchen Fit */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border-2 border-amber-500/40 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-600 text-neutral-950 shadow-sm border border-amber-400">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-950" />
                Zero Risk Ordering Guarantee
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold text-white">
                Inspect before you make payment on delivery
              </h4>
              <p className="text-sm text-neutral-300">
                You do not need to risk online card payments. Our nationwide dispatch team delivers directly to your doorstep across Nigeria so you can inspect your cooker physically and pay cash or transfer upon delivery.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-800/90 border border-amber-500/40">
                <div className="text-3xl font-black text-amber-400">2 Zones</div>
                <div className="text-xs text-neutral-300 mt-1 font-medium">90° Flip-Up Burners</div>
              </div>
              <div className="p-4 rounded-xl bg-neutral-800/90 border border-amber-500/40">
                <div className="text-3xl font-black text-amber-400">75 × 45 cm</div>
                <div className="text-xs text-neutral-300 mt-1 font-medium">Crystal Tempered Glass</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
