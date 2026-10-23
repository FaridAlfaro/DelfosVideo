// src/components/FinalOutro.tsx (240 frames = 52–60 s, f1560–f1800 global)
// Escena 6.1 (local 0–46, f1560–f1606): "Connect your entire stack." + píldoras estilo END.mp4 + esfera de gradiente índigo difuso.
// Escena 6.2 (local 46–142, f1606–f1702): 32 frames exactos por tarjeta (Pipeline, Infrastructure, Intelligence) con morphing suave en tarjeta central y orbe rotatorio de fondo.
// Escena 6.3 (local 142–172, f1702–f1732): "Everything. In ONE place." + 4 tarjetas convergiendo hacia el centro.
// Escena 6.4 (local 172–206, f1732–f1766): Logo monocromático BIN (#ffffff, 76px) en solitario (escala 0.95->1.0 + blur(10px)->0px).
// Escena 6.5 (local 206–240, f1766–f1800): "Decide better." en 92px serif itálica (Newsreader / serif) con gradiente blanco-plata y fade-out a negro absoluto en f1800.
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BinLogoEditorialReveal } from "./BinBrand";
import { CONNECTORS, OpenAiLogo, SnowflakeLogo } from "./Connectorlogos";
import { EDITORIAL, FONT, GradientText, IO, OUT, SERIF, ZoomBlurOut, lerp, ramp } from "./Theme";
import { Icon } from "./Ui";

// ─────────────────────────────────────────────────────────────────────────────
// ESCENA 6.1: CONECTA TU STACK — FLUJO DE PÍLDORAS ESTILO END.mp4 (local 0–46)
// ─────────────────────────────────────────────────────────────────────────────
const StackPillFlow: React.FC<{ f: number }> = ({ f }) => {
    const titleP = ramp(f, 0, 10, OUT);
    const flowP = ramp(f, 8, 22, OUT);

    const orbX = lerp(-120, 120, f / 46);
    const orbY = lerp(30, -30, f / 46);

    const nodes = [
        { label: "Real-time Streams", icon: <Icon name="bolt" size={24} color="#F8FAFC" /> },
        { label: "Data Warehouse", icon: <SnowflakeLogo size={24} /> },
        { label: "AI Agents", icon: <OpenAiLogo size={24} /> },
    ];

    return (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {/* Esfera de gradiente índigo difuso moviéndose detrás (Estilo END.mp4) */}
            <div
                style={{
                    position: "absolute",
                    width: 880,
                    height: 620,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle at 50% 50%, rgba(67, 56, 202, 0.65) 0%, rgba(30, 58, 138, 0.45) 48%, rgba(109, 40, 217, 0.25) 72%, transparent 100%)",
                    filter: "blur(65px)",
                    transform: `translate(${orbX}px, ${orbY}px)`,
                    pointerEvents: "none",
                }}
            />

            <div style={{ position: "relative", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: 38 }}>
                <h2
                    style={{
                        fontFamily: FONT,
                        fontSize: 68,
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        color: "#F8FAFC",
                        margin: 0,
                        opacity: titleP,
                        transform: `translateY(${(1 - titleP) * -18}px)`,
                    }}
                >
                    Connect your entire stack.
                </h2>

                {/* Cadena de Píldoras limpias estilo END.mp4 */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        opacity: flowP,
                        transform: `scale(${lerp(0.96, 1, flowP)})`,
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
                                    borderRadius: 999,
                                    backgroundColor: "rgba(12, 16, 26, 0.78)",
                                    backdropFilter: "blur(24px)",
                                    border: "1px solid rgba(255, 255, 255, 0.09)",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {node.icon}
                                </div>
                                <span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, color: "#F8FAFC" }}>
                                    {node.label}
                                </span>
                            </div>

                            {i < nodes.length - 1 && (
                                <svg width="28" height="24" viewBox="0 0 28 24" fill="none">
                                    <path
                                        d="M2 12H24M24 12L15 4M24 12L15 20"
                                        stroke="#93C5FD"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Conectores en cuadrícula minimalista */}
                <div style={{ display: "flex", gap: 22, marginTop: 10, opacity: ramp(f, 16, 30, OUT) }}>
                    {CONNECTORS.map(({ Logo, name }, i) => (
                        <div
                            key={name}
                            style={{
                                width: 86,
                                height: 86,
                                borderRadius: 22,
                                backgroundColor: "rgba(255, 255, 255, 0.04)",
                                backdropFilter: "blur(24px)",
                                border: "1px solid rgba(255, 255, 255, 0.09)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transform: `translateY(${(1 - ramp(f, 14 + i * 2, 24 + i * 2, OUT)) * 22}px)`,
                            }}
                        >
                            <Logo size={44} delay={i * 2} />
                        </div>
                    ))}
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// ESCENA 6.2: MORPHING SUAVE DE CONTENIDO EN TARJETA CENTRAL (local 46–142 = 96f, 32f exactos por tarjeta)
// ─────────────────────────────────────────────────────────────────────────────
const KEYWORD_SLIDES = [
    {
        badge: "Pipeline",
        title: "Real-time Streams",
        subtitle: "Continuous data synchronization across all channels",
        icon: <Icon name="bolt" size={24} color="#F8FAFC" />,
    },
    {
        badge: "Infrastructure",
        title: "Data Warehouse",
        subtitle: "Unified petabyte-scale storage & instant ingestion",
        icon: <SnowflakeLogo size={24} />,
    },
    {
        badge: "Intelligence",
        title: "AI Agents",
        subtitle: "Autonomous synthesis, reasoning, and strategic alerts",
        icon: <OpenAiLogo size={24} />,
    },
];

const MorphingKeywordStage: React.FC<{ f: number }> = ({ f }) => {
    // f va de 0 a 96 (32 frames exactos por tarjeta: 0..32, 32..64, 64..96)
    const idx = Math.min(2, Math.floor(f / 32));
    const localF = f - idx * 32;
    const slide = KEYWORD_SLIDES[idx];

    // Entrada y salida del contenedor general (en 0..6 y 90..96)
    const stageIn = ramp(f, 0, 6, OUT);
    const stageOut = ramp(f, 90, 96, OUT);
    const stageOpacity = stageIn * (1 - stageOut);

    // Morphing interno suave de contenido dentro de los 32 frames de cada tarjeta
    const contentIn = ramp(localF, 0, 6, OUT);
    const contentOut = idx < 2 ? ramp(localF, 27, 32, IO) : 0;
    const contentOpacity = contentIn * (1 - contentOut);
    const contentY = (1 - contentIn) * 14 - contentOut * 12;
    const contentBlur = (1 - contentIn) * 6 + contentOut * 6;

    // El orbe de gradiente difuso del fondo rota ligeramente de posición (estilo END.mp4)
    const orbAngle = lerp(-24, 32, f / 96);
    const orbX = lerp(-140, 140, f / 96);
    const orbY = Math.sin((f / 96) * Math.PI) * -45;

    return (
        <AbsoluteFill
            style={{
                alignItems: "center",
                justifyContent: "center",
                opacity: stageOpacity,
                overflow: "hidden",
            }}
        >
            {/* Orbe de gradiente difuso rotando suavemente detrás */}
            <div
                style={{
                    position: "absolute",
                    width: 860,
                    height: 620,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(ellipse at 50% 50%, rgba(67, 56, 202, 0.72) 0%, rgba(30, 58, 138, 0.5) 45%, rgba(109, 40, 217, 0.28) 72%, transparent 100%)",
                    filter: "blur(65px)",
                    transform: `translate(${orbX}px, ${orbY}px) rotate(${orbAngle}deg)`,
                    pointerEvents: "none",
                }}
            />

            {/* Contenedor de tarjeta central persistente de cristal ahumado mate */}
            <div
                style={{
                    position: "relative",
                    zIndex: 5,
                    width: 1120,
                    padding: "64px 72px",
                    borderRadius: 44,
                    backgroundColor: "rgba(12, 16, 26, 0.78)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(255, 255, 255, 0.09)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 22,
                        opacity: contentOpacity,
                        transform: `translateY(${contentY}px)`,
                        filter: `blur(${contentBlur}px)`,
                    }}
                >
                    {/* Badge minimalista */}
                    <div
                        style={{
                            padding: "8px 22px",
                            borderRadius: 999,
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.14)",
                            fontFamily: FONT,
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#CBD5E1",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                        }}
                    >
                        {slide.badge}
                    </div>

                    {/* Gran título legible */}
                    <h2
                        style={{
                            fontFamily: FONT,
                            fontSize: 84,
                            fontWeight: 700,
                            letterSpacing: "-0.03em",
                            color: "#F8FAFC",
                            margin: 0,
                            textAlign: "center",
                        }}
                    >
                        {slide.title}
                    </h2>

                    {/* Subtítulo descriptivo con icono */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 12,
                                backgroundColor: "rgba(255, 255, 255, 0.04)",
                                border: "1px solid rgba(255, 255, 255, 0.09)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {slide.icon}
                        </div>
                        <span style={{ fontFamily: FONT, fontSize: 24, color: "#CBD5E1", fontWeight: 500 }}>
                            {slide.subtitle}
                        </span>
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// ESCENA 6.3: CONVERGENCIA UNIFICADA — "Everything. In ONE place." (local 142–172)
// ─────────────────────────────────────────────────────────────────────────────
const UnifiedConvergence: React.FC<{ f: number }> = ({ f }) => {
    const { fps } = useVideoConfig();
    const p = ramp(f, 0, 7, OUT);
    const exit = ramp(f, 24, 30, OUT);

    const items = [
        { label: "Signals", value: "2.4M", startX: -60, startY: 28 },
        { label: "Net Positive", value: "84%", startX: -20, startY: 32 },
        { label: "Trajectory", value: "+38%", startX: 20, startY: 32 },
        { label: "Adoption", value: "99.4%", startX: 60, startY: 28 },
    ];

    return (
        <AbsoluteFill
            style={{
                alignItems: "center",
                justifyContent: "center",
                opacity: p * (1 - exit),
                filter: `blur(${exit * 10}px)`,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    width: 780,
                    height: 520,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(67, 56, 202, 0.55) 0%, rgba(30, 58, 138, 0.35) 50%, transparent 100%)",
                    filter: "blur(65px)",
                    pointerEvents: "none",
                }}
            />

            <div style={{ position: "relative", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
                <h2
                    style={{
                        fontFamily: FONT,
                        fontSize: 80,
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        color: "#F8FAFC",
                        margin: 0,
                    }}
                >
                    Everything. In ONE place.
                </h2>

                <div style={{ display: "flex", gap: 20 }}>
                    {items.map((it, i) => {
                        const conv = spring({
                            frame: Math.max(0, f - i * 2),
                            fps,
                            config: { damping: 22, stiffness: 170 },
                        });
                        return (
                            <div
                                key={it.label}
                                style={{
                                    width: 220,
                                    padding: "24px 20px",
                                    borderRadius: 22,
                                    backgroundColor: "rgba(12, 16, 26, 0.78)",
                                    backdropFilter: "blur(24px)",
                                    border: "1px solid rgba(255, 255, 255, 0.09)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 6,
                                    opacity: conv,
                                    transform: `translate(${lerp(it.startX, 0, conv)}px, ${lerp(it.startY, 0, conv)}px) scale(${lerp(0.92, 1, conv)})`,
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: FONT,
                                        fontSize: 13,
                                        color: "#94A3B8",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        fontWeight: 600,
                                    }}
                                >
                                    {it.label}
                                </span>
                                <span style={{ fontFamily: FONT, fontSize: 44, fontWeight: 700, color: "#F8FAFC" }}>
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
// ESCENA 6.4: LOGO BIN EN SOLITARIO (local 172–206, 34 frames)
// ─────────────────────────────────────────────────────────────────────────────
const SoloBinLogoFinale: React.FC<{ f: number }> = ({ f }) => {
    return (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <BinLogoEditorialReveal
                frame={f}
                startFrame={0}
                duration={18}
                exitFrame={24}
                height={76}
                color="#ffffff"
                initialScale={0.95}
                initialBlur={10}
            />
        </AbsoluteFill>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// ESCENA 6.5: "Decide better." + FADE-OUT A NEGRO ABSOLUTO EN f1800 (local 206–240, 34 frames)
// ─────────────────────────────────────────────────────────────────────────────
const DecideBetterFinale: React.FC<{ f: number }> = ({ f }) => {
    const enterP = ramp(f, 0, 12, EDITORIAL);
    const scale = lerp(0.96, 1.0, ramp(f, 0, 28, OUT));
    const blur = lerp(8, 0, enterP);
    // Fade-out a negro absoluto en el frame 1800 (local 34)
    const fadeToBlack = ramp(f, 26, 34, OUT);

    return (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div
                style={{
                    opacity: enterP * (1 - fadeToBlack),
                    transform: `scale(${scale})`,
                    filter: `blur(${blur}px)`,
                    textAlign: "center",
                }}
            >
                <GradientText
                    colors={["#FFFFFF", "#F8FAFC", "#CBD5E1", "#94A3B8", "#FFFFFF"]}
                    speed={1.2}
                    style={{
                        fontFamily: SERIF,
                        fontStyle: "italic",
                        fontSize: 92,
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                    }}
                >
                    Decide better.
                </GradientText>
            </div>

            {/* Fade-out a negro absoluto (#000000) en el frame 1800 */}
            <AbsoluteFill
                style={{
                    backgroundColor: "#000000",
                    opacity: fadeToBlack,
                    pointerEvents: "none",
                }}
            />
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
            {/* Escena 6.1 · Connect your entire stack (local 0–46, f1560–f1606) */}
            {f < 46 && (
                <ZoomBlurOut frames={4}>
                    <StackPillFlow f={f} />
                </ZoomBlurOut>
            )}

            {/* Escena 6.2 · 32f exactos por tarjeta con morphing suave y orbe rotatorio (local 46–142, f1606–f1702) */}
            {f >= 46 && f < 142 && (
                <MorphingKeywordStage f={f - 46} />
            )}

            {/* Escena 6.3 · Everything. In ONE place. (local 142–172, f1702–f1732) */}
            {f >= 142 && f < 172 && (
                <UnifiedConvergence f={f - 142} />
            )}

            {/* Escena 6.4 · Logo BIN en solitario (local 172–206, f1732–f1766) */}
            {f >= 172 && f < 206 && (
                <SoloBinLogoFinale f={f - 172} />
            )}

            {/* Escena 6.5 · "Decide better." + fade-out a negro absoluto en f1800 (local 206–240, f1766–f1800) */}
            {f >= 206 && (
                <DecideBetterFinale f={f - 206} />
            )}
        </AbsoluteFill>
    );
};
