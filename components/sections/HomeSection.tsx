"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
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
    gridColumns: 6,
    gridRows: 4,
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
  const prevHeight = useRef(-1);
  const { t, language } = useLanguage();

  useEffect(() => {
    setMounted(true);
    setNavbarCenterX(window.innerWidth / 2);

    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (width === prevWidth.current && height === prevHeight.current) return;
      
      prevWidth.current = width;
      prevHeight.current = height;
      setNavbarCenterX(width / 2);

      let tileScale: number;
      let titleScale: number;
      let gapSize: number;

      if (width < 640) {
        // Mobile: Ensure tiles don't get too tiny
        tileScale = Math.max(0.45, width / 700);
        titleScale = Math.max(0.7, width / 500);
        gapSize = 4;
      } else {
        // Desktop/Tablet: Proportional scaling based on 1440px width
        const scaleRatio = width / 1440;
        tileScale = Math.max(0.6, 1 * scaleRatio);
        titleScale = 1.25 * scaleRatio;
        gapSize = 8 * scaleRatio;
      }

      const currentTileWidth = 270 * tileScale + gapSize;
      const currentTileHeight = 165 * tileScale + gapSize;

      // Calculate necessary grid dimensions to cover the screen even when rotated (-12 deg)
      const theta = 12 * (Math.PI / 180);
      const neededWidth = width * Math.cos(theta) + height * Math.sin(theta);
      const neededHeight = width * Math.sin(theta) + height * Math.cos(theta);

      // The marquee logic uses gridColumns and gridRows as base units which are then doubled
      // To ensure no gaps during animation and rotation, we calculate the counts adaptive to size
      // We add a safety margin (+2) to handle marquee shifts and rotation corners
      const gridColumns = Math.max(4, Math.ceil(neededWidth / currentTileWidth) + 2);
      const gridRows = Math.max(3, Math.ceil(neededHeight / (currentTileHeight * 2)) + 1);

      setConfig({
        titleScale,
        gridColumns,
        gridRows,
        tileScale,
        gapSize,
      });
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

  const masterGrid = useMemo(() => {
    const rows = 30;
    const cols = 30;
    const grid: ImageItem[][] = [];
    
    // Create a pool that contains every image at least once, then shuffle it
    // We'll draw from this pool to ensure "minden csoportkép" (all photos) are used.
    let pool: ImageItem[] = [];
    const fillPool = () => {
        pool = [...IMAGES].sort(() => Math.random() - 0.5);
    };
    
    fillPool();

    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        let pickedIndex = -1;
        
        // Try to find an image from the pool that fits the "not same as left/top" rule
        for(let i = 0; i < pool.length; i++) {
            const img = pool[i];
            const leftSrc = c > 0 ? grid[r][c-1].src : null;
            const topSrc = r > 0 ? grid[r-1][c].src : null;
            
            // Strictly check for same image source
            if (img.src !== leftSrc && img.src !== topSrc) {
                pickedIndex = i;
                break;
            }
        }

        if (pickedIndex !== -1) {
            grid[r][c] = pool[pickedIndex];
            pool.splice(pickedIndex, 1);
        } else {
            // Fallback: This rarely happens with a large enough set, but if it does, 
            // just take the first one and sacrifice the rule for one tile to prevent crash
            grid[r][c] = pool[0];
            pool.splice(0, 1);
        }

        // Refill pool if empty to maintain "all images used" cycle
        if (pool.length === 0) fillPool();
      }
    }
    return grid;
  }, []);

  const createRandomizedGrid = useCallback(
    (rows: number, cols: number) => {
      const grid: (ImageItem | null)[][] = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(null));
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Pick from masterGrid instead of truly randomizing every time
          grid[row][col] = masterGrid[row % 30][col % 30];
        }
      }
      return grid;
    },
    [masterGrid]
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
    // Increased repetitions to ensure full coverage during movement
    const minRepetitions = 4; 

    for (let row = 0; row < totalRows; row++) {
      if (!stableGrid[row]) continue;

      const isOffset = row % 2 === 1;
      // CRITICAL: BOTH offset and regular rows must have the same number of images
      // to repeat at the exact same pixel interval for a perfect loop sync.
      const baseColumns = gridConfig.columns;
        
      const originalRow = stableGrid[row]
        .slice(0, baseColumns)
        .filter((img): img is ImageItem => img !== null);
        
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
                width: `${tileWidthGap * gridConfig.columns * 4}px`, 
                height: `${mosaicHeight}px`,
                "--marquee-translate": `${
                  tileWidthGap * gridConfig.columns
                }px`,
                "--tile-width-gap": `${tileWidthGap}px`,
                "--tile-height-gap": `${tileHeightGap}px`,
                "--grid-columns": gridConfig.columns,
                "--grid-rows": gridConfig.rows,
                "--total-width": `${tileWidthGap * gridConfig.columns * 4}px`,
              } as React.CSSProperties
            }
          >
            <div className="gallery-marquee" style={{ width: 'var(--total-width)' }}>
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
          quality={80}
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
                top: `calc(50% + 30px + ${130 * config.titleScale}px)`, // Decreased offset to move up
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
          {t[language].home.secretQuote}
        </div>


      </div>
    </section>
  );
}
