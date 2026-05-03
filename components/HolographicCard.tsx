"use client";

import React, { useRef, useState, useEffect, MouseEvent } from 'react';
import './HolographicCard.css';
import Sticker from './Sticker';

const STICKER_CONFIGS = [
    { left: 35, top: 10, rotation: -24 },
    { left: 75, top: 55, rotation: 22 },
    { left: 45, top: 45, rotation: -18 },
    { left: 85, top: 35, rotation: 25 },
    { left: 15, top: 35, rotation: -16 },
    { left: 60, top: 15, rotation: 45 },
    { left: 80, top: 5, rotation: -20 },
];

const STICKER_SCALE = 1.5;
const STICKER_LEFT = 2;
const STICKER_TOP = 18;
const CARD_REF_WIDTH = 600;

const STICKER_IMAGES = [
    "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1773344427/szinkron_sponsor_fegr3j.webp",
    "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1773345895/community_yz0hnv.webp",
    "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1773345899/figura_zlbyum.webp",
    "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1773345924/monokultura_zhddu7.webp",
    "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1773345929/pension_zihxqx.webp",
    "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1773346117/universal_ms37yw.webp",
    "https://res.cloudinary.com/dbg7yvrnj/image/upload/v1773346607/communitas_uraio2.webp",
];

interface HolographicCardProps {
    imgSrc: string;
    className?: string;
    stickerProgresses?: number[];
    stickerLinks?: string[];
}

export default function HolographicCard({
    imgSrc,
    className = '',
    stickerProgresses = [0, 0, 0, 0, 0, 0, 0],
    stickerLinks = [],
}: HolographicCardProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [cardScale, setCardScale] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const w = entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
                setCardScale((w / CARD_REF_WIDTH) * STICKER_SCALE);
            }
        });
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        setIsHovering(true);

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const w = rect.width;
        const h = rect.height;

        const rx = -( (y / h) - 0.5 ) * 30;
        const ry = ( (x / w) - 0.5 ) * 30;

        const card = cardRef.current;
        card.style.setProperty('--mx', `${(x / w) * 100}%`);
        card.style.setProperty('--my', `${(y / h) * 100}%`);
        card.style.setProperty('--rx', `${rx}deg`);
        card.style.setProperty('--ry', `${ry}deg`);
        card.style.setProperty('--o', '1');
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        if (!cardRef.current) return;
        const card = cardRef.current;
        card.style.setProperty('--rx', `0deg`);
        card.style.setProperty('--ry', `0deg`);
        card.style.setProperty('--o', '0');
    };

    return (
        <div
            ref={containerRef}
            className={`card-container ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div 
                ref={cardRef} 
                className={`holo-card ${!isHovering ? 'animated' : ''}`}
            >
                <div 
                    className="holo-card-bg" 
                    style={{ backgroundImage: `url(${imgSrc})` }} 
                />

                <div className="holo-card-content">
                    <div className="card-top">
                        <div className="chip">
                            <svg viewBox="0 0 90 45" width="100%" height="100%">
                                <defs>
                                    <linearGradient id="silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#e0e0e0" />
                                        <stop offset="50%" stopColor="#d0d0d0" />
                                        <stop offset="100%" stopColor="#b0b0b0" />
                                    </linearGradient>
                                </defs>
                                <rect width="60" height="45" rx="8" fill="url(#silver-grad)" />
                                <g fill="none" stroke="#666" strokeWidth="0.5">
                                    <rect x="22" y="15" width="16" height="15" rx="2" strokeWidth="0.8" />
                                    <path d="M0 14 H22" />
                                    <path d="M38 14 H60" />
                                    <path d="M0 31 H22" />
                                    <path d="M38 31 H60" />
                                    <path d="M22 15 L10 5" />
                                    <path d="M38 15 L50 5" />
                                    <path d="M22 30 L10 40" />
                                    <path d="M38 30 L50 40" />
                                    <path d="M30 0 V15" />
                                    <path d="M30 30 V45" />
                                </g>
                                <g fill="none" stroke="#ccc" strokeWidth="3" strokeLinecap="round" transform="translate(70, 22)">
                                    <path d="M0 0" />
                                    <path d="M-5 6 Q 0 0 -5 -6" strokeOpacity="0.6" />
                                    <path d="M0 10 Q 8 0 0 -10" strokeOpacity="0.8" />
                                    <path d="M6 14 Q 16 0 6 -14" strokeOpacity="1" />
                                </g>
                            </svg>
                        </div>
                    </div>
                    
                    <div className="card-bottom">
                        <div className="card-info">
                            <span className="card-label">Szín-kron csoport</span>
                            <span className="card-holder">Monokultúra Egyesület</span>
                        </div>
                        <div className="card-expiry">
                            <div className="card-expiry-change">
                                <span className="card-label">VALID</span>
                                <span className="card-label">THRU</span>
                            </div>
                            <span className="card-expiry-value">07/26</span>
                        </div>
                    </div>
                </div>

                {STICKER_CONFIGS.map((config, index) => {
                    const href = stickerLinks[index];
                    const isClickable = Boolean(href);
                    const imageSrc = STICKER_IMAGES[index % STICKER_IMAGES.length];

                    return (
                        <div
                            key={index}
                            className={`card-sticker-wrapper ${isClickable ? 'cursor-pointer' : ''}`}
                            style={{
                                left: `${config.left + STICKER_LEFT}%`,
                                top: `${config.top + STICKER_TOP}%`,
                                transform: `translate(-50%, -50%) scale(${cardScale})`,
                            }}
                            onClick={() => {
                                if (!href) return;
                                window.open(href, "_blank");
                            }}
                            role={isClickable ? "button" : undefined}
                            aria-label={isClickable ? "Támogató link megnyitása" : undefined}
                        >
                            <Sticker
                                src={imageSrc}
                                width={130}
                                height={130}
                                alt="Sponsor logo"
                                externalProgress={stickerProgresses[index]}
                                rotation={config.rotation}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
