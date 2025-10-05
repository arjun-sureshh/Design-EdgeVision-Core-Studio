import { useState } from 'react';
import { BarChart3, Users, Search, ArrowRight, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { AIParticleEffect } from './ai-particle-effect';
import logoImage from '../assets/30046d08f6da79bb7936aea452515f8399872bc0.png';

interface MainMenuProps {
  onSelectMode: (mode: string) => void;
}

export function MainMenu({ onSelectMode }: MainMenuProps) {
  const [isRotating, setIsRotating] = useState(false);

  const handleSettingsClick = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 300);
  };

  const capabilities = [
    {
      id: 'summarization',
      title: 'Video Summarization',
      description: 'AI-powered event detection and timeline analysis with searchable results and adjustable detail levels.',
      icon: BarChart3,
      features: [
        'Automated event detection',
        'Searchable timeline',
        'Confidence scoring',
        'Adjustable detail levels'
      ]
    },
    {
      id: 'tracking',
      title: 'People Tracking',
      description: 'Advanced person detection and tracking throughout video footage with visual path overlays.',
      icon: Users,
      features: [
        'Individual person tracking',
        'Visual path overlays',
        'Multi-person management',
        'Tracking statistics'
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Track and Search',
      description: 'Combined analysis merging people tracking with event summarization for comprehensive insights.',
      icon: Search,
      features: [
        'Person-specific summaries',
        'Combined event tracking',
        'Advanced filtering',
        'Behavioral analysis'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* AI Particle Effect Background */}
      <AIParticleEffect />
      
      {/* Header */}
      <div className="border-b border-border px-6 py-4 relative z-10 bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={logoImage} 
              alt="EdgeVision Logo" 
              className="h-10 mr-4"
            />
            <h1 className="text-2xl font-medium text-foreground">
              Core Studio
            </h1>
          </div>
          <motion.button 
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            onClick={handleSettingsClick}
            animate={{ rotate: isRotating ? 15 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Settings className="w-6 h-6 text-foreground" />
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {capabilities.map((capability) => {
              const Icon = capability.icon;
              return (
                <Card
                  key={capability.id}
                  className="p-8 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group bg-card/80 backdrop-blur-sm border-border/50"
                  onClick={() => onSelectMode(capability.id)}
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium text-foreground mb-3">
                      {capability.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {capability.description}
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    {capability.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full group-hover:translate-x-1 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMode(capability.id);
                    }}
                  >
                    Start
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              );
            })}
          </div>



          {/* Demo Notice */}
          <div className="mt-12 text-center">
            <Card className="p-6 bg-muted/20 backdrop-blur-sm border-border/30">
              <p className="text-sm text-muted-foreground">
                This is a demonstration environment. Processing times are simulated and 
                results are based on mock data to showcase EdgeVision's capabilities.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}