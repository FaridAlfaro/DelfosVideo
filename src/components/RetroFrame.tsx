// src/components/RetroFrame.tsx — 35mm B-roll frame (Minimalist Matte Glass, Zero Neon)
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { FONT, OUT, SNAP, ZoomBlurOut, lerp, ramp } from "./Theme";

interface Props {
    srcs: string[];
    captions?: React.ReactNode[];
    captionEvery?: number;
    portrait?: boolean;
    expandStart?: number;
    expandEnd?: number;
    cutEvery?: number;
    silhouette?: boolean;
}

const CROPS = [
    { s: 1.08, x: 50, y: 50 },
    { s: 1.18, x: 35, y: 58 },
    { s: 1.14, x: 65, y: 42 },
    { s: 1.22, x: 48, y: 36 },
];

export const RetroFrame: React.FC<Props> = ({
    srcs,
    captions = [],
    captionEvery = 45,
    portrait = false,
    expandStart = 36,
    expandEnd = 54,
    cutEvery = 18,
    silhouette = false,
}) => {
    const frame = useCurrentFrame();

    const small = portrait ? { w: 420, h: 560 } : { w: 720, h: 440 };
    const p = silhouette ? 1 : ramp(frame, expandStart, expandEnd, SNAP);
    const drift = lerp(0.94, 1, ramp(frame, 0, expandEnd));
    const w = lerp(small.w * drift, 1920, p);
    const h = lerp(small.h * drift, 1080, p);
    const radius = lerp(24, 0, p);

    const cut = Math.floor(frame / cutEvery);
    const phase = frame % cutEvery;
    const crop = CROPS[cut % CROPS.length];
    const src = srcs[cut % srcs.length];
    const zoom = crop.s + phase * 0.003;

    const filter = silhouette
        ? "grayscale(1) contrast(1.85) brightness(0.55)"
        : "brightness(0.92) contrast(0.98) saturate(0.9)";

    const capIdx = captions.length ? Math.min(captions.length - 1, Math.floor(frame / captionEvery)) : 0;
    const capRel = frame - capIdx * captionEvery;
    const capIn = ramp(capRel, 2, 8, OUT);
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
                        backgroundColor: "rgba(12, 16, 26, 0.78)",
                        border: p < 1 ? "1px solid rgba(255, 255, 255, 0.09)" : "none",
                    }}
                >
                    <Img
                        src={src}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: `${crop.x}% ${crop.y}%`,
                            transform: `scale(${zoom})`,
                            filter,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: silhouette
                                ? "radial-gradient(circle at 50% 45%, rgba(5,8,17,0.35) 15%, rgba(2,4,9,0.92) 72%)"
                                : "radial-gradient(circle, transparent 50%, rgba(8,10,18,0.68) 100%)",
                        }}
                    />
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
                            color: "#F8FAFC",
                            gap: 18,
                            opacity: capIn * (1 - capOut),
                            filter: `blur(${(1 - capIn) * 8 + capOut * 10}px)`,
                            transform: `scale(${lerp(0.95, 1, capIn)})`,
                        }}
                    >
                        {captions[capIdx]}
                    </div>
                )}
            </AbsoluteFill>
        </ZoomBlurOut>
    );
};
