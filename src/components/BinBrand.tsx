// src/components/BinBrand.tsx — Official Monochromatic BIN Brand Assets (Zero Neon, No Custom Loaders)
import React from "react";
import { EDITORIAL, OUT, lerp, ramp } from "./Theme";

export const BIN_PALETTE = {
    abyss: "#02040A",
    sapphire: "#1E3A8A",
    indigo: "#4338CA",
    violet: "#6D28D9",
    silver: "#F8FAFC",
    mutedSlate: "#94A3B8",
};

/**
 * Official BIN 4-dots diamond isotipo (public/assets/isotipo.svg)
 * Strictly monochromatic (#ffffff), zero neon shadows or glows.
 */
export const BinIsotipo: React.FC<{
    size?: number;
    color?: string;
    style?: React.CSSProperties;
    rotation?: number;
}> = ({ size = 32, color = "#ffffff", style, rotation = 0 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 198.25711 198.25919"
            style={{
                display: "block",
                flexShrink: 0,
                overflow: "visible",
                transform: rotation ? `rotate(${rotation}deg)` : undefined,
                ...style,
            }}
        >
            <g transform="translate(-12347.335,24291.508)">
                <g transform="matrix(0,1.0593344,-1.0593344,0,-12850.443,-35523.454)">
                    <circle cx="10696.41" cy="-23939" r="34.577244" fill={color} />
                    <circle cx="10696.41" cy="-23821.002" r="34.577244" fill={color} />
                    <circle cx="10637.41" cy="-23880" r="34.577244" fill={color} />
                    <circle cx="10755.41" cy="-23880" r="34.577244" fill={color} />
                </g>
            </g>
        </svg>
    );
};

/**
 * Full Monochromatic BIN Logo (Wordmark + diamond 4-dot isotipo)
 * Strictly monochromatic (#ffffff), max height 76px (<= 8% of 1080p).
 */
export const BinFullLogo: React.FC<{
    height?: number;
    color?: string;
    style?: React.CSSProperties;
}> = ({ height = 76, color = "#ffffff", style }) => {
    const clampedHeight = Math.min(76, height);
    const computedWidth = clampedHeight * (812.518 / 482.115);
    return (
        <svg
            width={computedWidth}
            height={clampedHeight}
            viewBox="0 0 812.5177 482.11575"
            style={{
                display: "inline-block",
                verticalAlign: "middle",
                overflow: "visible",
                ...style,
            }}
        >
            <g transform="translate(-10613,23953.889)">
                <g>
                    {/* BIN Wordmark */}
                    <g transform="translate(789.5325,-665.382)">
                        <path d="m 10154.78,-22806.391 h -57.085 v -285.227 h 57.085 z" fill={color} />
                        <path
                            d="m 10438.43,-22806.391 h -61.063 l -109.994,-187.764 v 187.764 h -57.085 v -285.227 h 61.063 l 109.994,187.964 v -187.964 h 57.085 z"
                            fill={color}
                        />
                        <path
                            d="m 10051.61,-22891.919 c 0,11.801 -2.254,22.874 -6.763,33.217 -4.509,10.343 -10.675,19.426 -18.498,27.25 -7.691,7.691 -16.708,13.79 -27.051,18.299 -10.343,4.508 -21.4153,6.762 -33.2169,6.762 h -142.6136 v -285.227 h 142.6136 c 11.8016,0 22.8739,2.254 33.2169,6.763 10.343,4.508 19.36,10.674 27.051,18.498 7.823,7.691 13.989,16.708 18.498,27.051 4.509,10.343 6.763,21.415 6.763,33.216 0,5.305 -0.729,10.742 -2.188,16.311 -1.459,5.569 -3.514,10.939 -6.166,16.111 -2.652,5.171 -5.835,9.879 -9.548,14.122 -3.713,4.243 -7.823,7.757 -12.332,10.542 4.641,2.519 8.818,5.967 12.531,10.343 3.713,4.243 6.895,8.951 9.548,14.122 2.652,5.171 4.641,10.608 5.967,16.31 1.459,5.569 2.188,11.006 2.188,16.31 z m -171.0573,28.443 h 85.5284 c 3.9781,0 7.6909,-0.729 11.1386,-2.188 3.4477,-1.459 6.4312,-3.448 8.9507,-5.967 2.652,-2.652 4.7073,-5.702 6.166,-9.149 1.4586,-3.448 2.1879,-7.161 2.1879,-11.139 0,-3.978 -0.7293,-7.691 -2.1879,-11.139 -1.4587,-3.447 -3.514,-6.431 -6.166,-8.95 -2.5195,-2.652 -5.503,-4.707 -8.9507,-6.166 -3.4477,-1.459 -7.1605,-2.188 -11.1386,-2.188 h -85.5284 z m 0,-113.971 h 85.5284 c 3.9781,0 7.6909,-0.729 11.1386,-2.188 3.4477,-1.459 6.4312,-3.448 8.9507,-5.968 2.652,-2.652 4.7073,-5.702 6.166,-9.149 1.4586,-3.58 2.1879,-7.359 2.1879,-11.338 0,-3.978 -0.7293,-7.691 -2.1879,-11.138 -1.4587,-3.448 -3.514,-6.432 -6.166,-8.951 -2.5195,-2.652 -5.503,-4.707 -8.9507,-6.166 -3.4477,-1.459 -7.1605,-2.188 -11.1386,-2.188 h -85.5284 z"
                            fill={color}
                        />
                    </g>
                    {/* Top-right Isotipo */}
                    <g transform="matrix(1.0593344,0,0,1.0593344,-4.6871542,1442.1463)">
                        <circle cx="10696.41" cy="-23939" r="34.577244" fill={color} />
                        <circle cx="10696.41" cy="-23821.002" r="34.577244" fill={color} />
                        <circle cx="10637.41" cy="-23880" r="34.577244" fill={color} />
                        <circle cx="10755.41" cy="-23880" r="34.577244" fill={color} />
                    </g>
                </g>
            </g>
        </svg>
    );
};

/**
 * Ultra-Clean Editorial Reveal for BIN Logo (Scenes 3.2 & 6.4):
 * - Scale 0.94 -> 1.0, opacity 0 -> 1, optical blur 12px -> 0px over 22 frames using Easing.bezier(0.16, 1, 0.3, 1)
 * - Subtle breathing indigo/silver aurora behind the logo (opacity 0.25, blur(60px)), zero flash, zero shockwave.
 */
export const BinLogoEditorialReveal: React.FC<{
    frame: number;
    startFrame?: number;
    duration?: number;
    exitFrame?: number;
    height?: number;
    color?: string;
    initialScale?: number;
    initialBlur?: number;
}> = ({
    frame,
    startFrame = 0,
    duration = 22,
    exitFrame,
    height = 76,
    color = "#ffffff",
    initialScale = 0.94,
    initialBlur = 12,
}) => {
    const p = ramp(frame, startFrame, startFrame + duration, EDITORIAL);
    const isExit = exitFrame !== undefined && frame >= exitFrame;
    const exitP = isExit ? ramp(frame, exitFrame, exitFrame + 10, OUT) : 0;

    const clampedHeight = Math.min(76, height);
    const scale = lerp(initialScale, 1.0, p) * lerp(1.0, 0.98, exitP);
    const blur = lerp(initialBlur, 0, p) + exitP * 8;
    const opacity = p * (1 - exitP);
    const breathe = 0.96 + 0.06 * Math.sin((frame - startFrame) * 0.12);

    if (opacity <= 0.001) return null;

    return (
        <div
            style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* Subtle breathing indigo/silver aurora behind the logo */}
            <div
                style={{
                    position: "absolute",
                    width: 420,
                    height: 220,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(ellipse at 50% 50%, rgba(67, 56, 202, 0.7) 0%, rgba(30, 58, 138, 0.45) 48%, rgba(248, 250, 252, 0.15) 75%, transparent 100%)",
                    filter: "blur(60px)",
                    opacity: 0.25 * opacity,
                    transform: `scale(${breathe})`,
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    opacity,
                    transform: `scale(${scale})`,
                    filter: `blur(${blur}px)`,
                }}
            >
                <BinFullLogo height={clampedHeight} color={color} />
            </div>
        </div>
    );
};

export const BinLogoWallReveal = BinLogoEditorialReveal;
