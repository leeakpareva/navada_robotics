"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CountUp } from "@/components/motion";
import { gallery, type GalleryImage } from "@/lib/gallery";

const robots = [
  {
    id: "k1",
    name: "Booster K1",
    tag: "Compact humanoid",
    summary: "A compact, lightweight humanoid for education, research and applied AI projects. Small enough for one person to carry and deploy.",
    stats: [
      { label: "Height", to: 95, suffix: " cm" },
      { label: "Weight", to: 19.5, decimals: 1, suffix: " kg" },
      { label: "Degrees of freedom", to: 22 },
    ],
    points: ["Stereo depth camera, microphone array and IMU", "Booster SDK with Python and ROS 2 support", "A practical first platform for embodied AI"],
  },
  {
    id: "t2",
    name: "Booster T2",
    tag: "Flagship humanoid",
    summary: "Booster's flagship humanoid, built as an embodied AI development platform for research and real-world application development.",
    stats: [],
    points: ["Full-size development platform for demanding tasks", "Open to custom behaviours, sensors and software", "Full specification available from NAVADA on request"],
  },
] as const;

function Gallery({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) return null;
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
      {images.map((img) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={img.src} src={img.src} alt={img.alt} loading="lazy" className="aspect-[4/5] w-full rounded-lg border object-cover" />
      ))}
    </div>
  );
}

export function Robots() {
  return (
    <Tabs defaultValue="k1" className="w-full">
      <TabsList>
        {robots.map((r) => (
          <TabsTrigger key={r.id} value={r.id}>{r.name}</TabsTrigger>
        ))}
      </TabsList>
      {robots.map((r) => (
        <TabsContent key={r.id} value={r.id}>
          <Card className="overflow-hidden bg-gradient-to-br from-card to-secondary/40">
            <CardHeader>
              <Badge variant="secondary" className="w-fit">{r.tag}</Badge>
              <CardTitle className="text-2xl md:text-3xl">{r.name}</CardTitle>
              <CardDescription className="max-w-2xl text-base">{r.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              {r.stats.length > 0 && (
                <dl className="mb-6 grid grid-cols-3 gap-3">
                  {r.stats.map((s) => (
                    <div key={s.label} className="rounded-lg border bg-background/50 p-4">
                      <dd className="whitespace-nowrap text-xl font-semibold tabular-nums sm:text-2xl md:text-3xl">
                        <CountUp to={s.to} decimals={"decimals" in s ? s.decimals : 0} suffix={"suffix" in s ? s.suffix : ""} />
                      </dd>
                      <dt className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</dt>
                    </div>
                  ))}
                </dl>
              )}
              <ul className="grid gap-3 md:grid-cols-3">
                {r.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <Gallery images={gallery[r.id]} />
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
