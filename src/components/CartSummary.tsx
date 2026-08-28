import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

type CartSummaryProps = {
  subtotal: number;
  subtotalDisplay: string;
  itemCount: number;
  showCheckoutButton?: boolean;
};

export function CartSummary({ subtotal, subtotalDisplay, itemCount, showCheckoutButton = true }: CartSummaryProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-display text-xl font-bold text-charcoal">Order Summary</h3>

      <div className="mt-6 space-y-3 border-t border-border pt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
          <span className="font-semibold text-charcoal">{subtotalDisplay}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
        <span className="font-display text-lg font-bold text-charcoal">Total</span>
        <span className="font-display text-2xl font-bold text-accent">{subtotalDisplay}</span>
      </div>

      {showCheckoutButton && (
        <Link
          to="/checkout"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          Proceed to Checkout
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Final price including shipping and taxes will be confirmed during checkout
      </p>
    </div>
  );
}
