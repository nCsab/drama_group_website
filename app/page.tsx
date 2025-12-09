"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import IntroSplash from "@/components/IntroSplash";

interface ImageItem {
    src: string;
    alt: string;
}

const IMAGES: ImageItem[] = [
    { src: "/images/groups/2014.jpg", alt: "Group photo 2014" },
    { src: "/images/groups/2015.g.jpg", alt: "Group photo 2015 G" },
    { src: "/images/groups/2015.jpg", alt: "Group photo 2015" },
    { src: "/images/groups/2016.g.jpg", alt: "Group photo 2016 G" },
    { src: "/images/groups/2016.jpg", alt: "Group photo 2016" },
    { src: "/images/groups/2017.jpg", alt: "Group photo 2017" },
    { src: "/images/groups/2018.m.jpg", alt: "Group photo 2018 M" },
    { src: "/images/groups/19.jpg", alt: "Group photo 19" },
    { src: "/images/groups/22.jpg", alt: "Group photo 22" },
    { src: "/images/groups/23.jpg", alt: "Group photo 23" },
    { src: "/images/groups/24.jpg", alt: "Group photo 24" },
    { src: "/images/groups/25.jpg", alt: "Group photo 25" },
    { src: "/images/groups/2017.g.jpg", alt: "Group photo 2017 G" },
    { src: "/images/groups/2018.g.jpg", alt: "Group photo 2018 G" },
    { src: "/images/groups/2018.jpg", alt: "Group photo 2018" },
    { src: "/images/groups/2019.g.jpg", alt: "Group photo 2019 G" },
    { src: "/images/groups/2019.jpg", alt: "Group photo 2019" },
    { src: "/images/groups/2021.g.jpg", alt: "Group photo 2021 G" },
    { src: "/images/groups/2021.jpg", alt: "Group photo 2021" },
    { src: "/images/groups/2022.g.jpg", alt: "Group photo 2022 G" },
    { src: "/images/groups/2022.jpg", alt: "Group photo 2022" },
    { src: "/images/groups/2023.g.jpg", alt: "Group photo 2023 G" },
    { src: "/images/groups/2023.jpg", alt: "Group photo 2023" },
    { src: "/images/groups/2024.g.jpg", alt: "Group photo 2024 G" },
    { src: "/images/groups/2024.jpg", alt: "Group photo 2024" },
    { src: "/images/groups/2025.g.jpg", alt: "Group photo 2025 G" },
    { src: "/images/groups/2025.jpg", alt: "Group photo 2025" },
    { src: "/images/groups/2025_ALUMNI.jpg", alt: "Group photo 2025 ALUMNI" },
    { src: "/images/groups/2025_ALUMNI.g.jpg", alt: "Group photo 2025 ALUMNI G" }
];

const PIXEL_IMAGES = [
    "betty_pixel.png",
    "gabor_pixel.png",
    "krisztike_pixel.png",
    "zoli_pixel.png"
];

export default function HomePage() {
    const [showIntro, setShowIntro] = useState(true);
    const [gridConfig] = useState({ columns: 8, rows: 6 });
    const [showTitle, setShowTitle] = useState(false);
    const [showDialogue, setShowDialogue] = useState(false);
    const [currentPixelImage, setCurrentPixelImage] = useState(PIXEL_IMAGES[2]);
    const [interactionClass, setInteractionClass] = useState("");
    const [entranceFinished, setEntranceFinished] = useState(false);
    const [navbarCenterX, setNavbarCenterX] = useState(0);
    const [mounted, setMounted] = useState(false);
    const dialogueTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const tileWidthGap = 270 + 8;
    const tileHeightGap = 165 + 8;

    // Mark as mounted after hydration
    useEffect(() => {
        setMounted(true);
        setNavbarCenterX(window.innerWidth / 2);
        const handleResize = () => setNavbarCenterX(window.innerWidth / 2);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getYearFromSrc = (src: string) => {
        const match = src.match(/(\d{4})/);
        return match ? match[1] : 'unknown';
    };

    const isValidPlacement = useCallback((grid: (ImageItem | null)[][], row: number, col: number, image: ImageItem, rows: number, cols: number) => {
        const currentYear = getYearFromSrc(image.src);
        if (col > 0 && grid[row][col - 1]) {
            const leftYear = getYearFromSrc(grid[row][col - 1]!.src);
            if (leftYear !== 'unknown' && leftYear === currentYear) return false;
        }
        if (col < cols - 1 && grid[row][col + 1]) {
            const rightYear = getYearFromSrc(grid[row][col + 1]!.src);
            if (rightYear !== 'unknown' && rightYear === currentYear) return false;
        }
        if (row > 0 && grid[row - 1][col]) {
            const topYear = getYearFromSrc(grid[row - 1][col]!.src);
            if (topYear !== 'unknown' && topYear === currentYear) return false;
        }
        if (row < rows - 1 && grid[row + 1]?.[col]) {
            const bottomYear = getYearFromSrc(grid[row + 1][col]!.src);
            if (bottomYear !== 'unknown' && bottomYear === currentYear) return false;
        }
        return true;
    }, []);

    const createRandomizedGrid = useCallback((rows: number, cols: number) => {
        const grid: (ImageItem | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const shuffled = [...IMAGES].sort(() => Math.random() - 0.5);
                let placed = false;
                for (const img of shuffled) {
                    if (isValidPlacement(grid, row, col, img, rows, cols)) {
                        grid[row][col] = img;
                        placed = true;
                        break;
                    }
                }
                if (!placed) {
                    grid[row][col] = shuffled[0];
                }
            }
        }
        return grid;
    }, [isValidPlacement]);

    useEffect(() => {
        if (!showIntro) {
            const timer = setTimeout(() => setShowTitle(true), 500);
            return () => clearTimeout(timer);
        }
    }, [showIntro]);

    const getRandomImage = (current: string) => {
        let newImage;
        do {
            newImage = PIXEL_IMAGES[Math.floor(Math.random() * PIXEL_IMAGES.length)];
        } while (newImage === current && PIXEL_IMAGES.length > 1);
        return newImage;
    };

    const handleTitleClick = () => {
        if (!entranceFinished) return;
        if (!interactionClass) setInteractionClass("interacting");
        if (showDialogue) {
            setShowDialogue(false);
            if (dialogueTimeoutRef.current) clearTimeout(dialogueTimeoutRef.current);
            dialogueTimeoutRef.current = setTimeout(() => {
                const newImage = getRandomImage(currentPixelImage);
                setCurrentPixelImage(newImage);
                setShowDialogue(true);
            }, 1500);
        } else {
            const newImage = getRandomImage(currentPixelImage);
            setCurrentPixelImage(newImage);
            setShowDialogue(true);
        }
    };

    const handleAnimationEnd = (e: React.AnimationEvent) => {
        if (e.animationName === "playfulGreeting") {
            setInteractionClass("");
            setEntranceFinished(true);
        } else if (e.animationName === "theatricalEntrance") {
            setEntranceFinished(true);
        }
    };

    // Only generate brick rows on client side to avoid hydration mismatch
    const brickRows = useMemo(() => {
        if (!mounted) return [];
        
        const totalRows = gridConfig.rows * 2;
        const imageGrid = createRandomizedGrid(totalRows, gridConfig.columns);
        const rows = [];
        const screenWidth = window.innerWidth;
        const minRepetitions = Math.ceil(screenWidth / (tileWidthGap * gridConfig.columns)) + 1;

        for (let row = 0; row < totalRows; row++) {
            const isOffset = row % 2 === 1;
            const baseColumns = isOffset ? gridConfig.columns - 1 : gridConfig.columns;
            const originalRow = imageGrid[row].slice(0, baseColumns).filter((img): img is ImageItem => img !== null);
            const loopedRow: ImageItem[] = [];
            for (let i = 0; i < minRepetitions; i++) {
                loopedRow.push(...originalRow);
            }
            rows.push({ images: loopedRow, isOffset });
        }
        return [...rows, ...rows];
    }, [gridConfig, createRandomizedGrid, tileWidthGap, mounted]);

    const mosaicWidth = tileWidthGap * gridConfig.columns * 3;
    const mosaicHeight = tileHeightGap * gridConfig.rows * 4;

    const titleStyle = {
        left: navbarCenterX || '50%',
        top: 'calc(50% + 30px)',
        transform: 'translate(-50%, -50%) scale(1.25)',
    };

    return (
        <>
            {showIntro && <IntroSplash onFinish={() => setShowIntro(false)} />}
            <div className="min-h-screen relative z-[1]">
                <LanguageSwitcher />
                <Navbar />
                
                {/* Background container */}
                <div className="fixed inset-0 flex items-center justify-center overflow-hidden z-0">
                    {/* Background mosaic - only render after mount */}
                    {mounted && (
                        <div
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 min-w-[100vw] min-h-[100vh] overflow-hidden z-0 pointer-events-none flex items-center justify-center"
                            style={{
                                width: `${mosaicWidth * 8}px`,
                                height: `${mosaicHeight}px`,
                                '--marquee-translate': `${tileWidthGap * gridConfig.columns * 0.5}px`,
                                '--tile-width-gap': `${tileWidthGap}px`,
                                '--tile-height-gap': `${tileHeightGap}px`,
                                '--grid-columns': gridConfig.columns,
                                '--grid-rows': gridConfig.rows,
                            } as React.CSSProperties}
                        >
                            <div className="gallery-marquee">
                                {brickRows.map((row, idx) => (
                                    <div key={idx} className={`flex gap-2 mb-2 ${row.isOffset ? "offset-row" : ""}`}>
                                        {row.images.map((img, i) => (
                                            <div key={`${idx}-${i}`} className="gallery-img-container">
                                                <Image
                                                    src={img.src}
                                                    alt={img.alt}
                                                    width={270}
                                                    height={165}
                                                    className="w-full h-full object-cover rounded-[3px] select-none"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Gallery wrapper with gradient overlay */}
                    <div className="fixed inset-0 overflow-hidden z-[1] flex items-center justify-center">
                        <div 
                            className="fixed inset-0 pointer-events-none z-[2]"
                            style={{
                                background: 'linear-gradient(45deg, rgba(5, 6, 2, 0.9) 0%, rgba(10, 12, 5, 0.6) 50%, rgba(20, 25, 10, 0.2) 100%)'
                            }}
                        />
                    </div>

                    <Image
                        src="/images/logos/logo_label_title.png"
                        alt="Title"
                        width={600}
                        height={200}
                        className={`white-title ${entranceFinished ? "entered" : (showTitle ? "visible" : "")} ${interactionClass}`}
                        style={{ ...titleStyle, cursor: entranceFinished ? 'pointer' : 'default' }}
                        onClick={handleTitleClick}
                        onAnimationEnd={handleAnimationEnd}
                        priority
                    />
                    
                    <Image 
                        src={`/images/heroes/hero_pixels/${currentPixelImage}`}
                        alt="Pixel Art Character" 
                        width={600}
                        height={600}
                        className={`pixel-art-krisztike ${showDialogue ? "visible" : ""}`}
                    />
                </div>
            </div>
        </>
    );
}
