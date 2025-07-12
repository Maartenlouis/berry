"use client";
import React, { useEffect, useState } from "react";

interface SuccessAnimationProps {
  onComplete?: () => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ onComplete }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
  }>>([]);

  useEffect(() => {
    // Create confetti particles with strawberry theme colors
    const colors = ["#DC2626", "#EF4444", "#10B981", "#059669", "#16A34A", "#F87171"];
    const newParticles = [];
    
    for (let i = 0; i < 150; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
      });
    }
    
    setParticles(newParticles);

    // Close animation after 10 seconds
    const timeout = setTimeout(() => {
      if (onComplete) onComplete();
    }, 10000);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.5, // gravity
          rotation: particle.rotation + 5,
        })).filter(particle => particle.y < window.innerHeight + 50)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [particles.length]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-90" />
      
      {/* Confetti particles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {particles.map(particle => (
          <rect
            key={particle.id}
            x={particle.x}
            y={particle.y}
            width={particle.size}
            height={particle.size}
            fill={particle.color}
            transform={`rotate(${particle.rotation} ${particle.x + particle.size/2} ${particle.y + particle.size/2})`}
          />
        ))}
      </svg>
      
      {/* Success message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-6 animate-bounce-in transform transition-all max-w-xl w-full mx-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              Glückwunsch! 🍓
            </h2>
            
            {/* Rickroll GIF */}
            <div className="mb-4 rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://media.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif" 
                alt="Never Gonna Give You Up"
                className="w-full"
              />
            </div>
            
            <div className="text-2xl font-bold text-red-600 animate-pulse mb-4">
              LANDWIRTSCHAFT ERLEBEN
            </div>
            
            <button 
              onClick={onComplete}
              className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors shadow-lg"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;