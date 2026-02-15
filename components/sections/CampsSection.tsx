"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Image from 'next/image';
import { useLanguage } from "@/context/LanguageContext";

const CARD_DEFAULTS = {
  width: '100px',
  activeWidth: '200px',
  height: '90%',
  objectPosition: 'center center',
};

const CAMP_VIDEOS = [
  { 
    id: 1,
    topOffset: '-100px',
    sticker: 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765660150/logo_label_2025_ALUMNI_efccs7.png',
    thumbnailImage: "https://res.cloudinary.com/dbg7yvrnj/image/upload/block_1_elbp7f.webp",
  },
  { 
    id: 2,
    topOffset: '-60px',
    videoSrc: "https://res.cloudinary.com/dbg7yvrnj/video/upload/2025_kf2ez8.mp4",
    sticker: 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765660150/logo_label_2025_xyrjya.png',
    thumbnailImage: "https://res.cloudinary.com/dbg7yvrnj/image/upload/block_2_j0xhzu.webp",
  },
  {
    id: 3,
    topOffset: '-20px',
    videoSrc: "https://res.cloudinary.com/dbg7yvrnj/video/upload/2024_joj90u.mp4",
    sticker: 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765660150/logo_label_2024_rblhkd.png',
    thumbnailImage: "https://res.cloudinary.com/dbg7yvrnj/image/upload/block_3_otrmui.webp",
  },
  { 
    id: 4,
    topOffset: '-60px',
    videoSrc: "https://res.cloudinary.com/dbg7yvrnj/video/upload/2023_xn1f7o.mp4",
    sticker: 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765660150/logo_label_2023_bunfgp.png',
    thumbnailImage: "https://res.cloudinary.com/dbg7yvrnj/image/upload/block_4_n7qkzx.webp",
  },
  { 
    id: 5,
    topOffset: '-100px',
    videoSrc: "https://res.cloudinary.com/dbg7yvrnj/video/upload/2022_i3v1or.mp4",
    sticker: 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765660150/logo_label_2022_etgoqe.png',
    thumbnailImage: "https://res.cloudinary.com/dbg7yvrnj/image/upload/block_5_u3qkbu.webp",
  },
  { 
    id: 6,
    topOffset: '-20px',
    videoSrc: "https://res.cloudinary.com/dbg7yvrnj/video/upload/2021_sly2ss.mp4",
    sticker: 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1765660150/logo_label_2021_nrf7zu.png',
    thumbnailImage: "https://res.cloudinary.com/dbg7yvrnj/image/upload/block_6_qicdbb.webp",
  },
  { 
    id: 7,
    topOffset: '-60px',
    videoSrc: "https://res.cloudinary.com/dbg7yvrnj/video/upload/2019_vv3agi.mp4",
    sticker: 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1771182797/19logo_m4gxnp.png',
    thumbnailImage: "https://res.cloudinary.com/dbg7yvrnj/image/upload/block_7_f1yprh.webp",
  },
  { 
    id: 8,
    topOffset: '-100px',
    videoSrc: "https://res.cloudinary.com/dbg7yvrnj/video/upload/2018_paucov.mp4",
    sticker: 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1771182797/18logo_slnlyl.png',
    thumbnailImage: "https://res.cloudinary.com/dbg7yvrnj/image/upload/block_8_zun3pn.webp",
  },
  {
    id: 9,
    topOffset: '-20px',
    videoSrc: "https://res.cloudinary.com/dbg7yvrnj/video/upload/2017_t61yua.mp4",
    sticker: 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1771182797/17logo_rsdqxn.png',
    thumbnailImage: "https://res.cloudinary.com/dbg7yvrnj/image/upload/block_9_hyjs4d.webp",
  },
  {
    id: 10,
    topOffset: '-60px',
    sticker: 'https://res.cloudinary.com/dbg7yvrnj/image/upload/v1771182797/16logo_fxzfx3.png',
    thumbnailImage: "https://res.cloudinary.com/dbg7yvrnj/image/upload/block_10_dkvwsa.webp",
  },
];

interface Video {
  id: number;
  videoSrc?: string;
  width: string;
  activeWidth: string;
  topOffset: string;
  height: string;
  objectPosition: string;
  sticker?: string;
  thumbnailImage?: string;
  hoverImage?: string;
  title?: string;
  webmSrc?: string;
}

interface VideoCardProps {
  video: Video;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  isLoading?: boolean;
  isFocused?: boolean;
}

const VideoCard = ({ video, isHovered, onHover, onLeave, isFocused = true }: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px', threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    
    if (videoEl && shouldLoad) {
      if (isHovered) {
        videoEl.muted = false;
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        videoEl.muted = true;
        videoEl.pause();
      }
    }
  }, [isHovered, shouldLoad]);

  const hasHoverContent = !!(video.hoverImage || video.videoSrc);

  return (
    <div 
      ref={containerRef}
      className={`
        relative cursor-pointer overflow-hidden shadow-lg
        transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
        will-change-[flex,max-width] transform-gpu
        ${isHovered ? 'z-10 shadow-2xl' : ''}
      `}
      style={{
        width: isHovered ? video.activeWidth : video.width,
        flex: isHovered ? 2 : 1,
        transform: `translateY(${video.topOffset || '0px'})`,
        minHeight: video.height || '100%',
        height: 'auto',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div 
        className={`
          w-full h-full absolute top-0 left-0 z-[2]
          transition-all duration-500 ease-out
          ${(isHovered || isFocused) ? 'grayscale-0 brightness-100 contrast-100' : 'grayscale brightness-150 contrast-100 sepia-[0.05]'}
        `}
        style={{ opacity: (isHovered && hasHoverContent) ? 0 : 1 }}
      >
        {video.thumbnailImage && (
          <Image 
            src={video.thumbnailImage}
            alt={video.title || 'Camp thumbnail'}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : ''}`}
            style={{
              objectPosition: video.objectPosition || 'center center',
            }}
          />
        )}
      </div>

      <div 
        className="w-full h-full absolute top-0 left-0 z-[1] transition-opacity duration-400"
        style={{ opacity: (isHovered && hasHoverContent) ? 1 : 0 }}
      >
        {shouldLoad && video.videoSrc && (
          <video 
            ref={videoRef}
            loop
            playsInline
            muted={!isHovered}
            preload="auto" 
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : ''}`}
            style={{ objectPosition: video.objectPosition || 'center center' }}
          >
            {video.webmSrc && <source src={video.webmSrc} type="video/webm" />}
            {video.videoSrc && <source src={video.videoSrc} type="video/mp4" />}
          </video>
        )}
      </div>

      <div 
        className="absolute top-0 left-0 w-full py-4 px-2 text-center text-white z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}
      >
        <h3 className="m-0 text-sm font-semibold font-['Museo700'] whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-lg">
          {video.title}
        </h3>
      </div>
      
      {video.sticker && (
        <Image 
          src={video.sticker} 
          alt="Sticker" 
          width={75}
          height={75}
          className={`
            absolute bottom-2 left-1/2 -translate-x-1/2 w-[75px] h-auto
            z-[100] pointer-events-none transition-opacity duration-400
            ${isHovered ? 'opacity-0' : 'opacity-100'}
          `}
        />
      )}
    </div>
  );
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
    
    const [config, setConfig] = useState<CampsLayoutConfig>({
        width: '100px',
        activeWidth: '200px',
        height: '90%',
        isPortrait: false,
        gap: '24px',
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
            } else if (width < 1024) {
                newConfig = {
                    width: '90px',
                    activeWidth: '180px',
                    height: '85%',
                    isPortrait: false,
                    gap: '16px',
                };
            } else if (width < 1600) {
                newConfig = {
                    width: '100px',
                    activeWidth: '200px',
                    height: '90%',
                    isPortrait: false,
                    gap: '24px',
                };
            } else {
                newConfig = {
                    width: '120px',
                    activeWidth: '280px',
                    height: '90%',
                    isPortrait: false,
                    gap: '32px',
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
            <div className="min-h-screen w-full flex items-center pt-20 px-0 pb-10 relative z-10">
                {config.isPortrait ? (
                    <div 
                        ref={scrollContainerRef}
                        className="flex flex-nowrap items-center w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide !scroll-smooth"
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
                        className="flex flex-nowrap items-end justify-center h-[80vh] max-w-full overflow-visible pb-4 mx-auto"
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
        </section>
    );
}
