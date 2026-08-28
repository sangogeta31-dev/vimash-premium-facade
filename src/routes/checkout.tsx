import { createFileRoute, Navigate, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";
import { z } from "zod";
import { useCart } from "@/hooks/use-cart";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { lookupPincode } from "@/lib/pincode.functions";
import { getProductImages } from "@/data/product-images";
import { pageMeta } from "@/lib/seo";
import { site } from "@/data/site";
import { createPaymentOrder, verifyPayment } from "@/lib/payment.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    ...pageMeta({
      title: "Checkout | Vimash Manufacturing",
      description:
        "Complete your booking advance payment for commercial pulverizer machines via Razorpay.",
      path: "/checkout",
    }),
  }),
  component: CheckoutPage,
});

/* ─── Indian states dropdown ──────────────────────────────────────────────── */
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Lakshadweep",
  "Puducherry",
  "Andaman & Nicobar Islands",
] as const;

/* ─── Validation schema ───────────────────────────────────────────────────── */
const checkoutSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid 10-digit mobile number")
    .max(15, "Number too long")
    .regex(/^[+\d][\d\s-]{8,14}$/, "Enter a valid phone number"),
  firstName: z
    .string()
    .trim()
    .min(2, "Enter your first name")
    .max(50, "Name too long"),
  lastName: z.string().trim().max(50, "Name too long").optional().default(""),
  address: z
    .string()
    .trim()
    .min(5, "Enter your full delivery address")
    .max(250, "Address too long"),
  city: z
    .string()
    .trim()
    .min(2, "Enter your city")
    .max(60, "City name too long"),
  state: z.string().min(1, "Select your state"),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;



/* ─── Component ───────────────────────────────────────────────────────────── */
function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { items, subtotal, subtotalDisplay, itemCount, isValidating } = cart;
  const navigate = useNavigate();
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [form, setForm] = useState<CheckoutForm>({
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [pincodeLooking, setPincodeLooking] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);
  const pincodeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Pincode auto-lookup ─────────────────────────────────────────────── */
  useEffect(() => {
    if (pincodeTimeout.current) clearTimeout(pincodeTimeout.current);
    const pin = form.pincode.trim();
    if (!/^\d{6}$/.test(pin)) return;

    setPincodeLooking(true);
    pincodeTimeout.current = setTimeout(async () => {
      try {
        const result = await lookupPincode({ data: { pincode: pin } });
        if (result.state || result.city) {
          setForm((prev) => ({
            ...prev,
            ...(result.city ? { city: result.city } : {}),
            ...(result.state ? { state: result.state } : {}),
          }));
        }
      } catch {
        /* ignore — user can fill manually */
      } finally {
        setPincodeLooking(false);
      }
    }, 400);

    return () => {
      if (pincodeTimeout.current) clearTimeout(pincodeTimeout.current);
    };
  }, [form.pincode]);

  /* ── Field update helper ─────────────────────────────────────────────── */
  function updateField(field: keyof CheckoutForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  /* ── Load Razorpay script ─────────────────────────────────────────────── */
  useEffect(() => {
    if ((window as any).Razorpay) {
      setRazorpayReady(true);
      return;
    }
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    const script = existingScript ?? document.createElement("script");
    const handleLoad = () => setRazorpayReady(Boolean((window as any).Razorpay));
    const handleError = () =>
      setPaymentError("Secure checkout could not be loaded. Please refresh and try again.");

    if (!existingScript) {
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);
    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, []);

  /* ── Submit handler ──────────────────────────────────────────────────── */
  async function handlePayNow(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setPaymentError(null);

    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutForm, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CheckoutForm;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    if (!razorpayReady) {
      setPaymentError("Secure checkout is still loading. Please try again in a moment.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Create Razorpay order on the server (re-validates prices)
      const orderResult = await createPaymentOrder({
        data: {
          items: items.map((item) => ({
            productSlug: item.productSlug,
            quantity: item.quantity,
          })),
          customer: form,
        },
      });

      if (
        !orderResult.success ||
        !orderResult.orderId ||
        !orderResult.keyId ||
        !orderResult.orderContext
      ) {
        setPaymentError(orderResult.error ?? "Failed to create order.");
        setSubmitting(false);
        return;
      }

      // 2. Open Razorpay checkout modal
      const options = {
        key: orderResult.keyId,
        amount: orderResult.amount,
        currency: orderResult.currency ?? "INR",
        name: site.name,
        description: `Order for ${itemCount} machine${itemCount > 1 ? "s" : ""}`,
        order_id: orderResult.orderId,
        prefill: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          contact: form.phone,
        },
        theme: {
          color: "#EA580C", // accent orange
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // 3. Verify payment signature on the server
          try {
            const verification = await verifyPayment({
              data: {
                ...response,
                order_context: orderResult.orderContext,
              },
            });

            if (verification.verified) {
              // Clear cart and redirect to success page
              clearCart();
              navigate({
                to: "/order-success",
                search: {
                  order_id: response.razorpay_order_id,
                  payment_id: response.razorpay_payment_id,
                },
              });
            } else {
              setPaymentError(
                verification.error ?? "Payment verification failed. Please contact us.",
              );
            }
          } catch {
            setPaymentError("Verification error. Please contact us with your payment details.");
          }
          setSubmitting(false);
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", (response: any) => {
        setPaymentError(
          response?.error?.description ?? "Payment failed. Please try again.",
        );
        setSubmitting(false);
      });
      razorpay.open();
    } catch (error) {
      console.error("[Checkout] Payment error:", error);
      setPaymentError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  /* ── Loading state ───────────────────────────────────────────────────── */
  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    );
  }

  /* ── Empty cart redirect ─────────────────────────────────────────────── */
  if (items.length === 0) {
    return <Navigate to="/cart" />;
  }



  return (
    <>
      {/* ── Compact header ───────────────────────────────────────────────── */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-4xl px-5 pb-6 pt-28 lg:px-8 lg:pb-6 lg:pt-28">
          <Reveal>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Cart
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Main checkout layout ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-5 py-8 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* ──────────────────────────── LEFT: Form ───────────────────────── */}
          <form onSubmit={handlePayNow} className="space-y-8" id="checkout-form">
            {/* ── Order items (compact, mobile-first) ──────────────────── */}
            <Reveal>
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="font-display text-lg font-bold text-charcoal">
                  Your Order
                </h2>
                <div className="mt-4 space-y-3">
                  {items.map((item) => {
                    const images = getProductImages(item.product);
                    const thumb = images[0]?.src;
                    return (
                      <div
                        key={item.productSlug}
                        className="flex items-center gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
                          {thumb && (
                            <img
                              src={thumb}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                          {item.quantity > 1 && (
                            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                              {item.quantity}
                            </span>
                          )}
                        </div>
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-semibold text-charcoal">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.product.hp} HP · {item.product.model}
                          </p>
                        </div>
                        {/* Price */}
                        <p className="shrink-0 text-sm font-bold text-charcoal">
                          {item.itemTotalDisplay}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Totals row */}
                <div className="mt-4 space-y-2 border-t border-border pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Machine Cost</span>
                    <span className="font-semibold text-charcoal">{subtotalDisplay}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      Shipping <Truck className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                </div>

                {/* Total payable */}
                <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                  <span className="font-display text-base font-bold text-charcoal">
                    Total
                  </span>
                  <span className="font-display text-xl font-bold text-accent">
                    {subtotalDisplay}
                  </span>
                </div>
              </div>
            </Reveal>

            {/* ── Contact ──────────────────────────────────────────────── */}
            <Reveal delay={60}>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-accent" />
                  <h2 className="font-display text-lg font-bold text-charcoal">
                    Contact
                  </h2>
                </div>
                <FormField
                  id="phone"
                  label="Mobile number"
                  placeholder="98250 12345"
                  type="tel"
                  value={form.phone}
                  error={errors.phone}
                  onChange={(v) => updateField("phone", v)}
                  autoComplete="tel"
                />
              </div>
            </Reveal>

            {/* ── Delivery ─────────────────────────────────────────────── */}
            <Reveal delay={100}>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <h2 className="font-display text-lg font-bold text-charcoal">
                    Delivery
                  </h2>
                </div>

                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    id="firstName"
                    label="First name"
                    value={form.firstName}
                    error={errors.firstName}
                    onChange={(v) => updateField("firstName", v)}
                    autoComplete="given-name"
                  />
                  <FormField
                    id="lastName"
                    label="Last name"
                    value={form.lastName}
                    error={errors.lastName}
                    onChange={(v) => updateField("lastName", v)}
                    autoComplete="family-name"
                  />
                </div>

                {/* Address */}
                <FormField
                  id="address"
                  label="Address"
                  placeholder="Building, street, area"
                  value={form.address}
                  error={errors.address}
                  onChange={(v) => updateField("address", v)}
                  autoComplete="street-address"
                />

                {/* City / State / PIN */}
                <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
                  <FormField
                    id="city"
                    label="City"
                    value={form.city}
                    error={errors.city}
                    onChange={(v) => updateField("city", v)}
                    autoComplete="address-level2"
                  />

                  {/* State dropdown */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="state"
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      State
                    </label>
                    <select
                      id="state"
                      value={form.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      autoComplete="address-level1"
                      className={cn(
                        "w-full appearance-none rounded-xl border bg-background px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-accent",
                        errors.state
                          ? "border-destructive"
                          : "border-border",
                        !form.state && "text-muted-foreground",
                      )}
                    >
                      <option value="" disabled>
                        State
                      </option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-xs text-destructive">{errors.state}</p>
                    )}
                  </div>

                  {/* PIN code */}
                  <div className="w-28">
                    <FormField
                      id="pincode"
                      label="PIN code"
                      placeholder="380001"
                      maxLength={6}
                      inputMode="numeric"
                      value={form.pincode}
                      error={errors.pincode}
                      onChange={(v) =>
                        updateField("pincode", v.replace(/\D/g, "").slice(0, 6))
                      }
                      autoComplete="postal-code"
                      suffix={
                        pincodeLooking ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                        ) : null
                      }
                    />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── Payment ──────────────────────────────────────────────── */}
            <Reveal delay={140}>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-accent" />
                  <h2 className="font-display text-lg font-bold text-charcoal">
                    Payment
                  </h2>
                </div>

                <div className="rounded-xl border border-border bg-secondary/30 p-4">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-semibold text-charcoal">
                      Razorpay Secure
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    After clicking "Pay now", you will be redirected to Razorpay
                    Secure to complete your purchase safely via UPI, Credit/Debit
                    Card, or Netbanking.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* ── Payment error ──────────────────────────────────────── */}
            {paymentError && (
              <Reveal>
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {paymentError}
                </div>
              </Reveal>
            )}

            {/* ── Actions (mobile: sticky bottom, desktop: inline) ──────── */}
            <Reveal delay={160}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  to="/products"
                  search={{}}
                  className="order-2 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent sm:order-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to shopping
                </Link>

                <button
                  type="submit"
                   disabled={submitting || !razorpayReady}
                  className="order-1 inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-70 sm:order-2"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : !razorpayReady ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  {!razorpayReady ? "Loading secure checkout…" : "Pay now"}
                </button>
              </div>
            </Reveal>
          </form>

          {/* ─────────────────────── RIGHT: Sticky summary (desktop) ────── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <Reveal delay={80}>
                {/* Company branding */}
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4">
                  <img
                    src="/favicon.png"
                    alt={site.shortName}
                    className="h-10 w-10 rounded-lg object-contain"
                  />
                  <div>
                    <p className="text-sm font-bold text-charcoal leading-tight">
                      {site.name}
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-display text-lg font-bold text-charcoal">
                    Order Summary
                  </h3>

                  <div className="mt-4 space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.productSlug}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {item.product.name}{" "}
                          {item.quantity > 1 && (
                            <span className="text-xs">×{item.quantity}</span>
                          )}
                        </span>
                        <span className="font-semibold text-charcoal">
                          {item.itemTotalDisplay}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2 border-t border-border pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Machine Cost</span>
                      <span className="font-semibold text-charcoal">
                        {subtotalDisplay}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                    <span className="font-display text-base font-bold text-charcoal">
                      Total
                    </span>
                    <span className="font-display text-2xl font-bold text-accent">
                      {subtotalDisplay}
                    </span>
                  </div>
                </div>
              </Reveal>

              {/* Trust badges */}
              <Reveal delay={160}>
                <div className="flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3 text-xs text-green-700">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>
                    256-bit SSL encrypted · Secured by Razorpay · UPI, Cards &
                    Netbanking accepted
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Reusable form field ─────────────────────────────────────────────────── */
function FormField({
  id,
  label,
  value,
  error,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  inputMode,
  autoComplete,
  suffix,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  inputMode?: "text" | "numeric" | "tel" | "email";
  autoComplete?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? label}
          maxLength={maxLength}
          inputMode={inputMode}
          autoComplete={autoComplete}
          className={cn(
            "w-full rounded-xl border bg-background px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-accent",
            error ? "border-destructive" : "border-border",
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
