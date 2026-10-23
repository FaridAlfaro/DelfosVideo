// src/components/ThinkingBlob.tsx — flor de 8 lóbulos con degradado + estrella de 4 puntas (indicador "pensando")
import React from "react";

const STAR = "M0 -1 C 0.1 -0.28 0.28 -0.1 1 0 C 0.28 0.1 0.1 0.28 0 1 C -0.1 0.28 -0.28 0.1 -1 0 C -0.28 -0.1 -0.1 -0.28 0 -1 Z";

export const ThinkingBlob: React.FC<{ t: number; size: number; starScale?: number }> = ({ t, size, starScale = 1 }) => {
    const N = 220;
    const amp = 0.17 * (0.65 + 0.35 * Math.sin(t * 0.14));
    const pts = Array.from({ length: N }).map((_, i) => {
        const th = (i / N) * Math.PI * 2;
        const r = 1 + amp * Math.cos(8 * th + t * 0.07);
        return `${i === 0 ? "M" : "L"}${(Math.cos(th) * r * 100).toFixed(2)} ${(Math.sin(th) * r * 100).toFixed(2)}`;
    });
    const d = pts.join(" ") + " Z";
    const rot = t * 2.2;
    return (
        <svg width={size} height={size} viewBox="-150 -150 300 300" style={{ overflow: "visible" }}>
            <defs>
                <linearGradient id="blobGrad" x1="-1" y1="-1" x2="1" y2="1" gradientTransform={`rotate(${rot})`}>
                    <stop offset="0" stopColor="#3b82f6" />
                    <stop offset="0.35" stopColor="#a855f7" />
                    <stop offset="0.7" stopColor="#ec4899" />
                    <stop offset="1" stopColor="#fb923c" />
                </linearGradient>
                <filter id="blobBlur">
                    <feGaussianBlur stdDeviation="14" />
                </filter>
            </defs>
            <path d={d} fill="url(#blobGrad)" opacity="0.75" filter="url(#blobBlur)" />
            <path d={d} fill="url(#blobGrad)" />
            <g transform={`rotate(${t * 1.2}) scale(${38 * starScale})`}>
                <path d={STAR} fill="#07080d" stroke="rgba(255,255,255,0.7)" strokeWidth={0.05 / Math.max(starScale, 0.2)} />
            </g>
        </svg>
    );
};