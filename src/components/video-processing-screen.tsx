import { useState, useEffect } from 'react';
import { ShieldCheck, Clock, AlertCircle, Play, Brain, Search, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ProcessingStatsAnimation } from './processing-stats-animation';

interface VideoProcessingScreenProps {
  fileName: string;
  onProcessingComplete: () => void;
  onBack: () => void;
}

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface DetectedEvent {
  timestamp: string;
  type: string;
  description: string;
  confidence: number;
}

export function VideoProcessingScreen({ fileName, onProcessingComplete, onBack }: VideoProcessingScreenProps) {
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [detectedEvents, setDetectedEvents] = useState<DetectedEvent[]>([]);
  const [processingTime, setProcessingTime] = useState(0);

  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: 'preprocessing',
      title: 'Video Preprocessing',
      description: 'Analyzing video format and extracting frames',
      status: 'pending',
      progress: 0,
      icon: Play
    },
    {
      id: 'ai-analysis',
      title: 'AI Analysis',
      description: 'Detecting objects, people, and activities',
      status: 'pending',
      progress: 0,
      icon: Brain
    },
    {
      id: 'event-detection',
      title: 'Event Detection',
      description: 'Identifying significant events and movements',
      status: 'pending',
      progress: 0,
      icon: Search
    },
    {
      id: 'tracking',
      title: 'Person Tracking',
      description: 'Tracking individuals throughout the video',
      status: 'pending',
      progress: 0,
      icon: Users
    }
  ]);

  // Mock events that get "detected" during processing
  const mockEvents = [
    { timestamp: '00:00:15', type: 'Person Entry', description: 'Individual enters frame from left entrance', confidence: 0.92 },
    { timestamp: '00:01:23', type: 'Motion Detected', description: 'Significant movement in central area', confidence: 0.87 },
    { timestamp: '00:02:45', type: 'Person Interaction', description: 'Two individuals meet near reception', confidence: 0.95 },
    { timestamp: '00:04:12', type: 'Object Manipulation', description: 'Item placed on counter surface', confidence: 0.89 },
    { timestamp: '00:05:30', type: 'Person Exit', description: 'Individual exits through main doorway', confidence: 0.91 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProcessingTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const processVideo = async () => {
      // Step 1: Preprocessing
      await simulateStep(0, 'in-progress');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await simulateStep(0, 'completed');

      // Step 2: AI Analysis
      await simulateStep(1, 'in-progress');
      
      // Add detected events during AI analysis
      for (let i = 0; i < mockEvents.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setDetectedEvents(prev => [...prev, mockEvents[i]]);
        updateStepProgress(1, ((i + 1) / mockEvents.length) * 100);
      }
      
      await simulateStep(1, 'completed');

      // Step 3: Event Detection
      await simulateStep(2, 'in-progress');
      await new Promise(resolve => setTimeout(resolve, 1500));
      await simulateStep(2, 'completed');

      // Step 4: Person Tracking
      await simulateStep(3, 'in-progress');
      await new Promise(resolve => setTimeout(resolve, 1200));
      await simulateStep(3, 'completed');

      // Complete processing
      setOverallProgress(100);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onProcessingComplete();
    };

    processVideo();
  }, [onProcessingComplete]);

  const simulateStep = async (stepIndex: number, status: ProcessingStep['status']) => {
    setCurrentStep(stepIndex);
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, status } : step
    ));

    if (status === 'in-progress') {
      // Simulate progress for the current step
      for (let progress = 0; progress <= 100; progress += 5) {
        await new Promise(resolve => setTimeout(resolve, 50));
        updateStepProgress(stepIndex, progress);
        
        // Update overall progress
        const baseProgress = (stepIndex / steps.length) * 100;
        const stepProgress = (progress / 100) * (100 / steps.length);
        setOverallProgress(Math.min(95, baseProgress + stepProgress));
      }
    }
  };

  const updateStepProgress = (stepIndex: number, progress: number) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, progress } : step
    ));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return <ShieldCheck className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              ← Back
            </Button>
            <div>
              <h1 className="text-xl font-medium text-foreground">Processing Video</h1>
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Processing time: {formatTime(processingTime)}
            </div>
            <Badge variant="secondary">
              {Math.round(overallProgress)}% Complete
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Overall Progress */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-foreground">Analysis Progress</h2>
                <span className="text-sm text-muted-foreground">
                  {Math.round(overallProgress)}% Complete
                </span>
              </div>
              <Progress value={overallProgress} className="w-full" />
            </div>
          </Card>

          {/* Apple-style Processing Animation */}
          <Card className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-foreground">Processing Steps</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  AI-powered analysis in progress
                </p>
              </div>
              <ProcessingStatsAnimation steps={steps} />
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6">
            {/* Real-time Event Detection */}
            <Card className="p-6">
              <h3 className="font-medium text-foreground mb-4">
                Events Detected ({detectedEvents.length})
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {detectedEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Waiting for event detection to begin...
                    </p>
                  </div>
                ) : (
                  detectedEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-accent/30 rounded-lg animate-in slide-in-from-bottom-2 duration-300"
                    >
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="text-xs">
                          {event.timestamp}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {event.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(event.confidence * 100)}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Video Preview */}
          <Card className="p-6">
            <h3 className="font-medium text-foreground mb-4">Video Preview</h3>
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <div className="text-white/70 text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8" />
                </div>
                <p>Analyzing Video</p>
                <p className="text-sm opacity-70">{fileName}</p>
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}