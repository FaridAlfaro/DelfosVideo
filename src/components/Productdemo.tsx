// src/components/Productdemo.tsx (480 frames = 27–43 s, f810–f1290 global)
// Actos 5 y 6:
// - Gauge llega a 84% en local 12–36 con halo sincronizado que se bloquea limpiamente al completar
// - Insights de inteligencia de mercado en local 96, 124 y 152 (sin reacciones coloquiales de clientes)
// - Dock sube en local 186–206
// - Segundo prompt se teclea en local 214–262 y clic en 264 (f1074 global)
// - Barras de Brand Equity de BIN vs Industria en local 312–380 con badge estable en el mes pico
// - Stats cuentan en local 396–460
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, IO, OUT, ZoomBlurOut, gradBorder, lerp, ramp } from "./Theme";
import { PromptBar } from "./Promptbar";
import { Cursor, GradientWipe, Icon } from "./Ui";
import { BinIsotipo, BinLoader1 } from "./BinBrand";


const PROMPT2 = "Show me brand image comparison";
const DOCK_W = 760;
const DOCK_H = 96;
const DOCK_LEFT = 90;
const DOCK_BOTTOM = 62;
const CLICK2 = 264; // f1074 global

const typedSlice = (s: string, f: number, start: number, cps: number) =>
    s.slice(0, Math.max(0, Math.min(s.length, Math.floor((f - start) * cps))));

const card: React.CSSProperties = {
    boxSizing: "border-box",
    backgroundColor: "rgba(18,22,36,0.72)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 22,
    padding: 22,
    backdropFilter: "blur(14px)",
};
const label: React.CSSProperties = { fontFamily: FONT, fontSize: 18, color: "#94a3b8", fontWeight: 500 };

const Window: React.FC<{ title: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ title, children, style }) => (
    <div
        style={{
            position: "absolute",
            left: 180,
            top: 60,
            width: 1560,
            height: 830,
            borderRadius: 26,
            overflow: "hidden",
            backgroundColor: "rgba(11,14,24,0.94)",
            border: "1px solid rgba(255,255,255,0.13)",
            boxShadow: "0 50px 120px rgba(0,0,0,0.85), 0 0 120px rgba(20,217,245,0.15)",
            ...style,
        }}
    >
        <div style={{ height: 46, display: "flex", alignItems: "center", gap: 9, padding: "0 18px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c, opacity: 0.85 }} />
            ))}
            <span style={{ fontFamily: FONT, fontSize: 15, color: "#94a3b8", marginLeft: 14 }}>{title}</span>
        </div>
        {children}
    </div>
);

// ───────────────────────── RESPUESTA IA ─────────────────────────
const Step: React.FC<{ f: number; at: number; doneAt: number; text: string }> = ({ f, at, doneAt, text }) => {
    const p = ramp(f, at, at + 8, OUT);
    const done = f >= doneAt;
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: p, transform: `translateX(${(1 - p) * -24}px)`, filter: `blur(${(1 - p) * 6}px)` }}>
            {done ? (
                <div style={{ width: 26, height: 26, borderRadius: 13, background: "linear-gradient(135deg,#14d9f5,#0029c7)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${lerp(1.4, 1, ramp(f, doneAt, doneAt + 5, OUT))})` }}>
                    <Icon name="check" size={15} sw={3} />
                </div>
            ) : (
                <div style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BinLoader1 size={22} color="#14d9f5" rotation={f * 12} />
                </div>
            )}
            <span style={{ fontFamily: FONT, fontSize: 19, color: done ? "#e2e8f0" : "#94a3b8" }}>{text}</span>
        </div>
    );
};

const ResponseUI: React.FC<{ f: number }> = ({ f }) => {
    // Gauge 0 -> 84% de local 12 a 36
    const gp = ramp(f, 12, 36, OUT);
    const R = 92;
    const CIRC = 2 * Math.PI * R;
    const value = Math.round(84 * gp);
    const pulseLight = interpolate(f, [12, 16, 24], [0, 1, 0], C);

    const mentions = Math.round(lerp(98000, 145280, ramp(f, 10, 100, OUT)) + (f > 100 ? (f - 100) * 9 : 0));
    
    // Insights estratégicos objetivos y profesionales (sin frases coloquiales de clientes)
    const insights = [
        "Campaign reach drove +42.8% engagement surge",
        "Sentiment indexed across multi-channel customer data",
        "Market adoption velocity outpaces industry benchmark",
    ];
    const bars = [
        { n: "Positive", v: 84, c: "linear-gradient(90deg,#0029c7,#14d9f5)" },
        { n: "Neutral", v: 11, c: "linear-gradient(90deg,#64748b,#94a3b8)" },
        { n: "Negative", v: 5, c: "linear-gradient(90deg,#e11d48,#ec4899)" },
    ];
    const reply = typedSlice("Brand sentiment index: 84% positive across all channels.", f, 60, 1.3);
    const sweep = (f * 9) % 900;

    return (
        <div style={{ display: "flex", height: 784, position: "relative" }}>
            {/* Pico de luz en f12 */}
            {pulseLight > 0 && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "radial-gradient(circle at 45% 40%, rgba(20,217,245,0.25) 0%, transparent 60%)",
                        opacity: pulseLight,
                        pointerEvents: "none",
                    }}
                />
            )}

            {/* Chat */}
            <div style={{ width: 420, boxSizing: "border-box", padding: 24, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 22 }}>
                <div
                    style={{
                        alignSelf: "flex-end",
                        maxWidth: 340,
                        padding: "14px 18px",
                        borderRadius: 18,
                        fontFamily: FONT,
                        fontSize: 19,
                        color: "#f1f5f9",
                        opacity: ramp(f, 4, 12),
                        filter: `blur(${(1 - ramp(f, 4, 12)) * 8}px)`,
                        ...gradBorder(f, "#141a2c", "#1e293b", "#3b82f6", 1.5, 2),
                    }}
                >
                    What do people think about the new brand launch?
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: ramp(f, 8, 16) }}>
                    <BinIsotipo size={26} color="#ffffff" />
                    <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "0.02em" }}>BIN</span>
                </div>
                <Step f={f} at={10} doneAt={24} text="Collecting multi-channel signals" />
                <Step f={f} at={20} doneAt={38} text="Reading warehouse data streams" />
                <Step f={f} at={32} doneAt={54} text="Scoring sentiment index" />
                <div style={{ fontFamily: FONT, fontSize: 20, color: "#e2e8f0", lineHeight: 1.4, minHeight: 56 }}>
                    {reply}
                    {f > 60 && f < 96 && <span style={{ color: "#94a3b8" }}>|</span>}
                </div>
            </div>

            {/* Respuesta Dashboard */}
            <div style={{ flex: 1, boxSizing: "border-box", padding: 26, display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 44 }}>
                    <span style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: "#fff" }}>Brand launch · Sentiment</span>
                    <div style={{ display: "flex", gap: 12 }}>
                        <span style={{ ...chip, color: "#4ade80", borderColor: "rgba(74,222,128,0.4)", backgroundColor: "rgba(74,222,128,0.12)" }}>
                            <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 5, background: "#4ade80", marginRight: 8, opacity: 0.6 + 0.4 * Math.sin(f * 0.4) }} />
                            Live · {mentions.toLocaleString("en-US")} signals
                        </span>
                        <span style={{ ...chip, color: "#14d9f5", borderColor: "rgba(20,217,245,0.4)", backgroundColor: "rgba(20,217,245,0.12)" }}>
                            Surge +{(42.8 * ramp(f, 12, 36, OUT)).toFixed(1)}%
                        </span>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 18, height: 290 }}>
                    <div style={{ ...card, width: 350, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", ...unfold(f, 6) }}>
                        <span style={label}>Sentiment index</span>
                        <div style={{ position: "relative", width: 200, height: 200 }}>
                            <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
                                <defs>
                                    <linearGradient id="gaugeG" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0" stopColor="#0029c7" />
                                        <stop offset="0.5" stopColor="#1461e0" />
                                        <stop offset="1" stopColor="#14d9f5" />
                                    </linearGradient>
                                </defs>
                                <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16" />
                                <circle
                                    cx="100"
                                    cy="100"
                                    r={R}
                                    fill="none"
                                    stroke="url(#gaugeG)"
                                    strokeWidth="16"
                                    strokeLinecap="round"
                                    strokeDasharray={CIRC}
                                    strokeDashoffset={CIRC * (1 - 0.84 * gp)}
                                    style={{ filter: `drop-shadow(0 0 ${9 + Math.sin(f * 0.3) * 4}px rgba(20,217,245,0.85))` }}
                                />
                                {/* Halo luminoso: activo SOLO durante el llenado (12..36), bloqueándose y desvaneciéndose limpiamente */}
                                {gp > 0.15 && f <= 38 && (
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r={R}
                                        fill="none"
                                        stroke="#ffffff"
                                        strokeWidth="16"
                                        strokeLinecap="round"
                                        strokeDasharray={`${CIRC * 0.04} ${CIRC}`}
                                        transform={`rotate(${-90 + gp * 302.4} 100 100)`}
                                        style={{
                                            opacity: interpolate(f, [12, 32, 38], [0.6, 1, 0], C),
                                            filter: "drop-shadow(0 0 12px #14d9f5)",
                                        }}
                                    />
                                )}
                            </svg>
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 60, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                                {value}%
                            </div>
                        </div>
                        <span style={{ fontFamily: FONT, fontSize: 15, color: "#cbd5e1" }}>Net positive sentiment</span>
                    </div>

                    <div style={{ ...card, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", ...unfold(f, 14) }}>
                        <span style={label}>Sentiment breakdown</span>
                        {bars.map((b, i) => {
                            const p = ramp(f, 16 + i * 6, 36 + i * 6, OUT);
                            return (
                                <div key={b.n}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontSize: 18, color: "#e2e8f0", marginBottom: 8 }}>
                                        <span>{b.n}</span>
                                        <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{Math.round(b.v * p)}%</span>
                                    </div>
                                    <div style={{ height: 16, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                                        <div style={{ width: `${b.v * p}%`, height: "100%", borderRadius: 8, background: b.c, boxShadow: "0 0 18px rgba(20,217,245,0.4)" }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Key insights sin reacciones coloquiales */}
                <div style={{ ...card, flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: 14, ...unfold(f, 24) }}>
                    <span style={label}>Key strategic insights</span>
                    {insights.map((t, i) => {
                        const start = i === 0 ? 96 : i === 1 ? 124 : 152;
                        return (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, opacity: ramp(f, start, start + 4) }}>
                                <div style={{ width: 12, height: 12, borderRadius: 6, background: "linear-gradient(135deg,#14d9f5,#0029c7)", boxShadow: "0 0 12px #14d9f5" }} />
                                <span style={{ fontFamily: FONT, fontSize: 23, color: "#f1f5f9" }}>
                                    {typedSlice(t, f, start, 1.8)}
                                </span>
                            </div>
                        );
                    })}
                    <div style={{ position: "absolute", top: 0, bottom: 0, left: sweep - 200, width: 140, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)", transform: "skewX(-20deg)" }} />
                </div>
            </div>
        </div>
    );
};

const chip: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "7px 16px",
    borderRadius: 18,
    border: "1px solid",
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
};

const unfold = (f: number, start: number, dur = 9): React.CSSProperties => {
    const p = ramp(f, start, start + dur, OUT);
    return { opacity: p, transformOrigin: "50% 0%", transform: `perspective(900px) translateY(${(1 - p) * 34}px) rotateX(${(1 - p) * -22}deg) scale(${0.93 + 0.07 * p})` };
};

// ───────────────────────── COMPARATIVA ─────────────────────────
const PINK = [38, 52, 44, 66, 60, 92, 70, 84, 78, 96, 88, 100];
const INDIGO = [30, 34, 40, 42, 48, 52, 50, 56, 58, 62, 60, 66];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CompareUI: React.FC<{ fc: number }> = ({ fc }) => {
    const { fps } = useVideoConfig();
    const spr = (delay: number, damping = 11) => spring({ frame: Math.max(0, fc - delay), fps, config: { damping, stiffness: 170 } });

    // Corrección del bug de Brand Equity: fijar el indicador en el mes pico (Diciembre) con animación suave y estable
    const peakMonth = 11;
    const peakP = ramp(fc, 30, 44, OUT);
    const tip = "+51.5%";

    const stat = (target: number, a: number, b: number) => target * ramp(fc, a, b, OUT);
    const sov = [
        { n: "BIN", v: 85, c: "linear-gradient(90deg,#14d9f5,#0029c7)" },
        { n: "Competitor A", v: 40, c: "#475569" },
        { n: "Competitor B", v: 55, c: "linear-gradient(90deg,#06b6d4,#0284c7)" },
    ];
    const GW = 70;

    return (
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18, height: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", gap: 18, height: 470 }}>
                {/* Brand Equity: BIN vs Industria */}
                <div style={{ ...card, flex: 1.6, position: "relative", ...unfold(fc, 4) }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, color: "#fff" }}>Brand Equity Growth</span>
                        <span style={{ fontFamily: FONT, fontSize: 15, color: "#94a3b8" }}>
                            <span style={{ color: "#14d9f5" }}>■</span> BIN &nbsp; <span style={{ color: "#818cf8" }}>■</span> Industry Avg
                        </span>
                    </div>
                    <div style={{ position: "absolute", left: 30, bottom: 50, right: 30, height: 290, display: "flex", alignItems: "flex-end" }}>
                        {[0.25, 0.5, 0.75, 1].map((g) => (
                            <div key={g} style={{ position: "absolute", left: 0, right: 0, bottom: g * 290, height: 1, background: "rgba(255,255,255,0.06)" }} />
                        ))}
                        {PINK.map((v, i) => {
                            const s = spr(8 + i * 2);
                            const live = fc > 50 ? Math.sin(fc * 0.18 + i) * 3 : 0;
                            return (
                                <div key={i} style={{ width: GW, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 5, position: "relative", height: "100%" }}>
                                    <div style={{ width: 24, height: Math.max(0, (INDIGO[i] / 100) * 290 * s + live * 0.5), borderRadius: "6px 6px 2px 2px", background: "linear-gradient(180deg,#818cf8,#4f46e5)" }} />
                                    <div style={{ width: 24, height: Math.max(0, (v / 100) * 290 * s + live), borderRadius: "6px 6px 2px 2px", background: "linear-gradient(180deg,#14d9f5,#0029c7)", boxShadow: "0 0 22px rgba(20,217,245,0.4)" }} />
                                    <span style={{ position: "absolute", bottom: -28, fontFamily: FONT, fontSize: 13, color: "#64748b" }}>{MONTHS[i]}</span>
                                </div>
                            );
                        })}
                        {/* Tooltip estable y anclado en el mes pico, sin saltos bruscos */}
                        {fc > 28 && (
                            <div
                                style={{
                                    position: "absolute",
                                    left: peakMonth * GW + GW / 2 - 58,
                                    bottom: (PINK[peakMonth] / 100) * 290 + 16,
                                    width: 116,
                                    textAlign: "center",
                                    padding: "8px 0",
                                    borderRadius: 12,
                                    background: "#ffffff",
                                    color: "#030a2e",
                                    fontFamily: FONT,
                                    fontSize: 18,
                                    fontWeight: 700,
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(20,217,245,0.5)",
                                    opacity: peakP,
                                    transform: `translateY(${(1 - peakP) * 12}px) scale(${0.9 + 0.1 * peakP})`,
                                }}
                            >
                                {tip} vs ind.
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
                    {[
                        { v: stat(84, 14, 64), suf: "%", l: "Positive sentiment · verified", c: "#14d9f5", at: 14 },
                        { v: stat(2.4, 20, 70), suf: "M", l: "Signals indexed · last 7 days", c: "#c4b5fd", at: 20, dec: 1 },
                    ].map((s, i) => (
                        <div key={i} style={{ ...card, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", background: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0 10px, rgba(18,22,36,0.7) 10px 20px)", ...unfold(fc, s.at) }}>
                            <span style={{ fontFamily: FONT, fontSize: 84, fontWeight: 700, color: s.c, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}>
                                {s.dec ? s.v.toFixed(1) : Math.round(s.v)}
                                {s.suf}
                            </span>
                            <span style={label}>{s.l}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: "flex", gap: 18, flex: 1 }}>
                <div style={{ ...card, flex: 1.6, display: "flex", flexDirection: "column", justifyContent: "space-between", ...unfold(fc, 24) }}>
                    <span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: "#fff" }}>Share of Voice</span>
                    {sov.map((r, i) => {
                        const s = spr(24 + i * 4, 10);
                        return (
                            <div key={r.n} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <span style={{ width: 150, fontFamily: FONT, fontSize: 16, color: "#cbd5e1" }}>{r.n}</span>
                                <div style={{ flex: 1, height: 18, borderRadius: 9, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                                    <div style={{ width: `${Math.min(100, r.v * s)}%`, height: "100%", background: r.c, borderRadius: 9 }} />
                                </div>
                                <span style={{ width: 56, fontFamily: FONT, fontSize: 18, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums", textAlign: "right" }}>{Math.round(r.v * Math.min(1, s))}%</span>
                            </div>
                        );
                    })}
                </div>
                {[
                    { bg: "linear-gradient(135deg,#a5f3fc,#22d3ee)", v: stat(54, 30, 68), t: "Win rate", at: 30 },
                    { bg: "linear-gradient(135deg,#93c5fd,#3b82f6)", v: stat(21, 36, 74), t: "Market share delta", at: 36 },
                ].map((c, i) => (
                    <div key={i} style={{ flex: 0.6, borderRadius: 22, background: c.bg, padding: 22, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#06121a", ...unfold(fc, c.at), transform: `${unfold(fc, c.at).transform} translateY(${Math.sin(fc * 0.12 + i * 2) * 4}px)` }}>
                        <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 600 }}>{c.t}</span>
                        <span style={{ fontFamily: FONT, fontSize: 70, fontWeight: 800, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>{Math.round(c.v)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ───────────────────────── ESCENA ─────────────────────────
export const ProductDemo: React.FC = () => {
    const f = useCurrentFrame();

    // Ventana de respuesta
    const wp = ramp(f, 0, 20, OUT);
    const camS = lerp(0.95, 1.05, ramp(f, 0, 180, IO)) + Math.sin(f * 0.05) * 0.004;
    const camY = Math.sin(f * 0.09) * 6 - ramp(f, 100, 190, IO) * 20;

    // Dock + 2º prompt: dock sube en 186–206
    const dockP = ramp(f, 186, 206, OUT);
    const typed2 = typedSlice(PROMPT2, f, 214, 0.65);
    const clicked = f >= CLICK2;
    const press = clicked ? interpolate(f, [CLICK2, CLICK2 + 3, CLICK2 + 9], [1, 1, 0], C) : 0;
    const sendScale = clicked ? interpolate(f, [CLICK2, CLICK2 + 3, CLICK2 + 9], [0.82, 0.82, 1], { ...C, easing: OUT }) : 1;
    const ringP = ramp(f, CLICK2, CLICK2 + 12);
    const dockText = f >= CLICK2 + 6 ? "" : typed2;

    // Cursor hacia el botón enviar del dock
    const sendX = DOCK_LEFT + DOCK_W - DOCK_H * 0.22 - DOCK_H * 0.25;
    const sendY = 1080 - DOCK_BOTTOM - DOCK_H / 2;
    const cp = ramp(f, 236, CLICK2 - 3, IO);
    const curOpacity = ramp(f, 236, 244) * (1 - ramp(f, CLICK2 + 8, CLICK2 + 16));

    // Barrido + cambio de UI
    const wipeP = ramp(f, 266, 302, IO);
    const showResp = f < 284;
    const fc = f - 284;
    const cp2 = ramp(fc, 0, 26, OUT);
    const keystone = `perspective(2000px) rotateY(${lerp(-26, -3, cp2) + Math.sin(fc * 0.03) * 2.5}deg) rotateX(${lerp(9, 2, cp2)}deg) scale(${lerp(0.9, 1.02, ramp(fc, 0, 170))})`;

    return (
        <ZoomBlurOut frames={4}>
            {showResp && (
                <AbsoluteFill style={{ transform: `translateY(${camY}px) scale(${camS})` }}>
                    <Window
                        title="BIN · Real-time Sentiment Intelligence"
                        style={{
                            opacity: wp * (1 - ramp(f, 270, 284)),
                            filter: `blur(${(1 - wp) * 8 + ramp(f, 270, 284) * 14}px)`,
                            transform: `perspective(1800px) rotateX(${(1 - wp) * 14}deg) translateY(${(1 - wp) * 70}px) scale(${0.88 + 0.12 * wp})`,
                        }}
                    >
                        <ResponseUI f={f} />
                    </Window>
                </AbsoluteFill>
            )}

            {!showResp && (
                <AbsoluteFill>
                    <Window
                        title="BIN · Competitive Benchmark & Brand Equity"
                        style={{
                            opacity: cp2,
                            filter: `blur(${(1 - cp2) * 12}px)`,
                            transform: keystone,
                            height: 830,
                        }}
                    >
                        <CompareUI fc={fc} />
                    </Window>
                </AbsoluteFill>
            )}

            {/* Dock persistente */}
            <div
                style={{
                    position: "absolute",
                    left: DOCK_LEFT,
                    bottom: DOCK_BOTTOM,
                    opacity: dockP,
                    filter: `blur(${(1 - dockP) * 10}px)`,
                    transform: `translateY(${(1 - dockP) * 80}px)`,
                    zIndex: 50,
                }}
            >
                <PromptBar
                    width={DOCK_W}
                    height={DOCK_H}
                    fontSize={26}
                    frame={f}
                    typed={dockText}
                    placeholder="Ask anything..."
                    caret={f < CLICK2}
                    sendScale={sendScale}
                    sendBg={clicked && ringP < 0.7 ? "#0029c7" : "#fff"}
                    sendArrow={clicked && ringP < 0.7 ? "#fff" : "#000"}
                    ringP={ringP}
                />
            </div>
            <Cursor x={lerp(1250, sendX + 6, cp)} y={lerp(760, sendY + 10, cp)} press={press} opacity={curOpacity} size={52} />

            <GradientWipe p={wipeP} />

            {/* Entrada desde la estrella oscura del prompt */}
            <AbsoluteFill style={{ backgroundColor: "#07080d", opacity: 1 - ramp(f, 0, 12), pointerEvents: "none" }} />
        </ZoomBlurOut>
    );
};
