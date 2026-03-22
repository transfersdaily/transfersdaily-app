import { AdSlot } from "@/components/ads"

interface ArticleBodyProps {
  content: string
}

/**
 * Article body: parses content lines into headings and paragraphs,
 * interleaves AdSlot placements after paragraph indices 2 and 5.
 * Server component -- no 'use client'.
 */
export function ArticleBody({ content }: ArticleBodyProps) {
  if (!content) {
    return (
      <div className="max-w-[65ch]">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Content not available.
        </p>
      </div>
    )
  }

  const lines = content.split("\n")

  return (
    <div className="max-w-[65ch]">
      {lines.map((line, index) => {
        const trimmed = line.trim()
        if (!trimmed) return null

        const elements: React.ReactNode[] = []

        // Parse headings and paragraphs
        if (trimmed.startsWith("### ")) {
          elements.push(
            <h3
              key={index}
              className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mt-6 md:mt-8 mb-3 md:mb-4 first:mt-0"
            >
              {trimmed.substring(4)}
            </h3>
          )
        } else if (trimmed.startsWith("## ")) {
          elements.push(
            <h2
              key={index}
              className="text-3xl font-bold text-foreground mt-10 mb-6 first:mt-0"
            >
              {trimmed.substring(3)}
            </h2>
          )
        } else if (trimmed.startsWith("# ")) {
          elements.push(
            <h1
              key={index}
              className="text-4xl font-bold text-foreground mt-8 mb-6 first:mt-0"
            >
              {trimmed.substring(2)}
            </h1>
          )
        } else {
          elements.push(
            <p
              key={index}
              className="font-sans text-base md:text-lg leading-relaxed text-foreground mb-4"
            >
              {trimmed}
            </p>
          )
        }

        // Interleave ads after specific paragraph indices
        if (index === 2) {
          elements.push(
            <AdSlot placement="article.paragraph-1" key={`ad-${index}`} />
          )
        } else if (index === 5) {
          elements.push(
            <AdSlot placement="article.paragraph-3" key={`ad-${index}`} />
          )
        }

        return elements
      })}
    </div>
  )
}
