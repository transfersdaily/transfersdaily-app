import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ViewAllButtonProps {
  href: string
  children: React.ReactNode
  variant?: "default" | "orange"
}

export function ViewAllButton({ href, children, variant = "default" }: ViewAllButtonProps) {
  const className = variant === "orange" 
    ? "bg-orange-600 text-white hover:bg-orange-700 shadow-md"
    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"

  return (
    <Button asChild className={className}>
      <Link href={href}>{children}</Link>
    </Button>
  )
}