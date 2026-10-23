// src/components/ConnectorLogos.tsx
// Logos 100 % vectoriales y ANIMADOS: entrada con resorte/draw-on y animación idle continua.
// `delay` = frames (del Sequence actual) hasta que el logo empieza a construirse.
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { lerp } from "./Theme";

export type LogoProps = { size?: number; delay?: number };

const useIn = (delay: number, stagger = 0, damping = 12) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const s = spring({ frame: Math.max(0, frame - delay - stagger), fps, config: { damping, stiffness: 170 } });
    const at = (stagger = 0, d = damping) =>
        spring({ frame: Math.max(0, frame - delay - stagger), fps, config: { damping: d, stiffness: 170 } });
    return { frame, s, t: frame - delay, at };
};

/** 1 · Azure / Copilot — tetraedro: 3 facetas que se ensamblan y giran (yaw) con brillo de degradado */
export const CopilotAzureLogo: React.FC<LogoProps> = ({ size = 56, delay = 0 }) => {
    const { frame, at } = useIn(delay);
    const facets = [
        { pts: "18,3 4,28 18,21", fill: "url(#lg-az-a)", from: [-10, -8] },
        { pts: "18,3 32,28 18,21", fill: "url(#lg-az-b)", from: [10, -8] },
        { pts: "4,28 32,28 18,21", fill: "#00C7FF", from: [0, 12] },
    ];
    const yaw = 0.9 + 0.1 * Math.cos(frame * 0.07);
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" style={{ transform: `translateY(${Math.sin(frame * 0.1) * 0.8}px)` }}>
            <defs>
                <linearGradient id="lg-az-a" x1="18" y1="3" x2="4" y2="28" gradientUnits="userSpaceOnUse" gradientTransform={`rotate(${frame * 2} 18 18)`}>
                    <stop offset="0" stopColor="#7DEBFF" />
                    <stop offset="1" stopColor="#0078D4" />
                </linearGradient>
                <linearGradient id="lg-az-b" x1="18" y1="3" x2="32" y2="28" gradientUnits="userSpaceOnUse" gradientTransform={`rotate(${-frame * 2} 18 18)`}>
                    <stop offset="0" stopColor="#0A84E8" />
                    <stop offset="1" stopColor="#0B3FA8" />
                </linearGradient>
            </defs>
            <g transform={`translate(18 18) scale(${yaw} 1) translate(-18 -18)`}>
                {facets.map((fc, i) => {
                    const s = at(i * 3);
                    return (
                        <polygon
                            key={i}
                            points={fc.pts}
                            fill={fc.fill}
                            opacity={Math.min(1, s * 1.4)}
                            transform={`translate(${fc.from[0] * (1 - s)} ${fc.from[1] * (1 - s)}) rotate(${(1 - s) * (i % 2 ? 40 : -40)} 18 18)`}
                        />
                    );
                })}
            </g>
        </svg>
    );
};

/** 2 · Google Cloud — 4 cuadrantes que crecen desde el centro + barrido de luz recurrente */
export const GoogleCloudLogo: React.FC<LogoProps> = ({ size = 56, delay = 0 }) => {
    const { t, at } = useIn(delay);
    const quads = [
        { x: 0, y: 0, c: "#4285F4", ox: 12, oy: 13 },
        { x: 12, y: 0, c: "#EA4335", ox: 12, oy: 13 },
        { x: 12, y: 13, c: "#FBBC05", ox: 12, oy: 13 },
        { x: 0, y: 13, c: "#34A853", ox: 12, oy: 13 },
    ];
    const sweepX = -14 + (((t - 30) % 80) / 80) * 52;
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <defs>
                <clipPath id="lg-gcp-clip2">
                    <path clipRule="evenodd" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z M12 10.6a3.2 3.2 0 1 0 0 6.4a3.2 3.2 0 1 0 0-6.4z" />
                </clipPath>
                <linearGradient id="lg-gcp-sweep" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#fff" stopOpacity="0" />
                    <stop offset="0.5" stopColor="#fff" stopOpacity="0.75" />
                    <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
            </defs>
            <g clipPath="url(#lg-gcp-clip2)">
                {quads.map((q, i) => {
                    const s = at(i * 3);
                    return (
                        <rect key={i} x={q.x} y={q.y} width="12" height={i < 2 ? 13 : 8} fill={q.c} transform={`translate(${q.ox} ${q.oy}) scale(${Math.min(1.05, s)}) translate(${-q.ox} ${-q.oy})`} />
                    );
                })}
                {t > 30 && <rect x={sweepX} y="-2" width="9" height="28" fill="url(#lg-gcp-sweep)" transform="skewX(-20)" />}
            </g>
        </svg>
    );
};

/** 3 · Power BI — 3 barras ascendentes que crecen en cascada y "respiran" */
export const PowerBiLogo: React.FC<LogoProps> = ({ size = 56, delay = 0 }) => {
    const { frame, at } = useIn(delay);
    const bars = [
        { x: 5, h: 10, c: "#D98F00" },
        { x: 14.5, h: 17, c: "#F2C811" },
        { x: 24, h: 25, c: "url(#lg-pbi2)" },
    ];
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <defs>
                <linearGradient id="lg-pbi2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#FFE066" />
                    <stop offset="1" stopColor="#E8A800" />
                </linearGradient>
            </defs>
            {bars.map((b, i) => {
                const s = at(i * 4, 9);
                const breathe = 1 + Math.sin(frame * 0.14 + i * 1.2) * 0.05;
                const h = Math.max(0, b.h * s * breathe);
                return <rect key={i} x={b.x} y={31 - h} width="7" height={h} rx="2.5" fill={b.c} />;
            })}
        </svg>
    );
};

const bez = (p: number[][], t: number) => {
    const u = 1 - t;
    return [
        u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
        u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1],
    ];
};

/** 4 · n8n — los enlaces se dibujan, los nodos aparecen y viajan puntos de datos por el workflow */
export const N8nLogo: React.FC<LogoProps> = ({ size = 56, delay = 0 }) => {
    const { frame, t, at } = useIn(delay);
    const links = [
        { d: "M10 18 C 17 18, 16 10, 25 10", p: [[10, 18], [17, 18], [16, 10], [25, 10]] },
        { d: "M10 18 C 17 18, 16 26, 25 26", p: [[10, 18], [17, 18], [16, 26], [25, 26]] },
    ];
    const nodes = [[7, 18], [28, 10], [28, 26]];
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <g stroke="#EA4B71" strokeWidth="3" strokeLinecap="round" fill="none">
                {links.map((l, i) => {
                    const dp = Math.min(1, Math.max(0, (t - 4 - i * 4) / 14));
                    return <path key={i} d={l.d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dp} />;
                })}
                <path d="M28 14.5 V21.5" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, Math.max(0, (t - 14) / 8))} />
            </g>
            {nodes.map(([cx, cy], i) => {
                const s = at(i * 4, 8);
                return (
                    <g key={i} transform={`translate(${cx} ${cy}) scale(${s * (1 + Math.sin(frame * 0.18 + i) * 0.05)})`}>
                        <circle r="5" fill="#EA4B71" />
                        <circle r="1.8" fill="#fff" />
                    </g>
                );
            })}
            {t > 22 &&
                links.map((l, i) =>
                    [0, 0.5].map((off) => {
                        const [x, y] = bez(l.p, (frame * 0.025 + off + i * 0.25) % 1);
                        return <circle key={`${i}-${off}`} cx={x} cy={y} r="1.6" fill="#fff" />;
                    }),
                )}
        </svg>
    );
};

/** 5 · Snowflake — los 6 brazos crecen en cascada y el copo rota/pulsa */
export const SnowflakeLogo: React.FC<LogoProps> = ({ size = 56, delay = 0 }) => {
    const { frame, at } = useIn(delay);
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <g stroke="#29B5E8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" transform={`translate(18 18) rotate(${frame * 0.6}) scale(${1 + Math.sin(frame * 0.12) * 0.04})`}>
                {[0, 1, 2, 3, 4, 5].map((k) => {
                    const s = at(k * 2, 10);
                    return (
                        <g key={k} transform={`rotate(${k * 60})`}>
                            <line x1="0" y1="0" x2="0" y2={-15 * Math.min(1, s)} />
                            <polyline points="-4.5,-11.5 0,-8 4.5,-11.5" fill="none" opacity={Math.min(1, Math.max(0, s - 0.5) * 2)} />
                            <polyline points="-3,-5.5 0,-3 3,-5.5" fill="none" opacity={Math.min(1, Math.max(0, s - 0.3) * 2)} />
                        </g>
                    );
                })}
            </g>
        </svg>
    );
};

/** 6 · OpenAI — 6 lóbulos que se dibujan uno a uno y el glifo gira con aceleración suave */
export const OpenAiLogo: React.FC<LogoProps> = ({ size = 56, delay = 0 }) => {
    const { frame, t } = useIn(delay);
    const spin = lerp(-90, 0, Math.min(1, Math.max(0, t / 26))) + (t > 26 ? (t - 26) * 0.9 : 0);
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
            <g stroke="#ffffff" strokeWidth="2" fill="none" strokeLinejoin="round" transform={`translate(18 18) rotate(${spin})`}>
                {[0, 1, 2, 3, 4, 5].map((k) => {
                    const dp = Math.min(1, Math.max(0, (t - k * 3) / 14));
                    return (
                        <rect key={k} x={-5} y={-15} width={10} height={17} rx={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dp} opacity={0.65 + 0.35 * Math.sin(frame * 0.1 + k)} transform={`rotate(${k * 60})`} />
                    );
                })}
            </g>
        </svg>
    );
};

export const CONNECTORS = [
    { name: "Copilot / Azure", Logo: CopilotAzureLogo, accent: "#00C7FF" },
    { name: "Google Cloud", Logo: GoogleCloudLogo, accent: "#4285F4" },
    { name: "Power BI", Logo: PowerBiLogo, accent: "#F2C811" },
    { name: "n8n", Logo: N8nLogo, accent: "#EA4B71" },
    { name: "Snowflake", Logo: SnowflakeLogo, accent: "#29B5E8" },
    { name: "OpenAI", Logo: OpenAiLogo, accent: "#ffffff" },
] as const;