import { Upload, Download, FileText } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  onClick: () => void;
}

function QuickActionButton({ icon, title, description, gradient, onClick }: QuickActionProps) {
  return (
    <Button
      variant="ghost"
      className="w-full h-auto p-0 group"
      onClick={onClick}
    >
      <div className={`
        w-full flex items-center gap-3 p-3 rounded-lg
        transition-all duration-300 ease-out
        ${gradient}
        group-hover:shadow-md
      `}>
        {/* Icon container */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
          <div className="text-primary">
            {icon}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 text-left">
          <h3 className="text-primary font-medium text-sm mb-0.5">
            {title}
          </h3>
          <p className="text-muted-foreground text-xs">
            {description}
          </p>
        </div>
      </div>
    </Button>
  );
}

interface QuickActionsCardProps {
  onExportSummary?: () => void;
  onDownloadTimeline?: () => void;
  onGenerateReport?: () => void;
}

export function QuickActionsCard({ 
  onExportSummary = () => {}, 
  onDownloadTimeline = () => {}, 
  onGenerateReport = () => {} 
}: QuickActionsCardProps) {
  const actions = [
    {
      icon: <Upload className="w-4 h-4" />,
      title: "Export Summary",
      description: "Export timeline data",
      gradient: "bg-gradient-to-r from-secondary to-muted",
      onClick: onExportSummary
    },
    {
      icon: <Download className="w-4 h-4" />,
      title: "Download Timeline",
      description: "Save as image",
      gradient: "bg-gradient-to-r from-muted to-accent",
      onClick: onDownloadTimeline
    },
    {
      icon: <FileText className="w-4 h-4" />,
      title: "Generate Report",
      description: "Create document",
      gradient: "bg-gradient-to-r from-accent to-secondary",
      onClick: onGenerateReport
    }
  ];

  return (
    <Card className="p-4">
      <h4 className="font-medium text-foreground mb-3">Quick Actions</h4>
      <div className="space-y-2">
        {actions.map((action, index) => (
          <QuickActionButton
            key={index}
            icon={action.icon}
            title={action.title}
            description={action.description}
            gradient={action.gradient}
            onClick={action.onClick}
          />
        ))}
      </div>
    </Card>
  );
}