// src/components/Theme.tsx — helpers de timing y primitivas compartidas (Minimalismo Cero Neón)
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const FONT = "'Inter', sans-serif";
export const SERIF = "'Newsreader', 'Playfair Display', Georgia, serif";

export const OUT = Easing.out(Easing.cubic);
export const IN = Easing.in(Easing.cubic);
export const IO = Easing.inOut(Easing.cubic);
export const EXIT = Easing.bezier(0.4, 0, 0.2, 1);
export const SNAP = Easing.bezier(0.7, 0, 0.2, 1);
export const BACK = Easing.out(Easing.back(1.7));
export const EDITORIAL = Easing.bezier(0.16, 1, 0.3, 1);

type Ease = (t: number) => number;

/** Progreso 0→1 entre dos frames (con clamp y easing opcional) */
export const ramp = (frame: number, a: number, b: number, easing?: Ease): number =>
    interpolate(frame, [a, b], [0, 1], { ...C, easing });
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Salida estándar: disolución óptica suave */
export const exitFx = (frame: number, duration: number, n = 4) => {
    const p = ramp(frame, duration - n, duration, EXIT);
    return { p, opacity: 1 - p, blur: 14 * p, scale: 1 + 0.06 * p };
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

/** Texto con degradado editorial sobrio (blanco plata / índigo suave) */
export const GradientText: React.FC<{
    children?: React.ReactNode;
    colors?: string[];
    speed?: number;
    style?: React.CSSProperties;
}> = ({ children, colors = ["#F8FAFC", "#CBD5E1", "#93C5FD"], speed = 1.5, style }) => {
    const frame = useCurrentFrame();
    const stops = [...colors, colors[0]].join(",");
    return (
        <span
            style={{
                display: "inline-block",
                padding: "0 0.08em",
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

/** Superficie de cristal ahumado mate con borde ultra-fino de 1px (Cero Neón) */
export const gradBorder = (
    _frame: number,
    bg = "rgba(12, 16, 26, 0.78)",
    _c1 = "rgba(255, 255, 255, 0.09)",
    _c2 = "rgba(255, 255, 255, 0.09)",
    w = 1,
    _speed = 0,
): React.CSSProperties => ({
    backgroundColor: bg,
    backdropFilter: "blur(24px)",
    border: `${w}px solid rgba(255, 255, 255, 0.09)`,
});
