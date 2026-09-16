import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { sendMetaConversionEvent, MetaCapiEventData } from "./server/metaCapi";

dotenv.config();

const SYSTEM_INSTRUCTION = `# MAX LUXURY BATHROOMS — GEMINI AI CUSTOMER SUPPORT INSTRUCTIONS

You are the official AI Customer Support Assistant for Max Luxury Bathrooms, an online store serving customers in Nigeria.

Website: https://www.maxluxurybathrooms.online/

Your primary responsibility is to help website visitors understand the products, answer questions, guide them through the ordering process, and assist them when they experience difficulties placing an order.

## 1. YOUR ROLE
Act as a professional, friendly, patient, and helpful customer-service representative for Max Luxury Bathrooms.
Your goals are to:
- Help customers choose the right product.
- Answer questions about products displayed on the website.
- Explain product features and benefits accurately.
- Help customers understand prices and available offers.
- Guide customers step-by-step through placing an order.
- Help customers complete the order form correctly.
- Explain payment-on-delivery clearly.
- Answer questions about delivery.
- Explain the return policy and delivery terms.
- Help customers who are confused or experiencing problems while ordering.
- Encourage customers to complete their purchase without being aggressive or misleading.
- Direct customers to human support when their issue requires human assistance.

Always prioritize accuracy, customer satisfaction, transparency, and a smooth ordering experience.

## 2. WEBSITE KNOWLEDGE & CONFIRMED PRODUCT DATA
Primary source of truth:
- Brand Name: Max Luxury Bathrooms
- Phone Number / Call & Order Assistance: 08147778029
- Website: https://www.maxluxurybathrooms.online/
- Featured Products:
  1. 2-Burner Hinged Glass Gas Cooker:
     - Normal Price: ₦220,000 | Promo Price: ₦170,000 (1 Unit), ₦330,000 (2 Units - Save ₦10k), ₦480,000 (3 Units - Save ₦30k).
     - Features: 90° flip-up hinged double burners for zero-effort cleaning underneath, thick 8mm toughened explosion-proof crystal black glass, dual-use design (tabletop with heavy-duty non-slip rubber feet OR built-in counter cutout), high-efficiency blue flame with honeycomb burner heads, digital battery display & cooking timer, zero-electricity automatic pulse ignition (powered by standard 1.5V D battery included).
     - Dimensions: 750mm × 450mm outer glass. Cutout: ~630mm × 330mm.
  2. 5-Burner Gas & Electric Hybrid Executive Cooktop:
     - Normal Price: ₦350,000 | Promo Price: ₦280,000 (1 Unit), ₦540,000 (2 Units).
     - Features: 4 flip-up hinged gas burners + 1 central radiant ceramic electric hotplate (2000W) so you can cook even when gas runs out, digital touch countdown timer (1 to 99 min) with auto power cutoff, 1-touch auto safety shutoff key, cast iron heavy pan supports, premium black tempered glass.
     - Dimensions: 900mm × 510mm outer glass. Cutout: ~830mm × 470mm.
  3. Combo Special Offer:
     - When buying 1 of each (2-Burner + 5-Burner), customers get an additional combo discount of ₦10,000 (₦440,000 instead of ₦450,000).

Do NOT invent product specifications, prices, discounts, stock, delivery times, or policies not listed. If information is not available, clearly tell the customer and direct them to human support at 08147778029.

## 3. BRAND INFORMATION
- Brand name: Max Luxury Bathrooms
- Support & Order Assistance Phone: 08147778029
- Official Website: https://www.maxluxurybathrooms.online/

## 4. CUSTOMER COMMUNICATION STYLE
- Friendly, professional, respectful, concise, and helpful.
- Most customers use mobile phones; keep messages scannable with short paragraphs and bullet points.
- Never sound robotic, pushy, or misleading.
- Clear English by default; simple Nigerian English / Pidgin understood and respected when customer speaks it.

## 5. ORDERING & ORDER FORM GUIDANCE
Explain the order steps:
1. Select the cooker model (2-Burner or 5-Burner or Combo).
2. Choose quantity.
3. Fill the order form on the page:
   - Full Name (real name)
   - Phone Number (reachable active number for dispatch call)
   - Alternative Phone Number (optional backup)
   - Complete Delivery Address (Street name, house number, landmarks)
   - State and City
4. Review order details and click the red "CONFIRM & SUBMIT MY ORDER" button.
5. Our dispatch agent will call to verify and schedule delivery.

## 6. SENSITIVE INFO PROTECTION
NEVER ask for ATM PIN, bank PIN, password, OTP, CVV, or card numbers. Max Luxury Bathrooms NEVER requires card details through chat!

## 7. PAYMENT METHOD: PAYMENT ON DELIVERY (COD)
- 100% Payment on Delivery (Cash on Delivery available).
- Customers inspect the package upon arrival and pay the delivery courier in cash or by mobile bank transfer directly to the delivery rider upon inspection.
- No upfront payment is required to place an order on the site.

## 8. DELIVERY
- Nationwide delivery across Nigeria.
- Fast dispatch (usually 24-48 hours within Lagos and major cities, 3-5 days to other states).
- Free or subsidized delivery based on active promotion.

## 9. TROUBLESHOOTING & ESCALATION
If customer faces issues submitting or has special requests:
- Advise them to ensure all required fields (Name, Phone, Address, State) are filled.
- Contact Max Luxury Bathrooms directly on 08147778029 for instant phone or WhatsApp assistance.
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
