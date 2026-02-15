"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";

export default function JelentkezzPage() {
    const { t, language } = useLanguage();
    const loaderRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGPathElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        const tl = gsap.timeline();
        // Normalized paths for clipPath (0..1 range) - Scaled vertically by ~2x
        const curve = "M0 1.0 S0.175 0.54 0.5 0.54 s0.5 0.46 0.5 0.46 V0 H0 Z";
        const flat = "M0 0.002 S0.175 0.001 0.5 0.001 s0.5 0.001 0.5 0.001 V0 H0 Z";

        if (headingRef.current) {
            // Ensure initial state is hidden
            gsap.set(headingRef.current, { autoAlpha: 0 });
            
            tl.fromTo(headingRef.current, 
                {
                    y: 400,
                    skewY: 10,
                    autoAlpha: 0
                },
                {
                    delay: 0.5,
                    y: 0,
                    skewY: 0,
                    autoAlpha: 1,
                    duration: 1,
                    ease: "power3.out"
                }
            ).to(headingRef.current, {
                delay: 0.5,
                y: -400,
                skewY: 10,
                autoAlpha: 0,
                duration: 1,
                ease: "power3.in"
            });
        }

        if (svgRef.current) {
            tl.to(svgRef.current, {
                duration: 0.8,
                attr: { d: curve },
                ease: "power2.easeIn",
            }).to(svgRef.current, {
                duration: 0.8,
                attr: { d: flat },
                ease: "power2.easeOut",
            });
        }

        if (loaderRef.current) {
            tl.to(loaderRef.current, {
                y: -1500,
                duration: 1,
                onComplete: () => setAnimationComplete(true),
            });
            tl.to(loaderRef.current, {
                zIndex: -1,
                display: "none",
            });
        }

        const containerTitle = document.querySelector(".container h1");
        if (containerTitle) {
            tl.from(
                containerTitle,
                {
                    y: 100,
                    opacity: 0,
                    duration: 1,
                },
                "-=1.0"
            );
        }

    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Loader */}

            <div 
                ref={loaderRef}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent overflow-hidden h-screen w-full"
            >
                <div className="absolute top-0 w-full h-[110vh]">
                     <img
                        src="https://res.cloudinary.com/dbg7yvrnj/image/upload/v1771189385/csoportk_1_hpa0re.jpg"
                        alt="Background"
                        className="w-full h-full object-cover"
                        style={{ clipPath: "url(#loader-clip)" }}
                     />
                </div>

                <svg width="0" height="0" className="absolute">
                    <defs>
                        <clipPath id="loader-clip" clipPathUnits="objectBoundingBox">
                             <path 
                                ref={svgRef} 
                                d="M0,1.005 S0.175,0.995,0.5,0.995 s0.5,0.005,0.5,0.005 V0 H0 Z" 
                             />
                        </clipPath>
                    </defs>
                </svg>

                <div className="absolute inset-0 z-20 overflow-hidden text-center flex items-center justify-center pointer-events-none">
                    <h1 
                        ref={headingRef}
                        className="text-[100px] md:text-[200px] text-white font-[family-name:var(--font-museo-700)] font-light uppercase text-center inline-block opacity-0"
                        style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                    >
                        {t[language].nav.apply}
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <Navbar activeSection="jelentkezz" />
            
            <div className="container relative z-10 min-h-screen w-full pt-32 px-4">
                {/* Content will go here */}
            </div>
        </div>
    );
}
