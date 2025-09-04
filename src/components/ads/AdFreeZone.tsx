'use client';

import { usePathname } from 'next/navigation';

interface AdFreeZoneProps {
  children: React.ReactNode;
}

export function AdFreeZone({ children }: AdFreeZoneProps) {
  const pathname = usePathname();
  
  // Check if current path is admin-related
  const isAdminPath = pathname?.includes('/admin') || 
                     pathname?.includes('/login') ||
                     pathname?.includes('/debug');
  
  // Don't render ads in admin areas
  if (isAdminPath) {
    return null;
  }
  
  return <>{children}</>;
}
