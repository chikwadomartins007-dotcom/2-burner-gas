import React, { useState } from 'react';
import { PRODUCT_IMAGES } from '../data/productData';
import { ZoomIn, Eye, Sparkles } from 'lucide-react';

interface ProductGalleryProps {
  onImageClick: (url: string, title: string) => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ onImageClick }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Images (14)' },
    { id: 'cooktop', label: 'Cooktop & Views' },
    { id: 'burners', label: 'Burners & Engineering' },
    { id: 'controls', label: 'Smart Controls' },
    { id: 'lifestyle', label: 'Kitchen Lifestyle' },
    { id: 'dimensions', label: 'Dimensions' }
  ];

  const filteredImages = activeCategory === 'all'
    ? PRODUCT_IMAGES
    : PRODUCT_IMAGES.filter(img => img.category === activeCategory);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <span className="text-xs uppercase font-bold tracking-wider text-red-600">
            Real Product Photography
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            AUTHENTIC PRODUCT GALLERY
          </h2>
          <p className="text-base text-neutral-600">
            Explore every angle, close-up, and engineering detail of the actual double-burner gas cooker. Tap any photo to view full size.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                  : 'bg-neutral-100 text-neutral-700 hover:text-red-600 hover:bg-red-50 border border-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              onClick={() => onImageClick(img.url, img.title)}
              className="group relative rounded-2xl overflow-hidden bg-white border border-neutral-200 hover:border-red-400 hover:shadow-lg transition-all cursor-pointer flex flex-col shadow-sm"
            >
              {/* Image Box */}
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Badge */}
                {img.badge && (
                  <div className="absolute top-2.5 left-2.5 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">
                    {img.badge}
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-neutral-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white text-neutral-900 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <ZoomIn className="w-3.5 h-3.5 text-red-600" />
                    <span>View Fullscreen</span>
                  </div>
                </div>
              </div>

              {/* Title & Caption */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 group-hover:text-red-600 transition-colors">
                    {img.title}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                    {img.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
