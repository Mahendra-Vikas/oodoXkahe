'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadImage } from '@/lib/supabase'

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
  label?: string
}

export function ImageUpload({ onUpload, currentImage, label = 'Cover Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setUploading(true)

    const url = await uploadImage(file, 'covers')
    setUploading(false)

    if (url) {
      onUpload(url)
    } else {
      setPreview(currentImage || null)
      alert('Upload failed. Check Supabase bucket permissions.')
    }
  }, [onUpload, currentImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  })

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: '#6B7A9F' }}>
        {label}
      </label>
      <div
        {...getRootProps()}
        className="relative rounded-xl overflow-hidden cursor-pointer transition-all"
        style={{
          border: isDragActive ? '2px dashed #00E5CC' : '2px dashed rgba(255,255,255,0.1)',
          background: isDragActive ? 'rgba(0,229,204,0.05)' : 'rgba(255,255,255,0.03)',
          minHeight: preview ? 'auto' : '140px',
        }}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(0,0,0,0.5)' }}>
              <p className="text-white text-sm font-medium">Click to change</p>
            </div>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.6)' }}>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: '#FF6B6B', borderTopColor: 'transparent' }} />
                  <p className="text-white text-xs">Uploading...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-36 gap-2">
            <span className="text-3xl">{uploading ? '⏳' : isDragActive ? '📂' : '🖼️'}</span>
            <p className="text-sm" style={{ color: '#6B7A9F' }}>
              {uploading ? 'Uploading...' : isDragActive ? 'Drop it here!' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs" style={{ color: '#6B7A9F' }}>JPG, PNG, WebP up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  )
}
