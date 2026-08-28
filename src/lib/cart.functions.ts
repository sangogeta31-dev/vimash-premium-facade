import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { products } from "@/data/products";

/**
 * Server-side cart validation schema
 * Validates cart items from client localStorage
 */
const cartItemSchema = z.object({
  productSlug: z.string().min(1).max(100),
  quantity: z.number().int().min(1).max(100),
});

const validateCartSchema = z.object({
  items: z.array(cartItemSchema).max(50), // Max 50 items per cart
});

export type ValidatedCartItem = {
  productSlug: string;
  quantity: number;
  name: string;
  hp: string;
  model: string;
  category: string;
  pricePerUnit: number; // Numeric price in paise (smallest currency unit)
  priceDisplay: string; // Display string like "₹2,15,000"
  itemTotal: number; // quantity × pricePerUnit (in paise)
  itemTotalDisplay: string; // Formatted display
  isValid: true;
};

export type InvalidCartItem = {
  productSlug: string;
  quantity: number;
  isValid: false;
  reason: string;
};

export type ValidatedCart = {
  items: Array<ValidatedCartItem | InvalidCartItem>;
  validItems: ValidatedCartItem[];
  invalidItems: InvalidCartItem[];
  subtotal: number; // Total in paise
  subtotalDisplay: string; // Formatted display
  itemCount: number; // Count of valid items only
};

/**
 * Parse price string like "₹2,15,000" to paise (smallest unit)
 * Returns price in paise to avoid floating point issues
 * Example: "₹2,15,000" -> 21500000 paise (₹215,000.00)
 */
function parsePriceToFractional(priceStr: string): number {
  const cleaned = priceStr.replace(/[₹,\s]/g, "");
  const rupees = Number(cleaned);
  
  if (!Number.isFinite(rupees) || rupees < 0) {
    return 0;
  }
  
  // Convert to paise (1 rupee = 100 paise)
  return Math.round(rupees * 100);
}

/**
 * Format paise amount to rupee display string
 * Example: 21500000 paise -> "₹2,15,000"
 */
function formatPaiseToRupees(paise: number): string {
  const rupees = Math.round(paise / 100);
  return `₹${rupees.toLocaleString("en-IN")}`;
}

/**
 * Server-side cart validation function
 * 
 * Security guarantees:
 * - All prices recalculated from trusted server-side product data
 * - Product existence verified against server product database
 * - Quantities validated and clamped to safe ranges
 * - Client-sent prices/totals are completely ignored
 * - All calculations done server-side to prevent manipulation
 * 
 * CRITICAL: Never trust client-sent cart data for:
 * - Product prices
 * - Item totals
 * - Cart subtotals
 * - Product names or details
 * 
 * Flow:
 * 1. Client sends cart items (slug + quantity) from localStorage
 * 2. Server validates each item against trusted product database
 * 3. Server recalculates ALL prices and totals from scratch
 * 4. Server returns validated cart with trusted prices
 * 5. Client displays ONLY server-validated prices
 * 
 * @returns ValidatedCart with server-calculated prices and totals
 */
export const validateCart = createServerFn({ method: "POST" })
  .validator((data: unknown) => validateCartSchema.parse(data))
  .handler(async ({ data }): Promise<ValidatedCart> => {
    const validatedItems: Array<ValidatedCartItem | InvalidCartItem> = [];
    const validItems: ValidatedCartItem[] = [];
    const invalidItems: InvalidCartItem[] = [];
    let subtotalPaise = 0;

    for (const item of data.items) {
      // Find product in trusted server-side product database
      const product = products.find((p) => p.slug === item.productSlug);

      if (!product) {
        // Product not found - mark as invalid
        const invalidItem: InvalidCartItem = {
          productSlug: item.productSlug,
          quantity: item.quantity,
          isValid: false,
          reason: "Product not found",
        };
        validatedItems.push(invalidItem);
        invalidItems.push(invalidItem);
        continue;
      }

      // Validate quantity is within acceptable range
      const quantity = Math.max(1, Math.min(100, Math.floor(item.quantity)));

      // Parse price from trusted product data (NEVER from client)
      const pricePerUnitPaise = parsePriceToFractional(product.price);

      if (pricePerUnitPaise === 0) {
        // Price parsing failed or product has "On request" pricing
        const invalidItem: InvalidCartItem = {
          productSlug: item.productSlug,
          quantity: item.quantity,
          isValid: false,
          reason: "Price not available",
        };
        validatedItems.push(invalidItem);
        invalidItems.push(invalidItem);
        continue;
      }

      // Calculate item total (in paise to avoid floating point issues)
      const itemTotalPaise = pricePerUnitPaise * quantity;

      // Create validated item with server-calculated prices
      const validItem: ValidatedCartItem = {
        productSlug: item.productSlug,
        quantity,
        name: product.name,
        hp: product.hp,
        model: product.model,
        category: product.category,
        pricePerUnit: pricePerUnitPaise,
        priceDisplay: product.price, // Use original formatted string
        itemTotal: itemTotalPaise,
        itemTotalDisplay: formatPaiseToRupees(itemTotalPaise),
        isValid: true,
      };

      validatedItems.push(validItem);
      validItems.push(validItem);
      subtotalPaise += itemTotalPaise;
    }

    return {
      items: validatedItems,
      validItems,
      invalidItems,
      subtotal: subtotalPaise,
      subtotalDisplay: formatPaiseToRupees(subtotalPaise),
      itemCount: validItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  });

/**
 * Type-safe helper to check if a cart item is valid
 */
export function isValidCartItem(
  item: ValidatedCartItem | InvalidCartItem,
): item is ValidatedCartItem {
  return item.isValid === true;
}
