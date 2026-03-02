"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import HolographicCard from '../HolographicCard';

interface SponsorsSectionProps {
    id: string;
}

export default function SponsorsSection({ id }: SponsorsSectionProps) {
    const { t, language } = useLanguage();
    const sectionRef = useRef<HTMLDivElement>(null);
    const [stickerProgresses, setStickerProgresses] = useState([0, 0, 0, 0]);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const vh = window.innerHeight;
            const sectionHeight = sectionRef.current.offsetHeight;

            // How much of the section has scrolled past viewport top
            const scrolledPast = -rect.top;
            // Total scrollable distance
            const scrollableRange = sectionHeight - vh;
            
            if (scrollableRange <= 0) {
                setStickerProgresses([0, 0, 0, 0]);
                return;
            }

            // First 15% = card scrolls into view, no stickers yet
            // Remaining 85% split among 4 stickers sequentially
            const stickerPhaseStart = scrollableRange * 0.15;
            const stickerRange = scrollableRange - stickerPhaseStart;
            const perStickerRange = stickerRange / 4;

            const progresses = [0, 1, 2, 3].map(i => {
                const start = stickerPhaseStart + i * perStickerRange;
                const end = start + perStickerRange;
                const p = (scrolledPast - start) / (end - start);
                return Math.max(0, Math.min(1, p));
            });

            setStickerProgresses(progresses);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section 
            ref={sectionRef}
            id={id}
            className="scroll-section relative"
            style={{ minHeight: '550vh' }}
        >
            <div 
                className="sticky top-0 flex flex-col justify-center items-center px-4"
                style={{ 
                    height: '100vh',
                    gap: 'clamp(16px, 3vw, 32px)',
                }}
            >
                <h2 
                    className="font-['Museo700'] drop-shadow-md text-white text-center"
                    style={{ fontSize: 'clamp(24px, 4.9vw, 50px)' }}
                >
                    {t[language].sponsors.title}
                </h2>
                
                <div style={{ marginTop: 'clamp(16px, 3vw, 32px)' }}>
                    <HolographicCard 
                        imgSrc="/images/sponsors/credit_card.webp" 
                        stickerProgresses={stickerProgresses}
                    />
                </div>
            </div>
        </section>
    );
}
