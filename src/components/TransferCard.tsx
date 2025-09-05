'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface TransferCardProps {
  title: string;
  excerpt: string;
  primaryBadge: string;
  timeAgo: string;
  onClick?: () => void;
  href?: string;
  imageUrl?: string;
  imageAlt?: string;
  category?: 'transfer' | 'news' | 'rumor';
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
  category = 'news',
}: TransferCardProps) {
  const cardContent = (
    <Card className="
      overflow-hidden group cursor-pointer h-full flex flex-col
      shadow-sm hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20
      transition-all duration-300 hover:-translate-y-1
    " onClick={onClick}>
      
      <div className="aspect-video bg-muted relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
            <div className="text-muted-foreground text-sm font-medium">{primaryBadge}</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="p-6 flex-grow space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-muted text-muted-foreground">
            {primaryBadge}
          </span>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            {timeAgo}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm line-clamp-3 text-muted-foreground leading-relaxed">
            {excerpt}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href} className="block h-full">{cardContent}</Link>;
  }
  return cardContent;
}
