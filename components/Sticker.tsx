"use client";

import React, { useRef, useEffect, useState } from 'react';
// @ts-ignore
import StickerLib from './sticker-lib.js';

interface StickerProps {
    src: string;
    width: number;
    height: number;
    className?: string;
    alt?: string;
}

export default function Sticker({ src, width, height, className = '', alt = 'Sticker' }: StickerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const stickerContainerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [mirroredSrc, setMirroredSrc] = useState<string | null>(null);
    const stickerInstanceRef = useRef<any>(null);
    const isInitializedRef = useRef(false);

    const appearanceProgress = Math.min(progress / 0.4, 1); 
    const peelProgress = Math.max((progress - 0.4) / 0.6, 0);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(img, 0, 0);
                setMirroredSrc(canvas.toDataURL());
            }
        };
    }, [src]);

    useEffect(() => {
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
            
            setProgress(newProgress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const stickerContainer = stickerContainerRef.current;
        if (!stickerContainer || isInitializedRef.current) return;

        const oldStyle = document.getElementById('sticker-mirror-style');
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
                    div.style.backgroundImage = `url(${src})`;
                    div.style.backgroundSize = 'contain';
                    div.style.backgroundPosition = 'center';
                    div.style.backgroundRepeat = 'no-repeat';
                });
                 const maskedElements = stickerContainer.querySelectorAll('.sticker-img, .sticker-shadow, .sticker-back-wrapper');
                maskedElements.forEach((el) => {
                    const div = el as HTMLDivElement;
                    div.style.webkitMaskImage = `url(${src})`;
                    div.style.maskImage = `url(${src})`;
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
    }, [src, width, height]);

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
                />
            </div>
        </div>
    );
}
