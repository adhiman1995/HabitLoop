import React from 'react';

const Logo = ({ className = "h-10 w-auto", ...props }) => (
    <svg
        viewBox="80 0 76 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        preserveAspectRatio="xMidYMid meet"
        {...props}
    >
        <defs>
            <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0B2463" />
                <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
        </defs>

        {/* Infinity Symbol - Gradient Stroke */}
        {/* A smooth lemniscate curve */}
        <path
            d="M118 32
               C118 48 148 48 148 32
               S128 16 118 32
               S88 48 88 32
               S108 16 118 32Z"
            stroke="url(#infinityGradient)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default Logo;
