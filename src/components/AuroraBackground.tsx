// src/components/AuroraBackground.tsx — Grainy liquid gradient inspired by GrainyGradient.tsx
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { AURORA_KEYS, SEND_FRAME } from "../timeline";
import { beatScale } from "../audio";
import { C } from "./Theme";

export const AuroraBackground: React.FC = () => {
    const frame = useCurrentFrame();

    const I = interpolate(frame, AURORA_KEYS.frames, AURORA_KEYS.values, C);
    // Background deepens smoothly from pure black to abyssal navy (#010208 -> #02040c)
    const bg = interpolateColors(frame, [510, 570], ["#000000", "#010208"]);
    const rise = (1 - I) * 500; // Rising intensity at brand drop

    // Flare when sending prompt (f750 global = SEND_FRAME)
    const rel = frame - SEND_FRAME;
    const flare = rel < 0 ? 0 : interpolate(rel, [0, 8], [1, 0], C);

    // Subtle 120 BPM beat scale
    const bScale = beatScale(frame, 0.018);

    // Flowing liquid coordinates from GrainyGradient.tsx
    const t = frame * 0.04;
    const wave1X = Math.sin(t * 0.8) * 80;
    const wave1Y = Math.cos(t * 0.6) * 45;
    const wave2X = Math.cos(t * 0.7) * -70;
    const wave2Y = Math.sin(t * 0.9) * -50;
    const wave3X = Math.sin(t * 0.5 + 1.5) * 60;

    return (
        <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden", transform: `scale(${bScale})` }}>
            {/* Deep Abyssal Base Gradient */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse 120% 100% at 50% 110%, #030a2e 0%, #010208 65%, #000000 100%)",
                    opacity: Math.max(0.2, I),
                }}
            />

            {/* Liquid Fold 1: Cobalt Deep (#0029c7 / #1461e0) — Bottom-Left to Center */}
            <div
                style={{
                    position: "absolute",
                    left: "20%",
                    bottom: -160 + rise,
                    width: 1500,
                    height: 850,
                    marginLeft: -750,
                    background:
                        "radial-gradient(ellipse at 45% 65%, rgba(0,41,199,0.85) 0%, rgba(20,97,224,0.45) 42%, transparent 75%)",
                    filter: "blur(75px)",
                    transform: `translate(${wave1X}px, ${wave1Y}px) rotate(-12deg) scaleY(${1 + Math.sin(t * 0.9) * 0.1})`,
                    mixBlendMode: "screen",
                    opacity: I * 0.92,
                }}
            />

            {/* Liquid Fold 2: Electric Aurora Cyan (#14d9f5 / #0073e0) — Top-Right Crest */}
            <div
                style={{
                    position: "absolute",
                    right: "-10%",
                    top: "10%",
                    width: 1300,
                    height: 850,
                    background:
                        "radial-gradient(ellipse at 55% 45%, rgba(20,217,245,0.7) 0%, rgba(0,115,224,0.35) 45%, transparent 75%)",
                    filter: "blur(90px)",
                    transform: `translate(${wave2X}px, ${wave2Y}px) scale(${0.95 + Math.sin(t * 0.7) * 0.08})`,
                    mixBlendMode: "screen",
                    opacity: I * 0.78,
                }}
            />

            {/* Liquid Fold 3: Night Violet / Indigo (#6d28d9 / #9447fa) — Mid Floating Orb */}
            <div
                style={{
                    position: "absolute",
                    left: "55%",
                    bottom: -100 + rise,
                    width: 1200,
                    height: 700,
                    marginLeft: -600,
                    background:
                        "radial-gradient(ellipse at 50% 60%, rgba(148,71,250,0.7) 0%, rgba(109,40,217,0.3) 45%, transparent 72%)",
                    filter: "blur(80px)",
                    transform: `translate(${wave3X}px, ${Math.cos(t * 0.8) * 35}px) rotate(8deg)`,
                    mixBlendMode: "screen",
                    opacity: I * 0.82,
                }}
            />

            {/* Liquid Fold 4: Executive Crimson / Rose Accent (#ec4899 / #e11d48) — Bottom Edge Warmth */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    bottom: -220 + rise,
                    width: 2200,
                    height: 380,
                    marginLeft: -1100,
                    background:
                        "radial-gradient(ellipse at 50% 70%, rgba(236,72,153,0.85) 0%, rgba(225,29,72,0.4) 40%, transparent 75%)",
                    filter: "blur(55px)",
                    transform: `translateX(${Math.sin(t * 0.6) * 50}px)`,
                    mixBlendMode: "screen",
                    opacity: I * 0.75,
                }}
            />

            {/* Prompt send cyan shockwave flare */}
            {flare > 0 && (
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: 1400,
                        height: 1400,
                        marginLeft: -700,
                        marginTop: -700,
                        background:
                            "radial-gradient(circle, rgba(20,217,245,0.65) 0%, rgba(0,41,199,0.3) 40%, transparent 70%)",
                        opacity: flare,
                        transform: `scale(${0.7 + (1 - flare) * 0.8})`,
                        mixBlendMode: "screen",
                        pointerEvents: "none",
                    }}
                />
            )}

            {/* Subtle Grainy Overlay Texture (from GrainyGradient analog film grain) */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.042,
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
