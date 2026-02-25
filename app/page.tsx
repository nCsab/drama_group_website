"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import IntroSplash from "@/components/IntroSplash";
import HomeSection from "@/components/sections/HomeSection";
import CampsSection from "@/components/sections/CampsSection";
import AboutSection from "@/components/sections/AboutSection";
import SponsorsSection from "@/components/sections/SponsorsSection";
import WaveTransition from "@/components/WaveTransition";
import JelentkezzOverlay from "@/components/JelentkezzOverlay";

export default function HomePage() {
    const [showIntro, setShowIntro] = useState(false);

    const [activeSection, setActiveSection] = useState("home");
    const [isJelentkezzActive, setIsJelentkezzActive] = useState(false);

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
        let isScrolling = false;
        
        const handleScroll = () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const sections = document.querySelectorAll('.scroll-section');
                    let currentSection = "home";
                    let minDistance = Infinity;

                    // Support both window scrolling and container scrolling
                    const container = document.querySelector('.scroll-container');
                    const viewportCenter = (window.innerHeight / 2);
                    const containerScrollTop = container ? container.scrollTop : 0;
                    
                    // Special case for top of page explicitly
                    if ((window.scrollY === 0 && containerScrollTop === 0)) {
                        currentSection = "home";
                    } else {
                        sections.forEach((section) => {
                            const rect = section.getBoundingClientRect();
                            // Calculate distance from center of section to center of viewport
                            const sectionCenter = rect.top + (rect.height / 2);
                            const distance = Math.abs(sectionCenter - viewportCenter);

                            if (distance < minDistance) {
                                minDistance = distance;
                                currentSection = section.id;
                            }
                        });
                    }

                    if (currentSection !== activeSection) {
                        setActiveSection(currentSection);
                        window.history.replaceState(null, '', `#${currentSection}`);
                    }
                    isScrolling = false;
                });
            }
            isScrolling = true;
        };

        const container = document.querySelector('.scroll-container');
        
        // Listen to both window and container to catch whichever handles the scroll
        window.addEventListener('scroll', handleScroll, { passive: true });
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true });
        }
        
        // Initial detection
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [activeSection]);

    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (hash && hash !== 'home') {
            const element = document.getElementById(hash);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 200);
            }
        }
    }, []);

    return (
        <>
            {showIntro && <IntroSplash onFinish={() => setShowIntro(false)} />}
            {isJelentkezzActive && (
                <JelentkezzOverlay 
                    onFinish={() => {
                        window.location.href = "https://google.com";
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
