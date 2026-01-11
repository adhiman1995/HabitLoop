import React from 'react';

const Logo = ({ className = "w-6 h-6", ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="52 52 408 408" className={className} {...props}>
        <defs>
            <linearGradient id="blueGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>

            <linearGradient id="greenOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#F97316" />
            </linearGradient>

            <linearGradient id="orangeBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
        </defs>

        {/* Background with dark border */}
        {/* <rect x="56" y="56"
            width="400" height="400"
            rx="80"
            fill="#FFFFFF"
            stroke="#111827"
            strokeWidth="8" /> */}

        {/* Swirls */}
        <path d="M256 96
           C150 96 96 150 96 256
           C96 362 150 416 256 416
           C362 416 416 362 416 256
           C416 150 362 96 256 96 Z"
            fill="none"
            stroke="url(#blueGreen)"
            strokeWidth="48"
            strokeLinecap="round" />

        <path d="M256 128
           C180 128 128 180 128 256
           C128 332 180 384 256 384"
            fill="none"
            stroke="url(#greenOrange)"
            strokeWidth="48"
            strokeLinecap="round" />

        <path d="M256 384
           C332 384 384 332 384 256
           C384 180 332 128 256 128"
            fill="none"
            stroke="url(#orangeBlue)"
            strokeWidth="48"
            strokeLinecap="round" />

        {/* Center mark */}
        <path d="M240 200
           H280
           C300 200 320 220 320 240
           C320 260 300 280 280 280
           H260
           V320
           H240 Z"
            fill="#FFFFFF" />

    </svg>
);

export default Logo;
