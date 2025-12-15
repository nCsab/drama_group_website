import React from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  return (
    <div 
      className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none" 
      style={{ 
        background: '#020300',
        animation: 'deep-pulse 10s infinite' 
      }}
    >
      <div className="blob-container absolute inset-0 w-full h-full">
        
        <div 
          className="liquid-blob delay-1 bg-[#4a4d3a]" 
          style={{ 
            top: '-10%', left: '-10%', width: '65%', height: '65%', 
            opacity: 0.8
          }}
        ></div>

        <div 
          className="liquid-blob delay-2 bg-[#757960]" 
          style={{ 
            top: '0%', right: '-10%', width: '70%', height: '70%', 
            opacity: 0.7
          }}
        ></div>

        <div 
          className="liquid-blob delay-3 bg-[#9ca082]" 
          style={{ 
            bottom: '-10%', left: '0%', width: '60%', height: '60%', 
            opacity: 0.6,
            mixBlendMode: 'screen'
          }}
        ></div>

        <div 
          className="liquid-blob delay-4 bg-[#b5b99a]" 
          style={{ 
            bottom: '-15%', right: '-10%', width: '65%', height: '65%', 
            opacity: 0.5,
            mixBlendMode: 'overlay'
          }}
        ></div>

        <div 
          className="liquid-blob delay-5 bg-[#3b3e2b]" 
          style={{ 
            top: '25%', left: '25%', width: '60%', height: '60%', 
            opacity: 0.8,
            mixBlendMode: 'normal'
          }}
        ></div>

         <div 
          className="liquid-blob delay-2 bg-[#757960]" 
          style={{ 
            top: '45%', left: '10%', width: '40%', height: '40%', 
            opacity: 0.5,
            mixBlendMode: 'hard-light'
          }}
        ></div>

        <div 
          className="liquid-blob delay-1 bg-[#4a4d3a]" 
          style={{ 
            top: '10%', left: '40%', width: '50%', height: '50%', 
            opacity: 0.7
          }}
        ></div>

        <div 
          className="liquid-blob delay-4 bg-[#1a1c10]" 
          style={{ 
            bottom: '15%', right: '15%', width: '80%', height: '80%', 
            opacity: 0.9,
            mixBlendMode: 'multiply'
          }}
        ></div>
        
      </div>

      <div 
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

    </div>
  );
};

export default AnimatedBackground;
