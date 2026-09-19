import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { sendMetaConversionEvent, MetaCapiEventData } from "./server/metaCapi";
import { sendTikTokEvent, TikTokEventData } from "./server/tiktokEventsApi";

dotenv.config();

const SYSTEM_INSTRUCTION = `# MAX LUXURY BATHROOMS — AI CUSTOMER SUPPORT AGENT MASTER INSTRUCTIONS

## 1. YOUR ROLE
You are the official AI Customer Support Agent for **MAX LUXURY BATHROOMS**.

Official Websites:
- Primary: https://www.maxluxurybathrooms.shop/
- Domain Mirror: https://www.maxluxurybathrooms.online/
Customer Care / Phone: 08147778029 (International: +2348147778029)

Your primary responsibility is to help customers understand the products, prices, ordering process, delivery information, payment options, returns, and other information available on the Max Luxury Bathrooms website.
You must behave like a knowledgeable, professional, polite, and helpful customer-service representative.
Your goal is to help customers confidently understand the products and successfully complete their orders.

## 2. LEARN THE ENTIRE WEBSITE & VERIFIED PRODUCT KNOWLEDGE
Treat the website as your primary source of truth:
- Brand Name: MAX LUXURY BATHROOMS
- Official Support Phone: 08147778029

### Featured Products & Current Live Pricing:
1. **Premium 2-Burner Hinged Glass Gas Cooker**:
   - Single Unit (1 PIECE): ₦170,000 (Standard Promo Price, discounted from normal price of ₦220,000)
   - 2 PIECES: ₦330,000 (Save ₦10,000 total / ₦165,000 each - Most Popular)
   - 3 PIECES: ₦480,000 (Save ₦30,000 total / ₦160,000 each)
   - 4 PIECES & ABOVE: ₦600,000 for 4 (Best Value: ₦150,000 each)
   - Key Features:
     * 90° flip-up hinged double burners for zero-effort cleaning underneath without lifting whole heavy cooker
     * Thick 8mm toughened explosion-proof crystal black tempered glass
     * Dual-use installation: Tabletop (heavy-duty non-slip rubber feet included) OR built-in counter cutout
     * Dimensions: 750mm × 450mm outer glass. Cutout: ~630mm × 330mm
     * High-efficiency blue flame with honeycomb burner heads, saves gas
     * Digital battery power display & cooking timer
     * Zero-electricity automatic pulse ignition (powered by standard 1.5V D battery included in box)

2. **Executive 5-Burner Gas & Electric Hybrid Cooktop (With Timer & Auto-Off)**:
   - Single Unit (1 PIECE): ₦280,000 (discounted from normal price of ₦350,000)
   - 2 PIECES: ₦550,000 (Save ₦10,000 total / ₦275,000 each)
   - 3 PIECES: ₦810,000 (Save ₦30,000 total / ₦270,000 each)
   - Key Features:
     * 4 flip-up hinged gas burners + 1 central radiant ceramic electric hotplate (2000W) — cook even when gas finishes or cook with gas when light is out
     * Digital touch countdown timer (1 to 99 min) with auto power cutoff
     * 1-touch auto safety shutoff key for maximum peace of mind
     * Heavy-duty cast iron pan supports
     * Premium explosion-proof black tempered glass
     * Dimensions: 900mm × 510mm outer glass. Cutout: ~830mm × 470mm

3. **Special Combo Package Offer (1 of Each)**:
   - Buying 1 unit of 2-Burner + 1 unit of 5-Burner qualifies for an extra ₦10,000 combo discount: total ₦440,000 (instead of ₦450,000).

## 3. WEBSITE INFORMATION MUST BE THE SOURCE OF TRUTH
Prioritize current information from the website.
Do NOT rely on old information when newer information is available.
Do NOT invent:
- Prices
- Discounts
- Product features
- Stock availability
- Delivery fees
- Delivery times
- Locations
- Warranty terms
- Return conditions
- Promotions
- Product specifications

If you cannot verify something, clearly tell the customer that you cannot confirm it rather than guessing.
Example:
"I don't want to give you incorrect information. I can't currently verify that detail. Please contact Max Luxury Bathrooms directly on 08147778029 for confirmation."

## 4. REAL-TIME INFORMATION
Whenever live website data, product data, inventory, or order info is available, ALWAYS use the latest available information.
Never present outdated information as current.
If live information is unavailable, say so clearly. For example:
"I can provide the information currently available to me, but I can't verify the live stock status at this moment."
Never pretend that you have real-time access when you do not.

## 5. ALWAYS BE AVAILABLE
Operate as the website's 24/7 AI customer-support assistant.
- Be ready to answer customers at any time.
- Respond whenever a customer sends a message.
- Do not tell customers that you are sleeping or to wait for you to wake up.
- Maintain consistent, polite customer-service behavior day and night.

## 6. CUSTOMER QUESTIONS
Answer questions regarding:
- What products are sold (Premium 2-Burner Flip-Up Gas Cooker, Executive 5-Burner Gas & Electric Hybrid Cooktop, and Combo deal)
- Costs, pricing tiers, and bulk order discounts
- Features, materials, dimensions, and installation options (tabletop vs built-in)
- What comes in the box and suitability for kitchen setups

## 7. PRICE QUESTIONS
When a customer asks about price:
1. Give the current listed price in Nigerian Naira (₦).
2. Clearly explain quantity-based pricing and savings options.
3. Do not create unverified discounts or negotiate prices unless explicitly listed on the website.

## 8. ORDERING ASSISTANCE & ACTION BUTTON REQUIREMENT
Whenever customers ask about ordering, buying, checking out, purchasing, wanting 1 or more units, selecting a cooker, or wanting an immediate order:
1. Provide clear, concise ordering and price guidance.
2. Tell them to tap the attached "ORDER NOW — CHOOSE MODEL & FILL FORM" button directly below your message to jump straight to where they select the 2-Burner, 5-Burner, or Combo, choose quantity, and fill their delivery address.
3. Include an explicit action marker [ACTION:ORDER_NOW] (or [ACTION:ORDER_NOW:2-burner], [ACTION:ORDER_NOW:5-burner]) at the very end of your response so the interactive order button renders inside the conversation.
4. Explain step-by-step:
   - Step 1: Choose cooker model & quantity.
   - Step 2: Fill name, active phone number, address, and state.
   - Step 3: Click "CONFIRM & SUBMIT MY ORDER".
   - Step 4: Pay on Delivery upon physical inspection.

## 9. CUSTOMER INFORMATION & PRIVACY
Only request necessary order details (Full Name, Phone Number, Delivery Address, City, State, Quantity, Selected Product).
NEVER request or allow:
- Passwords
- ATM PINs
- Bank PINs
- OTP codes
- Full card numbers or CVV
Max Luxury Bathrooms NEVER requires card details through chat!
Never expose one customer's private information to another customer.

## 10. PAYMENT METHOD: 100% PAYMENT ON DELIVERY (COD)
- 100% Payment on Delivery (Cash on Delivery / POS / mobile bank transfer to delivery courier upon physical inspection).
- Customers inspect the cooker package upon arrival and pay the delivery rider only when satisfied.
- Zero upfront payment or deposit required on the website.

## 11. DELIVERY QUESTIONS
- Nationwide delivery across all 36 states and FCT Abuja in Nigeria.
- Fast dispatch: usually 24–48 hours within Lagos and major commercial hubs; 3–5 business days for other states.
- Subsidized / Free delivery based on active promotion.
- Never invent unverified delivery dates or tracking numbers; instruct customer that dispatch agents call before arriving.

## 12. STOCK / AVAILABILITY
If asked about live real-time stock levels and you cannot query real-time stock, say:
"I can't confirm the live stock status right now. Please contact Max Luxury Bathrooms on 08147778029 to confirm availability before placing your order."

## 13. RETURNS, REFUNDS AND EXCHANGES
- Customers have inspection rights upon delivery before payment.
- 7-day replacement warranty for manufacturer defects.
- For complicated complaints, damaged products, or return inquiries, advise the customer to contact official support directly on 08147778029.

## 14. CUSTOMER SERVICE ESCALATION
If you cannot answer a question accurately, do NOT guess:
1. Explain what you can confirm.
2. State that the remaining information requires confirmation.
3. Direct the customer to Max Luxury Bathrooms official customer care line: **08147778029**.

## 15. NEVER HALLUCINATE & DO NOT MISLEAD
NEVER make up information. If you do not know something, say:
"I don't have enough verified information to answer that accurately. Please contact Max Luxury Bathrooms directly on 08147778029."
Never claim an order was shipped, invent tracking numbers, or make unsubstantiated claims.

## 16. KEEP ANSWERS SIMPLE & PROFESSIONAL
- Short paragraphs, bullet points, clear instructions.
- Clear English, with natural understanding of Nigerian English / conversational tone when addressed.
- Use Nigerian Naira (₦).
- Never sound robotic or repeatedly say "As an AI...". Speak naturally as a dedicated Max Luxury Bathrooms representative.
- Do not argue with customers; remain calm, respectful, and solution-oriented.

## 17. PRIMARY OBJECTIVE
1. Give customers accurate information.
2. Help customers understand the products.
3. Help customers place orders on the website.
4. Provide accurate delivery and payment-on-delivery information.
5. Resolve simple customer questions.
6. Escalate complex issues to human customer care on 08147778029.
`;

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Meta / Facebook Product Catalog XML Feed (RSS 2.0 / Google Merchant Format)
  // Used by Meta Commerce Manager > Catalog > Data Sources > Data Feed (Scheduled Fetch)
  // Allows Facebook to scrape and display website product images directly beneath ad creatives (Collection Ads / Advantage+ Catalog)
  const handleCatalogXml = (req: express.Request, res: express.Response) => {
    const host = req.headers.host || "www.maxluxurybathrooms.shop";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const baseUrl = `${protocol}://${host}`;
    // Fallback to official domain if running on container host without custom domain
    const liveDomain = host.includes("localhost") || host.includes("run.app")
      ? `${protocol}://${host}`
      : "https://www.maxluxurybathrooms.shop";

    const products = [
      {
        id: "2-burner",
        title: "Premium 2-Burner Flip-Up Glass Gas Cooker",
        description: "Double-Burner Crystal Tempered Glass Cooktop with 90-degree flip-up hinged burners for zero-effort cleaning. Digital timer console, blue flame honeycomb burners, tabletop or built-in, nationwide payment on delivery across Nigeria.",
        link: `${liveDomain}/?product=2-burner&action=order&utm_source=facebook&utm_medium=catalog&utm_campaign=collection_ad`,
        image_link: `${liveDomain}/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg`,
        additional_images: [
          `${liveDomain}/images/Hb703478da96c4d06ac439666db478fb5s.jpg`,
          `${liveDomain}/images/H137f07cc70424452ada679ac752fcf43l.jpg`
        ],
        price: "170000 NGN",
        sale_price: "170000 NGN"
      },
      {
        id: "piano-sink",
        title: "Smart Kitchen Piano Sink Workstation (Nano SUS304)",
        description: "Multifunctional SUS304 Nano Stainless Steel Workstation (75x45cm) with tactile mechanical piano push keys, hydroelectric LED digital temperature display (°C), flying rain horizontal waterfall, high-pressure glass cup washer, and sliding accessories. Pay on delivery nationwide.",
        link: `${liveDomain}/?product=piano-sink&action=order&utm_source=facebook&utm_medium=catalog&utm_campaign=collection_ad`,
        image_link: `${liveDomain}/images/smart_piano_sink_1789548024514.jpg`,
        additional_images: [
          `${liveDomain}/images/piano_console_details_1789548059707.jpg`,
          `${liveDomain}/images/workstation_accessories_1789548079842.jpg`,
          `${liveDomain}/images/smart_piano_sink_lifestyle.jpg`
        ],
        price: "140000 NGN",
        sale_price: "140000 NGN"
      },
      {
        id: "5-burner",
        title: "Executive 5-Burner Gas & Electric Hybrid Cooktop (90cm)",
        description: "Executive 90cm Built-In Luxury Cooktop with 4 flip-up gas burners + 1 central radiant ceramic electric hotplate (2000W). Digital touch timer with auto safety cutoff, cast iron pan supports, explosion-proof black tempered glass. Nationwide payment on delivery.",
        link: `${liveDomain}/?product=5-burner&action=order&utm_source=facebook&utm_medium=catalog&utm_campaign=collection_ad`,
        image_link: `${liveDomain}/images/cooktop-5b-lifestyle.jpeg`,
        additional_images: [
          `${liveDomain}/images/11bb45a3-5549-4fdd-9bc1-7023275b3a13.png`
        ],
        price: "280000 NGN",
        sale_price: "280000 NGN"
      },
      {
        id: "combo",
        title: "Kitchen Duo Combo Deal: Cooker + Smart Piano Sink Workstation",
        description: "Complete Modern Luxury Kitchen Upgrade: Premium 2-Burner Flip-Up Cooker + Smart Kitchen Piano Sink Workstation with instant ₦10,000 combo discount and free expedited delivery across Nigeria.",
        link: `${liveDomain}/?product=combo&action=order&utm_source=facebook&utm_medium=catalog&utm_campaign=collection_ad`,
        image_link: `${liveDomain}/images/luxury_kitchen_lifestyle_1789548098794.jpg`,
        additional_images: [
          `${liveDomain}/images/complete_package_kit_1789548119458.jpg`
        ],
        price: "440000 NGN",
        sale_price: "440000 NGN"
      }
    ];

    const xmlItems = products.map((p) => {
      const additionalTags = p.additional_images
        .map((img) => `      <g:additional_image_link>${img}</g:additional_image_link>`)
        .join("\n");

      return `    <item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${p.title}]]></g:title>
      <g:description><![CDATA[${p.description}]]></g:description>
      <g:link>${p.link}</g:link>
      <g:image_link>${p.image_link}</g:image_link>
${additionalTags}
      <g:brand>MAX LUXURY BATHROOMS</g:brand>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${p.price}</g:price>
      <g:sale_price>${p.sale_price}</g:sale_price>
      <g:google_product_category>Home &amp; Garden &gt; Kitchen &amp; Dining &gt; Kitchen Appliances</g:google_product_category>
      <g:fb_product_category>home_and_garden &gt; kitchen_and_dining &gt; kitchen_appliances</g:fb_product_category>
    </item>`;
    }).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>MAX LUXURY BATHROOMS Product Catalog</title>
    <link>${liveDomain}</link>
    <description>Facebook / Meta Product Catalog Feed for MAX LUXURY BATHROOMS Collection Ads and Catalog Ads</description>
${xmlItems}
  </channel>
</rss>`;

    res.set("Content-Type", "application/xml; charset=utf-8");
    res.send(xml);
  };

  app.get("/api/catalog.xml", handleCatalogXml);
  app.get("/catalog.xml", handleCatalogXml);

  // Facebook Catalog CSV download endpoint
  app.get("/api/facebook-catalog.csv", (req, res) => {
    const host = req.headers.host || "www.maxluxurybathrooms.shop";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const liveDomain = host.includes("localhost") || host.includes("run.app")
      ? `${protocol}://${host}`
      : "https://www.maxluxurybathrooms.shop";

    const csvRows = [
      ["id", "title", "description", "availability", "condition", "price", "link", "image_link", "brand", "google_product_category", "fb_product_category"],
      [
        "2-burner",
        '"Premium 2-Burner Flip-Up Glass Gas Cooker"',
        '"Double-Burner Crystal Tempered Glass Cooktop with 90-degree flip-up hinged burners. Digital timer, payment on delivery."',
        "in stock",
        "new",
        "170000 NGN",
        `"${liveDomain}/?product=2-burner&action=order&utm_source=facebook&utm_medium=catalog"`,
        `"${liveDomain}/images/He848b3e8bcc24b1e9c9d64ea2c2c4a96q.jpg"`,
        '"MAX LUXURY BATHROOMS"',
        '"Home & Garden > Kitchen & Dining > Kitchen Appliances"',
        '"home_and_garden > kitchen_and_dining > kitchen_appliances"'
      ],
      [
        "piano-sink",
        '"Smart Kitchen Piano Sink Workstation (Nano SUS304)"',
        '"Multifunctional SUS304 Nano Stainless Steel Workstation with mechanical piano keys, digital LED temperature display, waterfall, cup rinser."',
        "in stock",
        "new",
        "140000 NGN",
        `"${liveDomain}/?product=piano-sink&action=order&utm_source=facebook&utm_medium=catalog"`,
        `"${liveDomain}/images/smart_piano_sink_1789548024514.jpg"`,
        '"MAX LUXURY BATHROOMS"',
        '"Home & Garden > Kitchen & Dining > Kitchen Fixtures > Kitchen Sinks"',
        '"home_and_garden > kitchen_and_dining > kitchen_fixtures > kitchen_sinks"'
      ],
      [
        "5-burner",
        '"Executive 5-Burner Gas & Electric Hybrid Cooktop"',
        '"Executive 90cm Built-In Luxury Cooktop with 4 gas burners plus 1 radiant ceramic electric zone (2000W) with timer and auto-off."',
        "in stock",
        "new",
        "280000 NGN",
        `"${liveDomain}/?product=5-burner&action=order&utm_source=facebook&utm_medium=catalog"`,
        `"${liveDomain}/images/cooktop-5b-lifestyle.jpeg"`,
        '"MAX LUXURY BATHROOMS"',
        '"Home & Garden > Kitchen & Dining > Kitchen Appliances"',
        '"home_and_garden > kitchen_and_dining > kitchen_appliances"'
      ],
      [
        "combo",
        '"Kitchen Duo Combo Deal: Cooker + Smart Piano Sink Workstation"',
        '"Premium 2-Burner Flip-Up Cooker + Smart Kitchen Piano Sink Workstation with instant ₦10,000 combo package discount."',
        "in stock",
        "new",
        "440000 NGN",
        `"${liveDomain}/?product=combo&action=order&utm_source=facebook&utm_medium=catalog"`,
        `"${liveDomain}/images/luxury_kitchen_lifestyle_1789548098794.jpg"`,
        '"MAX LUXURY BATHROOMS"',
        '"Home & Garden > Kitchen & Dining > Kitchen Appliances"',
        '"home_and_garden > kitchen_and_dining > kitchen_appliances"'
      ]
    ];

    const csvContent = csvRows.map((r) => r.join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="facebook_catalog_feed.csv"');
    res.send(csvContent);
  });

  // Meta Conversions API (CAPI) Proxy Endpoint
  app.post("/api/meta-conversions", async (req, res) => {
    try {
      const eventData: MetaCapiEventData = req.body;
      if (!eventData || !eventData.eventName) {
        return res.status(400).json({ error: "Missing required eventName" });
      }

      // Extract client network identifiers safely for Meta attribution matching
      const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "";
      const userAgent = req.headers["user-agent"] || "";
      const referer = req.headers["referer"] || "";

      const result = await sendMetaConversionEvent(eventData, { ip, userAgent, referer });
      return res.json({ status: "processed", result });
    } catch (capiErr) {
      console.error("[Meta CAPI Error in /api/meta-conversions]:", capiErr);
      return res.status(500).json({
        status: "error",
        error: capiErr instanceof Error ? capiErr.message : String(capiErr),
      });
    }
  });

  // TikTok Events API (Conversions API) Proxy Endpoint
  app.post("/api/tiktok-events", async (req, res) => {
    try {
      const eventData: TikTokEventData = req.body;
      if (!eventData || !eventData.eventName) {
        return res.status(400).json({ error: "Missing required eventName" });
      }

      const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "";
      const userAgent = (req.headers["user-agent"] as string) || "";
      const referer = (req.headers["referer"] as string) || "";

      const result = await sendTikTokEvent(eventData, { ip, userAgent, referer });
      return res.json({ status: "processed", result });
    } catch (ttErr) {
      console.error("[TikTok Events API Error in /api/tiktok-events]:", ttErr);
      return res.status(500).json({
        status: "error",
        error: ttErr instanceof Error ? ttErr.message : String(ttErr),
      });
    }
  });

  // Gemini AI Chat API
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, userMessage } = req.body;
      if (!userMessage || typeof userMessage !== "string") {
        return res.status(400).json({ error: "Message is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "AI support is currently being initialized. Please reach us directly at 08147778029.",
        });
      }

      const ai = getGenAI();

      // Format conversation history for Gemini multi-turn
      const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(messages)) {
        for (const m of messages) {
          if (m && typeof m.content === "string" && (m.role === "user" || m.role === "model" || m.role === "assistant")) {
            contents.push({
              role: m.role === "assistant" ? "model" : (m.role as "user" | "model"),
              parts: [{ text: m.content }],
            });
          }
        }
      }

      // Append current message
      contents.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      // Using gemini-3.5-flash for customer support multi-turn chat tasks, with fallback to gemini-3.1-flash-lite or gemini-3.8-flash on 503 capacity spikes
      let response;
      const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3.8-flash"];
      let lastErr: unknown = null;

      for (const model of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.7,
            },
          });
          if (response && response.text) {
            break;
          }
        } catch (mErr: unknown) {
          lastErr = mErr;
          console.warn(`Model ${model} unavailable, trying next fallback...`, mErr);
        }
      }

      if (!response && lastErr) {
        throw lastErr;
      }

      const reply = response.text || "Hello! How may I assist you with your Max Luxury Bathrooms order today? You can also reach our customer support at 08147778029.";
      return res.json({ reply });
    } catch (err: unknown) {
      console.error("Gemini Chat API error:", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      return res.status(500).json({
        error: "We are currently experiencing high request volume. For immediate assistance, please call our support line at 08147778029.",
        details: errMsg,
      });
    }
  });

  // Vite middleware for dev / static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Max Luxury Bathrooms app server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
