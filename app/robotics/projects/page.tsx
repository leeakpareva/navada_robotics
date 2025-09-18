"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Menu, X, ArrowLeft, Car, Bot, Code, Wrench, Lightbulb, Camera, Zap, Gamepad2, CircuitBoard, Cpu } from "lucide-react"
import Link from "next/link"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { BeamsBackground } from "@/components/ui/beams-background"

export default function RoboticsProjectsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const buildSteps = {
    picar: [
      "Assemble chassis & connect motors/sensors",
      "Mount Raspberry Pi and camera module",
      "Wire ultrasonic + line tracking sensors",
      "Flash Raspberry Pi OS and set up WiFi",
      "Install software stack: pip install opencv-python sunfounder-picar-x"
    ],
    picrawler: [
      "Assemble frame & attach 12 servos",
      "Connect to Pi via Robot HAT",
      "Map servos (0–11: hips, knees, ankles)",
      "Calibrate ready stance with a Python script",
      "Install software: pip install robot-hat"
    ]
  }

  const codeExamples = {
    picar: `import cv2
cap = cv2.VideoCapture(0)
while True:
    ret, frame = cap.read()
    edges = cv2.Canny(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), 50, 150)
    cv2.imshow("Lane Detection", edges)
    if cv2.waitKey(1) == ord("q"): break`,
    picrawler: `from robot_hat import Servo
import time

leg = Servo(3)  # Servo P3
for angle in [0, 45, 90, 45, 0]:
    leg.angle(angle)
    time.sleep(0.5)`
  }

  return (
    <div className="min-h-screen bg-black relative">
      <BeamsBackground />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <h1 className="text-2xl font-bold text-white">NAVADA</h1>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 p-2 rounded"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="transition-transform duration-200">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </div>
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/robotics" className="text-white hover:text-purple-400 transition-all duration-200">
                <ArrowLeft className="h-4 w-4 mr-2 inline" />
                Robotics
              </Link>
              <Link href="/solutions" className="text-white hover:text-purple-400 transition-all duration-200">
                Solutions
              </Link>
              <Link href="/ai-agent-development" className="text-white hover:text-purple-400 transition-all duration-200">
                AI Agents
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-all duration-200">
                Contact
              </Link>
            </nav>
          </div>

          {/* Mobile navigation */}
          <div className={`md:hidden mt-4 pb-4 border-t border-gray-800 pt-4 transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <nav className="flex flex-col space-y-3">
              <Link href="/robotics" className="text-white hover:text-purple-400 transition-all duration-200">
                <ArrowLeft className="h-4 w-4 mr-2 inline" />
                Robotics
              </Link>
              <Link href="/solutions" className="text-white hover:text-purple-400 transition-all duration-200">
                Solutions
              </Link>
              <Link href="/ai-agent-development" className="text-white hover:text-purple-400 transition-all duration-200">
                AI Agents
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-all duration-200">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-full px-6 py-3 mb-8">
            <Bot className="w-5 h-5 mr-3 text-purple-400" />
            <span className="text-purple-200 text-lg font-medium">Hands-On Robotics Projects</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-balance tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-cyan-400">
            PiCar-X & PiCrawler
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Explore autonomous driving and quadruped locomotion through these innovative Raspberry Pi robotics projects.
            Build the foundation for understanding AI robotics, computer vision, and real-world automation.
          </p>
        </div>
      </section>

      {/* PiCar-X Project */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">Project 1: PiCar-X</h2>
                  <div className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm inline-block">
                    Active Development
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-300 leading-relaxed">
                PiCar-X is a Raspberry Pi–powered smart car that explores autonomous driving, real-time computer vision, and IoT robotics.
                It brings together the same technologies used in self-driving cars—sensors, cameras, AI algorithms—but in a safe, affordable, and hands-on platform.
              </p>

              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-6 h-6 text-yellow-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Why It Matters</h3>
                </div>
                <p className="text-gray-300">
                  PiCar-X helps you understand how AI interprets the world through sensors and cameras. The same principles power autonomous vehicles,
                  delivery robots, and drones. By building this project, you get hands-on experience in edge AI—teaching a car to "see" and react in real time.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                      <span className="text-gray-400">PiCar-X Chassis Photo</span>
                    </div>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Main Assembly</h4>
                  <p className="text-gray-400 text-sm">Fully assembled PiCar-X with camera and sensors</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-black/40 border-blue-500/30 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-3 flex items-center justify-center">
                      <CircuitBoard className="w-8 h-8 text-blue-400" />
                    </div>
                    <h5 className="text-white text-sm font-semibold mb-1">Wiring Diagram</h5>
                    <p className="text-gray-400 text-xs">Component connections</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-green-500/30 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-3 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-green-400" />
                    </div>
                    <h5 className="text-white text-sm font-semibold mb-1">Lane Detection</h5>
                    <p className="text-gray-400 text-xs">Computer vision output</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Build Steps for PiCar-X */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Wrench className="w-6 h-6 mr-3 text-purple-400" />
                  Build Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {buildSteps.picar.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-blue-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Code className="w-6 h-6 mr-3 text-blue-400" />
                  Sample Code: Lane Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900/60 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
                  <code>{codeExamples.picar}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* PiCrawler Project */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-purple-900/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 lg:order-2">
              <Card className="bg-black/40 border-orange-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <Bot className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                      <span className="text-gray-400">PiCrawler Ready Stance</span>
                    </div>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Quadruped Assembly</h4>
                  <p className="text-gray-400 text-sm">PiCrawler in calibrated ready position</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-3 flex items-center justify-center">
                      <Cpu className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h5 className="text-white text-sm font-semibold mb-1">Servo ID Map</h5>
                    <p className="text-gray-400 text-xs">Motor configuration</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-yellow-500/30 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-3 flex items-center justify-center">
                      <Gamepad2 className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h5 className="text-white text-sm font-semibold mb-1">Walking Gait</h5>
                    <p className="text-gray-400 text-xs">Movement sequence</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-8 lg:order-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">Project 2: PiCrawler</h2>
                  <div className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-sm inline-block">
                    Research Phase
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-300 leading-relaxed">
                PiCrawler is a quadruped robot controlled by Raspberry Pi and 12 servos. It focuses on walking gaits, balance, and AI-driven locomotion.
                This simulates how legged robots like Boston Dynamics' Spot achieve movement in the real world—handling rough terrain that wheeled robots can't.
              </p>

              <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-6 h-6 text-yellow-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Why It Matters</h3>
                </div>
                <p className="text-gray-300">
                  Quadruped robots like PiCrawler represent the future of mobility. From search-and-rescue robots to AI-powered assistance devices,
                  the ability to walk on uneven ground is critical. With PiCrawler, you're exploring the foundations of legged locomotion and adaptive AI.
                </p>
              </div>
            </div>
          </div>

          {/* Build Steps for PiCrawler */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="bg-black/40 border-orange-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Wrench className="w-6 h-6 mr-3 text-orange-400" />
                  Build Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {buildSteps.picrawler.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Code className="w-6 h-6 mr-3 text-cyan-400" />
                  Sample Code: Servo Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900/60 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
                  <code>{codeExamples.picrawler}</code>
                </pre>
                <p className="text-gray-400 text-sm mt-3">
                  Move Servo P3 for a simple leg test with smooth angle transitions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Technologies Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Key Technologies</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              These projects integrate cutting-edge technologies that power modern robotics and automation systems
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <Camera className="w-10 h-10 mx-auto mb-3 text-purple-400" />
                <h3 className="text-white font-semibold mb-2">Computer Vision</h3>
                <p className="text-gray-400 text-xs">OpenCV, real-time processing</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <Cpu className="w-10 h-10 mx-auto mb-3 text-blue-400" />
                <h3 className="text-white font-semibold mb-2">Edge AI</h3>
                <p className="text-gray-400 text-xs">Raspberry Pi, TensorFlow Lite</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/30 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <Gamepad2 className="w-10 h-10 mx-auto mb-3 text-orange-400" />
                <h3 className="text-white font-semibold mb-2">Control Systems</h3>
                <p className="text-gray-400 text-xs">Servo control, kinematics</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/20 to-teal-900/20 border-green-500/30 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <Zap className="w-10 h-10 mx-auto mb-3 text-green-400" />
                <h3 className="text-white font-semibold mb-2">IoT Integration</h3>
                <p className="text-gray-400 text-xs">WiFi, sensors, telemetry</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Build Your Own Robot?</h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Start your journey into robotics with these hands-on projects. From autonomous navigation to quadruped locomotion,
              these builds will give you practical experience with the technologies shaping our future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/robotics">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent border-purple-400 text-purple-400 hover:bg-purple-900/30 transition-all duration-200">
                  Explore More Robotics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-4 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-xl font-bold text-white">NAVADA</span>
          </div>
          <p className="text-gray-300 mb-2">© 2024 NAVADA. All rights reserved.</p>
          <p className="text-gray-400 text-sm mb-2">Navigating Artistic Vision with Advanced Digital Assistance</p>
          <p className="text-purple-400 text-sm">Designed & Developed by Lee Akpareva MBA, MA</p>
        </div>
      </footer>
    </div>
  )
}