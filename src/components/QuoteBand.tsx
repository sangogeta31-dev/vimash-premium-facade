import { CallbackForm } from "@/components/CallbackForm";
import { Reveal } from "@/components/Reveal";

export function QuoteBand({
  title = "Get a price for your requirement",
  description = "Leave your mobile number — our engineer calls back with the right HP rating and a clear quotation.",
  machineName,
  machineSlug,
  source = "Quote band",
}: {
  title?: string;
  description?: string;
  machineName?: string;
  machineSlug?: string;
  source?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden section-navy blueprint-dark">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:px-8 lg:py-20">
        <Reveal>
          <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-lg text-primary-foreground/70">{description}</p>
        </Reveal>
        <Reveal delay={120}>
          <CallbackForm
            variant="dark"
            machineName={machineName}
            machineSlug={machineSlug}
            source={source}
          />
        </Reveal>

      </div>
    </section>
  );
}
