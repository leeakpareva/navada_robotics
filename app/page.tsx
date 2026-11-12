import { ArrowRight, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Float, Parallax, Reveal, Tilt } from "@/components/motion";
import { Robots } from "@/components/robots";

const tiles = [
  { n: "01", title: "UK supply", text: "Through the official channel.", img: "/detail-head.webp", span: "md:row-span-2 min-h-[340px] md:min-h-0", pos: "object-top" },
  { n: "02", title: "Set-up and support", text: "From NAVADA, backed by Booster.", img: "/detail-motion.webp", span: "md:col-span-2", pos: "object-center" },
  { n: "03", title: "Applied AI", text: "Software that puts the robot to work.", img: "/detail-horizon.webp", span: "md:col-span-2", pos: "object-center" },
];

const ticker = ["Booster K1", "Booster T2", "UK supply", "Set-up and support", "Applied AI", "Embodied AI", "Humanoid robots"];
const mail = "mailto:lee@navada.info?subject=Booster%20Robotics%20enquiry";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[900px] bg-[radial-gradient(60%_50%_at_70%_20%,rgba(64,96,190,0.35),transparent_70%),radial-gradient(40%_30%_at_75%_75%,rgba(240,138,75,0.22),transparent_70%)]" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <a href="#top" className="text-sm font-semibold tracking-[0.28em]">NAVADA <span className="text-primary">ROBOTICS</span></a>
        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><a href="#partnership">Partnership</a></Button>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><a href="#robots">Robots</a></Button>
          <Button asChild size="sm"><a href={mail}>Contact</a></Button>
        </nav>
      </header>

      <section id="top" className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-8 md:grid-cols-[1fr_1.1fr] md:pt-12">
        <Reveal>
          <Badge><span className="size-1.5 rounded-full bg-primary" />Official Booster Robotics Partner, UK</Badge>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
            Humanoid robots <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">for the UK.</span>
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><a href={mail}>Talk to us <ArrowRight aria-hidden /></a></Button>
            <Button asChild size="lg" variant="outline"><a href="#robots">See the robots</a></Button>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <Tilt>
            <Float>
              <figure className="relative mx-auto max-w-md md:max-w-none">
                <div aria-hidden className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-primary/30 via-transparent to-accent/30 blur-2xl" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/hero.webp" alt="NAVADA x Booster Tech: a humanoid robot posed against a sunset sky" width={1212} height={1297} className="relative w-full rounded-3xl border shadow-2xl" fetchPriority="high" />
                <figcaption className="mt-3 text-center text-xs text-muted-foreground">Partnership artwork. Illustrative, not a product photograph.</figcaption>
              </figure>
            </Float>
          </Tilt>
        </Reveal>
      </section>

      <div className="relative border-y bg-card/40 py-4" aria-hidden>
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {ticker.map((t) => (
                <span key={t} className="flex items-center gap-8 pr-8 text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
                  {t}<span className="size-1.5 rotate-45 bg-primary" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section id="partnership" className="relative mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Booster builds. NAVADA delivers.</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3 md:grid-rows-2">
          {tiles.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.08} className={`${t.span} flex`}>
              <article className="group relative min-h-[220px] w-full overflow-hidden rounded-2xl border md:min-h-[240px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} alt="" loading="lazy" className={`absolute inset-0 size-full object-cover ${t.pos} transition-transform duration-700 ease-out group-hover:scale-110`} />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-6">
                  <span className="text-xs font-medium tracking-[0.3em] text-accent">{t.n}</span>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="robots" className="relative mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">The robots</h2>
          <div className="mt-8"><Robots /></div>
        </Reveal>
      </section>

      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/30">
            <Parallax src="/detail-horizon.webp" className="absolute inset-0 overflow-hidden" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10" />
            <div className="relative flex flex-col items-start gap-6 p-8 md:p-14">
              <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">Let&apos;s talk robots.</h2>
              <Button asChild size="lg"><a href={mail}><Mail aria-hidden />lee@navada.info</a></Button>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="relative border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 NAVADA. Official Booster Robotics Partner, UK.</p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <a className="hover:text-foreground" href="https://www.booster.tech" target="_blank" rel="noreferrer">booster.tech</a>
            <a className="hover:text-foreground" href="mailto:lee@navada.info">lee@navada.info</a>
            <span>Built with Next.js and shadcn/ui</span>
          </p>
        </div>
      </footer>
    </main>
  );
}
