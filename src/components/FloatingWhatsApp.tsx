import React from 'react';
import { MessageSquare } from 'lucide-react';
import { WHATSAPP_LINK } from '../data/productData';

interface FloatingWhatsAppProps {
  hasPlacedOrder?: boolean;
  whatsappUrl?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  hasPlacedOrder = false,
  whatsappUrl
}) => {
  // CRITICAL REQUIREMENT: WhatsApp is hidden from view until the user has placed an order
  if (!hasPlacedOrder) return null;

  return (
    <a
      href={whatsappUrl || WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-4 z-40 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white pl-3.5 pr-4 py-3 rounded-full shadow-2xl transition-all duration-300 group cursor-pointer hover:scale-105 active:scale-95 animate-fade-in"
      aria-label="Confirm order dispatch on WhatsApp"
      title="Confirm your order dispatch on WhatsApp"
    >
      <div className="relative">
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-300 rounded-full border-2 border-white animate-ping" />
      </div>
      <span className="text-xs font-bold tracking-wide">
        Confirm on WhatsApp
      </span>
    </a>
  );
};
