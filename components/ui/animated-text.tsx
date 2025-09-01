"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
}

function AnimatedTextComponent({ text, className = "", delay = 0 }: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [delay])

  const textClasses = `text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400 
    hover:from-purple-300 hover:to-purple-500 transition-all duration-700 cursor-default
    ${isVisible ? 'opacity-100' : 'opacity-0'}`

  return (
    <span className={`${className} ${textClasses} transition-opacity duration-800 ease-out`}>
      {text}
    </span>
  )
}

// Fallback component for SSR
function AnimatedTextFallback({ text, className = "" }: AnimatedTextProps) {
  return (
    <span className={`${className} text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400`}>
      {text}
    </span>
  )
}

// Export with no SSR to prevent hydration issues
export const AnimatedText = dynamic(() => Promise.resolve(AnimatedTextComponent), {
  ssr: false,
  loading: ({ text, className }: AnimatedTextProps) => <AnimatedTextFallback text={text!} className={className} />
})