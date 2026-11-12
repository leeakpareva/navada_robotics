"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CountUp } from "@/components/motion";
import { gallery, type GalleryImage } from "@/lib/gallery";

type Stat = { label: string; to: number; decimals?: number; suffix?: string };
type Robot = { id: "k1" | "t2"; name: string; short: string; tag: string; line: string; stats: Stat[]; chips: string[] };

const robots: Robot[] = [
  {
    id: "k1", name: "Booster K1", short: "K1", tag: "Compact humanoid",
    line: "Light enough for one person to carry and deploy.",
    stats: [
      { label: "Height", to: 95, suffix: " cm" },
      { label: "Weight", to: 19.5, decimals: 1, suffix: " kg" },
      { label: "Degrees of freedom", to: 22 },
    ],
    chips: ["Depth camera", "Mic array", "Python SDK", "ROS 2"],
  },
  {
    id: "t2", name: "Booster T2", short: "T2", tag: "Flagship humanoid",
    line: "Booster's flagship platform for embodied AI.",
    stats: [],
    chips: ["Full-size platform", "Open SDK", "Custom sensors", "Specs on request"],
  },
];

function Orbit({ label }: { label: string }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[280px]">
      <svg viewBox="0 0 200 200" className="size-full" aria-hidden>
        <defs>
          <linearGradient id="orbit-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f08a4b" /><stop offset="1" stopColor="#e5262d" />
          </linearGradient>
        </defs>
        <circle className="orbit-c" cx="100" cy="100" r="46" fill="none" stroke="url(#orbit-g)" strokeWidth="1.5" />
        <circle className="orbit-a" cx="100" cy="100" r="68" fill="none" stroke="url(#orbit-g)" strokeWidth="3" strokeLinecap="round" strokeDasharray="90 337" />
        <circle className="orbit-b" cx="100" cy="100" r="88" fill="none" stroke="#4060be" strokeWidth="2" strokeLinecap="round" strokeDasharray="40 98" />
        <circle cx="100" cy="100" r="96" fill="none" stroke="#223060" strokeWidth="1" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-5xl font-semibold tracking-tight">{label}</span>
    </div>
  );
}

function Gallery({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) return null;
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
      {images.map((img) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={img.src} src={img.src} alt={img.alt} loading="lazy" className="aspect-[4/5] w-full rounded-lg border object-cover transition-transform duration-500 hover:scale-[1.03]" />
      ))}
    </div>
  );
}

export function Robots() {
  const [active, setActive] = React.useState<Robot["id"]>("k1");
  const r = robots.find((x) => x.id === active)!;
  return (
    <Tabs value={active} onValueChange={(v) => setActive(v as Robot["id"])} className="w-full">
      <TabsList>
        {robots.map((x) => (
          <TabsTrigger key={x.id} value={x.id}>{x.name}</TabsTrigger>
        ))}
      </TabsList>
      <Card className="mt-6 overflow-hidden bg-gradient-to-br from-card to-secondary/40">
        <CardContent className="p-6 md:p-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={r.id}
              role="tabpanel"
              aria-label={r.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid items-center gap-8 md:grid-cols-[1fr_280px]">
                <div>
                  <Badge variant="secondary" className="w-fit">{r.tag}</Badge>
                  <h3 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">{r.name}</h3>
                  <p className="mt-3 text-lg text-muted-foreground">{r.line}</p>
                  {r.stats.length > 0 && (
                    <dl className="mt-6 grid grid-cols-3 gap-3">
                      {r.stats.map((s) => (
                        <div key={s.label} className="rounded-lg border bg-background/50 p-4">
                          <dd className="whitespace-nowrap text-xl font-semibold tabular-nums sm:text-2xl md:text-3xl">
                            <CountUp to={s.to} decimals={s.decimals ?? 0} suffix={s.suffix ?? ""} />
                          </dd>
                          <dt className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</dt>
                        </div>
                      ))}
                    </dl>
                  )}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {r.chips.map((c) => (
                      <Badge key={c} variant="outline" className="text-foreground">{c}</Badge>
                    ))}
                  </div>
                </div>
                <Orbit label={r.short} />
              </div>
              <Gallery images={gallery[r.id]} />
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </Tabs>
  );
}
