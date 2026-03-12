"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface NavbarProps {
    activeSection?: string;
    onJelentkezzClick?: () => void;
}

export default function Navbar({ activeSection = "home", onJelentkezzClick }: NavbarProps) {
    const navRef = useRef<HTMLElement>(null);
    const linkRefs = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [navExpanded, setNavExpanded] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    
    const { t, language } = useLanguage();

    interface NavItem {
        id: string;
        src?: string;
        alt?: string;
        label?: string;
        path?: string;
    }

    const NAV_ITEMS: NavItem[] = [
        { id: "home", src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765666287/logo_label_white_qsokvm.png", alt: "logo" },
        { id: "taborok", label: t[language].nav.camps },
        { id: "rolunk", label: t[language].nav.about },
        { id: "tamogatok", label: t[language].nav.sponsors },
        { id: "jelentkezz", label: t[language].nav.apply, path: "/jelentkezz" }
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
            // Safety check if activeIdx is -1 (e.g. on new pages)
            if (activeIdx !== -1) {
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
            } else {
               setIndicatorStyle({ left: 0, width: 0 }); // or hide it
            }
        }
    }, [activeSection, contentVisible, language]);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            // For tamogatok, scroll to the bottom of its 550vh container so stickers are fully applied
            const blockPosition = sectionId === 'tamogatok' ? 'end' : 'start';
            element.scrollIntoView({ behavior: 'smooth', block: blockPosition });
        }
    };

    const handleNavClick = (item: NavItem) => {
        console.log("Nav click:", item.id);
        if (item.id === 'jelentkezz' && onJelentkezzClick) {
            console.log("Triggering onJelentkezzClick");
            onJelentkezzClick();
            return;
        }

        if (item.path) {
            window.location.href = item.path;
        } else {
            if (window.location.pathname !== "/") {
                window.location.href = `/#${item.id}`;
            } else {
                scrollToSection(item.id);
            }
        }
    };

    return (
        <nav
            ref={navRef}
            className={`
                inline-flex items-center fixed top-6 sm:top-10 left-1/2
                bg-white/10 backdrop-blur-[4px] rounded-full
                border border-white/5 
                h-[40px] sm:h-[3.125rem] 
                z-[100] 
                px-3 sm:px-4
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
                    absolute top-[5px] bottom-[5px] left-0 bg-white/20 rounded-full
                    transition-all duration-300 ease-out z-[-1] pointer-events-none
                    ${contentVisible ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                    transform: `translateX(${indicatorStyle.left}px)`,
                    width: indicatorStyle.width || 0
                }}
            />
            
            <div 
                className={`
                    flex gap-2 sm:gap-3 items-center whitespace-nowrap
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
                                onClick={() => handleNavClick(item)}
                                className="text-white no-underline px-2 py-1 rounded-full bg-transparent transition-colors flex items-center cursor-pointer border-none"
                                ref={el => { linkRefs.current[idx] = el; }}
                            >
                                <Image 
                                    src={item.src} 
                                    alt={item.alt || ''} 
                                    width={100}
                                    height={100}
                                    quality={80}
                                    className="w-5 sm:w-[1.5rem] h-auto object-contain pointer-events-none" 
                                />
                            </button>
                        );
                    } else {
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item)}
                                className={`
                                    text-white 
                                    text-sm sm:text-base
                                    font-semibold tracking-wide
                                    no-underline px-2 sm:px-2 py-1 rounded-full bg-transparent
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
