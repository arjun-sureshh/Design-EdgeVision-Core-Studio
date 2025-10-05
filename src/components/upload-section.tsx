import { useState, useEffect, useRef } from 'react';
import { Upload, FileVideo, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { updateEnvWithFile } from '../api/uploadApi';  // Import from API module

interface HowItWorksStep {
  title: string;
  description: string;
}

interface UploadSectionProps {
  title: string;
  description: string;
  howItWorks: HowItWorksStep[];
  onUploadComplete: (file: File) => void;
  onBack: () => void;
}

export function UploadSection({ title, description, howItWorks, onUploadComplete, onBack }: UploadSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
const [isUploading, setIsUploading] = useState(false);
// Duplicate declaration removed
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
      setShowSuccessAnimation(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setShowSuccessAnimation(true);
    }
  };
//............................
  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New: Function to trigger file input click
  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

 // New: Function to upload file to backend API
// Updated: Sends JSON with project_name + file_name to backend (no file upload)
// Updated: Dynamically sets project_name based on title prop (e.g., 'vlm' for "Video Summarization", 'reid' for "People Tracking")
const uploadFileToBackend = async (file: File) => {
  try {
    setIsUploading(true);
    // console.log('Sending JSON to:', 'http://localhost:8000/update-env'); // Debug log (matches API_BASE)
    
    // Dynamically determine project_name from title
    let projectName = 'reid';  // Default fallback
    if (title === "Video Summarization") {
      projectName = 'vlm';
    } else if (title === "People Tracking") {
      projectName = 'reid';
    }
    console.log(`Determined project_name: '${projectName}' from title: '${title}'`);
    
    // Call the new API: Passes dynamic project_name and file_name (filename only)
    const result = await updateEnvWithFile(projectName, file.name);  
    
    console.log('Response status:', 200); // Success (from API)
    console.log('Update success:', result);
    onUploadComplete(file);  // Proceed after .env update
  } catch (error) {
    console.error('Full update error:', error); // More details
    if (error instanceof Error) {
      alert(`Failed: ${error.message}`); // Show server error if any
    } else {
      alert('Failed: An unknown error occurred.');
    }
  } finally {
    setIsUploading(false);
  }
};
  // ....................

  // Animation timing effect
  useEffect(() => {
    if (showSuccessAnimation) {
      const timer = setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 3000); // Animation duration: 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessAnimation]);

  const handleStartAnalysis = () => {
    if (uploadedFile) {
      uploadFileToBackend(uploadedFile)
      onUploadComplete(uploadedFile);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-0.5" />
            Back to Menu
          </Button>
          <div>
            <h1 className="text-xl font-medium text-foreground text-right">{title}</h1>
            <p className="text-sm text-muted-foreground text-right">EdgeVision Core Studio</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium text-foreground mb-4">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          {/* Upload Area */}
          <Card className="p-8 mb-8">
            <div
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                isDragOver
                  ? 'border-primary bg-accent/50'
                  : 'border-border hover:border-muted-foreground'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Apple Intelligence Border Animation */}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,.mp4,.avi"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              
              {uploadedFile ? (
                <div className="space-y-4 relative">
                  {/* Success checkmark - always visible, animated only during success animation */}
                  <div className="relative flex justify-center">
                    <CheckCircle className={`w-16 h-16 text-green-600 relative z-10 ${showSuccessAnimation ? 'animate-scale-success' : ''}`} />
                  </div>
                  
                  <div className={showSuccessAnimation ? 'animate-fade-up' : ''}>
                    <h3 className="text-lg font-medium text-foreground mb-2">Video Ready for Analysis</h3>
                    <p className="text-muted-foreground">
                      {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(1)} MB)
                    </p>
                  </div>
                  
                  <style>{`
                    @keyframes scale-success {
                      0% {
                        transform: scale(0);
                        opacity: 0;
                      }
                      50% {
                        transform: scale(1.2);
                      }
                      100% {
                        transform: scale(1);
                        opacity: 1;
                      }
                    }
                    
                    @keyframes fade-up {
                      0% {
                        opacity: 0;
                        transform: translateY(10px);
                      }
                      100% {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }
                    
                    @keyframes border-glow {
                      0% {
                        box-shadow: 
                          0 0 0 1px rgba(34, 197, 94, 0),
                          0 0 0 2px rgba(34, 197, 94, 0),
                          0 0 20px rgba(34, 197, 94, 0);
                      }
                      20% {
                        box-shadow: 
                          0 0 0 1px rgba(34, 197, 94, 0.8),
                          0 0 0 2px rgba(34, 197, 94, 0.4),
                          0 0 20px rgba(34, 197, 94, 0.2);
                      }
                      80% {
                        box-shadow: 
                          0 0 0 1px rgba(34, 197, 94, 0.8),
                          0 0 0 2px rgba(34, 197, 94, 0.4),
                          0 0 20px rgba(34, 197, 94, 0.2);
                      }
                      100% {
                        box-shadow: 
                          0 0 0 1px rgba(34, 197, 94, 0),
                          0 0 0 2px rgba(34, 197, 94, 0),
                          0 0 20px rgba(34, 197, 94, 0);
                      }
                    }
                    
                    .animate-scale-success {
                      animation: scale-success 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    }
                    
                    .animate-fade-up {
                      animation: fade-up 0.6s ease-out 0.4s both;
                    }
                    
                    .border-animation-overlay {
                      border-radius: 0.5rem;
                      animation: border-glow 3s ease-in-out forwards;
                    }
                  `}</style>
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
                      Upload Your Surveillance Video
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop your video file here, or click to browse
                    </p>
                    <label htmlFor="video-upload">
                     <Button 
                      variant="outline" 
                      onClick={handleSelectFileClick}
                      className="cursor-pointer"
                    >
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

          {/* How it Works */}
          <div className="mb-12 text-center">
            <div className="max-w-4xl mx-auto relative">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-accent rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 left-0 w-2 h-16 bg-muted-foreground rounded-full opacity-20"></div>
                <div className="absolute top-1/3 right-0 w-1 h-12 bg-muted-foreground rounded-full opacity-20"></div>
              </div>
              
              <h2 className="text-2xl font-medium text-foreground mb-6 relative z-10">
                How it Works
              </h2>
              <div className="grid md:grid-cols-3 gap-8 relative z-10">
                {howItWorks.map((step, index) => (
                  <div key={index} className="text-center relative group">
                    {/* Enhanced connection line for desktop */}
                    {index < howItWorks.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-1/2 w-full h-0.5 z-0">
                        <div className="absolute left-6 right-0 h-full bg-gradient-to-r from-accent via-border to-accent opacity-60"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-accent rounded-full opacity-80"></div>
                      </div>
                    )}
                    
                    {/* Step card */}
                    <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 transition-all duration-300 group-hover:shadow-lg group-hover:border-border">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent to-muted rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm relative z-20 border border-border/30">
                        <span className="text-lg font-medium text-accent-foreground">{index + 1}</span>
                      </div>
                      <h4 className="font-medium text-foreground mb-2">{step.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <Button 
              onClick={handleStartAnalysis}
              disabled={!uploadedFile}
              size="lg"
              className="px-8"
            >
              Start {title}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}