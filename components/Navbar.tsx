"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface NavbarProps {
    activeSection?: string;
}

export default function Navbar({ activeSection = "home" }: NavbarProps) {
    const navRef = useRef<HTMLElement>(null);
    const linkRefs = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [navExpanded, setNavExpanded] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    
    const { t, language } = useLanguage();

    const NAV_ITEMS = [
        { id: "home", src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765666287/logo_label_white_qsokvm.png", alt: "logo" },
        { id: "taborok", label: t[language].nav.camps },
        { id: "rolunk", label: t[language].nav.about },
        { id: "tamogatok", label: t[language].nav.sponsors }
    ];

    useEffect(() => {
        const timer1 = setTimeout(() => setNavExpanded(true), 300);
        const timer2 = setTimeout(() => setContentVisible(true), 600);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    useEffect(() => {
        if (contentVisible) {
            const activeIdx = NAV_ITEMS.findIndex(item => item.id === activeSection);
            const activeLink = linkRefs.current[activeIdx];
            const nav = navRef.current;
            if (activeLink && nav) {
                const navRect = nav.getBoundingClientRect();
                const linkRect = activeLink.getBoundingClientRect();
                setIndicatorStyle({
                    left: linkRect.left - navRect.left + nav.scrollLeft,
                    width: linkRect.width
                });
            }
        }
    }, [activeSection, contentVisible, language]);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav
            ref={navRef}
            className={`
                inline-flex items-center fixed top-6 lg:top-10 2xl:top-14 left-1/2
                bg-white/10 backdrop-blur-[4px] rounded-full
                border border-white/5 
                h-[40px] lg:h-[50px] 2xl:h-[70px] 
                z-[100] 
                px-3 lg:px-4 2xl:px-8
                overflow-hidden whitespace-nowrap
                transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                ${navExpanded 
                    ? 'translate-x-[-50%] scale-100 opacity-100' 
                    : 'translate-x-[-50%] scale-0 opacity-0'
                }
            `}
        >
            {}
            <div
                className={`
                    absolute top-[5px] bottom-[5px] bg-white/20 rounded-full
                    transition-all duration-300 ease-out z-[-1] pointer-events-none
                    ${contentVisible ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width || 0
                }}
            />
            
            {/* Nav content */}
            <div 
                className={`
                    flex gap-2 lg:gap-3 2xl:gap-6 items-center whitespace-nowrap
                    transition-opacity duration-300 delay-[400ms]
                    ${contentVisible ? 'opacity-100' : 'opacity-0'}
                `}
            >
                {NAV_ITEMS.map((item, idx) => {
                    const isActive = item.id === activeSection;
                    if (item.src) {
                        return (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className="text-white no-underline px-2 py-1 rounded-full bg-transparent transition-colors flex items-center cursor-pointer border-none"
                                ref={el => { linkRefs.current[idx] = el; }}
                            >
                                <Image 
                                    src={item.src} 
                                    alt={item.alt || ''} 
                                    width={100}
                                    height={100}
                                    quality={100}
                                    priority
                                    className="w-4 lg:w-6 2xl:w-10 h-auto object-contain pointer-events-none" 
                                />
                            </button>
                        );
                    } else {
                        return (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`
                                    text-white 
                                    text-sm lg:text-base 2xl:text-2xl
                                    font-semibold tracking-wide
                                    no-underline px-2 lg:px-2 2xl:px-4 py-1 rounded-full bg-transparent
                                    transition-colors outline-none whitespace-nowrap cursor-pointer border-none
                                    ${isActive ? 'font-bold' : ''}
                                `}
                                ref={el => { linkRefs.current[idx] = el; }}
                            >
                                {item.label}
                            </button>
                        );
                    }
                })}
            </div>
        </nav>
    );
}
