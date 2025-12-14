"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';

interface IntroSplashProps {
    onFinish: () => void;
}

export default function IntroSplash({ onFinish }: IntroSplashProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const finishedRef = useRef(false);

    const triggerFinish = useCallback(() => {
        if (finishedRef.current) return;
        finishedRef.current = true;
        const splash = overlayRef.current;
        if (splash) {
            splash.classList.add("opacity-0", "pointer-events-none");
            setTimeout(() => {
                onFinish && onFinish();
            }, 1000);
        } else {
            onFinish && onFinish();
        }
    }, [onFinish]);

    useEffect(() => {
        const timer = setTimeout(triggerFinish, 6000);

        const handleInput = (e: Event) => {
            e.preventDefault();
            triggerFinish();
        };

        window.addEventListener("keydown", handleInput, { passive: false });
        window.addEventListener("mousedown", handleInput, { passive: false });
        window.addEventListener("touchstart", handleInput, { passive: false });

        return () => {
            clearTimeout(timer);
            window.removeEventListener("keydown", handleInput);
            window.removeEventListener("mousedown", handleInput);
            window.removeEventListener("touchstart", handleInput);
        };
    }, [triggerFinish]);

    return (
        <div
            ref={overlayRef}
            tabIndex={-1}
            className="fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-1000 bg-black"
        >
             <div className="absolute w-full h-full">
                <video
                    src="https://res.cloudinary.com/dbg7yvrnj/video/upload/v1765251193/logo_animation_sekp3b.webm"
                    width="1920"
                    height="1080"
                    loop
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    id="intro-video"
                />
            </div>
        </div>
    );
}
