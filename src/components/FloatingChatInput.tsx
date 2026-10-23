// src/components/FloatingChatInput.tsx — Minimalist chat input (Zero Neon)
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BinIsotipo } from "./BinBrand";

const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

interface Props {
    promptText: string;
    charsPerFrame?: number;
    sendFrame: number;
}

export const FloatingChatInput: React.FC<Props> = ({ promptText, charsPerFrame = 2.4, sendFrame }) => {
    const frame = useCurrentFrame();

    const typed = Math.min(promptText.length, Math.floor(frame * charsPerFrame));
    const currentText = promptText.slice(0, typed);
    const sent = frame >= sendFrame;

    const btnScale = sent
        ? interpolate(frame, [sendFrame, sendFrame + 3, sendFrame + 9], [0.86, 0.86, 1], {
            ...C,
            easing: Easing.out(Easing.cubic),
        })
        : 1;

    return (
        <div
            style={{
                width: 820,
                boxSizing: "border-box",
                backgroundColor: "rgba(18, 22, 34, 0.85)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 999,
                padding: "0 24px 0 28px",
                height: 76,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
            }}
        >
            <div style={{ width: 32, height: 32, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BinIsotipo size={32} color="#ffffff" />
            </div>
            <div style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap", paddingLeft: 4 }}>
                <span
                    style={{
                        color: "#F8FAFC",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 22,
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                        whiteSpace: "nowrap",
                    }}
                >
                    {currentText}
                    {!sent && <span style={{ color: "#94A3B8", marginLeft: 2, opacity: frame % 6 < 3 ? 1 : 0 }}>|</span>}
                </span>
            </div>

            <div style={{ position: "relative", width: 40, height: 40, flexShrink: 0 }}>
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: `scale(${btnScale})`,
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B0F1A" strokeWidth="2.5">
                        <line x1="12" y1="19" x2="12" y2="5" />
                        <polyline points="5 12 12 5 19 12" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
