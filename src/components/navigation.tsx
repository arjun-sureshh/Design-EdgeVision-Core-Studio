import { BarChart3, Users, Layers, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface NavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  hasUploadedFile: boolean;
}

export function Navigation({ currentScreen, onNavigate, hasUploadedFile }: NavigationProps) {
  const navItems = [
    {
      id: 'upload',
      label: 'Upload',
      icon: Home,
      disabled: false
    },
    {
      id: 'summarization',
      label: 'Video Summarization',
      icon: BarChart3,
      disabled: !hasUploadedFile
    },
    {
      id: 'tracking',
      label: 'People Tracking',
      icon: Users,
      disabled: !hasUploadedFile
    },
    {
      id: 'combined',
      label: 'Combined Mode',
      icon: Layers,
      disabled: !hasUploadedFile
    }
  ];

  return (
    <nav className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentScreen === item.id ? 'default' : 'ghost'}
                  disabled={item.disabled}
                  onClick={() => onNavigate(item.id)}
                  className="flex items-center space-x-2 px-4 py-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-xs">
              Demo Mode
            </Badge>
          </div>
        </div>
      </div>
    </nav>
  );
}