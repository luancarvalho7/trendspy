import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { FormData } from '../types/form';

interface LoadingPageProps {
  formData: FormData;
  onComplete: () => void;
}

interface MetricRow {
  label: string;
  status: 'pending' | 'analyzing' | 'complete';
  color: 'grey' | 'amber' | 'red';
  show: boolean;
}

export default function LoadingPage({ formData, onComplete }: LoadingPageProps) {
  const [progress, setProgress] = useState(0);
  const [currentMicroCopy, setCurrentMicroCopy] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const [scanLine, setScanLine] = useState(0);
  const [metrics, setMetrics] = useState<MetricRow[]>([
    { label: 'Análise do nicho selecionado', status: 'pending', color: 'grey', show: true },
    { label: 'Definição do tom de voz da marca', status: 'pending', color: 'grey', show: true },
    { label: 'Personalidade e valores da marca', status: 'pending', color: 'grey', show: true },
    { label: 'Estratégia de comunicação', status: 'pending', color: 'grey', show: true },
    { label: 'Posicionamento competitivo', status: 'pending', color: 'grey', show: true }
  ]);

  const microCopyTexts = [
    "Analisando características do seu nicho…",
    "Definindo personalidade da marca…",
    "Mapeando tom de voz ideal…",
    "Processando valores e missão da marca…",
    "Calibrando estilo de comunicação…",
    "Estruturando identidade verbal…",
    "Sintetizando diretrizes de marca…",
    "Finalizando perfil de comunicação…"
  ];

  useEffect(() => {
    // Fixed duration of exactly 3 seconds
    const totalDuration = 3000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const normalizedTime = Math.min(elapsed / totalDuration, 1);

      let currentProgress;
      if (normalizedTime < 0.25) {
        // Fast burst 0→72% - starts immediately
        currentProgress = (normalizedTime / 0.25) * 72;
      } else if (normalizedTime < 0.75) {
        // Slow creep to 89%
        const slowPhase = (normalizedTime - 0.25) / 0.5;
        currentProgress = 72 + slowPhase * 17;
      } else if (normalizedTime < 0.92) {
        // Long stall at 89%
        currentProgress = 89;
      } else {
        // Jump to 100%
        currentProgress = 100;
      }

      setProgress(currentProgress);

      // Dynamic pulse intensity based on progress
      setPulseIntensity(Math.sin(elapsed * 0.005) * 0.5 + 0.5);
      
      // Scanning line animation
      setScanLine((elapsed * 0.3) % 100);
      
      // Update metrics based on progress
      setMetrics(prev => prev.map((metric, index) => {
        const visibleMetrics = prev.filter(m => m.show);
        const threshold = ((index + 1) / visibleMetrics.length) * 72;
        const completeThreshold = threshold + 12;
        
        if (currentProgress >= threshold && metric.status === 'pending') {
          return {
            ...metric,
            status: 'analyzing',
            color: Math.random() > 0.7 ? 'red' : 'amber'
          };
        }
        if (currentProgress >= completeThreshold && metric.status === 'analyzing') {
          return { ...metric, status: 'complete' };
        }
        return metric;
      }));

      if (normalizedTime >= 1) {
        setTimeout(onComplete, 400);
      } else {
        requestAnimationFrame(animate);
      }
    };

    // Start animation immediately
    requestAnimationFrame(animate);
  }, [onComplete, formData]);

  useEffect(() => {
    // Rotate micro-copy every 800ms for better readability
    const interval = setInterval(() => {
      setCurrentMicroCopy(prev => (prev + 1) % microCopyTexts.length);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const getStatusDotColor = (metric: MetricRow) => {
    if (metric.status === 'complete') {
      return metric.color === 'red' ? 'bg-red-500' : 'bg-amber-500';
    }
    return 'bg-gray-300';
  };

  const getStatusDotClass = (metric: MetricRow) => {
    const baseClass = `w-2.5 h-2.5 rounded-full transition-all duration-500 ${getStatusDotColor(metric)}`;
    if (metric.status === 'analyzing') {
      return `${baseClass} animate-pulse shadow-lg`;
    }
    if (metric.status === 'complete') {
      return `${baseClass} shadow-md`;
    }
    return baseClass;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col font-outfit relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <div className="sonar-sweep"></div>
        <div className="neural-network"></div>
        <div className="data-stream"></div>
      </div>
      
      {/* Scanning line overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: `linear-gradient(90deg, transparent ${scanLine}%, rgba(152, 0, 47, 0.4) ${scanLine + 0.3}%, transparent ${scanLine + 0.8}%)`
        }}
      ></div>

      <style jsx>{`
        .sonar-sweep {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 600px;
          height: 600px;
          margin: -300px 0 0 -300px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent 350deg, rgba(152, 0, 47, 0.15) 360deg);
          animation: sonar-rotation 12s ease-in-out infinite;
        }
        
        .neural-network {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(152, 0, 47, 0.06) 1.5px, transparent 1.5px),
            radial-gradient(circle at 75% 75%, rgba(152, 0, 47, 0.06) 1.5px, transparent 1.5px),
            radial-gradient(circle at 75% 25%, rgba(152, 0, 47, 0.06) 1.5px, transparent 1.5px),
            radial-gradient(circle at 25% 75%, rgba(152, 0, 47, 0.06) 1.5px, transparent 1.5px);
          background-size: 50px 50px;
          animation: network-pulse 8s ease-in-out infinite;
        }
        
        .data-stream {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, 
            transparent 49%, 
            rgba(152, 0, 47, 0.02) 50%, 
            transparent 51%
          );
          background-size: 30px 30px;
          animation: data-flow 6s linear infinite;
        }

        @keyframes sonar-rotation {
          0% { transform: rotate(0deg) scale(0.9); opacity: 0.3; }
          50% { transform: rotate(180deg) scale(1.05); opacity: 0.8; }
          100% { transform: rotate(360deg) scale(0.9); opacity: 0.3; }
        }
        
        @keyframes network-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.02); }
        }
        
        @keyframes data-flow {
          0% { transform: translateX(-30px) translateY(-30px); }
          100% { transform: translateX(30px) translateY(30px); }
        }

        .shimmer {
          background: linear-gradient(90deg, 
            rgba(156, 163, 175, 0.08) 25%, 
            rgba(156, 163, 175, 0.25) 50%, 
            rgba(156, 163, 175, 0.08) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .pulse-glow {
          box-shadow: 0 0 20px rgba(152, 0, 47, 0.3);
          animation: pulse-glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 20px rgba(152, 0, 47, 0.2); }
          100% { box-shadow: 0 0 30px rgba(152, 0, 47, 0.4); }
        }
      `}</style>

      {/* Header with Logo */}
      <div className="pt-16 pb-20 px-6">
        <Logo />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 max-w-md mx-auto w-full justify-center">
        <div className="space-y-10">
          {/* Top Line */}
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900 font-outfit tracking-wide">
              Processando dados…
            </h1>
          </div>

          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="w-full bg-gray-200/60 rounded-full h-2 shadow-inner">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-500 ease-out relative overflow-hidden pulse-glow"
                style={{ width: `${progress}%` }}
              >
                {/* Progress bar shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40">
                  <div className="h-full w-8 bg-white/60 blur-sm animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Micro-copy under progress bar */}
            <div className="text-center">
              <p className="text-sm text-gray-600 font-outfit min-h-[24px] transition-all duration-300 transform font-medium">
                {microCopyTexts[currentMicroCopy]}
              </p>
            </div>
          </div>

          {/* Metric Rows */}
          <div className="space-y-6 bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            {metrics.filter(metric => metric.show).map((metric, index) => (
              <div key={index} className="flex items-center space-x-5 group transition-all duration-300 hover:bg-white/30 rounded-xl p-3 -m-3">
                {/* Status Dot */}
                <div className={`${getStatusDotClass(metric)} group-hover:scale-125 transition-transform duration-300`}></div>
                
                {/* Metric Label */}
                <div className="flex-1">
                  <div className={`text-base text-gray-800 font-outfit transition-all duration-500 font-medium ${
                    metric.status === 'pending' ? 'shimmer' : ''
                  } ${metric.status === 'analyzing' ? 'text-accent font-semibold' : ''}`}>
                    {metric.label}
                  </div>
                </div>
                
                {/* Status Indicator */}
                {metric.status === 'complete' && (
                  <div className="flex items-center animate-fadeIn transition-all duration-300">
                    <svg className="w-5 h-5 text-gray-700 transition-transform duration-300 group-hover:scale-125" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                {/* Analysis indicator */}
                {metric.status === 'analyzing' && (
                  <div className="flex items-center">
                    <div className="flex space-x-1.5">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}