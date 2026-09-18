import crypto from "crypto";

export interface MetaCapiEventData {
  eventName: "PageView" | "ViewContent" | "AddToCart" | "Lead" | "Purchase" | string;
  eventId?: string;
  eventSourceUrl?: string;
  user?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    country?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
    fbp?: string;
    fbc?: string;
  };
  customData?: {
    currency?: string;
    value?: number;
    content_name?: string;
    content_type?: string;
    content_ids?: string[];
    contents?: Array<{ id: string; quantity: number; item_price?: number }>;
    num_items?: number;
    order_id?: string;
    [key: string]: unknown;
  };
}

function hashSha256(val: string | undefined): string | undefined {
  if (!val) return undefined;
  const clean = val.trim().toLowerCase();
  if (!clean) return undefined;
  return crypto.createHash("sha256").update(clean).digest("hex");
}

function normalizePhone(phone: string | undefined): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("2340") && digits.length === 14) {
    digits = "234" + digits.slice(4);
  } else if (digits.startsWith("0") && digits.length === 11) {
    digits = "234" + digits.slice(1);
  } else if (!digits.startsWith("234") && digits.length === 10) {
    digits = "234" + digits;
  }
  return hashSha256(digits);
}

/**
 * Sends a Conversions API event to Meta's Graph API for all configured Pixel/Dataset IDs.
 * Supports Meta Graph API v21.0
 */
export async function sendMetaConversionEvent(event: MetaCapiEventData, clientReqHeaders?: { ip?: string; userAgent?: string; referer?: string }) {
  const pixelIds = (process.env.META_PIXEL_IDS || process.env.META_DATASET_IDS || "1730802201545460,2580381385456107")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const accessToken = process.env.META_CONVERSION_API_TOKEN || process.env.META_CAPI_ACCESS_TOKEN || "";
  const testEventCode = process.env.META_TEST_EVENT_CODE || "";

  if (!accessToken) {
    console.warn("[Meta CAPI] Warning: META_CONVERSION_API_TOKEN is not set in environment. CAPI request skipped. Add your Meta System User Access Token to .env to activate server-side conversion dispatch.");
    return { success: false, reason: "No access token configured" };
  }

  const clientIp = event.user?.clientIpAddress || clientReqHeaders?.ip || "";
  const userAgent = event.user?.clientUserAgent || clientReqHeaders?.userAgent || "";
  const sourceUrl = event.eventSourceUrl || clientReqHeaders?.referer || "https://www.maxluxurybathrooms.online/";

  const userDataPayload: Record<string, unknown> = {
    client_ip_address: clientIp || undefined,
    client_user_agent: userAgent || undefined,
  };

  if (event.user?.email) {
    userDataPayload.em = [hashSha256(event.user.email)];
  }
  if (event.user?.phone) {
    const hashedPh = normalizePhone(event.user.phone);
    if (hashedPh) userDataPayload.ph = [hashedPh];
  }
  if (event.user?.firstName) {
    userDataPayload.fn = [hashSha256(event.user.firstName)];
  }
  if (event.user?.lastName) {
    userDataPayload.ln = [hashSha256(event.user.lastName)];
  }
  if (event.user?.city) {
    userDataPayload.ct = [hashSha256(event.user.city)];
  }
  if (event.user?.state) {
    userDataPayload.st = [hashSha256(event.user.state)];
  }
  userDataPayload.country = [hashSha256(event.user?.country || "ng")];

  if (event.user?.fbp) {
    userDataPayload.fbp = event.user.fbp;
  }
  if (event.user?.fbc) {
    userDataPayload.fbc = event.user.fbc;
  }

  const payloadData = [
    {
      event_name: event.eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: event.eventId || undefined,
      event_source_url: sourceUrl,
      action_source: "website",
      user_data: userDataPayload,
      custom_data: event.customData || undefined,
    },
  ];

  const results = [];

  for (const pixelId of pixelIds) {
    try {
      const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;
      const bodyPayload: Record<string, unknown> = {
        data: payloadData,
      };
      if (testEventCode) {
        bodyPayload.test_event_code = testEventCode;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bodyPayload),
      });

      const responseJson = await response.json();
      results.push({ pixelId, status: response.status, data: responseJson });
    } catch (err) {
      console.error(`[Meta CAPI] Error sending event ${event.eventName} to dataset ${pixelId}:`, err);
      results.push({ pixelId, error: String(err) });
    }
  }

  return { success: true, results };
}
