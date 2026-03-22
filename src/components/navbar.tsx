'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronDown, Search, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useDictionary } from '@/lib/dictionary-provider';
import { useParams, usePathname } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

import { CommandSearch } from '@/components/CommandSearch';
import { typography } from '@/lib/typography';
import { cn, zIndex, motion } from '@/lib/theme';

function NavLink({ href, icon, children }: { href: string; icon?: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');
  return (
    <Link
      href={href}
      className={cn(
        typography.nav.primary,
        'px-3 py-2 min-h-[44px] flex items-center gap-1.5 cursor-pointer',
        'motion-safe:transition-colors duration-fast motion-reduce:transition-none',
        isActive
          ? 'text-primary font-bold'
          : 'text-foreground hover:text-primary'
      )}
    >
      {icon}
      {children}
    </Link>
  );
}

interface NavbarProps {
  locale?: Locale;
  dict?: any;
}

export function Navbar({ locale: propLocale, dict }: NavbarProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const params = useParams();
  const locale = propLocale || (params?.locale as Locale) || 'en';
  const { t } = useDictionary();

  const leagues = [
    { name: 'Premier League', slug: 'premier-league' },
    { name: 'La Liga', slug: 'la-liga' },
    { name: 'Serie A', slug: 'serie-a' },
    { name: 'Bundesliga', slug: 'bundesliga' },
    { name: 'Ligue 1', slug: 'ligue-1' },
  ];

  const transferTypes = [
    { name: t('navigation.confirmed', 'Confirmed'), slug: 'confirmed' },
    { name: 'Rumors', slug: 'rumors' },
    { name: t('navigation.completed', 'Completed'), slug: 'completed' },
    { name: t('navigation.loanMoves', 'Loan Moves'), slug: 'loan-moves' },
  ];

  const getLocalizedPath = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`;
  };

  return (
    <>
    <header className="sticky top-0 z-20 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href={getLocalizedPath('/')}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <span className={typography.logo.navbar}>
            <span className="text-primary">Transfers</span>
            <span className="text-foreground">Daily</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
          <NavLink
            href={getLocalizedPath('/latest')}
          >
            {t('navigation.latest', 'Latest')}
          </NavLink>

          {/* Leagues Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  typography.nav.primary,
                  'flex items-center space-x-1 px-3 py-2 min-h-[44px] cursor-pointer',
                  'text-foreground hover:bg-secondary hover:text-primary',
                  'motion-safe:transition-colors duration-fast motion-reduce:transition-none'
                )}
              >
                <span>{t('navigation.leagues', 'Leagues')}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {leagues.map((league) => (
                <DropdownMenuItem key={league.name} asChild>
                  <Link href={getLocalizedPath(`/league/${league.slug}`)} className={cn(typography.nav.dropdown, 'min-h-[44px] flex items-center cursor-pointer')}>
                    {league.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Transfers Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  typography.nav.primary,
                  'flex items-center space-x-1 px-3 py-2 min-h-[44px] cursor-pointer',
                  'text-foreground hover:bg-secondary hover:text-primary',
                  'motion-safe:transition-colors duration-fast motion-reduce:transition-none'
                )}
              >
                <span>{t('navigation.transfers', 'Transfers')}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {transferTypes.map((type) => (
                <DropdownMenuItem key={type.name} asChild>
                  <Link href={getLocalizedPath(`/transfers/${type.slug}`)} className={cn(typography.nav.dropdown, 'min-h-[44px] flex items-center cursor-pointer')}>
                    {type.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>


        </nav>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Language Switcher - Desktop */}
          <div className="hidden sm:block">
            <LanguageSwitcher variant="compact" currentLocale={locale} />
          </div>

          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex min-h-[44px] min-w-[44px] cursor-pointer text-foreground hover:bg-secondary hover:text-primary motion-safe:transition-colors duration-fast"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">{t('common.search', 'Search')}</span>
          </Button>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex min-h-[44px] min-w-[44px] cursor-pointer text-foreground hover:bg-secondary hover:text-primary"
                >
                  <User className="h-4 w-4" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex min-h-[44px] min-w-[44px] cursor-pointer text-foreground hover:bg-secondary hover:text-primary"
              asChild
            >
              <Link href="/login">
                <User className="h-4 w-4" />
                <span className="sr-only">Login</span>
              </Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden min-h-[44px] min-w-[44px] cursor-pointer text-foreground hover:bg-secondary hover:text-primary"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-lg font-semibold">Menu</span>
              </div>

              <div className="flex flex-col space-y-6 mt-6">
                {/* Mobile Search Trigger */}
                <div className="bg-muted rounded-lg p-4">
                  <button
                    onClick={() => { setIsOpen(false); setSearchOpen(true); }}
                    className={cn(typography.nav.primary, 'w-full text-left px-2 py-2 rounded min-h-[44px] flex items-center gap-2 cursor-pointer hover:bg-background hover:text-primary motion-safe:transition-colors duration-fast')}
                  >
                    <Search className="h-4 w-4" />
                    {t('common.search', 'Search')}
                  </button>
                </div>

                {/* Language Switcher - Mobile */}
                <div className="bg-muted rounded-lg p-4">
                  <h3 className={cn(typography.body.small, 'font-semibold text-primary uppercase tracking-wider mb-3')}>
                    Language
                  </h3>
                  <LanguageSwitcher variant="default" currentLocale={locale} />
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <Link
                    href={getLocalizedPath('/latest')}
                    className={cn(
                      typography.nav.primary,
                      'block py-2 px-2 min-h-[44px] flex items-center cursor-pointer rounded',
                      'hover:bg-background hover:text-primary motion-safe:transition-colors duration-fast motion-reduce:transition-none'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {t('navigation.latest', 'Latest')}
                  </Link>
                </div>

                <div>
                  <h3 className={cn(typography.body.small, 'font-semibold text-primary uppercase tracking-wider mb-2')}>
                    Leagues
                  </h3>
                  <div className="bg-muted rounded-lg p-2">
                    {leagues.map((league) => (
                      <Link
                        key={league.name}
                        href={getLocalizedPath(`/league/${league.slug}`)}
                        className={cn(
                          typography.nav.primary,
                          'block py-2 px-2 min-h-[44px] flex items-center cursor-pointer rounded',
                          'hover:bg-background hover:text-primary motion-safe:transition-colors duration-fast motion-reduce:transition-none'
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {league.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={cn(typography.body.small, 'font-semibold text-primary uppercase tracking-wider mb-2')}>
                    Transfer Types
                  </h3>
                  <div className="bg-muted rounded-lg p-2">
                    {transferTypes.map((type) => (
                      <Link
                        key={type.name}
                        href={getLocalizedPath(`/transfers/${type.slug}`)}
                        className={cn(
                          typography.nav.primary,
                          'block py-2 px-2 min-h-[44px] flex items-center cursor-pointer rounded',
                          'hover:bg-background hover:text-primary motion-safe:transition-colors duration-fast motion-reduce:transition-none'
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {type.name}
                      </Link>
                    ))}
                  </div>
                </div>


              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    <CommandSearch locale={locale} open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
