import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductImage } from "@/data/product-images";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  badge,
  className,
}: {
  images: ProductImage[];
  badge?: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  useEffect(() => {
    setIndex(0);
  }, [images]);

  const go = useCallback(
    (dir: number) => setIndex((i) => (count === 0 ? 0 : (i + dir + count) % count)),
    [count],
  );

  if (count === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={img.src + i} className="w-full shrink-0 grow-0 basis-full p-6 sm:p-10">
              <div className="flex h-[260px] items-center justify-center sm:h-[380px] lg:h-[420px]">
                <img
                  src={img.src}
                  alt={img.alt ?? ""}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="max-h-full max-w-full object-contain drop-shadow-[0_40px_60px_oklch(0.22_0.062_258/0.18)]"
                />
              </div>
            </div>
          ))}
        </div>

        {badge ? (
          <span className="pointer-events-none absolute left-6 top-6 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground sm:left-8 sm:top-8">
            {badge}
          </span>
        ) : null}

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-card/90 text-charcoal shadow-[var(--shadow-elevated)] backdrop-blur transition-colors hover:border-accent hover:text-accent sm:left-4"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-card/90 text-charcoal shadow-[var(--shadow-elevated)] backdrop-blur transition-colors hover:border-accent hover:text-accent sm:right-4"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {images.map((img, i) => (
              <button
                key={"t" + img.src + i}
                type="button"
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-16 w-20 shrink-0 overflow-hidden rounded-xl border bg-card p-1.5 transition-colors sm:h-20 sm:w-24",
                  i === index ? "border-accent" : "border-border hover:border-accent/50",
                )}
              >
                <img src={img.src} alt="" loading="lazy" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>

          <div className="mt-3 flex justify-center gap-2 sm:hidden">
            {images.map((img, i) => (
              <button
                key={"d" + img.src + i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-6 bg-accent" : "w-2 bg-border",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
