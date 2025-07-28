'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { typography } from '@/lib/typography';

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
      className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer min-h-[44px]"
      onClick={onClick}
    >
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
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
            <div className="text-muted-foreground text-sm">No Image</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`${typography.badge} px-2 py-0.5 h-5 rounded bg-muted text-muted-foreground border border-border flex-shrink-0`}>
              {primaryBadge}
            </span>
            <div className={`flex items-center ${typography.card.meta}`}>
              <Clock className="w-3 h-3 mr-1" />
              {timeAgo}
            </div>
          </div>

          <div>
            <h3 className={`${typography.card.title} line-clamp-2 mb-2 text-foreground group-hover:text-primary transition-colors`}>
              {title}
            </h3>
            <p className={`${typography.card.description} line-clamp-2`}>
              {excerpt}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
