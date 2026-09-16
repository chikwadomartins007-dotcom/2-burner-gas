import React from 'react';
import { Ruler, AlertCircle, Check, ArrowRight } from 'lucide-react';

interface DimensionsSectionProps {
  onImageClick: (url: string, title: string) => void;
  onOrderClick: () => void;
}

export const DimensionsSection: React.FC<DimensionsSectionProps> = ({ onImageClick, onOrderClick }) => {
  const dimensionImageUrl = '/images/H137f07cc70424452ada679ac752fcf43l.jpg';

  return (
    <section id="dimensions" className="py-16 md:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <span className="text-xs uppercase font-bold tracking-wider text-red-600">
            Precision Kitchen Sizing
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            DIMENSIONS & INSTALLATION GUIDE
          </h2>
          <p className="text-base text-neutral-600">
            Verify the measurements below to ensure a smooth, perfect fit in your kitchen countertop or island.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Dimension Graphic from Supplied Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-white p-3 shadow-md group">
              <div
                className="relative overflow-hidden rounded-xl cursor-pointer"
                onClick={() => onImageClick(dimensionImageUrl, 'Installation & Cutout Dimensions (750x450mm)')}
              >
                <img
                  src={dimensionImageUrl}
                  alt="Cooker Dimensions: 750mm x 450mm, Cutout: 650mm x 350mm"
                  className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold shadow-sm">
                  Tap to Zoom
                </div>
              </div>
              <div className="p-3 text-center text-xs text-neutral-600">
                Official dimension chart showing full surface span and recommended cutout footprint.
              </div>
            </div>
          </div>

          {/* Dimension Specifications & Notes */}
          <div className="lg:col-span-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-red-600 mb-1">
                  <Ruler className="w-4 h-4 text-red-600" />
                  <span>Cooker Glass Surface</span>
                </div>
                <div className="text-3xl font-extrabold text-neutral-900">
                  750 <span className="text-lg font-normal text-neutral-400">×</span> 450
                </div>
                <div className="text-xs text-neutral-500 mt-1">Length × Width (Millimeters)</div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-red-600 mb-1">
                  <Ruler className="w-4 h-4 text-red-600" />
                  <span>Countertop Cutout Hole</span>
                </div>
                <div className="text-3xl font-extrabold text-neutral-900">
                  650 <span className="text-lg font-normal text-neutral-400">×</span> 350
                </div>
                <div className="text-xs text-neutral-500 mt-1">Recommended Cutout Size (mm)</div>
              </div>
            </div>

            {/* Crucial Note from Prompt */}
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-700">
                <strong className="text-neutral-900 block mb-0.5 font-bold">Important Installation Note:</strong>
                Please check the supplied installation dimensions carefully before installation. Can also be placed securely on countertop rubber feet.
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 text-sm text-neutral-700">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>Compatible with standard Nigerian gas cylinders & hose connectors</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>Suitable for built-in countertop cutout or free-standing table use</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>Non-slip rubber feet pre-installed for sturdy table placement</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOrderClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-md shadow-red-600/20 cursor-pointer animate-order-loop"
              >
                <span>ORDER YOUR COOKER TODAY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
