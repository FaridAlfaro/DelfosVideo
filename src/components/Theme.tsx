// src/components/theme.tsx — helpers de timing y primitivas compartidas
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const FONT = "'Inter', sans-serif";
export const SERIF = "'Playfair Display', serif";

export const OUT = Easing.out(Easing.cubic);
export const IN = Easing.in(Easing.cubic);
export const IO = Easing.inOut(Easing.cubic);
export const EXIT = Easing.bezier(0.4, 0, 0.2, 1);
export const SNAP = Easing.bezier(0.7, 0, 0.2, 1);
export const BACK = Easing.out(Easing.back(1.7));

type Ease = (t: number) => number;

/** Progreso 0→1 entre dos frames (con clamp y easing opcional) */
export const ramp = (frame: number, a: number, b: number, easing?: Ease): number =>
    interpolate(frame, [a, b], [0, 1], { ...C, easing });
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Salida estándar: zoom-blur hacia cámara (scale→1.35, blur→24px, opacity→0) */
export const exitFx = (frame: number, duration: number, n = 4) => {
    const p = ramp(frame, duration - n, duration, EXIT);
    return { p, opacity: 1 - p, blur: 24 * p, scale: 1 + 0.35 * p };
};

export const ZoomBlurOut: React.FC<{ frames?: number; children?: React.ReactNode }> = ({ frames = 4, children }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();
    const e = exitFx(frame, durationInFrames, frames);
    return (
        <AbsoluteFill style={{ opacity: e.opacity, filter: `blur(${e.blur}px)`, transform: `scale(${e.scale})` }}>
            {children}
        </AbsoluteFill>
    );
};

/** Texto con degradado que se desplaza continuamente (loop perfecto: el patrón se repite cada 320px) */
export const GradientText: React.FC<{
    children?: React.ReactNode;
    colors?: string[];
    speed?: number;
    style?: React.CSSProperties;
}> = ({ children, colors = ["#fb7185", "#a78bfa", "#60a5fa"], speed = 3, style }) => {
    const frame = useCurrentFrame();
    const stops = [...colors, colors[0]].join(",");
    return (
        <span
            style={{
                display: "inline-block",
                padding: "0 0.1em",
                backgroundImage: `linear-gradient(90deg, ${stops})`,
                backgroundSize: "320px 100%",
                backgroundRepeat: "repeat-x",
                backgroundPositionX: `${frame * speed}px`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
                ...style,
            }}
        >
            {children}
        </span>
    );
};

/** Borde de gradiente cónico que rota con el frame */
export const gradBorder = (
    frame: number,
    bg: string,
    c1 = "#6366f1",
    c2 = "#ec4899",
    w = 1.5,
    speed = 2,
): React.CSSProperties => ({
    border: `${w}px solid transparent`,
    background: `linear-gradient(${bg}, ${bg}) padding-box, conic-gradient(from ${frame * speed}deg, ${c1}, ${c2}, ${c1}) border-box`,
});