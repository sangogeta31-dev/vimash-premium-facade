import { ShoppingCart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

export function CartIcon() {
  const { cart } = useCart();
  const itemCount = cart.itemCount;

  return (
    <Link
      to="/cart"
      className="relative inline-flex items-center justify-center rounded-full border border-border bg-background p-2.5 text-charcoal transition-colors hover:border-accent hover:text-accent"
      aria-label={`Shopping cart with ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span
          className={cn(
            "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[0.65rem] font-bold text-accent-foreground",
            itemCount > 99 && "text-[0.55rem]"
          )}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
