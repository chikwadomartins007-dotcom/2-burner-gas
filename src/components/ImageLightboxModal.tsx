import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { PRODUCT_IMAGES } from '../data/productData';

interface ImageLightboxModalProps {
  currentImageUrl: string | null;
  currentImageTitle?: string;
  onClose: () => void;
  onNavigate?: (url: string, title: string) => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  currentImageUrl,
  currentImageTitle,
  onClose,
  onNavigate
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    if (currentImageUrl) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentImageUrl]);

  if (!currentImageUrl) return null;

  const currentIndex = PRODUCT_IMAGES.findIndex((img) => img.url === currentImageUrl);

  const handleNext = () => {
    if (!onNavigate || currentIndex === -1) return;
    const nextIdx = (currentIndex + 1) % PRODUCT_IMAGES.length;
    onNavigate(PRODUCT_IMAGES[nextIdx].url, PRODUCT_IMAGES[nextIdx].title);
  };

  const handlePrev = () => {
    if (!onNavigate || currentIndex === -1) return;
    const prevIdx = (currentIndex - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length;
    onNavigate(PRODUCT_IMAGES[prevIdx].url, PRODUCT_IMAGES[prevIdx].title);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={currentImageTitle || 'Product Image Preview'}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in"
      onClick={onClose}
    >
      {/* Top action bar */}
      <div
        className="absolute top-4 left-4 right-4 flex items-center justify-between z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-white text-sm font-semibold max-w-md truncate">
          {currentImageTitle || 'Product Image Preview'}
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Arrows */}
      {currentIndex !== -1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white transition-colors cursor-pointer hidden sm:flex items-center justify-center z-10"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white transition-colors cursor-pointer hidden sm:flex items-center justify-center z-10"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Image View */}
      <div
        className="relative max-w-4xl max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImageUrl}
          alt={currentImageTitle || 'Product Photograph'}
          className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
        />
      </div>

      {/* Footer counter */}
      {currentIndex !== -1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-neutral-900/80 text-xs text-neutral-400 font-medium">
          {currentIndex + 1} / {PRODUCT_IMAGES.length}
        </div>
      )}
    </div>
  );
};
