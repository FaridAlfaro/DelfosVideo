// src/components/Featuremontage.tsx (270 frames = 43–52 s, f1290–f1560 global)
// 1) local 0–75 (f1290–f1365): Sección de Énfasis en Mapas Interactivos (inspirada en MAPA.mp4)
//    - Split card con geo-signals en la izquierda y zoom interactivo multinivel (local -> regional -> global) en la derecha.
// 2) local 75–270 (f1365–f1560): Feature Slider dinámico (inspirado en SLIDER.mp4)
//    - Columna izquierda: Lista vertical de 4 items.
//    - Isotipo.svg a la izquierda del item activo: ROTA mientras desciende suavemente al siguiente elemento.
//    - Card derecha: Transforma dinámicamente sus contenidos (Live Sentiment -> BI Dashboards -> Predictive Strategy -> 24/7 Connectors).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, OUT, ZoomBlurOut, lerp, ramp } from "./Theme";
import { BinIsotipo } from "./BinBrand";
import { Icon } from "./Ui";

// ─────────────────────────────────────────────────────────────────────────────
// 1. SECCIÓN DE ÉNFASIS EN MAPAS INTERACTIVOS (Inspirada en MAPA.mp4)
// ─────────────────────────────────────────────────────────────────────────────
export const MapEmphasis: React.FC<{ f: number }> = ({ f }) => {
    // Zoom y cámara del mapa
    const zoomPhase = ramp(f, 10, 60, OUT);
    const mapScale = lerp(1, 1.45, zoomPhase);
    const panX = lerp(0, -60, zoomPhase);
    const panY = lerp(0, -35, zoomPhase);

    // Fade in general y salida suave
    const enter = ramp(f, 0, 10, OUT);
    const exit = ramp(f, 66, 75, OUT);
    const cardOpacity = enter * (1 - exit);

    // Datos geográficos que se revelan
    const cities = [
        { name: "Cupertino HQ", country: "United States", signals: "42.8k", active: true },
        { name: "Madrid District", country: "Spain", signals: "31.4k", active: f > 22 },
        { name: "Buenos Aires Hub", country: "Argentina", signals: "28.9k", active: f > 36 },
    ];

    return (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: cardOpacity }}>
            {/* Contenedor Split Card como en MAPA.mp4 */}
            <div
                style={{
                    width: 1460,
                    height: 720,
                    borderRadius: 24,
                    overflow: "hidden",
                    backgroundColor: "rgba(11, 14, 24, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    boxShadow: "0 40px 100px rgba(0,0,0,0.85), 0 0 60px rgba(0,41,199,0.18)",
                    display: "flex",
                }}
            >
                {/* Panel Izquierdo: Info Geográfica & Tags */}
                <div
                    style={{
                        width: 480,
                        padding: "48px 42px",
                        boxSizing: "border-box",
                        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        backgroundColor: "#030a2e",
                    }}
                >
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                            <span
                                style={{
                                    fontFamily: FONT,
                                    fontSize: 13,
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.14em",
                                    color: "#14d9f5",
                                    padding: "4px 10px",
                                    borderRadius: 6,
                                    backgroundColor: "rgba(20,217,245,0.12)",
                                    border: "1px solid rgba(20,217,245,0.25)",
                                }}
                            >
                                Street & District
                            </span>
                        </div>
                        <h3
                            style={{
                                fontFamily: FONT,
                                fontSize: 36,
                                fontWeight: 700,
                                color: "#ffffff",
                                margin: "0 0 12px 0",
                                lineHeight: 1.15,
                                letterSpacing: "-0.03em",
                            }}
                        >
                            One Apple Park Way,
                            <br />
                            <span style={{ color: "#93c5fd" }}>Cupertino, CA, 95014</span>
                        </h3>
                        <p style={{ fontFamily: FONT, fontSize: 16, color: "#8b949e", margin: 0 }}>
                            Real-time geographic sentiment intelligence
                        </p>
                    </div>

                    {/* Lista de ubicaciones monitoreadas */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {cities.map((c, i) => {
                            const p = ramp(f, 8 + i * 12, 18 + i * 12, OUT);
                            return (
                                <div
                                    key={c.name}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "12px 16px",
                                        borderRadius: 14,
                                        backgroundColor: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        opacity: p,
                                        transform: `translateX(${(1 - p) * -16}px)`,
                                    }}
                                >
                                    <div>
                                        <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: "#ffffff" }}>
                                            {c.name}
                                        </div>
                                        <div style={{ fontFamily: FONT, fontSize: 13, color: "#8b949e" }}>{c.country}</div>
                                    </div>
                                    <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#14d9f5" }}>
                                        {c.signals}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer live status */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
                        <span style={{ fontFamily: FONT, fontSize: 14, color: "#cbd5e1", fontWeight: 600 }}>
                            148,900 live geo signals indexed
                        </span>
                    </div>
                </div>

                {/* Panel Derecho: Mapa Dinámico Multi-escala */}
                <div style={{ flex: 1, position: "relative", overflow: "hidden", backgroundColor: "#020512" }}>
                    {/* SVG Mapa estilizado arquitectónico */}
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 980 720"
                        style={{
                            transform: `translate(${panX}px, ${panY}px) scale(${mapScale})`,
                            transformOrigin: "45% 50%",
                        }}
                    >
                        <defs>
                            <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="rgba(0,41,199,0.35)" />
                                <stop offset="100%" stopColor="transparent" />
                            </radialGradient>
                            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                            </pattern>
                        </defs>

                        {/* Cuadrícula cartográfica de fondo */}
                        <rect width="980" height="720" fill="url(#gridPattern)" />
                        <circle cx="490" cy="360" r="320" fill="url(#mapGlow)" />

                        {/* Calles y contornos geométricos vectoriales */}
                        <path
                            d="M 120 180 Q 300 240 490 220 T 860 300 M 180 540 Q 420 460 740 520 M 340 80 L 390 640 M 640 100 L 590 620"
                            stroke="rgba(255,255,255,0.12)"
                            strokeWidth="3"
                            fill="none"
                        />
                        <path
                            d="M 220 320 Q 380 300 520 340 T 820 410 M 400 160 Q 560 210 680 180"
                            stroke="rgba(20,217,245,0.22)"
                            strokeWidth="2"
                            fill="none"
                        />

                        {/* Campus circular concéntrico (como en Apple Park de MAPA.mp4) */}
                        <circle cx="460" cy="350" r="140" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="8" />
                        <circle cx="460" cy="350" r="110" fill="none" stroke="rgba(20,217,245,0.3)" strokeWidth="4" />
                        <circle cx="460" cy="350" r="80" fill="none" stroke="rgba(0,41,199,0.4)" strokeWidth="2" />

                        {/* Cluster Geográfico Principal */}
                        <circle cx="460" cy="350" r="14" fill="#ffffff" />
                        <circle cx="460" cy="350" r={24 + Math.sin(f * 0.2) * 6} fill="none" stroke="#14d9f5" strokeWidth="2" />

                        {/* Pines secundarios que se revelan con el zoom */}
                        {zoomPhase > 0.25 && (
                            <>
                                <g transform="translate(680, 260)">
                                    <circle cx="0" cy="0" r="8" fill="#93c5fd" />
                                    <circle cx="0" cy="0" r="18" fill="none" stroke="rgba(147,197,253,0.4)" strokeWidth="1.5" />
                                    <text x="14" y="5" fill="#e2e8f0" fontFamily={FONT} fontSize="14" fontWeight="600">
                                        Madrid Cluster · +31.4k
                                    </text>
                                </g>
                                <g transform="translate(260, 480)">
                                    <circle cx="0" cy="0" r="8" fill="#93c5fd" />
                                    <circle cx="0" cy="0" r="18" fill="none" stroke="rgba(147,197,253,0.4)" strokeWidth="1.5" />
                                    <text x="14" y="5" fill="#e2e8f0" fontFamily={FONT} fontSize="14" fontWeight="600">
                                        Buenos Aires · +28.9k
                                    </text>
                                </g>
                            </>
                        )}
                    </svg>

                    {/* Badge interactivo superior derecho */}
                    <div
                        style={{
                            position: "absolute",
                            top: 24,
                            right: 24,
                            padding: "8px 16px",
                            borderRadius: 20,
                            backgroundColor: "rgba(11,14,24,0.85)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontFamily: FONT,
                            fontSize: 14,
                            color: "#ffffff",
                            fontWeight: 600,
                        }}
                    >
                        <Icon name="pin" size={16} color="#14d9f5" />
                        <span>Interactive Map Intelligence</span>
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. FEATURE SLIDER DINÁMICO (Inspirado en SLIDER.mp4)
// ─────────────────────────────────────────────────────────────────────────────
const SLIDER_ITEMS = [
    { id: 0, label: "Live Sentiment", sub: "Multi-channel signal stream" },
    { id: 1, label: "Data Dashboards", sub: "Executive BI metrics" },
    { id: 2, label: "Predictive Strategy", sub: "90-day trajectory models" },
    { id: 3, label: "24/7 Intelligence", sub: "Autonomous stack pipelines" },
];

export const FeatureSlider: React.FC<{ f: number }> = ({ f }) => {
    // 4 pasos distribuidos en los 195 frames (frames 0 a 195 locales)
    // Paso 0: 0..48
    // Paso 1: 48..96
    // Paso 2: 96..144
    // Paso 3: 144..195
    const stepDuration = 48;
    const rawStep = f / stepDuration;
    const currentStep = Math.min(3, Math.floor(rawStep));
    const stepProgress = Math.min(1, Math.max(0, (f % stepDuration) / stepDuration));

    // Desplazamiento vertical del Isotipo:
    // Distancia entre items en la lista: cada item mide ~88px de alto con gap
    const ITEM_HEIGHT = 88;
    const currentY = currentStep * ITEM_HEIGHT + (currentStep < 3 ? ramp(stepProgress, 0.72, 1.0, OUT) * ITEM_HEIGHT : 0);

    // Rotación del Isotipo mientras desciende (requisito explícito del prompt)
    // Rota continuamente en cada salto de escalón
    const rotation = f * 3.2;

    return (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div
                style={{
                    width: 1460,
                    height: 720,
                    display: "flex",
                    gap: 60,
                    alignItems: "center",
                }}
            >
                {/* ── Columna Izquierda: Lista con Isotipo Rotatorio Descendente ── */}
                <div style={{ width: 440, display: "flex", flexDirection: "column", position: "relative" }}>
                    {/* Indicador Isotipo que rota mientras desciende */}
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 24,
                            transform: `translateY(${currentY}px)`,
                            zIndex: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 44,
                            height: 44,
                        }}
                    >
                        <BinIsotipo size={38} color="#ffffff" rotation={rotation} />
                    </div>

                    {/* Lista de Items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingLeft: 64 }}>
                        {SLIDER_ITEMS.map((item, idx) => {
                            const isActive = currentStep === idx;
                            const isTransitioning = currentStep === idx && stepProgress > 0.75;
                            const activeWeight = isActive && !isTransitioning ? 1 : 0.35;

                            return (
                                <div
                                    key={item.id}
                                    style={{
                                        height: ITEM_HEIGHT,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        opacity: activeWeight,
                                        transform: `translateX(${isActive ? 8 : 0}px)`,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontFamily: FONT,
                                            fontSize: 38,
                                            fontWeight: isActive ? 700 : 500,
                                            color: "#ffffff",
                                            letterSpacing: "-0.03em",
                                            lineHeight: 1.15,
                                        }}
                                    >
                                        {item.label}
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: FONT,
                                            fontSize: 16,
                                            color: isActive ? "#93c5fd" : "#64748b",
                                            fontWeight: 500,
                                            marginTop: 4,
                                        }}
                                    >
                                        {item.sub}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Columna Derecha: Dynamic Card que cambia con cada item ── */}
                <div style={{ flex: 1, height: 600, position: "relative" }}>
                    {/* Card 1: Live Sentiment */}
                    <SliderCard active={currentStep === 0}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                            <span style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, color: "#fff" }}>
                                Live Signals Stream
                            </span>
                            <span style={{ fontFamily: FONT, fontSize: 14, color: "#4ade80", fontWeight: 600 }}>
                                ● Synchronized (14 channels)
                            </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                { text: "Campaign reach drove +42.8% positive sentiment surge", time: "Just now", badge: "+42.8%" },
                                { text: "Competitive benchmark outpaces key industry peers", time: "2m ago", badge: "84% Net" },
                                { text: "Market adoption indexed across enterprise customer accounts", time: "4m ago", badge: "Verified" },
                            ].map((msg, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: "18px 22px",
                                        borderRadius: 18,
                                        backgroundColor: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <div>
                                        <div style={{ fontFamily: FONT, fontSize: 18, color: "#f8fafc", fontWeight: 500 }}>
                                            {msg.text}
                                        </div>
                                        <div style={{ fontFamily: FONT, fontSize: 13, color: "#64748b", marginTop: 4 }}>
                                            {msg.time}
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: FONT,
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color: "#14d9f5",
                                            backgroundColor: "rgba(20,217,245,0.12)",
                                            padding: "6px 14px",
                                            borderRadius: 10,
                                        }}
                                    >
                                        {msg.badge}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SliderCard>

                    {/* Card 2: Data Dashboards */}
                    <SliderCard active={currentStep === 1}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <span style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, color: "#fff" }}>
                                Executive BI Metrics
                            </span>
                            <span style={{ fontFamily: FONT, fontSize: 14, color: "#93c5fd", fontWeight: 600 }}>
                                Real-time synthesis
                            </span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20 }}>
                            <div style={{ padding: 20, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <div style={{ fontFamily: FONT, fontSize: 15, color: "#8b949e" }}>Net Positive</div>
                                <div style={{ fontFamily: FONT, fontSize: 44, fontWeight: 700, color: "#ffffff", marginTop: 6 }}>
                                    84%
                                </div>
                            </div>
                            <div style={{ padding: 20, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <div style={{ fontFamily: FONT, fontSize: 15, color: "#8b949e" }}>Signals Analyzed</div>
                                <div style={{ fontFamily: FONT, fontSize: 44, fontWeight: 700, color: "#ffffff", marginTop: 6 }}>
                                    2.4M
                                </div>
                            </div>
                        </div>
                        <div style={{ height: 160, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.04)", padding: 20, display: "flex", alignItems: "flex-end", gap: 12 }}>
                            {[45, 60, 52, 75, 68, 88, 80, 96, 92, 100].map((v, i) => (
                                <div key={i} style={{ flex: 1, height: `${v}%`, borderRadius: "6px 6px 2px 2px", backgroundColor: i === 9 ? "#14d9f5" : "#0029c7" }} />
                            ))}
                        </div>
                    </SliderCard>

                    {/* Card 3: Predictive Strategy */}
                    <SliderCard active={currentStep === 2}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <div>
                                <span style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, color: "#fff" }}>
                                    90-Day Predictive Strategy
                                </span>
                                <div style={{ fontFamily: FONT, fontSize: 14, color: "#8b949e", marginTop: 4 }}>
                                    Market adoption trajectory model
                                </div>
                            </div>
                            <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, color: "#ffffff" }}>
                                +38%
                            </div>
                        </div>
                        <svg width="100%" height="240" viewBox="0 0 680 240" style={{ overflow: "visible" }}>
                            <defs>
                                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgba(0,41,199,0.4)" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                            <path d="M 0 190 Q 180 170 340 120 T 680 40 L 680 240 L 0 240 Z" fill="url(#predGrad)" />
                            <path d="M 0 190 Q 180 170 340 120 T 680 40" fill="none" stroke="#ffffff" strokeWidth="4" />
                            <circle cx="680" cy="40" r="8" fill="#14d9f5" />
                            <circle cx="680" cy="40" r="18" fill="none" stroke="rgba(20,217,245,0.4)" strokeWidth="2" />
                        </svg>
                        <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
                            <span style={{ padding: "6px 14px", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.06)", fontFamily: FONT, fontSize: 13, color: "#cbd5e1" }}>
                                Confidence: 99.4%
                            </span>
                            <span style={{ padding: "6px 14px", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.06)", fontFamily: FONT, fontSize: 13, color: "#cbd5e1" }}>
                                Industry Delta: +51.5%
                            </span>
                        </div>
                    </SliderCard>

                    {/* Card 4: 24/7 Connectors */}
                    <SliderCard active={currentStep === 3}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <span style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, color: "#fff" }}>
                                Autonomous Data Stack
                            </span>
                            <span style={{ fontFamily: FONT, fontSize: 14, color: "#4ade80", fontWeight: 600 }}>
                                ● Continuous Ingestion
                            </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {[
                                { time: "11:00 AM", service: "Snowflake Warehouse", action: "1.2M records synced" },
                                { time: "08:00 AM", service: "OpenAI Agents", action: "Multi-prompt reasoning pass" },
                                { time: "06:00 AM", service: "Real-time Customer APIs", action: "148k live signals ingested" },
                                { time: "02:00 AM", service: "Executive Report Generator", action: "Weekly synthesis compiled" },
                            ].map((row, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "16px 20px",
                                        borderRadius: 16,
                                        backgroundColor: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.07)",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                        <span style={{ fontFamily: FONT, fontSize: 13, color: "#64748b", width: 72 }}>
                                            {row.time}
                                        </span>
                                        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: "#ffffff" }}>
                                            {row.service}
                                        </span>
                                    </div>
                                    <span style={{ fontFamily: FONT, fontSize: 14, color: "#93c5fd" }}>
                                        {row.action}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </SliderCard>
                </div>
            </div>
        </AbsoluteFill>
    );
};

const SliderCard: React.FC<{ active: boolean; children: React.ReactNode }> = ({ active, children }) => {
    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                borderRadius: 24,
                backgroundColor: "rgba(11, 14, 24, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 50px rgba(0,41,199,0.14)",
                padding: "36px 40px",
                boxSizing: "border-box",
                opacity: active ? 1 : 0,
                transform: `translateY(${active ? 0 : 20}px) scale(${active ? 1 : 0.96})`,
                pointerEvents: active ? "auto" : "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            {children}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSICIÓN DEL ACTO 5: MAP EMPHASIS (0–75) + FEATURE SLIDER (75–270)
// ─────────────────────────────────────────────────────────────────────────────
export const FeatureMontage: React.FC = () => {
    const f = useCurrentFrame();

    return (
        <AbsoluteFill>
            {/* 1. Énfasis breve en Mapas Interactivos (local 0–75) */}
            {f < 75 && (
                <ZoomBlurOut frames={4}>
                    <MapEmphasis f={f} />
                </ZoomBlurOut>
            )}

            {/* 2. Feature Slider con Isotipo Rotatorio y Descendente (local 75–270) */}
            {f >= 75 && (
                <ZoomBlurOut frames={4}>
                    <FeatureSlider f={f - 75} />
                </ZoomBlurOut>
            )}
        </AbsoluteFill>
    );
};
