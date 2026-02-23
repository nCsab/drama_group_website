"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Image from "next/image";
import { IMAGES, ImageItem } from "@/lib/data";



type HomeLayoutConfig = {
  titleScale: number;

  gridColumns: number;
  gridRows: number;
  tileScale: number;
  gapSize: number;
};

interface HomeSectionProps {
  id: string;
  showIntro: boolean;
  onIntroFinish: () => void;
}

export default function HomeSection({
  id,
  showIntro,
  onIntroFinish,
}: HomeSectionProps) {
  const [config, setConfig] = useState<HomeLayoutConfig>({
    titleScale: 1.25,

    gridColumns: 8,
    gridRows: 6,
    tileScale: 1,
    gapSize: 8,
  });

  const gridConfig = useMemo(
    () => ({
      columns: config.gridColumns,
      rows: config.gridRows,
    }),
    [config]
  );

  const [showTitle, setShowTitle] = useState(false);

  const [interactionClass, setInteractionClass] = useState("");
  const [entranceFinished, setEntranceFinished] = useState(false);
  const [navbarCenterX, setNavbarCenterX] = useState(0);
  const [mounted, setMounted] = useState(false);


  const dynamicGap = config.gapSize;
  const tileWidthGap = 270 * config.tileScale + dynamicGap;
  const tileHeightGap = 165 * config.tileScale + dynamicGap;

  const prevWidth = useRef(-1);

  useEffect(() => {
    setMounted(true);
    setNavbarCenterX(window.innerWidth / 2);

    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width === prevWidth.current) return;
      
      prevWidth.current = width;
      setNavbarCenterX(width / 2);

      let newConfig: HomeLayoutConfig;

      if (width < 640) {
        newConfig = {
          titleScale: 0.8,
          gridColumns: 4,
          gridRows: 5,
          tileScale: 0.6,
          gapSize: 4,
        };
      } else if (width < 1024) {
        newConfig = {
          titleScale: 1.0,
          gridColumns: 6,
          gridRows: 6,
          tileScale: 0.8,
          gapSize: 6,
        };
      } else if (width < 1600) {
        newConfig = {
          titleScale: 1.25,
          gridColumns: 8,
          gridRows: 6,
          tileScale: 1,
          gapSize: 8,
        };
      } else {
        const scaleRatio = width / 1440;
        newConfig = {
          titleScale: 1.25 * scaleRatio,
          gridColumns: 8,
          gridRows: 6,
          tileScale: scaleRatio,
          gapSize: 8 * scaleRatio,
        };
      }
      setConfig(newConfig);
    };

    // Initial call
    handleResize();

    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 150);
    };
    
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  const getYearFromSrc = (src: string) => {
    const match = src.match(/(\d{4})/);
    return match ? match[1].slice(-2) : "unknown";
  };

  const isValidPlacement = useCallback(
    (
      grid: (ImageItem | null)[][],
      row: number,
      col: number,
      image: ImageItem,
      rows: number,
      cols: number
    ) => {
      const currentYear = getYearFromSrc(image.src);
      if (col > 0 && grid[row][col - 1]) {
        const leftYear = getYearFromSrc(grid[row][col - 1]!.src);
        if (leftYear !== "unknown" && leftYear === currentYear) return false;
      }
      if (col < cols - 1 && grid[row][col + 1]) {
        const rightYear = getYearFromSrc(grid[row][col + 1]!.src);
        if (rightYear !== "unknown" && rightYear === currentYear) return false;
      }
      if (row > 0 && grid[row - 1][col]) {
        const topYear = getYearFromSrc(grid[row - 1][col]!.src);
        if (topYear !== "unknown" && topYear === currentYear) return false;
      }
      if (row < rows - 1 && grid[row + 1]?.[col]) {
        const bottomYear = getYearFromSrc(grid[row + 1][col]!.src);
        if (bottomYear !== "unknown" && bottomYear === currentYear)
          return false;
      }
      return true;
    },
    []
  );

  const createRandomizedGrid = useCallback(
    (rows: number, cols: number) => {
      const grid: (ImageItem | null)[][] = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(null));
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const shuffled = [...IMAGES].sort(() => Math.random() - 0.5);
          let placed = false;
          for (let i = 0; i < shuffled.length; i++) {
            const img = shuffled[i];
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
    },
    [isValidPlacement]
  );

  useEffect(() => {
    // Safari Detection
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (!showIntro || isSafari) {
      // If Safari, we skip the delay and show title immediately (or rely on parent to not show intro)
      // Note: The parent component controls `showIntro`, but we can control `showTitle` here.
      // If `showIntro` is true but it's Safari, we might want to force the title to show immediately
      // and skip the "waiting" period if the intro doesn't play.
      
      const delay = isSafari ? 0 : 500;
      const timer = setTimeout(() => setShowTitle(true), delay);
      
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  const [showQuote, setShowQuote] = useState(false);

  const handleTitleClick = () => {
    if (!entranceFinished) return;
    if (!interactionClass) setInteractionClass("interacting");
    
    // Trigger "Secret" Quote
    if (!showQuote) {
      setShowQuote(true);
      setTimeout(() => {
        setShowQuote(false);
      }, 4000); // 4 seconds visibility
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

  // 1. Stable Grid Generation (Decoupled from scaling/screen width)
  // This layout only changes if the number of rows/columns changes (breakpoint switch).
  const stableGrid = useMemo(() => {
    if (!mounted) return [];
    
    const totalRows = gridConfig.rows * 2;
    
    // This expensive random logic now ONLY runs if rows/cols change
    return createRandomizedGrid(totalRows, gridConfig.columns);
  }, [gridConfig.rows, gridConfig.columns, createRandomizedGrid, mounted]);

  const brickRows = useMemo(() => {
    if (!mounted || stableGrid.length === 0) return [];

    const rows = [];
    const totalRows = gridConfig.rows * 2;
    const minRepetitions = 2;

    for (let row = 0; row < totalRows; row++) {
      if (!stableGrid[row]) continue;

      const isOffset = row % 2 === 1;
      const baseColumns = isOffset
        ? gridConfig.columns - 1
        : gridConfig.columns;
        
      const originalRow = stableGrid[row]
        .slice(0, baseColumns)
        .filter((img): img is ImageItem => img !== null);
        
      // Generate looped row without spread operators in inner loops for performance
      const loopedRow = new Array(originalRow.length * minRepetitions);
      for (let i = 0; i < minRepetitions; i++) {
        for(let j = 0; j < originalRow.length; j++) {
            loopedRow[i * originalRow.length + j] = originalRow[j];
        }
      }
      rows.push({ images: loopedRow, isOffset });
    }
    return rows;
  }, [stableGrid, gridConfig.rows, gridConfig.columns, mounted]);

  const mosaicWidth = tileWidthGap * gridConfig.columns * 2;
  const mosaicHeight = tileHeightGap * gridConfig.rows * 2;

  const titleStyle = {
    left: navbarCenterX || "50%",
    top: "calc(50% + 30px)",
    "--title-base-scale": config.titleScale,
  } as React.CSSProperties;

  return (
    <section id={id} className="scroll-section relative min-h-[110dvh] overflow-hidden">
      {/* ... (Background & Mosaic) ... */}

      <div className="absolute inset-0 flex items-center justify-center z-0">
        {/* ... (mounted check & marquee) ... */}
        {mounted && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 min-w-[100vw] min-h-[100dvh] overflow-hidden z-0 pointer-events-none flex items-center justify-center"
            style={
              {
                background: "linear-gradient(135deg, #9ca082 0%, #758162 100%)",
                width: `${mosaicWidth * 2}px`, // Reduced from 8
                height: `${mosaicHeight}px`,
                "--marquee-translate": `${
                  tileWidthGap * gridConfig.columns * 0.5
                }px`,
                "--tile-width-gap": `${tileWidthGap}px`,
                "--tile-height-gap": `${tileHeightGap}px`,
                "--grid-columns": gridConfig.columns,
                "--grid-rows": gridConfig.rows,
              } as React.CSSProperties
            }
          >
            <div className="gallery-marquee">
              {brickRows.map((row, idx) => (
                <div
                  key={idx}
                  className="flex"
                  style={{
                    gap: `${dynamicGap}px`,
                    marginBottom: `${dynamicGap}px`,
                    marginLeft: row.isOffset ? `${tileWidthGap / 2}px` : "0px",
                  }}
                >
                  {row.images.map((img: ImageItem, i: number) => (
                    <div
                      key={`${idx}-${i}`}
                      className="gallery-img-container"
                      style={{
                        width: 270 * config.tileScale,
                        height: 165 * config.tileScale,
                      }}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes={`${270 * config.tileScale}px`}
                        className="object-cover rounded-[3px] select-none"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="absolute inset-0 overflow-hidden z-[1] flex items-center justify-center">
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background:
                "linear-gradient(45deg, rgba(2, 3, 0, 0.95) 0%, rgba(5, 6, 2, 0.85) 40%, rgba(10, 12, 5, 0.6) 70%, rgba(15, 18, 8, 0.4) 100%)",
            }}
          />
        </div>

        <Image
          src="https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765660150/logo_label_title_fbiyxi.png"
          alt="Title"
          width={1500}
          height={500}
          quality={100}
          className={`white-title ${
            entranceFinished ? "entered" : showTitle ? "visible" : ""
          } ${interactionClass}`}
          style={{
            ...titleStyle,
            cursor: entranceFinished ? "pointer" : "default",
          }}
          onClick={handleTitleClick}
          onAnimationEnd={handleAnimationEnd}
          priority
        />
        
        {/* Secret Quote Interaction */}
        <div 
            className="absolute text-white text-center font-['Museo700'] z-10 pointer-events-none"
            style={{
                top: `calc(50% + 30px + ${180 * config.titleScale}px)`, // Increased offset to move down
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: `${24 * config.titleScale}px`,
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                // Linear Left-to-Right Reveal
                clipPath: showQuote ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
                transition: "clip-path 1.5s ease-out, opacity 1.5s ease-out",
                opacity: showQuote ? 1 : 0 
            }}
        >
          A legjobb dolog, ami veled történhet!
        </div>


      </div>
    </section>
  );
}
