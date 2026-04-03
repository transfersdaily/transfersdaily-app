export function DashboardGrid({ children, cols = 4 }: { children: React.ReactNode; cols?: 3 | 4 | 5 }) {
  const gridClass = cols === 3
    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    : cols === 5
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
  return <div className={gridClass}>{children}</div>
}
