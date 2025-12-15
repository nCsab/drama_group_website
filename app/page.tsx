"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import IntroSplash from "@/components/IntroSplash";
import HomeSection from "@/components/sections/HomeSection";
import CampsSection from "@/components/sections/CampsSection";
import AboutSection from "@/components/sections/AboutSection";
import SponsorsSection from "@/components/sections/SponsorsSection";

export default function HomePage() {
    const [showIntro, setShowIntro] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    useEffect(() => {
        const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
        if (!hasSeenSplash) {
            setShowIntro(true);
            sessionStorage.setItem("hasSeenSplash", "true");
        }
    }, []);

    useEffect(() => {
        const setupObserver = setTimeout(() => {
            const container = document.querySelector('.scroll-container');
            const sections = document.querySelectorAll('.scroll-section');
            
            if (!container || sections.length === 0) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    let mostVisible = entries[0];
                    entries.forEach((entry) => {
                        if (entry.intersectionRatio > mostVisible.intersectionRatio) {
                            mostVisible = entry;
                        }
                    });
                    
                    if (mostVisible.isIntersecting && mostVisible.intersectionRatio > 0.3) {
                        const sectionId = mostVisible.target.getAttribute('id');
                        if (sectionId) {
                            setActiveSection(sectionId);
                            window.history.replaceState(null, '', `#${sectionId}`);
                        }
                    }
                },
                {
                    threshold: [0, 0.25, 0.5, 0.75, 1],
                    root: container
                }
            );

            sections.forEach((section) => observer.observe(section));

            const checkInitialSection = () => {
                if (container.scrollTop < 100) {
                    setActiveSection('home');
                    window.history.replaceState(null, '', '#home');
                }
            };
            checkInitialSection();

            return () => observer.disconnect();
        }, 100);

        return () => clearTimeout(setupObserver);
    }, []);

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
            <div className="scroll-container">
                <LanguageSwitcher />
                <Navbar activeSection={activeSection} />
                
                <HomeSection 
                    id="home" 
                    showIntro={showIntro} 
                    onIntroFinish={() => setShowIntro(false)} 
                />
                <CampsSection id="taborok" />
                <AboutSection id="rolunk" />
                <SponsorsSection id="tamogatok" />
            </div>
        </>
    );
}
