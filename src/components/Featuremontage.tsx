// src/components/Featuremontage.tsx (270 frames = 43–52 s, f1290–f1560 global)
// Escena 5.1 (local 0–75, f1290–f1365): Mapas Interactivos — Réplica Mecánica de MAPA.mp4 (Split Card 1460x720, 44% izq / 56% der)
// Escena 5.2 (local 75–270, f1365–f1560): Feature Slider Dinámico — Réplica Mecánica de SLIDER.mp4 (Isotipo 28x28 rotando 90deg + Contenedor 680x580)
import React from "react";
import { AbsoluteFill, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BinIsotipo } from "./BinBrand";
import { FONT, OUT, ZoomBlurOut, lerp, ramp } from "./Theme";
import { Cursor, Icon } from "./Ui";

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE AUXILIAR: SELECCIÓN DE TEXTO ESTILO MAPA.mp4 CON ANCLAJES Y ETIQUETA FLOTANTE
// ─────────────────────────────────────────────────────────────────────────────
const TextSelectionHighlight: React.FC<{
    active: boolean;
    tagLabel?: string;
    children: React.ReactNode;
}> = ({ active, tagLabel, children }) => {
    return (
        <span
            style={{
                position: "relative",
                display: "inline-block",
                padding: active ? "2px 8px" : "2px 0",
                margin: active ? "0 -4px" : "0",
                borderRadius: 6,
                backgroundColor: active ? "rgba(59, 130, 246, 0.28)" : "transparent",
                color: active ? "#93C5FD" : "inherit",
            }}
        >
            {/* Etiqueta flotante arriba del segmento seleccionado (como en MAPA.mp4) */}
            {active && tagLabel && (
                <span
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: -30,
                        transform: "translateX(-50%)",
                        padding: "3px 10px",
                        borderRadius: 6,
                        backgroundColor: "#3B82F6",
                        color: "#FFFFFF",
                        fontFamily: FONT,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                        zIndex: 20,
                    }}
                >
                    {tagLabel}
                    <span
                        style={{
                            position: "absolute",
                            left: "50%",
                            bottom: -4,
                            transform: "translateX(-50%) rotate(45deg)",
                            width: 8,
                            height: 8,
                            backgroundColor: "#3B82F6",
                        }}
                    />
                </span>
            )}

            {/* Punto de anclaje vertical izquierdo de selección */}
            {active && (
                <span
                    style={{
                        position: "absolute",
                        left: -1,
                        top: -2,
                        bottom: -2,
                        width: 2,
                        backgroundColor: "#3B82F6",
                    }}
                >
                    <span
                        style={{
                            position: "absolute",
                            left: -3,
                            top: -4,
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: "#3B82F6",
                        }}
                    />
                </span>
            )}

            {children}

            {/* Punto de anclaje vertical derecho de selección */}
            {active && (
                <span
                    style={{
                        position: "absolute",
                        right: -1,
                        top: -2,
                        bottom: -2,
                        width: 2,
                        backgroundColor: "#3B82F6",
                    }}
                >
                    <span
                        style={{
                            position: "absolute",
                            left: -3,
                            bottom: -4,
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: "#3B82F6",
                        }}
                    />
                </span>
            )}
        </span>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. ESCENA 5.1: MAPAS INTERACTIVOS — RÉPLICA MECÁNICA DE MAPA.mp4 (local 0–75)
// ─────────────────────────────────────────────────────────────────────────────
export const MapEmphasis: React.FC<{ f: number }> = ({ f }) => {
    const { fps } = useVideoConfig();

    // 3 etapas de selección sincronizadas con el zoom del mapa:
    // Segmento 0 (f0..24): "One Apple Park Way," (vista arquitectónica circular local Cupertino)
    // Segmento 1 (f24..48): "Cupertino, CA, 95014" (vista regional)
    // Segmento 2 (f48..75): Vista estructurada global con las 3 sedes
    const seg1Spring = spring({
        frame: Math.max(0, f - 24),
        fps,
        config: { damping: 28, stiffness: 120 },
    });
    const seg2Spring = spring({
        frame: Math.max(0, f - 48),
        fps,
        config: { damping: 28, stiffness: 120 },
    });

    const activeSegment = f < 24 ? 0 : f < 48 ? 1 : 2;

    // Zoom y paneo del mapa sincronizados con cada cambio de segmento (local -> regional -> global)
    const mapScale = lerp(1.38, 1.05, seg1Spring) * lerp(1.0, 0.78, seg2Spring);
    const panX = lerp(24, -18, seg1Spring) + lerp(0, -28, seg2Spring);
    const panY = lerp(14, -10, seg1Spring) + lerp(0, 12, seg2Spring);

    const enter = ramp(f, 0, 8, OUT);
    const exit = ramp(f, 67, 75, OUT);
    const cardOpacity = enter * (1 - exit);

    // Coordenadas del cursor moviéndose sobre los segmentos de texto a la izquierda
    const curX = activeSegment === 0
        ? lerp(520, 420, ramp(f, 0, 18, OUT))
        : activeSegment === 1
        ? lerp(420, 465, seg1Spring)
        : lerp(465, 390, seg2Spring);
    const curY = activeSegment === 0
        ? lerp(340, 290, ramp(f, 0, 18, OUT))
        : activeSegment === 1
        ? lerp(290, 336, seg1Spring)
        : lerp(336, 515, seg2Spring);

    const cities = [
        { meta: "PRIMARY HQ · UNITED STATES", name: "Cupertino HQ", country: "United States", signals: "42.8k" },
        { meta: "EUROPEAN DISTRICT · SPAIN", name: "Madrid District", country: "Spain", signals: "31.4k" },
        { meta: "LATAM HUB · ARGENTINA", name: "Buenos Aires Hub", country: "Argentina", signals: "28.9k" },
    ];

    return (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: cardOpacity }}>
            {/* Layout Split Card (1460×720 px) */}
            <div
                style={{
                    width: 1460,
                    height: 720,
                    borderRadius: 24,
                    overflow: "hidden",
                    backgroundColor: "rgba(12, 16, 26, 0.78)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(255, 255, 255, 0.09)",
                    display: "flex",
                    position: "relative",
                }}
            >
                {/* Panel Izquierdo (44% ancho) con fondo oscuro mate #0B0F1A */}
                <div
                    style={{
                        width: "44%",
                        height: "100%",
                        padding: "44px 44px 36px 44px",
                        boxSizing: "border-box",
                        borderRight: "1px solid rgba(255, 255, 255, 0.09)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        backgroundColor: "#0B0F1A",
                        position: "relative",
                    }}
                >
                    {/* Bloque superior: Dirección con selección interactiva estilo MAPA.mp4 */}
                    <div style={{ paddingTop: 14 }}>
                        <div
                            style={{
                                fontFamily: FONT,
                                fontSize: 11,
                                fontWeight: 600,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: "rgba(255, 255, 255, 0.45)",
                                marginBottom: 14,
                            }}
                        >
                            STREET &amp; DISTRICT
                        </div>

                        <h3
                            style={{
                                fontFamily: FONT,
                                fontSize: 34,
                                fontWeight: 700,
                                color: "#F8FAFC",
                                margin: "0 0 12px 0",
                                lineHeight: 1.28,
                                letterSpacing: "-0.03em",
                            }}
                        >
                            <TextSelectionHighlight
                                active={activeSegment === 0}
                                tagLabel="STREET & DISTRICT"
                            >
                                One Apple Park Way,
                            </TextSelectionHighlight>
                            <br />
                            <TextSelectionHighlight
                                active={activeSegment === 1}
                                tagLabel="STREET & DISTRICT"
                            >
                                Cupertino, CA, 95014
                            </TextSelectionHighlight>
                        </h3>

                        <p style={{ fontFamily: FONT, fontSize: 15, color: "#94A3B8", margin: 0 }}>
                            Real-time geographic sentiment intelligence
                        </p>
                    </div>

                    {/* Filas estructuradas de sedes y métricas con etiquetas de metadatos en mayúsculas pequeñas */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {cities.map((c, i) => {
                            const rowP = ramp(f, 4 + i * 8, 14 + i * 8, OUT);
                            const isSelectedRow = activeSegment === 2 && i === 0;
                            return (
                                <div
                                    key={c.name}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "11px 16px",
                                        borderRadius: 12,
                                        backgroundColor: isSelectedRow
                                            ? "rgba(59, 130, 246, 0.16)"
                                            : "rgba(255, 255, 255, 0.03)",
                                        border: isSelectedRow
                                            ? "1px solid rgba(59, 130, 246, 0.42)"
                                            : "1px solid rgba(255, 255, 255, 0.08)",
                                        opacity: rowP,
                                        transform: `translateY(${(1 - rowP) * 10}px)`,
                                    }}
                                >
                                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                        <span
                                            style={{
                                                fontFamily: FONT,
                                                fontSize: 11,
                                                fontWeight: 600,
                                                letterSpacing: "0.08em",
                                                textTransform: "uppercase",
                                                color: "rgba(255, 255, 255, 0.45)",
                                            }}
                                        >
                                            {c.meta}
                                        </span>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                                            <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: "#F8FAFC" }}>
                                                {c.name}
                                            </span>
                                            <span style={{ fontFamily: FONT, fontSize: 13, color: "#94A3B8" }}>
                                                {c.country}
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: FONT,
                                            fontSize: 16,
                                            fontWeight: 700,
                                            color: "#E2E8F0",
                                            fontVariantNumeric: "tabular-nums",
                                        }}
                                    >
                                        {c.signals}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pastilla minimalista inferior izquierda con metadatos estructurados */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingTop: 12,
                            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                        }}
                    >
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "6px 12px",
                                borderRadius: 8,
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.09)",
                            }}
                        >
                            <span
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    backgroundColor: "#818CF8",
                                }}
                            />
                            <span
                                style={{
                                    fontFamily: FONT,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "rgba(255, 255, 255, 0.45)",
                                }}
                            >
                                LIVE TELEMETRY
                            </span>
                        </div>
                        <span style={{ fontFamily: FONT, fontSize: 14, color: "#CBD5E1", fontWeight: 600 }}>
                            148,900 live geo signals indexed
                        </span>
                    </div>
                </div>

                {/* Panel Derecho (56% ancho): Lienzo del mapa ocupando el 100% del alto sin márgenes */}
                <div
                    style={{
                        width: "56%",
                        height: "100%",
                        position: "relative",
                        overflow: "hidden",
                        backgroundColor: "#060913",
                    }}
                >
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 818 720"
                        style={{
                            transform: `translate(${panX}px, ${panY}px) scale(${mapScale})`,
                            transformOrigin: "48% 50%",
                        }}
                    >
                        <defs>
                            <radialGradient id="mapOrb" cx="48%" cy="50%" r="52%">
                                <stop offset="0%" stopColor="rgba(67, 56, 202, 0.26)" />
                                <stop offset="55%" stopColor="rgba(30, 58, 138, 0.12)" />
                                <stop offset="100%" stopColor="transparent" />
                            </radialGradient>
                            <pattern id="cartoGrid" width="44" height="44" patternUnits="userSpaceOnUse">
                                <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
                            </pattern>
                        </defs>

                        {/* Base cartográfica */}
                        <rect width="818" height="720" fill="url(#cartoGrid)" />
                        <circle cx="390" cy="360" r="340" fill="url(#mapOrb)" />

                        {/* Polígonos de parques y sectores urbanos minimalistas */}
                        <path
                            d="M 80 120 L 290 150 L 260 310 L 60 280 Z"
                            fill="rgba(30, 58, 138, 0.12)"
                            stroke="rgba(255, 255, 255, 0.05)"
                        />
                        <path
                            d="M 520 420 L 760 390 L 790 640 L 490 610 Z"
                            fill="rgba(67, 56, 202, 0.1)"
                            stroke="rgba(255, 255, 255, 0.05)"
                        />

                        {/* Trazado vial arquitectónico */}
                        <path
                            d="M 0 210 Q 260 245 420 225 T 818 290 M 0 510 Q 340 465 818 525 M 250 0 L 310 720 M 560 0 L 515 720"
                            stroke="rgba(255, 255, 255, 0.11)"
                            strokeWidth="2.5"
                            fill="none"
                        />
                        <path
                            d="M 110 350 Q 320 330 470 365 T 790 420 M 330 110 Q 490 175 660 140"
                            stroke="rgba(148, 163, 184, 0.18)"
                            strokeWidth="1.5"
                            fill="none"
                        />

                        {/* Vista arquitectónica circular local (Anillo Apple Park Cupertino) + ondas concéntricas sutiles */}
                        <circle cx="390" cy="355" r="165" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" strokeDasharray="6 6" />
                        <circle cx="390" cy="355" r="128" fill="none" stroke="rgba(248, 250, 252, 0.22)" strokeWidth="10" />
                        <circle cx="390" cy="355" r="96" fill="none" stroke="rgba(129, 140, 248, 0.28)" strokeWidth="3" />
                        <circle cx="390" cy="355" r="64" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" />

                        {/* Nodo Central Cupertino */}
                        <circle cx="390" cy="355" r="10" fill="#F8FAFC" />
                        <circle cx="390" cy="355" r="22" fill="none" stroke="rgba(248, 250, 252, 0.45)" strokeWidth="1.5" />

                        {/* Conexiones y nodos regionales/globales que aparecen con el zoom */}
                        {seg1Spring > 0.15 && (
                            <g opacity={seg1Spring}>
                                <path
                                    d="M 390 355 Q 510 270 610 230"
                                    fill="none"
                                    stroke="rgba(147, 197, 253, 0.35)"
                                    strokeWidth="1.5"
                                    strokeDasharray="4 4"
                                />
                                <g transform="translate(610, 230)">
                                    <circle cx="0" cy="0" r="7" fill="#F8FAFC" />
                                    <circle cx="0" cy="0" r="16" fill="none" stroke="rgba(248, 250, 252, 0.35)" strokeWidth="1.5" />
                                    <text x="14" y="5" fill="#F8FAFC" fontFamily={FONT} fontSize="13" fontWeight="600">
                                        Madrid Cluster · +31.4k
                                    </text>
                                </g>
                            </g>
                        )}

                        {seg2Spring > 0.1 && (
                            <g opacity={seg2Spring}>
                                <path
                                    d="M 390 355 Q 290 440 210 500"
                                    fill="none"
                                    stroke="rgba(147, 197, 253, 0.35)"
                                    strokeWidth="1.5"
                                    strokeDasharray="4 4"
                                />
                                <g transform="translate(210, 500)">
                                    <circle cx="0" cy="0" r="7" fill="#F8FAFC" />
                                    <circle cx="0" cy="0" r="16" fill="none" stroke="rgba(248, 250, 252, 0.35)" strokeWidth="1.5" />
                                    <text x="14" y="5" fill="#F8FAFC" fontFamily={FONT} fontSize="13" fontWeight="600">
                                        Buenos Aires · +28.9k
                                    </text>
                                </g>
                            </g>
                        )}
                    </svg>

                    {/* Badge superior derecho minimalista */}
                    <div
                        style={{
                            position: "absolute",
                            top: 24,
                            right: 24,
                            padding: "8px 16px",
                            borderRadius: 999,
                            backgroundColor: "rgba(12, 16, 26, 0.78)",
                            backdropFilter: "blur(24px)",
                            border: "1px solid rgba(255, 255, 255, 0.09)",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontFamily: FONT,
                            fontSize: 13,
                            color: "#F8FAFC",
                            fontWeight: 600,
                        }}
                    >
                        <Icon name="pin" size={15} color="#CBD5E1" />
                        <span>Interactive Map Intelligence</span>
                    </div>
                </div>

                {/* Cursor vectorial interactuando con la selección de texto a la izquierda */}
                <Cursor x={curX} y={curY} size={44} opacity={0.95} />
            </div>
        </AbsoluteFill>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. ESCENA 5.2: FEATURE SLIDER DINÁMICO — RÉPLICA MECÁNICA DE SLIDER.mp4 (local 0–195)
// ─────────────────────────────────────────────────────────────────────────────
const SLIDER_ITEMS = [
    { id: 0, label: "Live Sentiment", sub: "Multi-channel signal stream" },
    { id: 1, label: "Data Dashboards", sub: "Executive BI metrics" },
    { id: 2, label: "Predictive Strategy", sub: "90-day trajectory models" },
    { id: 3, label: "24/7 Intelligence", sub: "Autonomous stack pipelines" },
];

export const FeatureSlider: React.FC<{ f: number }> = ({ f }) => {
    const { fps } = useVideoConfig();

    // 4 pasos de ~48 frames (0..48, 48..96, 96..144, 144..195)
    const stepDuration = 48;
    const currentStep = Math.min(3, Math.floor(f / stepDuration));
    const localStepFrame = f - currentStep * stepDuration;

    // Springs acumulados para cada transición (f=48, f=96, f=144) con spring({ damping: 22, stiffness: 160 })
    const t1 = spring({ frame: Math.max(0, f - 48), fps, config: { damping: 22, stiffness: 160 } });
    const t2 = spring({ frame: Math.max(0, f - 96), fps, config: { damping: 22, stiffness: 160 } });
    const t3 = spring({ frame: Math.max(0, f - 144), fps, config: { damping: 22, stiffness: 160 } });

    const stepFloat = t1 + t2 + t3; // Va suavemente de 0 -> 1 -> 2 -> 3
    const ITEM_HEIGHT = 96;

    // El isotipo.svg (28×28px, #ffffff) desciende verticalmente y rota 90deg sobre su centro en cada transición
    const isotipoY = stepFloat * ITEM_HEIGHT;
    const isotipoRotation = stepFloat * 90;

    // Tonalidad del fondo orgánico del contenedor derecho (680x580) en cada paso (zafiro -> índigo -> violeta apagado -> pizarra)
    const bgOrbColor = interpolateColors(
        stepFloat,
        [0, 1, 2, 3],
        ["#1E3A8A", "#4338CA", "#6D28D9", "#334155"]
    );

    return (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div
                style={{
                    width: 1320,
                    height: 620,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 64,
                }}
            >
                {/* ── Columna Izquierda: Navegación Vertical con isotipo.svg (28x28px, #ffffff) ── */}
                <div style={{ width: 520, display: "flex", flexDirection: "column", position: "relative" }}>
                    {/* Único isotipo.svg que desciende y rota 90deg por paso */}
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 22,
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: `translateY(${isotipoY}px)`,
                            zIndex: 10,
                        }}
                    >
                        <BinIsotipo size={28} color="#ffffff" rotation={isotipoRotation} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", paddingLeft: 48 }}>
                        {SLIDER_ITEMS.map((item, idx) => {
                            const dist = Math.min(1, Math.abs(stepFloat - idx));
                            const itemOpacity = lerp(1, 0.28, dist);
                            const itemTranslateX = lerp(12, 0, dist);
                            const isActive = currentStep === idx;

                            return (
                                <div
                                    key={item.id}
                                    style={{
                                        height: ITEM_HEIGHT,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        opacity: itemOpacity,
                                        transform: `translateX(${itemTranslateX}px)`,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontFamily: FONT,
                                            fontSize: 42,
                                            fontWeight: isActive ? 700 : 500,
                                            color: "#FFFFFF",
                                            letterSpacing: "-0.03em",
                                            lineHeight: 1.12,
                                        }}
                                    >
                                        {item.label}
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: FONT,
                                            fontSize: 16,
                                            color: isActive ? "#CBD5E1" : "#64748B",
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

                {/* ── Columna Derecha: Contenedor Cuadrado Redondeado 680×580 px (Estilo SLIDER.mp4) ── */}
                <div
                    style={{
                        width: 680,
                        height: 580,
                        borderRadius: "36px",
                        border: "1px solid rgba(255, 255, 255, 0.09)",
                        backgroundColor: "rgba(12, 16, 26, 0.78)",
                        backdropFilter: "blur(24px)",
                        position: "relative",
                        overflow: "hidden",
                        flexShrink: 0,
                    }}
                >
                    {/* Fondo de gradiente orgánico texturizado que cambia suavemente de tonalidad */}
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "45%",
                            width: 620,
                            height: 520,
                            marginLeft: -310,
                            marginTop: -260,
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${bgOrbColor} 0%, rgba(12, 16, 26, 0) 72%)`,
                            filter: "blur(65px)",
                            opacity: 0.75,
                            transform: `rotate(${f * 0.6}deg) scale(${1 + Math.sin(f * 0.06) * 0.06})`,
                            pointerEvents: "none",
                        }}
                    />

                    {/* PASO 1: Live Sentiment (f1365–f1413, local 0–48) — Dos tarjetas de vidrio superpuestas estilo Replies/Follows Up */}
                    {currentStep === 0 && (
                        <LiveSentimentCard f={localStepFrame} fps={fps} />
                    )}

                    {/* PASO 2: Data Dashboards (f1413–f1461, local 48–96) — Tarjetas en cascada vertical + radar minimalista y KPIs */}
                    {currentStep === 1 && (
                        <DataDashboardsCard f={localStepFrame} fps={fps} />
                    )}

                    {/* PASO 3: Predictive Strategy (f1461–f1509, local 96–144) — Curva de proyección a 90 días y cono de probabilidad */}
                    {currentStep === 2 && (
                        <PredictiveStrategyCard f={localStepFrame} fps={fps} />
                    )}

                    {/* PASO 4: 24/7 Intelligence (f1509–f1560, local 144–195) — Scroll vertical continuo + regla horaria horizontal */}
                    {currentStep === 3 && (
                        <ContinuousIntelligenceCard f={localStepFrame} />
                    )}
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ── Card 1: Live Sentiment (Dos tarjetas de vidrio superpuestas estilo conversación/señal de SLIDER.mp4) ──
const LiveSentimentCard: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
    const card1In = spring({ frame: f, fps, config: { damping: 20, stiffness: 150 } });
    const card2In = spring({ frame: Math.max(0, f - 10), fps, config: { damping: 20, stiffness: 150 } });
    const badgeReveal = ramp(f, 14, 26, OUT);

    return (
        <AbsoluteFill style={{ padding: "38px 40px", boxSizing: "border-box", justifyContent: "space-between" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>
                    Live Signals Stream
                </span>
                <span style={{ fontFamily: FONT, fontSize: 13, color: "#CBD5E1", fontWeight: 600 }}>
                    ● Synchronized (14 channels)
                </span>
            </div>

            <div style={{ position: "relative", height: 430 }}>
                {/* Tarjeta Superior (estilo mensaje/señal entrante en SLIDER.mp4) */}
                <div
                    style={{
                        position: "absolute",
                        left: 16,
                        right: 36,
                        top: 6,
                        padding: "24px 26px",
                        borderRadius: 24,
                        backgroundColor: "rgba(12, 16, 26, 0.78)",
                        backdropFilter: "blur(24px)",
                        border: "1px solid rgba(255, 255, 255, 0.09)",
                        opacity: card1In,
                        transform: `translateY(${lerp(24, 0, card1In)}px) scale(${lerp(0.95, 1, card1In)})`,
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontFamily: FONT, fontSize: 13, color: "#94A3B8" }}>Just now · Channel Signal</span>
                        <span
                            style={{
                                fontFamily: FONT,
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#F8FAFC",
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.14)",
                                padding: "4px 12px",
                                borderRadius: 999,
                            }}
                        >
                            +42.8%
                        </span>
                    </div>
                    <div style={{ fontFamily: FONT, fontSize: 19, color: "#F8FAFC", fontWeight: 500, lineHeight: 1.38 }}>
                        Campaign reach drove +42.8% positive sentiment surge
                    </div>
                </div>

                {/* Segunda Tarjeta de Vidrio Superpuesta (como la respuesta superpuesta en SLIDER.mp4) */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 158,
                        padding: "26px 28px",
                        borderRadius: 24,
                        backgroundColor: "rgba(18, 24, 38, 0.88)",
                        backdropFilter: "blur(24px)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        opacity: card2In,
                        transform: `translateY(${lerp(36, 0, card2In)}px) scale(${lerp(0.95, 1, card2In)})`,
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ fontFamily: FONT, fontSize: 18, color: "#F8FAFC", fontWeight: 500 }}>
                                Competitive benchmark outpaces key industry peers
                            </div>
                            <div style={{ fontFamily: FONT, fontSize: 13, color: "#94A3B8", marginTop: 4 }}>2m ago</div>
                        </div>
                        <span
                            style={{
                                fontFamily: FONT,
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#F8FAFC",
                                backgroundColor: "rgba(67, 56, 202, 0.28)",
                                border: "1px solid rgba(255, 255, 255, 0.14)",
                                padding: "5px 14px",
                                borderRadius: 999,
                                flexShrink: 0,
                            }}
                        >
                            84% Net
                        </span>
                    </div>

                    <div
                        style={{
                            height: 1,
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                        }}
                    />

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            opacity: badgeReveal,
                        }}
                    >
                        <div>
                            <div style={{ fontFamily: FONT, fontSize: 17, color: "#E2E8F0", fontWeight: 500 }}>
                                Market adoption indexed across enterprise customer accounts
                            </div>
                            <div style={{ fontFamily: FONT, fontSize: 13, color: "#94A3B8", marginTop: 4 }}>4m ago</div>
                        </div>
                        <span
                            style={{
                                fontFamily: FONT,
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#F8FAFC",
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.14)",
                                padding: "5px 14px",
                                borderRadius: 999,
                                flexShrink: 0,
                            }}
                        >
                            Verified
                        </span>
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ── Card 2: Data Dashboards (Tarjetas horizontales apiladas en cascada + radar minimalista y KPIs) ──
const DataDashboardsCard: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
    const s0 = spring({ frame: f, fps, config: { damping: 20, stiffness: 160 } });
    const s1 = spring({ frame: Math.max(0, f - 6), fps, config: { damping: 20, stiffness: 160 } });
    const s2 = spring({ frame: Math.max(0, f - 12), fps, config: { damping: 20, stiffness: 160 } });

    return (
        <AbsoluteFill style={{ padding: "36px 40px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>
                    Executive BI Metrics
                </span>
                <span style={{ fontFamily: FONT, fontSize: 13, color: "#CBD5E1", fontWeight: 600 }}>
                    Real-time synthesis
                </span>
            </div>

            {/* Fila 1 en cascada: Net Positive 84% + Signals Analyzed 2.4M */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    opacity: s0,
                    transform: `translateY(${lerp(24, 0, s0)}px)`,
                }}
            >
                <div
                    style={{
                        padding: "18px 22px",
                        borderRadius: 20,
                        backgroundColor: "rgba(12, 16, 26, 0.78)",
                        border: "1px solid rgba(255, 255, 255, 0.09)",
                    }}
                >
                    <div style={{ fontFamily: FONT, fontSize: 14, color: "#94A3B8" }}>Net Positive</div>
                    <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 700, color: "#F8FAFC", marginTop: 4 }}>
                        84%
                    </div>
                </div>
                <div
                    style={{
                        padding: "18px 22px",
                        borderRadius: 20,
                        backgroundColor: "rgba(12, 16, 26, 0.78)",
                        border: "1px solid rgba(255, 255, 255, 0.09)",
                    }}
                >
                    <div style={{ fontFamily: FONT, fontSize: 14, color: "#94A3B8" }}>Signals Analyzed</div>
                    <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 700, color: "#F8FAFC", marginTop: 4 }}>
                        2.4M
                    </div>
                </div>
            </div>

            {/* Fila 2 en cascada: Gráfico de radar minimalista + KPIs (Net Promoter: +68, Customer Trust: 94.2%) */}
            <div
                style={{
                    padding: "20px 24px",
                    borderRadius: 20,
                    backgroundColor: "rgba(12, 16, 26, 0.78)",
                    border: "1px solid rgba(255, 255, 255, 0.09)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                    opacity: s1,
                    transform: `translateY(${lerp(24, 0, s1)}px)`,
                }}
            >
                {/* Radar minimalista vectorial */}
                <svg width="136" height="136" viewBox="0 0 140 140" style={{ flexShrink: 0 }}>
                    <polygon
                        points="70,12 124,48 104,114 36,114 16,48"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.12)"
                        strokeWidth="1"
                    />
                    <polygon
                        points="70,32 106,56 92,98 48,98 34,56"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="1"
                    />
                    <polygon
                        points="70,18 118,50 98,108 42,102 26,52"
                        fill="rgba(99, 102, 241, 0.25)"
                        stroke="#F8FAFC"
                        strokeWidth="2"
                    />
                </svg>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div
                        style={{
                            padding: "12px 16px",
                            borderRadius: 14,
                            backgroundColor: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <span style={{ fontFamily: FONT, fontSize: 15, color: "#CBD5E1" }}>Net Promoter: +68</span>
                        <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#93C5FD" }}>Top Decile</span>
                    </div>
                    <div
                        style={{
                            padding: "12px 16px",
                            borderRadius: 14,
                            backgroundColor: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <span style={{ fontFamily: FONT, fontSize: 15, color: "#CBD5E1" }}>Customer Trust: 94.2%</span>
                        <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#F8FAFC" }}>Verified</span>
                    </div>
                </div>
            </div>

            {/* Fila 3 en cascada: Barras de progresión limpia */}
            <div
                style={{
                    flex: 1,
                    borderRadius: 20,
                    backgroundColor: "rgba(12, 16, 26, 0.78)",
                    border: "1px solid rgba(255, 255, 255, 0.09)",
                    padding: "16px 22px",
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 10,
                    opacity: s2,
                    transform: `translateY(${lerp(24, 0, s2)}px)`,
                }}
            >
                {[45, 60, 52, 75, 68, 88, 80, 96, 92, 100].map((v, i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: `${v * s2}%`,
                            borderRadius: "5px 5px 2px 2px",
                            background: i === 9 ? "#F8FAFC" : "linear-gradient(180deg, #818CF8 0%, #3B82F6 100%)",
                        }}
                    />
                ))}
            </div>
        </AbsoluteFill>
    );
};

// ── Card 3: Predictive Strategy (Curva de proyección a 90 días y cono de probabilidad en blanco/índigo translúcido) ──
const PredictiveStrategyCard: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
    const enter = spring({ frame: f, fps, config: { damping: 22, stiffness: 150 } });
    const drawP = ramp(f, 2, 28, OUT);

    return (
        <AbsoluteFill style={{ padding: "38px 40px", boxSizing: "border-box", justifyContent: "space-between" }}>
            <div
                style={{
                    padding: "30px 32px",
                    borderRadius: 26,
                    backgroundColor: "rgba(12, 16, 26, 0.78)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(255, 255, 255, 0.09)",
                    height: "100%",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    opacity: enter,
                    transform: `translateY(${lerp(20, 0, enter)}px)`,
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <span style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, color: "#F8FAFC" }}>
                            90-Day Predictive Strategy
                        </span>
                        <div style={{ fontFamily: FONT, fontSize: 15, color: "#94A3B8", marginTop: 4 }}>
                            Market adoption trajectory model
                        </div>
                    </div>
                    <div
                        style={{
                            fontFamily: FONT,
                            fontSize: 36,
                            fontWeight: 700,
                            color: "#F8FAFC",
                            letterSpacing: "-0.03em",
                        }}
                    >
                        +38%
                    </div>
                </div>

                {/* Curva de proyección + Cono de probabilidad en blanco/índigo translúcido */}
                <svg width="100%" height="250" viewBox="0 0 540 250" style={{ overflow: "visible" }}>
                    <defs>
                        <linearGradient id="probCone" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="rgba(129, 140, 248, 0.06)" />
                            <stop offset="100%" stopColor="rgba(248, 250, 252, 0.22)" />
                        </linearGradient>
                        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(67, 56, 202, 0.28)" />
                            <stop offset="100%" stopColor="rgba(67, 56, 202, 0)" />
                        </linearGradient>
                    </defs>

                    {[50, 110, 170, 225].map((y) => (
                        <line key={y} x1="0" x2="540" y1={y} y2={y} stroke="rgba(255, 255, 255, 0.06)" />
                    ))}

                    {/* Cono de probabilidad (se abre desde el punto medio hacia los 90 días) */}
                    <path
                        d="M 240 132 Q 380 80 540 14 L 540 96 Q 380 128 240 132 Z"
                        fill="url(#probCone)"
                        opacity={drawP}
                    />
                    <path
                        d="M 240 132 Q 380 80 540 14"
                        fill="none"
                        stroke="rgba(248, 250, 252, 0.35)"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        opacity={drawP}
                    />
                    <path
                        d="M 240 132 Q 380 128 540 96"
                        fill="none"
                        stroke="rgba(129, 140, 248, 0.35)"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        opacity={drawP}
                    />

                    {/* Área bajo la curva */}
                    <path
                        d="M 0 198 Q 130 180 240 132 T 540 48 L 540 230 L 0 230 Z"
                        fill="url(#areaFill)"
                        opacity={drawP}
                    />

                    {/* Curva principal */}
                    <path
                        d="M 0 198 Q 130 180 240 132 T 540 48"
                        fill="none"
                        stroke="#F8FAFC"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray={1}
                        strokeDashoffset={1 - drawP}
                    />

                    <circle cx="540" cy="48" r="6" fill="#F8FAFC" opacity={drawP} />
                    <circle cx="540" cy="48" r="14" fill="none" stroke="rgba(248, 250, 252, 0.4)" strokeWidth="1.5" opacity={drawP} />
                </svg>

                <div style={{ display: "flex", gap: 14 }}>
                    <span
                        style={{
                            padding: "8px 16px",
                            borderRadius: 999,
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            fontFamily: FONT,
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#E2E8F0",
                        }}
                    >
                        Confidence: 99.4%
                    </span>
                    <span
                        style={{
                            padding: "8px 16px",
                            borderRadius: 999,
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            fontFamily: FONT,
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#E2E8F0",
                        }}
                    >
                        Industry Delta: +51.5%
                    </span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ── Card 4: 24/7 Intelligence (Scroll vertical continuo + regla horaria horizontal graduada de SLIDER.mp4 00:07–00:09) ──
const PIPELINE_ROWS = [
    { time: "11:00 AM", service: "Snowflake Warehouse", action: "1.2M records synced" },
    { time: "08:00 AM", service: "OpenAI Agents", action: "Multi-prompt reasoning pass" },
    { time: "06:00 AM", service: "Real-time Customer APIs", action: "148k live signals ingested" },
    { time: "02:00 AM", service: "Executive Report Generator", action: "Weekly synthesis compiled" },
];

const HOURS = ["4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM"];

const ContinuousIntelligenceCard: React.FC<{ f: number }> = ({ f }) => {
    // Scroll vertical continuo hacia arriba (translateY negativo constante)
    const ROW_H = 66;
    const GAP = 12;
    const BLOCK_H = PIPELINE_ROWS.length * (ROW_H + GAP);
    const scrollY = -((f * 2.4) % BLOCK_H);

    // Regla graduada de tiempo deslizándose horizontalmente en la base
    const rulerShiftX = -(f * 3.2);

    return (
        <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {/* Encabezado superior */}
            <div
                style={{
                    padding: "32px 38px 16px 38px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    zIndex: 10,
                }}
            >
                <span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>
                    Autonomous Data Stack
                </span>
                <span style={{ fontFamily: FONT, fontSize: 13, color: "#CBD5E1", fontWeight: 600 }}>
                    ● Continuous Ingestion
                </span>
            </div>

            {/* Ventana de máscara con la pila de pastillas haciendo scroll continuo hacia arriba */}
            <div
                style={{
                    flex: 1,
                    padding: "0 38px",
                    overflow: "hidden",
                    position: "relative",
                    WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
                    maskImage: "linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: GAP,
                        transform: `translateY(${scrollY}px)`,
                    }}
                >
                    {[...PIPELINE_ROWS, ...PIPELINE_ROWS, ...PIPELINE_ROWS].map((row, i) => (
                        <div
                            key={i}
                            style={{
                                height: ROW_H,
                                boxSizing: "border-box",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "0 22px",
                                borderRadius: 999,
                                backgroundColor: "rgba(12, 16, 26, 0.82)",
                                backdropFilter: "blur(24px)",
                                border: "1px solid rgba(255, 255, 255, 0.11)",
                                flexShrink: 0,
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <span
                                    style={{
                                        fontFamily: FONT,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "#94A3B8",
                                        width: 68,
                                    }}
                                >
                                    {row.time}
                                </span>
                                <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#F8FAFC" }}>
                                    {row.service}
                                </span>
                            </div>
                            <span style={{ fontFamily: FONT, fontSize: 14, color: "#CBD5E1", fontWeight: 500 }}>
                                {row.action}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Regla horaria graduada deslizándose horizontalmente en la base (6 AM, 7 AM, 8 AM, 9 AM...) */}
            <div
                style={{
                    height: 86,
                    backgroundColor: "rgba(10, 13, 22, 0.92)",
                    borderTop: "1px solid rgba(255, 255, 255, 0.09)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "flex-start",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        transform: `translateX(${rulerShiftX}px)`,
                        paddingTop: 10,
                    }}
                >
                    {HOURS.map((hourLabel, hIdx) => (
                        <div
                            key={hIdx}
                            style={{
                                width: 128,
                                flexShrink: 0,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {/* Ticks graduados por hora (8 subdivisiones cada 16px) */}
                            <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
                                {Array.from({ length: 8 }).map((_, tIdx) => {
                                    const isHour = tIdx === 0;
                                    const isHalf = tIdx === 4;
                                    const tickH = isHour ? 22 : isHalf ? 14 : 9;
                                    return (
                                        <div
                                            key={tIdx}
                                            style={{
                                                width: 16,
                                                display: "flex",
                                                justifyContent: "flex-start",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 1.5,
                                                    height: tickH,
                                                    backgroundColor: isHour
                                                        ? "rgba(248, 250, 252, 0.65)"
                                                        : "rgba(255, 255, 255, 0.22)",
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <span
                                style={{
                                    fontFamily: FONT,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "#94A3B8",
                                    marginTop: 8,
                                    letterSpacing: "0.04em",
                                }}
                            >
                                {hourLabel}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSICIÓN DEL ACTO 5: MAP EMPHASIS (0–75) + FEATURE SLIDER (75–270)
// ─────────────────────────────────────────────────────────────────────────────
export const FeatureMontage: React.FC = () => {
    const f = useCurrentFrame();

    return (
        <AbsoluteFill>
            {/* Escena 5.1 · Mapas Interactivos (local 0–75, f1290–f1365) */}
            {f < 75 && (
                <ZoomBlurOut frames={4}>
                    <MapEmphasis f={f} />
                </ZoomBlurOut>
            )}

            {/* Escena 5.2 · Feature Slider Dinámico (local 75–270, f1365–f1560) */}
            {f >= 75 && (
                <ZoomBlurOut frames={4}>
                    <FeatureSlider f={f - 75} />
                </ZoomBlurOut>
            )}
        </AbsoluteFill>
    );
};
