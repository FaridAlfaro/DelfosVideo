// src/components/FeatureMontage.tsx (270 frames = 43–52 s, f1290–f1560 global)
// 3 beats de 90f:
// Beat A (0–90): Hero UI 0–46 -> morph 46–62 -> lockup "Interactive maps" en local 60 (f1350)
// Beat B (90–180): Hero UI 0–46 -> morph 46–62 -> lockup "Data dashboards" en local 60 (f1440)
// Beat C (180–270): Hero UI 0–46 -> morph 46–62 -> lockup "Predictive strategy" en local 60 (f1530)
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { BACK, FONT, GradientText, IO, OUT, SERIF, SNAP, ZoomBlurOut, gradBorder, lerp, ramp } from "./Theme";
import { Icon, IconName } from "./Ui";

const HW = 980;
const HH = 560;

const heroCard: React.CSSProperties = {
    width: HW,
    height: HH,
    boxSizing: "border-box",
    padding: 32,
    fontFamily: FONT,
    color: "#fff",
    position: "relative",
};

// ───────── Hero A · mapa de calor interactivo ─────────
const HeatHero: React.FC<{ f: number }> = ({ f }) => {
    const COLS = 18;
    const ROWS = 8;
    const ripples = [
        { cx: 4, cy: 3, o: 0 },
        { cx: 13, cy: 5, o: 5 },
        { cx: 9, cy: 1.5, o: 2.5 },
    ];
    const pins = [
        { n: "Buenos Aires", v: "+18%", x: 21, y: 66, d: 12 },
        { n: "Madrid", v: "+24%", x: 56, y: 28, d: 20 },
        { n: "Mexico City", v: "+31%", x: 78, y: 62, d: 28 },
    ];
    return (
        <div style={heroCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 40 }}>
                <span style={{ fontSize: 28, fontWeight: 700 }}>Live Sentiment Map</span>
                <span style={{ fontSize: 16, color: "#4ade80", fontWeight: 600 }}>● {Math.round(lerp(120000, 148900, ramp(f, 0, 46))).toLocaleString("en-US")} signals</span>
            </div>
            <div style={{ position: "absolute", left: 32, right: 32, top: 100, bottom: 32, display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)`, placeItems: "center" }}>
                {Array.from({ length: COLS * ROWS }).map((_, n) => {
                    const i = n % COLS;
                    const j = Math.floor(n / COLS);
                    let w = 0;
                    ripples.forEach((r) => {
                        const rad = ((f * 0.34 + r.o) % 11) + 0.2;
                        w = Math.max(w, Math.exp(-Math.pow(Math.hypot(i - r.cx, j - r.cy) - rad, 2) / 1.5));
                    });
                    const v = Math.min(1, w + 0.14 + 0.1 * Math.sin(f * 0.2 + i * 0.7 + j));
                    const hot = i / COLS;
                    const spawn = ramp(f - (i + j) * 0.6, 0, 5);
                    return (
                        <div
                            key={n}
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: 10,
                                backgroundColor: `rgba(${Math.round(lerp(99, 236, hot))},${Math.round(lerp(102, 72, hot))},${Math.round(lerp(241, 153, hot))},${0.25 + 0.75 * v})`,
                                boxShadow: w > 0.5 ? `0 0 ${10 + 14 * w}px rgba(236,72,153,0.8)` : "none",
                                transform: `scale(${(0.7 + 1.0 * v) * spawn})`,
                            }}
                        />
                    );
                })}
                {pins.map((p) => {
                    const pp = ramp(f, p.d, p.d + 10, BACK);
                    return (
                        <div key={p.n} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: `translate(-50%, -100%) translateY(${(1 - pp) * -40 + Math.sin(f * 0.2) * 3}px) scale(${pp})`, textAlign: "center" }}>
                            <div style={{ padding: "7px 14px", borderRadius: 14, background: "#fff", color: "#0b0b10", fontSize: 17, fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                                {p.n} <span style={{ color: "#6366f1" }}>{p.v}</span>
                            </div>
                            <div style={{ width: 14, height: 14, margin: "6px auto 0", borderRadius: 7, background: "#ec4899", boxShadow: `0 0 ${12 + 10 * Math.abs(Math.sin(f * 0.2))}px #ec4899` }} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ───────── Hero B · dashboard BI ─────────
const BiHero: React.FC<{ f: number }> = ({ f }) => {
    const stats = [
        { l: "Mentions", v: 2.4, s: "M", d: 1 },
        { l: "Positive", v: 84, s: "%" },
        { l: "Reach", v: 18.2, s: "M", d: 1 },
        { l: "Engagement", v: 9.7, s: "%", d: 1 },
    ];
    const bars = [40, 62, 48, 80, 66, 92, 74, 100, 84, 96];
    const R = 62;
    const CIRC = 2 * Math.PI * R;
    const dp = ramp(f, 16, 44, OUT);
    return (
        <div style={heroCard}>
            <div style={{ display: "flex", gap: 16 }}>
                {stats.map((s, i) => {
                    const p = ramp(f, 2 + i * 4, 24 + i * 4, OUT);
                    return (
                        <div key={s.l} style={{ flex: 1, padding: "16px 18px", borderRadius: 18, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", opacity: ramp(f, i * 3, i * 3 + 6), transform: `translateY(${(1 - ramp(f, i * 3, i * 3 + 8, OUT)) * 20}px)` }}>
                            <div style={{ fontSize: 15, color: "#94a3b8" }}>{s.l}</div>
                            <div style={{ fontSize: 40, fontWeight: 700, color: i === 1 ? "#22d3ee" : "#fff", fontVariantNumeric: "tabular-nums" }}>
                                {s.d ? (s.v * p).toFixed(1) : Math.round(s.v * p)}
                                {s.s}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 24, height: 330 }}>
                <div style={{ flex: 1.7, borderRadius: 20, background: "rgba(255,255,255,0.04)", padding: 22, display: "flex", alignItems: "flex-end", gap: 14 }}>
                    {bars.map((b, i) => {
                        const p = ramp(f, 8 + i * 2, 26 + i * 2, BACK);
                        const live = f > 34 ? Math.sin(f * 0.2 + i) * 4 : 0;
                        return <div key={i} style={{ flex: 1, height: Math.max(0, (b / 100) * 270 * p + live), borderRadius: "8px 8px 3px 3px", background: i % 2 ? "linear-gradient(180deg,#f472b6,#ec4899)" : "linear-gradient(180deg,#818cf8,#4f46e5)" }} />;
                    })}
                </div>
                <div style={{ flex: 1, borderRadius: 20, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: `rotate(${-90 + f * 2}deg)` }}>
                        <defs>
                            <linearGradient id="biDonut" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stopColor="#06b6d4" />
                                <stop offset="1" stopColor="#6366f1" />
                            </linearGradient>
                        </defs>
                        <circle cx="90" cy="90" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="20" />
                        <circle cx="90" cy="90" r={R} fill="none" stroke="url(#biDonut)" strokeWidth="20" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - 0.72 * dp)} />
                    </svg>
                    <div style={{ position: "absolute", fontSize: 34, fontWeight: 700 }}>{Math.round(72 * dp)}%</div>
                </div>
            </div>
        </div>
    );
};

// ───────── Hero C · predicción de tendencias ─────────
const TrendHero: React.FC<{ f: number }> = ({ f }) => {
    const hist = ramp(f, 4, 26, OUT);
    const fc = ramp(f, 26, 42, OUT);
    const pulse = (f * 0.25) % 1;
    return (
        <div style={heroCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 28, fontWeight: 700 }}>Predictive Strategy</span>
                <span style={{ fontSize: 40, fontWeight: 700, color: "#38bdf8", fontVariantNumeric: "tabular-nums" }}>+{Math.round(38 * fc)}%</span>
            </div>
            <div style={{ fontSize: 16, color: "#94a3b8" }}>Projected brand momentum · next 90 days</div>
            <svg width="916" height="400" viewBox="0 0 504 290" preserveAspectRatio="none" style={{ marginTop: 20 }}>
                <defs>
                    <linearGradient id="trH" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor="#6366f1" />
                        <stop offset="1" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="trF" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor="#06b6d4" />
                        <stop offset="1" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
                {[40, 100, 160, 220].map((y) => (
                    <line key={y} x1="0" x2="504" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
                ))}
                <polygon points="250,130 380,80 490,25 490,100 380,130 250,134" fill="rgba(236,72,153,0.18)" opacity={fc} />
                <path d="M10 210 C 60 200, 90 170, 130 175 S 200 120, 250 130" pathLength={1} fill="none" stroke="url(#trH)" strokeWidth="4" strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - hist} />
                <path d="M250 130 C 300 140, 330 90, 380 80 C 430 70, 450 40, 490 25" pathLength={1} fill="none" stroke="url(#trF)" strokeWidth="4" strokeLinecap="round" strokeDasharray="0.04 0.03" strokeDashoffset={1 - fc} opacity={fc > 0 ? 1 : 0} />
                {fc > 0.96 && (
                    <>
                        <circle cx="490" cy="25" r={6 + pulse * 18} fill="none" stroke="#ec4899" strokeOpacity={1 - pulse} strokeWidth="2" />
                        <circle cx="490" cy="25" r="6" fill="#fff" />
                    </>
                )}
            </svg>
        </div>
    );
};

// ───────── Elementos del lockup ─────────
const Avatars: React.FC<{ f: number }> = ({ f }) => (
    <div style={{ display: "flex" }}>
        {[["#fb7185", "#f472b6", "M"], ["#60a5fa", "#6366f1", "L"], ["#34d399", "#06b6d4", "S"]].map(([a, b, l], i) => (
            <div key={l} style={{ width: 62, height: 62, borderRadius: 31, marginLeft: i ? -16 : 0, background: `linear-gradient(135deg,${a},${b})`, border: "3px solid #0a0b12", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700, fontSize: 24, color: "#fff", transform: `translateY(${Math.sin(f * 0.2 + i) * 3}px)` }}>
                {l}
            </div>
        ))}
    </div>
);

const Chips: React.FC<{ f: number }> = ({ f }) => (
    <div style={{ display: "flex", gap: 12 }}>
        {[["Confidence 99.4%", "#4ade80"], ["Live", "#f472b6"]].map(([t, c]) => (
            <span key={t} style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, color: c, padding: "6px 18px", borderRadius: 22, border: `1.5px solid ${c}66`, background: `${c}1f`, transform: `scale(${1 + Math.sin(f * 0.25) * 0.02})` }}>
                {t}
            </span>
        ))}
    </div>
);

interface BeatProps {
    hero: (f: number) => React.ReactNode;
    shape: "toggle" | "tile";
    icon: IconName;
    line1: string;
    italic: string;
    extra: (f: number) => React.ReactNode;
    f: number;
}

const FONT_SIZE = 108;

const Beat: React.FC<BeatProps> = ({ hero, shape, icon, line1, italic, extra, f }) => {
    const tw = shape === "toggle" ? 190 : 132;
    const th = shape === "toggle" ? 100 : 132;
    const textW = line1.length * FONT_SIZE * 0.56;
    const row = tw + 34 + textW;
    const tileCX = 960 - row / 2 + tw / 2;
    const tileCY = 470;
    const textLeft = tileCX + tw / 2 + 34;

    const enter = ramp(f, 0, 10, OUT);
    const morph = ramp(f, 46, 62, SNAP);
    const move = ramp(f, 56, 72, IO);
    const w = lerp(HW, tw, morph);
    const h = lerp(HH, th, morph);
    const radius = lerp(30, shape === "toggle" ? th / 2 : 34, morph);
    const cx = lerp(960, tileCX, move);
    const cy = lerp(540, tileCY, move);
    const heroOpacity = 1 - ramp(f, 40, 52);
    const tileIn = ramp(f, 54, 62);
    const on = ramp(f, 62, 70, OUT);
    const camScale = lerp(0.93, 1.05, ramp(f, 0, 46));

    const word = (start: number, size = FONT_SIZE): React.CSSProperties => {
        const p = ramp(f, start, start + 4);
        return { opacity: p, filter: `blur(${(1 - p) * 14}px)`, transform: `scale(${lerp(0.88, 1, p)}) translateX(${(1 - p) * -18}px)`, fontSize: size };
    };

    return (
        <AbsoluteFill>
            <AbsoluteFill style={{ transform: `scale(${camScale})`, opacity: enter }}>
                <div
                    style={{
                        position: "absolute",
                        left: cx - w / 2,
                        top: cy - h / 2,
                        width: w,
                        height: h,
                        borderRadius: radius,
                        overflow: "hidden",
                        backgroundColor: "rgba(12,15,26,0.95)",
                        boxShadow: "0 40px 100px rgba(0,0,0,0.8), 0 0 90px rgba(99,102,241,0.22)",
                        filter: `blur(${(1 - enter) * 10}px)`,
                        ...gradBorder(f, "rgba(12,15,26,0.95)", "#6366f1", "#ec4899", 1.5, 3),
                    }}
                >
                    <div style={{ position: "absolute", left: "50%", top: "50%", width: HW, height: HH, marginLeft: -HW / 2, marginTop: -HH / 2, opacity: heroOpacity }}>{hero(f)}</div>

                    {shape === "toggle" ? (
                        <div style={{ position: "absolute", inset: 0, opacity: tileIn }}>
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#fb7185,#818cf8)", opacity: on }} />
                            <div style={{ position: "absolute", top: 10, left: 10 + on * (tw - th), width: th - 20, height: th - 20, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #c7d2fe)", boxShadow: "0 6px 18px rgba(0,0,0,0.5)" }} />
                        </div>
                    ) : (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: tileIn, transform: `scale(${lerp(0.6, 1, ramp(f, 54, 66, BACK))}) rotate(${Math.sin(f * 0.15) * 4}deg)` }}>
                            <Icon name={icon} size={64} color="#c7d2fe" sw={2.2} />
                        </div>
                    )}
                </div>
            </AbsoluteFill>

            {/* Lockup de texto: empieza a construirse en f60–62 */}
            <div style={{ position: "absolute", left: textLeft, top: 540 - 110, fontFamily: FONT, fontWeight: 700, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
                <div style={{ height: 120, display: "flex", alignItems: "center", ...word(60) }}>{line1}</div>
                <div style={{ height: 120, display: "flex", alignItems: "center", gap: 28, ...word(66, FONT_SIZE) }}>
                    <GradientText colors={["#fb7185", "#a78bfa", "#60a5fa"]} style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: FONT_SIZE + 8 }}>
                        {italic}
                    </GradientText>
                    <span style={{ ...word(72, 60), fontSize: 60, color: "#fff", opacity: ramp(f, 72, 76) }}>{shape === "toggle" ? "←" : ""}</span>
                </div>
                <div style={{ marginTop: 6, opacity: ramp(f, 74, 80), transform: `translateY(${(1 - ramp(f, 74, 82, OUT)) * 14}px)` }}>{extra(f)}</div>
            </div>
        </AbsoluteFill>
    );
};

// Cada beat vive en su propio <Sequence>: el frame local lo aporta este wrapper
const BeatSeq: React.FC<Omit<BeatProps, "f">> = (props) => {
    const f = useCurrentFrame();
    return (
        <ZoomBlurOut frames={4}>
            <Beat {...props} f={f} />
        </ZoomBlurOut>
    );
};

export const FeatureMontage: React.FC = () => (
    <AbsoluteFill>
        {/* Beat A: local 0–90 -> Lockup maps en local 60 (f1350) */}
        <Sequence durationInFrames={90}>
            <BeatSeq hero={(f) => <HeatHero f={f} />} shape="toggle" icon="pin" line1="Interactive" italic="maps" extra={() => null} />
        </Sequence>
        {/* Beat B: local 90–180 -> Lockup dashboards en local 60 (f1440) */}
        <Sequence from={90} durationInFrames={90}>
            <BeatSeq hero={(f) => <BiHero f={f} />} shape="tile" icon="bars" line1="Data" italic="dashboards" extra={(f) => <Avatars f={f} />} />
        </Sequence>
        {/* Beat C: local 180–270 -> Lockup strategy en local 60 (f1530) */}
        <Sequence from={180} durationInFrames={90}>
            <BeatSeq hero={(f) => <TrendHero f={f} />} shape="tile" icon="target" line1="Predictive" italic="strategy" extra={(f) => <Chips f={f} />} />
        </Sequence>
    </AbsoluteFill>
);
