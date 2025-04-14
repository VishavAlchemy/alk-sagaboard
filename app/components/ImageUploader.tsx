'use client'
import React, { useState, useRef } from 'react'
import { PlusIcon } from '@radix-ui/react-icons'
import Image from 'next/image'

interface ImageUploaderProps {
  initialImage?: string;
  onImageChange: (file: File) => void;
  width?: number;
  height?: number;
  className?: string;
  placeholderClassName?: string;
  isRounded?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  initialImage = '/placeholder.svg',
  onImageChange,
  width = 100,
  height = 100,
  className = '',
  placeholderClassName = '',
  isRounded = false
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(initialImage)
  const [imageError, setImageError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a preview URL
    const fileUrl = URL.createObjectURL(file)
    setPreviewUrl(fileUrl)
    setImageError(false)
    
    // Pass the file to the parent component
    onImageChange(file)
  }

  const handleImageError = () => {
    setImageError(true)
    setPreviewUrl('/placeholder.svg')
  }

  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      onClick={handleClick}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      {!imageError ? (
        <div className="relative w-full h-full">
          <Image 
            src={previewUrl} 
            alt="Uploaded image" 
            fill
            className={`object-cover ${isRounded ? 'rounded-full' : 'rounded'}`}
            onError={handleImageError}
            sizes={`${width}px`}
            priority={true}
          />
        </div>
      ) : (
        <div 
          className={`w-full h-full flex items-center justify-center ${
            isRounded ? 'rounded-full' : 'rounded'
          } bg-gray-800 hover:bg-gray-700 transition-colors ${placeholderClassName}`}
        >
          <PlusIcon className="w-6 h-6 text-gray-400" />
        </div>
      )}
      
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity ${
          isRounded ? 'rounded-full' : 'rounded'
        }`}
      >
        <PlusIcon className="w-8 h-8 text-white" />
      </div>
    </div>
  )
}

export default ImageUploader 