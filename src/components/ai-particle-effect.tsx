import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  type: 'node' | 'data' | 'neural' | 'geometric';
  direction: number;
  lifetime: number;
  maxLifetime: number;
}

interface Connection {
  id: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  opacity: number;
  lifetime: number;
}

export function AIParticleEffect() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0) return;

    // Initialize particles
    const initialParticles: Particle[] = [];
    for (let i = 0; i < 35; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.4 + 0.1,
        type: ['node', 'data', 'neural', 'geometric'][Math.floor(Math.random() * 4)] as Particle['type'],
        direction: Math.random() * Math.PI * 2,
        lifetime: 0,
        maxLifetime: Math.random() * 15000 + 10000
      });
    }
    setParticles(initialParticles);
  }, [dimensions]);

  useEffect(() => {
    const animationLoop = () => {
      setParticles(prevParticles => {
        const newParticles = prevParticles.map(particle => {
          let newX = particle.x + Math.cos(particle.direction) * particle.speed;
          let newY = particle.y + Math.sin(particle.direction) * particle.speed;

          // Wrap around screen edges
          if (newX < -50) newX = dimensions.width + 50;
          if (newX > dimensions.width + 50) newX = -50;
          if (newY < -50) newY = dimensions.height + 50;
          if (newY > dimensions.height + 50) newY = -50;

          // Subtle direction changes for organic movement
          const newDirection = particle.direction + (Math.random() - 0.5) * 0.02;
          const newLifetime = particle.lifetime + 16;

          // Fade in/out based on lifetime
          let newOpacity = particle.opacity;
          if (newLifetime > particle.maxLifetime * 0.8) {
            newOpacity = particle.opacity * 0.995;
          } else if (newLifetime < particle.maxLifetime * 0.2) {
            newOpacity = Math.min(particle.opacity * 1.005, 0.5);
          }

          // Reset particle if it's too old or too faded
          if (newLifetime > particle.maxLifetime || newOpacity < 0.05) {
            return {
              ...particle,
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
              opacity: Math.random() * 0.4 + 0.1,
              lifetime: 0,
              maxLifetime: Math.random() * 15000 + 10000,
              direction: Math.random() * Math.PI * 2
            };
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            direction: newDirection,
            lifetime: newLifetime,
            opacity: newOpacity
          };
        });

        // Generate neural connections between nearby particles
        const newConnections: Connection[] = [];
        for (let i = 0; i < newParticles.length; i++) {
          for (let j = i + 1; j < newParticles.length; j++) {
            const p1 = newParticles[i];
            const p2 = newParticles[j];
            const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
            
            if (distance < 150 && newConnections.length < 8) {
              const opacity = Math.max(0, 0.15 - distance / 1000);
              if (opacity > 0.02) {
                newConnections.push({
                  id: i * 1000 + j,
                  from: { x: p1.x, y: p1.y },
                  to: { x: p2.x, y: p2.y },
                  opacity,
                  lifetime: 0
                });
              }
            }
          }
        }

        setConnections(newConnections);
        return newParticles;
      });
    };

    const intervalId = setInterval(animationLoop, 16); // ~60fps
    return () => clearInterval(intervalId);
  }, [dimensions]);

  const renderParticle = (particle: Particle) => {
    const baseProps = {
      key: particle.id,
      className: "absolute pointer-events-none",
      style: {
        left: particle.x,
        top: particle.y,
        opacity: particle.opacity,
        transform: 'translate(-50%, -50%)',
        willChange: 'transform, opacity'
      }
    };

    switch (particle.type) {
      case 'node':
        return (
          <motion.div
            {...baseProps}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" }
            }}
          >
            <div 
              className="rounded-full bg-blue-500/30 border border-blue-400/50"
              style={{ 
                width: particle.size + 'px', 
                height: particle.size + 'px',
                boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)'
              }}
            />
          </motion.div>
        );

      case 'data':
        return (
          <motion.div
            {...baseProps}
            animate={{
              rotate: [0, 180, 360],
              scale: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div 
              className="bg-emerald-500/25 border border-emerald-400/40"
              style={{ 
                width: particle.size + 'px', 
                height: particle.size + 'px',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.3))'
              }}
            />
          </motion.div>
        );

      case 'neural':
        return (
          <motion.div
            {...baseProps}
            animate={{
              scale: [0.5, 1.5, 0.5],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div 
              className="rounded-full bg-purple-500/20 border border-purple-400/40"
              style={{ 
                width: particle.size * 1.5 + 'px', 
                height: particle.size * 1.5 + 'px',
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0.1) 70%, transparent 100%)'
              }}
            />
          </motion.div>
        );

      case 'geometric':
        return (
          <motion.div
            {...baseProps}
            animate={{
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 0.8, 1, 1.2, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div 
              className="bg-orange-500/20 border border-orange-400/40"
              style={{ 
                width: particle.size + 'px', 
                height: particle.size + 'px',
                transform: 'rotate(45deg)',
                boxShadow: '0 0 6px rgba(249, 115, 22, 0.2)'
              }}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Neural network connections */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map(connection => (
          <motion.line
            key={connection.id}
            x1={connection.from.x}
            y1={connection.from.y}
            x2={connection.to.x}
            y2={connection.to.y}
            stroke="rgba(59, 130, 246, 0.2)"
            strokeWidth="1"
            opacity={connection.opacity}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ willChange: 'opacity' }}
          />
        ))}
      </svg>

      {/* Floating AI particles */}
      {particles.map(renderParticle)}

      {/* Ambient glow overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.02) 0%, transparent 50%)
          `
        }}
      />
    </div>
  );
}