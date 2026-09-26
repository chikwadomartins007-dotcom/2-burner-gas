import React, { useState, useEffect } from 'react';
import {
  X,
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  Target,
  Sparkles,
  Flame,
  Droplets,
  Layers,
  ShoppingBag,
  Eye,
  Smartphone,
  Share2,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Download,
  Image as ImageIcon,
  Grid,
  HelpCircle,
  Play
} from 'lucide-react';
import { formatNaira } from '../data/productData';
import { ProductId } from '../types';

interface AdDeepLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestLink?: (url: string) => void;
}

export const AdDeepLinksModal: React.FC<AdDeepLinksModalProps> = ({
  isOpen,
  onClose,
  onTestLink
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'presets' | 'facebook-catalog' | 'builder'>('presets');

  // Custom Builder State
  const [selectedProduct, setSelectedProduct] = useState<string>('2-burner');
  const [selectedAction, setSelectedAction] = useState<string>('order');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('meta_ad');
  const [campaignName, setCampaignName] = useState<string>('cooker_campaign');
  const [customDiscount, setCustomDiscount] = useState<string>('');

  // Get current site base origin
  const [baseOrigin, setBaseOrigin] = useState<string>('');
  const [effectiveDomain, setEffectiveDomain] = useState<string>('https://www.maxluxurybathrooms.shop');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin + window.location.pathname;
      setBaseOrigin(origin);
      if (!origin.includes('localhost') && !origin.includes('run.app')) {
        setEffectiveDomain(window.location.origin);
      }
    }
  }, []);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Catalog items for Facebook Collection & Advantage+ Carousel Ads
  const catalogProducts = [
    {
      id: '2-burner',
      title: 'Premium 2-Burner Flip-Up Glass Cooker (Single Unit)',
      subtitle: '90° Hinged Easy-Clean Burners + Timer',
      price: 170000,
      priceFormatted: '₦170,000',
      imageRelative: '/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg',
      imageUrl: `${effectiveDomain}/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg`,
      overrideLink: `${baseOrigin}?product=2-burner&action=order&utm_source=facebook&utm_medium=catalog&utm_campaign=single_unit#order-form`,
      showcaseLink: `${baseOrigin}?action=order#order-form`,
      category: 'Kitchen Cooktops',
      tag: 'Best Seller'
    },
    {
      id: '2-burner-double',
      title: '2-Burner Flip-Up Cooker (Double Pack — 2 Units)',
      subtitle: 'Buy 2 Units and Save ₦10,000 Volume Discount',
      price: 330000,
      priceFormatted: '₦330,000',
      imageRelative: '/images/fbfd6389-c43d-4c31-b684-ce444db8f36c.png',
      imageUrl: `${effectiveDomain}/images/fbfd6389-c43d-4c31-b684-ce444db8f36c.png`,
      overrideLink: `${baseOrigin}?qty=2&action=order&utm_source=facebook&utm_medium=catalog&utm_campaign=double_pack#order-form`,
      showcaseLink: `${baseOrigin}?qty=2&action=order#order-form`,
      category: 'Kitchen Cooktops',
      tag: 'Save ₦10,000'
    },
    {
      id: '2-burner-family',
      title: '2-Burner Flip-Up Cooker (Family Pack — 3 Units)',
      subtitle: 'Buy 3 Units at ₦150,000 each (Save ₦60,000)',
      price: 450000,
      priceFormatted: '₦450,000',
      imageRelative: '/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg',
      imageUrl: `${effectiveDomain}/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg`,
      overrideLink: `${baseOrigin}?qty=3&action=order&utm_source=facebook&utm_medium=catalog&utm_campaign=family_pack#order-form`,
      showcaseLink: `${baseOrigin}?qty=3&action=order#order-form`,
      category: 'Kitchen Cooktops',
      tag: 'Save ₦60,000'
    }
  ];

  // Pre-configured instant high-converting ad deep links
  const presetLinks = [
    {
      id: 'cooker-order',
      title: '2-Flip-Up Cooker — Direct Pay-on-Delivery Order Form',
      description: 'Pre-selects 2-Burner Cooktop (₦170,000) and scrolls directly to checkout form.',
      badge: 'Best for Direct Sales Ads',
      badgeColor: 'bg-red-100 text-red-800 border-red-300',
      icon: Flame,
      iconColor: 'text-red-600 bg-red-50 border-red-200',
      url: `${baseOrigin}?action=order&utm_source=meta_ad&utm_campaign=2burner_direct`
    },
    {
      id: 'cooker-express',
      title: '60-Second Express Pop-Up Checkout Link',
      description: 'Automatically triggers the quick pop-up checkout on page load without scrolling.',
      badge: 'Highest Mobile Conversion',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: Sparkles,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-200',
      url: `${baseOrigin}?express=1&utm_source=meta_ad&utm_campaign=express_popup`
    },
    {
      id: 'cooker-qty2',
      title: 'Volume Savings Deal (2 Units — Save ₦10,000)',
      description: 'Pre-selects 2 units in the cart (₦330,000) with volume discount applied.',
      badge: 'Higher Average Order Value',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: ShoppingBag,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      url: `${baseOrigin}?qty=2&action=order&utm_source=meta_ad&utm_campaign=bulk_2pack`
    },
    {
      id: 'cooker-gallery',
      title: 'Authentic 14-Photo Gallery Link',
      description: 'Scrolls directly to the real product photo gallery with Nigerian kitchen showcases.',
      badge: 'High Trust & Proof',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: Eye,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-200',
      url: `${baseOrigin}?action=gallery&utm_source=tiktok_ad&utm_campaign=gallery_proof`
    }
  ];

  // Build custom URL
  const buildCustomUrl = () => {
    const params = new URLSearchParams();
    if (selectedAction) params.set('action', selectedAction);
    if (selectedPlatform) params.set('utm_source', selectedPlatform);
    if (campaignName) params.set('utm_campaign', campaignName.trim().replace(/\s+/g, '_'));
    if (customDiscount) params.set('discount', customDiscount.trim());

    // Add anchor hash if destination matches section
    let hash = '';
    if (selectedAction === 'order') hash = '#order-form';
    else if (selectedAction === 'gallery') hash = '#gallery';

    return `${baseOrigin}?${params.toString()}${hash}`;
  };

  const customUrl = buildCustomUrl();
  const catalogXmlFeedUrl = `${effectiveDomain}/api/catalog.xml`;
  const catalogCsvUrl = `${effectiveDomain}/api/facebook-catalog.csv`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/70 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-white text-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight">
                  Ad Campaign & Catalog Deep Links Hub
                </h3>
                <span className="text-[10px] font-extrabold uppercase bg-red-600 text-white px-2 py-0.5 rounded-full">
                  Meta & TikTok Ads
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Link website images and override catalog URLs directly below your Facebook video/photo ad creatives.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 sm:px-6 pt-3 flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'presets'
                ? 'bg-white text-red-600 border-red-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Ready-Made Instant Links</span>
            <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
              {presetLinks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('facebook-catalog')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'facebook-catalog'
                ? 'bg-white text-blue-600 border-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Grid className="w-4 h-4 text-blue-600" />
            <span>Facebook Catalog & Images Below Ad</span>
            <span className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse">
              Override Links
            </span>
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'builder'
                ? 'bg-white text-red-600 border-red-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Custom Campaign Link Builder</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: PRESET AD LINKS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  i
                </div>
                <div>
                  <strong className="font-bold">How to use these deep links in Meta / TikTok Ads:</strong>
                  <p className="text-blue-800/90 mt-0.5">
                    Click <strong>"Copy Link"</strong> below and paste it into the <strong>Website URL</strong> field when setting up your ad. When a customer taps your ad, they will immediately land on that exact product with the order form pre-filled or the full specs open!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {presetLinks.map((preset) => {
                  const Icon = preset.icon;
                  const isCopied = copiedKey === preset.id;

                  return (
                    <div
                      key={preset.id}
                      className="bg-white border border-slate-200 hover:border-red-500/50 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${preset.iconColor}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="text-sm sm:text-base font-bold text-slate-900">
                              {preset.title}
                            </h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${preset.badgeColor}`}
                            >
                              {preset.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-1">
                            {preset.description}
                          </p>
                          <div className="mt-2 text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg truncate max-w-xl">
                            {preset.url}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(preset.url, preset.id)}
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs ${
                            isCopied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-red-600 hover:bg-red-700 text-white active:scale-95'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied Link!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>

                        <a
                          href={preset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-red-600 bg-slate-100 hover:bg-slate-200 px-3 py-2.5 rounded-xl border border-slate-200 transition-colors"
                          title="Test how this link looks to an ad visitor"
                        >
                          <span>Test</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: FACEBOOK CATALOG & IMAGES BELOW AD */}
          {activeTab === 'facebook-catalog' && (
            <div className="space-y-6">
              {/* Educational Banner */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 border border-blue-700 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-blue-300">
                    <Grid className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-white">
                        How to Display Website Images Below Your Facebook Ad Creative
                      </h4>
                      <span className="text-[10px] font-black uppercase bg-blue-500 text-white px-2 py-0.5 rounded-full">
                        Collection & Advantage+ Catalog Ads
                      </span>
                    </div>
                    <p className="text-xs text-blue-100 leading-relaxed">
                      In Facebook Ads Manager, when you run a <strong>Collection Ad</strong> or turn on <strong>Advantage+ Creative with Catalog Items</strong>, Facebook displays <strong>3 to 4 clickable website product photos directly beneath your primary ad video or photo</strong>. When visitors tap any photo tile, Facebook uses the <strong>Catalog Override URL</strong> to take them straight to checkout for that specific item!
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Mockup: How it appears on Facebook / Instagram Feed */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Simulation: How Your Ad Creative + Product Images Look On Facebook Feed</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Mobile Ad Preview</span>
                </div>

                {/* Simulated Facebook Mobile Ad Card */}
                <div className="max-w-md mx-auto bg-white text-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                  {/* Ad Post Header */}
                  <div className="p-3 bg-white flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center font-black text-xs">
                        M
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">MAX LUXURY BATHROOMS</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span>Sponsored</span>
                          <span>•</span>
                          <span className="text-blue-600">Paid Partnership</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-400 text-xs">•••</span>
                  </div>

                  {/* Primary Ad Creative Area */}
                  <div className="relative bg-slate-950 aspect-video flex flex-col items-center justify-center text-center p-4">
                    <img
                      src="/images/luxury_kitchen_lifestyle_1789548098794.jpg"
                      alt="Main Ad Creative"
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="relative z-10 space-y-1">
                      <span className="inline-block bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs">
                        Your Main Video or Photo Creative
                      </span>
                      <p className="text-xs font-bold text-white drop-shadow-md">
                        Executive Kitchen Appliances • Pay on Delivery Nationwide
                      </p>
                    </div>
                  </div>

                  {/* PRODUCT TILES DIRECTLY BELOW AD CREATIVE */}
                  <div className="p-2.5 bg-slate-50 border-t border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Website Product Cards Displayed Below Creative:</span>
                      <span className="text-blue-600 text-[10px]">Tap to test link</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {catalogProducts.map((p) => (
                        <a
                          key={p.id}
                          href={p.overrideLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group bg-white rounded-xl border border-slate-200 p-1 hover:border-blue-600 hover:shadow-md transition-all text-center flex flex-col"
                          title={`Test override link for ${p.title}`}
                        >
                          <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-100 mb-1">
                            <img
                              src={p.imageRelative}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="text-[9px] font-bold text-slate-800 truncate leading-tight">
                            {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                          </div>
                          <div className="text-[10px] font-extrabold text-red-600 mt-0.5">
                            {p.priceFormatted}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="p-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-slate-600">maxluxurybathrooms.shop</span>
                    <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1">
                      Shop Now <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* 1-Click Meta Catalog Feed Sync & CSV Download */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Download className="w-4 h-4 text-blue-600" />
                      <span>Meta Commerce Manager Data Feed (Automatic Sync)</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Provide this XML or CSV link to Facebook Catalog Manager so Facebook auto-fetches all images, prices, and links.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(catalogXmlFeedUrl, 'xml_feed')}
                      className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                        copiedKey === 'xml_feed'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                    >
                      {copiedKey === 'xml_feed' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied XML Feed URL!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-blue-600" />
                          <span>Copy Catalog Feed URL</span>
                        </>
                      )}
                    </button>

                    <a
                      href={catalogCsvUrl}
                      download="facebook_catalog_feed.csv"
                      className="text-xs font-bold px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download CSV</span>
                    </a>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-700 break-all select-all flex items-center justify-between gap-2">
                  <span className="truncate">{catalogXmlFeedUrl}</span>
                  <span className="text-[10px] font-sans font-bold uppercase text-slate-400 shrink-0">
                    RSS 2.0 / Google & Meta Spec
                  </span>
                </div>
              </div>

              {/* Table of Catalog Products with Override Links & High-Res Image URLs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-red-600" />
                    <span>Product Catalog Override Links & Image URLs</span>
                  </h4>
                  <span className="text-xs text-slate-500">
                    Copy and paste into your Ad Carousel / Collection cards
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {catalogProducts.map((p) => {
                    const isCopiedOverride = copiedKey === `override_${p.id}`;
                    const isCopiedImage = copiedKey === `img_${p.id}`;

                    return (
                      <div
                        key={p.id}
                        className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-3"
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Image Preview */}
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative group">
                            <img
                              src={p.imageRelative}
                              alt={p.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              1200×800
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h5 className="text-sm sm:text-base font-bold text-slate-900">
                                {p.title}
                              </h5>
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                                ID: <code className="text-red-600">{p.id}</code>
                              </span>
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                                {p.tag}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 mb-2">
                              {p.subtitle} • <strong>Price: {p.priceFormatted}</strong>
                            </p>

                            {/* Links Section */}
                            <div className="space-y-2">
                              {/* 1. Deep Link (Override URL) */}
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                                <span className="text-[10px] font-bold uppercase text-slate-500 w-24 shrink-0">
                                  Override Link:
                                </span>
                                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-700 truncate select-all">
                                  {p.overrideLink}
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(p.overrideLink, `override_${p.id}`)}
                                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                                      isCopiedOverride
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                  >
                                    {isCopiedOverride ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    <span>{isCopiedOverride ? 'Copied' : 'Copy Override Link'}</span>
                                  </button>
                                  <a
                                    href={p.overrideLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-100"
                                    title="Test in new tab"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>

                              {/* 2. Image URL */}
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                                <span className="text-[10px] font-bold uppercase text-slate-500 w-24 shrink-0">
                                  Image URL:
                                </span>
                                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-700 truncate select-all">
                                  {p.imageUrl}
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(p.imageUrl, `img_${p.id}`)}
                                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                                      isCopiedImage
                                        ? 'bg-emerald-600 text-white border-emerald-600'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                                    }`}
                                  >
                                    {isCopiedImage ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    <span>{isCopiedImage ? 'Copied' : 'Copy Image URL'}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step-by-Step Meta Ads Setup Guide */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs text-slate-700">
                <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>3 Simple Steps To Link In Facebook Ads Manager:</span>
                </h5>
                <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-1 leading-relaxed">
                  <li>
                    <strong>In Ads Manager at the Ad Level</strong>, set Ad Setup to <strong>Collection</strong> or select <strong>Advantage+ Creative &gt; Add catalog items</strong>.
                  </li>
                  <li>
                    Under <strong>"Destination Override" / "Product URL"</strong>, paste the <strong>Override Link</strong> for each package (e.g. paste the 2-Burner Cooker override link).
                  </li>
                  <li>
                    Facebook will automatically scrape the photos and display the interactive carousel below your main ad creative. When shoppers tap a photo, they land directly on that item's checkout form!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM CAMPAIGN BUILDER */}
          {activeTab === 'builder' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Select Product Package */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    1. Target Cooktop Package to Advertise
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="2-burner">
                      2-Flip-Up Double Gas Cooker — 1 Unit (₦170,000)
                    </option>
                    <option value="2-burner-double">
                      2-Flip-Up Double Gas Cooker — 2 Units Couple Deal (₦330,000)
                    </option>
                    <option value="2-burner-family">
                      2-Flip-Up Double Gas Cooker — 3 Units Family Deal (₦450,000)
                    </option>
                  </select>
                </div>

                {/* 2. Destination Action */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    2. Landing Action for Visitor
                  </label>
                  <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="order">
                      Direct to Order Form (Pre-selected product & Pay-on-Delivery)
                    </option>
                    <option value="express">
                      Auto-Launch 60-Second Express Pop-Up Form
                    </option>
                    <option value="gallery">
                      Direct to 14-Photo Authentic Nigerian Kitchen Gallery
                    </option>
                  </select>
                </div>

                {/* 3. Advertising Platform */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    3. Ad Traffic Source (UTM Source)
                  </label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="meta_ad">Meta Ads (Facebook & Instagram Feed/Reels)</option>
                    <option value="facebook_catalog">Facebook Catalog / Collection Ads</option>
                    <option value="tiktok_ad">TikTok Ads (In-Feed & Spark Ads)</option>
                    <option value="instagram_dm">Instagram Story / DM Link</option>
                    <option value="whatsapp_status">WhatsApp Broadcast / Status Link</option>
                    <option value="google_ad">Google Ads (Search & Performance Max)</option>
                  </select>
                </div>

                {/* 4. Campaign Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    4. Campaign Name (For Tracking)
                  </label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g. sink_weekend_promo or lagos_flash_sale"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Generated Result Box */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Your Generated Ad Landing Deep Link</span>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Ready for Ads Manager
                  </span>
                </div>

                <div className="bg-black/50 border border-slate-700 rounded-xl p-3 text-xs font-mono text-emerald-400 break-all select-all">
                  {customUrl}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-300">
                    ✨ When tapped, this link will automatically:
                    <ul className="list-disc list-inside text-slate-400 mt-1 space-y-0.5 text-[11px]">
                      <li>Pre-select <strong>{selectedProduct}</strong> in the cart and order form</li>
                      <li>Navigate to <strong>{selectedAction}</strong> instantly</li>
                      <li>Track conversion under <strong>{selectedPlatform} ({campaignName})</strong></li>
                    </ul>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(customUrl, 'custom')}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg ${
                        copiedKey === 'custom'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white active:scale-95'
                      }`}
                    >
                      {copiedKey === 'custom' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied Custom Link!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Generated Link</span>
                        </>
                      )}
                    </button>

                    <a
                      href={customUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2.5 rounded-xl border border-slate-700 transition-colors"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              All override links support Meta Pixel attribution, pre-selected products, and nationwide Pay-on-Delivery.
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

