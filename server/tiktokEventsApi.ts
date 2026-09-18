import crypto from "crypto";

export interface TikTokEventData {
  eventName: "PageView" | "ViewContent" | "AddToCart" | "SubmitForm" | "InitiateCheckout" | "PlaceAnOrder" | "CompletePayment" | string;
  eventId?: string;
  eventSourceUrl?: string;
  user?: {
    email?: string;
    phone?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
    ttp?: string;
    ttclid?: string;
  };
  customData?: {
    currency?: string;
    value?: number;
    content_name?: string;
    content_type?: string;
    content_id?: string;
    contents?: Array<{
      content_id?: string;
      content_name?: string;
      quantity?: number;
      price?: number;
    }>;
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
  // TikTok requires E.164 without leading plus for hashing
  return hashSha256(digits);
}

/**
 * Maps Meta/standard e-commerce event names to TikTok Events API standard names
 */
function mapToTikTokEvent(name: string): string {
  switch (name) {
    case "PageView":
      return "PageView";
    case "ViewContent":
      return "ViewContent";
    case "AddToCart":
      return "AddToCart";
    case "Lead":
      return "SubmitForm";
    case "InitiateCheckout":
      return "InitiateCheckout";
    case "Purchase":
      return "CompletePayment";
    default:
      return name;
  }
}

/**
 * Sends a server-side conversion event to TikTok Events API v1.3
 */
export async function sendTikTokEvent(
  event: TikTokEventData,
  clientReqHeaders?: { ip?: string; userAgent?: string; referer?: string }
) {
  const pixelId = process.env.TIKTOK_PIXEL_ID || "DAMG8E3C77UF5LAHFVF0";
  const accessToken = process.env.TIKTOK_EVENTS_API_ACCESS_TOKEN || "";
  const testEventCode = process.env.TIKTOK_TEST_EVENT_CODE || "";

  if (!accessToken) {
    // If access token is not configured yet, log warning and gracefully return
    return {
      success: false,
      reason: "TIKTOK_EVENTS_API_ACCESS_TOKEN not set. Set this token in environment to enable server-side TikTok Events API dispatch.",
    };
  }

  const clientIp = event.user?.clientIpAddress || clientReqHeaders?.ip || "";
  const userAgent = event.user?.clientUserAgent || clientReqHeaders?.userAgent || "";
  const sourceUrl = event.eventSourceUrl || clientReqHeaders?.referer || "https://www.maxluxurybathrooms.shop/";

  const userPayload: Record<string, unknown> = {
    ip: clientIp || undefined,
    user_agent: userAgent || undefined,
  };

  if (event.user?.email) {
    userPayload.email = hashSha256(event.user.email);
  }
  if (event.user?.phone) {
    const hashedPhone = normalizePhone(event.user.phone);
    if (hashedPhone) {
      userPayload.phone_number = hashedPhone;
    }
  }
  if (event.user?.ttp) {
    userPayload.ttp = event.user.ttp;
  }
  if (event.user?.ttclid) {
    userPayload.ttclid = event.user.ttclid;
  }

  const tiktokEventName = mapToTikTokEvent(event.eventName);

  // Build items array
  const contents =
    event.customData?.contents?.map((item) => ({
      content_id: item.content_id || "cooker",
      content_name: item.content_name || "Premium Glass Gas Cooker",
      quantity: item.quantity || 1,
      price: item.price || event.customData?.value || 0,
    })) || [
      {
        content_id: event.customData?.content_id || (event.customData?.order_id as string) || "cooker",
        content_name: event.customData?.content_name || "Premium Glass Gas Cooker",
        quantity: event.customData?.num_items || 1,
        price: event.customData?.value || 0,
      },
    ];

  const bodyData: Record<string, unknown> = {
    event_source: "web",
    event_source_id: pixelId,
    data: [
      {
        event: tiktokEventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId || undefined,
        user: userPayload,
        properties: {
          currency: event.customData?.currency || "NGN",
          value: event.customData?.value || undefined,
          content_type: "product",
          contents,
        },
        page: {
          url: sourceUrl,
        },
      },
    ],
  };

  if (testEventCode) {
    bodyData.test_event_code = testEventCode;
  }

  try {
    const response = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken,
      },
      body: JSON.stringify(bodyData),
    });

    const resultJson = await response.json();
    return { success: response.ok, data: resultJson };
  } catch (error) {
    console.error("[TikTok Events API] Error dispatching event:", error);
    return { success: false, error: String(error) };
  }
}
