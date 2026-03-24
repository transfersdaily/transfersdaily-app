export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://transfersdaily.com';

// League data — single source of truth
export const LEAGUES = [
  { name: "Premier League", slug: "premier-league", country: "England", color: "#37003c", short: "EPL", logoUrl: "/logos/leagues/premier-league.png", bgClass: "bg-league-premier-league" },
  { name: "La Liga", slug: "la-liga", country: "Spain", color: "#ee2737", short: "ESP", logoUrl: "/logos/leagues/la-liga.png", bgClass: "bg-league-la-liga" },
  { name: "Serie A", slug: "serie-a", country: "Italy", color: "#005499", short: "ITA", logoUrl: "/logos/leagues/serie-a.png", bgClass: "bg-league-serie-a" },
  { name: "Bundesliga", slug: "bundesliga", country: "Germany", color: "#000000", short: "GER", logoUrl: "/logos/leagues/bundesliga.png", bgClass: "bg-league-bundesliga" },
  { name: "Ligue 1", slug: "ligue-1", country: "France", color: "#003399", short: "FRA", logoUrl: "/logos/leagues/ligue-1.png", bgClass: "bg-league-ligue-1" },
] as const;

// Derived helpers for different consumer shapes
export const LEAGUE_NAMES = LEAGUES.map(l => l.name);
export const LEAGUE_BY_NAME = Object.fromEntries(LEAGUES.map(l => [l.name, l])) as Record<string, typeof LEAGUES[number]>;
export const LEAGUE_BY_SLUG = Object.fromEntries(LEAGUES.map(l => [l.slug, l])) as Record<string, typeof LEAGUES[number]>;
export const LEAGUE_BG_CLASSES: Record<string, string> = Object.fromEntries(LEAGUES.map(l => [l.name, l.bgClass]));

// Centralized slug generation — handles diacritics (é→e, ü→u, ñ→n)
export function generateSlug(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
