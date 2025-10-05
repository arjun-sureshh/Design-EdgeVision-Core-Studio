import { useState } from 'react';
import { Play, SkipForward, SkipBack, User, Clock, Filter, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface CombinedModeScreenProps {
  fileName: string;
  onBack: () => void;
}

export function CombinedModeScreen({ fileName, onBack }: CombinedModeScreenProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState('person1');
  const [viewMode, setViewMode] = useState('timeline');

  // Mock data for people with their activities
  const peopleData = {
    person1: {
      id: 1,
      label: 'Person 1',
      color: '#3b82f6',
      summary: 'Primary individual observed throughout video duration. Shows consistent movement patterns and multiple interaction points.',
      activities: [
        {
          id: 1,
          timestamp: '00:00:15',
          type: 'Entry',
          description: 'Enters frame from left entrance, walking at normal pace',
          confidence: 0.94,
          seconds: 15
        },
        {
          id: 2,
          timestamp: '00:01:45',
          type: 'Interaction',
          description: 'Approaches reception desk, appears to be speaking',
          confidence: 0.89,
          seconds: 105
        },
        {
          id: 3,
          timestamp: '00:02:45',
          type: 'Waiting',
          description: 'Stands near reception area, minimal movement for 1 minute',
          confidence: 0.92,
          seconds: 165
        },
        {
          id: 4,
          timestamp: '00:04:12',
          type: 'Movement',
          description: 'Walks towards central seating area',
          confidence: 0.87,
          seconds: 252
        },
        {
          id: 5,
          timestamp: '00:07:22',
          type: 'Exit',
          description: 'Leaves frame through main doorway',
          confidence: 0.91,
          seconds: 442
        }
      ],
      stats: {
        totalDuration: '07:07',
        interactions: 3,
        movements: 8,
        avgConfidence: 0.91
      }
    },
    person2: {
      id: 2,
      label: 'Person 2',
      color: '#ef4444',
      summary: 'Brief appearance with focused interaction pattern. Limited movement suggests specific purpose.',
      activities: [
        {
          id: 1,
          timestamp: '00:02:45',
          type: 'Entry',
          description: 'Enters frame from right side, purposeful movement',
          confidence: 0.88,
          seconds: 165
        },
        {
          id: 2,
          timestamp: '00:03:15',
          type: 'Interaction',
          description: 'Meets with Person 1 near reception desk',
          confidence: 0.95,
          seconds: 195
        },
        {
          id: 3,
          timestamp: '00:05:30',
          type: 'Exit',
          description: 'Exits frame through same entrance point',
          confidence: 0.89,
          seconds: 330
        }
      ],
      stats: {
        totalDuration: '02:45',
        interactions: 1,
        movements: 4,
        avgConfidence: 0.91
      }
    },
    person3: {
      id: 3,
      label: 'Person 3',
      color: '#10b981',
      summary: 'Background presence with intermittent activity. Longer duration but less interaction focus.',
      activities: [
        {
          id: 1,
          timestamp: '00:04:12',
          type: 'Entry',
          description: 'Enters frame from background area',
          confidence: 0.82,
          seconds: 252
        },
        {
          id: 2,
          timestamp: '00:06:30',
          type: 'Object Interaction',
          description: 'Interacts with object on counter surface',
          confidence: 0.87,
          seconds: 390
        },
        {
          id: 3,
          timestamp: '00:08:45',
          type: 'Exit',
          description: 'Exits frame through side exit',
          confidence: 0.85,
          seconds: 525
        }
      ],
      stats: {
        totalDuration: '04:33',
        interactions: 1,
        movements: 5,
        avgConfidence: 0.85
      }
    }
  };

  const currentPersonData = peopleData[selectedPerson as keyof typeof peopleData];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const jumpToActivity = (seconds: number) => {
    setCurrentTime(seconds);
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
              <h1 className="text-xl font-medium text-foreground">Combined Analysis</h1>
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedPerson} onValueChange={setSelectedPerson}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="person1">Person 1</SelectItem>
                <SelectItem value="person2">Person 2</SelectItem>
                <SelectItem value="person3">Person 3</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Filter className="w-3 h-3" />
              <span>Filtered View</span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Video Player */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl">
            {/* Video Container */}
            <Card className="p-4 mb-6">
              <div className="aspect-video bg-black rounded-lg mb-4 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/70 text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8" />
                    </div>
                    <p>Combined Analysis View</p>
                    <p className="text-sm opacity-70">{fileName}</p>
                  </div>
                </div>
                
                {/* Focused person tracking overlay */}
                <div
                  className="absolute border-2 rounded-lg bg-transparent"
                  style={{
                    borderColor: currentPersonData.color,
                    left: '35%',
                    top: '25%',
                    width: '100px',
                    height: '150px'
                  }}
                >
                  <div
                    className="absolute -top-6 left-0 px-2 py-1 rounded text-xs text-white text-nowrap"
                    style={{ backgroundColor: currentPersonData.color }}
                  >
                    {currentPersonData.label} (Focused)
                  </div>
                  {/* Enhanced tracking trail */}
                  <svg
                    className="absolute -z-10"
                    style={{
                      left: '-150px',
                      top: '75px',
                      width: '300px',
                      height: '150px'
                    }}
                  >
                    <path
                      d="M 0 75 Q 75 50 150 75 Q 225 100 300 75"
                      stroke={currentPersonData.color}
                      strokeWidth="3"
                      fill="none"
                      opacity="0.8"
                    />
                  </svg>
                </div>
              </div>

              {/* Video Controls */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(currentTime)} / 08:45
                  </span>
                </div>
                
                <Slider
                  value={[currentTime]}
                  onValueChange={(value: number[]) => setCurrentTime(value[0])}
                  max={525}
                  step={1}
                  className="w-full"
                />
              </div>
            </Card>

            {/* Person Summary */}
            <Card className="p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: currentPersonData.color }}
                />
                <h3 className="font-medium text-foreground">{currentPersonData.label} Summary</h3>
              </div>
              <p className="text-muted-foreground mb-4">{currentPersonData.summary}</p>
              
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-semibold text-foreground">{currentPersonData.stats.totalDuration}</p>
                  <p className="text-sm text-muted-foreground">Duration</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{currentPersonData.stats.interactions}</p>
                  <p className="text-sm text-muted-foreground">Interactions</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{currentPersonData.stats.movements}</p>
                  <p className="text-sm text-muted-foreground">Movements</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {Math.round(currentPersonData.stats.avgConfidence * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Confidence</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Activity Sidebar */}
        <div className="w-96 border-l border-border p-6">
          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Activity Timeline</h3>
                <Badge variant="secondary" className="text-xs">
                  {currentPersonData.activities.length} events
                </Badge>
              </div>
              
              <div className="space-y-3">
                {currentPersonData.activities.map((activity) => (
                  <Card
                    key={activity.id}
                    className="p-4 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => jumpToActivity(activity.seconds)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-mono text-muted-foreground">
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(activity.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{activity.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="summary" className="space-y-4 mt-6">
              <h3 className="font-medium text-foreground">Analysis Summary</h3>
              
              <Card className="p-4">
                <h4 className="font-medium text-foreground mb-3">Behavior Patterns</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    • Consistent movement patterns with clear entry/exit points
                  </p>
                  <p className="text-muted-foreground">
                    • Primary focus on reception area interactions
                  </p>
                  <p className="text-muted-foreground">
                    • Normal walking pace and body language throughout
                  </p>
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium text-foreground mb-3">Key Insights</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Most active period</span>
                    <span className="text-foreground">00:01:45 - 00:04:12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Primary location</span>
                    <span className="text-foreground">Reception area</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interaction quality</span>
                    <span className="text-foreground">High confidence</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium text-foreground mb-3">Important Note</h4>
                <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
                  <Eye className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    This view shows only activities related to {currentPersonData.label}. 
                    Other events and people may have occurred during the same timeframe.
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}