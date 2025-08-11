'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface TransferCardProps {
  title: string;
  excerpt: string;
  primaryBadge: string; // league or club name
  timeAgo: string;
  onClick?: () => void;
  href?: string;
  accentColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export function TransferCard({
  title,
  excerpt,
  primaryBadge,
  timeAgo,
  onClick,
  href = '/article/sample-article',
  imageUrl,
  imageAlt,
}: TransferCardProps) {
  const cardContent = (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      {/* Image section with fixed aspect ratio */}
      <div className="aspect-[16/10] bg-muted relative overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
            <div className="text-muted-foreground text-xs md:text-sm">No Image</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content section with improved mobile spacing */}
      <CardContent className="p-4 md:p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-3 md:space-y-4 flex-grow">
          {/* Header with badge and time - better mobile layout */}
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-muted text-muted-foreground border border-border flex-shrink-0">
              {primaryBadge}
            </span>
            <div className="flex items-center text-xs text-muted-foreground flex-shrink-0">
              <Clock className="w-3 h-3 mr-1" />
              {timeAgo}
            </div>
          </div>

          {/* Title and excerpt with better mobile typography */}
          <div className="flex-grow space-y-2">
            {/* Improved mobile title size - 16px on mobile, 18px on desktop */}
            <h3 className="text-base md:text-lg font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-tight">
              {title}
            </h3>
            {/* Better mobile excerpt size - 14px on mobile, 15px on desktop */}
            <p className="text-sm md:text-base line-clamp-3 text-muted-foreground leading-relaxed">
              {excerpt}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
