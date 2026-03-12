"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import HolographicCard from '../HolographicCard';

const STICKER_COUNT = 7;

interface SponsorsSectionProps {
    id: string;
}

export default function SponsorsSection({ id }: SponsorsSectionProps) {
    const { t, language } = useLanguage();
    const sectionRef = useRef<HTMLDivElement>(null);
    const [stickerProgresses, setStickerProgresses] = useState(Array(STICKER_COUNT).fill(0));

    // Random sorrend, hogy melyik matrica mikor "aktiválódik"
    const [stickerOrder] = useState(() => {
        const indices = Array.from({ length: STICKER_COUNT }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        return indices;
    });

    useEffect(() => {
        let frameId: number | null = null;

        const updateProgress = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const vh = window.innerHeight;
            const sectionHeight = sectionRef.current.offsetHeight;

            const scrolledPast = -rect.top;
            const scrollableRange = sectionHeight - vh;

            if (scrollableRange <= 0) {
                setStickerProgresses(Array(STICKER_COUNT).fill(0));
                return;
            }

            const stickerPhaseStart = scrollableRange * 0.15;
            const stickerRange = scrollableRange - stickerPhaseStart;
            const perStickerRange = stickerRange / STICKER_COUNT;

            const progressesByPhase = Array.from({ length: STICKER_COUNT }, (_, i) => {
                const start = stickerPhaseStart + i * perStickerRange;
                const end = start + perStickerRange;
                const p = (scrolledPast - start) / (end - start);
                return Math.max(0, Math.min(1, p));
            });

            const progresses = Array(STICKER_COUNT).fill(0);
            stickerOrder.forEach((stickerIndex, phaseIndex) => {
                progresses[stickerIndex] = progressesByPhase[phaseIndex];
            });

            setStickerProgresses(progresses);
        };

        const handleScroll = () => {
            if (frameId !== null) return;
            frameId = window.requestAnimationFrame(() => {
                updateProgress();
                frameId = null;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        updateProgress();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }
        };
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
                        imgSrc="https://res.cloudinary.com/dbg7yvrnj/image/upload/v1773344191/credit_card_vyi5e1.webp" 
                        stickerProgresses={stickerProgresses}
                    />
                </div>
            </div>
        </section>
    );
}
