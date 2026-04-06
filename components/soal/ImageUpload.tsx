'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  value?: string | null
  onChange: (url: string | null) => void
  onFileDelete?: (filePath: string) => void
  className?: string
  maxSizeKB?: number
  uploadEndpoint?: string
  folder?: string
}

export function ImageUpload({ 
  value, 
  onChange, 
  onFileDelete, 
  className = '',
  maxSizeKB = 100,
  uploadEndpoint = '/api/upload/image',
  folder = 'soal-images'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value ?? null)
  const [filePath, setFilePath] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const compressImage = async (file: File, quality = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          const maxWidth = 1920
          const maxHeight = 1920
          let width = img.width
          let height = img.height
          
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width
              width = maxWidth
            } else {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }
          
          canvas.width = width
          canvas.height = height
          ctx?.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Compression failed'))
              }
            },
            file.type === 'image/png' ? 'image/png' : 'image/jpeg',
            quality
          )
        }
        img.onerror = (error) => reject(error)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar (JPEG, PNG, GIF, atau WebP)')
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Ukuran file maksimal 5MB')
      return
    }

    setIsUploading(true)

    try {
      let fileToUpload: File | Blob = file

      if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') {
        try {
          fileToUpload = await compressImage(file, 0.8)
          fileToUpload = new File([fileToUpload], file.name, { type: file.type })
        } catch (error) {
          console.error('Compression error:', error)
        }
      }

      const formData = new FormData()
      formData.append('file', fileToUpload)
      formData.append('folder', folder)
      if (filePath) {
        formData.append('oldFilePath', filePath)
      }
      formData.append('maxSizeKB', maxSizeKB.toString())

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      const result = await response.json()

      if (!result.success) {
        toast.error(result.error?.message || 'Gagal mengupload gambar')
        return
      }

      onChange(result.data.url)
      setPreview(result.data.url)
      setFilePath(result.data.filePath)
      toast.success('Gambar berhasil diupload')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Terjadi kesalahan saat mengupload gambar')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    if (filePath && onFileDelete) {
      onFileDelete(filePath)
    }
    onChange(null)
    setPreview(null)
    setFilePath(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Gambar (Opsional)</label>
        
        {!preview ? (
          <div
            className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              {isUploading ? 'Mengupload...' : 'Klik untuk upload gambar'}
            </p>
            <p className="text-xs text-gray-500">
              Maksimal 5MB (JPEG, PNG, GIF, WebP) - Otomatis dikompres
            </p>
          </div>
        ) : (
          <div className="relative border border-gray-200 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-contain bg-gray-50"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
