"use client";

import React, { useRef, useEffect } from "react";

interface OutroSplashProps {
    onFinish: () => void;
}

export default function OutroSplash({ onFinish }: OutroSplashProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.onended = () => {
                onFinish();
            };
            // Fallback in case onended doesn't fire or video fails
            const timer = setTimeout(() => {
                onFinish();
            }, 5000); 

            return () => clearTimeout(timer);
        }
    }, [onFinish]);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
             <div className="absolute w-full h-full">
                <video
                    ref={videoRef}
                    // Original: https://res.cloudinary.com/dbg7yvrnj/video/upload/v1765251193/logo_animation_sekp3b.webm
                    src="https://res.cloudinary.com/dbg7yvrnj/video/upload/v1765251193/logo_animation_sekp3b.webm"
                    width="1920"
                    height="1080"
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    id="outro-video"
                />
            </div>
        </div>
    );
}
