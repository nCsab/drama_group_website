"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const getYearFromImg = (imgUrl: string) => {
  const match = imgUrl.match(/(\d{4})/);
  return match ? match[1] : "unknown";
};

interface Slide {
  title: string;
  text: string;
  img: string;
}

type LayoutConfig = {
  radius: number;
  cardWidth: number;
  cardHeight: number;
  perspective: number;
  containerHeight: number;
  bottomOffset: number;
  scaleDecay: number;
  visibleCount: number;
  jarWidth: number; // New
  jarHeight: number; // New
};

const optimizeSlides = (initialSlides: Slide[]) => {
  let currentSlides = [...initialSlides];
  const maxIterations = 50; // Drastically reduced from 1000 to prevent Main Thread blocking on mobile devices

  const calculateConflicts = (arr: Slide[]) => {
    let conflicts = 0;
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      const currentYear = getYearFromImg(arr[i].img);
      const nextYear = getYearFromImg(arr[(i + 1) % len].img);
      if (currentYear !== "unknown" && currentYear === nextYear) {
        conflicts++;
      }
    }
    return conflicts;
  };

  let currentConflicts = calculateConflicts(currentSlides);
  if (currentConflicts === 0) return currentSlides;

  let bestSlides = [...currentSlides];
  let minConflicts = currentConflicts;

  for (let i = 0; i < maxIterations; i++) {
    if (minConflicts === 0) break;
    const tempSlides = [...currentSlides];
    const idx1 = Math.floor(Math.random() * tempSlides.length);
    const idx2 = Math.floor(Math.random() * tempSlides.length);

    const temp = tempSlides[idx1];
    tempSlides[idx1] = tempSlides[idx2];
    tempSlides[idx2] = temp;

    const newConflicts = calculateConflicts(tempSlides);
    // Save state if we found a better distribution to avoid completely reverting
    if (newConflicts < minConflicts) {
      minConflicts = newConflicts;
      bestSlides = [...tempSlides];
      currentSlides = [...tempSlides];
    }
  }
  return bestSlides;
};

interface AboutSectionProps {
  id: string;
}

export default function AboutSection({ id }: AboutSectionProps) {
  const { t, language } = useLanguage();
  const slides = t[language].hero as Slide[];
  const optimizedSlides = React.useMemo(() => optimizeSlides(slides), [slides]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeDetailImage, setActiveDetailImage] = useState<string | null>(
    null,
  );
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingStyle, setAnimatingStyle] =
    useState<React.CSSProperties | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [isPrevHovered, setIsPrevHovered] = useState(false);
  const [isNextHovered, setIsNextHovered] = useState(false);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  // Base reference values (designed for 1440px width)
  const baseConfig = {
    radius: 310,
    cardWidth: 200,
    cardHeight: 340,
    perspective: 1000,
    containerHeight: 550,
    bottomOffset: 100,
    jarWidth: 900, // Based on your previous % settings relative to 1440
    jarHeight: 900, // Based on your previous % settings relative to 1440
  };

  const [config, setConfig] = useState<LayoutConfig>({
    ...baseConfig,
    scaleDecay: 0.12,
    visibleCount: 3,
  });

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const detailImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      const width = window.innerWidth;
      let newConfig: LayoutConfig;

      if (width < 640) {
        // Keep mobile mostly static to avoid tiny unreadable sizes
        newConfig = {
          radius: 120,
          cardWidth: 80,
          cardHeight: 120,
          perspective: 300,
          containerHeight: 400,
          bottomOffset: 0,
          scaleDecay: 0.2,
          visibleCount: 1,
          jarWidth: 350,
          jarHeight: 400,
        };
      } else {
        // PROPORTIONAL SCALING for everything else (Tablets to 4K Displays)
        // We use 1440px as the perfect baseline
        const referenceWidth = 1440;

        // Calculate the exact multiplier based on window size
        const ratio = width / referenceWidth;

        newConfig = {
          radius: Math.round(baseConfig.radius * ratio),
          cardWidth: Math.round(baseConfig.cardWidth * ratio),
          cardHeight: Math.round(baseConfig.cardHeight * ratio),
          perspective: Math.round(baseConfig.perspective * ratio),
          containerHeight: Math.round(baseConfig.containerHeight * ratio),
          bottomOffset: Math.round(baseConfig.bottomOffset * ratio),
          jarWidth: Math.round(baseConfig.jarWidth * ratio),
          jarHeight: Math.round(baseConfig.jarHeight * ratio),
          scaleDecay: 0.12,
          // Optionally adjust visible cards if screen is very wide:
          visibleCount: width > 1800 ? 5 : 3,
        };
      }

      setConfig(newConfig);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    let isCancelled = false;

    const runAnimation = async () => {
      const gsapModule = (await import("gsap")).default;
      if (isCancelled) return;

      const totalSlides = optimizedSlides.length;

      optimizedSlides.forEach((_, idx) => {
        const card = cardRefs.current[idx];
        if (!card) return;

        let offset = idx - activeIndex;
        if (offset > totalSlides / 2) offset -= totalSlides;
        if (offset < -totalSlides / 2) offset += totalSlides;

        const angle = (offset / totalSlides) * 2 * Math.PI;

        const x = Math.sin(angle) * config.radius;
        const z = Math.cos(angle) * config.radius;
        const rotationY = angle * (180 / Math.PI);

        const isVisible = Math.abs(offset) <= config.visibleCount;
        const scale = Math.max(0.4, 1 - Math.abs(offset) * config.scaleDecay);
        const zIndex = 50 - Math.abs(offset);
        const opacity = isVisible ? 1 : 0;

        gsapModule.to(card, {
          duration: 0.8,
          x: x,
          z: z,
          rotationY: rotationY,
          scale: scale,
          opacity: opacity,
          zIndex: zIndex,
          display: isVisible ? "block" : "none",
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    };

    runAnimation();

    return () => {
      isCancelled = true;
    };
  }, [activeIndex, optimizedSlides, config]);

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
    setActiveIndex(
      (prev) => (prev - 1 + optimizedSlides.length) % optimizedSlides.length,
    );
  };

  const nextSlide = () => {
    if (expandedIndex !== null) return;
    setActiveIndex((prev) => (prev + 1) % optimizedSlides.length);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (expandedIndex !== null) return; // Disable when card is expanded
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedIndex, activeIndex]); // Add dependencies

  // Touch Navigation (Swipe)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    if (expandedIndex !== null && originRect) {
      setAnimatingStyle({
        top: originRect.top,
        left: originRect.left,
        width: originRect.width,
        height: originRect.height,
        transform: "scale(1)",
        opacity: 1,
        borderRadius: "18px",
      });
      setIsAnimating(true);
      setShowContent(false);

      requestAnimationFrame(() => {
        setTimeout(() => {
          setAnimatingStyle((prev) => ({
            ...prev,
            transform: "scale(1.05)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            zIndex: 1001,
          }));

          setTimeout(() => {
            if (detailImageRef.current) {
              const targetRect = detailImageRef.current.getBoundingClientRect();
              setAnimatingStyle({
                top: targetRect.top,
                left: targetRect.left,
                width: targetRect.width,
                height: targetRect.height,
                transform: "scale(1)",
                boxShadow: "none",
                opacity: 1,
                borderRadius: "0px",
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

  const expandedSlide =
    expandedIndex !== null ? optimizedSlides[expandedIndex] : null;

  return (
    <section
      id={id}
      className="scroll-section relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Organizing Team Header - Matches "Curious?" style */}
      <div className="w-full text-center z-20 mt-12 -mb-10 sm:mb-46 px-6 relative">
        <h2 className="font-['Museo700'] text-white text-3xl md:text-5xl drop-shadow-md mb-4 sm:mb-6">
          {t[language].about.title}
        </h2>
        <p className="font-['Museo300'] text-white text-base md:text-xl drop-shadow-md opacity-90 max-w-4xl mx-auto leading-relaxed">
          {t[language].about.description}
        </p>
      </div>

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

      {mounted &&
        expandedSlide &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-[5px] z-[1000] flex items-center justify-center animate-fadeIn"
            onClick={closeExpanded}
          >
            <div
              className="w-[90vw] max-w-[1200px] h-[85vh] md:h-[80vh] rounded-3xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 md:top-5 md:right-5 w-10 h-10 md:w-11 md:h-11 rounded-full cursor-pointer z-[100] flex items-center justify-center transition-all duration-300 text-white text-3xl border-2 border-[#568c2d] shadow-lg hover:scale-110"
                style={{
                  backgroundImage: `url('${isCloseHovered ? "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661302/watermelon_in_jkn6h6.avif" : "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661302/watermelon_out_ik6gvy.jpg"}')`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
                onClick={closeExpanded}
                onMouseEnter={() => setIsCloseHovered(true)}
                onMouseLeave={() => setIsCloseHovered(false)}
                onFocus={() => setIsCloseHovered(true)}
                onBlur={() => setIsCloseHovered(false)}
              >
                ×
              </button>

              <div className="h-2/5 md:h-full md:flex-[1.2] relative overflow-hidden">
                <Image
                  ref={detailImageRef as any}
                  src={activeDetailImage || expandedSlide.img}
                  alt={expandedSlide.title}
                  fill
                  className={`object-cover transition-transform duration-500 ${isAnimating ? "opacity-0" : ""}`}
                  quality={80}
                />
              </div>

              <div className="flex-1 md:flex-1 p-4 md:p-[4vh_4vw] text-[#2E0E10] flex flex-col justify-center bg-[#7A2E32] relative font-['Museo300'] overflow-hidden">
                <div
                  className={`
                                    bg-[rgba(46,14,16,0.65)] border border-white/10 rounded-3xl p-6 md:p-[3vh_3vw]
                                    shadow-2xl flex flex-col max-h-[90%] backdrop-blur-[10px]
                                    transition-all duration-800 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                                    overflow-y-auto scrollbar-hide
                                    ${showContent ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-10 scale-[0.98]"}
                                `}
                  style={{ transitionDelay: showContent ? "0.1s" : "0s" }}
                >
                  <h2 className="text-[clamp(1.5rem,4vh,2.5rem)] mb-[1.5vh] font-['Museo700'] leading-tight text-white drop-shadow-md">
                    {expandedSlide.title}
                  </h2>
                  <p className="text-[clamp(0.9rem,2vh,1.05rem)] leading-relaxed text-[#e0e0e0] font-light">
                    {expandedSlide.text}
                  </p>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <div
        className={`
                    relative w-full flex items-center justify-center
                    mx-auto
                    ${expandedIndex !== null ? "expanded-view" : ""}
                `}
        style={{
          perspective: `${config.perspective}px`,
          height: `${config.containerHeight}px`,
          bottom: `${config.bottomOffset}px`,
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => !expandedIndex && setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Background Jar Image */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 mt-12 sm:mt-20"
          style={{
            width: `${config.jarWidth}px`,
            height: `${config.jarHeight}px`,
            // minWidth removed to allow it to shrink proportionally
          }}
        >
          <Image
            src="https://res.cloudinary.com/dbg7yvrnj/image/upload/v1772050877/borka%CC%81ny_szimpla_ehxu0r.png"
            alt="Befőttesüveg jar background"
            fill
            className="object-contain drop-shadow-2xl"
            quality={80}
          />
        </div>

        {/* Navigation Buttons - Moved to sides, hidden on mobile */}
        <div className={`absolute top-4/5 left-0 right-0 -translate-y-1/2 hidden md:flex items-center justify-between px-4 md:px-12 z-40 pointer-events-none ${expandedIndex !== null ? "!hidden" : ""}`}>
            <button
                onClick={prevSlide}
                aria-label={t[language].about.prevLabel}
                className="w-16 h-16 md:w-25 md:h-20 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 text-white text-4xl border-2 border-[#568c2d] shadow-2xl hover:scale-110 pointer-events-auto"
                style={{
                    backgroundImage: `url('${isPrevHovered ? 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661302/watermelon_in_jkn6h6.avif' : 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661302/watermelon_out_ik6gvy.jpg'}')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    textShadow: '0 2px 6px rgba(0,0,0,0.5)'
                }}
                onMouseEnter={() => setIsPrevHovered(true)}
                onMouseLeave={() => setIsPrevHovered(false)}
            >
                ‹
            </button>

            <button
                onClick={nextSlide}
                aria-label={t[language].about.nextLabel}
                className="w-16 h-16 md:w-25 md:h-20 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 text-white text-4xl border-2 border-[#568c2d] shadow-2xl hover:scale-110 pointer-events-auto"
                style={{
                    backgroundImage: `url('${isNextHovered ? 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661302/watermelon_in_jkn6h6.avif' : 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661302/watermelon_out_ik6gvy.jpg'}')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    textShadow: '0 2px 6px rgba(0,0,0,0.5)'
                }}
                onMouseEnter={() => setIsNextHovered(true)}
                onMouseLeave={() => setIsNextHovered(false)}
            >
                ›
            </button>
        </div>

        <div
          className="flex-1 w-full h-full relative flex items-center justify-center min-w-0 min-h-0 z-20 mt-24 sm:mt-60"
          style={{ transformStyle: "preserve-3d" }}
        >
          {optimizedSlides.map((slide, idx) => {
            let offset = idx - activeIndex;
            if (offset > optimizedSlides.length / 2)
              offset -= optimizedSlides.length;
            if (offset < -optimizedSlides.length / 2)
              offset += optimizedSlides.length;
            const isActive = offset === 0;

            return (
              <div
                key={idx}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className={`
                                    absolute rounded-2xl shadow-xl cursor-pointer
                                    ${isActive ? "pointer-events-auto z-[100] shadow-2xl" : ""}
                                `}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "center center",
                  width: `${config.cardWidth}px`,
                  height: `${config.cardHeight}px`,
                }}
                onClick={() => handleCardClick(idx)}
              >
                <div
                  className="w-full h-full relative rounded-2xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="absolute w-full h-full rounded-2xl overflow-hidden"
                    style={{
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <Image
                      src={slide.img}
                      alt={slide.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 140px, (max-width: 1024px) 250px, (max-width: 1600px) 350px, 500px"
                      quality={80}
                    />
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 backdrop-blur-lg bg-black/70 text-white p-2 sm:p-3 rounded-b-2xl z-10">
                        <h2 className="m-0 text-sm sm:text-base md:text-lg font-semibold leading-tight drop-shadow-md">
                          {slide.title}
                        </h2>
                      </div>
                    )}
                  </div>
                  <div
                    className="absolute w-full h-full rounded-2xl overflow-hidden"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <Image
                      src={slide.img}
                      alt={slide.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 140px, (max-width: 1024px) 250px, (max-width: 1600px) 350px, 500px"
                      quality={80}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigációs gombok eltávolítva az aljáról, most már a slider két szélén vannak */}

      {/* Simple Gradient Separator (Consistent with other sections) - Extra margóval */}
      <div className="w-3/4 md:w-1/2 mx-auto h-px bg-gradient-to-r from-transparent via-white/40 to-transparent my-18 relative z-20"></div>
    </section>
  );
}
