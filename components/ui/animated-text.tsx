"use client"

import { motion } from "framer-motion"

interface AnimatedTextProps {
  text: string
  className?: string
}

export function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  const words = text.split(" ")

  return (
    <div className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-6 last:mr-0">
          {word.split("").map((letter, letterIndex) => (
            <motion.span
              key={`${wordIndex}-${letterIndex}`}
              initial={{ y: 20, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                delay: wordIndex * 0.05 + letterIndex * 0.015,
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3
              }}
              className="inline-block text-transparent bg-clip-text 
                        bg-gradient-to-br from-white via-purple-200 to-purple-400
                        hover:from-purple-300 hover:to-purple-500
                        transition-all duration-700 cursor-default"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </div>
  )
}