import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Truck,
  Sparkles,
  RefreshCw,
  Minus
} from 'lucide-react';
import { PHONE_NUMBER, CALL_LINK } from '../data/productData';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface GeminiChatBotProps {
  onOrderClick?: () => void;
  onOpenChange?: (isOpen: boolean) => void;
}

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  role: 'assistant',
  content:
    "Hello! 👋 Welcome to Max Luxury Bathrooms.\n\nI'm your AI shopping assistant, and I'm here to help you with product questions, pricing, delivery information, and placing your order.\n\nWhat would you like help with today?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

const SUGGESTED_QUESTIONS = [
  'How do I place an order?',
  'What are the prices?',
  'How does Payment on Delivery work?',
  'Do you deliver to my state?'
];

export const GeminiChatBot: React.FC<GeminiChatBotProps> = ({ onOrderClick, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setIsMinimized(false);
      setUnreadCount(0);
    }
    onOpenChange?.(open);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send conversation history to our secure backend Gemini route
      const historyForApi = messages
        .filter((m) => m.id !== 'welcome-1')
        .map((m) => ({
          role: m.role,
          content: m.content
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: historyForApi,
          userMessage: text
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to connect to AI assistant');
      }

      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I'm here to help! For direct phone support, you can also reach Max Luxury Bathrooms at 08147778029.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content:
          "I apologize, I'm having a brief connection delay. Please feel free to call or WhatsApp Max Luxury Bathrooms directly on 08147778029, or scroll down to the order form on the page to submit your details with Payment on Delivery!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetConversation = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          id="open-gemini-chat-btn"
          onClick={() => handleToggleOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-3 sm:right-4 z-40 flex items-center gap-2 sm:gap-2.5 bg-neutral-900 hover:bg-neutral-800 text-white pl-3 sm:pl-3.5 pr-3.5 sm:pr-4 py-2 sm:py-3 rounded-full shadow-2xl transition-all duration-300 group cursor-pointer hover:scale-105 active:scale-95 border border-neutral-700"
          aria-label="Open Max Luxury Bathrooms AI Customer Support"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-red-500/30 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-emerald-500 rounded-full border-2 border-neutral-900" />
          </div>
          <div className="text-left flex flex-col">
            <span className="text-[11px] sm:text-xs font-bold leading-tight flex items-center gap-1 sm:gap-1.5">
              <span>Chat Support</span>
              <span className="text-[9px] sm:text-[10px] font-medium bg-red-600/30 text-red-300 px-1 py-0.2 rounded border border-red-500/30">
                AI
              </span>
            </span>
            <span className="text-[9px] sm:text-[10px] text-neutral-400 font-normal">
              08147778029
            </span>
          </div>
          {unreadCount > 0 && (
            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-600 text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window Dialog */}
      {isOpen && (
        <div
          id="gemini-chat-modal"
          className={`fixed z-50 transition-all duration-200 ${
            isMinimized
              ? 'bottom-20 md:bottom-6 right-3 sm:right-6 w-64 sm:w-72 bg-neutral-900 text-white rounded-2xl shadow-2xl border border-neutral-800 p-3 flex items-center justify-between cursor-pointer'
              : 'bottom-0 sm:bottom-6 right-0 sm:right-6 w-full sm:w-[410px] h-[85vh] sm:h-[550px] max-h-[100dvh] sm:max-h-[85vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-fade-in'
          }`}
        >
          {/* Header */}
          <div className="bg-neutral-900 text-white px-4 py-3 flex items-center justify-between border-b border-neutral-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                  Max Luxury Bathrooms
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Online" />
                </h3>
                <p className="text-[10px] text-neutral-400">
                  AI Customer Support • 08147778029
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                id="reset-chat-btn"
                onClick={handleResetConversation}
                title="Reset conversation"
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                id="minimize-chat-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                id="close-chat-btn"
                onClick={() => handleToggleOpen(false)}
                title="Close chat"
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Call & Trust Strip */}
              <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-200 text-[11px] flex items-center justify-between text-neutral-600">
                <span className="flex items-center gap-1 font-medium text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Payment On Delivery
                </span>
                <a
                  href={CALL_LINK}
                  className="flex items-center gap-1 font-bold text-red-600 hover:text-red-700"
                >
                  <Phone className="w-3 h-3 text-red-600" />
                  Call: {PHONE_NUMBER}
                </a>
              </div>

              {/* Chat Thread Messages */}
              <div
                id="gemini-chat-messages-container"
                className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-neutral-50/50 text-xs text-neutral-800"
              >
                {messages.map((m) => {
                  const isUser = m.role === 'user';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs whitespace-pre-line ${
                          isUser
                            ? 'bg-neutral-900 text-white rounded-tr-xs'
                            : 'bg-white text-neutral-900 border border-neutral-200 rounded-tl-xs'
                        }`}
                      >
                        {m.content}
                      </div>
                      <span className="text-[9px] text-neutral-400 mt-1 px-1">
                        {m.timestamp}
                      </span>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-2 text-neutral-500 text-xs p-2 bg-white rounded-xl border border-neutral-200 w-fit">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] text-neutral-500 ml-1">Assistant is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Quick Questions */}
              {messages.length <= 2 && (
                <div className="px-3 py-2 bg-white border-t border-neutral-100 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(q)}
                      className="whitespace-nowrap bg-neutral-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-neutral-700 px-2.5 py-1 rounded-full border border-neutral-200 transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Action Banner to Jump directly to Order Form */}
              {onOrderClick && (
                <div className="px-3 py-1.5 bg-red-50 border-t border-red-100 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-700 font-medium">Ready to buy right now?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOrderClick();
                    }}
                    className="font-bold text-red-600 hover:text-red-700 underline flex items-center gap-1 cursor-pointer"
                  >
                    Go to Order Form →
                  </button>
                </div>
              )}

              {/* Input Bar */}
              <div className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  id="gemini-chat-input"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about products, delivery, or orders..."
                  disabled={isLoading}
                  className="flex-1 bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  id="gemini-chat-send-btn"
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  aria-label="Send message"
                  className="p-2.5 bg-red-600 hover:bg-red-500 disabled:bg-neutral-300 text-white rounded-xl transition-all shadow-xs disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
