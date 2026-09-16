import React, { useState } from 'react';
import { ZoomIn, Info, CheckCircle, ShieldCheck } from 'lucide-react';

interface CookerDiagramSectionProps {
  onImageClick: (url: string, title: string) => void;
}

export const CookerDiagramSection: React.FC<CookerDiagramSectionProps> = ({ onImageClick }) => {
  const diagramUrl = '/images/11bb45a3-5549-4fdd-9bc1-7023275b3a13.png';

  const parts = [
    {
      name: 'Pan Support / Pot Stand',
      location: 'Top / Burners',
      desc: 'Heavy-duty stable support designed to hold woks, pots, and frying pans safely over the burners without slipping.'
    },
    {
      name: 'Left Burner',
      location: 'Left Surface',
      desc: 'High-efficiency multi-flame burner engineered for rapid boiling, frying, and intense high-heat cooking.'
    },
    {
      name: 'Right Burner',
      location: 'Right Surface',
      desc: 'Balanced precision burner ideal for simmering, sauces, and simultaneous dual-dish meal preparation.'
    },
    {
      name: 'Premium Glass Surface',
      location: 'Top Plate',
      desc: 'Reinforced toughened black glass designed for modern aesthetics, scratch resistance, and quick wipe cleaning.'
    },
    {
      name: 'Left & Right Control Knobs',
      location: 'Bottom Controls',
      desc: 'Independent ergonomic rotary knobs with clear MIN to MAX flame modulation for fine temperature control.'
    },
    {
      name: 'Digital Display & Battery Indicator',
      location: 'Center Console',
      desc: 'Digital display showing cook timer and battery status for effortless monitoring during cooking.'
    },
    {
      name: 'Non-Slip Feet',
      location: 'Base Corners',
      desc: 'Rubberized grip feet keep the cooker firm and stable on your countertop whether installed drop-in or tabletop.'
    },
    {
      name: 'Safety & Usage Guide',
      location: 'Side Caution Tag',
      desc: 'Safety guidelines and specifications printed directly for safe everyday operation and gas connection.'
    }
  ];

  return (
    <section id="diagram" className="py-16 md:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-red-600">
            Engineered Component Overview
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            PARTS & COMPONENT GUIDE
          </h2>
          <p className="text-base text-neutral-600">
            A closer look at how every part of the cooker is assembled for stability, safety, and everyday performance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Diagram Graphic */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-white p-3 group shadow-xl">
              <div
                className="relative overflow-hidden rounded-xl bg-neutral-100 cursor-pointer"
                onClick={() => onImageClick(diagramUrl, 'Cooker Parts & Component Guide')}
              >
                <img
                  src={diagramUrl}
                  alt="Premium 2-Burner Glass Gas Cooker Parts and Diagram"
                  className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-102"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Tap to Enlarge</span>
                </div>
              </div>
              <div className="p-2.5 text-center text-xs text-neutral-600">
                Official component layout diagram showing pan stands, dual burners, digital screen, and control knobs.
              </div>
            </div>
          </div>

          {/* Interactive Parts List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-red-600" />
              <span>Key Cooker Components</span>
            </h3>

            <div className="grid grid-cols-1 gap-2.5 max-h-[480px] overflow-y-auto pr-1">
              {parts.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white border border-neutral-200 shadow-sm hover:border-red-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-neutral-900">{p.name}</span>
                    <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded">
                      {p.location}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
