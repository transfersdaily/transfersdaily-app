/**
 * Utility functions for handling images and fallbacks
 */

export const PLACEHOLDER_IMAGE = '/placeholder-image.svg'
export const TRANSPARENT_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

/**
 * Handle image load errors with fallback
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const img = event.currentTarget
  const originalSrc = img.src
  
  // Avoid infinite loop if placeholder also fails
  if (img.src === PLACEHOLDER_IMAGE || img.src === TRANSPARENT_PNG) {
    console.error('Placeholder image also failed to load')
    img.style.display = 'none'
    return
  }
  
  console.error('Failed to load image:', originalSrc)
  
  // Try SVG placeholder first, then transparent PNG as ultimate fallback
  if (originalSrc !== PLACEHOLDER_IMAGE) {
    img.src = PLACEHOLDER_IMAGE
    img.alt = 'Image not available'
  } else {
    img.src = TRANSPARENT_PNG
    img.alt = 'Image not available'
  }
}

/**
 * Check if an image URL is valid/accessible
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false
  
  // Basic URL validation
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Get optimized image URL for CloudFront
 */
export const getOptimizedImageUrl = (url: string, width?: number, height?: number): string => {
  if (!url || !url.includes('cloudfront.net')) {
    return url
  }
  
  // Add optimization parameters if needed
  const params = new URLSearchParams()
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  
  return params.toString() ? `${url}?${params.toString()}` : url
}
