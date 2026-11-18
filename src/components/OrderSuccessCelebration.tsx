import React, { useEffect, useRef, useState, useCallback } from 'react';
import { OrderSuccessDetails } from '../types';
import {
  CheckCircle2,
  Sparkles,
  X,
  MessageSquare,
  ShieldCheck,
  Truck,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Banknote
} from 'lucide-react';
import { formatNaira } from '../data/productData';

interface OrderSuccessCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: OrderSuccessDetails | null;
  onScrollToSummary?: () => void;
}

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angleSpeed: number;
  tilt: number;
  tiltSpeed: number;
  size: number;
  color: string;
  shape: 'rect' | 'circle' | 'star';
  opacity: number;
  decay: number;
}

const PALETTE = [
  '#10B981', // Emerald green
  '#059669', // Deep emerald
  '#F59E0B', // Bright amber gold
  '#FBBF24', // Warm gold
  '#EF4444', // Red
  '#DC2626', // Deep red
  '#06B6D4', // Cyan ribbon
  '#8B5CF6', // Purple royal
  '#FFFFFF', // White highlight
  '#FDE047'  // Yellow shimmer
];

// Play a gentle synthetic celebratory chime via Web Audio API
function playCelebrationChime(muted: boolean) {
  if (muted || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Notes: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz) - joyful arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.5);
    });
  } catch {
    // Gracefully ignore audio errors (e.g. autoplay permissions)
  }
}

export function OrderSuccessCelebration({
  isOpen,
  onClose,
  orderDetails,
  onScrollToSummary
}: OrderSuccessCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<ConfettiPiece[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPausedTimer, setIsPausedTimer] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(10); // 10-second auto-close countdown

  // Spawns burst of celebratory confetti particles
  const spawnConfetti = useCallback((burstCount = 140) => {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const newParticles: ConfettiPiece[] = [];

    // Left cannon
    for (let i = 0; i < burstCount * 0.45; i++) {
      const angle = (-Math.PI / 4) + (Math.random() * 0.5 - 0.25); // Shooting up and to the right
      const speed = 14 + Math.random() * 18;
      newParticles.push({
        x: Math.random() * 80,
        y: height * 0.75 + Math.random() * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.2,
        tilt: Math.random() * 10,
        tiltSpeed: 0.08 + Math.random() * 0.1,
        size: 7 + Math.random() * 7,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        shape: Math.random() > 0.4 ? 'rect' : Math.random() > 0.5 ? 'star' : 'circle',
        opacity: 1,
        decay: 0.003 + Math.random() * 0.004
      });
    }

    // Right cannon
    for (let i = 0; i < burstCount * 0.45; i++) {
      const angle = (-3 * Math.PI / 4) + (Math.random() * 0.5 - 0.25); // Shooting up and to the left
      const speed = 14 + Math.random() * 18;
      newParticles.push({
        x: width - Math.random() * 80,
        y: height * 0.75 + Math.random() * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.2,
        tilt: Math.random() * 10,
        tiltSpeed: 0.08 + Math.random() * 0.1,
        size: 7 + Math.random() * 7,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        shape: Math.random() > 0.4 ? 'rect' : Math.random() > 0.5 ? 'star' : 'circle',
        opacity: 1,
        decay: 0.003 + Math.random() * 0.004
      });
    }

    // Center fountain burst
    for (let i = 0; i < burstCount * 0.3; i++) {
      const angle = (-Math.PI / 2) + (Math.random() * 1.2 - 0.6);
      const speed = 12 + Math.random() * 16;
      newParticles.push({
        x: width / 2 + (Math.random() * 120 - 60),
        y: height * 0.55,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.25,
        tilt: Math.random() * 10,
        tiltSpeed: 0.08 + Math.random() * 0.1,
        size: 6 + Math.random() * 6,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        shape: Math.random() > 0.5 ? 'star' : 'rect',
        opacity: 1,
        decay: 0.003 + Math.random() * 0.004
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
  }, []);

  // Initialize confetti canvas and animation
  useEffect(() => {
    if (!isOpen) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      particlesRef.current = [];
      return;
    }

    // Play pleasant synthetic chime
    playCelebrationChime(isMuted);

    // Initial burst
    spawnConfetti(160);

    // Staggered secondary burst for continuous celebration
    const secondBurstTimer = setTimeout(() => {
      spawnConfetti(90);
    }, 600);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const gravity = 0.35;
    const drag = 0.985;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const remaining: ConfettiPiece[] = [];

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];

        p.vx *= drag;
        p.vy = p.vy * drag + gravity;
        p.x += p.vx + Math.sin(p.angle) * 0.6;
        p.y += p.vy;
        p.angle += p.angleSpeed;
        p.tilt += p.tiltSpeed;
        p.opacity -= p.decay;

        if (p.opacity > 0 && p.y < canvas.height + 60 && p.x > -50 && p.x < canvas.width + 50) {
          remaining.push(p);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.scale(1, Math.cos(p.tilt));
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === 'star') {
            // Draw 4-point star sparkle
            ctx.beginPath();
            const r = p.size * 0.9;
            ctx.moveTo(0, -r);
            ctx.quadraticCurveTo(0, 0, r, 0);
            ctx.quadraticCurveTo(0, 0, 0, r);
            ctx.quadraticCurveTo(0, 0, -r, 0);
            ctx.quadraticCurveTo(0, 0, 0, -r);
            ctx.closePath();
            ctx.fill();
          } else {
            // Rectangular ribbon
            ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 1.5);
          }

          ctx.restore();
        }
      }

      particlesRef.current = remaining;

      if (remaining.length > 0 || isOpen) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      clearTimeout(secondBurstTimer);
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, spawnConfetti, isMuted]);

  // Auto-dismiss countdown timer (pauses when hovered)
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(10);
      return;
    }

    if (isPausedTimer) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isPausedTimer, onClose]);

  // Keyboard escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const orderId = orderDetails?.orderId || `ORD-${Date.now().toString().slice(-6)}`;
  const customerName = orderDetails?.fullName || 'Valued Customer';
  const productName = orderDetails?.productName || 'Flip-Up Luxury Gas Cooktop';
  const totalAmount = orderDetails?.total ? formatNaira(orderDetails.total) : '₦150,000';
  const deliveryLocation = orderDetails?.city && orderDetails?.state
    ? `${orderDetails.city}, ${orderDetails.state}`
    : orderDetails?.state || 'Nationwide Delivery';

  const handleCopyOrderId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleWhatsAppAction = () => {
    if (orderDetails?.whatsappUrl) {
      window.open(orderDetails.whatsappUrl, '_blank', 'noopener,noreferrer');
    }
    onClose();
  };

  const handleSummaryAction = () => {
    onClose();
    if (onScrollToSummary) {
      onScrollToSummary();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-success-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      {/* Confetti Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[110]"
        style={{ width: '100vw', height: '100vh' }}
      />

      {/* Subtle Backdrop Overlay with Blur & Vignette */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Celebratory Dialog Card */}
      <div
        onMouseEnter={() => setIsPausedTimer(true)}
        onMouseLeave={() => setIsPausedTimer(false)}
        className="relative z-[120] w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden transform transition-all duration-300 animate-celebration-in my-auto"
      >
        {/* Ambient Top Glow Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 sm:p-6 text-center overflow-hidden">
          {/* Decorative Sparkles & Shimmer Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_70%)] pointer-events-none" />

          {/* Top Control Bar: Mute Audio, Replay Confetti, Close */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-10">
            <button
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (!nextMuted) playCelebrationChime(false);
              }}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white/90 transition-colors cursor-pointer"
              aria-label="Toggle chime sound"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => {
                spawnConfetti(120);
                playCelebrationChime(isMuted);
              }}
              title="Pop more confetti!"
              className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold px-2.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Confetti</span>
            </button>

            <button
              onClick={onClose}
              title="Close notification"
              className="p-1.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Animated Celebration Icon & Badge */}
          <div className="relative inline-flex items-center justify-center mb-3">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white text-emerald-600 shadow-xl flex items-center justify-center ring-4 ring-white/30 animate-bounce-short">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600 stroke-[2.5]" />
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-xs font-black flex items-center justify-center shadow-md animate-pulse">
              ★
            </span>
          </div>

          {/* Celebration Header Text */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-1.5 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Order Placed Successfully</span>
          </div>

          <h2 id="order-success-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Congratulations, {customerName}!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-50 mt-1 max-w-sm mx-auto leading-snug">
            Your kitchen order has been verified and queued for immediate dispatch.
          </p>
        </div>

        {/* Card Body & Details */}
        <div className="p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {/* Order Summary Receipt Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs sm:text-sm">
              <span className="text-slate-500 font-medium">Order Reference:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  #{orderId}
                </span>
                <button
                  onClick={handleCopyOrderId}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                  title="Copy Order ID"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start justify-between text-xs sm:text-sm gap-2">
              <span className="text-slate-500 font-medium shrink-0">Product:</span>
              <span className="font-bold text-slate-900 text-right">
                {productName}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500 font-medium">Destination:</span>
              <span className="font-semibold text-slate-800 text-right">
                {deliveryLocation}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Total Payable:</span>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5" /> Pay on Delivery
                </span>
              </div>
              <span className="text-lg sm:text-xl font-black text-red-600 font-mono">
                {totalAmount}
              </span>
            </div>
          </div>

          {/* Three Key Reassurances */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5">
              <Truck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-emerald-950 leading-tight">Free Shipping</div>
              <div className="text-[10px] text-emerald-700">1 - 3 Days</div>
            </div>
            <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-2.5">
              <Banknote className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-amber-950 leading-tight">No Advance Fee</div>
              <div className="text-[10px] text-amber-700">Pay on Arrival</div>
            </div>
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-blue-950 leading-tight">2-Yr Warranty</div>
              <div className="text-[10px] text-blue-700">100% Genuine</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-1">
            {orderDetails?.whatsappUrl && (
              <button
                onClick={handleWhatsAppAction}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-98 cursor-pointer group"
              >
                <MessageSquare className="w-4 h-4 text-emerald-200 fill-emerald-200 group-hover:scale-110 transition-transform" />
                <span>Fast-Track Delivery on WhatsApp</span>
              </button>
            )}

            <button
              onClick={handleSummaryAction}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>View Order Details on Page</span>
            </button>
          </div>
        </div>

        {/* Footer Auto-Dismiss Progress Indicator */}
        <div className="bg-slate-100 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>
              {isPausedTimer ? 'Auto-close paused (hovering)' : `Auto-closing in ${timeLeft}s`}
            </span>
          </div>

          <button
            onClick={() => {
              spawnConfetti(120);
              playCelebrationChime(isMuted);
            }}
            className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay Confetti</span>
          </button>
        </div>
      </div>
    </div>
  );
}
