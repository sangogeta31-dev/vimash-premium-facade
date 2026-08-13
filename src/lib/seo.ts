import { site } from "@/data/site";
import type { Product } from "@/data/products";

export const BASE_URL = "https://vimash-premium-facade.lovable.app";

export const canonicalUrl = (path: string) =>
  `${BASE_URL}${path === "/" ? "/" : path.replace(/\/$/, "")}`;

/** Core search terms targeted across the whole site. */
export const CORE_KEYWORDS = [
  "flour mill",
  "commercial flour mill",
  "commercial atta chakki",
  "atta chakki",
  "double chamber pulverizer",
  "double stage pulverizer",
  "double chamber atta chakki pulverizer",
  "commercial atta chakki machine",
  "commercial flour mill machine",
  "atta chakki machine",
  "flour mill machine",
  "atta flour mill",
];

/** Merge keyword lists, keeping order and removing duplicates. */
export const mergeKeywords = (...lists: string[][]) =>
  Array.from(new Set(lists.flat().filter(Boolean)));

/** Search terms that match each product line. Kept short and natural. */
export function productKeywords(product: Product): string[] {
  const hp = `${product.hp} HP`;
  return product.category === "atta"
    ? mergeKeywords(
        [
          `${hp} atta chakki machine`,
          `${hp} commercial flour mill machine`,
          `${hp} double chamber atta chakki pulverizer`,
          "atta pulverizer",
          product.model,
        ],
        CORE_KEYWORDS,
      )
    : mergeKeywords(
        [
          `${hp} masala pulverizer`,
          "masala grinding machine",
          "spice grinding machine",
          "commercial masala pulverizer",
          "double chamber pulverizer",
          "double stage pulverizer",
          product.model,
        ],
        CORE_KEYWORDS,
      );
}


export function productSeoTitle(product: Product) {
  const line =
    product.category === "atta"
      ? "Commercial Atta Chakki Machine"
      : "Commercial Masala Grinding Machine";
  return `${product.hp} HP ${line} — ${product.model} Specifications | ${site.shortName}`;
}

export function productSeoDescription(product: Product) {
  const line =
    product.category === "atta"
      ? "double chamber atta chakki pulverizer (commercial flour mill machine)"
      : "masala pulverizer for spice grinding";
  return `${product.hp} HP ${line} from ${site.shortName}. Grinding capacity ${product.capacity}, ${product.mainMotor} main motor, ${product.chamber.toLowerCase()}, ${product.material} body. See full specifications and request a callback.`;
}

/** Descriptive ALT text used for product photography. */
export function productImageAlt(product: Product) {
  return product.category === "atta"
    ? `${product.name} — ${product.hp} HP commercial atta chakki pulverizer (flour mill machine) by ${site.name}`
    : `${product.name} — ${product.hp} HP commercial masala pulverizer / spice grinding machine by ${site.name}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: BASE_URL,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      postalCode: "382435",
      addressCountry: "IN",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.model,
    model: product.model,
    category:
      product.category === "atta"
        ? "Commercial Atta Chakki Pulverizer"
        : "Commercial Masala Pulverizer",
    description: product.description,
    url: canonicalUrl(`/products/${product.slug}`),
    brand: { "@type": "Brand", name: site.shortName },
    manufacturer: { "@type": "Organization", name: site.name },
    material: product.material,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price.replace(/[^0-9]/g, "") || "0",
      availability: "https://schema.org/InStock",
      url: canonicalUrl(`/products/${product.slug}`),
    },
    additionalProperty: [
      { name: "Grinding Capacity Per Hour", value: product.capacity },
      { name: "Main Motor", value: product.mainMotor },
      { name: "Cyclone Motor", value: product.cycloneMotor },
      { name: "Power Consumption", value: product.powerConsumption },
      { name: "Current", value: product.current },
      { name: "Voltage", value: product.voltage },
      { name: "Chamber", value: product.chamber },
      { name: "Machine Dimension", value: product.dimension },
      { name: "Automation Grade", value: product.automation },
    ].map((p) => ({ "@type": "PropertyValue", name: p.name, value: p.value })),
  };
}

/** Standard head() meta for any page. */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  type?: string;
  keywords?: string[];
}) {
  const url = canonicalUrl(opts.path);
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      ...(opts.keywords?.length ? [{ name: "keywords", content: opts.keywords.join(", ") }] : []),
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: opts.type ?? "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: site.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: opts.title },
      { name: "twitter:description", content: opts.description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
