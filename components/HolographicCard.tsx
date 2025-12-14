"use client";

import React, { useRef, useState, MouseEvent } from 'react';
import './HolographicCard.css';
import Sticker from './Sticker';

interface HolographicCardProps {
    imgSrc: string;
    className?: string;
}

export default function HolographicCard({ imgSrc, className = '' }: HolographicCardProps) {
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

        // Calculate rotation (center is 0)
        // Max rotation: +/- 15 degrees
        const px = Math.abs(x / w * 2 - 1);
        const py = Math.abs(y / h * 2 - 1);
        const pa = Math.hypot(px, py);
        
        // Transform math similar to CodePen
        const rx = -( (y / h) - 0.5 ) * 30; // Rotate X based on Y pos
        const ry = ( (x / w) - 0.5 ) * 30;  // Rotate Y based on X pos

        // CSS Variables update
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
        card.style.setProperty('--o', '0'); // Fade out effects
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
                {/* Background Image */}
                <div 
                    className="holo-card-bg" 
                    style={{ backgroundImage: `url(${imgSrc})` }} 
                />

                {/* Card Content Overlay */}
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
                                {/* Chip Lines */}
                                <g fill="none" stroke="#666" strokeWidth="0.5">
                                    {/* Center Rect */}
                                    <rect x="22" y="15" width="16" height="15" rx="2" strokeWidth="0.8" />
                                    {/* Horizontal Lines */}
                                    <path d="M0 14 H22" />
                                    <path d="M38 14 H60" />
                                    <path d="M0 31 H22" />
                                    <path d="M38 31 H60" />
                                    {/* Curved/Diagonal Lines */}
                                    <path d="M22 15 L10 5" />
                                    <path d="M38 15 L50 5" />
                                    <path d="M22 30 L10 40" />
                                    <path d="M38 30 L50 40" />
                                    {/* Vertical Middle Split */}
                                    <path d="M30 0 V15" />
                                    <path d="M30 30 V45" />
                                </g>
                                
                                {/* Contactless Symbol (PayPass) */}
                                <g fill="none" stroke="#ccc" strokeWidth="3" strokeLinecap="round" transform="translate(70, 22)">
                                    <path d="M0 0" /> {/* Center point anchor */}
                                    <path d="M-5 6 Q 0 0 -5 -6" strokeOpacity="0.6" />
                                    <path d="M0 10 Q 8 0 0 -10" strokeOpacity="0.8" />
                                    <path d="M6 14 Q 16 0 6 -14" strokeOpacity="1" />
                                </g>
                            </svg>
                        </div>
                        <div className="card-logo">
                            <Sticker 
                                src="/images/sponsors/szinkron_sponsor.png"
                                width={80}
                                height={80}
                                alt="Szinkron Logo"
                            />
                        </div>
                    </div>
                    
                    <div className="card-number">
                        4242 4242 4242 4242
                    </div>
                    
                    <div className="card-bottom">
                        <div className="card-info">
                            <span className="card-label">Monokultúra Egyesület</span>
                            <span className="card-holder">Szín-kron csoport</span>
                        </div>
                        <div className="card-expiry">
                            <div className="card-expiry-change">
                                <span className="card-label">VALID</span>
                                <span className="card-label">THRU</span>
                            </div>
                            <span className="card-expiry-value">12/25</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
