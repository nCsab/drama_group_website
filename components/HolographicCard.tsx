"use client";

import React, { useRef, useState, MouseEvent } from 'react';
import './HolographicCard.css';
import Sticker from './Sticker';

// 4 sticker positions (% of card) avoiding chip, card number, and bottom text
// Rotations randomly between -45..-15 or 15..45 degrees
const STICKER_CONFIGS = [
    { left: 35, top: 4, rotation: -28 },
    { left: 70, top: 8, rotation: 32 },
    { left: 5, top: 38, rotation: -38 },
    { left: 55, top: 42, rotation: 22 },
];

interface HolographicCardProps {
    imgSrc: string;
    className?: string;
    stickerProgresses?: number[];
}

export default function HolographicCard({ imgSrc, className = '', stickerProgresses = [0, 0, 0, 0] }: HolographicCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

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

                {/* 4 stickers peel on sequentially as user scrolls */}
                {STICKER_CONFIGS.map((config, index) => (
                    <div
                        key={index}
                        className="card-sticker-wrapper"
                        style={{
                            left: `${config.left}%`,
                            top: `${config.top}%`,
                        }}
                    >
                        <Sticker
                            src="/images/sponsors/szinkron_sponsor.webp"
                            width={80}
                            height={80}
                            alt="Szinkron Logo"
                            externalProgress={stickerProgresses[index]}
                            rotation={config.rotation}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
