// src/components/Ui.tsx — Minimalist Smoked Glass Primitives, Icon, Cursor, Isotipo, GradientWipe (Zero Neon)
import React from "react";
import { AbsoluteFill } from "remotion";
import { lerp } from "./Theme";
import { BinIsotipo } from "./BinBrand";

export const Isotipo: React.FC<{ size?: number; color?: string; style?: React.CSSProperties; rotation?: number }> = ({
    size = 32,
    color = "#ffffff",
    style,
    rotation = 0,
}) => <BinIsotipo size={size} color={color} style={style} rotation={rotation} />;

/** Minimalist Matte Smoked Glass Tile */
export const Tile: React.FC<{
    size?: number;
    radius?: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}> = ({ size = 120, radius, style, children }) => (
    <div
        style={{
            width: size,
            height: size,
            borderRadius: radius ?? size * 0.28,
            backgroundColor: "rgba(12, 16, 26, 0.78)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.09)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...style,
        }}
    >
        {children}
    </div>
);

export type IconName = "cart" | "heart" | "user" | "chat" | "bag" | "trend" | "star" | "pin" | "bars" | "target" | "bolt" | "shield" | "check";

export const Icon: React.FC<{ name: IconName; size?: number; color?: string; sw?: number }> = ({
    name,
    size = 24,
    color = "#ffffff",
    sw = 2,
}) => {
    const p = { fill: "none", stroke: color, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
    let body: React.ReactNode = null;
    switch (name) {
        case "cart":
            body = (
                <>
                    <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L19 8H6.2" {...p} />
                    <circle cx="9" cy="19" r="1.4" {...p} />
                    <circle cx="17" cy="19" r="1.4" {...p} />
                </>
            );
            break;
        case "heart":
            body = <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.4A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" {...p} />;
            break;
        case "user":
            body = (
                <>
                    <circle cx="10" cy="8" r="3.5" {...p} />
                    <path d="M3.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5" {...p} />
                    <path d="M19 7v6M16 10h6" {...p} />
                </>
            );
            break;
        case "chat":
            body = <path d="M4 5h16v11H10l-5 4v-4H4z" {...p} />;
            break;
        case "bag":
            body = (
                <>
                    <path d="M5 8h14l-1 12H6z" {...p} />
                    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" {...p} />
                </>
            );
            break;
        case "trend":
            body = <path d="M3 17l5-5 4 4 8-9M15 7h5v5" {...p} />;
            break;
        case "star":
            body = <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" {...p} />;
            break;
        case "pin":
            body = (
                <>
                    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" {...p} />
                    <circle cx="12" cy="10" r="2.4" {...p} />
                </>
            );
            break;
        case "bars":
            body = <path d="M5 20V12M12 20V5M19 20v-5" {...p} strokeWidth={sw + 1.5} />;
            break;
        case "target":
            body = (
                <>
                    <circle cx="12" cy="12" r="8" {...p} />
                    <circle cx="12" cy="12" r="4" {...p} />
                    <circle cx="12" cy="12" r="0.8" {...p} />
                </>
            );
            break;
        case "bolt":
            body = <path d="M13 2L4 14h7l-1 8 9-12h-7z" {...p} />;
            break;
        case "shield":
            body = <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z" {...p} />;
            break;
        case "check":
            body = <path d="M5 12.5l4.5 4.5L19 7.5" {...p} />;
            break;
    }
    return (
        <svg width={size} height={size} viewBox="0 0 24 24">
            {body}
        </svg>
    );
};

/** Vector pointer cursor */
export const Cursor: React.FC<{ x: number; y: number; press?: number; size?: number; opacity?: number }> = ({
    x,
    y,
    press = 0,
    size = 64,
    opacity = 1,
}) => (
    <div
        style={{
            position: "absolute",
            left: x,
            top: y,
            width: size,
            height: size,
            opacity,
            transform: `translate(-6px, -4px) scale(${1 - 0.14 * press})`,
            transformOrigin: "10% 8%",
            pointerEvents: "none",
            zIndex: 100,
        }}
    >
        <svg width={size} height={size} viewBox="0 0 28 28">
            <path d="M5 3 L5 22 L10 17.6 L13.4 25 L16.6 23.5 L13.2 16.2 L20 16 Z" fill="#fff" stroke="#0b0b10" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
    </div>
);

/** Organic gradient transition wipe (Style END.mp4 — Sapphire, Indigo, Soft Violet, Silver) */
export const GradientWipe: React.FC<{ p: number }> = ({ p }) => {
    if (p <= 0 || p >= 1) return null;
    return (
        <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", zIndex: 90 }}>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 2200,
                    height: 2600,
                    marginTop: -1300,
                    marginLeft: -1100,
                    transform: `translateX(${lerp(-2700, 2700, p)}px) rotate(-16deg)`,
                    background:
                        "linear-gradient(90deg, rgba(30,58,138,0) 0%, #1E3A8A 24%, #4338CA 44%, #6D28D9 62%, rgba(248,250,252,0.45) 78%, rgba(248,250,252,0) 100%)",
                    filter: "blur(65px)",
                }}
            />
        </AbsoluteFill>
    );
};
