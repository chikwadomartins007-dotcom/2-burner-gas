import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCT_IMAGES } from '../data/productData';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Camera,
  CheckCircle2,
  Flame
} from 'lucide-react';

interface ProductGalleryProps {
  onImageClick: (url: string, title: string) => void;
}

const IMAGE_FEATURE_TAGS: Record<string, string[]> = {
  'hero-persp': ['90° Flip Burner', '8mm Tempered Glass', 'Digital Timer'],
  'parts-diagram': ['Heavy Cast Iron Stand', 'Smart Control Dial', 'Non-Slip Feet'],
  'smart-controls': ['Digital Countdown', 'Battery Level Monitor', 'Rotary Igniter'],
  'cleaning-demo': ['10-Second Wipe', 'Zero Dismantling', 'Spill-Proof Well'],
  'flip-mechanism': ['Industrial Hinge', '180° Easy Access', 'Solid Brass Core']
};

export const ProductGallery: React.FC<ProductGalleryProps> = ({ onImageClick }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'cooktop', label: 'Cooktop Views' },
    { id: 'burners', label: 'Flip-Up Burners' },
    { id: 'controls', label: 'Smart Controls' },
    { id: 'lifestyle', label: 'In The Kitchen' },
    { id: 'dimensions', label: 'Specs & Dimensions' }
  ];

  const filteredImages =
    activeCategory === 'all'
      ? PRODUCT_IMAGES
      : PRODUCT_IMAGES.filter((img) => img.category === activeCategory);

  // Reset current index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const total = filteredImages.length;
  const currentImage = filteredImages[currentIndex] || filteredImages[0];

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  // Keep active thumbnail in view purely within the thumbnail container (NEVER scrolls the page)
  useEffect(() => {
    const container = thumbnailContainerRef.current;
    if (!container) return;
    const activeThumb = container.children[currentIndex] as HTMLElement | undefined;
    if (activeThumb) {
      const scrollTarget = activeThumb.offsetLeft - (container.clientWidth - activeThumb.clientWidth) / 2;
      container.scrollTo({
        left: Math.max(0, scrollTarget),
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.28, ease: 'easeOut' }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeIn' }
    })
  };

  const activeFeatures = IMAGE_FEATURE_TAGS[currentImage.id] || [];

  return (
    <section
      id="gallery"
      className="py-10 md:py-16 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 scroll-mt-16 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center space-y-1.5 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-neutral-950 shadow-xs uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>Product Photo Gallery</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            AUTHENTIC PRODUCT GALLERY
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto">
            Click arrows or tap any thumbnail below to browse photos. Titles and specs are displayed directly on each image.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap mb-5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-amber-300 shadow-md scale-105'
                    : 'bg-white text-neutral-600 hover:bg-amber-50 hover:text-neutral-900 border border-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Main Slideshow Player Card with Native Touch & Free Scroll */}
        <div
          className="relative bg-neutral-950 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-2 border-neutral-800 select-none touch-pan-y"
          style={{ touchAction: 'pan-y' }}
        >
          {/* Main Slide Stage */}
          <div
            className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[540px] w-full flex items-center justify-center cursor-pointer overflow-hidden bg-neutral-950 touch-pan-y"
            onClick={() => onImageClick(currentImage.url, currentImage.title)}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentImage.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex flex-col justify-between"
              >
                {/* Image Presentation */}
                <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5 pb-28 sm:pb-32">
                  <img
                    src={currentImage.url}
                    alt={currentImage.title}
                    className="max-h-full max-w-full object-contain drop-shadow-2xl rounded-lg"
                    loading="eager"
                  />
                </div>

                {/* Top Badge inside sliding container */}
                <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2">
                    {currentImage.badge && (
                      <span className="bg-red-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                        {currentImage.badge}
                      </span>
                    )}
                    <span className="bg-neutral-900/85 backdrop-blur-md text-amber-300 border border-neutral-700 text-[11px] sm:text-xs font-extrabold px-2.5 py-1 rounded-md shadow-md">
                      {currentIndex + 1} / {total}
                    </span>
                  </div>
                </div>

                {/* ON-IMAGE TEXT OVERLAY — Slides synchronously with the image */}
                <div className="relative z-10 p-4 sm:p-6 bg-gradient-to-t from-neutral-950 via-neutral-950/85 to-transparent pt-12 sm:pt-16 pointer-events-none">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Verified Authentic Unit
                      </span>

                      {activeFeatures.map((feat, idx) => (
                        <span
                          key={idx}
                          className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 rounded"
                        >
                          <Flame className="w-2.5 h-2.5 text-amber-400" />
                          {feat}
                        </span>
                      ))}
                    </div>

                    {/* Image Title */}
                    <h3 className="font-display font-extrabold text-base sm:text-xl md:text-2xl text-white tracking-tight leading-snug drop-shadow-md">
                      {currentImage.title}
                    </h3>

                    {/* Image Description */}
                    <p className="text-xs sm:text-sm text-neutral-200 mt-1 line-clamp-2 leading-relaxed drop-shadow-sm font-medium">
                      {currentImage.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Static Overlay Controls */}
            {/* Top Right: Tap to Zoom Fullscreen */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageClick(currentImage.url, currentImage.title);
                }}
                className="bg-neutral-900/85 hover:bg-neutral-800 text-white backdrop-blur-md border border-neutral-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                title="Zoom Fullscreen"
              >
                <Maximize2 className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Tap to Zoom</span>
              </button>
            </div>

            {/* Previous Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="Previous Slide"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-900/85 hover:bg-neutral-900 text-white border border-neutral-700 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-xl hover:border-amber-400"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next Slide"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-900/85 hover:bg-neutral-900 text-white border border-neutral-700 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-xl hover:border-amber-400"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Quick Slide Footer Indicator */}
          <div className="bg-neutral-900/90 border-t border-neutral-800 px-4 py-2.5 text-white flex items-center justify-between text-xs">
            <span className="text-neutral-400 text-[11px]">
              Tap arrows or thumbnails below to switch photos • Never interrupts your scroll
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={goToPrev}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold border border-neutral-700 cursor-pointer"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-bold border border-neutral-700 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Preview Strip */}
        <div
          ref={thumbnailContainerRef}
          className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent snap-x"
        >
          {filteredImages.map((img, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`relative shrink-0 w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden bg-neutral-900 border-2 transition-all cursor-pointer snap-center ${
                  isSelected
                    ? 'border-amber-400 scale-105 shadow-md ring-2 ring-amber-400/40 opacity-100'
                    : 'border-neutral-200 opacity-60 hover:opacity-100 hover:border-neutral-400'
                }`}
                title={img.title}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-amber-400/10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
