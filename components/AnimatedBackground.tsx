import React from "react";
import "./AnimatedBackground.css";

const AnimatedBackground = () => {
  return (
    <div className="animated-bg-root fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      <div className="blob-container absolute inset-0 w-full h-full">
        <div
          className="liquid-blob delay-1 bg-[#5F1E22]"
          style={{
            top: "-10%",
            left: "-10%",
            width: "65%",
            height: "65%",
            opacity: 0.8,
          }}
        ></div>

        <div
          className="liquid-blob delay-2 bg-[#7A2E32]"
          style={{
            top: "0%",
            right: "-10%",
            width: "70%",
            height: "70%",
            opacity: 0.7,
          }}
        ></div>

        <div
          className="liquid-blob delay-3 bg-[#944145]"
          style={{
            bottom: "-10%",
            left: "0%",
            width: "60%",
            height: "60%",
            opacity: 0.6,
            mixBlendMode: "screen",
          }}
        ></div>

        <div
          className="liquid-blob delay-4 bg-[#AF575B]"
          style={{
            bottom: "-15%",
            right: "-10%",
            width: "65%",
            height: "65%",
            opacity: 0.5,
            mixBlendMode: "overlay",
          }}
        ></div>

        <div
          className="liquid-blob delay-5 bg-[#4A1518]"
          style={{
            top: "25%",
            left: "25%",
            width: "60%",
            height: "60%",
            opacity: 0.8,
            mixBlendMode: "normal",
          }}
        ></div>

        <div
          className="liquid-blob delay-2 bg-[#7A2E32]"
          style={{
            top: "45%",
            left: "10%",
            width: "40%",
            height: "40%",
            opacity: 0.5,
            mixBlendMode: "hard-light",
          }}
        ></div>

        <div
          className="liquid-blob delay-1 bg-[#5F1E22]"
          style={{
            top: "10%",
            left: "40%",
            width: "50%",
            height: "50%",
            opacity: 0.7,
          }}
        ></div>

        <div
          className="liquid-blob delay-4 bg-[#2E0E10]"
          style={{
            bottom: "15%",
            right: "15%",
            width: "80%",
            height: "80%",
            opacity: 0.9,
            mixBlendMode: "multiply",
          }}
        ></div>
      </div>

      {/* Removed heavy SVG feTurbulence overlays which were the main cause of CPU lag, while keeping the authentic lava lamp HTML morphs */}
    </div>
  );
};

export default AnimatedBackground;
