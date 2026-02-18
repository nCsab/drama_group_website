import React from "react";

const WaveTransition = () => {
    return (
        <div className="w-full relative z-10 -mt-1 bg-transparent pointer-events-none transform scale-y-60 origin-top opacity-90">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 960 300" 
                className="w-full h-auto block"
                preserveAspectRatio="none"
            >
                <defs>
                    <mask id="wave-mask" x="0" y="0" width="100%" height="100%">
                        {/* White rect = Visible area */}
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        {/* Black path = Transparent area (The "Lightest Wave" shape) */}
                        <path 
                            d="M0 48L16 48.2C32 48.3 64 48.7 96 52C128 55.3 160 61.7 192 67.8C224 74 256 80 288 80.7C320 81.3 352 76.7 384 75.3C416 74 448 76 480 72.5C512 69 544 60 576 58.2C608 56.3 640 61.7 672 64C704 66.3 736 65.7 768 67.2C800 68.7 832 72.3 864 67.8C896 63.3 928 50.7 944 44.3L960 38L960 0L0 0Z" 
                            fill="black" 
                        />
                    </mask>
                </defs>

                <g mask="url(#wave-mask)">
                    {/* Back wave - Darkest Garnet (#2E0E10) */}
                    <path 
                        d="M0 162L16 170.2C32 178.3 64 194.7 96 199.7C128 204.7 160 198.3 192 197.2C224 196 256 200 288 198C320 196 352 188 384 190.7C416 193.3 448 206.7 480 211.2C512 215.7 544 211.3 576 212C608 212.7 640 218.3 672 212.8C704 207.3 736 190.7 768 191.3C800 192 832 210 864 210.8C896 211.7 928 195.3 944 187.2L960 179L960 0L0 0Z" 
                        fill="#2E0E10"
                    ></path>
                    
                    {/* Mid wave 1 - Medium Garnet (#4A1518) */}
                    <path 
                        d="M0 139L16 146C32 153 64 167 96 175.7C128 184.3 160 187.7 192 182.5C224 177.3 256 163.7 288 153C320 142.3 352 134.7 384 131.2C416 127.7 448 128.3 480 135C512 141.7 544 154.3 576 162C608 169.7 640 172.3 672 173.2C704 174 736 173 768 171.5C800 170 832 168 864 171.3C896 174.7 928 183.3 944 187.7L960 192L960 0L0 0Z" 
                        fill="#4A1518"
                    ></path>
                    
                    {/* Mid wave 2 - Light Garnet (#5F1E22) */}
                    <path 
                        d="M0 98L16 105.2C32 112.3 64 126.7 96 126.3C128 126 160 111 192 107.3C224 103.7 256 111.3 288 108.5C320 105.7 352 92.3 384 83.8C416 75.3 448 71.7 480 80C512 88.3 544 108.7 576 112.2C608 115.7 640 102.3 672 92.3C704 82.3 736 75.7 768 79.3C800 83 832 97 864 106.3C896 115.7 928 120.3 944 122.7L960 125L960 0L0 0Z" 
                        fill="#5F1E22"
                    ></path>
                </g>
            </svg>
        </div>
    );
};

export default WaveTransition;
