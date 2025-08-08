import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

interface ImageUploadProps {
  value: string[];
  onChange: (images: string[]) => void;
  categoryId?: string;
  maxImages?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  disabled?: boolean;
  className?: string;
}

export default function ImageUpload({
  value = [],
  onChange,
  categoryId = "",
  maxImages = 5,
  maxFileSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  disabled = false,
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`;
    }
    
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size too large. Maximum size: ${maxFileSize}MB`;
    }
    
    return null;
  };

  const handleFileUpload = async (files: File[]) => {
    if (disabled) return;
    
    setError(null);
    
    // Check if adding these files would exceed the limit
    if (value.length + files.length > maxImages) {
      setError(`Cannot upload more than ${maxImages} images`);
      return;
    }

    // Validate all files
    for (const file of files) {
      const validation = validateFile(file);
      if (validation) {
        setError(validation);
        return;
      }
    }

    setUploading(true);
    
    try {
      const uploadPromises = files.map(file => api.images.uploadImage(file, categoryId, "harish",));
      const results = await Promise.all(uploadPromises);
      
      const newImageUrls: string[] = [];
      
      for (const result of results) {
        if (result.success && result.data) {
          // Handle both direct URL and object with URL property
          const imageUrl = typeof result.data === 'string'
            ? result.data
            : result.data.url || result.data.filename;
          if (imageUrl) {
            newImageUrls.push(imageUrl);
          } else {
            throw new Error('Invalid response format');
          }
        } else {
          throw new Error(result.error?.message || 'Upload failed');
        }
      }
      
      onChange([...value, ...newImageUrls]);
    } catch (err) {
      console.error('Upload error:', err);
      let errorMessage = 'Failed to upload images. Please try again.';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files);
    }
    // Reset input
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const canAddMore = value.length < maxImages;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Label>Product Images</Label>
        <Badge variant="outline" className="text-xs">
          {value.length}/{maxImages} images
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              {index === 0 && (
                <Badge className="absolute bottom-2 left-2 text-xs">
                  Primary
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && !disabled && (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-gray-400',
            'cursor-pointer'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex flex-col items-center space-y-2">
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-gray-600">Uploading images...</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                  {value.length === 0 ? (
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  ) : (
                    <Plus className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {value.length === 0 ? 'Upload product images' : 'Add more images'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Drag and drop or click to browse
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  PNG, JPG, WebP up to {maxFileSize}MB each
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>• First image will be used as the primary product image</p>
        <p>• Recommended size: 800x800px or larger</p>
        <p>�� Maximum {maxImages} images per product</p>
      </div>
    </div>
  );
}
