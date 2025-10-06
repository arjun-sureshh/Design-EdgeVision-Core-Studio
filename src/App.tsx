import { useState } from 'react';
import { MainMenu } from './components/main-menu';
import { UploadSection } from './components/upload-section';
import { VideoProcessingScreen } from './components/video-processing-screen';
import { VideoSummarizationScreen } from './components/video-summarization-screen';
import { PeopleTrackingScreen } from './components/people-tracking-screen';
import { AdvancedTrackSearchScreen } from './components/advanced-track-search-screen';
import { updateEnvWithFile, checkResponseStatus } from './api/uploadApi';  // Import from API module

type Screen = 'menu' | 'upload-summarization' | 'upload-tracking' | 'upload-advanced' | 'processing-summarization' | 'processing-tracking' | 'processing-advanced' | 'summarization' | 'tracking' | 'advanced';

type ProjectName = 'vlm' | 'reid' | 'advanced';  // For derivation

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState({});  // Global result state (optional, if needed across screens)

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

  // Updated: Accepts result from processing
  const handleProcessingComplete = (mode: string, processingResult: any) => {
    setResult(processingResult);  // Store result globally if needed
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

  // Updated: Passes projectName to processing screen for polling
  const handleUploadComplete = (file: File, mode: string) => {
    setUploadedFile(file);
    let projectName: ProjectName = 'reid';  // Default
    switch (mode) {
      case 'summarization':
        projectName = 'vlm';
        setCurrentScreen('processing-summarization');
        break;
      case 'tracking':
        projectName = 'reid';
        setCurrentScreen('processing-tracking');
        break;
      case 'advanced':
        projectName = 'advanced';
        setCurrentScreen('processing-advanced');
        break;
    }
    // Call upload logic (assuming UploadSection calls this after file select)
    uploadFileToBackend(file, projectName);
  };

  // Your uploadFileToBackend (unchanged from previous)
  const uploadFileToBackend = async (file: File, projectName: string) => {
    try {
      setIsUploading(true);
      // Step 1: Call request API (triggers process)
      const requestResult = await updateEnvWithFile(projectName, file.name);
      if (requestResult.status !== 'true' || requestResult.message !== 'success') {
        throw new Error(`Request API failed: ${requestResult.message}`);
      }
      console.log('Request API success:', requestResult);
      
      // Step 2: Poll response API until success (every 5s, max 60s)
      const POLL_DELAY_MS = 5000;  // 5 seconds
      const MAX_POLL_ATTEMPTS = 12;  // 60s total
      let pollAttempts = 0;
      
      while (pollAttempts < MAX_POLL_ATTEMPTS) {
        pollAttempts++;
        console.log(`Polling response API (attempt ${pollAttempts}/${MAX_POLL_ATTEMPTS}) for ${file.name}...`);
        
        try {
          const responseResult = await checkResponseStatus(projectName, file.name);
          
          // Check for success (status: "true" + message: "success")
          if (responseResult.status === 'true' && responseResult.message === 'success') {
            console.log('Response API success:', responseResult);
            // For VLM: output_path is summary; for REID: video
            // console.log(`Output ready - Path: ${responseResult.output_path} (VLM: summary, REID: video)`);
            // Pass to onProcessingComplete
            // onProcessingComplete(projectName, responseResult);  // If needed in App
            return responseResult;  // Return for processing screen
          } else if (responseResult.status === 'false' && responseResult.message === 'inprogress') {
            console.log('Still in progress:', responseResult.message);
          } else {
            console.log('Unexpected response:', responseResult);
          }
        } catch (pollError) {
          console.log('Poll error (continuing):', pollError);
        }
        
        // Delay before next poll
        await new Promise(resolve => setTimeout(resolve, POLL_DELAY_MS));
      }
      
      // Timeout
      console.log('Polling timeout - process not complete');
      throw new Error('Response timeout - check backend logs');
      
    } catch (error) {
      console.error('Full upload error:', error);
      if (error instanceof Error) {
        alert(`Failed: ${error.message}`);
      } else {
        alert('Failed: An unknown error occurred.');
      }
      throw error;  // Re-throw for handling
    } finally {
      setIsUploading(false);
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
            uploadFileToBackend={uploadFileToBackend}
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
            uploadFileToBackend={uploadFileToBackend}
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
            uploadFileToBackend={uploadFileToBackend}
          />
        );
      
      case 'processing-summarization':
        return (
          <VideoProcessingScreen
            fileName={uploadedFile?.name || 'video.mp4'}
            projectName="vlm"  // Derived for polling
            onProcessingComplete={(result) => handleProcessingComplete('summarization', result)}
            onBack={handleBackToMenu}
          />
        );
        
      case 'processing-tracking':
        return (
          <VideoProcessingScreen
            fileName={uploadedFile?.name || 'video.mp4'}
            projectName="reid"
            onProcessingComplete={(result) => handleProcessingComplete('tracking', result)}
            onBack={handleBackToMenu}
          />
        );
        
      case 'processing-advanced':
        return (
          <VideoProcessingScreen
            fileName={uploadedFile?.name || 'video.mp4'}
            projectName="advanced"
            onProcessingComplete={(result) => handleProcessingComplete('advanced', result)}
            onBack={handleBackToMenu}
          />
        );

      case 'summarization':
        return (
          <VideoSummarizationScreen
            fileName={uploadedFile?.name || 'video.mp4'}
            result={result}  // Pass result (output_path for summary)
            onBack={handleBackToMenu}
          />
        );
        
      case 'tracking':
        return (
          <PeopleTrackingScreen
            fileName={uploadedFile?.name || 'video.mp4'}
            result={result}  // Pass result (output_path for video)
            onBack={handleBackToMenu}
          />
        );
        
      case 'advanced':
        return (
          <AdvancedTrackSearchScreen
            fileName={uploadedFile?.name || 'video.mp4'}
            result={result}  // Pass result
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