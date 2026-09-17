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
  Minus,
  ShoppingCart,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { PHONE_NUMBER, CALL_LINK, BRAND_NAME, OFFICIAL_WEBSITE } from '../data/productData';
import { ProductId } from '../types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  action?: {
    type: 'order_now';
    modelPreference?: ProductId;
    label?: string;
  };
}

interface GeminiChatBotProps {
  onOrderClick?: (modelPreference?: ProductId) => void;
  onOpenChange?: (isOpen: boolean) => void;
}

// Regex to detect explicit or implicit ordering intent in messages
const ORDER_INTENT_PATTERN =
  /\b(order|buy|purchase|checkout|pay\s+on\s+delivery|how\s+to\s+get|i\s+want\s+to\s+buy|i\s+need\s+one|i\s+need\s+2|place\s+an\s+order|ordering|book\s+one|send\s+me|deliver\s+to|i\s+want\s+the|immediate\s+order)\b/i;

function parseBotMessage(
  rawText: string,
  userPromptText: string
): { cleanContent: string; action?: { type: 'order_now'; modelPreference?: ProductId; label?: string } } {
  let text = rawText;
  let action: { type: 'order_now'; modelPreference?: ProductId; label?: string } | undefined = undefined;

  // Check for explicit action tags sent by AI
  const actionTagMatch = text.match(/\[ACTION:ORDER_NOW(?::(2-burner|5-burner))?\]/i);
  if (actionTagMatch) {
    const pref = actionTagMatch[1] ? (actionTagMatch[1].toLowerCase() as ProductId) : undefined;
    action = {
      type: 'order_now',
      modelPreference: pref,
      label: pref === '5-burner'
        ? 'ORDER 5-BURNER NOW — FILL DELIVERY FORM'
        : pref === '2-burner'
        ? 'ORDER 2-BURNER NOW — FILL DELIVERY FORM'
        : 'ORDER NOW — CHOOSE MODEL & FILL FORM'
    };
    text = text.replace(/\[ACTION:ORDER_NOW(?::(2-burner|5-burner))?\]/gi, '').trim();
  } else {
    // If the customer asked for immediate order or how to order, or the AI discussed placing an order
    const hasOrderIntent =
      ORDER_INTENT_PATTERN.test(userPromptText) ||
      ORDER_INTENT_PATTERN.test(rawText) ||
      /\b(fill\s+(the\s+)?form|submit\s+(your\s+)?order|confirm\s+&?\s*submit|dispatch\s+agent\s+will\s+call)\b/i.test(
        rawText
      );

    if (hasOrderIntent) {
      const mentions5B = /\b(5-burner|five-burner|hybrid)\b/i.test(userPromptText) || /\b(5-burner|five-burner)\b/i.test(rawText);
      const mentions2B = /\b(2-burner|two-burner|glass\s+cooker)\b/i.test(userPromptText) || /\b(2-burner|two-burner)\b/i.test(rawText);

      let pref: ProductId | undefined = undefined;
      if (mentions5B && !mentions2B) {
        pref = '5-burner';
      } else if (mentions2B && !mentions5B) {
        pref = '2-burner';
      }

      action = {
        type: 'order_now',
        modelPreference: pref,
        label: pref === '5-burner'
          ? 'ORDER 5-BURNER NOW — FILL DELIVERY FORM'
          : pref === '2-burner'
          ? 'ORDER 2-BURNER NOW — FILL DELIVERY FORM'
          : 'ORDER NOW — CHOOSE MODEL & FILL FORM'
      };
    }
  }

  return { cleanContent: text, action };
}

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  role: 'assistant',
  content:
    "Hello! Welcome to Max Luxury Bathrooms. 👋\n\nI'm your official 24/7 AI Customer Support Agent. I'm here to help you with:\n• Cooker features, specifications & dimensions\n• Verified pricing & multi-unit discounts\n• 100% Payment on Delivery terms & nationwide dispatch\n• Step-by-step help completing your order\n\nHow may I assist you today?",
  action: {
    type: 'order_now',
    label: 'ORDER NOW — CHOOSE MODEL & FILL FORM'
  },
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

      const rawReply =
        data.reply ||
        "I'm here to help! For direct phone support, you can also reach Max Luxury Bathrooms at 08147778029.";
      const { cleanContent, action } = parseBotMessage(rawReply, text);

      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: cleanContent,
        action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      console.error('Chat error:', err);
      const fallbackText =
        "I apologize, I'm having a brief connection delay. Please feel free to call or WhatsApp Max Luxury Bathrooms directly on 08147778029, or click the button below to proceed directly to the order form with 100% Payment on Delivery!";
      const fallbackMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content: fallbackText,
        action: {
          type: 'order_now',
          label: 'ORDER NOW — CHOOSE MODEL & FILL FORM'
        },
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
                        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs whitespace-pre-line ${
                          isUser
                            ? 'bg-neutral-900 text-white rounded-tr-xs'
                            : 'bg-white text-neutral-900 border border-neutral-200 rounded-tl-xs'
                        }`}
                      >
                        <div>{m.content}</div>

                        {/* Interactive Order Action Button attached directly to message */}
                        {!isUser && m.action && (
                          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex flex-col gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setIsOpen(false);
                                onOrderClick?.(m.action?.modelPreference);
                              }}
                              className="w-full group/btn relative overflow-hidden flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs shadow-md shadow-red-600/25 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <div className="flex items-center gap-1.5 text-left">
                                <ShoppingCart className="w-3.5 h-3.5 shrink-0 text-white animate-pulse" />
                                <span className="leading-tight">
                                  {m.action.label || 'ORDER NOW — CHOOSE MODEL & FILL FORM'}
                                </span>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover/btn:translate-x-0.5 transition-transform" />
                            </button>

                            <div className="flex items-center justify-between text-[10px] text-neutral-500 px-1">
                              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                100% Pay on Delivery
                              </span>
                              <span>Choose model & quantity</span>
                            </div>
                          </div>
                        )}
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
