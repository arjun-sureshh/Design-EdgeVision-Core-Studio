import { useState } from 'react';
import { Play, SkipForward, SkipBack, Eye, EyeOff, User, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';

interface PeopleTrackingScreenProps {
  fileName: string;
  onBack: () => void;
  onBackToMenu?: () => void;
}

export function PeopleTrackingScreen({ fileName, onBack, onBackToMenu }: PeopleTrackingScreenProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<number | null>(1);

  // Mock data for tracked people
  const trackedPeople = [
    {
      id: 1,
      label: 'Person 1',
      color: '#3b82f6',
      visible: true,
      firstSeen: '00:00:15',
      lastSeen: '00:07:22',
      totalDuration: '07:07',
      confidence: 0.94
    },
    {
      id: 2,
      label: 'Person 2',
      color: '#ef4444',
      visible: true,
      firstSeen: '00:02:45',
      lastSeen: '00:05:30',
      totalDuration: '02:45',
      confidence: 0.89
    },
    {
      id: 3,
      label: 'Person 3',
      color: '#10b981',
      visible: false,
      firstSeen: '00:04:12',
      lastSeen: '00:08:45',
      totalDuration: '04:33',
      confidence: 0.87
    }
  ];

  const [people, setPeople] = useState(trackedPeople);

  const togglePersonVisibility = (personId: number) => {
    setPeople(prev => prev.map(person => 
      person.id === personId 
        ? { ...person, visible: !person.visible }
        : person
    ));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const visiblePeople = people.filter(person => person.visible);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBackToMenu || onBack}>
              ← Back to Menu
            </Button>
            <div>
              <h1 className="text-xl font-medium text-foreground">People Tracking</h1>
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline">
              {visiblePeople.length} of {people.length} visible
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
                    <p>Video Player with Tracking</p>
                    <p className="text-sm opacity-70">{fileName}</p>
                  </div>
                </div>
                
                {/* Mock tracking overlays */}
                {visiblePeople.map((person, index) => (
                  <div
                    key={person.id}
                    className="absolute border-2 rounded-lg bg-transparent"
                    style={{
                      borderColor: person.color,
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 10}%`,
                      width: '80px',
                      height: '120px'
                    }}
                  >
                    <div
                      className="absolute -top-6 left-0 px-2 py-1 rounded text-xs text-white text-nowrap"
                      style={{ backgroundColor: person.color }}
                    >
                      {person.label}
                    </div>
                    {/* Tracking trail */}
                    <svg
                      className="absolute -z-10"
                      style={{
                        left: '-100px',
                        top: '60px',
                        width: '200px',
                        height: '100px'
                      }}
                    >
                      <path
                        d={`M 0 50 Q 50 ${30 + index * 10} 100 50`}
                        stroke={person.color}
                        strokeWidth="2"
                        fill="none"
                        opacity="0.6"
                        strokeDasharray="5,5"
                      />
                    </svg>
                  </div>
                ))}
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
                  onValueChange={(value) => setCurrentTime(value[0])}
                  max={525}
                  step={1}
                  className="w-full"
                />
              </div>
            </Card>

            {/* Tracking Controls */}
            <Card className="p-6">
              <h3 className="font-medium text-foreground mb-4">Tracking Controls</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Auto-detect People
                </Button>
                <Button variant="outline" className="justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Manual Selection
                </Button>
              </div>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Indoor/stable lighting conditions assumed. Click on individuals in the video to start tracking, 
                  or use auto-detection to identify all people automatically.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* People Sidebar */}
        <div className="w-80 border-l border-border p-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-4">Tracked People</h3>
              <div className="space-y-3">
                {people.map((person) => (
                  <Card
                    key={person.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedPerson === person.id 
                        ? 'ring-2 ring-primary' 
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => setSelectedPerson(person.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: person.color }}
                        />
                        <span className="font-medium text-foreground">
                          {person.label}
                        </span>
                      </div>
                      <Switch
                        checked={person.visible}
                        onCheckedChange={() => togglePersonVisibility(person.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">First seen</span>
                        <span className="text-foreground">{person.firstSeen}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last seen</span>
                        <span className="text-foreground">{person.lastSeen}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="text-foreground">{person.totalDuration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="text-foreground">
                          {Math.round(person.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <Card className="p-4">
              <h4 className="font-medium text-foreground mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Show All Tracks
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide All Tracks
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Focus on Selected
                </Button>
              </div>
            </Card>

            {/* Tracking Stats */}
            <Card className="p-4">
              <h4 className="font-medium text-foreground mb-3">Tracking Statistics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total People</span>
                  <span className="text-foreground">{people.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Currently Visible</span>
                  <span className="text-foreground">{visiblePeople.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Confidence</span>
                  <span className="text-foreground">
                    {Math.round(people.reduce((acc, p) => acc + p.confidence, 0) / people.length * 100)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tracking Quality</span>
                  <span className="text-foreground">Excellent</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}