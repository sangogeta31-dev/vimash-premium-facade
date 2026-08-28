import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import attaImg from "@/assets/atta-masala-front.png";
import masalaImg from "@/assets/atta-masala-front.png";
import type { Product } from "@/data/products";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

type CartItemCardProps = {
  productSlug: string;
  product: Product;
  quantity: number;
  priceDisplay: string;
  itemTotalDisplay: string;
};

export function CartItemCard({ 
  productSlug, 
  product, 
  quantity, 
  priceDisplay, 
  itemTotalDisplay 
}: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCart();
  const isAtta = product.category === "atta";

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(productSlug, quantity - 1);
    }
  };

  const handleIncrease = () => {
    updateQuantity(productSlug, quantity + 1);
  };

  const handleRemove = () => {
    removeItem(productSlug);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:gap-6">
      {/* Product Image */}
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="shrink-0"
      >
        <img
          src={isAtta ? attaImg : masalaImg}
          alt={product.name}
          width={120}
          height={90}
          className="h-24 w-full rounded-lg object-contain sm:w-28"
        />
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="font-display text-base font-bold text-charcoal hover:text-accent sm:text-lg"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Model {product.model} • {product.hp} HP
          </p>
          <p className="mt-2 text-sm font-semibold text-charcoal">
            {priceDisplay} <span className="text-xs text-muted-foreground">each</span>
          </p>
        </div>

        {/* Quantity Controls & Price */}
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-charcoal transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground",
                quantity <= 1 && "cursor-not-allowed opacity-50 hover:border-border hover:bg-background hover:text-charcoal"
              )}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            
            <span className="flex h-8 w-12 items-center justify-center rounded-lg border border-border bg-background font-semibold text-charcoal">
              {quantity}
            </span>
            
            <button
              type="button"
              onClick={handleIncrease}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-charcoal transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Total Price */}
          <div className="flex items-center gap-3">
            <p className="font-display text-base font-bold text-charcoal sm:text-lg">
              {itemTotalDisplay}
            </p>
            
            {/* Remove Button */}
            <button
              type="button"
              onClick={handleRemove}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-red-500 hover:bg-red-50 hover:text-red-600"
              aria-label="Remove from cart"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
