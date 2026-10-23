// src/components/Productdemo.tsx (480 frames = 27–43 s, f810–f1290 global)
// Acto 4:
// - Cero Loaders en el Chatbot: usa únicamente isotipo.svg con resplandor orgánico suave en índigo/plata y checks minimalistas (✓) en blanco/gris plata.
// - Paleta minimalista del Dashboard: ventana rgba(10, 13, 22, 0.88), tarjetas internas rgba(255, 255, 255, 0.03) con borde 1px solid rgba(255, 255, 255, 0.07).
// - Gauge de Sentimiento (84%): trazo de arco limpio con gradiente lineal sobrio (#6366F1 a #E2E8F0), sin halos neón, llenado f12..36 y estático en 84%.
// - Gráfico de Brand Equity: barra de BIN en azul/índigo editorial (#3B82F6 a #818CF8) e industria en gris pizarra translúcido (rgba(255, 255, 255, 0.16)) + badge "+51.5% vs ind." anclado en Diciembre.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BinIsotipo } from "./BinBrand";
import { PromptBar, sendOffsetX } from "./Promptbar";
import { C, FONT, IO, OUT, ZoomBlurOut, lerp, ramp } from "./Theme";
import { Cursor, GradientWipe, Icon } from "./Ui";

const PROMPT2 = "Show me brand image comparison";
const DOCK_W = 760;
const DOCK_H = 88;
const DOCK_LEFT = 90;
const DOCK_BOTTOM = 62;
const CLICK2 = 264; // f1074 global

const typedSlice = (s: string, f: number, start: number, cps: number) =>
    s.slice(0, Math.max(0, Math.min(s.length, Math.floor((f - start) * cps))));

const card: React.CSSProperties = {
    boxSizing: "border-box",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    borderRadius: 22,
    padding: 22,
    backdropFilter: "blur(24px)",
};

const label: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: 17,
    color: "#94A3B8",
    fontWeight: 500,
};

const Window: React.FC<{ title: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
    title,
    children,
    style,
}) => (
    <div
        style={{
            position: "absolute",
            left: 180,
            top: 60,
            width: 1560,
            height: 830,
            borderRadius: 26,
            overflow: "hidden",
            backgroundColor: "rgba(10, 13, 22, 0.88)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.09)",
            ...style,
        }}
    >
        <div
            style={{
                height: 46,
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "0 18px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
            }}
        >
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c, opacity: 0.75 }} />
            ))}
            <span style={{ fontFamily: FONT, fontSize: 15, color: "#94A3B8", marginLeft: 14 }}>{title}</span>
        </div>
        {children}
    </div>
);

// ───────────────────────── RESPUESTA IA (CERO LOADERS, SOLO ISOTIPO.SVG + CHECK MINIMALISTA) ─────────────────────────
const Step: React.FC<{ f: number; at: number; doneAt: number; text: string }> = ({ f, at, doneAt, text }) => {
    const p = ramp(f, at, at + 8, OUT);
    const done = f >= doneAt;
    const doneP = ramp(f, doneAt, doneAt + 6, OUT);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: p,
                transform: `translateX(${(1 - p) * -16}px)`,
            }}
        >
            <div
                style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    backgroundColor: done ? "rgba(255, 255, 255, 0.09)" : "rgba(255, 255, 255, 0.03)",
                    border: `1px solid ${done ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.1)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transform: done ? `scale(${lerp(0.88, 1, doneP)})` : undefined,
                }}
            >
                {done ? (
                    <Icon name="check" size={14} sw={2.6} color="#F8FAFC" />
                ) : (
                    <div
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "#CBD5E1",
                            opacity: 0.65,
                        }}
                    />
                )}
            </div>
            <span style={{ fontFamily: FONT, fontSize: 18, color: done ? "#E2E8F0" : "#94A3B8", fontWeight: done ? 500 : 400 }}>
                {text}
            </span>
        </div>
    );
};

const ResponseUI: React.FC<{ f: number }> = ({ f }) => {
    // Gauge 0 -> 84% de local 12 a 36, completamente estático después
    const gp = ramp(f, 12, 36, OUT);
    const R = 92;
    const CIRC = 2 * Math.PI * R;
    const value = Math.round(84 * gp);

    const mentions = Math.round(lerp(98000, 145280, ramp(f, 10, 100, OUT)) + (f > 100 ? (f - 100) * 9 : 0));

    const insights = [
        "Campaign reach drove +42.8% engagement surge",
        "Sentiment indexed across multi-channel customer data",
        "Market adoption velocity outpaces industry benchmark",
    ];
    const bars = [
        { n: "Positive", v: 84, c: "linear-gradient(90deg, #4338CA, #818CF8)" },
        { n: "Neutral", v: 11, c: "linear-gradient(90deg, #475569, #94A3B8)" },
        { n: "Negative", v: 5, c: "linear-gradient(90deg, #334155, #64748B)" },
    ];
    const reply = typedSlice("Brand sentiment index: 84% positive across all channels.", f, 60, 1.3);

    // Rotación suave del isotipo.svg mientras los pasos se completan (f8..58)
    const isoRespondingP = ramp(f, 8, 58, IO);
    const isoRot = lerp(0, 90, isoRespondingP);
    const replyGlowP = ramp(f, 54, 72, OUT);

    return (
        <div style={{ display: "flex", height: 784, position: "relative" }}>
            {/* Panel Izquierdo: Chatbot con únicamente isotipo.svg + gradiente orgánico */}
            <div
                style={{
                    width: 420,
                    boxSizing: "border-box",
                    padding: 24,
                    borderRight: "1px solid rgba(255, 255, 255, 0.07)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 22,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Mensaje del usuario */}
                <div
                    style={{
                        alignSelf: "flex-end",
                        maxWidth: 340,
                        padding: "14px 18px",
                        borderRadius: 18,
                        fontFamily: FONT,
                        fontSize: 18,
                        color: "#F8FAFC",
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.09)",
                        opacity: ramp(f, 4, 12),
                    }}
                >
                    What do people think about the new brand launch?
                </div>

                {/* Encabezado de respuesta IA: únicamente isotipo.svg con resplandor orgánico suave en índigo/plata detrás */}
                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        opacity: ramp(f, 8, 16),
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            width: 34,
                            height: 34,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {/* Esfera de gradiente orgánico difuso detrás del isotipo */}
                        <div
                            style={{
                                position: "absolute",
                                width: 64,
                                height: 64,
                                borderRadius: "50%",
                                background:
                                    "radial-gradient(circle, rgba(67, 56, 202, 0.65) 0%, rgba(109, 40, 217, 0.35) 55%, rgba(248, 250, 252, 0.15) 80%, transparent 100%)",
                                filter: "blur(18px)",
                                pointerEvents: "none",
                            }}
                        />
                        <BinIsotipo size={24} color="#ffffff" rotation={isoRot} />
                    </div>
                    <span style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: "#F8FAFC", letterSpacing: "0.02em" }}>
                        BIN
                    </span>
                </div>

                {/* Pasos de procesamiento con check minimalista (✓) en blanco/gris plata */}
                <Step f={f} at={10} doneAt={24} text="Collecting multi-channel signals" />
                <Step f={f} at={20} doneAt={38} text="Reading warehouse data streams" />
                <Step f={f} at={32} doneAt={54} text="Scoring sentiment index" />

                {/* Tarjeta de respuesta con barrido de gradiente orgánico suave */}
                {f >= 56 && (
                    <div
                        style={{
                            position: "relative",
                            padding: "16px 18px",
                            borderRadius: 16,
                            backgroundColor: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            overflow: "hidden",
                            opacity: replyGlowP,
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                left: -40,
                                top: -40,
                                width: 220,
                                height: 140,
                                borderRadius: "50%",
                                background:
                                    "radial-gradient(circle, rgba(67, 56, 202, 0.28) 0%, rgba(248, 250, 252, 0.06) 60%, transparent 100%)",
                                filter: "blur(30px)",
                                pointerEvents: "none",
                            }}
                        />
                        <div
                            style={{
                                position: "relative",
                                fontFamily: FONT,
                                fontSize: 19,
                                color: "#F8FAFC",
                                lineHeight: 1.45,
                                minHeight: 54,
                            }}
                        >
                            {reply}
                            {f > 60 && f < 96 && <span style={{ color: "#94A3B8" }}>|</span>}
                        </div>
                    </div>
                )}
            </div>

            {/* Panel Derecho: Respuesta Dashboard Minimalista */}
            <div style={{ flex: 1, boxSizing: "border-box", padding: 26, display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 44 }}>
                    <span style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
                        Brand launch · Sentiment
                    </span>
                    <div style={{ display: "flex", gap: 12 }}>
                        <span
                            style={{
                                ...chip,
                                color: "#E2E8F0",
                                borderColor: "rgba(255, 255, 255, 0.12)",
                                backgroundColor: "rgba(255, 255, 255, 0.04)",
                            }}
                        >
                            <span
                                style={{
                                    display: "inline-block",
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    background: "#818CF8",
                                    marginRight: 8,
                                }}
                            />
                            Live · {mentions.toLocaleString("en-US")} signals
                        </span>
                        <span
                            style={{
                                ...chip,
                                color: "#F8FAFC",
                                borderColor: "rgba(255, 255, 255, 0.14)",
                                backgroundColor: "rgba(67, 56, 202, 0.22)",
                            }}
                        >
                            Surge +{(42.8 * ramp(f, 12, 36, OUT)).toFixed(1)}%
                        </span>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 18, height: 290 }}>
                    {/* Gauge de Sentimiento (84%): arco limpio con gradiente lineal sobrio (#6366F1 a #E2E8F0), sin halos neón */}
                    <div
                        style={{
                            ...card,
                            width: 350,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                            ...unfold(f, 6),
                        }}
                    >
                        <span style={label}>Sentiment index</span>
                        <div style={{ position: "relative", width: 200, height: 200 }}>
                            <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
                                <defs>
                                    <linearGradient id="gaugeMinimalGrad" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#6366F1" />
                                        <stop offset="100%" stopColor="#E2E8F0" />
                                    </linearGradient>
                                </defs>
                                <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="15" />
                                <circle
                                    cx="100"
                                    cy="100"
                                    r={R}
                                    fill="none"
                                    stroke="url(#gaugeMinimalGrad)"
                                    strokeWidth="15"
                                    strokeLinecap="round"
                                    strokeDasharray={CIRC}
                                    strokeDashoffset={CIRC * (1 - 0.84 * gp)}
                                />
                            </svg>
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: FONT,
                                    fontSize: 58,
                                    fontWeight: 700,
                                    color: "#F8FAFC",
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {value}%
                            </div>
                        </div>
                        <span style={{ fontFamily: FONT, fontSize: 15, color: "#CBD5E1" }}>Net positive sentiment</span>
                    </div>

                    {/* Sentiment breakdown bars */}
                    <div
                        style={{
                            ...card,
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            ...unfold(f, 14),
                        }}
                    >
                        <span style={label}>Sentiment breakdown</span>
                        {bars.map((b, i) => {
                            const p = ramp(f, 16 + i * 6, 36 + i * 6, OUT);
                            return (
                                <div key={b.n}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontFamily: FONT,
                                            fontSize: 18,
                                            color: "#E2E8F0",
                                            marginBottom: 8,
                                        }}
                                    >
                                        <span>{b.n}</span>
                                        <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                                            {Math.round(b.v * p)}%
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            height: 14,
                                            borderRadius: 7,
                                            backgroundColor: "rgba(255, 255, 255, 0.06)",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${b.v * p}%`,
                                                height: "100%",
                                                borderRadius: 7,
                                                background: b.c,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Key strategic insights */}
                <div
                    style={{
                        ...card,
                        flex: 1,
                        position: "relative",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        ...unfold(f, 24),
                    }}
                >
                    <span style={label}>Key strategic insights</span>
                    {insights.map((t, i) => {
                        const start = i === 0 ? 96 : i === 1 ? 124 : 152;
                        return (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    opacity: ramp(f, start, start + 6),
                                }}
                            >
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        backgroundColor: "#818CF8",
                                        flexShrink: 0,
                                    }}
                                />
                                <span style={{ fontFamily: FONT, fontSize: 22, color: "#F8FAFC" }}>
                                    {typedSlice(t, f, start, 1.8)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const chip: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "7px 16px",
    borderRadius: 999,
    border: "1px solid",
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
};

const unfold = (f: number, start: number, dur = 10): React.CSSProperties => {
    const p = ramp(f, start, start + dur, OUT);
    return {
        opacity: p,
        transformOrigin: "50% 0%",
        transform: `translateY(${(1 - p) * 20}px) scale(${0.97 + 0.03 * p})`,
    };
};

// ───────────────────────── COMPARATIVA (ESCENA 4.3) ─────────────────────────
const BIN_SERIES = [38, 52, 44, 66, 60, 92, 70, 84, 78, 96, 88, 100];
const INDUSTRY_SERIES = [30, 34, 40, 42, 48, 52, 50, 56, 58, 62, 60, 66];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CompareUI: React.FC<{ fc: number }> = ({ fc }) => {
    const { fps } = useVideoConfig();
    const spr = (delay: number, damping = 16) =>
        spring({ frame: Math.max(0, fc - delay), fps, config: { damping, stiffness: 170 } });

    const peakMonth = 11;
    const peakP = ramp(fc, 28, 42, OUT);
    const tip = "+51.5%";

    const stat = (target: number, a: number, b: number) => target * ramp(fc, a, b, OUT);
    const sov = [
        { n: "BIN", v: 85, c: "linear-gradient(90deg, #3B82F6, #818CF8)" },
        { n: "Competitor A", v: 40, c: "rgba(255, 255, 255, 0.16)" },
        { n: "Competitor B", v: 55, c: "rgba(148, 163, 184, 0.38)" },
    ];
    const GW = 70;

    return (
        <div
            style={{
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 18,
                height: "100%",
                boxSizing: "border-box",
            }}
        >
            <div style={{ display: "flex", gap: 18, height: 470 }}>
                {/* Brand Equity: BIN (#3B82F6 a #818CF8) vs Industria (rgba(255, 255, 255, 0.16)) */}
                <div style={{ ...card, flex: 1.6, position: "relative", ...unfold(fc, 4) }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, color: "#F8FAFC" }}>
                            Brand Equity Growth
                        </span>
                        <span style={{ fontFamily: FONT, fontSize: 15, color: "#94A3B8" }}>
                            <span style={{ color: "#60A5FA" }}>■</span> BIN &nbsp;&nbsp;
                            <span style={{ color: "rgba(255, 255, 255, 0.35)" }}>■</span> Industry Avg
                        </span>
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            left: 30,
                            bottom: 50,
                            right: 30,
                            height: 290,
                            display: "flex",
                            alignItems: "flex-end",
                        }}
                    >
                        {[0.25, 0.5, 0.75, 1].map((g) => (
                            <div
                                key={g}
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    bottom: g * 290,
                                    height: 1,
                                    background: "rgba(255, 255, 255, 0.06)",
                                }}
                            />
                        ))}
                        {BIN_SERIES.map((v, i) => {
                            const s = spr(8 + i * 2);
                            return (
                                <div
                                    key={i}
                                    style={{
                                        width: GW,
                                        display: "flex",
                                        alignItems: "flex-end",
                                        justifyContent: "center",
                                        gap: 5,
                                        position: "relative",
                                        height: "100%",
                                    }}
                                >
                                    {/* Promedio de la industria: gris pizarra translúcido */}
                                    <div
                                        style={{
                                            width: 24,
                                            height: Math.max(0, (INDUSTRY_SERIES[i] / 100) * 290 * s),
                                            borderRadius: "6px 6px 2px 2px",
                                            backgroundColor: "rgba(255, 255, 255, 0.16)",
                                        }}
                                    />
                                    {/* Barra de BIN: azul/índigo editorial elegante (#3B82F6 a #818CF8) */}
                                    <div
                                        style={{
                                            width: 24,
                                            height: Math.max(0, (v / 100) * 290 * s),
                                            borderRadius: "6px 6px 2px 2px",
                                            background: "linear-gradient(180deg, #818CF8 0%, #3B82F6 100%)",
                                        }}
                                    />
                                    <span
                                        style={{
                                            position: "absolute",
                                            bottom: -28,
                                            fontFamily: FONT,
                                            fontSize: 13,
                                            color: "#64748B",
                                        }}
                                    >
                                        {MONTHS[i]}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Badge "+51.5% vs ind." sobre diciembre: pastilla minimalista blanca con texto oscuro anclada con firmeza */}
                        {fc > 26 && (
                            <div
                                style={{
                                    position: "absolute",
                                    left: peakMonth * GW + GW / 2 - 64,
                                    bottom: (BIN_SERIES[peakMonth] / 100) * 290 + 14,
                                    width: 128,
                                    textAlign: "center",
                                    padding: "7px 0",
                                    borderRadius: 999,
                                    backgroundColor: "#F8FAFC",
                                    border: "1px solid rgba(255, 255, 255, 0.9)",
                                    color: "#0A0D16",
                                    fontFamily: FONT,
                                    fontSize: 16,
                                    fontWeight: 700,
                                    opacity: peakP,
                                    transform: `translateY(${(1 - peakP) * 8}px)`,
                                }}
                            >
                                {tip} vs ind.
                            </div>
                        )}
                    </div>
                </div>

                {/* KPIs laterales */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
                    {[
                        { v: stat(84, 14, 64), suf: "%", l: "Positive sentiment · verified", c: "#F8FAFC", at: 14 },
                        { v: stat(2.4, 20, 70), suf: "M", l: "Signals indexed · last 7 days", c: "#CBD5E1", at: 20, dec: 1 },
                    ].map((s, i) => (
                        <div
                            key={i}
                            style={{
                                ...card,
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                ...unfold(fc, s.at),
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: FONT,
                                    fontSize: 80,
                                    fontWeight: 700,
                                    color: s.c,
                                    fontVariantNumeric: "tabular-nums",
                                    letterSpacing: "-0.03em",
                                }}
                            >
                                {s.dec ? s.v.toFixed(1) : Math.round(s.v)}
                                {s.suf}
                            </span>
                            <span style={label}>{s.l}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: "flex", gap: 18, flex: 1 }}>
                {/* Share of Voice */}
                <div
                    style={{
                        ...card,
                        flex: 1.6,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        ...unfold(fc, 24),
                    }}
                >
                    <span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Share of Voice</span>
                    {sov.map((r, i) => {
                        const s = spr(24 + i * 4, 14);
                        return (
                            <div key={r.n} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <span style={{ width: 150, fontFamily: FONT, fontSize: 16, color: "#CBD5E1" }}>{r.n}</span>
                                <div
                                    style={{
                                        flex: 1,
                                        height: 16,
                                        borderRadius: 8,
                                        background: "rgba(255, 255, 255, 0.06)",
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: `${Math.min(100, r.v * s)}%`,
                                            height: "100%",
                                            background: r.c,
                                            borderRadius: 8,
                                        }}
                                    />
                                </div>
                                <span
                                    style={{
                                        width: 56,
                                        fontFamily: FONT,
                                        fontSize: 18,
                                        fontWeight: 700,
                                        color: "#F8FAFC",
                                        fontVariantNumeric: "tabular-nums",
                                        textAlign: "right",
                                    }}
                                >
                                    {Math.round(r.v * Math.min(1, s))}%
                                </span>
                            </div>
                        );
                    })}
                </div>

                {[
                    { bg: "rgba(30, 58, 138, 0.24)", v: stat(54, 30, 68), t: "Win rate", at: 30 },
                    { bg: "rgba(67, 56, 202, 0.22)", v: stat(21, 36, 74), t: "Market share delta", at: 36 },
                ].map((c, i) => (
                    <div
                        key={i}
                        style={{
                            flex: 0.6,
                            borderRadius: 22,
                            backgroundColor: c.bg,
                            border: "1px solid rgba(255, 255, 255, 0.09)",
                            backdropFilter: "blur(24px)",
                            padding: 22,
                            boxSizing: "border-box",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            color: "#F8FAFC",
                            ...unfold(fc, c.at),
                        }}
                    >
                        <span style={{ fontFamily: FONT, fontSize: 17, fontWeight: 500, color: "#CBD5E1" }}>{c.t}</span>
                        <span
                            style={{
                                fontFamily: FONT,
                                fontSize: 66,
                                fontWeight: 700,
                                letterSpacing: "-0.04em",
                                fontVariantNumeric: "tabular-nums",
                                color: "#F8FAFC",
                            }}
                        >
                            {Math.round(c.v)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ───────────────────────── ESCENA PRINCIPAL ACTO 4 ─────────────────────────
export const ProductDemo: React.FC = () => {
    const f = useCurrentFrame();

    const wp = ramp(f, 0, 18, OUT);
    const camS = lerp(0.95, 1.03, ramp(f, 0, 180, IO));
    const camY = -ramp(f, 100, 190, IO) * 18;

    // Dock + 2º prompt: dock sube en 186–206
    const dockP = ramp(f, 186, 206, OUT);
    const typed2 = typedSlice(PROMPT2, f, 214, 0.65);
    const clicked = f >= CLICK2;
    const press = clicked ? interpolate(f, [CLICK2, CLICK2 + 3, CLICK2 + 9], [1, 1, 0], C) : 0;
    const sendScale = clicked
        ? interpolate(f, [CLICK2, CLICK2 + 3, CLICK2 + 9], [0.85, 0.85, 1], { ...C, easing: OUT })
        : 1;
    const arrowMorph2 = ramp(f, CLICK2, CLICK2 + 6, OUT);
    const isoRot2 = lerp(0, 180, ramp(f, CLICK2, 300, IO));
    const dockText = f >= CLICK2 + 6 ? "" : typed2;

    // Cursor hacia el botón enviar del dock
    const sendX = DOCK_LEFT + DOCK_W / 2 + sendOffsetX(DOCK_W, DOCK_H);
    const sendY = 1080 - DOCK_BOTTOM - DOCK_H / 2;
    const cp = ramp(f, 236, CLICK2 - 3, IO);
    const curOpacity = ramp(f, 236, 244) * (1 - ramp(f, CLICK2 + 8, CLICK2 + 16));

    // Barrido orgánico + cambio de UI
    const wipeP = ramp(f, 266, 302, IO);
    const showResp = f < 284;
    const fc = f - 284;
    const cp2 = ramp(fc, 0, 24, OUT);
    const keystone = `perspective(2000px) rotateY(${lerp(-18, -2, cp2)}deg) rotateX(${lerp(6, 1, cp2)}deg) scale(${lerp(0.94, 1.0, ramp(fc, 0, 160))})`;

    return (
        <ZoomBlurOut frames={4}>
            {showResp && (
                <AbsoluteFill style={{ transform: `translateY(${camY}px) scale(${camS})` }}>
                    <Window
                        title="BIN · Real-time Sentiment Intelligence"
                        style={{
                            opacity: wp * (1 - ramp(f, 270, 284)),
                            filter: `blur(${(1 - wp) * 6 + ramp(f, 270, 284) * 10}px)`,
                            transform: `perspective(1800px) rotateX(${(1 - wp) * 8}deg) translateY(${(1 - wp) * 32}px) scale(${0.95 + 0.05 * wp})`,
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
                            filter: `blur(${(1 - cp2) * 10}px)`,
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
                    filter: `blur(${(1 - dockP) * 8}px)`,
                    transform: `translateY(${(1 - dockP) * 64}px)`,
                    zIndex: 50,
                }}
            >
                <PromptBar
                    width={DOCK_W}
                    height={DOCK_H}
                    fontSize={22}
                    frame={f}
                    typed={dockText}
                    placeholder="Ask anything..."
                    caret={f < CLICK2}
                    sendScale={sendScale}
                    sendBg="#ffffff"
                    sendArrow="#0B0F1A"
                    arrowMorphP={arrowMorph2}
                    isotipoRotation={isoRot2}
                />
            </div>
            <Cursor x={lerp(1250, sendX + 4, cp)} y={lerp(760, sendY + 8, cp)} press={press} opacity={curOpacity} size={50} />

            <GradientWipe p={wipeP} />
        </ZoomBlurOut>
    );
};
