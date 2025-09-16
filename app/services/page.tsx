"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BeamsBackground } from "@/components/ui/beams-background"
import { OptimizedImage } from "@/components/ui/optimized-image"
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Cpu,
  Menu,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
  Wrench,
  X,
} from "lucide-react"

const serviceOfferings = [
  {
    title: "Robotics Systems Engineering",
    description:
      "End-to-end robotics development covering hardware selection, control architecture, and production-ready firmware for Raspberry Pi platforms.",
    image: "/RaspberryPiAutomation.png",
    highlights: ["System architecture", "Sensor & actuator integration", "Real-time control software"],
  },
  {
    title: "AI Agent Development",
    description:
      "Design and deployment of autonomous AI agents that orchestrate conversations, automate workflows, and plug into MCP servers and existing tools.",
    image: "/AiCreative.png",
    highlights: ["Conversational design", "Workflow automation", "MCP integrations"],
  },
  {
    title: "Computer Vision Solutions",
    description:
      "Custom vision pipelines for perception, inspection, and safety—complete with model training, optimization, and edge deployment.",
    image: "/ManvsMachine.png",
    highlights: ["Model training", "Real-time inference", "Edge deployment"],
  },
  {
    title: "Research Consulting & Training",
    description:
      "Hands-on consulting sessions, lab setup guidance, and curriculum design to accelerate robotics and AI research initiatives.",
    image: "/EducationnalWorkshops.png",
    highlights: ["Innovation sprints", "Curriculum design", "Team enablement"],
  },
]

const processSteps = [
  {
    title: "Discover",
    description:
      "Collaborative workshops to align on success metrics, hardware constraints, and integration requirements.",
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    title: "Design",
    description:
      "System architecture, data pipelines, and UX flows crafted to match your roadmap and compliance needs.",
    icon: <Workflow className="w-6 h-6" />,
  },
  {
    title: "Build",
    description:
      "Rapid prototyping with Raspberry Pi and cloud tooling, followed by iterative validation with real data.",
    icon: <Cpu className="w-6 h-6" />,
  },
  {
    title: "Launch & Support",
    description:
      "Deployment playbooks, monitoring, and knowledge transfer so your team can operate and evolve the solution confidently.",
    icon: <Rocket className="w-6 h-6" />,
  },
]

const supportPlans = [
  {
    title: "Prototype Sprint",
    description: "Focused 2–4 week engagement to prove feasibility and deliver a working demo.",
    badge: "Popular",
    items: ["Requirements discovery", "Hardware & tooling recommendations", "Technical roadmap"],
  },
  {
    title: "Production Launch",
    description: "Implementation partnership to harden your robotics or AI system for production use.",
    items: ["Architecture & security reviews", "CI/CD automation", "Launch readiness checklist"],
  },
  {
    title: "Managed Support",
    description: "Ongoing optimization, monitoring, and model refresh cycles tailored to your release cadence.",
    items: ["Performance audits", "Retraining & dataset curation", "Quarterly strategy reviews"],
  },
]

export default function ServicesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black relative">
      <BeamsBackground />

      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <h1 className="text-2xl font-bold text-white">NAVADA</h1>
            </Link>

            <button
              className="md:hidden text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 p-2 rounded"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation"
            >
              <div className="transition-transform duration-200">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </div>
            </button>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-purple-400 transition-all duration-200">
                <ArrowLeft className="h-4 w-4 mr-2 inline" />
                Home
              </Link>
              <Link href="/solutions" className="text-white hover:text-purple-400 transition-all duration-200">
                Solutions
              </Link>
              <span className="text-purple-400 font-semibold">Services</span>
              <Link href="/about" className="text-white hover:text-purple-400 transition-all duration-200">
                About
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-all duration-200">
                Contact
              </Link>
            </nav>
          </div>

          <div
            className={`md:hidden mt-4 pb-4 border-t border-gray-800 pt-4 transition-all duration-300 ${isMenuOpen ? "block" : "hidden"}`}
          >
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-white hover:text-purple-400 transition-all duration-200">
                <ArrowLeft className="h-4 w-4 mr-2 inline" />
                Home
              </Link>
              <Link href="/solutions" className="text-white hover:text-purple-400 transition-all duration-200">
                Solutions
              </Link>
              <span className="text-purple-400 font-semibold">Services</span>
              <Link href="/about" className="text-white hover:text-purple-400 transition-all duration-200">
                About
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-all duration-200">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="relative">
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center relative z-10">
            <div className="inline-flex items-center bg-purple-900/30 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <Wrench className="w-4 h-4 mr-2 text-purple-400" />
              <span className="text-purple-200 text-sm">Strategic Robotics & AI Services</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400">
              Build, launch, and scale intelligent robotics systems
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              From Raspberry Pi prototypes to production-ready AI agents, we help teams validate ideas fast, deliver reliable automation, and keep systems operating smoothly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-8 bg-purple-600 hover:bg-purple-700 transition-all duration-200">
                  Start a project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/solutions">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 bg-transparent border-purple-400 text-purple-400 hover:bg-purple-900 transition-all duration-200"
                >
                  View case studies
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-900/40">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Service Offerings</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Tailored engagements that combine robotics engineering, AI research, and product delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviceOfferings.map((service, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 hover:border-purple-400/50 bg-black/30 border-white/20 overflow-hidden backdrop-blur-sm hover:bg-black/40"
                >
                  <div className="relative overflow-hidden">
                    <OptimizedImage
                      src={service.image || `/placeholder.svg?height=240&width=400&text=${encodeURIComponent(service.title)}`}
                      alt={service.title}
                      width={400}
                      height={240}
                      quality={85}
                      className="w-full h-56 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm leading-relaxed">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.highlights.map((highlight, highlightIndex) => (
                        <span
                          key={highlightIndex}
                          className="px-3 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full border border-purple-500/30"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">How we work</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                A collaborative delivery process that keeps stakeholders aligned and momentum high from kick-off through launch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <Card key={index} className="bg-black/30 border-white/20 hover:border-purple-400/50 backdrop-blur-sm hover:bg-black/40 transition-all duration-300">
                  <CardContent className="pt-6 space-y-4">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
                      {step.icon}
                    </div>
                    <h3 className="text-white text-lg font-semibold text-center">{step.title}</h3>
                    <p className="text-gray-300 text-sm text-center">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-900/40">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Engagement Options</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Flexible support whether you need a rapid prototype, a production partner, or a long-term co-pilot.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {supportPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`bg-black/30 border-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-black/40 hover:border-purple-400/50 ${
                    plan.badge ? "relative" : ""
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute top-4 right-4 px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/40">
                      {plan.badge}
                    </span>
                  )}
                  <CardHeader>
                    <CardTitle className="text-white text-xl">{plan.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{plan.description}</p>
                    <ul className="space-y-2">
                      {plan.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2 text-sm text-gray-200">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">What you can expect</h2>
              <ul className="space-y-4 text-gray-300 text-sm">
                <li className="flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-purple-400 mt-0.5" />
                  <span>Clear documentation, version control, and deployment playbooks that keep cross-functional teams aligned.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Bot className="w-5 h-5 text-purple-400 mt-0.5" />
                  <span>Responsible AI guidance covering data privacy, evaluation metrics, and human-in-the-loop safeguards.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Cpu className="w-5 h-5 text-purple-400 mt-0.5" />
                  <span>Hardware-aware optimizations that maximize performance on Raspberry Pi, Jetson, and other edge platforms.</span>
                </li>
              </ul>
            </div>
            <Card className="bg-black/30 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-white text-xl font-semibold">Kick off your next project</h3>
                <p className="text-gray-300 text-sm">
                  Share your goals and constraints, and we'll craft a tailored plan with milestones, success metrics, and the right blend of consulting and delivery support.
                </p>
                <Link href="/contact">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Schedule a discovery call
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-8 px-4 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-xl font-bold text-white">NAVADA</span>
          </div>
          <p className="text-gray-300 mb-2">© 2024 NAVADA. All rights reserved.</p>
          <p className="text-gray-400 text-sm mb-2">Navigating Artistic Vision with Advanced Digital Assistance</p>
          <p className="text-purple-400 text-sm">Designed &amp; Developed by Lee Akpareva MBA, MA</p>
        </div>
      </footer>
    </div>
  )
}
