"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  ImageIcon, 
  Upload, 
  X, 
  Camera, 
  FileImage,
  Trash2,
  Eye
} from "lucide-react"
import { useIsMobile, adminMobileTouchTargets } from "@/lib/mobile-utils"

interface UploadedImage {
  id: string
  file: File
  url: string
  name: string
  size: number
  uploadProgress?: number
}

interface MobileImageUploadProps {
  onUpload: (files: File[]) => void
  onRemove?: (imageId: string) => void
  maxFiles?: number
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
  uploadedImages?: UploadedImage[]
  isUploading?: boolean
  className?: string
}

export function MobileImageUpload({
  onUpload,
  onRemove,
  maxFiles = 5,
  maxFileSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  uploadedImages = [],
  isUploading = false,
  className = ""
}: MobileImageUploadProps) {
  const isMobile = useIsMobile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`
    }
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`
    }
    if (uploadedImages.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`
    }
    return null
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    
    setError(null)
    const validFiles: File[] = []
    const errors: string[] = []

    Array.from(files).forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    })

    if (errors.length > 0) {
      setError(errors.join(', '))
    }

    if (validFiles.length > 0) {
      onUpload(validFiles)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment')
      fileInputRef.current.click()
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
      >
        <div className={`p-6 text-center ${isMobile ? 'p-4' : ''}`}>
          <div className={`w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center ${isMobile ? 'w-10 h-10 mb-3' : ''}`}>
            <ImageIcon className={`text-muted-foreground ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </div>
          
          <div className="space-y-2">
            <p className={`font-medium ${isMobile ? 'text-sm' : ''}`}>
              Upload images
            </p>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {isMobile ? 'Tap to select or drag and drop' : 'Drag and drop or click to select'}
            </p>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>
              Max {maxFiles} files, {maxFileSize}MB each
            </p>
          </div>
          
          <div className={`flex gap-2 mt-4 ${isMobile ? 'flex-col' : 'justify-center'}`}>
            <Button
              type="button"
              variant="outline"
              onClick={openFileDialog}
              className={`${adminMobileTouchTargets.button} ${isMobile ? 'w-full' : ''}`}
              disabled={isUploading}
            >
              <FileImage className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            
            {isMobile && (
              <Button
                type="button"
                variant="outline"
                onClick={openCamera}
                className={`${adminMobileTouchTargets.button} w-full`}
                disabled={isUploading}
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">
            Uploaded Images ({uploadedImages.length}/{maxFiles})
          </h4>
          
          <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
            {uploadedImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="aspect-video relative bg-muted">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Upload Progress */}
                  {image.uploadProgress !== undefined && image.uploadProgress < 100 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-3/4 space-y-2">
                        <Progress value={image.uploadProgress} className="h-2" />
                        <p className="text-white text-xs text-center">
                          {image.uploadProgress}%
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      onClick={() => window.open(image.url, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={() => onRemove?.(image.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{image.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(image.size)}
                    </p>
                    {image.uploadProgress === 100 && (
                      <Badge variant="outline" className="text-xs">
                        Uploaded
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
