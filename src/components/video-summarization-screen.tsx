import { useState } from 'react';
import { Search, Play, Pause, SkipForward, SkipBack, Settings, Clock, ArrowLeft, User, Activity, Users, Package, UserMinus, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { QuickActionsCard } from './quick-actions-card';

interface VideoSummarizationScreenProps {
  fileName: string;
  onBack: () => void;
  onBackToMenu?: () => void;
}

export function VideoSummarizationScreen({ fileName, onBack, onBackToMenu }: VideoSummarizationScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [detailLevel, setDetailLevel] = useState('basic');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock data for events
  const events = [
    {
      id: 1,
      timestamp: '00:00:15',
      type: 'Person Entry',
      description: 'Individual enters frame from left entrance',
      confidence: 0.92,
      seconds: 15
    },
    {
      id: 2,
      timestamp: '00:01:23',
      type: 'Motion Detected',
      description: 'Significant movement detected in central area',
      confidence: 0.87,
      seconds: 83
    },
    {
      id: 3,
      timestamp: '00:02:45',
      type: 'Person Interaction',
      description: 'Two individuals meet near reception desk',
      confidence: 0.95,
      seconds: 165
    },
    {
      id: 4,
      timestamp: '00:04:12',
      type: 'Object Manipulation',
      description: 'Item placed on counter surface',
      confidence: 0.89,
      seconds: 252
    },
    {
      id: 5,
      timestamp: '00:05:30',
      type: 'Person Exit',
      description: 'Individual exits frame through main doorway',
      confidence: 0.91,
      seconds: 330
    }
  ];

  const filteredEvents = events.filter(event =>
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const jumpToEvent = (seconds: number) => {
    setCurrentTime(seconds);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border py-4">
        <div className="px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBackToMenu || onBack} className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
              <div>
                <h1 className="text-xl font-medium text-foreground">Video Summarization</h1>
              </div>
            </div>
            <div className="max-w-7xl w-full flex justify-end">
              <div className="flex items-center space-x-4">
                <Select value={detailLevel} onValueChange={setDetailLevel}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="verbose">Verbose</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Video Player */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl">
            {/* Video Container */}
            <Card className="p-6 mb-6 w-full">
              <div className="aspect-video bg-black rounded-lg mb-2 flex items-center justify-center">
                <div className="text-white/70 text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8" />
                  </div>
                  <p>Video Player</p>
                  <p className="text-sm opacity-70">{fileName}</p>
                </div>
              </div>

              {/* Video Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {formatTime(currentTime)} / 08:45
                  </span>
                  <p className="text-sm text-muted-foreground">{fileName}</p>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>
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

            {/* Timeline */}
            <Card className="p-8">
              <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Video Summary
              </h3>
              
              {/* Analysis Description */}
              <div className="mb-8 p-4 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This surveillance footage analysis detected 5 significant events spanning from 00:00:15 to 00:05:30. The video shows 3 person-related activities, 1 interaction between individuals, 1 significant motion event. The AI identified activities with an average confidence level of 91%, including individuals entering and exiting the monitored area, movement patterns in central zones, and interactions near key locations such as reception areas and counters.
                </p>
              </div>

              <h4 className="font-medium text-foreground mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Event Timeline
              </h4>
              
              {/* Timeline Container */}
              <div className="relative overflow-x-auto overflow-y-hidden timeline-scrollbar">
                {/* Scrollable Timeline Content */}
                <div className="relative w-[1400px] pt-4">
                  {/* Timeline Base */}
                  <div className="relative h-px bg-border mb-20 mx-3">
                    
                    {/* Start Point */}
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                      style={{ left: '0px' }}
                    >
                      <div className="w-3 h-3 bg-muted-foreground/60 rounded-full"></div>
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
                        <div className="text-xs font-mono text-muted-foreground whitespace-nowrap">0:00</div>
                      </div>
                    </div>
                    
                    {/* End Point */}
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                      style={{ left: '1400px' }}
                    >
                      <div className="w-3 h-3 bg-muted-foreground/60 rounded-full"></div>
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
                        <div className="text-xs font-mono text-muted-foreground whitespace-nowrap">8:45</div>
                      </div>
                    </div>
                    
                    {/* Event Nodes */}
                    {[
                      { 
                        name: 'Person Entry',
                        timestamp: '1:32',
                        position: 161, // 161px from left (1:32 out of 8:45 * 1400px)
                        icon: User
                      },
                      {
                        name: 'Motion Detected',
                        timestamp: '2:45',
                        position: 440, // 440px from left
                        icon: Activity
                      },
                      {
                        name: 'Person Interaction',
                        timestamp: '4:18',
                        position: 688, // 688px from left
                        icon: Users
                      },
                      {
                        name: 'Object Manipulation',
                        timestamp: '6:25',
                        position: 1025, // 1025px from left
                        icon: Package
                      },
                      {
                        name: 'Person Exit',
                        timestamp: '8:12',
                        position: 1309, // 1309px from left
                        icon: UserMinus
                      }
                    ].map((event, index) => {
                      const IconComponent = event.icon;
                      
                      return (
                        <div
                          key={index}
                          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 group cursor-pointer"
                          style={{ left: `${event.position}px` }}
                          onClick={() => {
                            const [minutes, seconds] = event.timestamp.split(':').map(Number);
                            jumpToEvent(minutes * 60 + seconds);
                          }}
                        >
                          {/* Event Node */}
                          <div className="relative w-6 h-6 bg-accent border-2 border-background rounded-full shadow-sm transition-all duration-200 group-hover:bg-foreground group-hover:scale-110 flex items-center justify-center">
                            <IconComponent className="w-3 h-3 text-muted-foreground group-hover:text-background" />
                          </div>
                          
                          {/* Event Label */}
                          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
                            <div className="text-xs text-muted-foreground whitespace-nowrap mb-1">
                              {event.name}
                            </div>
                            <div className="text-xs font-mono text-foreground whitespace-nowrap">
                              {event.timestamp}
                            </div>
                          </div>
                          
                          {/* Hover Tooltip */}
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                            <div className="bg-card border border-border rounded-md p-2 shadow-lg whitespace-nowrap">
                              <div className="text-xs text-muted-foreground">Click to jump to event</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Events Sidebar */}
        <div className="w-80 border-l border-border p-6">
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Search Events
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Summary Stats */}
            <Card className="p-6">
              <h4 className="font-medium text-foreground mb-3">Analysis Summary</h4>
              <div className="grid grid-cols-2 gap-6">
                {/* Total Events */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-muted rounded-full"></div>
                    <div className="relative w-14 h-14 bg-secondary rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-secondary-foreground font-bold text-xl">{events.length}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Total Events</p>
                  </div>
                </div>

                {/* People Detected */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-muted rounded-full"></div>
                    <div className="relative w-14 h-14 bg-background rounded-full border-2 border-muted-foreground flex items-center justify-center">
                      <span className="text-foreground font-bold text-xl">3</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-muted-foreground rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-background fill-current" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">People Detected</p>
                  </div>
                </div>

                {/* Avg Confidence */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"/>
                      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${91 * 1.76} 176`} strokeLinecap="round" className="text-muted-foreground"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-foreground font-bold text-sm">91%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Avg Confidence</p>
                  </div>
                </div>

                {/* Video Duration */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-muted rounded-full"></div>
                    <div className="relative w-14 h-14 bg-background rounded-full border-2 border-muted-foreground flex items-center justify-center">
                      <Clock className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-muted-foreground text-background text-xs px-2 py-0.5 rounded-full font-medium">
                      8:45
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Video Duration</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Event Types */}
            <Card className="p-4">
              <h4 className="font-medium text-foreground mb-3">Event Types</h4>
              <div className="space-y-2">
                {['Person Entry', 'Motion Detected', 'Person Interaction', 'Object Manipulation', 'Person Exit'].map((type) => (
                  <div key={type} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{type}</span>
                    <Badge variant="outline" className="text-xs">
                      {events.filter(e => e.type === type).length}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="w-full">
              <QuickActionsCard 
                onExportSummary={() => console.log('Exporting summary...')}
                onDownloadTimeline={() => console.log('Downloading timeline...')}
                onGenerateReport={() => console.log('Generating report...')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}