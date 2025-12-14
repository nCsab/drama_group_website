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
            style={{
                backgroundImage: `url('/images/sponsor_stage.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="flex flex-col justify-center items-center h-full gap-8">
                <div className="text-white text-4xl font-bold">
                    {t[language].sponsors.title}
                </div>
                
                
                <div className="mt-8">
                    <HolographicCard imgSrc="/images/sponsors/credit_card.jpg" />
                </div>
            </div>
        </section>
    );
}
