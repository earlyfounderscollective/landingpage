"use client";

import Script from "next/script";
import { env as serverEnv } from "@/lib/env";

// Public env var, exposed to the client via NEXT_PUBLIC_ prefix.
const PIXEL_ID = serverEnv.metaPixelId;

/**
 * Meta Pixel loader. Renders nothing when no Pixel ID is configured
 * (e.g. local dev). When configured, injects the standard Meta base
 * code + fires a PageView on initial load.
 *
 * Specific events (Lead, Purchase) fire from client components on the
 * pages that care — see TrainingForm for the Lead example.
 *
 * Note: this loads globally because Meta's algorithm benchmarks delivery
 * against PageView traffic — restricting it to /training would hurt
 * ad performance.
 */
export function MetaPixel() {
  if (!PIXEL_ID) return null;
  return (
    <>
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

declare global {
  interface Window {
    // The runtime Meta Pixel function (when the base code has loaded).
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Convenience client helper to fire a Pixel event with optional
 * event_id (for server-side dedup) and custom data.
 */
export function trackPixelEvent(
  eventName: "Lead" | "CompleteRegistration" | "Purchase" | "InitiateCheckout" | "ViewContent",
  options?: { eventId?: string; valueCents?: number; currency?: string },
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  const custom: Record<string, unknown> = {};
  if (typeof options?.valueCents === "number") {
    custom.value = options.valueCents / 100;
    custom.currency = options.currency ?? "USD";
  }
  const opts: Record<string, unknown> = {};
  if (options?.eventId) opts.eventID = options.eventId;
  window.fbq("track", eventName, custom, opts);
}
