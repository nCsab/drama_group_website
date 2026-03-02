"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Sticker from '../Sticker';
import HolographicCard from '../HolographicCard';

interface SponsorsSectionProps {
    id: string;
}

export default function SponsorsSection({ id }: SponsorsSectionProps) {
    const { t, language } = useLanguage();
    
    return (
        <section 
            id={id}
            className="scroll-section relative min-h-screen"
        >
            <div className="flex flex-col justify-center items-center h-full gap-8">
                <h2 className="text-white text-4xl md:text-5xl font-['Museo700'] drop-shadow-md">
                    {t[language].sponsors.title}
                </h2>
                
                
                <div className="mt-8">
                    <HolographicCard imgSrc="/images/sponsors/credit_card.webp" />
                </div>
            </div>
        </section>
    );
}
