import { useCountUp } from "@/hooks/use-reveal";

const stats = [
  { value: 22, suffix: "+", label: "Years of engineering" },
  { value: 4200, suffix: "+", label: "Machines commissioned" },
  { value: 19, suffix: "", label: "States served" },
  { value: 30, suffix: " HP", label: "Maximum drive rating" },
];

export function StatStrip() {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </div>
  );
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, value: current } = useCountUp(value);

  return (
    <div ref={ref} className="bg-card px-6 py-8 text-center sm:text-left">
      <p className="font-display text-4xl font-bold text-primary">
        {current.toLocaleString("en-IN")}
        <span className="text-accent">{suffix}</span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
