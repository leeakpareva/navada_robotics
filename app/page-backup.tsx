"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import * as BootstrapIcons from "react-bootstrap-icons"
import Link from "next/link"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { Vortex } from "@/components/ui/vortex"
import { ShootingStars } from "@/components/ui/shooting-stars"
import { GradientBackground } from "@/components/ui/gradient-background"

export default function NavadaRoboticsApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <h1 className="text-white text-4xl p-8">NAVADA Robotics</h1>
      <p className="text-white p-8">Loading...</p>
    </div>
  )
}