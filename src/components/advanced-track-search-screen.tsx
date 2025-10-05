import { useState } from 'react';
import { Play, SkipForward, SkipBack, Search, Filter, Target, Eye, Clock, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';

interface AdvancedTrackSearchScreenProps {
  fileName: string;
  onBack: () => void;
}

export function AdvancedTrackSearchScreen({ fileName, onBack }: AdvancedTrackSearchScreenProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('all');
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(['all']);

  // Mock data combining people and events
  const peopleData = [
    {
      id: 'person1',
      label: 'Person 1',
      color: '#3b82f6',
      visible: true,
      summary: 'Primary individual with consistent activity patterns'
    },
    {
      id: 'person2',
      label: 'Person 2', 
      color: '#ef4444',
      visible: true,
      summary: 'Brief interaction-focused presence'
    },
    {
      id: 'person3',
      label: 'Person 3',
      color: '#10b981',
      visible: false,
      summary: 'Background activity with object interactions'
    }
  ];

  const eventTypes = ['Entry', 'Exit', 'Interaction', 'Movement', 'Object Handling', 'Waiting'];

  const combinedEvents = [
    {
      id: 1,
      timestamp: '00:00:15',
      person: 'person1',
      type: 'Entry',
      description: 'Person 1 enters frame from left entrance',
      confidence: 0.94,
      seconds: 15,
      searchable: 'person 1 enters entrance left walking'
    },
    {
      id: 2,
      timestamp: '00:01:45',
      person: 'person1',
      type: 'Interaction',
      description: 'Person 1 approaches reception desk, speaks with staff',
      confidence: 0.89,
      seconds: 105,
      searchable: 'person 1 reception desk staff speaking conversation'
    },
    {
      id: 3,
      timestamp: '00:02:45',
      person: 'person2',
      type: 'Entry',
      description: 'Person 2 enters frame from right side entrance',
      confidence: 0.88,
      seconds: 165,
      searchable: 'person 2 enters right entrance purposeful'
    },
    {
      id: 4,
      timestamp: '00:03:15',
      person: 'both',
      type: 'Interaction',
      description: 'Person 1 and Person 2 meet near reception area',
      confidence: 0.95,
      seconds: 195,
      searchable: 'person 1 person 2 meet reception interaction conversation'
    },
    {
      id: 5,
      timestamp: '00:04:12',
      person: 'person3',
      type: 'Entry',
      description: 'Person 3 enters from background corridor',
      confidence: 0.82,
      seconds: 252,
      searchable: 'person 3 enters background corridor'
    },
    {
      id: 6,
      timestamp: '00:04:30',
      person: 'person1',
      type: 'Movement',
      description: 'Person 1 walks towards central seating area',
      confidence: 0.87,
      seconds: 270,
      searchable: 'person 1 walks central seating area movement'
    },
    {
      id: 7,
      timestamp: '00:05:30',
      person: 'person2',
      type: 'Exit',
      description: 'Person 2 exits through main entrance',
      confidence: 0.89,
      seconds: 330,
      searchable: 'person 2 exits main entrance leaving'
    },
    {
      id: 8,
      timestamp: '00:06:30',
      person: 'person3',
      type: 'Object Handling',
      description: 'Person 3 places item on counter surface',
      confidence: 0.87,
      seconds: 390,
      searchable: 'person 3 places object item counter surface'
    },
    {
      id: 9,
      timestamp: '00:07:22',
      person: 'person1',
      type: 'Exit',
      description: 'Person 1 exits through main doorway',
      confidence: 0.91,
      seconds: 442,
      searchable: 'person 1 exits main doorway leaving'
    }
  ];

  // Filter events based on search, person, and event types
  const filteredEvents = combinedEvents.filter(event => {
    const matchesSearch = searchQuery === '' || 
      event.searchable.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPerson = selectedPerson === 'all' || 
      event.person === selectedPerson || 
      (event.person === 'both' && (selectedPerson === 'person1' || selectedPerson === 'person2'));
    
    const matchesEventType = selectedEventTypes.includes('all') || 
      selectedEventTypes.includes(event.type);
    
    return matchesSearch && matchesPerson && matchesEventType;
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const jumpToEvent = (seconds: number) => {
    setCurrentTime(seconds);
  };

  const handleEventTypeToggle = (eventType: string) => {
    if (eventType === 'all') {
      setSelectedEventTypes(['all']);
    } else {
      const newTypes = selectedEventTypes.includes('all') 
        ? [eventType]
        : selectedEventTypes.includes(eventType)
          ? selectedEventTypes.filter(t => t !== eventType)
          : [...selectedEventTypes.filter(t => t !== 'all'), eventType];
      
      setSelectedEventTypes(newTypes.length === 0 ? ['all'] : newTypes);
    }
  };

  const getPersonColor = (personId: string) => {
    if (personId === 'both') return '#6b7280';
    const person = peopleData.find(p => p.id === personId);
    return person?.color || '#6b7280';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              ← Back to Menu
            </Button>
            <div>
              <h1 className="text-xl font-medium text-foreground">Advanced Track & Search</h1>
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>{filteredEvents.length} events found</span>
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
                    <p>Advanced Analysis View</p>
                    <p className="text-sm opacity-70">{fileName}</p>
                  </div>
                </div>
                
                {/* Multiple person tracking overlays */}
                {peopleData.filter(p => p.visible).map((person, index) => (
                  <div
                    key={person.id}
                    className="absolute border-2 rounded-lg bg-transparent"
                    style={{
                      borderColor: person.color,
                      left: `${25 + index * 20}%`,
                      top: `${20 + index * 15}%`,
                      width: '90px',
                      height: '130px'
                    }}
                  >
                    <div
                      className="absolute -top-6 left-0 px-2 py-1 rounded text-xs text-white text-nowrap"
                      style={{ backgroundColor: person.color }}
                    >
                      {person.label}
                    </div>
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
                  onValueChange={(value: number[]) => setCurrentTime(value[0])}
                  max={525}
                  step={1}
                  className="w-full"
                />
              </div>
            </Card>

            {/* Search Results Timeline */}
            <Card className="p-6">
              <h3 className="font-medium text-foreground mb-4">
                Search Results Timeline
              </h3>
              <div className="space-y-3">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center space-x-4 p-3 bg-accent/50 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => jumpToEvent(event.seconds)}
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-mono text-muted-foreground">
                        {event.timestamp}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {event.person !== 'both' && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getPersonColor(event.person) }}
                        />
                      )}
                      {event.person === 'both' && (
                        <div className="flex space-x-1">
                          <div className="w-2 h-3 rounded-full bg-blue-500" />
                          <div className="w-2 h-3 rounded-full bg-red-500" />
                        </div>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{event.description}</p>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {Math.round(event.confidence * 100)}%
                    </div>
                  </div>
                ))}
                
                {filteredEvents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-2" />
                    <p>No events match your current filters</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Advanced Search Sidebar */}
        <div className="w-96 border-l border-border p-6">
          <Tabs defaultValue="search" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Search & Filter</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="space-y-6">
              {/* Search */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Search Events & Activities
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g., reception interaction, person enters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Person Filter */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Filter by Person
                </label>
                <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All People</SelectItem>
                    <SelectItem value="person1">Person 1</SelectItem>
                    <SelectItem value="person2">Person 2</SelectItem>
                    <SelectItem value="person3">Person 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Event Type Filter */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Event Types
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="all-events"
                      checked={selectedEventTypes.includes('all')}
                      onCheckedChange={() => handleEventTypeToggle('all')}
                    />
                    <label htmlFor="all-events" className="text-sm text-foreground">
                      All Events
                    </label>
                  </div>
                  {eventTypes.map((eventType) => (
                    <div key={eventType} className="flex items-center space-x-2">
                      <Checkbox
                        id={eventType}
                        checked={selectedEventTypes.includes(eventType)}
                        onCheckedChange={() => handleEventTypeToggle(eventType)}
                      />
                      <label htmlFor={eventType} className="text-sm text-foreground">
                        {eventType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* People Visibility */}
              <Card className="p-4">
                <h4 className="font-medium text-foreground mb-3">People Visibility</h4>
                <div className="space-y-2">
                  {peopleData.map((person) => (
                    <div key={person.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: person.color }}
                        />
                        <span className="text-sm text-foreground">{person.label}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-6">
              <Card className="p-4">
                <h4 className="font-medium text-foreground mb-3">Analysis Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Events</span>
                    <span className="text-foreground">{combinedEvents.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">People Tracked</span>
                    <span className="text-foreground">{peopleData.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Interactions</span>
                    <span className="text-foreground">
                      {combinedEvents.filter(e => e.type === 'Interaction').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Results</span>
                    <span className="text-foreground">{filteredEvents.length}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium text-foreground mb-3">Key Patterns</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    • Primary activity focus around reception area
                  </p>
                  <p className="text-muted-foreground">
                    • Multiple person interactions detected
                  </p>
                  <p className="text-muted-foreground">
                    • Clear entry/exit patterns established
                  </p>
                  <p className="text-muted-foreground">
                    • Object handling events recorded
                  </p>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium text-foreground mb-3">Search Tips</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Use keywords like "reception", "interaction", "enters"</p>
                  <p>• Combine person names: "person 1 person 2"</p>
                  <p>• Search by locations: "entrance", "counter", "seating"</p>
                  <p>• Use action words: "walking", "speaking", "places"</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}