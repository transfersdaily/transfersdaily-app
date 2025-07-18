import { Card, CardContent } from "@/components/ui/card"

interface AdBannerProps {
  size: "300x250" | "300x600" | "728x90" | "320x100"
  className?: string
  sticky?: boolean
}

export function AdBanner({ size, className = "", sticky = false }: AdBannerProps) {
  const getDimensions = () => {
    switch (size) {
      case "300x250":
        return { width: "300px", height: "250px", label: "Medium Rectangle" }
      case "300x600":
        return { width: "300px", height: "600px", label: "Half Page" }
      case "728x90":
        return { width: "728px", height: "90px", label: "Leaderboard" }
      case "320x100":
        return { width: "320px", height: "100px", label: "Mobile Banner" }
      default:
        return { width: "300px", height: "250px", label: "Ad" }
    }
  }

  const { width, height, label } = getDimensions()

  return (
    <div className={`${className} ${sticky ? "sticky top-4" : ""}`}>
      <Card className="border-dashed border-2 border-muted-foreground/20">
        <CardContent 
          className="flex items-center justify-center text-muted-foreground bg-muted/10"
          style={{ width, height, minHeight: height }}
        >
          <div className="text-center">
            <div className="text-sm font-medium mb-1">Advertisement</div>
            <div className="text-xs opacity-60">{label} ({size})</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
