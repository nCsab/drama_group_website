"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface SponsorsSectionProps {
    id: string;
}

export default function SponsorsSection({ id }: SponsorsSectionProps) {
    const { t, language } = useLanguage();
    
    return (
        <section 
            id={id}
            className="scroll-section relative min-h-screen"
            style={{
                backgroundImage: `url('/images/sponsor_stage.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="flex justify-center items-center h-full text-white text-4xl font-bold">
                {t[language].sponsors.title}
            </div>
        </section>
    );
}
