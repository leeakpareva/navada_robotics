'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SurveyIntro } from '@/components/data/SurveyIntro'
import { SurveyForm } from '@/components/data/SurveyForm'
import { SecureNotice } from '@/components/data/SecureNotice'
import { getSurveyStatus } from '@/lib/surveyConfig'
import { ArrowLeft, Clock, AlertCircle, Brain, BarChart3, Users, Building2, DollarSign, Mail, Phone, Globe, TrendingUp, Zap, ShieldCheck, Cpu, Bot, Factory, CircuitBoard } from 'lucide-react'

export default function DataPage() {
  const [activeTab, setActiveTab] = useState<'intro' | 'research' | 'insights' | 'individual' | 'business'>('intro')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [surveyStatus, setSurveyStatus] = useState(getSurveyStatus())

  useEffect(() => {
    // Update survey status every minute
    const interval = setInterval(() => {
      setSurveyStatus(getSurveyStatus())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Navigation */}
      <header className="relative z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-white font-bold text-xl">NAVADA Robotics</span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-purple-400 transition-all duration-200">
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Back to Home
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2"
            >
              <div className="space-y-1">
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
              </div>
            </button>
          </div>

          {/* Mobile navigation */}
          <div className={`md:hidden mt-4 pb-4 border-t border-gray-800 pt-4 transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <nav className="flex flex-col space-y-1">
              <Link href="/" className="text-white hover:text-purple-400 transition-all duration-200 py-3 px-2 rounded-lg hover:bg-gray-800/50 min-h-12 flex items-center">
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Back to Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className={`bg-gradient-to-r backdrop-blur-sm border rounded-full px-6 py-2 mb-4 ${
                surveyStatus.status === 'active'
                  ? 'from-green-500/20 to-blue-500/20 border-green-500/30'
                  : surveyStatus.status === 'upcoming'
                  ? 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                  : 'from-red-500/20 to-gray-500/20 border-red-500/30'
              }`}>
                <div className="flex items-center space-x-2">
                  {surveyStatus.status === 'active' ? (
                    <Clock className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    surveyStatus.status === 'active'
                      ? 'text-green-200'
                      : surveyStatus.status === 'upcoming'
                      ? 'text-yellow-200'
                      : 'text-red-200'
                  }`}>
                    {surveyStatus.status === 'active' && surveyStatus.timeRemaining
                      ? `${surveyStatus.timeRemaining.hours}h ${surveyStatus.timeRemaining.minutes}m remaining`
                      : surveyStatus.message
                    }
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-8 leading-tight">
              NAVADA Data Initiative
            </h1>
            <p className="text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-6">
              Pioneering AI Design & Development Research in Africa
            </p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto mb-8">
              Empowering Innovation • Generating Revenue • Transforming Economies
            </p>
            <p className="text-base text-gray-400 max-w-4xl mx-auto">
              NAVADA Robotics is dedicated to advancing AI research and development across Africa while creating economic opportunities for participants. Join our mission to shape the future of technology while earning rewards for your valuable insights.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap justify-center bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-2 border border-gray-700/50 gap-1">
              <button
                onClick={() => setActiveTab('intro')}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-300 text-xs md:text-base ${
                  activeTab === 'intro'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('research')}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-300 text-xs md:text-base ${
                  activeTab === 'research'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                AI Research
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-300 text-xs md:text-base ${
                  activeTab === 'insights'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Data Initiative Insights
              </button>
              <button
                onClick={() => setActiveTab('individual')}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-300 text-xs md:text-base ${
                  activeTab === 'individual'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => setActiveTab('business')}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-300 text-xs md:text-base ${
                  activeTab === 'business'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Business
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {activeTab === 'intro' && (
              <div className="space-y-8">
                <SurveyIntro />

                {/* Survey Options */}
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900/50 via-purple-800/50 to-purple-700/40 border border-purple-500/40 hover:border-purple-400/70 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="px-3 py-1 bg-purple-500/30 rounded-full border border-purple-400/40">
                          <span className="text-purple-200 text-sm font-medium">Personal</span>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl md:text-4xl font-bold text-purple-200">£5</div>
                          <div className="text-sm text-purple-100">GBP Reward</div>
                        </div>
                      </div>
                      <CardTitle className="text-white text-xl md:text-2xl font-bold mb-3">
                        Individual Survey
                      </CardTitle>
                      <CardDescription className="text-purple-100 text-sm md:text-base leading-relaxed">
                        Share your personal experience with AI and robotics technology across Africa
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="bg-gray-900/30 rounded-lg p-4 mb-6 border border-blue-500/20">
                        <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                          <div className="text-purple-200">Questions: <span className="text-white font-semibold">20</span></div>
                          <div className="text-purple-200">Duration: <span className="text-white font-semibold">5-7 min</span></div>
                          <div className="text-purple-200">Focus: <span className="text-white font-semibold">Personal Use</span></div>
                          <div className="text-purple-200">Payment: <span className="text-white font-semibold">Stripe</span></div>
                        </div>
                      </div>
                      <Button
                        onClick={() => surveyStatus.canParticipate && setActiveTab('individual')}
                        disabled={!surveyStatus.canParticipate}
                        className={`w-full font-semibold py-3 md:py-4 text-sm md:text-base rounded-lg transition-all duration-300 shadow-lg ${
                          surveyStatus.canParticipate
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-blue-500/30 transform hover:scale-105'
                            : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {surveyStatus.canParticipate ? 'Start Individual Survey' : 'Survey Unavailable'}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-gray-800/50 to-purple-800/30 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="px-3 py-1 bg-purple-500/20 rounded-full border border-purple-400/30">
                          <span className="text-purple-300 text-sm font-medium">Business</span>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl md:text-4xl font-bold text-purple-300">£15</div>
                          <div className="text-sm text-purple-200">GBP Reward</div>
                        </div>
                      </div>
                      <CardTitle className="text-white text-xl md:text-2xl font-bold mb-3">
                        Business Survey
                      </CardTitle>
                      <CardDescription className="text-purple-100/80 text-base leading-relaxed">
                        Share insights about AI/robotics adoption in your organization
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="bg-gray-900/30 rounded-lg p-4 mb-6 border border-purple-500/20">
                        <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                          <div className="text-purple-200">Questions: <span className="text-white font-semibold">20</span></div>
                          <div className="text-purple-200">Duration: <span className="text-white font-semibold">8-10 min</span></div>
                          <div className="text-purple-200">Focus: <span className="text-white font-semibold">Enterprise</span></div>
                          <div className="text-purple-200">Payment: <span className="text-white font-semibold">Stripe</span></div>
                        </div>
                      </div>
                      <Button
                        onClick={() => surveyStatus.canParticipate && setActiveTab('business')}
                        disabled={!surveyStatus.canParticipate}
                        className={`w-full font-semibold py-3 md:py-4 text-sm md:text-base rounded-lg transition-all duration-300 shadow-lg ${
                          surveyStatus.canParticipate
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white hover:shadow-purple-500/30 transform hover:scale-105'
                            : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {surveyStatus.canParticipate ? 'Start Business Survey' : 'Survey Unavailable'}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16 px-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 text-center group-hover:border-green-500/50 transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-3">Secure & Private</h3>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">End-to-end encryption ensures your data remains confidential and protected</p>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center group-hover:border-yellow-500/50 transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-3">Get Rewarded</h3>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">Receive instant payment within 72 hours via secure Stripe processing</p>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center group-hover:border-blue-500/50 transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-3">Shape the Future</h3>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">Your insights help advance AI and robotics innovation across Africa</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'research' && (
              <div className="space-y-8">
                {/* Research Header */}
                <div className="text-center mb-8 md:mb-12 px-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">AI Research & Development</h2>
                  <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                    Advancing artificial intelligence design and development across Africa through comprehensive research initiatives
                  </p>
                </div>

                {/* Research Focus Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
                  <Card className="bg-gradient-to-br from-purple-900/60 via-purple-800/50 to-indigo-900/40 border border-purple-400/50 hover:border-purple-300/70 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30">
                    <CardHeader>
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500/40 to-indigo-500/40 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                        <CircuitBoard className="w-7 h-7 text-purple-200" />
                      </div>
                      <CardTitle className="text-white text-lg md:text-xl font-bold">Machine Learning</CardTitle>
                      <CardDescription className="text-purple-100 leading-relaxed text-sm md:text-base">
                        Developing adaptive AI systems that learn from African contexts and challenges
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-900/60 via-purple-800/50 to-violet-900/40 border border-purple-400/50 hover:border-purple-300/70 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30">
                    <CardHeader>
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500/40 to-violet-500/40 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                        <Bot className="w-7 h-7 text-purple-200" />
                      </div>
                      <CardTitle className="text-white text-lg md:text-xl font-bold">Robotics Integration</CardTitle>
                      <CardDescription className="text-purple-100 leading-relaxed text-sm md:text-base">
                        Creating robotics solutions tailored for African industries and infrastructure
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-900/60 via-purple-800/50 to-fuchsia-900/40 border border-purple-400/50 hover:border-purple-300/70 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30">
                    <CardHeader>
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500/40 to-fuchsia-500/40 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                        <TrendingUp className="w-7 h-7 text-purple-200" />
                      </div>
                      <CardTitle className="text-white text-lg md:text-xl font-bold">Economic Impact</CardTitle>
                      <CardDescription className="text-purple-100 leading-relaxed text-sm md:text-base">
                        Studying AI's potential to drive economic growth and job creation across Africa
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                {/* Research Mission */}
                <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">Our Research Mission</h3>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        NAVADA Robotics is committed to pioneering AI research that addresses the unique challenges and opportunities across Africa. Our dedication extends beyond technological advancement to creating sustainable revenue streams for participants and contributing to economic transformation.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-blue-400" />
                          </div>
                          <span className="text-white font-semibold">Innovation-Driven Research</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-green-400" />
                          </div>
                          <span className="text-white font-semibold">Revenue Generation for Participants</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-purple-400" />
                          </div>
                          <span className="text-white font-semibold">Pan-African Impact</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30">
                      <h4 className="text-white font-bold text-lg mb-4">Current Focus Areas</h4>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>AI adoption patterns in African markets</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span>Cultural considerations in AI design</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Economic impact assessment models</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span>Infrastructure integration strategies</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-8">
                {/* Insights Header */}
                <div className="text-center mb-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Data Insights & Reports</h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Access comprehensive data insights and detailed reports to inform your business decisions
                  </p>
                </div>

                {/* Service Tiers */}
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="relative overflow-hidden bg-gradient-to-br from-blue-900/40 via-gray-800/50 to-blue-800/30 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-500">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-400/30">
                          <span className="text-blue-300 text-sm font-medium">Individual Access</span>
                        </div>
                        <Users className="w-8 h-8 text-blue-400" />
                      </div>
                      <CardTitle className="text-white text-xl md:text-2xl font-bold mb-3">
                        Personal Insights
                      </CardTitle>
                      <CardDescription className="text-blue-100/80 text-sm md:text-base leading-relaxed">
                        Tailored data insights for individuals, entrepreneurs, and small businesses
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center space-x-3">
                          <ShieldCheck className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">Market trend analysis</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <ShieldCheck className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">AI adoption recommendations</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <ShieldCheck className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">Regional opportunity mapping</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <ShieldCheck className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">Quarterly insights reports</span>
                        </div>
                      </div>
                      <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                        <p className="text-blue-200 text-sm text-center">
                          Custom pricing based on requirements
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-gray-800/50 to-purple-800/30 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="px-3 py-1 bg-purple-500/20 rounded-full border border-purple-400/30">
                          <span className="text-purple-300 text-sm font-medium">Enterprise Access</span>
                        </div>
                        <Building2 className="w-8 h-8 text-purple-400" />
                      </div>
                      <CardTitle className="text-white text-xl md:text-2xl font-bold mb-3">
                        Corporate Intelligence
                      </CardTitle>
                      <CardDescription className="text-purple-100/80 text-base leading-relaxed">
                        Comprehensive data solutions for enterprises and government organizations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center space-x-3">
                          <ShieldCheck className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">Comprehensive market analysis</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <ShieldCheck className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">Custom research projects</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <ShieldCheck className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">Real-time data dashboards</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <ShieldCheck className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">Strategic consulting sessions</span>
                        </div>
                      </div>
                      <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                        <p className="text-purple-200 text-sm text-center">
                          Premium enterprise solutions available
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Get Access to Data Insights</h3>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                      Ready to unlock the power of AI research data? Contact us for detailed information about our data insights packages and custom solutions.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-blue-400" />
                      </div>
                      <h4 className="text-white font-semibold mb-2">Email Us</h4>
                      <p className="text-gray-400">Lee@navada.info</p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <Phone className="w-8 h-8 text-green-400" />
                      </div>
                      <h4 className="text-white font-semibold mb-2">Call Us</h4>
                      <p className="text-gray-400">+44 7953 523704</p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <Globe className="w-8 h-8 text-purple-400" />
                      </div>
                      <h4 className="text-white font-semibold mb-2">Location</h4>
                      <p className="text-gray-400">London, UK</p>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <Link href="/contact">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/30">
                        Contact for More Details
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Revenue Generation Info */}
                <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Economic Impact & Revenue Generation</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        Our commitment extends beyond research to creating tangible economic opportunities. Through our data initiatives, we generate revenue streams that benefit participants, improve local economies, and foster innovation across Africa.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-white">Direct payments to survey participants</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                          <span className="text-white">Data insights revenue sharing programs</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                          <span className="text-white">Economic development partnerships</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl md:text-5xl font-bold text-green-300 mb-2">£10,000</div>
                      <p className="text-gray-300 mb-4">Target to be paid to participants</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'individual' && (
              <div>
                {surveyStatus.canParticipate ? (
                  <>
                    <SecureNotice />
                    <SurveyForm group="individual" />
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-red-900/40 to-gray-800/50 border border-red-500/30 rounded-2xl p-12 max-w-2xl mx-auto">
                      <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
                      <h2 className="text-3xl font-bold text-white mb-4">Survey Currently Unavailable</h2>
                      <p className="text-red-200 text-lg mb-6">{surveyStatus.message}</p>
                      <p className="text-gray-400">Please check back when the survey window reopens.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'business' && (
              <div>
                {surveyStatus.canParticipate ? (
                  <>
                    <SecureNotice />
                    <SurveyForm group="business" />
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-red-900/40 to-gray-800/50 border border-red-500/30 rounded-2xl p-12 max-w-2xl mx-auto">
                      <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
                      <h2 className="text-3xl font-bold text-white mb-4">Survey Currently Unavailable</h2>
                      <p className="text-red-200 text-lg mb-6">{surveyStatus.message}</p>
                      <p className="text-gray-400">Please check back when the survey window reopens.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}