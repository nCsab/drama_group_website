"use client";

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

type Language = 'hu' | 'en' | 'ro';

const LANGUAGES: { code: Language; img: string; alt: string }[] = [
    { code: 'hu', img: '/images/design/jar_hu.png', alt: 'Magyar' },
    { code: 'en', img: '/images/design/jar_eng.png', alt: 'English' },
    { code: 'ro', img: '/images/design/jar_ro.png', alt: 'Română' }
];

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();

    const availableLanguages = LANGUAGES.filter(lang => lang.code !== language);

    return (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
            {availableLanguages.map(lang => (
                <div 
                    key={lang.code} 
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setLanguage(lang.code)}
                >
                    <Image 
                        src={lang.img} 
                        alt={lang.alt} 
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain"
                    />
                </div>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
