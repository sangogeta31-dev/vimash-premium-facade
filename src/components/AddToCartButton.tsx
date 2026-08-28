import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
  productSlug: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
};

export function AddToCartButton({
  productSlug,
  variant = "primary",
  size = "md",
  className,
  showIcon = true,
  children,
}: AddToCartButtonProps) {
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const inCart = isInCart(productSlug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    addToCart(productSlug, 1);
    
    // Reset animation state
    setTimeout(() => setIsAdding(false), 600);
  };

  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300";
  
  const variantStyles = {
    primary: "rounded-full bg-accent text-accent-foreground shadow-[var(--shadow-glow)] hover:-translate-y-0.5",
    secondary: "rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "rounded-full border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-7 py-3.5 text-sm",
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isAdding}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        isAdding && "scale-95",
        inCart && variant === "outline" && "border-green-600 text-green-600 hover:bg-green-600 hover:text-white",
        className,
      )}
    >
      {showIcon && (
        <ShoppingCart className={cn("h-4 w-4", isAdding && "animate-bounce")} />
      )}
      {children || (inCart ? "Added to Cart" : "Add to Cart")}
    </button>
  );
}
