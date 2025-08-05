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
import { useParams } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { typography } from '@/lib/typography';

interface NavbarProps {
  locale?: Locale;
  dict?: any;
}

export function Navbar({ locale: propLocale, dict }: NavbarProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href={getLocalizedPath('/')}
          className="flex items-center space-x-2"
        >
          <span className={typography.logo.navbar}>
            <span className="text-primary">Transfers</span>
            <span className="text-foreground">Daily</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
          <Link
            href={getLocalizedPath('/latest')}
            className={`${typography.nav.primary} text-foreground hover:text-primary px-3 py-2 min-h-[44px] flex items-center transition-colors`}
          >
            {t('navigation.latest', 'Latest')}
          </Link>

          {/* Leagues Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`flex items-center space-x-1 px-3 py-2 min-h-[44px] text-foreground hover:bg-secondary hover:text-primary ${typography.nav.primary}`}
              >
                <span>{t('navigation.leagues', 'Leagues')}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {leagues.map((league) => (
                <DropdownMenuItem key={league.name} asChild>
                  <Link href={getLocalizedPath(`/league/${league.slug}`)} className={`${typography.nav.dropdown} min-h-[44px] flex items-center`}>
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
                className={`flex items-center space-x-1 px-3 py-2 text-foreground hover:bg-secondary hover:text-primary ${typography.nav.primary}`}
              >
                <span>{t('navigation.transfers', 'Transfers')}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {transferTypes.map((type) => (
                <DropdownMenuItem key={type.name} asChild>
                  <Link href={getLocalizedPath(`/transfers/${type.slug}`)} className={typography.nav.dropdown}>
                    {type.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href={getLocalizedPath('/about')}
            className={`${typography.nav.primary} text-foreground hover:text-primary px-3 py-2 transition-colors`}
          >
            {t('navigation.about', 'About')}
          </Link>

          <Link
            href={getLocalizedPath('/contact')}
            className={`${typography.nav.primary} text-foreground hover:text-primary px-3 py-2 transition-colors`}
          >
            {t('navigation.contact', 'Contact')}
          </Link>
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
            className="hidden sm:inline-flex text-foreground hover:bg-secondary hover:text-primary"
            asChild
          >
            <Link href={getLocalizedPath('/search')}>
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle className="hidden sm:inline-flex text-foreground hover:bg-secondary hover:text-primary" />

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex text-foreground hover:bg-secondary hover:text-primary"
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
              className="hidden sm:inline-flex text-foreground hover:bg-secondary hover:text-primary"
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
                className="md:hidden text-foreground hover:bg-secondary hover:text-primary"
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
                {/* Language Switcher - Mobile */}
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Language
                  </h3>
                  <LanguageSwitcher variant="default" currentLocale={locale} />
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <Link
                    href={getLocalizedPath('/latest')}
                    className="block text-sm py-2 px-2 rounded hover:bg-background hover:text-rose-500 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('navigation.latest', 'Latest')}
                  </Link>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Leagues
                  </h3>
                  <div className="bg-muted rounded-lg p-2">
                    {leagues.map((league) => (
                      <Link
                        key={league.name}
                        href={getLocalizedPath(`/league/${league.slug}`)}
                        className="block text-sm py-2 px-2 rounded hover:bg-background hover:text-rose-500 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {league.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Transfer Types
                  </h3>
                  <div className="bg-muted rounded-lg p-2">
                    {transferTypes.map((type) => (
                      <Link
                        key={type.name}
                        href={getLocalizedPath(`/transfers/${type.slug}`)}
                        className="block text-sm py-2 px-2 rounded hover:bg-background hover:text-rose-500 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {type.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="bg-muted rounded-lg p-2 space-y-2">
                    <Link
                      href={getLocalizedPath('/about')}
                      className="block text-sm py-2 px-2 rounded hover:bg-background hover:text-rose-500 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('navigation.about', 'About')}
                    </Link>

                    <Link
                      href={getLocalizedPath('/contact')}
                      className="block text-sm py-2 px-2 rounded hover:bg-background hover:text-rose-500 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('navigation.contact', 'Contact')}
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
