import React, { useCallback, useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  currentImageUrl: string;
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
  hasError?: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onUpload,
  isUploading = false,
  hasError = false,
  className = ''
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Create a preview URL for immediate feedback
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Call the onUpload callback with the file
      await onUpload(file);
    } catch (error) {
      console.error('Error handling file select:', error);
      // Clean up the preview URL on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [onUpload, previewUrl]);

  // Clean up preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const displayImage = previewUrl || currentImageUrl;

  return (
    <div className={`relative group ${className}`}>
      <div className="aspect-square w-full relative overflow-hidden rounded-lg border-2 border-gray-700 hover:border-gray-500 transition-colors">
        {!hasError ? (
          <Image
            src={displayImage}
            alt="Upload image"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
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