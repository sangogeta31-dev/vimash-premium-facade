import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import bandImg from "@/assets/industrial-band.jpg";
import t1 from "@/assets/testimonial-1.jpg";
import t2 from "@/assets/testimonial-2.jpg";
import t3 from "@/assets/testimonial-3.jpg";
import { Reveal } from "@/components/Reveal";

/**
 * Testimonials are plain data — edit the text or swap the imported images
 * above to update this section. No backend involved.
 */
const testimonials = [
  {
    image: t1,
    quote:
      "We run our 10 HP atta chakki all day. Flour quality is good and the machine has not given us any trouble.",
    name: "Rakesh Patel",
    role: "Flour mill owner · Ahmedabad",
  },
  {
    image: t2,
    quote:
      "Three 20 HP masala lines running two shifts a day for four years. Screens and hammers get changed, nothing else has.",
    name: "Suresh Nair",
    role: "Production head · Spice unit, Rajkot",
  },
  {
    image: t3,
    quote:
      "Installation was quick and the team explained everything. Spare parts reach us in a few days whenever we ask.",
    name: "Priya Sharma",
    role: "Food processing unit · Surat",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const item = testimonials[i];
  const go = (dir: number) =>
    setI((p) => (p + dir + testimonials.length) % testimonials.length);

  return (
    <section className="relative isolate overflow-hidden section-navy">
      <img
        src={bandImg}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={1920}
        height={1088}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--primary) 88%, transparent), color-mix(in oklab, var(--primary) 94%, transparent))",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-20">
        <Reveal>
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Customer stories
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-primary-foreground sm:text-4xl">
              Trusted on the shop floor
            </h2>
          </div>

          <div className="mt-8 grid items-center gap-6 rounded-3xl border border-primary-foreground/12 bg-primary-foreground/5 p-6 backdrop-blur-sm sm:p-8 lg:mt-12 lg:grid-cols-[220px_1fr] lg:gap-10 lg:p-10">
            <img
              key={item.image}
              src={item.image}
              alt={item.name}
              loading="lazy"
              width={800}
              height={800}
              className="mx-auto h-32 w-32 rounded-2xl object-cover shadow-[var(--shadow-elevated)] sm:h-40 sm:w-40 lg:h-52 lg:w-52"
            />
            <div className="text-center lg:text-left">
              <Quote className="mx-auto h-6 w-6 text-accent lg:mx-0" />
              <blockquote className="mt-4 font-display text-lg font-semibold leading-snug text-primary-foreground sm:text-2xl">
                “{item.quote}”
              </blockquote>
              <p className="mt-5 text-sm font-semibold text-primary-foreground">
                {item.name}
              </p>
              <p className="mt-1 text-sm text-primary-foreground/60">{item.role}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="grid h-11 w-11 place-items-center rounded-full border border-primary-foreground/20 text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((t, idx) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setI(idx)}
                  aria-label={`Show testimonial ${idx + 1}`}
                  className={
                    idx === i
                      ? "h-2 w-6 rounded-full bg-accent transition-all"
                      : "h-2 w-2 rounded-full bg-primary-foreground/30 transition-all"
                  }
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="grid h-11 w-11 place-items-center rounded-full border border-primary-foreground/20 text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
