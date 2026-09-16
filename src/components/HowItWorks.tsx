import React from 'react';
import { Layers, FileText, PhoneCall, Truck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 'STEP 1',
      title: 'CHOOSE YOUR QUANTITY',
      desc: 'Select how many units you want. Tiered bulk pricing applies automatically for 2 pieces and above.',
      icon: Layers
    },
    {
      step: 'STEP 2',
      title: 'ENTER YOUR DETAILS',
      desc: 'Fill in your name, delivery address, state, and direct phone number in our simple order form below.',
      icon: FileText
    },
    {
      step: 'STEP 3',
      title: 'WE CONFIRM YOUR ORDER',
      desc: 'Our customer support team calls or messages you to verify your delivery address and dispatch schedule.',
      icon: PhoneCall
    },
    {
      step: 'STEP 4',
      title: 'RECEIVE & PAY',
      desc: 'Your cooker arrives at your doorstep. Inspect your package and pay securely upon delivery.',
      icon: Truck
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs uppercase font-bold tracking-wider text-red-600">
            Straightforward Process
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            HOW IT WORKS
          </h2>
          <p className="text-base text-neutral-600">
            Placing your order takes less than two minutes with zero upfront payment required.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-white border border-neutral-200 p-6 flex flex-col space-y-4 hover:border-red-300 hover:shadow-lg transition-all shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-600 tracking-wider">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                    <Icon className="w-5 h-5 text-red-600" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-xs text-neutral-600 leading-relaxed flex-1">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
