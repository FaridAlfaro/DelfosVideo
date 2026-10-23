// src/components/FinalOutro.tsx (240 frames = 52–60 s, f1560–f1800 global)
// Rediseñado integralmente según END.mp4 manteniendo libreto y textos actuales.
// RESTRICCIONES ESTRICTAS:
// - BIN NUNCA usa efectos de neón ni en el logo ni en los videos.
// - Logo BIN es SIEMPRE MONOCROMÁTICO (#ffffff).
// - Animación del isotipo usa gradientes sobrios, NUNCA colores neón.
// - Sin pulsos ni resplandores chillones.
// - Animación del logo elegante: efecto saliendo detrás de una pared con desvanecido (BinLogoWallReveal).
// - Ocupa SIEMPRE un máximo del 8% del alto de la pantalla (<= 86.4px -> 74px).
// - El logo aparece SOLO; recién luego de su salida aparece el lema "Decide better."
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CONNECTORS, OpenAiLogo, SnowflakeLogo } from "./Connectorlogos";
import { FONT, GradientText, OUT, SERIF, ZoomBlurOut, lerp, ramp } from "./Theme";
import { Icon } from "./Ui";
import { BinLogoWallReveal } from "./BinBrand";

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONECTA TU STACK — FLUJO DE PILLS CONECTADOS (Inspirado en END.mp4)
// ─────────────────────────────────────────────────────────────────────────────
const StackPillFlow: React.FC<{ f: number }> = ({ f }) => {
    const titleP = ramp(f, 0, 10, OUT);
    const flowP = ramp(f, 10, 24, OUT);

    const nodes = [
        { label: "Real-time Streams", icon: <Icon name="bolt" size={24} color="#14d9f5" /> },
        { label: "Data Warehouse", icon: <SnowflakeLogo size={24} /> },
        { label: "AI Agents", icon: <OpenAiLogo size={24} /> },
    ];

    return (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 38 }}>
                {/* Título de sección elegante */}
                <h2
                    style={{
                        fontFamily: FONT,
                        fontSize: 68,
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        color: "#ffffff",
                        margin: 0,
                        opacity: titleP,
                        transform: `translateY(${(1 - titleP) * -20}px)`,
                    }}
                >
                    Connect your entire stack.
                </h2>

                {/* Cadena de Pills horizontales con flechas conectoras como en END.mp4 */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        opacity: flowP,
                        transform: `scale(${lerp(0.95, 1, flowP)})`,
                    }}
                >
                    {nodes.map((node, i) => (
                        <React.Fragment key={node.label}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    padding: "16px 28px",
                                    borderRadius: 30,
                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                    border: "1px solid rgba(255, 255, 255, 0.16)",
                                    boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
                                    backdropFilter: "blur(16px)",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {node.icon}
                                </div>
                                <span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, color: "#ffffff" }}>
                                    {node.label}
                                </span>
                            </div>

                            {i < nodes.length - 1 && (
                                <svg width="28" height="24" viewBox="0 0 28 24" fill="none">
                                    <path
                                        d="M2 12H24M24 12L15 4M24 12L15 20"
                                        stroke="#93c5fd"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Conectores en cuadrícula suave (monocromática) */}
                <div style={{ display: "flex", gap: 24, marginTop: 12, opacity: ramp(f, 20, 34, OUT) }}>
                    {CONNECTORS.map(({ Logo, name }, i) => (
                        <div
                            key={name}
                            style={{
                                width: 88,
                                height: 88,
                                borderRadius: 20,
                                backgroundColor: "rgba(255, 255, 255, 0.04)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transform: `translateY(${(1 - ramp(f, 18 + i * 2, 28 + i * 2, OUT)) * 30}px)`,
                            }}
                        >
                            <Logo size={46} delay={i * 2} />
                        </div>
                    ))}
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. KEYWORDS INDIVIDUALES CON LECTURA CONFORTABLE (Inspirado en END.mp4)
// ─────────────────────────────────────────────────────────────────────────────
const KeywordSlide: React.FC<{
    title: string;
    subtitle: string;
    badge: string;
    icon: React.ReactNode;
    f: number;
}> = ({ title, subtitle, badge, icon, f }) => {
    const p = ramp(f, 0, 8, OUT);
    const exit = ramp(f, 26, 34, OUT);
    const opacity = p * (1 - exit);

    return (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 22,
                    transform: `scale(${lerp(0.96, 1.02, f / 34)})`,
                }}
            >
                {/* Badge minimalista */}
                <div
                    style={{
                        padding: "8px 20px",
                        borderRadius: 20,
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        fontFamily: FONT,
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#93c5fd",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                    }}
                >
                    {badge}
                </div>

                {/* Gran título legible */}
                <h2
                    style={{
                        fontFamily: FONT,
                        fontSize: 88,
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        color: "#ffffff",
                        margin: 0,
                        textAlign: "center",
                    }}
                >
                    {title}
                </h2>

                {/* Subtítulo descriptivo con icono */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {icon}
                    </div>
                    <span style={{ fontFamily: FONT, fontSize: 24, color: "#cbd5e1", fontWeight: 500 }}>
                        {subtitle}
                    </span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. TODO EN UN SOLO LUGAR (Convergencia unificada inspirada en END.mp4)
// ─────────────────────────────────────────────────────────────────────────────
const UnifiedConvergence: React.FC<{ f: number }> = ({ f }) => {
    const p = ramp(f, 0, 8, OUT);
    const exit = ramp(f, 22, 28, OUT);

    const items = [
        { label: "Signals", value: "2.4M" },
        { label: "Net Positive", value: "84%" },
        { label: "Trajectory", value: "+38%" },
        { label: "Adoption", value: "99.4%" },
    ];

    return (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: p * (1 - exit) }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
                <h2
                    style={{
                        fontFamily: FONT,
                        fontSize: 80,
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        color: "#ffffff",
                        margin: 0,
                    }}
                >
                    Everything. In ONE place.
                </h2>

                {/* Cuadrícula de 4 cards minimalistas de datos convergentes */}
                <div style={{ display: "flex", gap: 20 }}>
                    {items.map((it, i) => {
                        const cardP = ramp(f, 4 + i * 3, 16 + i * 3, OUT);
                        return (
                            <div
                                key={it.label}
                                style={{
                                    width: 220,
                                    padding: "24px 20px",
                                    borderRadius: 20,
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 6,
                                    opacity: cardP,
                                    transform: `translateY(${(1 - cardP) * 24}px)`,
                                }}
                            >
                                <span style={{ fontFamily: FONT, fontSize: 14, color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                    {it.label}
                                </span>
                                <span style={{ fontFamily: FONT, fontSize: 44, fontWeight: 700, color: "#ffffff" }}>
                                    {it.value}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4A. FINALE: LOGO BIN COMPLETAMENTE SOLO (Efecto salida detrás de pared)
// ─────────────────────────────────────────────────────────────────────────────
const SoloBinLogoFinale: React.FC<{ f: number }> = ({ f }) => {
    return (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            {/* Animación del Logo BIN saliendo de la pared:
                - Estrictamente monocromático (#ffffff)
                - Altura máx 76px (<= 8% de 1080)
                - Cero neón, cero pulsos */}
            <BinLogoWallReveal
                frame={f}
                startFrame={0}
                duration={16}
                exitFrame={26}
                height={76}
                color="#ffffff"
            />
        </AbsoluteFill>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4B. LEMA "Decide better." — APARECE RECIÉN LUEGO DE LA SALIDA DEL LOGO
// ─────────────────────────────────────────────────────────────────────────────
const DecideBetterFinale: React.FC<{ f: number }> = ({ f }) => {
    // Entrada elegante de texto desvaneciéndose en escala de grises / plata / azul profundo
    const p = ramp(f, 0, 10, OUT);
    const scale = lerp(0.96, 1.02, ramp(f, 0, 36, OUT));

    return (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div
                style={{
                    opacity: p,
                    transform: `scale(${scale})`,
                    textAlign: "center",
                }}
            >
                <GradientText
                    colors={["#ffffff", "#cbd5e1", "#93c5fd", "#e2e8f0", "#ffffff"]}
                    speed={1.5}
                    style={{
                        fontFamily: SERIF,
                        fontStyle: "italic",
                        fontSize: 92,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        textShadow: "0 10px 40px rgba(0,0,0,0.8)",
                    }}
                >
                    Decide better.
                </GradientText>
            </div>
        </AbsoluteFill>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSICIÓN OUTRO COMPLETA (240 FRAMES)
// ─────────────────────────────────────────────────────────────────────────────
export const FinalOutro: React.FC = () => {
    const f = useCurrentFrame();

    return (
        <AbsoluteFill>
            {/* 1. Connect your entire stack (local 0–46) */}
            {f < 46 && (
                <ZoomBlurOut frames={4}>
                    <StackPillFlow f={f} />
                </ZoomBlurOut>
            )}

            {/* 2. Keywords individuales con lectura cómoda (local 46–142) */}
            {f >= 46 && f < 78 && (
                <ZoomBlurOut frames={3}>
                    <KeywordSlide
                        title="Real-time Streams"
                        subtitle="Continuous data synchronization across all channels"
                        badge="Pipeline"
                        icon={<Icon name="bolt" size={24} color="#14d9f5" />}
                        f={f - 46}
                    />
                </ZoomBlurOut>
            )}
            {f >= 78 && f < 110 && (
                <ZoomBlurOut frames={3}>
                    <KeywordSlide
                        title="Data Warehouse"
                        subtitle="Unified petabyte-scale storage & instant ingestion"
                        badge="Infrastructure"
                        icon={<SnowflakeLogo size={24} />}
                        f={f - 78}
                    />
                </ZoomBlurOut>
            )}
            {f >= 110 && f < 142 && (
                <ZoomBlurOut frames={3}>
                    <KeywordSlide
                        title="AI Agents"
                        subtitle="Autonomous synthesis, reasoning, and strategic alerts"
                        badge="Intelligence"
                        icon={<OpenAiLogo size={24} />}
                        f={f - 110}
                    />
                </ZoomBlurOut>
            )}

            {/* 3. Everything. In ONE place. (local 142–172) */}
            {f >= 142 && f < 172 && (
                <ZoomBlurOut frames={4}>
                    <UnifiedConvergence f={f - 142} />
                </ZoomBlurOut>
            )}

            {/* 4A. Logo BIN aparece COMPLETAMENTE SOLO (local 172–206, 34 frames)
                - Saliendo de detrás de la pared
                - Monocromático (#ffffff)
                - Máximo 8% del alto de la pantalla (76px)
                - Cero neón, cero pulsos */}
            {f >= 172 && f < 206 && (
                <SoloBinLogoFinale f={f - 172} />
            )}

            {/* 4B. Recién LUEGO de la salida del logo aparece el lema "Decide better." (local 206–240, 34 frames) */}
            {f >= 206 && (
                <DecideBetterFinale f={f - 206} />
            )}
        </AbsoluteFill>
    );
};
