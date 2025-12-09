"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
    const pathname = usePathname();
    const navRef = useRef<HTMLElement>(null);
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [navExpanded, setNavExpanded] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    
    const { t, language } = useLanguage();

    const NAV_ITEMS = [
        { to: "/", src: "/images/logos/logo_label_white.png", alt: "logo" },
        { to: "/taborok", label: t[language].nav.camps },
        { to: "/rolunk", label: t[language].nav.about },
        { to: "/tamogatok", label: t[language].nav.sponsors }
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
            const activeIdx = NAV_ITEMS.findIndex(item => item.to === pathname);
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
    }, [pathname, contentVisible, language]);

    return (
        <nav
            ref={navRef}
            className={`
                inline-flex items-center fixed top-10 left-1/2
                bg-white/10 backdrop-blur-[4px] rounded-full
                border border-white/5 h-[50px] z-[100] px-4
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
                    flex gap-3 items-center whitespace-nowrap
                    transition-opacity duration-300 delay-[400ms]
                    ${contentVisible ? 'opacity-100' : 'opacity-0'}
                `}
            >
                {NAV_ITEMS.map((item, idx) => {
                    const isActive = item.to === pathname;
                    if (item.src) {
                        return (
                            <Link
                                key={item.to}
                                href={item.to}
                                className="text-white no-underline px-2 py-1 rounded-full bg-transparent transition-colors"
                                ref={el => { linkRefs.current[idx] = el; }}
                            >
                                <Image 
                                    src={item.src} 
                                    alt={item.alt || ''} 
                                    width={32}
                                    height={32}
                                    className="h-8 w-auto pointer-events-none" 
                                />
                            </Link>
                        );
                    } else {
                        return (
                            <Link
                                key={item.to}
                                href={item.to}
                                className={`
                                    text-white text-base font-semibold tracking-wide
                                    no-underline px-2 py-1 rounded-full bg-transparent
                                    transition-colors outline-none whitespace-nowrap
                                    ${isActive ? 'font-bold' : ''}
                                `}
                                ref={el => { linkRefs.current[idx] = el; }}
                            >
                                {item.label}
                            </Link>
                        );
                    }
                })}
            </div>
        </nav>
    );
}
