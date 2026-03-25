"use client"

import { Badge } from "@/components/ui/badge"
import type { SocialPlatformResult, SocialPlatform } from "@/types/social"

const PLATFORMS: { key: SocialPlatform; label: string }[] = [
  { key: "twitter", label: "X" },
  { key: "bluesky", label: "Bluesky" },
  { key: "facebook", label: "Facebook" },
  { key: "threads", label: "Threads" },
]

interface SocialPostStatusProps {
  socialMediaData: Record<string, unknown> | null | undefined
}

export function SocialPostStatus({ socialMediaData }: SocialPostStatusProps) {
  if (!socialMediaData || typeof socialMediaData !== "object") {
    return (
      <div className="text-xs text-muted-foreground">
        No social data available
      </div>
    )
  }

  // Social results may be at top level or nested under socialResults
  const results =
    (socialMediaData as Record<string, unknown>).socialResults ??
    socialMediaData

  if (!results || typeof results !== "object") {
    return (
      <div className="text-xs text-muted-foreground">
        No social data available
      </div>
    )
  }

  const platformResults = results as Record<string, SocialPlatformResult>

  // Check if any platform data exists
  const hasPlatformData = PLATFORMS.some(
    (p) =>
      platformResults[p.key] &&
      typeof platformResults[p.key] === "object" &&
      "success" in platformResults[p.key]
  )

  if (!hasPlatformData) {
    return (
      <div className="text-xs text-muted-foreground">
        Not posted to social media
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {PLATFORMS.map((platform) => {
        const result = platformResults[platform.key]

        if (!result || typeof result !== "object") {
          return (
            <Badge
              key={platform.key}
              variant="outline"
              className="text-[10px] px-1.5 py-0 bg-gray-50 text-gray-400 border-gray-200"
            >
              {platform.label}
            </Badge>
          )
        }

        if (result.skipped) {
          return (
            <Badge
              key={platform.key}
              variant="outline"
              className="text-[10px] px-1.5 py-0 bg-gray-50 text-gray-500 border-gray-200"
              title={result.reason ?? "Skipped"}
            >
              {platform.label} -- skipped
            </Badge>
          )
        }

        if (result.success) {
          return (
            <Badge
              key={platform.key}
              variant="outline"
              className="text-[10px] px-1.5 py-0 bg-green-50 text-green-700 border-green-200"
              title={result.uri ?? "Posted successfully"}
            >
              {platform.label} -- posted
            </Badge>
          )
        }

        return (
          <Badge
            key={platform.key}
            variant="outline"
            className="text-[10px] px-1.5 py-0 bg-red-50 text-red-700 border-red-200"
            title={result.error ?? "Failed"}
          >
            {platform.label} -- failed
          </Badge>
        )
      })}
    </div>
  )
}
