// src/components/ProductDemo.tsx (480 frames = 27–43 s, f810–f1290 global)
// Actos 5 y 6:
// - Gauge llega a 84% en local 12–36 (voz L15 en f822 = local 12); pico de luz (pulse) en local 12
// - Insights tecleados empezando en local 96, 124 y 152 (voz L16 en f909 = local 99)
// - Dock sube en local 186–206 (L17 en f996 = local 186)
// - Segundo prompt se teclea en local 214–262 y clic en 264 (f1074 global)
// - Barras de Brand Equity rebotan en local 312–380 (L19 en f1122 = local 312)
// - Stats cuentan en local 396–460 (L20 en f1206 = local 396)
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, IO, OUT, ZoomBlurOut, gradBorder, lerp, ramp } from "./Theme";
import { PromptBar } from "./Promptbar";
import { Cursor, GradientWipe, Icon, Isotipo } from "./Ui";

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
    backgroundColor: "rgba(18,22,36,0.7)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 22,
    padding: 22,
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
            backgroundColor: "rgba(11,14,24,0.92)",
            border: "1px solid rgba(255,255,255,0.13)",
            boxShadow: "0 50px 120px rgba(0,0,0,0.85), 0 0 120px rgba(99,102,241,0.18)",
            ...style,
        }}
    >
        <div style={{ height: 46, display: "flex", alignItems: "center", gap: 9, padding: "0 18px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c, opacity: 0.85 }} />
            ))}
            <span style={{ fontFamily: FONT, fontSize: 15, color: "#8b93a7", marginLeft: 14 }}>{title}</span>
        </div>
        {children}
    </div>
);

// ───────────────────────── RESPUESTA ─────────────────────────
const Step: React.FC<{ f: number; at: number; doneAt: number; text: string }> = ({ f, at, doneAt, text }) => {
    const p = ramp(f, at, at + 8, OUT);
    const done = f >= doneAt;
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: p, transform: `translateX(${(1 - p) * -24}px)`, filter: `blur(${(1 - p) * 6}px)` }}>
            {done ? (
                <div style={{ width: 26, height: 26, borderRadius: 13, background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${lerp(1.4, 1, ramp(f, doneAt, doneAt + 5, OUT))})` }}>
                    <Icon name="check" size={15} sw={3} />
                </div>
            ) : (
                <svg width="26" height="26" viewBox="0 0 26 26" style={{ transform: `rotate(${f * 14}deg)` }}>
                    <circle cx="13" cy="13" r="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
                    <path d="M13 3a10 10 0 0 1 10 10" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
                </svg>
            )}
            <span style={{ fontFamily: FONT, fontSize: 19, color: done ? "#e2e8f0" : "#94a3b8" }}>{text}</span>
        </div>
    );
};

const ResponseUI: React.FC<{ f: number }> = ({ f }) => {
    // Sincronía Acto 5: gauge 0 -> 84% de local 12 a 36 (L15 f822 = local 12)
    const gp = ramp(f, 12, 36, OUT);
    const R = 92;
    const CIRC = 2 * Math.PI * R;
    const value = Math.round(84 * gp);
    const pulseLight = interpolate(f, [12, 16, 24], [0, 1, 0], C);

    const mentions = Math.round(lerp(98000, 145280, ramp(f, 10, 100, OUT)) + (f > 100 ? (f - 100) * 9 : 0));
    const insights = [
        "The launch video drove the +42.8% surge",
        "Overwhelmingly positive reception across channels",
        "Pricing is the ONLY worry (4.2% of volume)",
    ];
    const bars = [
        { n: "Positive", v: 84, c: "linear-gradient(90deg,#6366f1,#06b6d4)" },
        { n: "Neutral", v: 11, c: "linear-gradient(90deg,#64748b,#94a3b8)" },
        { n: "Negative", v: 5, c: "linear-gradient(90deg,#ec4899,#fb7185)" },
    ];
    const reply = typedSlice("Overall reception is strongly positive.", f, 60, 1.2);
    const sweep = (f * 9) % 900;

    return (
        <div style={{ display: "flex", height: 784, position: "relative" }}>
            {/* Pico de luz en f12 (golpe ochenta y cuatro) */}
            {pulseLight > 0 && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "radial-gradient(circle at 45% 40%, rgba(99,102,241,0.3) 0%, transparent 60%)",
                        opacity: pulseLight,
                        pointerEvents: "none",
                    }}
                />
            )}

            {/* Chat */}
            <div style={{ width: 400, boxSizing: "border-box", padding: 24, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 22 }}>
                <div
                    style={{
                        alignSelf: "flex-end",
                        maxWidth: 330,
                        padding: "14px 18px",
                        borderRadius: 18,
                        fontFamily: FONT,
                        fontSize: 19,
                        color: "#f1f5f9",
                        opacity: ramp(f, 4, 12),
                        filter: `blur(${(1 - ramp(f, 4, 12)) * 8}px)`,
                        ...gradBorder(f, "#141a2c", "#6366f1", "#ec4899", 1.5, 2),
                    }}
                >
                    What do people think about the new brand launch?
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: ramp(f, 8, 16) }}>
                    <Isotipo size={26} />
                    <span style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, color: "#fff" }}>Delfos</span>
                </div>
                <Step f={f} at={10} doneAt={24} text="Collecting mentions" />
                <Step f={f} at={20} doneAt={38} text="Reading 6 sources" />
                <Step f={f} at={32} doneAt={54} text="Scoring sentiment" />
                <div style={{ fontFamily: FONT, fontSize: 20, color: "#e2e8f0", lineHeight: 1.4, minHeight: 56 }}>
                    {reply}
                    {f > 60 && f < 96 && <span style={{ color: "#a5b4fc" }}>|</span>}
                </div>
            </div>

            {/* Respuesta */}
            <div style={{ flex: 1, boxSizing: "border-box", padding: 26, display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 44 }}>
                    <span style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: "#fff" }}>Brand launch · Sentiment</span>
                    <div style={{ display: "flex", gap: 12 }}>
                        <span style={{ ...chip, color: "#4ade80", borderColor: "rgba(74,222,128,0.4)", backgroundColor: "rgba(74,222,128,0.12)" }}>
                            <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 5, background: "#4ade80", marginRight: 8, opacity: 0.6 + 0.4 * Math.sin(f * 0.4) }} />
                            Live · {mentions.toLocaleString("en-US")}
                        </span>
                        <span style={{ ...chip, color: "#f472b6", borderColor: "rgba(244,114,182,0.4)", backgroundColor: "rgba(236,72,153,0.14)" }}>
                            Surge +{(42.8 * ramp(f, 12, 36, OUT)).toFixed(1)}%
                        </span>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 18, height: 290 }}>
                    <div style={{ ...card, width: 350, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", ...unfold(f, 6) }}>
                        <span style={label}>Positive sentiment</span>
                        <div style={{ position: "relative", width: 200, height: 200 }}>
                            <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
                                <defs>
                                    <linearGradient id="gaugeG" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0" stopColor="#6366f1" />
                                        <stop offset="0.5" stopColor="#06b6d4" />
                                        <stop offset="1" stopColor="#ec4899" />
                                    </linearGradient>
                                </defs>
                                <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16" />
                                <circle cx="100" cy="100" r={R} fill="none" stroke="url(#gaugeG)" strokeWidth="16" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - 0.84 * gp)} style={{ filter: `drop-shadow(0 0 ${9 + Math.sin(f * 0.3) * 4}px rgba(99,102,241,0.85))` }} />
                                {gp > 0.15 && <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="16" strokeLinecap="round" strokeDasharray={`${CIRC * 0.05} ${CIRC}`} transform={`rotate(${f * 7} 100 100)`} />}
                            </svg>
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 60, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                                {value}%
                            </div>
                        </div>
                        <span style={{ fontFamily: FONT, fontSize: 15, color: "#cbd5e1" }}>Overwhelmingly favorable</span>
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
                                        <div style={{ width: `${b.v * p}%`, height: "100%", borderRadius: 8, background: b.c, boxShadow: "0 0 18px rgba(99,102,241,0.5)" }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Key insights sincronizados con L16: starts en 96, 124, 152 */}
                <div style={{ ...card, flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: 14, ...unfold(f, 24) }}>
                    <span style={label}>Key insights</span>
                    {insights.map((t, i) => {
                        const start = i === 0 ? 96 : i === 1 ? 124 : 152;
                        return (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, opacity: ramp(f, start, start + 4) }}>
                                <div style={{ width: 12, height: 12, borderRadius: 6, background: "linear-gradient(135deg,#6366f1,#ec4899)", boxShadow: "0 0 12px #6366f1" }} />
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
    const idx = 5.5 + 4.5 * Math.sin(fc * 0.05);
    const gi = Math.max(0, Math.min(11, Math.round(idx)));
    const tip = (((PINK[gi] - INDIGO[gi]) / INDIGO[gi]) * 100).toFixed(1);

    // L20 side by side instantly: conteo dinámico
    const stat = (target: number, a: number, b: number) => target * ramp(fc, a, b, OUT);
    const sov = [
        { n: "Delfos", v: 85, c: "linear-gradient(90deg,#ec4899,#6366f1)" },
        { n: "Competitor A", v: 40, c: "#475569" },
        { n: "Competitor B", v: 55, c: "linear-gradient(90deg,#06b6d4,#0284c7)" },
    ];
    const GW = 70;
    return (
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18, height: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", gap: 18, height: 470 }}>
                {/* L19: Brand Equity bars bouncing */}
                <div style={{ ...card, flex: 1.6, position: "relative", ...unfold(fc, 4) }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, color: "#fff" }}>Brand Equity</span>
                        <span style={{ fontFamily: FONT, fontSize: 15, color: "#94a3b8" }}>
                            <span style={{ color: "#f472b6" }}>■</span> Delfos &nbsp; <span style={{ color: "#818cf8" }}>■</span> Industry
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
                                    <div style={{ width: 24, height: Math.max(0, (v / 100) * 290 * s + live), borderRadius: "6px 6px 2px 2px", background: "linear-gradient(180deg,#f472b6,#ec4899)", boxShadow: "0 0 22px rgba(236,72,153,0.4)" }} />
                                    <span style={{ position: "absolute", bottom: -28, fontFamily: FONT, fontSize: 13, color: "#64748b" }}>{MONTHS[i]}</span>
                                </div>
                            );
                        })}
                        {fc > 36 && (
                            <div style={{ position: "absolute", left: idx * GW + GW / 2 - 55, bottom: (PINK[gi] / 100) * 290 + 16, width: 110, textAlign: "center", padding: "7px 0", borderRadius: 12, background: "#fff", color: "#0b0b10", fontFamily: FONT, fontSize: 20, fontWeight: 700, boxShadow: "0 10px 30px rgba(0,0,0,0.5)", opacity: ramp(fc, 36, 42) }}>
                                +{tip}%
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
                    {[
                        { v: stat(84, 14, 64), suf: "%", l: "Positive sentiment · today", c: "#22d3ee", at: 14 },
                        { v: stat(2.4, 20, 70), suf: "M", l: "Mentions · last 7 days", c: "#c4b5fd", at: 20, dec: 1 },
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
                    { bg: "linear-gradient(135deg,#f9a8d4,#ec4899)", v: stat(21, 36, 74), t: "New accounts", at: 36 },
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
                        title="Delfos Intelligence · Brand launch"
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
                        title="Delfos Intelligence · Brand image comparison"
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
                    sendBg={clicked && ringP < 0.7 ? "#6366f1" : "#fff"}
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
