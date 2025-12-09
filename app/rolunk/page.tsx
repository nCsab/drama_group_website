"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import Navbar from "@/components/Navbar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

const getYearFromImg = (imgUrl: string) => {
    const match = imgUrl.match(/(\d{4})/);
    return match ? match[1] : 'unknown';
};

interface Slide {
    title: string;
    text: string;
    img: string;
}

const optimizeSlides = (initialSlides: Slide[]) => {
    let currentSlides = [...initialSlides];
    const maxIterations = 1000;
    
    const calculateConflicts = (arr: Slide[]) => {
        let conflicts = 0;
        const len = arr.length;
        for (let i = 0; i < len; i++) {
            const currentYear = getYearFromImg(arr[i].img);
            const nextYear = getYearFromImg(arr[(i + 1) % len].img);
            if (currentYear !== 'unknown' && currentYear === nextYear) {
                conflicts++;
            }
        }
        return conflicts;
    };

    let currentConflicts = calculateConflicts(currentSlides);
    if (currentConflicts === 0) return currentSlides;

    for (let i = 0; i < maxIterations; i++) {
        if (currentConflicts === 0) break;
        const idx1 = Math.floor(Math.random() * currentSlides.length);
        const idx2 = Math.floor(Math.random() * currentSlides.length);
        const temp = currentSlides[idx1];
        currentSlides[idx1] = currentSlides[idx2];
        currentSlides[idx2] = temp;
        const newConflicts = calculateConflicts(currentSlides);
        if (newConflicts <= currentConflicts) {
            currentConflicts = newConflicts;
        } else {
            currentSlides[idx2] = currentSlides[idx1];
            currentSlides[idx1] = temp;
        }
    }
    return currentSlides;
};

export default function AboutPage() {
    const { t, language } = useLanguage();
    const slides = t[language].hero as Slide[];
    const optimizedSlides = React.useMemo(() => optimizeSlides(slides), [slides]);
    
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [activeDetailImage, setActiveDetailImage] = useState<string | null>(null);
    const [originRect, setOriginRect] = useState<DOMRect | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animatingStyle, setAnimatingStyle] = useState<React.CSSProperties | null>(null);
    const [showContent, setShowContent] = useState(false);
    const [mounted, setMounted] = useState(false);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const detailImageRef = useRef<HTMLImageElement>(null);

    const radius = 320;

    useEffect(() => {
        setMounted(true);
    }, []);

    useLayoutEffect(() => {
        const totalSlides = optimizedSlides.length;
        
        optimizedSlides.forEach((_, idx) => {
            const card = cardRefs.current[idx];
            if (!card) return;

            let offset = idx - activeIndex;
            if (offset > totalSlides / 2) offset -= totalSlides;
            if (offset < -totalSlides / 2) offset += totalSlides;

            const angle = (offset / totalSlides) * 2 * Math.PI;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            const rotationY = angle * (180 / Math.PI);
            
            const isVisible = Math.abs(offset) <= 3;
            const scale = Math.max(0.4, 1 - Math.abs(offset) * 0.12);
            const zIndex = 50 - Math.abs(offset);
            const opacity = isVisible ? 1 : 0;

            gsap.to(card, {
                duration: 0.8,
                x: x,
                z: z,
                rotationY: rotationY,
                scale: scale,
                opacity: opacity,
                zIndex: zIndex,
                display: isVisible ? "block" : "none",
                ease: "power3.out",
                overwrite: "auto"
            });
        });
    }, [activeIndex, optimizedSlides]);

    const handleCardClick = (index: number) => {
        if (cardRefs.current[index]) {
            const rect = cardRefs.current[index]!.getBoundingClientRect();
            setOriginRect(rect);
        }
        setExpandedIndex(index);
        setActiveDetailImage(optimizedSlides[index].img);
        setIsPaused(true);
    };

    const closeExpanded = () => {
        setExpandedIndex(null);
        setActiveDetailImage(null);
        setIsPaused(false);
        setIsAnimating(false);
        setShowContent(false);
        setOriginRect(null);
    };

    const prevSlide = () => {
        if (expandedIndex !== null) return;
        setActiveIndex((prev) => (prev - 1 + optimizedSlides.length) % optimizedSlides.length);
    };

    const nextSlide = () => {
        if (expandedIndex !== null) return;
        setActiveIndex((prev) => (prev + 1) % optimizedSlides.length);
    };

    useEffect(() => {
        if (expandedIndex !== null && originRect) {
            setAnimatingStyle({
                top: originRect.top,
                left: originRect.left,
                width: originRect.width,
                height: originRect.height,
                transform: 'scale(1)',
                opacity: 1,
                borderRadius: '18px'
            });
            setIsAnimating(true);
            setShowContent(false);

            requestAnimationFrame(() => {
                setTimeout(() => {
                    setAnimatingStyle(prev => ({
                        ...prev,
                        transform: 'scale(1.05)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        zIndex: 1001
                    }));

                    setTimeout(() => {
                        if (detailImageRef.current) {
                            const targetRect = detailImageRef.current.getBoundingClientRect();
                            setAnimatingStyle({
                                top: targetRect.top,
                                left: targetRect.left,
                                width: targetRect.width,
                                height: targetRect.height,
                                transform: 'scale(1)',
                                boxShadow: 'none',
                                opacity: 1,
                                borderRadius: '0px'
                            });
                            
                            setTimeout(() => {
                                setIsAnimating(false);
                                setShowContent(true);
                            }, 800);
                        }
                    }, 100);
                }, 20);
            });
        } else {
            setAnimatingStyle(null);
            setShowContent(false);
        }
    }, [expandedIndex, originRect]);

    const expandedSlide = expandedIndex !== null ? optimizedSlides[expandedIndex] : null;

    return (
        <div className="min-h-screen relative z-[1]">
            <LanguageSwitcher />
            <Navbar />
            
            {/* Animating image during transition */}
            {isAnimating && animatingStyle && expandedSlide && (
                <div 
                    className="fixed z-[1001] rounded-xl shadow-2xl transition-all duration-800 ease-[cubic-bezier(0.65,0,0.35,1)] overflow-hidden"
                    style={animatingStyle}
                >
                    <Image 
                        src={expandedSlide.img} 
                        alt=""
                        fill
                        className="object-cover object-center"
                    />
                </div>
            )}

            {/* Detail overlay portal */}
            {mounted && expandedSlide && createPortal(
                <div 
                    className="fixed inset-0 bg-black/85 backdrop-blur-[5px] z-[1000] flex items-center justify-center animate-fadeIn"
                    onClick={closeExpanded}
                >
                    <div 
                        className="w-[90vw] max-w-[1200px] h-[85vh] rounded-3xl overflow-hidden flex flex-row relative shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button 
                            className="absolute top-5 right-5 w-11 h-11 rounded-full cursor-pointer z-[100] flex items-center justify-center transition-all duration-300 text-white text-3xl border-2 border-white/30 shadow-lg hover:rotate-90 hover:scale-110 hover:border-white/80"
                            style={{ 
                                background: "url('/images/design/watermelon_out.jpg') no-repeat center center",
                                backgroundSize: 'cover',
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                            }}
                            onClick={closeExpanded}
                        >
                            ×
                        </button>
                        
                        {/* Left side - main image */}
                        <div className="flex-[1.2] relative h-full overflow-hidden">
                            <Image 
                                ref={detailImageRef as any}
                                src={activeDetailImage || expandedSlide.img} 
                                alt={expandedSlide.title}
                                fill
                                className={`object-cover transition-transform duration-500 ${isAnimating ? 'opacity-0' : ''}`}
                            />
                        </div>
                        
                        {/* Right side - content */}
                        <div className="flex-1 p-[4vh_4vw] text-[#374328] overflow-hidden flex flex-col justify-center bg-[#758162] relative font-['Museo300']">
                            <div 
                                className={`
                                    bg-[rgba(30,35,20,0.65)] border border-white/10 rounded-3xl p-[3vh_3vw]
                                    shadow-2xl flex flex-col max-h-full backdrop-blur-[10px]
                                    transition-all duration-800 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                                    ${showContent ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-10 scale-[0.98]'}
                                `}
                                style={{ transitionDelay: showContent ? '0.1s' : '0s' }}
                            >
                                <h2 className="text-[clamp(2rem,5vh,3.5rem)] mb-[2vh] font-['Museo700'] leading-tight text-white drop-shadow-md">
                                    {expandedSlide.title}
                                </h2>
                                <p className="text-[clamp(0.9rem,2vh,1.1rem)] leading-relaxed text-[#e0e0e0] mb-[3vh] font-light line-clamp-[10]">
                                    {expandedSlide.text}
                                </p>
                                
                                {/* Gallery grid */}
                                <div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[1, 2, 3].map((i) => {
                                            const imgSrc = `https://picsum.photos/800/600?random=${expandedSlide.title.length + i}`;
                                            return (
                                                <div 
                                                    key={i} 
                                                    className={`
                                                        aspect-square rounded-xl overflow-hidden cursor-pointer
                                                        border-4 transition-all duration-300 relative
                                                        hover:scale-105
                                                        ${activeDetailImage === imgSrc 
                                                            ? 'border-[#ccdaa5] shadow-lg' 
                                                            : 'border-transparent'
                                                        }
                                                    `}
                                                    onClick={() => setActiveDetailImage(imgSrc)}
                                                >
                                                    <Image 
                                                        src={activeDetailImage === imgSrc ? '/images/design/watermelon_in.jpg' : imgSrc}
                                                        alt="Gallery thumbnail"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            );
                                        })}
                                        <div 
                                            className={`
                                                aspect-square rounded-xl overflow-hidden cursor-pointer
                                                border-4 transition-all duration-300 relative
                                                hover:scale-105
                                                ${activeDetailImage === expandedSlide.img 
                                                    ? 'border-[#ccdaa5] shadow-lg' 
                                                    : 'border-transparent'
                                                }
                                            `}
                                            onClick={() => setActiveDetailImage(expandedSlide.img)}
                                        >
                                            <Image 
                                                src={activeDetailImage === expandedSlide.img ? '/images/design/watermelon_in.jpg' : expandedSlide.img}
                                                alt="Original"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Hero slider container */}
            <div
                className={`
                    relative w-full max-w-[900px] h-[550px] flex items-center justify-center
                    mx-auto bottom-[-200px]
                    ${expandedIndex !== null ? "expanded-view" : ""}
                `}
                style={{ perspective: '1200px' }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => !expandedIndex && setIsPaused(false)}
            >
                {/* Left control */}
                <div className={`flex-shrink-0 flex flex-col justify-center items-center h-full z-[200] mr-4 ${expandedIndex !== null ? "hidden" : ""}`}>
                    <button 
                        onClick={prevSlide} 
                        aria-label="Előző kártya"
                        className="bg-white/95 border-2 border-transparent text-4xl text-gray-700 rounded-full w-[60px] h-[60px] shadow-lg cursor-pointer transition-all flex items-center justify-center backdrop-blur-lg hover:bg-[rgba(117,121,96,0.9)] hover:text-white hover:scale-110"
                    >
                        ‹
                    </button>
                </div>
                
                {/* 3D slider */}
                <div 
                    className="flex-1 w-full h-full relative flex items-center justify-center min-w-0 min-h-0"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {optimizedSlides.map((slide, idx) => {
                        let offset = idx - activeIndex;
                        if (offset > optimizedSlides.length / 2) offset -= optimizedSlides.length;
                        if (offset < -optimizedSlides.length / 2) offset += optimizedSlides.length;
                        const isActive = offset === 0;

                        return (
                            <div
                                key={idx}
                                ref={el => { cardRefs.current[idx] = el; }}
                                className={`
                                    absolute w-[190px] h-[270px] rounded-2xl shadow-xl cursor-pointer
                                    ${isActive ? "pointer-events-auto z-[100] shadow-2xl" : ""}
                                `}
                                onClick={() => handleCardClick(idx)}
                                style={{
                                    transformStyle: 'preserve-3d',
                                    transformOrigin: 'center center',
                                }}
                            >
                                <div 
                                    className="w-full h-full relative rounded-2xl"
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* Card front */}
                                    <div
                                        className="absolute w-full h-full rounded-2xl overflow-hidden bg-cover bg-center"
                                        style={{ 
                                            backgroundImage: `url(${slide.img})`,
                                            backfaceVisibility: 'hidden'
                                        }}
                                    >
                                        {isActive && (
                                            <div className="absolute bottom-0 left-0 right-0 backdrop-blur-lg bg-black/70 text-white p-4 rounded-b-2xl">
                                                <h2 className="m-0 mb-1 text-xl font-semibold leading-tight drop-shadow-md">
                                                    {slide.title}
                                                </h2>
                                            </div>
                                        )}
                                    </div>
                                    {/* Card back */}
                                    <div
                                        className="absolute w-full h-full rounded-2xl bg-cover bg-center"
                                        style={{ 
                                            backgroundImage: `url(${slide.img})`,
                                            backfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)'
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Right control */}
                <div className={`flex-shrink-0 flex flex-col justify-center items-center h-full z-[200] ml-4 ${expandedIndex !== null ? "hidden" : ""}`}>
                    <button 
                        onClick={nextSlide} 
                        aria-label="Következő kártya"
                        className="bg-white/95 border-2 border-transparent text-4xl text-gray-700 rounded-full w-[60px] h-[60px] shadow-lg cursor-pointer transition-all flex items-center justify-center backdrop-blur-lg hover:bg-[rgba(117,121,96,0.9)] hover:text-white hover:scale-110"
                    >
                        ›
                    </button>
                </div>
            </div>
        </div>
    );
}
