"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import IntroSplash from "@/components/IntroSplash";
import HomeSection from "@/components/sections/HomeSection";
import WaveTransition from "@/components/WaveTransition";
import JelentkezzOverlay from "@/components/JelentkezzOverlay";
import AnimatedBackground from "@/components/AnimatedBackground";

const CampsSection = dynamic(
  () => import("@/components/sections/CampsSection"),
  { ssr: false }
);

const AboutSection = dynamic(
  () => import("@/components/sections/AboutSection"),
  { ssr: false }
);

const SponsorsSection = dynamic(
  () => import("@/components/sections/SponsorsSection"),
  { ssr: false }
);

export default function HomePage() {
    const [showIntro, setShowIntro] = useState(false);

    const [activeSection, setActiveSection] = useState("home");
    const [isJelentkezzActive, setIsJelentkezzActive] = useState(false);
    const activeSectionRef = useRef(activeSection);

    useEffect(() => {
        activeSectionRef.current = activeSection;
    }, [activeSection]);

    useEffect(() => {
        // Safari Detection
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

        // Skip intro if already seen OR if browser is Safari
        if (!hasSeenSplash && !isSafari) {
            setShowIntro(true);
            sessionStorage.setItem("hasSeenSplash", "true");
        }
    }, []);

    useEffect(() => {
        const sections = document.querySelectorAll<HTMLElement>(".scroll-section");
        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                let topEntry: { id: string; ratio: number } | null = null;

                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const id = (entry.target as HTMLElement).id || "home";
                    if (!topEntry || entry.intersectionRatio > topEntry.ratio) {
                        topEntry = { id, ratio: entry.intersectionRatio };
                    }
                });

                if (topEntry && topEntry.id !== activeSectionRef.current) {
                    activeSectionRef.current = topEntry.id;
                    setActiveSection(topEntry.id);
                    window.history.replaceState(null, "", `#${topEntry.id}`);
                }
            },
            {
                threshold: [0.25, 0.5, 0.75],
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (hash && hash !== 'home') {
            const element = document.getElementById(hash);
            if (element) {
                setTimeout(() => {
                    const blockPosition = hash === 'tamogatok' ? 'end' : 'start';
                    element.scrollIntoView({ behavior: 'smooth', block: blockPosition });
                }, 200);
            }
        }
    }, []);

    return (
        <>
            <AnimatedBackground />
            {showIntro && <IntroSplash onFinish={() => setShowIntro(false)} />}
            {isJelentkezzActive && (
                <JelentkezzOverlay 
                    onFinish={() => {
                        window.location.href = "/jelentkezz";
                    }} 
                />
            )}
            <div className="scroll-container">
                <LanguageSwitcher />
                <Navbar 
                    activeSection={activeSection} 
                    onJelentkezzClick={() => setIsJelentkezzActive(true)}
                />
                
                <HomeSection 
                    id="home" 
                    showIntro={showIntro} 
                    onIntroFinish={() => setShowIntro(false)} 
                />
                
                <div className="-mt-12 md:-mt-18 relative z-0 pointer-events-none">
                    <WaveTransition />
                </div>

                <CampsSection id="taborok" />
                <AboutSection id="rolunk" />
                <SponsorsSection id="tamogatok" />
            </div>
        </>
    );
}
