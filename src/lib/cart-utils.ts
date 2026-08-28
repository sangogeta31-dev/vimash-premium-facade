import type { Product } from "@/data/products";

export type CartItem = {
  productSlug: string;
  quantity: number;
  addedAt: string;
};

export type CartWithProducts = {
  items: Array<CartItem & { product: Product }>;
  subtotal: number;
  itemCount: number;
};

const CART_STORAGE_KEY = "vimash_cart";

/**
 * Parse price string like "₹2,15,000" to number
 */
export function parsePrice(priceStr: string): number {
  return Number(priceStr.replace(/[₹,\s]/g, ""));
}

/**
 * Format number to price string like "₹2,15,000"
 */
export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * Get cart items from localStorage
 */
export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    return [];
  }
}

/**
 * Save cart items to localStorage
 */
export function saveCartItems(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    // Dispatch custom event so other components can react
    window.dispatchEvent(new Event("cart-updated"));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
}

/**
 * Add item to cart or increase quantity if already exists
 */
export function addToCart(productSlug: string, quantity: number = 1): CartItem[] {
  const items = getCartItems();
  const existingIndex = items.findIndex((item) => item.productSlug === productSlug);

  if (existingIndex >= 0) {
    items[existingIndex].quantity += quantity;
  } else {
    items.push({
      productSlug,
      quantity,
      addedAt: new Date().toISOString(),
    });
  }

  saveCartItems(items);
  return items;
}

/**
 * Update item quantity in cart
 */
export function updateCartItemQuantity(productSlug: string, quantity: number): CartItem[] {
  const items = getCartItems();
  const existingIndex = items.findIndex((item) => item.productSlug === productSlug);

  if (existingIndex >= 0) {
    if (quantity <= 0) {
      items.splice(existingIndex, 1);
    } else {
      items[existingIndex].quantity = quantity;
    }
  }

  saveCartItems(items);
  return items;
}

/**
 * Remove item from cart
 */
export function removeFromCart(productSlug: string): CartItem[] {
  const items = getCartItems().filter((item) => item.productSlug !== productSlug);
  saveCartItems(items);
  return items;
}

/**
 * Clear entire cart
 */
export function clearCart(): void {
  saveCartItems([]);
}

/**
 * Get total item count in cart
 */
export function getCartItemCount(): number {
  return getCartItems().reduce((total, item) => total + item.quantity, 0);
}

/**
 * Calculate cart subtotal
 */
export function calculateCartSubtotal(items: Array<CartItem & { product: Product }>): number {
  return items.reduce((total, item) => {
    const price = parsePrice(item.product.price);
    return total + price * item.quantity;
  }, 0);
}
