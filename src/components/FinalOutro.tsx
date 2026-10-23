// src/components/FinalOutro.tsx (240 frames = 52–60 s, f1560–f1800 global)
// A 0–60   (f1566 voz L27) "Connectors": dock de tiles con logos animados (uno cada 3f)
// B 60–114 (f1620 voz L28) Flashes de keywords: 60 Real-time, 78 Warehouse, 96 AI agents
// C 114–174 (f1677 voz L29) Mosaico: ~14 tarjetas vuelan desde los bordes, forman cúmulo 3D y colapsan
// D 174–240 (f1734 voz L30, f1761 voz L31) Lockup: isotipo elástico en f1734 + Delfos Intelligence + Decide better en local 191
import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CONNECTORS, OpenAiLogo, SnowflakeLogo } from "./Connectorlogos";
import { C, FONT, GradientText, IN, OUT, SERIF, ZoomBlurOut, lerp, ramp } from "./Theme";
import { Icon, Isotipo, Tile } from "./Ui";

// ───────────── A · Connectors ─────────────
const Dock: React.FC = () => {
    const f = useCurrentFrame();
    const headP = ramp(f, 0, 8, OUT);
    return (
        <ZoomBlurOut frames={4}>
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 56 }}>
                <h2
                    style={{
                        fontFamily: FONT,
                        fontSize: 92,
                        fontWeight: 600,
                        letterSpacing: "-0.03em",
                        color: "#fff",
                        margin: 0,
                        opacity: headP,
                        transform: `translateY(${(1 - headP) * -26}px)`,
                        textShadow: `0 0 ${24 + interpolate(f, [0, 5, 12], [30, 16, 0], C)}px rgba(255,255,255,0.55)`,
                    }}
                >
                    Connectors
                </h2>
                <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", gap: 28 }}>
                        {CONNECTORS.map(({ Logo, name }, i) => {
                            const p = ramp(f, 4 + i * 3, 18 + i * 3, Easing.out(Easing.back(1.8)));
                            return (
                                <Tile key={name} size={150} style={{ opacity: Math.min(1, p * 1.6), filter: `blur(${(1 - Math.min(1, p)) * 8}px)`, transform: `translateY(${(1 - p) * 90 + Math.sin((f - i * 3) * 0.3) * 4}px) scale(${lerp(0.7, 1, Math.min(1, p))})` }}>
                                    <Logo size={84} delay={8 + i * 3} />
                                </Tile>
                            );
                        })}
                    </div>
                    {/* segunda fila fantasma */}
                    <div style={{ position: "absolute", top: 180, left: 0, right: 0, display: "flex", gap: 28, justifyContent: "center", opacity: 0.28 * ramp(f, 16, 30), filter: "blur(5px)", transform: `translateY(${(1 - ramp(f, 16, 30, OUT)) * 60}px)` }}>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <Tile key={i} size={150} />
                        ))}
                    </div>
                </div>
            </AbsoluteFill>
        </ZoomBlurOut>
    );
};

// ───────────── B · Keywords ─────────────
const Keyword: React.FC<{ left?: string; right?: string; tile: React.ReactNode }> = ({ left, right, tile }) => {
    const f = useCurrentFrame();
    const p = ramp(f, 0, 4);
    const txt: React.CSSProperties = { fontFamily: FONT, fontSize: 104, fontWeight: 600, color: "#fff", letterSpacing: "-0.03em" };
    return (
        <ZoomBlurOut frames={4}>
            <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 30, opacity: p, filter: `blur(${(1 - p) * 14}px)`, transform: `scale(${lerp(0.9, 1.04, f / 18)})` }}>
                {left && <span style={txt}>{left}</span>}
                <Tile size={112} radius={30}>
                    {tile}
                </Tile>
                {right && <span style={txt}>{right}</span>}
            </AbsoluteFill>
        </ZoomBlurOut>
    );
};

// ───────────── C · Mosaico ─────────────
const MiniCard: React.FC<{ i: number; f: number }> = ({ i, f }) => {
    const v = i % 8;
    const light = v === 0 || v === 4 || v === 6;
    const base: React.CSSProperties = {
        width: 420,
        height: 290,
        boxSizing: "border-box",
        borderRadius: 24,
        padding: 24,
        fontFamily: FONT,
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    };
    if (v === 1)
        return (
            <div style={{ ...base, background: "#0d0f18", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}>
                <span style={{ fontSize: 18, color: "#94a3b8" }}>Positive sentiment</span>
                <span style={{ fontSize: 110, fontWeight: 800, letterSpacing: "-0.05em", color: "#22d3ee" }}>{Math.round(84 + Math.sin(f * 0.2 + i) * 2)}%</span>
            </div>
        );
    if (v === 2)
        return (
            <div style={{ ...base, background: "linear-gradient(135deg,#f9a8d4,#ec4899)", color: "#12040d" }}>
                <span style={{ fontSize: 20, fontWeight: 700 }}>Surge</span>
                <span style={{ fontSize: 100, fontWeight: 800, letterSpacing: "-0.05em" }}>+{(42.8 + Math.sin(f * 0.2) * 1.2).toFixed(1)}%</span>
            </div>
        );
    if (v === 7)
        return (
            <div style={{ ...base, background: "linear-gradient(135deg,#a5f3fc,#22d3ee)", color: "#04121a" }}>
                <span style={{ fontSize: 20, fontWeight: 700 }}>Win rate</span>
                <span style={{ fontSize: 110, fontWeight: 800, letterSpacing: "-0.05em" }}>54%</span>
            </div>
        );
    if (v === 3)
        return (
            <div style={{ ...base, background: "#0d0f18", border: "1px solid rgba(255,255,255,0.12)", display: "grid", gridTemplateColumns: "repeat(14,1fr)", gridTemplateRows: "repeat(8,1fr)", placeItems: "center", padding: 20 }}>
                {Array.from({ length: 112 }).map((_, n) => (
                    <div key={n} style={{ width: 11, height: 11, borderRadius: 6, background: `rgba(${n % 2 ? "236,72,153" : "99,102,241"},${0.25 + 0.75 * Math.abs(Math.sin(f * 0.15 + n * 0.37))})` }} />
                ))}
            </div>
        );
    if (v === 5)
        return (
            <div style={{ ...base, background: "#0d0f18", border: "1px solid rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" }}>
                <svg width="190" height="190" viewBox="0 0 190 190" style={{ transform: `rotate(${f * 3}deg)` }}>
                    <circle cx="95" cy="95" r="70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="22" />
                    <circle cx="95" cy="95" r="70" fill="none" stroke="#a78bfa" strokeWidth="22" strokeLinecap="round" strokeDasharray={440} strokeDashoffset={440 * 0.28} />
                </svg>
            </div>
        );
    if (v === 6)
        return (
            <div style={{ ...base, background: "#f8fafc", color: "#0f172a", gap: 14, justifyContent: "center" }}>
                {[0, 1, 2, 3, 4].map((r) => (
                    <div key={r} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 56, height: 14, borderRadius: 7, background: "#cbd5e1" }} />
                        <div style={{ width: `${30 + 50 * Math.abs(Math.sin(f * 0.1 + r))}%`, height: 14, borderRadius: 7, background: "#6366f1" }} />
                    </div>
                ))}
            </div>
        );
    // 0 y 4: tarjetas claras con barras / línea
    return (
        <div style={{ ...base, background: light ? "#ffffff" : "#0d0f18", color: "#0f172a" }}>
            <span style={{ fontSize: 20, fontWeight: 700 }}>{v === 0 ? "Revenue" : "Trend"}</span>
            {v === 0 ? (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 170 }}>
                    {Array.from({ length: 9 }).map((_, k) => (
                        <div key={k} style={{ flex: 1, height: `${30 + 65 * Math.abs(Math.sin(f * 0.1 + k))}%`, borderRadius: 6, background: k % 2 ? "#ec4899" : "#6366f1" }} />
                    ))}
                </div>
            ) : (
                <svg width="372" height="170" viewBox="0 0 372 170">
                    <path d={Array.from({ length: 19 }).map((_, k) => `${k ? "L" : "M"}${k * 20} ${90 + 40 * Math.sin(k * 0.5 + f * 0.15)}`).join(" ")} fill="none" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
                </svg>
            )}
        </div>
    );
};

const CARDS = 14;
const Mosaic: React.FC = () => {
    const f = useCurrentFrame();
    const collapse = ramp(f, 44, 60, IN);
    const clusterScale = lerp(1, 0.12, collapse);
    const fade = 1 - ramp(f, 52, 60);
    return (
        <AbsoluteFill style={{ perspective: 1600, alignItems: "center", justifyContent: "center", opacity: fade, overflow: "hidden" }}>
            <div style={{ position: "relative", width: 0, height: 0, transform: `scale(${clusterScale}) rotateY(${Math.sin(f * 0.08) * 16}deg) rotateX(${Math.cos(f * 0.06) * 6}deg)` }}>
                {Array.from({ length: CARDS }).map((_, i) => {
                    const a = i * 2.399;
                    const r = 120 + (i % 4) * 85;
                    const tx = Math.cos(a) * r * 1.55;
                    const ty = Math.sin(a) * r * 0.9;
                    const fly = ramp(f, i * 1.3, i * 1.3 + 24, Easing.out(Easing.cubic));
                    const ox = Math.cos(a) * 2600 + (i % 2 ? 300 : -300);
                    const oy = Math.sin(a) * 1700;
                    const x = lerp(ox, tx, fly);
                    const y = lerp(oy, ty, fly);
                    const blur = Math.pow(1 - fly, 2) * 16;
                    const sc = (0.62 + (i % 5) * 0.1) * lerp(1.3, 1, fly);
                    const rot = ((i % 7) - 3) * 3.2 * fly;
                    return (
                        <div key={i} style={{ position: "absolute", left: x - 210, top: y - 145, filter: `blur(${blur}px)`, transform: `scale(${sc}) rotate(${rot}deg)`, zIndex: i }}>
                            <MiniCard i={i} f={f} />
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

// ───────────── D · Lockup ─────────────
const Lockup: React.FC = () => {
    const f = useCurrentFrame();
    const { fps } = useVideoConfig();
    const sp = spring({ frame: f, fps, config: { damping: 8, stiffness: 220, mass: 0.5 } });
    const bloomR = interpolate(f, [0, 4, 16], [50, 24, 16], C);
    const bloomA = interpolate(f, [0, 4, 16], [0.95, 0.6, 0.35], C);
    const burst = interpolate(f, [0, 10], [1, 0], { ...C, easing: OUT });
    const tp = ramp(f, 0, 4);
    // Slogan "Decide better." en local 17 (f1761 global = local 27 de outro - 10)
    const sp2 = ramp(f - 17, 0, 10, OUT);
    return (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", width: 1000, height: 1000, background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 60%)", opacity: burst, transform: `scale(${1 + (1 - burst) * 0.6})` }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(-40px)` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                    <div style={{ display: "flex", transform: `scale(${lerp(0.1, 1, sp) * (1 + Math.sin(f * 0.18) * 0.015)}) rotate(${lerp(-60, 0, sp)}deg)`, filter: `drop-shadow(0 0 ${bloomR}px rgba(255,255,255,${bloomA}))` }}>
                        <Isotipo size={128} />
                    </div>
                    <h1 style={{ fontFamily: FONT, fontSize: 118, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.04em", opacity: tp, transform: `translateX(${(1 - tp) * -35}px)` }}>
                        Delfos <span style={{ fontWeight: 300, color: "#cbd5e1" }}>Intelligence</span>
                    </h1>
                </div>
                <div style={{ marginTop: 22, opacity: sp2, transform: `translateY(${(1 - sp2) * 18}px) scale(${lerp(1, 1.03, ramp(f, 17, 66))})` }}>
                    <GradientText colors={["#fb7185", "#a78bfa", "#60a5fa"]} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 54 }}>
                        Decide better.
                    </GradientText>
                </div>
            </div>
        </AbsoluteFill>
    );
};

export const FinalOutro: React.FC = () => (
    <AbsoluteFill>
        {/* A: Connectors en local 0–60 (f1560–f1620) */}
        <Sequence durationInFrames={60}>
            <Dock />
        </Sequence>

        {/* B: Flashes keywords en local 60, 78, 96 (f1620, f1638, f1656) */}
        <Sequence from={60} durationInFrames={18}>
            <Keyword left="Real-time" tile={<Icon name="bolt" size={60} color="#a5b4fc" />} right="Streams" />
        </Sequence>
        <Sequence from={78} durationInFrames={18}>
            <Keyword tile={<SnowflakeLogo size={70} />} right="Data warehouse" />
        </Sequence>
        <Sequence from={96} durationInFrames={18}>
            <Keyword tile={<OpenAiLogo size={70} />} right="AI agents" />
        </Sequence>

        {/* C: Mosaico en local 114–174 (f1674–f1734) */}
        <Sequence from={114} durationInFrames={60}>
            <Mosaic />
        </Sequence>

        {/* D: Impacto lockup en local 174 (f1734) y slogan en local 191 (f1761) */}
        <Sequence from={174} durationInFrames={66}>
            <Lockup />
        </Sequence>
    </AbsoluteFill>
);
