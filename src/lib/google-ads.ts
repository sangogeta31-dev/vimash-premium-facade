type GoogleTag = (
  command: "event",
  eventName: "conversion",
  parameters: {
    send_to: string;
    event_callback: () => void;
    value?: number;
    currency?: string;
  },
) => void;

type GoogleAdsWindow = Window & {
  gtag?: GoogleTag;
};

function createConversionCallback(url?: string) {
  return function () {
    if (typeof url !== "undefined") {
      window.location.href = url;
    }
  };
}

/**
 * Reports the configured Google Ads call conversion. Callers should allow the
 * browser to follow a tel: link normally, so the optional redirect is unused.
 */
export function gtagReportConversion(url?: string) {
  const callback = createConversionCallback(url);

  (window as GoogleAdsWindow).gtag?.("event", "conversion", {
    send_to: "AW-17830238258/UM43CNXzteocELKwj7ZC",
    value: 1.0,
    currency: "INR",
    event_callback: callback,
  });

  return false;
}

/**
 * Reports the configured Google Ads WhatsApp conversion. Callers should allow
 * the browser to follow the WhatsApp link normally, so the optional redirect
 * is unused.
 */
export function gtagReportWhatsAppConversion(url?: string) {
  const callback = createConversionCallback(url);

  (window as GoogleAdsWindow).gtag?.("event", "conversion", {
    send_to: "AW-17830238258/1n4xCKyJx-ocELKwj7ZC",
    event_callback: callback,
  });

  return false;
}
