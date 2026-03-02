"use client";

import React, { useRef, useEffect, useState, useId } from 'react';
// @ts-ignore
import StickerLib from './sticker-lib.js';

interface StickerProps {
    src: string;
    width: number;
    height: number;
    className?: string;
    alt?: string;
    externalProgress?: number;
    rotation?: number;
}

export default function Sticker({ src, width, height, className = '', alt = 'Sticker', externalProgress, rotation = 0 }: StickerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const stickerContainerRef = useRef<HTMLDivElement>(null);
    const [internalProgress, setInternalProgress] = useState(0);
    const [processedSrc, setProcessedSrc] = useState<string | null>(null);
    const stickerInstanceRef = useRef<any>(null);
    const isInitializedRef = useRef(false);
    const instanceId = useId();

    const progress = externalProgress !== undefined ? externalProgress : internalProgress;
    const appearanceProgress = Math.min(progress / 0.4, 1); 
    const peelProgress = Math.max((progress - 0.4) / 0.6, 0);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            
            // Calculate size needed for the rotated bounding box to ensure no clipping
            const rad = rotation * Math.PI / 180;
            const w = Math.abs(img.width * Math.cos(rad)) + Math.abs(img.height * Math.sin(rad));
            const h = Math.abs(img.width * Math.sin(rad)) + Math.abs(img.height * Math.cos(rad));
            
            canvas.width = w;
            canvas.height = h;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Move origin to center
                ctx.translate(w / 2, h / 2);
                // First apply the mirror transform that the original Sticker component used
                ctx.scale(-1, 1);
                // Then apply the rotation requested by HolographicCard
                ctx.rotate(rad);
                
                // Draw the image centered
                ctx.drawImage(img, -img.width / 2, -img.height / 2);
                
                setProcessedSrc(canvas.toDataURL('image/png'));
            }
        };
    }, [src, rotation]);

    useEffect(() => {
        if (externalProgress !== undefined) return;
        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            const startY = viewportHeight * 0.85;
            const endY = viewportHeight * 0.20;
            const currentY = rect.top;
            
            let newProgress = (startY - currentY) / (startY - endY);
            if (newProgress < 0) newProgress = 0;
            if (newProgress > 1) newProgress = 1;
            
            setInternalProgress(newProgress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [externalProgress]);

    useEffect(() => {
        const stickerContainer = stickerContainerRef.current;
        if (!stickerContainer || !processedSrc || isInitializedRef.current) return;

        const styleId = `sticker-mirror-style-${instanceId.replace(/:/g, '')}`;
        const oldStyle = document.getElementById(styleId);
        if (oldStyle) oldStyle.remove();

        const timer = setTimeout(() => {
            if (!stickerContainerRef.current) return;
            
            try {
                stickerContainer.innerHTML = '';
                stickerContainer.style.width = `${width}px`;
                stickerContainer.style.height = `${height}px`;

                stickerInstanceRef.current = StickerLib.init(stickerContainer, { manual: true });

                const els = stickerContainer.querySelectorAll('.sticker-img');
                els.forEach((el) => {
                    const div = el as HTMLDivElement;
                    div.style.backgroundImage = `url(${processedSrc})`;
                    div.style.backgroundSize = 'contain';
                    div.style.backgroundPosition = 'center';
                    div.style.backgroundRepeat = 'no-repeat';
                });
                 const maskedElements = stickerContainer.querySelectorAll('.sticker-img, .sticker-shadow, .sticker-back-wrapper');
                maskedElements.forEach((el) => {
                    const div = el as HTMLDivElement;
                    div.style.webkitMaskImage = `url(${processedSrc})`;
                    div.style.maskImage = `url(${processedSrc})`;
                    div.style.webkitMaskSize = 'contain';
                    div.style.maskSize = 'contain';
                    div.style.webkitMaskRepeat = 'no-repeat';
                    div.style.maskRepeat = 'no-repeat';
                    div.style.webkitMaskPosition = 'center';
                    div.style.maskPosition = 'center';
                });
                
                isInitializedRef.current = true;

                const rect = stickerContainer.getBoundingClientRect();
                const startX = rect.left + window.scrollX - rect.width * 0.3;
                const startY = rect.top + window.scrollY + rect.height * 0.5;
                stickerInstanceRef.current.activate(startX, startY);
                stickerInstanceRef.current.move(startX, startY);

            } catch (error) {
                console.error("Sticker init error:", error);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [processedSrc, width, height, instanceId]);

    useEffect(() => {
        const stickerContainer = stickerContainerRef.current;
        const stickerInstance = stickerInstanceRef.current;
        
        if (!stickerContainer || !stickerInstance || !isInitializedRef.current) return;

        const rect = stickerContainer.getBoundingClientRect();
        const absLeft = rect.left + window.scrollX;
        const absTop = rect.top + window.scrollY;

        const centerY = height * 0.5;
        const startRelX = width * 1.3;
        const endRelX = -width * 0.3;
        
        const currentRelX = startRelX + (endRelX - startRelX) * peelProgress;
        stickerInstance.move(absLeft + currentRelX, absTop + centerY);
    }, [peelProgress, width, height]);

    const opacity = appearanceProgress;
    const translateY = -80 * (1 - appearanceProgress);
    const translateZ = 150 * (1 - appearanceProgress);
    const scale = 1 + 0.2 * (1 - appearanceProgress);
    const rotateX = 30 * (1 - appearanceProgress);

    return (
        <div 
            ref={containerRef}
            className={`relative ${className}`}
            style={{ 
                width, 
                height,
                perspective: '1000px',
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    opacity,
                    transform: `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`,
                    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                    transformStyle: 'preserve-3d',
                }}
            >
                <div 
                    ref={stickerContainerRef}
                    style={{ 
                        width, 
                        height,
                        transform: 'scaleX(-1)'
                    }}
                    aria-label={alt}
                    role="img"
                />
            </div>
        </div>
    );
}
