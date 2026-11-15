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

function hashNormalizedGeo(val: string | undefined): string | undefined {
  if (!val) return undefined;
  // Meta CAPI recommends lowercase letters/digits with no spaces or punctuation for city/state
  const clean = val.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
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
export async function sendMetaConversionEvent(
  event: MetaCapiEventData,
  clientReqHeaders?: { ip?: string; userAgent?: string; referer?: string }
) {
  const rawPixelConfig =
    process.env.META_PIXEL_IDS ||
    process.env.META_DATASET_IDS ||
    process.env.META_PIXEL_ID ||
    "1690563088540181,1730802201545460,2580381385456107";

  const pixelIds = Array.from(
    new Set(
      rawPixelConfig
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
  );

  const defaultAccessToken =
    process.env.META_CONVERSION_API_TOKEN ||
    process.env.META_CAPI_ACCESS_TOKEN ||
    process.env.META_ACCESS_TOKEN ||
    "";
  const testEventCode = process.env.META_TEST_EVENT_CODE || "";

  const rawIp = event.user?.clientIpAddress || clientReqHeaders?.ip || "";
  const clientIp = rawIp.replace(/^::ffff:/, "").trim();
  const userAgent = event.user?.clientUserAgent || clientReqHeaders?.userAgent || "";
  const sourceUrl = event.eventSourceUrl || clientReqHeaders?.referer || "https://www.maxluxurybathrooms.shop/";

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
    const hashedCt = hashNormalizedGeo(event.user.city);
    if (hashedCt) userDataPayload.ct = [hashedCt];
  }
  if (event.user?.state) {
    const hashedSt = hashNormalizedGeo(event.user.state);
    if (hashedSt) userDataPayload.st = [hashedSt];
  }
  userDataPayload.country = [hashSha256(event.user?.country || "ng")];

  const externalIdRaw = event.user?.phone || event.customData?.order_id || event.eventId;
  if (externalIdRaw) {
    const hashedExt = hashSha256(String(externalIdRaw));
    if (hashedExt) userDataPayload.external_id = [hashedExt];
  }

  if (event.user?.fbp) {
    userDataPayload.fbp = event.user.fbp;
  }
  if (event.user?.fbc) {
    userDataPayload.fbc = event.user.fbc;
  }

  // Format custom_data strictly according to Meta Graph API Conversions API spec
  let metaCustomData: Record<string, unknown> | undefined = undefined;
  if (event.eventName !== "PageView" && event.customData) {
    const rawContents = Array.isArray(event.customData.contents) ? event.customData.contents : undefined;
    const normalizedContents = rawContents
      ? rawContents.map((item) => {
          const itemRecord = item as unknown as Record<string, unknown>;
          return {
            id: String(itemRecord.id || itemRecord.content_id || "2-burner"),
            quantity: Number(itemRecord.quantity || 1),
            item_price:
              itemRecord.item_price !== undefined
                ? Number(itemRecord.item_price)
                : itemRecord.price !== undefined
                ? Number(itemRecord.price)
                : undefined,
          };
        })
      : undefined;

    metaCustomData = {
      ...event.customData,
      ...(normalizedContents ? { contents: normalizedContents } : {}),
    };
  }

  const eventPayload: Record<string, unknown> = {
    event_name: event.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: event.eventId || undefined,
    event_source_url: sourceUrl,
    action_source: "website",
    user_data: userDataPayload,
  };

  if (metaCustomData) {
    eventPayload.custom_data = metaCustomData;
  }

  const payloadData = [eventPayload];
  const results = [];

  for (const pixelId of pixelIds) {
    // Allow optional per-pixel token (e.g. META_CONVERSION_API_TOKEN_1690563088540181) or shared token
    const pixelToken = process.env[`META_CONVERSION_API_TOKEN_${pixelId}`] || defaultAccessToken;

    if (!pixelToken) {
      console.warn(`[Meta CAPI] Warning: META_CONVERSION_API_TOKEN is not set in environment for Pixel ${pixelId}. CAPI request skipped.`);
      results.push({ pixelId, skipped: true, reason: "No access token configured" });
      continue;
    }

    try {
      const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(pixelToken)}`;
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
      if (!response.ok) {
        console.error(`[Meta CAPI] Graph API error (${response.status}) for Pixel ${pixelId}:`, responseJson);
      }
      results.push({ pixelId, ok: response.ok, status: response.status, data: responseJson });
    } catch (err) {
      console.error(`[Meta CAPI] Error sending event ${event.eventName} to dataset ${pixelId}:`, err);
      results.push({ pixelId, ok: false, error: String(err) });
    }
  }

  const sentAny = results.some((r) => !("skipped" in r && r.skipped));
  return { success: sentAny, results };
}

