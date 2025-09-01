"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  width: number
  height: number
  sizes?: string
  quality?: number
}

export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  width = 400,
  height = 300,
  sizes,
  quality = 85,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-900 animate-pulse rounded-lg" 
          style={{ width, height }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        sizes={sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        className={cn(
          "duration-700 ease-in-out transition-all object-cover w-full h-full",
          isLoading ? "scale-110 blur-sm grayscale" : "scale-100 blur-0 grayscale-0"
        )}
        onLoad={() => setIsLoading(false)}
        onError={(e) => console.error("Image failed to load:", src, e)}
        priority={priority}
      />
    </div>
  )
}