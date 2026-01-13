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
        {/* Left Ring - Cyan */}
        <path
            d="M118 32 C108 48 88 48 88 32 S108 16 118 32"
            stroke="#06b6d4"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />

        {/* Right Ring - Blue */}
        <path
            d="M118 32 C118 48 148 48 148 32 S128 16 118 32"
            stroke="#3b82f6"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default Logo;
