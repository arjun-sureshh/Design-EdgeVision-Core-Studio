import { motion, useReducedMotion } from 'motion/react';
import { Play, Brain, Search, Users } from 'lucide-react';

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface ProcessingStatsAnimationProps {
  steps: ProcessingStep[];
}

export function ProcessingStatsAnimation({ steps }: ProcessingStatsAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'in-progress': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  const LoadingOrb = ({ status, progress }: { status: string; progress: number }) => {
    if (status === 'completed') {
      return (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full bg-green-500/10 border border-green-500/30"
            animate={shouldReduceMotion ? {} : {
              scale: [1, 1.02, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="w-6 h-6 rounded-full bg-green-500 shadow-lg shadow-green-500/30" />
        </div>
      );
    }

    if (status === 'in-progress') {
      return (
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Rotating outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-500/20"
            animate={shouldReduceMotion ? {} : { rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Progress circle */}
          <svg className="absolute inset-0 w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="rgba(59, 130, 246, 0.1)"
              strokeWidth="3"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 26}`}
              animate={{
                strokeDashoffset: 2 * Math.PI * 26 * (1 - progress / 100)
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
            />
          </svg>

          {/* Center dot */}
          <motion.div
            className="w-4 h-4 rounded-full bg-blue-500"
            animate={shouldReduceMotion ? {} : {
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      );
    }

    // Pending state
    return (
      <div className="relative w-16 h-16 flex items-center justify-center">
        <motion.div
          className="w-10 h-10 rounded-full border-2 border-muted-foreground/30"
          animate={shouldReduceMotion ? {} : {
            rotate: 360,
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            rotate: { duration: 6, repeat: Infinity, ease: "linear" },
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <div className="absolute w-3 h-3 rounded-full bg-muted-foreground/40" />
      </div>
    );
  };

  const DataFlowLines = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {!shouldReduceMotion && [...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-blue-500/12 to-transparent data-flow-line"
          style={{
            width: '100%',
            top: `${30 + i * 20}%`,
            willChange: 'transform, opacity'
          }}
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: i * 1.2,
            ease: [0.4, 0, 0.6, 1],
            times: [0, 0.5, 1]
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="relative max-w-6xl mx-auto processing-container">
      <DataFlowLines />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          
          return (
            <motion.div
              key={step.id}
              className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card/80 transition-all duration-300"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Status indicator */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-background/50 ${getStatusColor(step.status)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className={`font-medium ${getStatusColor(step.status)}`}>
                    {step.status === 'completed' ? '100%' : 
                     step.status === 'in-progress' ? `${Math.round(step.progress)}%` : 
                     'Pending'}
                  </div>
                </div>
              </div>

              {/* Main animation */}
              <div className="flex justify-center mb-6">
                <LoadingOrb status={step.status} progress={step.progress} />
              </div>

              {/* Content */}
              <div className="text-center space-y-2">
                <h3 className="font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Progress bar */}
              <div className="mt-6 w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    step.status === 'completed' ? 'bg-green-500' :
                    step.status === 'in-progress' ? 'bg-blue-500' :
                    'bg-muted-foreground/20'
                  }`}
                  animate={{ width: `${step.progress}%` }}
                  transition={{ 
                    duration: 1.5, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: "spring",
                    stiffness: 80,
                    damping: 25
                  }}
                  style={{ willChange: 'transform' }}
                />
              </div>

              {/* Connecting line to next step */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-border/30">
                  <motion.div
                    className="h-full bg-blue-500/40"
                    animate={{
                      scaleX: step.status !== 'pending' ? 1 : 0.3,
                      opacity: step.status !== 'pending' ? 1 : 0.3
                    }}
                    transition={{ 
                      duration: 1.2, 
                      ease: [0.4, 0, 0.6, 1]
                    }}
                    style={{ willChange: 'transform, opacity' }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}