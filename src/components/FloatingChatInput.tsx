// src/components/FloatingChatInput.tsx
import React from "react";
import { Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";

const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

interface Props {
    promptText: string;
    /** Velocidad de tecleo (2.4 caracteres por frame) */
    charsPerFrame?: number;
    /** Frame local en el que se pulsa enviar */
    sendFrame: number;
}

export const FloatingChatInput: React.FC<Props> = ({ promptText, charsPerFrame = 2.4, sendFrame }) => {
    const frame = useCurrentFrame();

    const typed = Math.min(promptText.length, Math.floor(frame * charsPerFrame));
    const currentText = promptText.slice(0, typed);
    const sent = frame >= sendFrame;

    // Snap a scale(0.82) y recuperación
    const btnScale = sent
        ? interpolate(frame, [sendFrame, sendFrame + 3, sendFrame + 9], [0.82, 0.82, 1], {
            ...C,
            easing: Easing.out(Easing.cubic),
        })
        : 1;
    // Flash #6366f1 -> blanco
    const btnBg = sent
        ? interpolateColors(frame, [sendFrame, sendFrame + 8], ["#6366f1", "#ffffff"])
        : "#ffffff";
    const arrow = sent ? interpolateColors(frame, [sendFrame, sendFrame + 8], ["#ffffff", "#000000"]) : "#000000";

    // Anillo de onda al enviar
    const ringP = interpolate(frame, [sendFrame, sendFrame + 10], [0, 1], C);
    const dotPulse = 1 + Math.sin(frame * 0.4) * 0.18;

    return (
        <div
            style={{
                width: 820,
                boxSizing: "border-box",
                backgroundColor: "rgba(16, 20, 32, 0.85)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: 24,
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.85)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                    style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: "#6366f1",
                        boxShadow: "0 0 14px #6366f1",
                        transform: `scale(${dotPulse})`,
                    }}
                />
                <span
                    style={{
                        color: "#f8fafc",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 22,
                        fontWeight: 400,
                        letterSpacing: "-0.01em",
                        whiteSpace: "nowrap",
                    }}
                >
                    {currentText}
                    {!sent && <span style={{ color: "#6366f1", marginLeft: 2, opacity: frame % 6 < 3 ? 1 : 0 }}>|</span>}
                </span>
            </div>

            <div style={{ position: "relative", width: 40, height: 40 }}>
                {sent && ringP < 1 && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            border: "2px solid #6366f1",
                            opacity: 0.8 * (1 - ringP),
                            transform: `scale(${1 + ringP * 1.6})`,
                        }}
                    />
                )}
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: btnBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: `scale(${btnScale})`,
                        boxShadow: sent ? `0 0 ${24 * (1 - ringP)}px rgba(99, 102, 241, 0.9)` : "none",
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={arrow} strokeWidth="2.5">
                        <line x1="12" y1="19" x2="12" y2="5" />
                        <polyline points="5 12 12 5 19 12" />
                    </svg>
                </div>
            </div>
        </div>
    );
};