import { ProductId } from '../types';

export interface AlternativeProductData {
  id: ProductId;
  name: string;
  shortName: string;
  tagline: string;
  category: string;
  price: number;
  normalPrice: number;
  dimensions: string;
  cutout: string;
  badge: string;
  accentColor: string;
  badgeColor: string;
  keyFeatures: string[];
  description: string;
  images: {
    url: string;
    title: string;
    subtitle: string;
    tag: string;
    alt: string;
  }[];
  specifications: {
    feature: string;
    detail: string;
  }[];
  officialUrl: string;
  whatsappMessage: string;
}

export const ALTERNATIVE_PRODUCTS: AlternativeProductData[] = [
  {
    id: 'piano-sink',
    name: 'Smart Kitchen Piano Sink Workstation',
    shortName: 'Smart Piano Sink',
    tagline: 'Multifunctional SUS304 Nano Stainless Steel Workstation with Digital Display & Flying Rain Waterfall',
    category: 'Smart Stainless Workstation (75 × 45 cm)',
    price: 140000,
    normalPrice: 160000,
    dimensions: '750 × 450 × 205 mm (75 × 45 × 20.5 cm)',
    cutout: '720 × 420 mm (Top-mount, Flush-mount, or Undermount)',
    badge: 'Hydroelectric Smart Sink',
    accentColor: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    keyFeatures: [
      'Tactile Piano Push Keys: 4 independent mechanical keys for waterfall, pull-out tap, glass washer & filter spout',
      'Hydroelectric Digital LED Display (°C): Real-time temperature & ambient flow light (100% water-powered, 0 batteries or wiring)',
      'Flying Rain Cascading Waterfall: Wide splash-free horizontal water curtain for washing fruits, vegetables & greens',
      'Integrated Double-Track Workstation: Gliding solid wood chopping board, colander drain basket & secondary prep basin',
      'High-Pressure Glass Rinser: Press down to instantly power-rinse cups, mugs, and baby bottles in seconds',
      'Nano Bionic Textured SUS304 Steel: Scratch-resistant honeycomb finish that repels oil, fingerprints, and hard water spots'
    ],
    description: 'The signature smart kitchen centerpiece from Max Luxury Bathrooms. Combines mechanical piano key controls, real-time hydroelectric temperature monitoring, flying rain horizontal waterfall, and a nested multi-tier workstation to transform your kitchen into a modern culinary haven.',
    images: [
      {
        url: '/images/smart_piano_sink_1789548024514.jpg',
        title: 'Smart Kitchen Piano Sink Overview',
        subtitle: 'Nano Stainless Steel Workstation with Digital Display',
        tag: 'main',
        alt: 'Smart Kitchen Piano Sink with piano keys and digital temperature display'
      },
      {
        url: '/images/piano_console_details_1789548059707.jpg',
        title: 'Digital Temperature Display & Flow-Activated Light',
        subtitle: 'LED screen shows real-time temperature in °C; elegant ambient light turns on automatically as water passes through',
        tag: 'console',
        alt: 'Close up of piano keys, LED digital screen and ambient light illuminating as water passes through'
      },
      {
        url: '/images/workstation_accessories_1789548079842.jpg',
        title: 'Technical Dimensions & Fit Guide',
        subtitle: 'Standard 750mm × 450mm cutout with 205mm deep basin & console layout',
        tag: 'details',
        alt: 'Technical dimension diagram of the Smart Piano Sink with standard 750x450mm fit'
      },
      {
        url: '/images/luxury_kitchen_lifestyle_1789548098794.jpg',
        title: '4 Water Modes & Piano Controls',
        subtitle: 'Independent piano keys for pull-out tap, flying rain, waterfall & high-pressure cup washer',
        tag: 'console',
        alt: 'Piano key control console demonstrating tap water, rain stream, waterfall, and cup washer modes'
      },
      {
        url: '/images/complete_package_kit_1789548119458.jpg',
        title: 'Full Set & Plumbing Accessories',
        subtitle: 'Includes sink, faucet console, pipes, valves, and sliding trays',
        tag: 'unboxing',
        alt: 'Unboxing package layout showing all included components and fittings'
      }
    ],
    specifications: [
      { feature: 'Sink Architecture', detail: 'Single deep bowl workstation with integrated piano console & double-track sliding rails' },
      { feature: 'External Dimensions', detail: '750mm (Length) × 450mm (Width) × 205mm (Depth) [75cm × 45cm × 20.5cm]' },
      { feature: 'Internal Basin Dimensions', detail: '700mm (Length) × 350mm (Width) × 200mm (Depth)' },
      { feature: 'Material & Craft', detail: 'Heavy-duty SUS304 Stainless Steel with scratch-resistant Nano Bionic textured finish' },
      { feature: 'Color / Finish', detail: 'Gunmetal Gray / Matte Black Nano Metallic' },
      { feature: 'Faucet System', detail: 'Integrated Piano-key console with Flying Rain waterfall, 360° pull-out sprayer, drinking water spout & cup washer' },
      { feature: 'Digital Display & Flow Light', detail: 'Real-time LED water temperature (°C) & ambient flow light (100% hydroelectric self-generating power, zero batteries or electrical wiring)' },
      { feature: 'Included Accessories', detail: 'Solid wood cutting board, perforated stainless drain basket, secondary prep basin, cup washer, soap dispenser, 110mm drain assembly, hot/cold hoses, angle valves' },
      { feature: 'Installation Type', detail: 'Compatible with Top-mount (overmount), Flush-mount, and Undermount configurations' },
      { feature: 'Drainage System', detail: 'Rear right 110mm drain with rotary deck control knob and anti-odor flexible sewer piping' }
    ],
    officialUrl: '#order-form',
    whatsappMessage: 'Hello! I saw the Smart Kitchen Piano Sink Workstation (₦140,000) on your website. I would like to order or get more details about dispatch.'
  },
  {
    id: '5-burner',
    name: 'Executive 5-Burner Built-In Gas + Electric Hybrid Cooktop',
    shortName: '5-Burner Hybrid Cooktop',
    tagline: 'Never Get Stranded: 4 High-Heat Gas Burners + 1 Central 2000W Radiant Electric Zone',
    category: 'Dual-Fuel Hybrid Cooktop (90 × 51 cm)',
    price: 280000,
    normalPrice: 340000,
    dimensions: '900 × 510 mm (90 × 51 cm)',
    cutout: '870 × 480 mm (fits standard 90cm executive cooktop openings)',
    badge: 'Executive Dual-Fuel Hybrid',
    accentColor: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    keyFeatures: [
      'Dual-Fuel Reliability: Switch to the 2000W instant electric ceramic plate whenever gas runs out unexpectedly',
      '90° Flip-Up Hinged Gas Burners: Effortless 10-second 1-wipe cleanups without dismantling heavy components',
      'Digital Touch Controls & Timer: Independent LED touch interface for the electric cooking zone with 1–99 min auto-cutoff',
      '4 High-Power Gas Burners: Triple-ring wok burner for rapid boiling and high-heat Nigerian stew preparation',
      'Explosion-Proof Tempered Crystal Glass: Thermal resistant, impact-proof and sleek bevelled luxury design'
    ],
    description: 'The ultimate solution for uninterrupted cooking in Nigerian homes. Powered by both gas and electricity, ensuring your meal is never interrupted even if your gas cylinder runs empty mid-cooking.',
    images: [
      {
        url: '/images/Hd84f5f7654644224945b4ea055aa07a1Y.png',
        title: '5-Burner Hybrid Cooktop Overview',
        subtitle: '4 Gas Burners + 1 Central Radiant Ceramic Electric Hotplate',
        tag: 'main',
        alt: 'Executive 5-Burner Gas and Electric Hybrid Cooktop'
      },
      {
        url: '/images/H4183961f34a64d47a5f116fa6bfddf7eE.png',
        title: 'Flip-Up Hinged Burners',
        subtitle: 'Lift burners upright to wipe spills underneath in seconds',
        tag: 'details',
        alt: 'Hinged flip up gas burners for 10-second cleaning'
      },
      {
        url: '/images/cooktop-5b-lifestyle.jpeg',
        title: 'Luxury Kitchen Island & Countertop Fitment',
        subtitle: 'Executive 900 × 510 mm flush built-in presence',
        tag: 'lifestyle',
        alt: 'Installed 5-Burner cooktop on granite kitchen island'
      },
      {
        url: '/images/Hfcba7190a6324ecf8c6f0db5852a902fC.jpg',
        title: 'Technical Dimensions & Countertop Cutout Guide',
        subtitle: 'Outer: 900 × 510 mm • Cutout: 870 × 480 mm',
        tag: 'details',
        alt: 'Dimensions diagram for 5-burner hybrid cooktop'
      }
    ],
    specifications: [
      { feature: 'Burner Configuration', detail: '4 High-Efficiency Gas Burners + 1 Central 2000W Radiant Ceramic Electric Plate' },
      { feature: 'Panel Dimensions', detail: '900mm (Length) × 510mm (Width) [90cm × 51cm]' },
      { feature: 'Countertop Cutout', detail: '870mm (Length) × 480mm (Width)' },
      { feature: 'Surface Material', detail: '8mm Toughened explosion-proof crystal black tempered glass' },
      { feature: 'Ignition System', detail: 'Battery pulse ignition (Gas) + Electronic touch microcomputer (Electric)' },
      { feature: 'Timer & Safety', detail: '0–99 min auto-cutoff digital timer, child lock & emergency 1-touch stop' },
      { feature: 'Pan Supports', detail: 'Heavy-duty non-slip cast iron wok trivets for heavy Nigerian soup pots' },
      { feature: 'Installation', detail: 'Built-in countertop drop-in or countertop placement' }
    ],
    officialUrl: '#order-form',
    whatsappMessage: 'Hello! I saw the Executive 5-Burner Gas & Electric Hybrid Cooktop (₦280,000) on your website. I would like to order or get more details about dispatch.'
  },
  {
    id: '2-burner',
    name: '2-Flip-Up Double Gas Burner With Timer',
    shortName: '2-Flip-Up Double Burner',
    tagline: '90° Flip-Up Burners for Instant 1-Wipe Cleaning & Built-In Safety Timer',
    category: 'Hinged Gas Cooktop (75 × 45 cm)',
    price: 170000,
    normalPrice: 200000,
    dimensions: '750 × 450 mm (75 × 45 cm)',
    cutout: '650 × 350 mm (fits standard counter openings)',
    badge: 'Most Popular Matching Cooker',
    accentColor: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    keyFeatures: [
      '90° Flip-Up Burner Heads: Easily lift burners upright to wipe spills underneath in 5 seconds',
      'Built-In Mechanical Timer (0–180 mins): Automatically shuts off flame when cooking timer finishes',
      'Pure Blue Flame Energy Efficiency: 8-nozzle brass burner crowns with oxygen damper valves',
      'Heavy-Duty Windproof Cast Iron Wok Stands: Supports heavy Nigerian cooking pots securely',
      'Explosion-Proof Tempered Crystal Glass: Thermal resistant and easy to clean'
    ],
    description: 'The perfect companion appliance to your Smart Piano Sink. Features revolutionary 90-degree folding burner heads so you never struggle with grease build-up, plus an integrated mechanical timer that prevents burnt pots and wasted gas.',
    images: [
      {
        url: '/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg',
        title: '2-Flip-Up Double Gas Burner',
        subtitle: 'Dual 90° Hinged Folding Burners with Built-In Safety Timer',
        tag: 'main',
        alt: '2-Flip-Up Double Gas Burner With Timer'
      },
      {
        url: '/images/cooker_active_blue_flames.jpg',
        title: 'High-Efficiency Blue Flame',
        subtitle: 'Soot-free intense heating for standard family cooking',
        tag: 'details',
        alt: 'Active blue flames'
      },
      {
        url: '/images/burner_flip_hinge.jpg',
        title: '90° Flip-Up Hinged Mechanism',
        subtitle: 'Lifts up easily for 5-second 1-wipe cleanups',
        tag: 'details',
        alt: 'Hinged burner lifted up'
      }
    ],
    specifications: [
      { feature: 'Burner Configuration', detail: '2 High-Efficiency 90° Flip-Up Gas Burners with Brass Caps' },
      { feature: 'Panel Dimensions', detail: '750mm (Length) × 450mm (Width) [75cm × 45cm]' },
      { feature: 'Countertop Cutout', detail: '650mm (Length) × 350mm (Width)' },
      { feature: 'Surface Material', detail: 'Toughened explosion-proof crystal black tempered glass' },
      { feature: 'Ignition System', detail: 'Battery pulse electronic ignition' },
      { feature: 'Timer & Safety', detail: '0–180 min mechanical auto-shutoff timer' },
      { feature: 'Installation', detail: 'Dual-Use: Tabletop (with rubber anti-slip feet) OR Built-In' }
    ],
    officialUrl: '#order-form',
    whatsappMessage: 'Hello! I saw the 2-Flip-Up Double Gas Burner with Timer (₦170,000) on your website. I would like to order or get more details.'
  }
];

export const PIANO_SINK_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Engr. Babatunde A.',
    location: 'Lekki Phase 1, Lagos',
    rating: 5,
    review: 'We installed this piano sink during our kitchen remodeling last month. The waterfall feature for washing vegetables is simply incredible. The water temperature display also keeps my kids safe from accidental hot water burns. Premium quality through and through!',
    date: '3 weeks ago',
    verified: true
  },
  {
    id: 'rev-2',
    name: 'Mrs. Nkechi Okonkwo',
    location: 'Maitama, Abuja',
    rating: 5,
    review: 'I was skeptical about ordering online, but it arrived safely in a solid crate with every single accessory as advertised. The glass washer cleans my cups in two seconds. It completely changed the look of my kitchen island. Highly recommended!',
    date: '1 month ago',
    verified: true
  },
  {
    id: 'rev-3',
    name: 'Dr. Femi Adeleke',
    location: 'GRA Phase 2, Port Harcourt',
    rating: 5,
    review: 'The sliding cutting board and colander make meal preparation so organized. I do not have to clutter my countertop anymore. The piano buttons feel solid and responsive. Worth every naira spent.',
    date: '2 weeks ago',
    verified: true
  },
  {
    id: 'rev-4',
    name: 'Amina Bello',
    location: 'Kano Municipal, Kano',
    rating: 5,
    review: 'Excellent finish. The nano steel does not stain easily and water slides right into the drain. My plumber had no issues fitting the hot and cold pipes. Beautiful product!',
    date: '5 days ago',
    verified: true
  }
];

export const PIANO_SINK_FAQS = [
  {
    id: 'sink-faq-1',
    question: '1. What is a Smart Kitchen Piano Sink?',
    answer: 'A Smart Kitchen Piano Sink is a luxury, multifunctional kitchen workstation sink equipped with mechanical piano-style push buttons to control multiple water streams, an integrated LED digital temperature display, a cascading flying rain waterfall, a pull-out spray faucet, a high-pressure glass rinser, and nested preparation accessories.'
  },
  {
    id: 'sink-faq-2',
    question: '2. What functions does the sink have, and how does the light work?',
    answer: 'The sink integrates four key water dispensing modes: (1) Flying Rain horizontal waterfall for washing fruits and vegetables, (2) Pull-out flexible spray faucet with aerated stream and blade spray modes, (3) High-pressure glass cup washer, and (4) Dedicated filtered drinking water tap. Additionally, it features a real-time digital temperature display (°C) and an ambient glow light that automatically turns on whenever water passes through the sink, powered 100% by an internal hydroelectric turbine with zero batteries or electricity needed.'
  },
  {
    id: 'sink-faq-3',
    question: '3. What accessories come with it?',
    answer: 'The complete set includes: (1) Main 750x450mm nano stainless steel sink, (2) Complete piano faucet console with waterfall & pull-out tap, (3) Solid natural wood chopping board, (4) Perforated draining colander, (5) Nested secondary prep basin, (6) High-pressure cup washer, (7) Soap/lotion dispenser, (8) 110mm pop-up drain strainer with rotary knob, and (9) Complete plumbing pipes, hot & cold hoses, and angle valves.'
  },
  {
    id: 'sink-faq-4',
    question: '4. What material is it made from?',
    answer: 'It is constructed from heavy-gauge, premium SUS304 food-grade stainless steel treated with an advanced bionic nano textured coating that provides superior resistance against rust, corrosion, oil adhesion, and surface scratches.'
  },
  {
    id: 'sink-faq-5',
    question: '5. What are the dimensions?',
    answer: 'External Dimensions: 750mm (Length) × 450mm (Width) × 205mm (Depth). Inner Bowl Dimensions: 700mm (Length) × 350mm (Width) × 200mm (Depth). The piano console measures 750mm long by 75mm wide.'
  },
  {
    id: 'sink-faq-6',
    question: '6. Does it come with the faucet?',
    answer: 'Yes! The faucet system is pre-integrated into the piano console bar. It includes both the high-arc 360° pull-out sprayer, the separate dedicated drinking water faucet, and the horizontal flying rain waterfall bar.'
  },
  {
    id: 'sink-faq-7',
    question: '7. Does it require professional installation?',
    answer: 'Yes, we recommend that a licensed or experienced plumber installs the sink to connect the standard 1/2-inch hot and cold water inlet pipes, the drainage trap, and the optional drinking water purifier line correctly.'
  },
  {
    id: 'sink-faq-8',
    question: '8. Is it suitable for a new kitchen or renovation?',
    answer: 'Absolutely. It fits standard 750 × 450 mm countertop openings and can be installed as Top-mount (drop-in), Flush-mount, or Undermount. It is the most requested modern kitchen workstation in Nigeria today.'
  },
  {
    id: 'sink-faq-9',
    question: '9. How does delivery and Payment on Delivery work?',
    answer: 'We ship nationwide across all 36 states and Abuja. In Lagos, Abuja, and Port Harcourt, Payment on Delivery is available with doorstep delivery in 1–3 business days. For other states, delivery arrives in 3–5 business days.'
  }
];
