/**
 * Reading time calculation utility.
 * Estimates reading time based on word count at ~200 words per minute.
 */

/**
 * Calculate estimated reading time in minutes from content text.
 * Splits on whitespace, counts words, divides by 200, rounds up.
 * Returns minimum 1 minute.
 */
export function calculateReadingTime(content: string): number {
  if (!content || content.trim().length === 0) {
    return 1
  }

  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / 200)

  return Math.max(1, minutes)
}
