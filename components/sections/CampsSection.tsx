"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Image from 'next/image';
import { useLanguage } from "@/context/LanguageContext";
import VideoCard, { Video } from "@/components/VideoCard";
import { CAMP_VIDEOS } from "@/lib/data";

const CARD_DEFAULTS = {
  width: '100px',
  activeWidth: '200px',
  height: '90%',
  objectPosition: 'center center',
  thumbnailImage: "", // Providing defaults to satisfy type if needed, though mostly covered by spread
};

type CampsLayoutConfig = {
    width: string;
    activeWidth: string;
    height: string;
    isPortrait: boolean;
    gap: string;
};

interface CampsSectionProps {
    id: string;
}

export default function CampsSection({ id }: CampsSectionProps) {
    const { t, language } = useLanguage();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [centeredCardId, setCenteredCardId] = useState<number>(1);
    const [tappedCardId, setTappedCardId] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    
    const baseConfig = {
        width: 100, // numerical represention for rem math later
        activeWidth: 200,
        height: '90%',
        gap: 24,
    };

    const [config, setConfig] = useState<CampsLayoutConfig>({
        width: `${baseConfig.width}px`,
        activeWidth: `${baseConfig.activeWidth}px`,
        height: baseConfig.height,
        isPortrait: false,
        gap: `${baseConfig.gap}px`,
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const isPortrait = width < height;
            
            let newConfig: CampsLayoutConfig;

            if (isPortrait) {
                newConfig = {
                    width: '22vw',
                    activeWidth: '44vw',
                    height: '60vh',
                    isPortrait: true,
                    gap: '10px',
                };
            } else if (width < 640) {
                newConfig = {
                    width: '120px',
                    activeWidth: '150px',
                    height: '80%',
                    isPortrait: false,
                    gap: '12px',
                };
            } else {
                // Continuous proportional scaling for desktop/tablets based on 1440px baseline
                const referenceWidth = 1440;
                const ratio = width / referenceWidth;
                
                newConfig = {
                    width: `${Math.round(baseConfig.width * ratio)}px`,
                    activeWidth: `${Math.round(baseConfig.activeWidth * ratio)}px`,
                    height: '90%', // Keep height consistent percentage of viewport flex
                    isPortrait: false,
                    gap: `${Math.round(baseConfig.gap * ratio)}px`,
                };
            }
            
            setConfig(newConfig);
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!config.isPortrait) return;
        
        const timeoutId = setTimeout(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const cardId = parseInt(entry.target.getAttribute('data-card-id') || '1');
                            setCenteredCardId((prev) => {
                                if (prev !== cardId) {
                                    setTappedCardId(null);
                                    return cardId;
                                }
                                return prev;
                            });
                        }
                    });
                },
                {
                    root: scrollContainerRef.current,
                    rootMargin: '0px -45% 0px -45%',
                    threshold: 0.1,
                }
            );

            cardRefs.current.forEach((element) => {
                if (element) observer.observe(element);
            });

            return () => observer.disconnect();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [config.isPortrait]);

    const responsiveVideos = useMemo(() => {
        return CAMP_VIDEOS.map(video => ({
            ...CARD_DEFAULTS,
            ...video,
            width: config.width,
            activeWidth: config.activeWidth,
            height: config.height,
            topOffset: config.isPortrait ? '0px' : video.topOffset,
        }));
    }, [config]);

    return (
        <section id={id} className="scroll-section relative min-h-screen">
            <div className="min-h-screen w-full flex flex-col items-center justify-center pt-0 -mt-30 px-0 pb-10 relative z-10">
                
                {/* Intro Text & Title - Two Column Layout */}
                <div className="w-full max-w-6xl mx-auto px-6 mt-32 mb-12 md:mb-20 z-20 flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-16">
                    {/* Left: Title */}
                    <div className="w-full md:w-1/3 text-center md:text-right mt-4 md:mt-2">
                        <h2 className="font-['Museo700'] text-white text-4xl md:text-6xl drop-shadow-md leading-tight">
                            Játszunk?
                        </h2>
                    </div>

                    {/* Right: Description */}
                    <div className="w-full md:w-2/3">
                        <p className="font-['Museo300'] text-white text-base md:text-lg leading-relaxed drop-shadow-md text-justify">
                            A Csalamádé egy 10 napos tábor középiskolások számára, ahol különböző színházi szakemberek tartanak műhelymunkákat: színészek, rendezők, koreográfusok, dramaturgok, bábszínészek, díszlet- és látványtervezők, zenészek… Igyekszünk betekintést nyújtani a színház valamennyi szegmensébe és sokszínű foglalkozásokat biztosítani, a tábort mégis résztvevői nyitottsága, elszántsága és általuk a hangulat teszi sajátossá. Ebben a táborban örömmel játszunk, szeretjük a dinnyét, és bár sokan vagyunk sokfélék, mind megférünk egy üvegben, sőt! Összeérve vagyunk igazán jók.
                        </p>
                    </div>
                </div>

                {/* Visual Separator */}
                <div className="w-3/4 md:w-1/2 mx-auto h-px bg-gradient-to-r from-transparent via-white/40 to-transparent my-12"></div>

                {/* Middle Section: "Curious?" - Adjustable Spacing */}
                <div className="w-full text-center z-20 mt-16 mb-32"> {/* Adjust mt-16 and mb-12 for spacing */}
                    <h2 className="font-['Museo700'] text-white text-3xl md:text-5xl drop-shadow-md mb-4">
                        Kíváncsi vagy arra, hogy mit csinálunk?
                    </h2>
                    <p className="font-['Museo300'] text-white text-lg md:text-xl drop-shadow-md opacity-90">
                        Kattints az eddigi táborokra!
                    </p>
                </div>

                {config.isPortrait ? (
                    <div 
                        ref={scrollContainerRef}
                        className="flex flex-nowrap items-center w-full flex-grow overflow-x-auto snap-x snap-mandatory scrollbar-hide !scroll-smooth"
                        style={{ gap: config.gap }}
                    >
                        <div className="flex-shrink-0" style={{ width: '28vw' }} />
                        
                        {responsiveVideos.map((video) => {
                            const isCentered = centeredCardId === video.id;
                            const isTapped = tappedCardId === video.id;
                            
                            return (
                                <div 
                                    key={video.id}
                                    data-card-id={video.id}
                                    ref={(el) => {
                                        if (el) cardRefs.current.set(video.id, el);
                                    }}
                                    className="flex-shrink-0 snap-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden"
                                    style={{
                                        width: isCentered ? video.activeWidth : video.width,
                                        minHeight: video.height,
                                        height: 'auto',
                                        filter: isCentered ? 'none' : 'grayscale(100%)',
                                        opacity: isCentered ? 1 : 0.7,
                                    }}
                                    onClick={() => {
                                        if (isCentered && !isTapped) {
                                            setTappedCardId(video.id);
                                        } else if (isTapped) {
                                            setTappedCardId(null);
                                        }
                                    }}
                                >
                                    <VideoCard 
                                        video={{...video, width: '100%', activeWidth: '100%'}} 
                                        isHovered={isTapped}
                                        onHover={() => {}}
                                        onLeave={() => {}}
                                        isFocused={isCentered}
                                    />
                                </div>
                            );
                        })}
                        
                        <div className="flex-shrink-0" style={{ width: '28vw' }} />
                    </div>
                ) : (
                    <div 
                        className="flex flex-nowrap items-end justify-center h-[60vh] md:h-[70vh] max-w-full overflow-visible pb-4 mx-auto"
                        style={{ gap: config.gap }}
                    >
                        {responsiveVideos.map((video) => (
                            <VideoCard 
                                key={video.id} 
                                video={video as Video} 
                                isHovered={activeIndex === video.id}
                                onHover={() => setActiveIndex(video.id)}
                                onLeave={() => setActiveIndex(null)}
                                isFocused={false}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Simple Gradient Separator (Matching the one above) */}
            <div className="w-3/4 md:w-1/2 mx-auto h-px bg-gradient-to-r from-transparent via-white/40 to-transparent my-12 relative z-20"></div>
        </section>
    );
}
