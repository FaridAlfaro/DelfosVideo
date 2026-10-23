// src/components/RetroFrame.tsx
// Marco 35 mm que CRECE de tarjeta pequeña (con glow) a pantalla completa, con sub-cortes rápidos y caption encima.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { FONT, OUT, SNAP, ZoomBlurOut, lerp, ramp } from "./Theme";

interface Props {
    srcs: string[];
    /** Una o varias frases; si son varias se alternan cada `captionEvery` frames */
    captions?: React.ReactNode[];
    captionEvery?: number;
    portrait?: boolean;
    expandStart?: number;
    expandEnd?: number;
    cutEvery?: number;
    /** Look "silueta a contraluz" (alto contraste, sin marco) */
    silhouette?: boolean;
}

const CROPS = [
    { s: 1.1, x: 50, y: 50 },
    { s: 1.4, x: 28, y: 62 },
    { s: 1.2, x: 72, y: 40 },
    { s: 1.55, x: 45, y: 30 },
    { s: 1.3, x: 60, y: 70 },
];

export const RetroFrame: React.FC<Props> = ({
    srcs,
    captions = [],
    captionEvery = 45,
    portrait = false,
    expandStart = 36,
    expandEnd = 54,
    cutEvery = 14,
    silhouette = false,
}) => {
    const frame = useCurrentFrame();

    const small = portrait ? { w: 380, h: 540 } : { w: 660, h: 410 };
    const p = silhouette ? 1 : ramp(frame, expandStart, expandEnd, SNAP);
    const drift = lerp(0.88, 1, ramp(frame, 0, expandEnd));
    const w = lerp(small.w * drift, 1920, p);
    const h = lerp(small.h * drift, 1080, p);
    const radius = lerp(28, 0, p);

    const cut = Math.floor(frame / cutEvery);
    const phase = frame % cutEvery;
    const crop = CROPS[cut % CROPS.length];
    const src = srcs[cut % srcs.length];
    const flash = lerp(1.7, 1.04, ramp(phase, 0, 3, OUT));
    const zoom = crop.s + phase * 0.006;

    const filter = silhouette
        ? `grayscale(1) contrast(2.4) brightness(${0.85 * flash})`
        : `brightness(${flash}) contrast(0.94) saturate(0.96)`;

    // Captions alternados
    const capIdx = captions.length ? Math.min(captions.length - 1, Math.floor(frame / captionEvery)) : 0;
    const capRel = frame - capIdx * captionEvery;
    const capIn = ramp(capRel, 3, 8);
    const capOut = captions.length > 1 && capIdx < captions.length - 1 ? ramp(capRel, captionEvery - 4, captionEvery) : 0;

    return (
        <ZoomBlurOut frames={3}>
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
                <div
                    style={{
                        width: w,
                        height: h,
                        borderRadius: radius,
                        overflow: "hidden",
                        position: "relative",
                        backgroundColor: "#0c0c0c",
                        border: p < 1 ? "1px solid rgba(255,255,255,0.14)" : "none",
                        boxShadow: `0 0 ${90 * (1 - p)}px rgba(255,255,255,0.14), 0 25px 70px rgba(0,0,0,0.85)`,
                    }}
                >
                    <Img
                        src={src}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: `${crop.x}% ${crop.y}%`,
                            transform: `scale(${zoom}) translateX(${Math.sin(frame * 0.25) * 4}px)`,
                            filter,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: silhouette
                                ? "radial-gradient(circle at 50% 42%, transparent 18%, rgba(0,0,0,0.96) 62%)"
                                : "radial-gradient(circle, transparent 55%, rgba(12,12,12,0.65) 100%)",
                        }}
                    />
                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1, mixBlendMode: "overlay" }}>
                        <filter id="retroNoise">
                            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed={frame} stitchTiles="stitch" />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#retroNoise)" />
                    </svg>
                </div>

                {captions.length > 0 && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: FONT,
                            fontSize: 64,
                            fontWeight: 600,
                            letterSpacing: "-0.03em",
                            color: "#fff",
                            gap: 18,
                            opacity: capIn * (1 - capOut),
                            filter: `blur(${(1 - capIn) * 12 + capOut * 16}px)`,
                            transform: `scale(${lerp(0.9, 1, capIn) * (1 + capOut * 0.2)})`,
                            textShadow: "0 0 30px rgba(0,0,0,0.85), 0 0 12px rgba(255,255,255,0.25)",
                        }}
                    >
                        {captions[capIdx]}
                    </div>
                )}
            </AbsoluteFill>
        </ZoomBlurOut>
    );
};
