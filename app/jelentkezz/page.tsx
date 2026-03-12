"use client";

import React, { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function JelentkezzPage() {
    const loaderRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        let isCancelled = false;

        const runAnimation = async () => {
            const gsapModule = (await import("gsap")).default;
            if (isCancelled) return;

            const tl = gsapModule.timeline();
            // Gömbölyded clipPath animáció felülről lefelé
            const full = "M0,1.005 S0.175,0.995,0.5,0.995 s0.5,0.005,0.5,0.005 V0 H0 Z";
            const curve = "M0 1.0 S0.175 0.54 0.5 0.54 s0.5 0.46 0.5 0.46 V0 H0 Z";
            const flat = "M0 0.002 S0.175 0.001 0.5 0.001 s0.5 0.001 0.5 0.001 V0 H0 Z";

            if (svgRef.current) {
                // induljunk a lapos (felül) állapotból, majd „domborodjon” és töltse ki lefelé
                tl.set(svgRef.current, { attr: { d: flat } })
                  .to(svgRef.current, {
                    duration: 1.0,
                    attr: { d: curve },
                    ease: "power2.easeIn",
                  })
                  .to(svgRef.current, {
                    duration: 1.0,
                    attr: { d: full },
                    ease: "power2.easeOut",
                  });
            }

            // Várjunk még 2 másodpercet a teljes kép látható állapotában
            tl.to({}, { duration: 2.0 });

            // Majd irány a Google (teszt célra)
            tl.call(() => {
                window.location.href = "https://google.com";
            });
        };

        runAnimation();

        return () => {
            isCancelled = true;
        };
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Alap weboldal háttér */}
            <AnimatedBackground />

            {/* Loader */}

            <div
                ref={loaderRef}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent overflow-hidden h-screen w-full"
            >
                <div className="absolute top-0 w-full h-[110vh]">
                    <img
                        src="https://res.cloudinary.com/dbg7yvrnj/image/upload/v1773342112/26cover_10mb_zncgbh_t9akar.webp"
                        alt="Background"
                        className="w-full h-full object-cover"
                        style={{ clipPath: "url(#loader-clip-jelentkezz)" }}
                    />
                </div>

                <svg width="0" height="0" className="absolute">
                    <defs>
                        <clipPath
                            id="loader-clip-jelentkezz"
                            clipPathUnits="objectBoundingBox"
                        >
                            <path
                                ref={svgRef}
                                d="M0 0.002 S0.175 0.001 0.5 0.001 s0.5 0.001 0.5 0.001 V0 H0 Z"
                            />
                        </clipPath>
                    </defs>
                </svg>
            </div>

            {/* Main Content */}
            <Navbar activeSection="jelentkezz" />

            <div className="container relative z-10 min-h-screen w-full pt-32 px-4">
                {/* Content will go here */}
            </div>
        </div>
    );
}
