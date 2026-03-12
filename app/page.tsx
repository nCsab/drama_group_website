"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import IntroSplash from "@/components/IntroSplash";
import HomeSection from "@/components/sections/HomeSection";
import WaveTransition from "@/components/WaveTransition";
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
  const activeSectionRef = useRef(activeSection);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

    if (!hasSeenSplash && !isSafari) {
      setShowIntro(true);
      sessionStorage.setItem("hasSeenSplash", "true");
    }
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".scroll-section");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      entries => {
        let topEntry: { id: string; ratio: number } | null = null;

        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const id = (entry.target as HTMLElement).id || "home";
          if (!topEntry || entry.intersectionRatio > topEntry.ratio) {
            topEntry = { id, ratio: entry.intersectionRatio };
          }
        });

        const nextId = topEntry?.id;
        if (!nextId || nextId === activeSectionRef.current) return;

        activeSectionRef.current = nextId;
        setActiveSection(nextId);
        window.history.replaceState(null, "", `#${nextId}`);
      },
      {
        threshold: [0.25, 0.5, 0.75]
      }
    );

    sections.forEach(section => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && hash !== "home") {
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          const blockPosition = hash === "tamogatok" ? "end" : "start";
          element.scrollIntoView({ behavior: "smooth", block: blockPosition });
        }, 200);
      }
    }
  }, []);

  return (
    <>
      <AnimatedBackground />
      {showIntro && <IntroSplash onFinish={() => setShowIntro(false)} />}
      <div className="scroll-container">
        <LanguageSwitcher />
        <Navbar activeSection={activeSection} />
        <HomeSection id="home" showIntro={showIntro} onIntroFinish={() => setShowIntro(false)} />
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
