import { ArrowRight, Cpu, Mail, ShieldCheck, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Float, Reveal } from "@/components/motion";
import { Robots } from "@/components/robots";

const pillars = [
  { icon: Truck, title: "UK supply", text: "Booster robots sourced through the official channel and delivered to you in the United Kingdom." },
  { icon: ShieldCheck, title: "Set-up and support", text: "First-line support from NAVADA in the UK, backed by Booster Robotics and the manufacturer warranty." },
  { icon: Cpu, title: "Applied AI", text: "NAVADA builds the software that puts the robot to work: autonomy, perception, data capture and reporting." },
];

const mail = "mailto:lee@navada.info?subject=Booster%20Robotics%20enquiry";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[900px] bg-[radial-gradient(60%_50%_at_70%_20%,rgba(64,96,190,0.35),transparent_70%),radial-gradient(40%_30%_at_75%_75%,rgba(240,138,75,0.22),transparent_70%)]" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <a href="#top" className="text-sm font-semibold tracking-[0.28em]">NAVADA <span className="text-primary">ROBOTICS</span></a>
        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><a href="#robots">Robots</a></Button>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><a href="#partnership">Partnership</a></Button>
          <Button asChild size="sm"><a href={mail}>Contact</a></Button>
        </nav>
      </header>

      <section id="top" className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-8 md:grid-cols-2 md:pt-14">
        <Reveal>
          <Badge><span className="size-1.5 rounded-full bg-primary" />Official Booster Robotics Partner, UK</Badge>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Humanoid robots, <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">supplied and supported in the UK.</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            NAVADA has partnered with Booster Robotics to bring the K1 and T2 humanoid robots to UK organisations, with the applied AI to make them useful.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><a href={mail}>Talk to us <ArrowRight aria-hidden /></a></Button>
            <Button asChild size="lg" variant="outline"><a href="#robots">See the robots</a></Button>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <Float>
            <figure className="relative mx-auto max-w-md md:max-w-none">
              <div aria-hidden className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-primary/30 via-transparent to-accent/30 blur-2xl" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hero.webp" alt="NAVADA x Booster Tech: a humanoid robot posed against a sunset sky" width={1212} height={1297} className="relative w-full rounded-3xl border shadow-2xl" fetchPriority="high" />
              <figcaption className="mt-3 text-center text-xs text-muted-foreground">Partnership artwork. Illustrative, not a product photograph.</figcaption>
            </figure>
          </Float>
        </Reveal>
      </section>

      <section id="partnership" className="relative mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">The partnership</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Booster Robotics builds the robots. NAVADA supplies and supports them in the UK, and develops the AI applications that run on them.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_18px_50px_-24px_var(--primary)]">
                <CardHeader>
                  <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <p.icon className="size-5" aria-hidden />
                  </span>
                  <CardTitle>{p.title}</CardTitle>
                  <CardDescription>{p.text}</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="robots" className="relative mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">The robots</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Two humanoid platforms from Booster Robotics, built for developers.</p>
          <div className="mt-8"><Robots /></div>
        </Reveal>
      </section>

      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-secondary to-card">
            <div aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/25 blur-3xl" />
            <CardHeader className="relative items-start gap-4 p-8 md:p-12">
              <CardTitle className="text-3xl md:text-4xl">Interested in a Booster robot?</CardTitle>
              <CardDescription className="max-w-xl text-base">Tell us what you want it to do. We will advise on the right platform, pricing and delivery.</CardDescription>
              <Button asChild size="lg"><a href={mail}><Mail aria-hidden />lee@navada.info</a></Button>
            </CardHeader>
          </Card>
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
