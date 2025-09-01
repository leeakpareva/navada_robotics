"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  quality?: number
  placeholder?: "blur" | "empty"
}

export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  fill = false,
  width,
  height,
  sizes,
  quality = 85, // Optimized quality for web
  placeholder = "blur",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isInView, setIsInView] = useState(true) // Always load images immediately
  const imgRef = useRef<HTMLDivElement>(null)

  // Generate blur data URL for placeholder
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#333" offset="20%" />
          <stop stop-color="#222" offset="50%" />
          <stop stop-color="#333" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#333" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" opacity="0" />
      <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
    </svg>`

  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str)

  const blurDataURL = `data:image/svg+xml;base64,${toBase64(
    shimmer(width || 700, height || 475)
  )}`

  return (
    <div 
      ref={imgRef}
      className={cn("relative overflow-hidden", fill && "h-full w-full", className)}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse rounded-lg" />
      )}
      {isInView && (fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          quality={quality}
          sizes={sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          className={cn(
            "object-cover duration-700 ease-in-out transition-all",
            isLoading ? "scale-110 blur-sm grayscale" : "scale-100 blur-0 grayscale-0"
          )}
          onLoad={() => setIsLoading(false)}
          onError={(e) => console.error("Image failed to load:", src, e)}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={placeholder === "blur" ? blurDataURL : undefined}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width || 400}
          height={height || 300}
          quality={quality}
          className={cn(
            "duration-700 ease-in-out transition-all",
            isLoading ? "scale-110 blur-sm grayscale" : "scale-100 blur-0 grayscale-0"
          )}
          onLoad={() => setIsLoading(false)}
          onError={(e) => console.error("Image failed to load:", src, e)}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={placeholder === "blur" ? blurDataURL : undefined}
        />
      ))}
    </div>
  )
}