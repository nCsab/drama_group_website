"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import gsap from "gsap";
import { createPortal } from "react-dom";

interface NavbarProps {
    activeSection?: string;
}

const LANGUAGES = [
    { code: 'hu' as const, img: 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661302/jar_hu_mlnbe1.png', alt: 'Magyar' },
    { code: 'en' as const, img: 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661302/jar_eng_lznwd9.png', alt: 'English' },
    { code: 'ro' as const, img: 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661302/jar_ro_lp7z9j.png', alt: 'Română' }
];

export default function Navbar({ activeSection = "home" }: NavbarProps) {
    const navRef = useRef<HTMLElement>(null);
    const linkRefs = useRef<(HTMLButtonElement | HTMLAnchorElement | HTMLDivElement | null)[]>([]);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [navExpanded, setNavExpanded] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [applyOrigin, setApplyOrigin] = useState({ x: 0, y: 0 });
    const overlayRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const { t, language, setLanguage } = useLanguage();

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
        { id: "jelentkezz", label: t[language].nav.apply }
    ];

    useEffect(() => {
        if (!contentVisible) return;

        const handleScroll = () => {
            const winScroll = window.scrollY;
            const viewportHeight = window.innerHeight;
            const nav = navRef.current;
            if (!nav) return;

            // 1. Identify items that actually exist locally on the current page
            const localItems = NAV_ITEMS
                .map((item, idx) => ({ ...item, originalIdx: idx }))
                .filter(item => document.getElementById(item.id));

            if (localItems.length === 0) {
                const isJelentkezzActive = pathname === "/jelentkezz";
                if (isJelentkezzActive) {
                    const idx = NAV_ITEMS.findIndex(item => item.id === "jelentkezz");
                    const link = linkRefs.current[idx];
                    if (link && nav) {
                        const navRect = nav.getBoundingClientRect();
                        const linkRect = link.getBoundingClientRect();
                        setIndicatorStyle({
                            left: linkRect.left - navRect.left + nav.scrollLeft,
                            width: linkRect.width
                        });
                    }
                }
                return;
            }

            // 2. Define trigger positions for each section
            // We use the midpoint of the screen to detect the "active" section
            const scrollPos = winScroll + viewportHeight / 3; 

            let activeLocalIdx = 0;
            for (let i = 0; i < localItems.length; i++) {
                const el = document.getElementById(localItems[i].id);
                if (el && scrollPos >= el.offsetTop) {
                    activeLocalIdx = i;
                }
            }

            // 3. Directly set the position to the active button (no interpolation)
            const activeItem = localItems[activeLocalIdx];
            const activeLink = linkRefs.current[activeItem.originalIdx];

            if (activeLink) {
                const navRect = nav.getBoundingClientRect();
                const linkRect = activeLink.getBoundingClientRect();

                setIndicatorStyle({
                    left: linkRect.left - navRect.left + nav.scrollLeft,
                    width: linkRect.width
                });
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [contentVisible, language]);

    useEffect(() => {
        const timer1 = setTimeout(() => setNavExpanded(true), 300);
        const timer2 = setTimeout(() => setContentVisible(true), 600);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            // For tamogatok, scroll to the bottom of its 550vh container so stickers are fully applied
            const blockPosition = sectionId === 'tamogatok' ? 'end' : 'start';
            element.scrollIntoView({ behavior: 'smooth', block: blockPosition });
        }
    };

    const handleNavClick = (item: NavItem) => {
        setIsMenuOpen(false);
        
        if (item.id === "jelentkezz") {
            const idx = NAV_ITEMS.findIndex(i => i.id === "jelentkezz");
            const btn = linkRefs.current[idx];
            if (btn) {
                const rect = btn.getBoundingClientRect();
                setApplyOrigin({ 
                    x: rect.left + rect.width / 2, 
                    y: rect.top + rect.height / 2 
                });
                setIsApplying(true);
            }
            return;
        }

        if (item.path) {
            router.push(item.path);
            return;
        }

        if (pathname !== "/") {
            router.push(`/#${item.id}`);
        } else {
            scrollToSection(item.id);
        }
    };

    useEffect(() => {
        if (isApplying && overlayRef.current && imageRef.current) {
            const tl = gsap.timeline();
            
            // 1. Expand from button position
            tl.fromTo(overlayRef.current, 
                { 
                    clipPath: `circle(0% at ${applyOrigin.x}px ${applyOrigin.y}px)`,
                    opacity: 0
                },
                { 
                    clipPath: `circle(150% at ${applyOrigin.x}px ${applyOrigin.y}px)`,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.inOut"
                }
            );

            // 2. Picture climbs onto screen (zoom in slightly)
            tl.fromTo(imageRef.current,
                { scale: 1.2, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1, ease: "power2.out" },
                "-=0.4"
            );

            // 3. Wait 5s and redirect
            const timer = setTimeout(() => {
                window.location.href = "https://ipv4.google.com/forms/about/";
            }, 5800); // 0.8s entrance + 5s wait

            return () => clearTimeout(timer);
        }
    }, [isApplying, applyOrigin]);

    return (
        <>
            {/* Mobile Menu Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[99] transition-opacity duration-500 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            <nav
                ref={navRef}
                className={`
                    fixed top-6 sm:top-10 left-1/2 -translate-x-1/2
                    bg-white/10 backdrop-blur-md rounded-[2rem]
                    border border-white/10 
                    z-[100] 
                    transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1.1)]
                    ${navExpanded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                    ${isMenuOpen ? 'w-[90vw] h-auto p-8 rounded-[2rem]' : 'h-[44px] sm:h-[3.125rem] px-3 sm:px-4 flex items-center'}
                `}
            >
                {/* Mobile Hamburger Toggle - Only visible on sm and below */}
                <div className="flex md:hidden items-center justify-between w-full h-full">
                    {!isMenuOpen && (
                        <>
                            <button 
                                onClick={() => handleNavClick(NAV_ITEMS[0])}
                                className="flex items-center px-2 border-none bg-transparent"
                            >
                                <Image 
                                    src={NAV_ITEMS[0].src!} 
                                    alt="logo" 
                                    width={24} 
                                    height={24} 
                                    className="w-6 h-auto object-contain"
                                />
                            </button>
                            <button 
                                onClick={() => setIsMenuOpen(true)}
                                className="relative w-10 h-10 flex items-center justify-center border-none bg-transparent cursor-pointer group"
                                aria-label="Open Menu"
                            >
                                <div className="relative w-[22px] h-[22px]">
                                    <span className="absolute left-0 top-0 w-[6px] h-[10px] bg-white rounded-[2px] transition-all duration-300 shadow-sm group-hover:bg-white/80"></span>
                                    <span className="absolute left-[8px] top-[6px] w-[6px] h-[10px] bg-white rounded-[2px] transition-all duration-300 shadow-sm group-hover:bg-white/80"></span>
                                    <span className="absolute left-[16px] top-[12px] w-[6px] h-[10px] bg-white rounded-[2px] transition-all duration-300 shadow-sm group-hover:bg-white/80"></span>
                                </div>
                            </button>
                        </>
                    )}
                    
                    {isMenuOpen && (
                        <div className="flex flex-col w-full gap-8">
                            <div className="flex justify-between items-center w-full">
                                <Image 
                                    src={NAV_ITEMS[0].src!} 
                                    alt="logo" 
                                    width={32} 
                                    height={32} 
                                    className="w-8 h-auto object-contain"
                                />
                                <button 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="relative w-10 h-10 flex flex-col justify-center items-center border-none bg-transparent cursor-pointer"
                                >
                                    <span className="absolute h-[2px] w-6 bg-white rounded-full rotate-45"></span>
                                    <span className="absolute h-[2px] w-6 bg-white rounded-full -rotate-45"></span>
                                </button>
                            </div>
                            
                            <div className="flex flex-col gap-6 items-start">
                                {NAV_ITEMS.slice(1).map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNavClick(item)}
                                        className="text-white text-2xl font-bold border-none bg-transparent cursor-pointer uppercase tracking-widest"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            <div className="h-px w-full bg-white/10"></div>

                            <div className="flex gap-6 items-center justify-center">
                                {LANGUAGES.map((lang) => (
                                    <div 
                                        key={lang.code}
                                        className={`cursor-pointer transition-all ${language === lang.code ? 'scale-125 border-b-2 border-white' : 'opacity-60 scale-100'}`}
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        <Image src={lang.img} alt={lang.alt} width={50} height={50} className="w-12 h-auto" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Desktop Menu - Visible only on md and above */}
                <div className="hidden md:flex items-center h-full">
                    <div
                        className={`
                            absolute top-[5px] bottom-[5px] left-0 bg-white/20 rounded-full
                            z-[-1] pointer-events-none
                            ${contentVisible ? 'opacity-100' : 'opacity-0'}
                        `}
                        style={{
                            transform: `translateX(${indicatorStyle.left}px)`,
                            width: indicatorStyle.width || 0,
                            transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1.1), width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1.1), opacity 0.3s ease-out'
                        }}
                    />
                    
                    <div 
                        className={`
                            flex gap-2 sm:gap-3 items-center whitespace-nowrap
                            transition-opacity duration-300
                            ${contentVisible ? 'opacity-100' : 'opacity-0'}
                        `}
                    >
                        {NAV_ITEMS.map((item, idx) => {
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
                                        className="text-white text-sm sm:text-base font-semibold tracking-wide no-underline px-2 sm:px-2 py-1 rounded-full bg-transparent transition-colors outline-none whitespace-nowrap cursor-pointer border-none"
                                        ref={el => { linkRefs.current[idx] = el; }}
                                    >
                                        {item.label}
                                    </button>
                                );
                            }
                        })}

                        <div className="w-[1px] h-4 bg-white/20 mx-1"></div>

                        <div className="flex -space-x-1 sm:-space-x-2 items-center h-full">
                            {LANGUAGES.filter(lang => lang.code !== language).map((lang) => (
                                <div 
                                    key={lang.code}
                                    className="cursor-pointer transition-transform hover:scale-115 hover:-translate-y-1 py-1"
                                    onClick={() => setLanguage(lang.code)}
                                >
                                    <Image src={lang.img} alt={lang.alt} width={60} height={60} className="w-8 sm:w-11 h-auto object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {isApplying && typeof document !== 'undefined' && createPortal(
                <div 
                    ref={overlayRef}
                    className="fixed inset-0 z-[9999] bg-[#7A2E32] flex flex-col items-center justify-center overflow-auto p-4 md:p-10"
                >
                    {/* Image Container: Vertical on mobile (to host rotated contents), Horizontal on Desktop */}
                    <div 
                        ref={imageRef} 
                        className="relative w-[85vw] md:w-[90vw] max-w-[1400px] aspect-[1738/3084] md:aspect-[3084/1738] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 shrink-0 bg-black flex items-center justify-center mb-8"
                    >
                        {/* The Rotated Wrapper for mobile */}
                        <div className="absolute w-[177.4%] aspect-[3084/1738] md:w-full md:h-full md:aspect-auto rotate-90 md:rotate-0 flex items-center justify-center pointer-events-none">
                            <div className="relative w-full h-full">
                                <Image 
                                    src="https://res.cloudinary.com/dbg7yvrnj/image/upload/q_auto,f_auto/v1773342112/26cover_10mb_zncgbh_t9akar.webp"
                                    alt="Csalamádé Színjátszó Csoport"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* Slogan: Hidden on mobile, visible on desktop */}
                    <div className="hidden md:block text-center w-full max-w-4xl px-6 pb-6">
                        <h2 className="text-white text-6xl font-['Museo700'] drop-shadow-2xl leading-tight">
                            Tegyük el együtt az Ideit!
                        </h2>
                    </div>
                    
                    {/* Minimalist Close Button in case user wants to cancel before redirect */}
                    <button 
                        onClick={() => setIsApplying(false)}
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors text-4xl font-light cursor-pointer"
                    >
                        ×
                    </button>
                </div>,
                document.body
            )}
        </>
    );
}
