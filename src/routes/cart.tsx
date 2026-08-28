import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { CartItemCard } from "@/components/CartItemCard";
import { CartSummary } from "@/components/CartSummary";
import { Reveal } from "@/components/Reveal";
import { pageMeta } from "@/lib/seo";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/cart")({
  head: () => ({
    ...pageMeta({
      title: "Shopping Cart | Vimash Manufacturing",
      description: "Review your selected pulverizer machines and proceed to checkout.",
      path: "/cart",
    }),
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, clearCart } = useCart();
  const { items, subtotal, subtotalDisplay, itemCount } = cart;
  const isEmpty = items.length === 0;
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleClearCart = () => {
    clearCart();
    setShowClearDialog(false);
  };

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border bg-background">
        <div
          className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-accent)" }}
        />
        
        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-28 lg:px-8 lg:pb-16 lg:pt-28">
          <Reveal>
            <Link
              to="/products"
              search={{}}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Continue Shopping
            </Link>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] text-charcoal sm:text-5xl">
              Shopping Cart
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {isEmpty
                ? "Your cart is currently empty"
                : `${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart`}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-20">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Reveal>
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="mt-6 font-display text-2xl font-bold text-charcoal">
                Your cart is empty
              </h2>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                Start adding pulverizer machines to your cart and they will appear here.
              </p>
              <Link
                to="/products"
                search={{}}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Browse Products
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </Reveal>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Cart Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-charcoal">
                  Items ({itemCount})
                </h2>
                <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-red-600"
                    >
                      Clear cart
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl border-border sm:max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-display text-xl font-bold text-charcoal">
                        Clear your cart?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
                        Are you sure you want to clear your cart? All items will be removed. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-full border-border px-6 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:border-accent hover:bg-transparent hover:text-accent">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClearCart}
                        className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                      >
                        Clear Cart
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {items.map((item, index) => (
                <Reveal key={item.productSlug} delay={index * 60}>
                  <CartItemCard
                    productSlug={item.productSlug}
                    product={item.product}
                    quantity={item.quantity}
                    priceDisplay={item.priceDisplay}
                    itemTotalDisplay={item.itemTotalDisplay}
                  />
                </Reveal>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Reveal delay={120}>
                <CartSummary 
                  subtotal={subtotal} 
                  subtotalDisplay={subtotalDisplay}
                  itemCount={itemCount} 
                  showCheckoutButton={true} 
                />
              </Reveal>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
