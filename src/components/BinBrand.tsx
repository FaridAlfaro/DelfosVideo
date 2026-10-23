// src/components/BinBrand.tsx — Monochromatic Brand assets and AI query loader components for BIN
// STRICT RESTRICTIONS:
// - BIN NEVER uses neon effects anywhere (no neon drop-shadows, no neon pulses).
// - BIN logo is ALWAYS monochromatic (#ffffff or grayscale).
// - Isotipo uses subtle, elegant gradients or monochromatic tones, NEVER neon colors.
// - Logo animations must be elegant: wall-reveal effect with opacity fade.
// - Logo ALWAYS occupies a MAXIMUM of 8% of the screen height (<= 86.4px for 1080p).
import React from "react";
import { OUT, ramp } from "./Theme";

export const BIN_PALETTE = {
    abyss: "#010208",
    deep: "#030a2e",
    cobalt: "#0029c7",
    electricBlue: "#1461e0",
    auroraCyan: "#14d9f5",
    nightViolet: "#521fd9",
    silver: "#f2f5fa",
    mutedSlate: "#8b949e",
};

/** BIN 4-dots diamond isotipo — Monochromatic or elegant subtle gradient, ZERO neon */
export const BinIsotipo: React.FC<{
    size?: number;
    color?: string;
    style?: React.CSSProperties;
    rotation?: number;
}> = ({ size = 64, color = "#ffffff", style, rotation = 0 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 198.25711 198.25919"
            style={{
                display: "inline-block",
                verticalAlign: "middle",
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

/** Loader 1: 4 circles in diagonal orientation */
export const BinLoader1: React.FC<{
    size?: number;
    color?: string;
    rotation?: number;
    style?: React.CSSProperties;
}> = ({ size = 64, color = "#ffffff", rotation = 0, style }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 161.64711 161.64711"
            style={{
                display: "inline-block",
                overflow: "visible",
                transform: `rotate(${rotation}deg)`,
                ...style,
            }}
        >
            <g transform="translate(-11650.805,24273.174)">
                <g transform="matrix(0.74906254,0.74906254,-0.74906254,0.74906254,-14168.265,-14317.017)">
                    <circle cx="10696.41" cy="-23939" r="34.577244" fill={color} />
                    <circle cx="10696.41" cy="-23821.002" r="34.577244" fill={color} />
                    <circle cx="10637.41" cy="-23880" r="34.577244" fill={color} />
                    <circle cx="10755.41" cy="-23880" r="34.577244" fill={color} />
                </g>
            </g>
        </svg>
    );
};

/** Loader 2: 8 circles double cross / star */
export const BinLoader2: React.FC<{
    size?: number;
    color?: string;
    rotation?: number;
    style?: React.CSSProperties;
}> = ({ size = 64, color = "#ffffff", rotation = 0, style }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 198.25919 198.25711"
            style={{
                display: "inline-block",
                overflow: "visible",
                transform: `rotate(${rotation}deg)`,
                ...style,
            }}
        >
            <g transform="translate(-11841.505,24291.478)">
                <g transform="matrix(1.0593344,0,0,1.0593344,609.55935,1104.5573)">
                    <circle cx="10696.41" cy="-23939" r="34.577244" fill={color} />
                    <circle cx="10696.41" cy="-23821.002" r="34.577244" fill={color} />
                    <circle cx="10637.41" cy="-23880" r="34.577244" fill={color} />
                    <circle cx="10755.41" cy="-23880" r="34.577244" fill={color} />
                </g>
                <g transform="matrix(0.74906254,0.74906254,-0.74906254,0.74906254,-13959.26,-14317.015)">
                    <circle cx="10696.41" cy="-23939" r="34.577244" fill={color} />
                    <circle cx="10696.41" cy="-23821.002" r="34.577244" fill={color} />
                    <circle cx="10637.41" cy="-23880" r="34.577244" fill={color} />
                    <circle cx="10755.41" cy="-23880" r="34.577244" fill={color} />
                </g>
            </g>
        </svg>
    );
};

/** Loader 3: 8-petal spiral flower / mandala */
export const BinLoader3: React.FC<{
    size?: number;
    color?: string;
    rotation?: number;
    style?: React.CSSProperties;
}> = ({ size = 64, color = "#ffffff", rotation = 0, style }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 198.25999 198.258"
            style={{
                display: "inline-block",
                overflow: "visible",
                transform: `rotate(${rotation}deg)`,
                ...style,
            }}
        >
            <g transform="translate(-12124,24291.479)">
                <g>
                    <path
                        d="m 12144.229,-24225.031 a 36.628864,36.628864 0 0 1 16.4,-3.948 36.628864,36.628864 0 0 1 34.699,24.94 36.628864,36.628864 0 0 0 9.508,-6.604 36.628864,36.628864 0 0 0 6.902,-9.63 36.628864,36.628864 0 0 1 -25.238,-34.577 36.628864,36.628864 0 0 1 3.949,-16.4 36.628864,36.628864 0 0 0 -37.414,8.805 36.628864,36.628864 0 0 0 -8.806,37.414 z"
                        fill={color}
                    />
                    <path
                        d="m 12190.449,-24113.449 a 36.628864,36.628864 0 0 1 -3.949,-16.401 36.628864,36.628864 0 0 1 25.238,-34.576 36.628864,36.628864 0 0 0 -6.902,-9.631 36.628864,36.628864 0 0 0 -9.701,-6.697 36.628864,36.628864 0 0 1 -34.506,25.033 36.628864,36.628864 0 0 1 -16.4,-3.945 36.628864,36.628864 0 0 0 8.806,37.41 36.628864,36.628864 0 0 0 37.414,8.807 z"
                        fill={color}
                    />
                    <path
                        d="m 12302.078,-24159.695 a 36.628864,36.628864 0 0 1 -16.447,3.974 36.628864,36.628864 0 0 1 -34.506,-25.033 36.628864,36.628864 0 0 0 -9.701,6.699 36.628864,36.628864 0 0 0 -6.604,9.504 36.628864,36.628864 0 0 1 24.938,34.701 36.628864,36.628864 0 0 1 -3.947,16.401 36.628864,36.628864 0 0 0 37.414,-8.805 36.628864,36.628864 0 0 0 8.853,-37.441 z"
                        fill={color}
                    />
                    <path
                        d="m 12255.865,-24271.264 a 36.628864,36.628864 0 0 1 3.893,16.414 36.628864,36.628864 0 0 1 -25.031,34.506 36.628864,36.628864 0 0 0 6.697,9.701 36.628864,36.628864 0 0 0 9.701,6.698 36.628864,36.628864 0 0 1 34.506,-25.034 36.628864,36.628864 0 0 1 16.469,3.918 36.628864,36.628864 0 0 0 -8.875,-37.384 36.628864,36.628864 0 0 0 -37.36,-8.819 z"
                        fill={color}
                    />
                    <path
                        d="m 12144.229,-24159.666 a 36.628864,36.628864 0 0 1 8.806,-14.391 36.628864,36.628864 0 0 1 42.1,-6.697 36.628864,36.628864 0 0 0 2.123,-11.596 36.628864,36.628864 0 0 0 -1.93,-11.689 36.628864,36.628864 0 0 1 -42.293,-6.604 36.628864,36.628864 0 0 1 -8.806,-14.388 36.628864,36.628864 0 0 0 -20.229,32.681 36.628864,36.628864 0 0 0 20.229,32.684 z"
                        fill={color}
                    />
                    <path
                        d="m 12255.811,-24113.449 a 36.628864,36.628864 0 0 1 -14.387,-8.805 36.628864,36.628864 0 0 1 -6.604,-42.297 36.628864,36.628864 0 0 0 -11.691,-1.928 36.628864,36.628864 0 0 0 -11.391,2.053 36.628864,36.628864 0 0 1 -6.902,42.17 36.628864,36.628864 0 0 1 -14.387,8.807 36.628864,36.628864 0 0 0 32.68,20.228 36.628864,36.628864 0 0 0 32.682,-20.228 z"
                        fill={color}
                    />
                    <path
                        d="m 12251.125,-24203.945 a 36.628864,36.628864 0 0 0 -2.123,11.595 36.628864,36.628864 0 0 0 2.123,11.596 36.628864,36.628864 0 0 1 42.1,6.699 36.628864,36.628864 0 0 1 8.853,14.36 36.628864,36.628864 0 0 0 20.182,-32.655 36.628864,36.628864 0 0 0 -20.16,-32.711 36.628864,36.628864 0 0 1 -8.875,14.418 36.628864,36.628864 0 0 1 -42.1,6.698 z"
                        fill={color}
                    />
                    <path
                        d="m 12223.129,-24291.479 a 36.628864,36.628864 0 0 0 -32.68,20.229 36.628864,36.628864 0 0 1 14.387,8.805 36.628864,36.628864 0 0 1 6.902,42.172 36.628864,36.628864 0 0 0 11.391,2.052 36.628864,36.628864 0 0 0 11.598,-2.123 36.628864,36.628864 0 0 1 6.697,-42.101 36.628864,36.628864 0 0 1 14.441,-8.819 36.628864,36.628864 0 0 0 -32.736,-20.215 z"
                        fill={color}
                    />
                </g>
            </g>
        </svg>
    );
};

/**
 * Full Monochromatic BIN Logo (Wordmark + diamond 4-dot isotipo)
 * STRICT REQUIREMENT: Max height 8% of 1080 = 86px!
 * Default height: 76px. ZERO neon effects.
 */
export const BinFullLogo: React.FC<{
    height?: number;
    color?: string;
    style?: React.CSSProperties;
}> = ({ height = 76, color = "#ffffff", style }) => {
    // Strictly cap at 86px (8% of 1080)
    const clampedHeight = Math.min(86, height);
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
                    {/* Top-right Isotipo — Monochromatic matching */}
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
 * Architectural Wall-Reveal Animation for BIN Logo:
 * - Effect: Rising gracefully from behind an invisible horizontal edge with smooth opacity dissolve.
 * - Always strictly <= 8% screen height (clamped at 76px).
 * - Monochromatic (#ffffff), ZERO neon, ZERO pulse.
 */
export const BinLogoWallReveal: React.FC<{
    frame: number;
    startFrame?: number;
    duration?: number;
    exitFrame?: number;
    height?: number;
    color?: string;
}> = ({
    frame,
    startFrame = 0,
    duration = 16,
    exitFrame = 36,
    height = 76,
    color = "#ffffff",
}) => {
    // Reveal progress (0 to 1)
    const p = ramp(frame, startFrame, startFrame + duration, OUT);
    // Exit progress (0 to 1)
    const isExit = exitFrame !== undefined && frame >= exitFrame;
    const exitP = isExit ? ramp(frame, exitFrame, exitFrame + 10, OUT) : 0;

    const clampedHeight = Math.min(84, height);
    const containerH = clampedHeight + 14;

    // Architectural slide up from behind baseline
    const translateY = (1 - p) * 105 - exitP * 12;
    const opacity = p * (1 - exitP);

    return (
        <div
            style={{
                position: "relative",
                display: "inline-block",
                height: containerH,
                overflow: "hidden", // The wall mask
                verticalAlign: "middle",
            }}
        >
            <div
                style={{
                    transform: `translateY(${translateY}%)`,
                    opacity,
                }}
            >
                <BinFullLogo height={clampedHeight} color={color} />
            </div>
        </div>
    );
};

/**
 * AI Query Thinking Animation:
 * Smooth gradient transitions between loaders, ZERO neon.
 */
export const BinAiThinking: React.FC<{
    frame: number;
    size?: number;
    starScale?: number;
}> = ({ frame, size = 300, starScale = 1 }) => {
    const rot = frame * 3.5;

    const p1 = ramp(frame, 0, 14, OUT);
    const p2 = ramp(frame, 14, 28, OUT);
    const p3 = ramp(frame, 28, 48, OUT);

    const l1Scale = (1 - p2) * p1;
    const l2Scale = (1 - p3) * p2;
    const l3Scale = p3;

    return (
        <div
            style={{
                position: "relative",
                width: size,
                height: size,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${starScale})`,
            }}
        >
            {/* Stage 1: Loader 1 */}
            {l1Scale > 0.01 && (
                <div
                    style={{
                        position: "absolute",
                        opacity: l1Scale,
                        transform: `scale(${l1Scale}) rotate(${rot * 1.5}deg)`,
                    }}
                >
                    <BinLoader1 size={size * 0.65} color="#1461e0" />
                </div>
            )}

            {/* Stage 2: Loader 2 */}
            {l2Scale > 0.01 && (
                <div
                    style={{
                        position: "absolute",
                        opacity: l2Scale,
                        transform: `scale(${l2Scale}) rotate(${rot * 1.1}deg)`,
                    }}
                >
                    <BinLoader2 size={size * 0.8} color="#521fd9" />
                </div>
            )}

            {/* Stage 3: Loader 3 */}
            {l3Scale > 0.01 && (
                <div
                    style={{
                        position: "absolute",
                        opacity: Math.min(1, l3Scale),
                        transform: `scale(${l3Scale}) rotate(${rot * 0.75}deg)`,
                    }}
                >
                    <BinLoader3 size={size * 0.95} color="#f2f5fa" />
                </div>
            )}

            {/* Center diamond core: Monochromatic BIN Isotipo */}
            <div
                style={{
                    position: "absolute",
                    transform: `rotate(${frame * -1.2}deg)`,
                    zIndex: 10,
                }}
            >
                <BinIsotipo size={size * 0.38} color="#ffffff" />
            </div>
        </div>
    );
};
