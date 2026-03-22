import Link from "next/link"

interface ViewAllButtonProps {
  href: string
  children: React.ReactNode
}

export function ViewAllButton({ href, children }: ViewAllButtonProps) {
  return (
    <Link
      href={href}
      className="font-display text-xs font-semibold uppercase tracking-wide text-primary hover:text-primary/80 transition-colors"
    >
      {children}
    </Link>
  )
}
