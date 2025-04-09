import React, { useCallback, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';

interface ImageUploadProps {
  currentImageUrl: string;
  onImageUpload: (storageId: string) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImageUrl, onImageUpload, className = '' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveStorageId = useMutation(api.files.uploadFile);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Get the upload URL from Convex
      const postUrl = await generateUploadUrl();
      
      if (!postUrl) {
        throw new Error('Failed to get upload URL');
      }

      // Upload the file to Convex Storage
      const result = await fetch(postUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!result.ok) {
        throw new Error(`Failed to upload file: ${result.statusText}`);
      }

      // Extract the storageId from the upload URL
      const storageId = postUrl.split("/").pop();
      
      if (!storageId) {
        throw new Error('Failed to get storage ID from upload URL');
      }

      // Register the file in the database
      await saveStorageId({ storageId, fileName: file.name });

      // Call the callback with the storage ID
      onImageUpload(storageId);
    } catch (error) {
      console.error('Error uploading image:', error);
      // Clean up the preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [generateUploadUrl, saveStorageId, onImageUpload, previewUrl]);

  // Clean up preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className={`relative group ${className}`}>
      <div className="aspect-square w-full relative overflow-hidden rounded-lg border-2 border-gray-700 hover:border-gray-500 transition-colors">
        <Image
          src={previewUrl || currentImageUrl}
          alt="Company logo"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <label className="cursor-pointer bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors border border-gray-700">
            {isUploading ? 'Uploading...' : 'Change Image'}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload; 