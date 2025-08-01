'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trophy } from 'lucide-react'

interface LeagueImageProps {
  src: string
  alt: string
  className?: string
  fallbackClassName?: string
}

export function LeagueImage({ src, alt, className, fallbackClassName }: LeagueImageProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div className={`bg-muted rounded-full flex items-center justify-center group-hover:bg-red-50 transition-colors ${fallbackClassName || 'w-16 h-16'}`}>
        <Trophy className="w-8 h-8 text-muted-foreground group-hover:text-red-600" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={64}
      height={64}
      className={className}
      onError={() => setImageError(true)}
    />
  )
}
