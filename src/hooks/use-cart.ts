import { useEffect, useState } from "react";
import { products, type Product } from "@/data/products";
import {
  addToCart as addToCartUtil,
  clearCart as clearCartUtil,
  getCartItems,
  removeFromCart as removeFromCartUtil,
  updateCartItemQuantity as updateCartItemQuantityUtil,
  type CartItem,
} from "@/lib/cart-utils";
import { validateCart, type ValidatedCartItem } from "@/lib/cart.functions";

/**
 * Client-side cart state with server-validated prices
 * SECURITY: Prices and totals come from server validation, NOT localStorage
 */
export type CartWithValidatedProducts = {
  items: Array<ValidatedCartItem & { product: Product }>;
  subtotal: number;
  subtotalDisplay: string;
  itemCount: number;
  isValidating: boolean;
  hasInvalidItems: boolean;
};

export function useCart() {
  const [cart, setCart] = useState<CartWithValidatedProducts>({
    items: [],
    subtotal: 0,
    subtotalDisplay: "₹0",
    itemCount: 0,
    // The first render happens before the localStorage cart has been loaded.
    // Keep checkout in its loading state until that validation completes.
    isValidating: true,
    hasInvalidItems: false,
  });

  // Load cart from localStorage and validate with server
  const loadCart = async () => {
    setCart((prev) => ({ ...prev, isValidating: true }));

    try {
      const cartItems = getCartItems();

      if (cartItems.length === 0) {
        setCart({
          items: [],
          subtotal: 0,
          subtotalDisplay: "₹0",
          itemCount: 0,
          isValidating: false,
          hasInvalidItems: false,
        });
        return;
      }

      // Validate cart with server - gets trusted prices
      const validated = await validateCart({
        data: {
          items: cartItems.map((item) => ({
            productSlug: item.productSlug,
            quantity: item.quantity,
          })),
        },
      });

      // Combine server-validated data with client-side product details for UI
      const itemsWithProducts = validated.validItems
        .map((validItem) => {
          const product = products.find((p) => p.slug === validItem.productSlug);
          if (!product) return null;
          return { ...validItem, product };
        })
        .filter(
          (item): item is ValidatedCartItem & { product: Product } => item !== null,
        );

      setCart({
        items: itemsWithProducts,
        subtotal: validated.subtotal,
        subtotalDisplay: validated.subtotalDisplay,
        itemCount: validated.itemCount,
        isValidating: false,
        hasInvalidItems: validated.invalidItems.length > 0,
      });

      // Remove invalid items from localStorage
      if (validated.invalidItems.length > 0) {
        validated.invalidItems.forEach((invalidItem) => {
          removeFromCartUtil(invalidItem.productSlug);
        });
      }
    } catch (error) {
      console.error("Cart validation failed:", error);
      // On error, show empty cart (safer than showing unvalidated data)
      setCart({
        items: [],
        subtotal: 0,
        subtotalDisplay: "₹0",
        itemCount: 0,
        isValidating: false,
        hasInvalidItems: false,
      });
    }
  };

  // Listen for cart updates
  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  const addToCart = (productSlug: string, quantity: number = 1) => {
    addToCartUtil(productSlug, quantity);
  };

  const updateQuantity = (productSlug: string, quantity: number) => {
    updateCartItemQuantityUtil(productSlug, quantity);
  };

  const removeItem = (productSlug: string) => {
    removeFromCartUtil(productSlug);
  };

  const clearCart = () => {
    clearCartUtil();
  };

  const isInCart = (productSlug: string): boolean => {
    return cart.items.some((item) => item.productSlug === productSlug);
  };

  const getItemQuantity = (productSlug: string): number => {
    const item = cart.items.find((item) => item.productSlug === productSlug);
    return item?.quantity || 0;
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    isInCart,
    getItemQuantity,
  };
}
