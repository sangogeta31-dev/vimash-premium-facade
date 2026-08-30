type GoogleTag = (
  command: "event",
  eventName: "conversion",
  parameters: {
    send_to: string;
    value: number;
    currency: string;
    event_callback: () => void;
  },
) => void;

type GoogleAdsWindow = Window & {
  gtag?: GoogleTag;
};

/**
 * Reports the configured Google Ads call conversion.  Callers should allow the
 * browser to follow a tel: link normally, so the optional redirect is unused
 * for phone links.
 */
export function gtagReportConversion(url?: string) {
  const callback = function () {
    if (typeof url !== "undefined") {
      window.location.href = url;
    }
  };

  (window as GoogleAdsWindow).gtag?.("event", "conversion", {
    send_to: "AW-17830238258/UM43CNXzteocELKwj7ZC",
    value: 1.0,
    currency: "INR",
    event_callback: callback,
  });

  return false;
}
