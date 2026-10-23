// src/components/AuroraBackground.tsx
// Aurora en ONDAS inferiores (banda rosa + colinas azules con valles oscuros) + orbes superiores.
// Se monta una vez (frame global) y SIEMPRE oscila con senos.
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { AURORA_KEYS, SEND_FRAME } from "../timeline";
import { beatScale } from "../audio";
import { C } from "./Theme";

export const AuroraBackground: React.FC = () => {
    const frame = useCurrentFrame();

    const I = interpolate(frame, AURORA_KEYS.frames, AURORA_KEYS.values, C);
    const bg = interpolateColors(frame, [510, 570], ["#000000", "#04050A"]);
    const rise = (1 - I) * 480; // la aurora "sube" desde abajo

    const hills = [
        { x: 24, ph: 0 },
        { x: 76, ph: 2.1 },
    ];

    // Flare cian al enviar el prompt (6 frames)
    const rel = frame - SEND_FRAME;
    const flare = rel < 0 ? 0 : interpolate(rel, [0, 6], [1, 0], C);

    // Pulso rítmico en 120 BPM
    const bScale = beatScale(frame, 0.02);

    // Orbes de ambiente (posición derivante + oscilación sinusoidal)
    const p1x = interpolate(frame, [600, 1800], [15, 25], C);
    const p1y = interpolate(frame, [600, 1800], [10, 20], C);
    const p2x = interpolate(frame, [600, 1800], [80, 70], C);
    const p2y = interpolate(frame, [600, 1800], [85, 75], C);

    return (
        <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden", transform: `scale(${bScale})` }}>
            {/* Orbes superiores */}
            <div
                style={{
                    position: "absolute",
                    left: `${p1x}%`,
                    top: `${p1y}%`,
                    width: 1100,
                    height: 800,
                    marginLeft: -550,
                    marginTop: -400,
                    opacity: I * 0.6,
                    background:
                        "radial-gradient(ellipse at center, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0.08) 50%, transparent 75%)",
                    filter: "blur(110px)",
                    transform: `translate(${Math.sin(frame * 0.06) * 40}px, ${Math.cos(frame * 0.04) * 25}px)`,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    left: `${p2x}%`,
                    top: `${p2y}%`,
                    width: 1000,
                    height: 700,
                    marginLeft: -500,
                    marginTop: -350,
                    opacity: I * 0.5,
                    background:
                        "radial-gradient(ellipse at center, rgba(236,72,153,0.28) 0%, rgba(236,72,153,0.05) 55%, transparent 80%)",
                    filter: "blur(120px)",
                    transform: `translate(${Math.cos(frame * 0.05) * -35}px, ${Math.sin(frame * 0.07) * -30}px)`,
                }}
            />

            {/* Banda rosa inferior */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    bottom: -150 + rise,
                    width: 2600,
                    height: 360,
                    marginLeft: -1300,
                    background:
                        "radial-gradient(ellipse at 50% 70%, rgba(255,110,196,0.95) 0%, rgba(236,72,153,0.55) 35%, transparent 70%)",
                    filter: "blur(46px)",
                    transform: `translateX(${Math.sin(frame * 0.03) * 60}px) scaleY(${1 + Math.sin(frame * 0.05) * 0.08})`,
                    mixBlendMode: "screen",
                }}
            />
            {/* Colinas azules (dos olas desfasadas, valle oscuro en el centro) */}
            {hills.map((h, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: `${h.x}%`,
                        bottom: -90 + rise + Math.sin(frame * 0.045 + h.ph) * 34,
                        width: 980,
                        height: 520,
                        marginLeft: -490,
                        background:
                            "radial-gradient(ellipse at 50% 60%, rgba(59,130,246,0.95) 0%, rgba(99,102,241,0.6) 40%, transparent 72%)",
                        filter: "blur(60px)",
                        transform: `translateX(${Math.cos(frame * 0.035 + h.ph) * 45}px)`,
                        mixBlendMode: "screen",
                    }}
                />
            ))}

            {/* Accent Cyan Flare */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: 1100,
                    height: 1100,
                    marginLeft: -550,
                    marginTop: -550,
                    background: "radial-gradient(circle, rgba(56,189,248,0.45) 0%, transparent 60%)",
                    opacity: flare,
                    transform: `scale(${0.8 + (1 - flare) * 0.6})`,
                    mixBlendMode: "screen",
                }}
            />
        </AbsoluteFill>
    );
};
