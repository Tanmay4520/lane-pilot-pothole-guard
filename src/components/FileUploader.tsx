
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
}

const FileUploader = ({ onFileSelected }: FileUploaderProps) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const validateFile = (file: File): boolean => {
    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      setFileError('Please upload a valid video file.');
      return false;
    }
    
    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      setFileError('File size exceeds 50MB limit.');
      return false;
    }
    
    setFileError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelected(file);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been uploaded for processing.`,
        });
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelected(file);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been uploaded for processing.`,
        });
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      {fileError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}
      
      <div 
        className={`border-2 border-dashed rounded-lg p-10 text-center ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
        } transition-all duration-200 cursor-pointer`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="video/*"
          onChange={handleChange}
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold">Upload a driving video</h3>
        <p className="mt-1 text-xs text-gray-500">
          Drag and drop a video file or click to browse
        </p>
        <p className="mt-2 text-xs text-gray-400">
          MP4, MOV or AVI up to 50MB
        </p>
        
        <div className="mt-4">
          <label htmlFor="file-upload">
            <Button type="button" variant="outline">Select File</Button>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
