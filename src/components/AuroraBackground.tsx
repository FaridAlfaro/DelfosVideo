// src/components/AuroraBackground.tsx — Organic diffused gradient spheres (Style END.mp4, Zero Neon)
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { AURORA_KEYS } from "../timeline";
import { C } from "./Theme";

export const AuroraBackground: React.FC = () => {
    const frame = useCurrentFrame();

    const I = interpolate(frame, AURORA_KEYS.frames, AURORA_KEYS.values, C);
    const bg = interpolateColors(frame, [510, 570], ["#03050B", "#050811"]);
    const rise = (1 - I) * 320;

    const t = frame * 0.032;
    const wave1X = Math.sin(t * 0.75) * 90;
    const wave1Y = Math.cos(t * 0.55) * 50;
    const wave2X = Math.cos(t * 0.65) * -80;
    const wave2Y = Math.sin(t * 0.8) * -45;
    const wave3X = Math.sin(t * 0.45 + 1.4) * 70;

    return (
        <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
            {/* Deep Abyssal Base */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse 130% 100% at 50% 105%, rgba(30, 58, 138, 0.28) 0%, #050811 65%, #020409 100%)",
                    opacity: Math.max(0.35, I),
                }}
            />

            {/* Organic Sphere 1: Deep Sapphire (#1E3A8A) */}
            <div
                style={{
                    position: "absolute",
                    left: "24%",
                    bottom: -140 + rise,
                    width: 1400,
                    height: 820,
                    marginLeft: -700,
                    background:
                        "radial-gradient(ellipse at 50% 55%, rgba(30, 58, 138, 0.62) 0%, rgba(67, 56, 202, 0.28) 48%, transparent 76%)",
                    filter: "blur(70px)",
                    transform: `translate(${wave1X}px, ${wave1Y}px) rotate(-8deg)`,
                    opacity: Math.max(0.28, I * 0.75),
                }}
            />

            {/* Organic Sphere 2: Indigo (#4338CA) */}
            <div
                style={{
                    position: "absolute",
                    right: "-8%",
                    top: "12%",
                    width: 1200,
                    height: 780,
                    background:
                        "radial-gradient(ellipse at 50% 50%, rgba(67, 56, 202, 0.48) 0%, rgba(30, 58, 138, 0.22) 50%, transparent 75%)",
                    filter: "blur(75px)",
                    transform: `translate(${wave2X}px, ${wave2Y}px)`,
                    opacity: Math.max(0.22, I * 0.65),
                }}
            />

            {/* Organic Sphere 3: Soft Violet & Silver (#6D28D9 / #F8FAFC) */}
            <div
                style={{
                    position: "absolute",
                    left: "56%",
                    bottom: -120 + rise,
                    width: 1100,
                    height: 640,
                    marginLeft: -550,
                    background:
                        "radial-gradient(ellipse at 50% 55%, rgba(109, 40, 217, 0.42) 0%, rgba(248, 250, 252, 0.08) 45%, transparent 74%)",
                    filter: "blur(68px)",
                    transform: `translate(${wave3X}px, ${Math.cos(t * 0.7) * 32}px) rotate(6deg)`,
                    opacity: Math.max(0.2, I * 0.68),
                }}
            />

            {/* Subtle Matte Grain Overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.032,
                    mixBlendMode: "overlay",
                    pointerEvents: "none",
                }}
            >
                <svg width="100%" height="100%">
                    <filter id="grainyNoise">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.75"
                            numOctaves={3}
                            stitchTiles="stitch"
                        />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#grainyNoise)" />
                </svg>
            </div>
        </AbsoluteFill>
    );
};
