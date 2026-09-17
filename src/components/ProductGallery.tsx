import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCT_IMAGES } from '../data/productData';
import { ProductImage } from '../types';
import {
  ZoomIn,
  Sparkles,
  Play,
  Pause,
  Sun,
  Flame,
  Layers,
  RotateCw,
  Info,
  CheckCircle2,
  Maximize2
} from 'lucide-react';

interface ProductGalleryProps {
  onImageClick: (url: string, title: string) => void;
}

interface ImageHotspot {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  title: string;
  detail: string;
}

const IMAGE_HOTSPOTS: Record<string, ImageHotspot[]> = {
  'hero-persp': [
    { x: 30, y: 40, title: 'Left 90° Flip Burner', detail: 'High-heat multi-ring brass core burner' },
    { x: 72, y: 38, title: 'Right Simmer Burner', detail: 'Precision flame control with pan support' },
    { x: 50, y: 78, title: 'Crystal Tempered Glass', detail: '8mm shatter-resistant high-gloss top' }
  ],
  'parts-diagram': [
    { x: 28, y: 30, title: 'Cast Iron Pot Stand', detail: 'Anti-slip heavy-duty wok & pot support' },
    { x: 52, y: 65, title: 'Digital Timer Console', detail: 'Integrated battery & countdown readout' },
    { x: 78, y: 80, title: 'Rotary Control Dial', detail: 'Smooth micro-stepping gas flow regulator' }
  ]
};

interface LiveCardProps {
  img: ProductImage;
  index: number;
  isLiveMotion: boolean;
  isShimmerActive: boolean;
  onImageClick: (url: string, title: string) => void;
}

const LiveGalleryCard: React.FC<LiveCardProps> = ({
  img,
  index,
  isLiveMotion,
  isShimmerActive,
  onImageClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ rotateX: number; rotateY: number; shineX: number; shineY: number }>({
    rotateX: 0,
    rotateY: 0,
    shineX: 50,
    shineY: 50
  });
  const [isHovered, setIsHovered] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const hotspots = IMAGE_HOTSPOTS[img.id] || [];

  // 3D Perspective Mouse Movement Parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;

    setTilt({
      rotateX: -normY * 14,
      rotateY: normX * 14,
      shineX: (x / rect.width) * 100,
      shineY: (y / rect.height) * 100
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });
    setActiveHotspot(null);
  };

  // Staggered animation duration and delay for natural breathing effect
  const duration = 10 + (index % 4) * 2;
  const delay = (index % 5) * 0.7;

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: (index % 6) * 0.05 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transformStyle: 'preserve-3d',
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out'
      }}
      className="group relative rounded-2xl overflow-hidden bg-white border-2 border-neutral-200 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/15 transition-colors cursor-pointer flex flex-col shadow-sm"
    >
      {/* Image Container with Live Motion */}
      <div
        className="relative aspect-square w-full overflow-hidden bg-neutral-950 select-none"
        onClick={() => onImageClick(img.url, img.title)}
      >
        {/* Continuous Living Motion Image */}
        <motion.div
          animate={
            isLiveMotion
              ? {
                  scale: isHovered ? 1.09 : [1, 1.06, 1.02, 1],
                  x: isHovered ? 0 : [0, 4, -4, 0],
                  y: isHovered ? 0 : [0, -3, 3, 0]
                }
              : { scale: isHovered ? 1.05 : 1, x: 0, y: 0 }
          }
          transition={
            isLiveMotion
              ? {
                  duration,
                  delay,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }
              : { duration: 0.3 }
          }
          className="w-full h-full will-change-transform origin-center"
        >
          <img
            src={img.url}
            alt={img.title}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </motion.div>

        {/* Live Glass Shimmer Light Sweep (simulating reflections on tempered glass) */}
        {isShimmerActive && (
          <div
            className="pointer-events-none absolute -inset-full w-[300%] h-[300%] animate-glass-sweep"
            style={{
              background:
                'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.45) 50%, rgba(245, 158, 11, 0.25) 55%, transparent 65%)',
              animationDelay: `${(index % 4) * 1.2}s`
            }}
          />
        )}

        {/* Dynamic Specular Hover Light based on cursor position */}
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle 180px at ${tilt.shineX}% ${tilt.shineY}%, rgba(255, 255, 255, 0.55), rgba(245, 158, 11, 0.15) 45%, transparent 70%)`
            }}
          />
        )}

        {/* Optional Feature Badge */}
        {img.badge && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="bg-red-600 text-white px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm border border-red-500">
              {img.badge}
            </span>
          </div>
        )}

        {/* Interactive Feature Hotspots (if available for this image) */}
        {hotspots.map((spot, spotIdx) => (
          <div
            key={spotIdx}
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            onClick={(e) => {
              e.stopPropagation();
              setActiveHotspot(activeHotspot === spotIdx ? null : spotIdx);
            }}
          >
            <button
              type="button"
              className="relative flex items-center justify-center w-6 h-6 rounded-full bg-neutral-950/90 border border-amber-400 text-amber-300 shadow-lg cursor-pointer hover:scale-125 transition-transform"
              title={spot.title}
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
              <Flame className="w-3 h-3 text-amber-400 relative z-10" />
            </button>

            {/* Hotspot Floating Tooltip */}
            <AnimatePresence>
              {activeHotspot === spotIdx && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-8 w-44 p-2.5 rounded-xl bg-neutral-950 text-white border border-amber-500 shadow-2xl z-30 pointer-events-auto"
                >
                  <div className="text-[11px] font-black text-amber-300 leading-tight">
                    {spot.title}
                  </div>
                  <div className="text-[10px] text-neutral-300 mt-1 leading-snug">
                    {spot.detail}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Hover Fullscreen Overlay */}
        <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-15 backdrop-blur-[1px]">
          <div className="bg-neutral-900/95 border border-amber-500/60 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-200">Tap to Zoom Fullscreen</span>
          </div>
        </div>

      </div>

      {/* Caption Information */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h3 className="font-bold text-sm text-neutral-900 group-hover:text-red-600 transition-colors flex items-center justify-between gap-2">
            <span>{img.title}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </h3>
          <p className="text-xs text-neutral-600 mt-1.5 line-clamp-2 leading-relaxed">
            {img.description}
          </p>
        </div>

        {/* Bottom Interactive Spec Footnote */}
        <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified Authentic
          </span>
          <span className="text-[10px] text-amber-600 font-bold hover:underline">
            Inspect View →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export const ProductGallery: React.FC<ProductGalleryProps> = ({ onImageClick }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLiveMotion, setIsLiveMotion] = useState<boolean>(true);
  const [isShimmerActive, setIsShimmerActive] = useState<boolean>(true);

  const categories = [
    { id: 'all', label: 'All Photos (14)' },
    { id: 'cooktop', label: 'Cooktop & Top Views' },
    { id: 'burners', label: 'Burners & Mechanics' },
    { id: 'controls', label: 'Smart Controls' },
    { id: 'lifestyle', label: 'Kitchen Placement' },
    { id: 'dimensions', label: 'Dimensions & Specs' }
  ];

  const filteredImages =
    activeCategory === 'all'
      ? PRODUCT_IMAGES
      : PRODUCT_IMAGES.filter((img) => img.category === activeCategory);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-neutral-50/50 border-b border-neutral-200 relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-600 text-neutral-950 border border-amber-600 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-neutral-950" />
            <span>LIVE ANIMATED PRODUCT SHOWCASE</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            AUTHENTIC PRODUCT GALLERY
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed">
            Every photo below is animated in live motion with real tempered glass reflections, Ken Burns micro-panning, and interactive 3D perspective. Tap any image to examine full resolution.
          </p>
        </div>

        {/* Live Interactive Control Console */}
        <div className="max-w-3xl mx-auto mb-8 bg-white border-2 border-amber-500/30 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  isLiveMotion ? 'bg-amber-400' : 'bg-neutral-300'
                } opacity-75`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isLiveMotion ? 'bg-amber-500' : 'bg-neutral-400'
                }`}
              />
            </span>
            <span className="text-xs font-extrabold text-neutral-900">
              Live Motion Engine:
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                isLiveMotion
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {isLiveMotion ? 'Active (60 FPS)' : 'Paused'}
            </span>
          </div>

          {/* Action Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Live Play / Pause Button */}
            <button
              type="button"
              onClick={() => setIsLiveMotion(!isLiveMotion)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                isLiveMotion
                  ? 'bg-neutral-950 text-amber-300 hover:bg-neutral-800 border border-amber-400/50'
                  : 'bg-amber-500 text-neutral-950 hover:bg-amber-400 border border-amber-600'
              }`}
            >
              {isLiveMotion ? (
                <>
                  <Pause className="w-3 h-3 text-amber-400" />
                  <span>Pause Motion</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-neutral-950 fill-neutral-950" />
                  <span>Play Motion</span>
                </>
              )}
            </button>

            {/* Glass Shimmer Reflection Toggle */}
            <button
              type="button"
              onClick={() => setIsShimmerActive(!isShimmerActive)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isShimmerActive
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <Sun className="w-3 h-3 text-amber-500" />
              <span>{isShimmerActive ? 'Glass Shimmer ON' : 'Glass Shimmer OFF'}</span>
            </button>
          </div>
        </div>

        {/* Category Filters with Dark Yellow & Red Styling */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-neutral-950 text-amber-300 border-2 border-amber-500 shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-white text-neutral-700 hover:text-amber-900 hover:bg-amber-50/70 border border-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Live Animated Image Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, index) => (
              <LiveGalleryCard
                key={img.id}
                img={img}
                index={index}
                isLiveMotion={isLiveMotion}
                isShimmerActive={isShimmerActive}
                onImageClick={onImageClick}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Informative Guidance Banner */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-neutral-600 bg-white border border-neutral-200 rounded-full px-4 py-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Hover or move your mouse over any cooker image to experience live 3D perspective tilt.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
