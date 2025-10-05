import { useState } from 'react';
import { MainMenu } from './components/main-menu';
import { UploadSection } from './components/upload-section';
import { VideoProcessingScreen } from './components/video-processing-screen';
import { VideoSummarizationScreen } from './components/video-summarization-screen';
import { PeopleTrackingScreen } from './components/people-tracking-screen';
import { AdvancedTrackSearchScreen } from './components/advanced-track-search-screen';

type Screen = 'menu' | 'upload-summarization' | 'upload-tracking' | 'upload-advanced' | 'processing-summarization' | 'processing-tracking' | 'processing-advanced' | 'summarization' | 'tracking' | 'advanced';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleModeSelect = (mode: string) => {
    setUploadedFile(null); // Reset file when selecting new mode
    switch (mode) {
      case 'summarization':
        setCurrentScreen('upload-summarization');
        break;
      case 'tracking':
        setCurrentScreen('upload-tracking');
        break;
      case 'advanced':
        setCurrentScreen('upload-advanced');
        break;
    }
  };

  const handleUploadComplete = (file: File, mode: string) => {
    setUploadedFile(file);
    switch (mode) {
      case 'summarization':
        setCurrentScreen('processing-summarization');
        break;
      case 'tracking':
        setCurrentScreen('processing-tracking');
        break;
      case 'advanced':
        setCurrentScreen('processing-advanced');
        break;
    }
  };

  const handleProcessingComplete = (mode: string) => {
    switch (mode) {
      case 'summarization':
        setCurrentScreen('summarization');
        break;
      case 'tracking':
        setCurrentScreen('tracking');
        break;
      case 'advanced':
        setCurrentScreen('advanced');
        break;
    }
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    setUploadedFile(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return <MainMenu onSelectMode={handleModeSelect} />;
      
      case 'upload-summarization':
        return (
          <UploadSection
            title="Video Summarization"
            description="Upload your surveillance footage to generate AI-powered event detection with searchable timeline and adjustable detail levels."
            howItWorks={[
              {
                title: "Upload Video",
                description: "Upload your surveillance footage in MP4 or AVI format for analysis"
              },
              {
                title: "AI Processing",
                description: "Our AI detects events, movements, and activities with confidence scoring"
              },
              {
                title: "Search & Review",
                description: "Browse timeline results, search events, and adjust detail levels"
              }
            ]}
            onUploadComplete={(file) => handleUploadComplete(file, 'summarization')}
            onBack={handleBackToMenu}
          />
        );
        
      case 'upload-tracking':
        return (
          <UploadSection
            title="People Tracking"
            description="Upload your video to enable advanced person detection and tracking with visual path overlays and multi-person management."
            howItWorks={[
              {
                title: "Upload Video",
                description: "Upload your surveillance footage for people detection and tracking"
              },
              {
                title: "Person Detection",
                description: "AI identifies and tracks individuals throughout your video footage"
              },
              {
                title: "Visual Tracking",
                description: "View tracking paths, manage multiple people, and analyze movements"
              }
            ]}
            onUploadComplete={(file) => handleUploadComplete(file, 'tracking')}
            onBack={handleBackToMenu}
          />
        );
        
      case 'upload-advanced':
        return (
          <UploadSection
            title="Advanced Track and Search"
            description="Upload your footage for comprehensive analysis combining people tracking with event summarization and advanced search capabilities."
            howItWorks={[
              {
                title: "Upload Video",
                description: "Upload your footage for comprehensive tracking and event analysis"
              },
              {
                title: "Combined Analysis",
                description: "AI tracks people while simultaneously detecting and categorizing events"
              },
              {
                title: "Advanced Search",
                description: "Search activities by person, event type, or natural language queries"
              }
            ]}
            onUploadComplete={(file) => handleUploadComplete(file, 'advanced')}
            onBack={handleBackToMenu}
          />
        );
      
      case 'processing-summarization':
        return (
          <VideoProcessingScreen
            fileName={uploadedFile?.name || 'video.mp4'}
            onProcessingComplete={() => handleProcessingComplete('summarization')}
            onBack={handleBackToMenu}
          />
        );
        
      case 'processing-tracking':
        return (
          <VideoProcessingScreen
            fileName={uploadedFile?.name || 'video.mp4'}
            onProcessingComplete={() => handleProcessingComplete('tracking')}
            onBack={handleBackToMenu}
          />
        );
        
      case 'processing-advanced':
        return (
          <VideoProcessingScreen
            fileName={uploadedFile?.name || 'video.mp4'}
            onProcessingComplete={() => handleProcessingComplete('advanced')}
            onBack={handleBackToMenu}
          />
        );

      case 'summarization':
        return (
          <VideoSummarizationScreen
            fileName={uploadedFile?.name || 'video.mp4'}
            onBack={handleBackToMenu}
          />
        );
        
      case 'tracking':
        return (
          <PeopleTrackingScreen
            fileName={uploadedFile?.name || 'video.mp4'}
            onBack={handleBackToMenu}
          />
        );
        
      case 'advanced':
        return (
          <AdvancedTrackSearchScreen
            fileName={uploadedFile?.name || 'video.mp4'}
            onBack={handleBackToMenu}
          />
        );
        
      default:
        return <MainMenu onSelectMode={handleModeSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
    </div>
  );
}