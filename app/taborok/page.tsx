"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const CAMP_VIDEOS = [
  { 
    id: 1,
    width: '100px',
    activeWidth: '200px',
    topOffset: '-100px',
    height: '90%',
    objectPosition: 'center center',
    sticker: '/images/logos/logo_label_2025_ALUMNI.png',
    thumbnailImage: "/images/blocks/block_1.webp",
    thumbnailWidth: '100%'
  },
  { 
    id: 2,
    videoSrc: "/video/2025.mp4",
    webmSrc: "/video/2025.webm",
    width: '100px',
    activeWidth: '200px',
    topOffset: '-60px',
    height: '90%',
    objectPosition: 'center center',
    thumbnailWidth: '130%',
    sticker: '/images/logos/logo_label_2025.png',
    thumbnailImage: "/images/blocks/block_2.webp",
    startTime: 42,
    duration: 15
  },
  {
    id: 3,
    videoSrc: "/video/2024.mp4",
    webmSrc: "/video/2024.webm",
    width: '100px',
    activeWidth: '200px',
    topOffset: '-20px',
    height: '90%',
    objectPosition: 'center center',
    thumbnailWidth: '220%',
    sticker: '/images/logos/logo_label_2024.png',
    thumbnailImage: "/images/blocks/block_3.webp",
    startTime: 11,
    duration: 15
  },
  { 
    id: 4,
    videoSrc: "/video/2023.mp4",
    webmSrc: "/video/2023.webm",
    width: '100px',
    activeWidth: '200px',
    topOffset: '-60px',
    height: '90%',
    objectPosition: 'center center',
    thumbnailWidth: '280%',
    sticker: '/images/logos/logo_label_2023.png',
    thumbnailImage: "/images/blocks/block_4.webp",
    startTime: 30,
    duration: 15
  },
  { 
    id: 5,
    videoSrc: "/video/2022.mp4",
    webmSrc: "/video/2022.webm",
    width: '100px',
    activeWidth: '200px',
    topOffset: '-100px',
    height: '90%',
    objectPosition: 'center center',
    thumbnailWidth: '250%',
    sticker: '/images/logos/logo_label_2022.png',
    thumbnailImage: "/images/blocks/block_5.webp",
    startTime: 77,
    duration: 15
  },
  { 
    id: 6,
    videoSrc: "/video/2021.mp4",
    webmSrc: "/video/2021.webm",
    width: '100px',
    activeWidth: '200px',
    topOffset: '-20px',
    height: '90%',
    objectPosition: 'center center',
    thumbnailWidth: '375%',
    sticker: '/images/logos/logo_label_2021.png',
    thumbnailImage: "/images/blocks/block_6.webp",
    startTime: 126,
    duration: 15
  },
  { 
    id: 7,
    videoSrc: "/video/2019.mp4",
    webmSrc: "/video/2019.webm",
    width: '100px',
    activeWidth: '200px',
    topOffset: '-60px',
    height: '90%',
    objectPosition: 'center center',
    thumbnailWidth: '420%',
    sticker: '/images/logos/logo_label_2025.png',
    thumbnailImage: "/images/blocks/block_7.webp",
    startTime: 51,
    duration: 15
  },
  { 
    id: 8,
    videoSrc: "/video/2018.mp4",
    webmSrc: "/video/2018.webm",
    width: '100px',
    activeWidth: '200px',
    topOffset: '-100px',
    height: '90%',
    objectPosition: 'center center',
    sticker: '/images/logos/logo_label_2025.png',
    thumbnailImage: "/images/blocks/block_8.webp",
    thumbnailWidth: '200%',
    startTime: 194,
    duration: 15
  },
  {
    id: 9,
    videoSrc: "/video/2017.mp4",
    webmSrc: "/video/2017.webm",
    width: '100px',
    activeWidth: '200px',
    topOffset: '-20px',
    height: '90%',
    objectPosition: 'center center',
    sticker: '/images/logos/logo_label_2025.png',
    thumbnailImage: "/images/blocks/block_9.webp",
    thumbnailWidth: '200%',
    startTime: 40,
    duration: 15
  },
  {
    id: 10,
    width: '100px',
    activeWidth: '200px',
    topOffset: '-60px',
    height: '90%',
    objectPosition: 'center center',
    sticker: '/images/logos/logo_label_2025.png',
    thumbnailImage: "/images/blocks/block_10.webp",
    thumbnailWidth: '170%',
    startTime: 194,
    duration: 15
  },
];

interface Video {
  id: number;
  videoSrc?: string;
  webmSrc?: string;
  width: string;
  activeWidth: string;
  topOffset: string;
  height: string;
  objectPosition: string;
  sticker?: string;
  thumbnailImage?: string;
  thumbnailWidth?: string;
  startTime?: number;
  duration?: number;
  thumbnailTime?: number;
  hoverImage?: string;
  hoverObjectFit?: string;
  title?: string;
}

interface VideoCardProps {
  video: Video;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const VideoCard = ({ video, isHovered, onHover, onLeave }: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);
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
    if (videoRef.current && video.thumbnailTime !== undefined && shouldLoad) {
      const handleLoaded = () => {
        if (!isHovered && videoRef.current) {
          videoRef.current.currentTime = video.thumbnailTime!;
        }
      };
      videoRef.current.addEventListener('loadedmetadata', handleLoaded);
      return () => {
        videoRef.current?.removeEventListener('loadedmetadata', handleLoaded);
      };
    }
  }, [video.thumbnailTime, isHovered, shouldLoad]);

  useEffect(() => {
    const videoEl = videoRef.current;
    
    if (videoEl && shouldLoad) {
      if (isHovered) {
        const startTime = video.startTime || 0;
        const duration = video.duration || videoEl.duration;
        const endTime = startTime + duration;
        
        videoEl.muted = false;
        if (Math.abs(videoEl.currentTime - startTime) > 0.5 && Math.abs(videoEl.currentTime - endTime) > 0.5) {
          videoEl.currentTime = startTime;
        }
        
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
        
        loopIntervalRef.current = setInterval(() => {
          if (videoEl && videoEl.currentTime >= endTime) {
            videoEl.currentTime = startTime;
          }
        }, 100);
      } else {
        if (loopIntervalRef.current) {
          clearInterval(loopIntervalRef.current);
        }
        videoEl.muted = true;
        videoEl.pause();
        if (video.thumbnailTime !== undefined) {
          videoEl.currentTime = video.thumbnailTime;
        }
      }
    }
    
    return () => {
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
      }
    };
  }, [isHovered, video.startTime, video.duration, video.thumbnailTime, shouldLoad]);

  const hasHoverContent = !!(video.hoverImage || video.videoSrc);

  return (
    <div 
      ref={containerRef}
      className={`
        flex-1 relative cursor-pointer overflow-hidden shadow-lg
        transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
        will-change-[flex,max-width] transform-gpu
        ${isHovered ? 'z-10 shadow-2xl' : ''}
      `}
      style={{
        maxWidth: isHovered ? video.activeWidth : video.width,
        flex: isHovered ? 2 : 1,
        marginTop: video.topOffset || '0px',
        height: video.height || '100%',
        alignSelf: 'flex-start',
        minWidth: '80px',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Thumbnail wrapper */}
      <div 
        className={`
          w-full h-full absolute top-0 left-0 z-[2]
          transition-all duration-500 ease-out
          ${isHovered ? 'grayscale-0 brightness-100 contrast-100' : 'grayscale brightness-150 contrast-100 sepia-[0.05]'}
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

      {/* Video wrapper */}
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

      {/* Video info */}
      <div 
        className="absolute top-0 left-0 w-full py-4 px-2 text-center text-white z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}
      >
        <h3 className="m-0 text-sm font-semibold font-['Museo700'] whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-lg">
          {video.title}
        </h3>
      </div>
      
      {/* Sticker */}
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

export default function CampsPage() {
  const [hoveredVideoId, setHoveredVideoId] = useState<number | null>(null);

  return (
    <div className="min-h-screen relative z-[1]">
      <LanguageSwitcher />
      <Navbar />
      <div className="w-full min-h-screen pt-[140px] px-[5%] pb-20 box-border overflow-x-hidden">
        <div className="text-center mb-16" />
        <div 
          className="flex flex-nowrap justify-center items-center max-w-[1400px] mx-auto h-[60vh] min-h-[400px]"
          style={{ gap: '25px' }}
        >
          {CAMP_VIDEOS.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              isHovered={hoveredVideoId === video.id}
              onHover={() => setHoveredVideoId(video.id)}
              onLeave={() => setHoveredVideoId(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
