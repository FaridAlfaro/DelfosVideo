// src/components/AiChatWorkflow.tsx — Minimalist workflow dashboard (Zero Neon)
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FloatingChatInput } from "./FloatingChatInput";

const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FONT = "'Inter', sans-serif";

const DURATION = 112;
const SEND = 30;
const ZOOM = 32;
const GAUGE_START = 40;
const BARS_START = 47;
const HEAT_START = 57;
const SHIFT_START = 82;

const STAGE_W = 1240;
const DASH_H = 470;
const PILL_CENTER_Y = 36;

const unfold = (frame: number, start: number, dur = 9): React.CSSProperties => {
    const p = interpolate(frame, [start, start + dur], [0, 1], { ...C, easing: Easing.out(Easing.cubic) });
    return {
        opacity: p,
        transformOrigin: "50% 0%",
        transform: `translateY(${(1 - p) * 20}px) scale(${0.96 + 0.04 * p})`,
    };
};

const cardBase: React.CSSProperties = {
    boxSizing: "border-box",
    backgroundColor: "rgba(12, 16, 26, 0.78)",
    backdropFilter: "blur(24px)",
    borderRadius: 20,
    border: "1px solid rgba(255, 255, 255, 0.09)",
    padding: 20,
    height: 350,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
};

const cardTitle: React.CSSProperties = { fontFamily: FONT, fontSize: 16, color: "#94A3B8", fontWeight: 500 };

const SentimentCard: React.FC = () => {
    const frame = useCurrentFrame();
    const p = interpolate(frame, [GAUGE_START, GAUGE_START + 22], [0, 1], { ...C, easing: Easing.out(Easing.cubic) });
    const R = 82;
    const CIRC = 2 * Math.PI * R;
    const offset = CIRC * (1 - 0.84 * p);
    const value = Math.round(84 * p);

    return (
        <div style={{ ...cardBase, alignItems: "center", justifyContent: "space-between", ...unfold(frame, GAUGE_START) }}>
            <span style={cardTitle}>Satisfaction &amp; Sentiment Rate</span>
            <div style={{ position: "relative", width: 190, height: 190 }}>
                <svg width="190" height="190" viewBox="0 0 190 190" style={{ transform: "rotate(-90deg)" }}>
                    <defs>
                        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366F1" />
                            <stop offset="100%" stopColor="#E2E8F0" />
                        </linearGradient>
                    </defs>
                    <circle cx="95" cy="95" r={R} fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
                    <circle
                        cx="95"
                        cy="95"
                        r={R}
                        fill="transparent"
                        stroke="url(#gaugeGrad)"
                        strokeWidth="14"
                        strokeDasharray={CIRC}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                    />
                </svg>
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <span style={{ fontFamily: FONT, fontSize: 50, fontWeight: 700, color: "#F8FAFC", fontVariantNumeric: "tabular-nums" }}>
                        {value}%
                    </span>
                    <span style={{ fontFamily: FONT, fontSize: 13, color: "#CBD5E1", fontWeight: 600 }}>Positive</span>
                </div>
            </div>
            <span style={{ fontFamily: FONT, fontSize: 13, color: "#CBD5E1", textAlign: "center" }}>
                Overall public reception is overwhelmingly favorable
            </span>
        </div>
    );
};

const BARS = [
    { label: "BIN", pct: 85, delay: 0, bg: "linear-gradient(180deg, #818CF8 0%, #3B82F6 100%)", color: "#F8FAFC" },
    { label: "Comp A", pct: 40, delay: 3, bg: "rgba(255, 255, 255, 0.16)", color: "#94A3B8" },
    { label: "Comp B", pct: 55, delay: 6, bg: "rgba(148, 163, 184, 0.35)", color: "#CBD5E1" },
];
const MAX_BAR = 196;

const ShareOfVoiceCard: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    return (
        <div style={{ ...cardBase, justifyContent: "space-between", ...unfold(frame, BARS_START) }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={cardTitle}>Competitive Share of Voice</span>
                <span style={{ fontFamily: FONT, fontSize: 13, color: "#CBD5E1", fontWeight: 600 }}>+51.5% vs Industry</span>
            </div>
            <div style={{ height: 270, display: "flex", alignItems: "flex-end", justifyContent: "space-around", position: "relative" }}>
                {[0.25, 0.5, 0.75].map((g) => (
                    <div
                        key={g}
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 22 + MAX_BAR * g,
                            height: 1,
                            backgroundColor: "rgba(255,255,255,0.05)",
                        }}
                    />
                ))}
                {BARS.map((b) => {
                    const s = spring({
                        frame: Math.max(0, frame - (BARS_START + b.delay)),
                        fps,
                        config: { damping: 16, stiffness: 180 },
                    });
                    const h = Math.max(0, (b.pct / 100) * MAX_BAR * s);
                    return (
                        <div key={b.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                            <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: b.color, fontVariantNumeric: "tabular-nums" }}>
                                {Math.round(b.pct * Math.min(1, s))}%
                            </span>
                            <div
                                style={{
                                    width: 58,
                                    height: h,
                                    background: b.bg,
                                    borderRadius: "10px 10px 4px 4px",
                                    position: "relative",
                                }}
                            />
                            <span style={{ fontFamily: FONT, fontSize: 13, color: "#94A3B8" }}>{b.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const COLS = 12;
const ROWS = 7;

const HeatmapCard: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <div style={{ ...cardBase, ...unfold(frame, HEAT_START) }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={cardTitle}>Live Sentiment Heatmap</span>
                <span style={{ fontFamily: FONT, fontSize: 13, color: "#CBD5E1", fontWeight: 600 }}>● LIVE</span>
            </div>
            <div
                style={{
                    flex: 1,
                    display: "grid",
                    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                    placeItems: "center",
                }}
            >
                {Array.from({ length: COLS * ROWS }).map((_, n) => {
                    const i = n % COLS;
                    const j = Math.floor(n / COLS);
                    const spawn = interpolate(frame - (HEAT_START + (i + j) * 0.8), [0, 4], [0, 1], C);
                    return (
                        <div
                            key={n}
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                backgroundColor: "rgba(129, 140, 248, 0.35)",
                                transform: `scale(${spawn})`,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export const AiChatWorkflow: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const promptText = "What do people think about the new brand launch?";
    const cam = spring({ frame: Math.max(0, frame - ZOOM), fps, config: { damping: 16, stiffness: 160 } });
    const camScale = interpolate(cam, [0, 1], [1.15, 0.96]);
    const camY = interpolate(cam, [0, 1], [90, -30]);
    const shiftP = interpolate(frame, [SHIFT_START, SHIFT_START + 16], [0, 1], { ...C, easing: Easing.inOut(Easing.cubic) });
    const tx = -180 * shiftP;
    const enter = interpolate(frame, [0, 4], [0, 1], C);
    const exitP = interpolate(frame, [DURATION - 4, DURATION], [0, 1], { ...C, easing: Easing.bezier(0.4, 0, 0.2, 1) });
    const mentions = Math.round(interpolate(frame, [ZOOM, DURATION], [132000, 148900], C));

    return (
        <AbsoluteFill style={{ opacity: enter * (1 - exitP) }}>
            <AbsoluteFill style={{ perspective: 1400, overflow: "hidden" }}>
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: 347 - PILL_CENTER_Y,
                        width: STAGE_W,
                        marginLeft: -STAGE_W / 2,
                        transformOrigin: `50% ${PILL_CENTER_Y}px`,
                        transform: `translate(${tx}px, ${camY}px) scale(${camScale})`,
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <FloatingChatInput promptText={promptText} charsPerFrame={2.4} sendFrame={SEND} />
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 96,
                            left: 0,
                            width: STAGE_W,
                            height: DASH_H,
                            boxSizing: "border-box",
                            backgroundColor: "rgba(10, 13, 22, 0.88)",
                            backdropFilter: "blur(24px)",
                            border: "1px solid rgba(255, 255, 255, 0.09)",
                            borderRadius: 24,
                            padding: "26px 32px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 20,
                            ...unfold(frame, ZOOM + 1, 10),
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 34 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>BIN Intelligence</span>
                                <span
                                    style={{
                                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                                        border: "1px solid rgba(255, 255, 255, 0.12)",
                                        borderRadius: 999,
                                        padding: "3px 12px",
                                        fontSize: 12,
                                        color: "#CBD5E1",
                                        fontFamily: FONT,
                                        fontWeight: 600,
                                        fontVariantNumeric: "tabular-nums",
                                    }}
                                >
                                    Live Stream • {mentions.toLocaleString("en-US")} Mentions
                                </span>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr 1.1fr", gap: 20 }}>
                            <SentimentCard />
                            <ShareOfVoiceCard />
                            <HeatmapCard />
                        </div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
