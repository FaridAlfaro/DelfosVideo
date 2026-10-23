// src/components/AiChatWorkflow.tsx  (frames locales 0–112 = globales 78–190)
// 100% código: DOM + SVG. Sin imágenes estáticas.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FloatingChatInput } from "./FloatingChatInput";

const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FONT = "'Inter', sans-serif";

// Marcas locales (global − 78)
const DURATION = 112;
const SEND = 30; // global 108
const ZOOM = 32; // global 110
const GAUGE_START = 40; // global 118
const BARS_START = 47; // global 125
const HEAT_START = 57; // global 135
const SHIFT_START = 82; // global 160

const STAGE_W = 1240;
const DASH_H = 470;
const PILL_CENTER_Y = 36;

/** Despliegue 3D de una tarjeta (nunca aparece "de golpe") */
const unfold = (frame: number, start: number, dur = 9): React.CSSProperties => {
    const p = interpolate(frame, [start, start + dur], [0, 1], { ...C, easing: Easing.out(Easing.cubic) });
    return {
        opacity: p,
        transformOrigin: "50% 0%",
        transform: `perspective(900px) translateY(${(1 - p) * 36}px) rotateX(${(1 - p) * -22}deg) scale(${0.92 + 0.08 * p})`,
    };
};

const cardBase: React.CSSProperties = {
    boxSizing: "border-box",
    backgroundColor: "rgba(18, 22, 36, 0.65)",
    borderRadius: 20,
    border: "1px solid rgba(255, 255, 255, 0.09)",
    padding: 20,
    height: 350,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
};

const cardTitle: React.CSSProperties = { fontFamily: FONT, fontSize: 16, color: "#94a3b8", fontWeight: 500 };

// ───────────────────────── 1. Sentiment Dial (0 → 95 %) ─────────────────────────
const SentimentCard: React.FC = () => {
    const frame = useCurrentFrame();
    const p = interpolate(frame, [GAUGE_START, GAUGE_START + 22], [0, 1], { ...C, easing: Easing.out(Easing.cubic) });
    const R = 82;
    const CIRC = 2 * Math.PI * R;
    const offset = CIRC * (1 - 0.95 * p);
    const value = Math.round(95 * p);
    const glow = 8 + Math.sin(frame * 0.3) * 4;

    return (
        <div style={{ ...cardBase, alignItems: "center", justifyContent: "space-between", ...unfold(frame, GAUGE_START) }}>
            <span style={cardTitle}>Satisfaction &amp; Sentiment Rate</span>
            <div style={{ position: "relative", width: 190, height: 190 }}>
                <svg width="190" height="190" viewBox="0 0 190 190" style={{ transform: "rotate(-90deg)" }}>
                    <defs>
                        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="50%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#ec4899" />
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
                        style={{ filter: `drop-shadow(0 0 ${glow}px rgba(99, 102, 241, 0.85))` }}
                    />
                    {/* destello giratorio continuo */}
                    {p > 0.15 && (
                        <circle
                            cx="95"
                            cy="95"
                            r={R}
                            fill="transparent"
                            stroke="rgba(255,255,255,0.55)"
                            strokeWidth="14"
                            strokeLinecap="round"
                            strokeDasharray={`${CIRC * 0.05} ${CIRC}`}
                            transform={`rotate(${frame * 7} 95 95)`}
                            opacity={0.5}
                        />
                    )}
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
                    <span style={{ fontFamily: FONT, fontSize: 50, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                        {value}%
                    </span>
                    <span style={{ fontFamily: FONT, fontSize: 13, color: "#06b6d4", fontWeight: 600 }}>Positive</span>
                </div>
            </div>
            <span style={{ fontFamily: FONT, fontSize: 13, color: "#cbd5e1", textAlign: "center" }}>
                Overall public reception is overwhelmingly favorable
            </span>
        </div>
    );
};

// ───────────────────────── 2. Share of Voice (3 barras con rebote elástico) ─────────────────────────
const BARS = [
    { label: "Delfos", pct: 85, delay: 0, bg: "linear-gradient(180deg,#ec4899 0%,#6366f1 100%)", color: "#f472b6", glow: "rgba(236,72,153,0.5)" },
    { label: "Comp A", pct: 40, delay: 3, bg: "#475569", color: "#94a3b8", glow: "rgba(0,0,0,0.5)" },
    { label: "Comp B", pct: 55, delay: 6, bg: "linear-gradient(180deg,#06b6d4 0%,#0284c7 100%)", color: "#38bdf8", glow: "rgba(6,182,212,0.4)" },
];
const MAX_BAR = 196;

const ShareOfVoiceCard: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    return (
        <div style={{ ...cardBase, justifyContent: "space-between", ...unfold(frame, BARS_START) }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={cardTitle}>Competitive Share of Voice</span>
                <span style={{ fontFamily: FONT, fontSize: 13, color: "#a5b4fc", fontWeight: 600 }}>+58.4% vs Industry</span>
            </div>
            <div style={{ height: 270, display: "flex", alignItems: "flex-end", justifyContent: "space-around", position: "relative" }}>
                {/* líneas guía */}
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
                {BARS.map((b, i) => {
                    const s = spring({
                        frame: Math.max(0, frame - (BARS_START + b.delay)),
                        fps,
                        config: { damping: 10, stiffness: 180 },
                    });
                    const live = frame > BARS_START + 24 ? Math.sin(frame * 0.2 + i * 1.7) * 2.5 : 0;
                    const h = Math.max(0, (b.pct / 100) * MAX_BAR * s + live);
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
                                    boxShadow: `0 10px 28px ${b.glow}`,
                                    position: "relative",
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: 7,
                                        borderRadius: "10px 10px 0 0",
                                        backgroundColor: "#fff",
                                        opacity: 0.45,
                                    }}
                                />
                            </div>
                            <span style={{ fontFamily: FONT, fontSize: 13, color: "#94a3b8" }}>{b.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ───────────────────────── 3. Heatmap con ondas pulsantes ─────────────────────────
const COLS = 12;
const ROWS = 7;

const HeatmapCard: React.FC = () => {
    const frame = useCurrentFrame();
    const r1 = (frame * 0.28) % 10;
    const r2 = (frame * 0.28 + 5) % 10;

    return (
        <div style={{ ...cardBase, ...unfold(frame, HEAT_START) }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={cardTitle}>Live Sentiment Heatmap</span>
                <span style={{ fontFamily: FONT, fontSize: 13, color: "#4ade80", fontWeight: 600 }}>● LIVE</span>
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
                    const d1 = Math.hypot(i - 3, j - 2);
                    const d2 = Math.hypot(i - 9, j - 4);
                    const w = Math.max(Math.exp(-Math.pow(d1 - r1, 2) / 1.3), Math.exp(-Math.pow(d2 - r2, 2) / 1.3));
                    const idle = 0.12 + 0.1 * Math.sin(frame * 0.2 + i * 0.7 + j);
                    const v = Math.min(1, w + idle);
                    const hot = (i + j * 1.2) / (COLS + ROWS * 1.2);
                    const red = Math.round(99 + (236 - 99) * hot);
                    const grn = Math.round(102 + (72 - 102) * hot);
                    const blu = Math.round(241 + (153 - 241) * hot);
                    const spawn = interpolate(frame - (HEAT_START + (i + j) * 0.8), [0, 4], [0, 1], C);
                    return (
                        <div
                            key={n}
                            style={{
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                backgroundColor: `rgba(${red},${grn},${blu},${0.25 + 0.75 * v})`,
                                boxShadow: w > 0.5 ? `0 0 ${8 + 10 * w}px rgba(${red},${grn},${blu},0.9)` : "none",
                                transform: `scale(${(0.7 + 0.9 * v) * spawn})`,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

// ───────────────────────── 4. Predictive Trend (stroke-dasharray) ─────────────────────────
const TREND_PATH = "M10 210 C 60 200, 90 170, 130 175 S 200 120, 250 130 S 330 90, 380 80 S 450 40, 490 25";

const TrendCard: React.FC = () => {
    const frame = useCurrentFrame();
    const enter = interpolate(frame, [SHIFT_START, SHIFT_START + 10], [0, 1], { ...C, easing: Easing.out(Easing.cubic) });
    const p = interpolate(frame, [SHIFT_START + 2, SHIFT_START + 26], [0, 1], { ...C, easing: Easing.out(Easing.cubic) });
    const projected = Math.round(38 * p);
    const pulse = (frame * 0.25) % 1;

    return (
        <div
            style={{
                ...cardBase,
                position: "absolute",
                left: STAGE_W + 24,
                top: 96,
                width: 560,
                height: DASH_H,
                backgroundColor: "rgba(11, 15, 25, 0.88)",
                backdropFilter: "blur(24px)",
                padding: "26px 28px",
                opacity: enter,
                transform: `translateX(${(1 - enter) * 120}px)`,
                boxShadow: "0 35px 85px rgba(0,0,0,0.9)",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: "#fff" }}>Predictive Trend</span>
                <span style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: "#38bdf8", fontVariantNumeric: "tabular-nums" }}>
                    +{projected}%
                </span>
            </div>
            <span style={{ fontFamily: FONT, fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Projected brand momentum · next 90 days</span>

            <svg width="504" height="290" viewBox="0 0 504 290" style={{ marginTop: 28 }}>
                <defs>
                    <linearGradient id="trendStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="60%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                    <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                    <clipPath id="trendClip">
                        <rect x="0" y="0" width={10 + 490 * p} height="290" />
                    </clipPath>
                </defs>
                {[40, 100, 160, 220].map((y) => (
                    <line key={y} x1="0" x2="504" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
                ))}
                <path d={`${TREND_PATH} L490 260 L10 260 Z`} fill="url(#trendArea)" clipPath="url(#trendClip)" />
                <path
                    d={TREND_PATH}
                    pathLength={1}
                    fill="none"
                    stroke="url(#trendStroke)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={1}
                    strokeDashoffset={1 - p}
                    style={{ filter: "drop-shadow(0 0 10px rgba(99,102,241,0.8))" }}
                />
                {p > 0.96 && (
                    <>
                        <circle cx="490" cy="25" r={6 + pulse * 16} fill="none" stroke="#ec4899" strokeOpacity={1 - pulse} strokeWidth="2" />
                        <circle cx="490" cy="25" r="6" fill="#fff" />
                    </>
                )}
            </svg>
        </div>
    );
};

// ───────────────────────── Escena ─────────────────────────
export const AiChatWorkflow: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const promptText = "What do people think about the brand's new presentation?";

    // Cámara virtual: resorte (damping 11, stiffness 160). scale 1.35→0.94, translateY +130→−40, rotateX 6→0
    const cam = spring({ frame: Math.max(0, frame - ZOOM), fps, config: { damping: 11, stiffness: 160 } });
    const camScale = interpolate(cam, [0, 1], [1.35, 0.94]);
    const camY = interpolate(cam, [0, 1], [130, -40]);
    const camRX = interpolate(cam, [0, 1], [6, 0]);

    // Flotación continua de cámara (nada queda quieto)
    const floatY = Math.sin(frame * 0.13) * 7;
    const floatRX = Math.cos(frame * 0.09) * 0.5;

    // Rapid Feature Flash: matriz 3D rotateY(8deg) deslizando a la izquierda
    const shiftP = interpolate(frame, [SHIFT_START, SHIFT_START + 16], [0, 1], { ...C, easing: Easing.inOut(Easing.cubic) });
    const driftP = interpolate(frame, [SHIFT_START + 16, DURATION], [0, 1], C);
    const tx = -270 * shiftP - 40 * driftP;
    const rotY = 8 * shiftP + 1 * driftP;

    // Entrada rápida (3f) y salida zoom-blur (últimos 4f) hacia el Acto I del outro
    const enter = interpolate(frame, [0, 3], [0, 1], C);
    const exitP = interpolate(frame, [DURATION - 4, DURATION], [0, 1], { ...C, easing: Easing.bezier(0.4, 0, 0.2, 1) });

    const mentions = Math.round(interpolate(frame, [ZOOM, DURATION], [132000, 148900], C));

    return (
        <AbsoluteFill
            style={{
                opacity: enter * (1 - exitP),
                filter: `blur(${(1 - enter) * 12 + exitP * 18}px)`,
                transform: `scale(${1 + 0.2 * exitP})`,
            }}
        >
            <AbsoluteFill style={{ perspective: 1400, overflow: "hidden" }}>
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: 347 - PILL_CENTER_Y,
                        width: STAGE_W,
                        marginLeft: -STAGE_W / 2,
                        transformOrigin: `50% ${PILL_CENTER_Y}px`,
                        transform: `translate(${tx}px, ${camY + floatY}px) scale(${camScale}) rotateX(${camRX + floatRX}deg) rotateY(${rotY}deg)`,
                    }}
                >
                    {/* A. Input pill */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <FloatingChatInput promptText={promptText} charsPerFrame={2.4} sendFrame={SEND} />
                    </div>

                    {/* B. Dashboard */}
                    <div
                        style={{
                            position: "absolute",
                            top: 96,
                            left: 0,
                            width: STAGE_W,
                            height: DASH_H,
                            boxSizing: "border-box",
                            backgroundColor: "rgba(11, 15, 25, 0.88)",
                            backdropFilter: "blur(24px)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 24,
                            padding: "26px 32px",
                            boxShadow: "0 35px 85px rgba(0,0,0,0.9)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 20,
                            ...unfold(frame, ZOOM + 1, 10),
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 34 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: "#fff" }}>Delfos AI Analytics</span>
                                <span
                                    style={{
                                        backgroundColor: "rgba(99,102,241,0.2)",
                                        border: "1px solid rgba(99,102,241,0.4)",
                                        borderRadius: 16,
                                        padding: "3px 12px",
                                        fontSize: 12,
                                        color: "#a5b4fc",
                                        fontFamily: FONT,
                                        fontWeight: 600,
                                        fontVariantNumeric: "tabular-nums",
                                    }}
                                >
                                    Live Stream • {mentions.toLocaleString("en-US")} Mentions
                                </span>
                            </div>
                            <span
                                style={{
                                    backgroundColor: "rgba(236,72,153,0.15)",
                                    border: "1px solid rgba(236,72,153,0.35)",
                                    borderRadius: 14,
                                    padding: "4px 12px",
                                    fontSize: 13,
                                    color: "#f472b6",
                                    fontFamily: FONT,
                                    fontWeight: 600,
                                }}
                            >
                                Surge +{(42.8 * interpolate(frame, [ZOOM, ZOOM + 24], [0, 1], C)).toFixed(1)}%
                            </span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr 1.1fr", gap: 20 }}>
                            <SentimentCard />
                            <ShareOfVoiceCard />
                            <HeatmapCard />
                        </div>
                    </div>

                    {/* C. Trend predictivo (entra al desplazarse el dashboard) */}
                    <TrendCard />
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};