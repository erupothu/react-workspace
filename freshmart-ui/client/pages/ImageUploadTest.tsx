import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ImageUpload';

export default function ImageUploadTest() {
  const [images, setImages] = useState<string[]>([]);
  const [testImages, setTestImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a'
  ]);

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
    console.log('Images updated:', newImages);
  };

  const clearImages = () => {
    setImages([]);
  };

  const loadTestImages = () => {
    setImages([...testImages]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Image Upload Test</h1>
          <p className="text-gray-600 mt-2">
            Test the ImageUpload component functionality
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Image Upload Component</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              value={images}
              onChange={handleImagesChange}
              maxImages={5}
              maxFileSize={5}
              disabled={false}
            />

            <div className="flex gap-4">
              <Button onClick={clearImages} variant="outline">
                Clear All Images
              </Button>
              <Button onClick={loadTestImages} variant="outline">
                Load Test Images
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Current Images:</h4>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                {JSON.stringify(images, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Backend API:</strong> http://localhost:9090/api</p>
              <p><strong>Image Upload Endpoint:</strong> /images/upload</p>
              <p><strong>Multiple Upload Endpoint:</strong> /images/upload/multiple</p>
              <p><strong>Image Serve Endpoint:</strong> /images/serve/[filename]</p>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Instructions</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
            <li>Make sure the freshmart-be backend is running on port 9090</li>
            <li>Try uploading images using drag & drop or click to browse</li>
            <li>The component will show upload progress and preview uploaded images</li>
            <li>You can remove individual images by clicking the X button</li>
            <li>The first image will be marked as "Primary"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
