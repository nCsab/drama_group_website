"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

export default function SponsorsPage() {
    const { t, language } = useLanguage();
    
    return (
        <div 
            className="min-h-screen relative z-[1]"
            style={{
                backgroundImage: `url('/images/sponsor_stage.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}
        >
            <LanguageSwitcher />
            <Navbar />
            <div className="flex justify-center items-center h-screen text-white text-4xl font-bold">
                {t[language].sponsors.title}
            </div>
        </div>
    );
}
