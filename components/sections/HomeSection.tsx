"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Image from "next/image";

interface ImageItem {
  src: string;
  alt: string;
}

const IMAGES: ImageItem[] = [
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661047/19_af7zcz.jpg",
    alt: "Group photo 19",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661048/2014_yio2fx.jpg",
    alt: "Group photo 2014",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661048/2015_t14rxc.jpg",
    alt: "Group photo 2015",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661048/2015.g_ikfs2w.jpg",
    alt: "Group photo 2015 G",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661051/2016_crosga.jpg",
    alt: "Group photo 2016",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661051/2016.g_rkf8yh.jpg",
    alt: "Group photo 2016 G",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661052/2017_st5hwj.jpg",
    alt: "Group photo 2017",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661052/2017.g_e9osii.jpg",
    alt: "Group photo 2017 G",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661052/2017.m_l1agy0.jpg",
    alt: "Group photo 2017 M",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661052/2018_g3tqsu.jpg",
    alt: "Group photo 2018",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661052/2018.g_hrdf8x.jpg",
    alt: "Group photo 2018 G",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661057/2018.m_rq9ipw.jpg",
    alt: "Group photo 2018 M",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661057/2019_amdirp.jpg",
    alt: "Group photo 2019",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661057/2019.g_vjhtnm.jpg",
    alt: "Group photo 2019 G",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661058/2021_jlutqe.jpg",
    alt: "Group photo 2021",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661057/2021.g_aptjtz.jpg",
    alt: "Group photo 2021 G",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661058/2022_eshc8e.jpg",
    alt: "Group photo 2022",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661058/2022.g_cx2dyr.jpg",
    alt: "Group photo 2022 G",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661058/2023_rkhj6d.jpg",
    alt: "Group photo 2023",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661058/2023.g_p0vuqd.jpg",
    alt: "Group photo 2023 G",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661071/2024_emmp5c.jpg",
    alt: "Group photo 2024",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661070/2024.g_ddxyyr.jpg",
    alt: "Group photo 2024 G",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661071/2025_t2c2at.jpg",
    alt: "Group photo 2025",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661071/2025.g_z8fmle.jpg",
    alt: "Group photo 2025 G",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661071/2025_ALUMNI_iog8rh.jpg",
    alt: "Group photo 2025 ALUMNI",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661070/2025_ALUMNI.g_gksvbz.jpg",
    alt: "Group photo 2025 ALUMNI G",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661047/22_csn8cs.jpg",
    alt: "Group photo 22",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661048/23_bn6v6x.jpg",
    alt: "Group photo 23",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661047/24_wkn0qh.jpg",
    alt: "Group photo 24",
  },
  {
    src: "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765661048/25_e2asbt.jpg",
    alt: "Group photo 25",
  },
];

const PIXEL_IMAGES = [
  "betty_pixel.png",
  "gabor_pixel.png",
  "krisztike_pixel.png",
  "zoli_pixel.png",
];

type HomeLayoutConfig = {
  titleScale: number;
  pixelArtSize: number;
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
    pixelArtSize: 600,
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
  const [showDialogue, setShowDialogue] = useState(false);
  const [currentPixelImage, setCurrentPixelImage] = useState(PIXEL_IMAGES[2]);
  const [interactionClass, setInteractionClass] = useState("");
  const [entranceFinished, setEntranceFinished] = useState(false);
  const [navbarCenterX, setNavbarCenterX] = useState(0);
  const [mounted, setMounted] = useState(false);
  const dialogueTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dynamicGap = config.gapSize;
  const tileWidthGap = 270 * config.tileScale + dynamicGap;
  const tileHeightGap = 165 * config.tileScale + dynamicGap;

  const prevWidth = useRef(-1);

  useEffect(() => {
    setMounted(true);
    setNavbarCenterX(window.innerWidth / 2);

    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width === prevWidth.current) return;
      
      prevWidth.current = width;
      setNavbarCenterX(width / 2);

      let newConfig: HomeLayoutConfig;

      if (width < 640) {
        newConfig = {
          titleScale: 0.8,
          pixelArtSize: 300,
          gridColumns: 4,
          gridRows: 5,
          tileScale: 0.6,
          gapSize: 4,
        };
      } else if (width < 1024) {
        newConfig = {
          titleScale: 1.0,
          pixelArtSize: 450,
          gridColumns: 6,
          gridRows: 6,
          tileScale: 0.8,
          gapSize: 6,
        };
      } else if (width < 1600) {
        newConfig = {
          titleScale: 1.25,
          pixelArtSize: 600,
          gridColumns: 8,
          gridRows: 6,
          tileScale: 1,
          gapSize: 8,
        };
      } else {
        const scaleRatio = width / 1440;
        newConfig = {
          titleScale: 1.25 * scaleRatio,
          pixelArtSize: 600 * scaleRatio,
          gridColumns: 8,
          gridRows: 6,
          tileScale: scaleRatio,
          gapSize: 8 * scaleRatio,
        };
      }
      setConfig(newConfig);
    };

    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    },
    [isValidPlacement]
  );

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

  const brickRows = useMemo(() => {
    if (!mounted) return [];

    const totalRows = gridConfig.rows * 2;
    const imageGrid = createRandomizedGrid(totalRows, gridConfig.columns);
    const rows = [];
    const screenWidth = window.innerWidth;

    const minRepetitions =
      Math.ceil(screenWidth / (tileWidthGap * gridConfig.columns)) + 2;

    for (let row = 0; row < totalRows; row++) {
      const isOffset = row % 2 === 1;
      const baseColumns = isOffset
        ? gridConfig.columns - 1
        : gridConfig.columns;
      const originalRow = imageGrid[row]
        .slice(0, baseColumns)
        .filter((img): img is ImageItem => img !== null);
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
    left: navbarCenterX || "50%",
    top: "calc(50% + 30px)",
    "--title-base-scale": config.titleScale,
  } as React.CSSProperties;

  return (
    <section id={id} className="scroll-section relative min-h-[100dvh] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center z-0">
        {mounted && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 min-w-[100vw] min-h-[100dvh] overflow-hidden z-0 pointer-events-none flex items-center justify-center bg-[#9ca082]"
            style={
              {
                width: `${mosaicWidth * 8}px`,
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

        <div
          className={`pixel-art-krisztike ${showDialogue ? "visible" : ""}`}
          style={{ width: config.pixelArtSize, height: config.pixelArtSize }}
        >
          <Image
            src={`/images/heroes/hero_pixels/${currentPixelImage}`}
            alt="Pixel Art Character"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
