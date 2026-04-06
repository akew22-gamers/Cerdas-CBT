/**
 * Image compression utility using Canvas API
 * Compresses images to target file size (< 100KB)
 */

interface CompressionOptions {
  maxSizeKB?: number
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

/**
 * Compress an image file to target size using Canvas
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise resolving to compressed Blob
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<Blob> {
  const {
    maxSizeKB = 100,
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8
  } = options

  // Convert File to Image
  const img = await createImageBitmap(file)
  
  // Calculate new dimensions maintaining aspect ratio
  let width = img.width
  let height = img.height
  
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height)
    width = Math.floor(width * ratio)
    height = Math.floor(height * ratio)
  }

  // Create canvas
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('Canvas context not supported')
  }

  // Draw image on canvas
  ctx.drawImage(img, 0, 0, width, height)
  
  // Compress with initial quality
  let compressedBlob = await canvas.convertToBlob({
    type: 'image/jpeg',
    quality
  })

  // If still too large, reduce quality iteratively
  let currentQuality = quality
  while (compressedBlob.size > maxSizeKB * 1024 && currentQuality > 0.1) {
    currentQuality -= 0.1
    compressedBlob = await canvas.convertToBlob({
      type: 'image/jpeg',
      quality: currentQuality
    })
  }

  return compressedBlob
}

/**
 * Compress image and convert to File
 * @param file - The image file to compress
 * @param filename - Desired filename for output
 * @param options - Compression options
 * @returns Promise resolving to compressed File
 */
export async function compressImageToFile(
  file: File,
  filename: string,
  options: CompressionOptions = {}
): Promise<File> {
  const blob = await compressImage(file, options)
  return new File([blob], filename, {
    type: 'image/jpeg',
    lastModified: Date.now()
  })
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Check if file needs compression
 */
export function needsCompression(file: File, maxSizeKB: number = 100): boolean {
  return file.size > maxSizeKB * 1024
}
