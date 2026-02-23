"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from 'next/image';

export interface Video {
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

export interface VideoCardProps {
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
  const [isVideoReady, setIsVideoReady] = useState(false);

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
      // Reduced from 1200px to 250px to prevent mass-download logic halting the main thread and wasting network queues
      { rootMargin: '250px', threshold: 0.1 } 
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  // Guarantee eager fetching if interacted with regardless of intersection state
  useEffect(() => {
    if (isHovered || isFocused) {
      setShouldLoad(true);
    }
  }, [isHovered, isFocused]);

  useEffect(() => {
    const videoEl = videoRef.current;
    
    if (videoEl && shouldLoad) {
      if (isHovered) {
        videoEl.muted = false; // Unmute on hover
        videoEl.volume = 0.75; // Normalize volume to 75%
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
        
        // Safety timeout to ensure it plays (sometimes browsers block unmuted autoplay if interaction isn't clear)
        // But since it's on hover, it should be fine.
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
          transition-opacity duration-300 ease-in
          ${(isHovered || isFocused) ? 'grayscale-0 brightness-100 contrast-100' : 'grayscale brightness-150 contrast-100 sepia-[0.05]'}
        `}
        // Keep the image visible until video buffer starts playing to prevent a black gap
        style={{ opacity: (isHovered && hasHoverContent && isVideoReady) ? 0 : 1 }}
      >
        {video.thumbnailImage && (
          <Image 
            src={video.thumbnailImage}
            alt={video.title || 'Camp thumbnail'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            muted={!isHovered} // Ensure it starts muted
            preload={(isHovered || isFocused) ? "auto" : "metadata"} // Eagerly load full video if hovered or focused, otherwise just metadata to save bandwidth
            onCanPlay={() => setIsVideoReady(true)}
            onLoadedData={() => setIsVideoReady(true)}
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

export default VideoCard;
