"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

type Language = 'hu' | 'en' | 'ro';

const LANGUAGES: { code: Language; img: string; alt: string }[] = [
    { code: 'hu', img: 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1773831483/borkány_HU_i4ost7.webp', alt: 'Magyar' },
    { code: 'en', img: 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1773831483/borka%CC%81ny_ENG_qco69c.webp', alt: 'English' },
    { code: 'ro', img: 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1773831483/borkány_RO_epn8dt.webp', alt: 'Română' }
];

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();

    const availableLanguages = LANGUAGES.filter(lang => lang.code !== language);

    return (
        <div className="fixed top-6 lg:top-10 2xl:top-14 right-4 lg:right-8 z-50 flex gap-2 lg:gap-0 lg:-space-x-3 2xl:gap-6 2xl:space-x-0">
            {availableLanguages.map(lang => (
                <div 
                    key={lang.code} 
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setLanguage(lang.code)}
                >
                    <Image 
                        src={lang.img} 
                        alt={lang.alt} 
                        width={200}
                        height={200}
                        quality={80}
                        className="w-14 h-auto object-contain"
                        loading="lazy"
                    />
                </div>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
