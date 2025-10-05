import { useState } from 'react';
import { Upload, FileVideo, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface UploadScreenProps {
  onUploadComplete: (file: File) => void;
}

export function UploadScreen({ onUploadComplete }: UploadScreenProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => 
      file.type.startsWith('video/') || 
      file.name.toLowerCase().endsWith('.mp4') ||
      file.name.toLowerCase().endsWith('.avi')
    );
    
    if (videoFile) {
      setUploadedFile(videoFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleGetStarted = () => {
    if (uploadedFile) {
      onUploadComplete(uploadedFile);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-medium text-foreground">EdgeVision Core Studio</h1>
          <p className="text-muted-foreground mt-1">
            Lightweight video analysis demonstration platform
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium text-foreground mb-4">
              Experience EdgeVision's Core Capabilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your surveillance footage to test video summarization, people tracking, 
              and combined analysis features. See EdgeVision's real-world value in action.
            </p>
          </div>

          {/* Upload Area */}
          <Card className="p-8 mb-8">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                isDragOver
                  ? 'border-primary bg-accent/50'
                  : 'border-border hover:border-muted-foreground'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="video/*,.mp4,.avi"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              
              {uploadedFile ? (
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto" />
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">File Ready</h3>
                    <p className="text-muted-foreground">
                      {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(1)} MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Upload Your Video
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop your surveillance footage here, or click to browse
                    </p>
                    <label htmlFor="video-upload">
                      <Button variant="outline" className="cursor-pointer">
                        <FileVideo className="w-4 h-4 mr-2" />
                        Select Video File
                      </Button>
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Supported formats: MP4, AVI • Maximum file size: 500MB
              </p>
            </div>
          </Card>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <h3 className="font-medium text-foreground mb-2">Video Summarization</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered event detection with searchable timeline and adjustable detail levels
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-lg">👥</span>
              </div>
              <h3 className="font-medium text-foreground mb-2">People Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Select and track individuals throughout your footage with highlighted paths
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-lg">🔗</span>
              </div>
              <h3 className="font-medium text-foreground mb-2">Combined Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Person-specific activity summaries merging tracking with event detection
              </p>
            </Card>
          </div>

          {/* Get Started Button */}
          <div className="text-center">
            <Button 
              onClick={handleGetStarted}
              disabled={!uploadedFile}
              size="lg"
              className="px-8"
            >
              Get Started with Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}