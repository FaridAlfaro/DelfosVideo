// src/components/KineticOpening.tsx (240 frames = 0–8 s, f0–f240)
// Escena 1.1 (f0–f75): Esfera de gradiente orgánico difuso (blur(70px)) estilo END.mp4 +
//                      "Millions of people are talking about your brand." con spring({ damping: 200, stiffness: 110 })
// Escenas 1.2, 1.3 y 1.4 (f75–111, f111–147, f147–183 — 36f cada una):
//   - El texto principal ("People think.", "People write.", "People share their opinions.") permanece visible los 36 frames completos.
//   - Frames 0..10: aparece centrado; en f10 se desplaza suavemente hacia arriba mediante spring mientras el marco 35mm con b-roll y caption emerge debajo, conviviendo durante 26 frames.
// Escena 1.5 (f183–f240, 57f): "You're not in the room." con entrada inmediata en los primeros 8f y retención estática durante 45f antes de la salida.
import React from "react";
import { AbsoluteFill, Img, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RetroFrame } from "./RetroFrame";
import { FONT, OUT, SERIF, lerp, ramp } from "./Theme";

// ── Escena 1.1 (f0–f75) ──
const OpeningHookScene: React.FC = () => {
    const f = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    const enterSpring = spring({
        frame: f,
        fps,
        config: { damping: 200, stiffness: 110 },
    });
    const exitP = ramp(f, durationInFrames - 6, durationInFrames, OUT);
    const opacity = enterSpring * (1 - exitP);
    const translateY = lerp(28, 0, enterSpring) - exitP * 14;
    const scale = lerp(0.96, 1, enterSpring);

    // Organic diffused sphere sliding gently across the background (Style END.mp4)
    const orbX = lerp(-260, 220, f / durationInFrames);
    const orbY = lerp(60, -50, f / durationInFrames);

    return (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    width: 980,
                    height: 680,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(ellipse at 50% 50%, rgba(30, 58, 138, 0.72) 0%, rgba(67, 56, 202, 0.48) 42%, rgba(109, 40, 217, 0.25) 68%, transparent 100%)",
                    filter: "blur(70px)",
                    transform: `translate(${orbX}px, ${orbY}px)`,
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    opacity,
                    transform: `translateY(${translateY}px) scale(${scale})`,
                    filter: `blur(${(1 - enterSpring) * 8 + exitP * 8}px)`,
                    textAlign: "center",
                    padding: "0 80px",
                }}
            >
                <div
                    style={{
                        fontFamily: FONT,
                        fontSize: 80,
                        fontWeight: 600,
                        color: "#F8FAFC",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.15,
                    }}
                >
                    <span>Millions of </span>
                    <span
                        style={{
                            fontFamily: SERIF,
                            fontStyle: "italic",
                            fontWeight: 600,
                            fontSize: 86,
                            color: "#E2E8F0",
                        }}
                    >
                        people
                    </span>
                    <span> are talking</span>
                    <br />
                    <span>about your brand.</span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ── Escenas 1.2, 1.3 y 1.4 (Beats Think / Write / Share — 36 frames cada uno) ──
const BeatCoexistenceScene: React.FC<{
    leadText: string;
    italicWord: string;
    caption: string;
    brollSrc: string;
    fontSize?: number;
}> = ({ leadText, italicWord, caption, brollSrc, fontSize = 92 }) => {
    const f = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // 1. Entrada del texto principal en los primeros frames (centrado en f0..10)
    const textEnter = spring({
        frame: f,
        fps,
        config: { damping: 28, stiffness: 180 },
    });

    // 2. En el frame local 10, el texto se desplaza suavemente hacia arriba mientras el marco 35mm emerge debajo
    const splitSpring = spring({
        frame: Math.max(0, f - 10),
        fps,
        config: { damping: 24, stiffness: 135 },
    });

    // Salida limpia en los últimos 4 frames (f32..36)
    const exitP = ramp(f, durationInFrames - 4, durationInFrames, OUT);
    const masterOpacity = 1 - exitP;

    // Coordenadas del texto: centrado (0px) en f0..10 -> sube a -235px desde f10..36
    const textY = lerp(0, -235, splitSpring);
    const textScale = lerp(1, 0.88, splitSpring);

    // Marco 35mm con b-roll y caption: emerge desde f10 y convive 26 frames con el texto principal
    const frameOpacity = splitSpring;
    const frameY = lerp(150, 72, splitSpring);
    const frameScale = lerp(0.92, 1, splitSpring);
    const imgZoom = 1.04 + f * 0.0025;

    return (
        <AbsoluteFill
            style={{
                alignItems: "center",
                justifyContent: "center",
                opacity: masterOpacity,
                filter: `blur(${exitP * 8}px)`,
            }}
        >
            {/* Orbe difuso de fondo estilo END.mp4 */}
            <div
                style={{
                    position: "absolute",
                    width: 820,
                    height: 540,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(67, 56, 202, 0.38) 0%, rgba(30, 58, 138, 0.22) 55%, transparent 100%)",
                    filter: "blur(65px)",
                    transform: `translateY(${lerp(0, 40, splitSpring)}px)`,
                    pointerEvents: "none",
                }}
            />

            {/* Texto Principal — 100% visible durante los 36 frames completos del beat */}
            <div
                style={{
                    position: "absolute",
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    gap: 20,
                    opacity: textEnter,
                    transform: `translateY(${textY}px) scale(${textScale})`,
                    filter: `blur(${(1 - textEnter) * 6}px)`,
                    zIndex: 10,
                }}
            >
                <span
                    style={{
                        fontFamily: FONT,
                        fontSize,
                        fontWeight: 600,
                        color: "#F8FAFC",
                        letterSpacing: "-0.03em",
                        whiteSpace: "nowrap",
                    }}
                >
                    {leadText}
                </span>
                <span
                    style={{
                        fontFamily: SERIF,
                        fontStyle: "italic",
                        fontSize: fontSize + 6,
                        fontWeight: 600,
                        color: "#CBD5E1",
                        whiteSpace: "nowrap",
                    }}
                >
                    {italicWord}
                </span>
            </div>

            {/* Marco 35mm con B-Roll y Caption — emerge simultáneamente en f10 y convive 26 frames */}
            <div
                style={{
                    position: "absolute",
                    width: 780,
                    height: 430,
                    borderRadius: 24,
                    overflow: "hidden",
                    backgroundColor: "rgba(12, 16, 26, 0.78)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(255, 255, 255, 0.09)",
                    opacity: frameOpacity,
                    transform: `translateY(${frameY}px) scale(${frameScale})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 5,
                }}
            >
                <Img
                    src={brollSrc}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: `scale(${imgZoom})`,
                        filter: "brightness(0.84) contrast(1.02) saturate(0.9)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, rgba(8,12,22,0.15) 0%, rgba(8,12,22,0.72) 100%)",
                    }}
                />

                {/* Caption Pill minimalista de cristal ahumado mate */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 28,
                        padding: "12px 28px",
                        borderRadius: 999,
                        backgroundColor: "rgba(12, 16, 26, 0.78)",
                        backdropFilter: "blur(24px)",
                        border: "1px solid rgba(255, 255, 255, 0.09)",
                        fontFamily: FONT,
                        fontSize: 32,
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        color: "#F8FAFC",
                    }}
                >
                    {caption}
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ── Escena 1.5 (f183–f240, 57 frames): "You're not in the room." ──
const NotInTheRoomScene: React.FC = () => {
    const f = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    // Entrada inmediata en los primeros 8 frames (f0..8)
    const enterP = ramp(f, 0, 8, OUT);
    // Retención estática durante 45 frames (f8..53) antes de la transición de salida (f53..57)
    const exitP = ramp(f, 53, durationInFrames, OUT);
    const opacity = enterP * (1 - exitP);
    const scale = lerp(0.96, 1, enterP) * lerp(1, 1.03, exitP);
    const blur = (1 - enterP) * 8 + exitP * 10;

    return (
        <AbsoluteFill>
            <RetroFrame
                srcs={[staticFile("broll_night_screen.png"), staticFile("broll_subway.png")]}
                silhouette
                cutEvery={28}
            />
            <AbsoluteFill
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    opacity,
                    transform: `scale(${scale})`,
                    filter: `blur(${blur}px)`,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 22,
                        padding: "20px 42px",
                        borderRadius: 999,
                        backgroundColor: "rgba(12, 16, 26, 0.55)",
                        backdropFilter: "blur(24px)",
                        border: "1px solid rgba(255, 255, 255, 0.09)",
                    }}
                >
                    <span
                        style={{
                            fontFamily: FONT,
                            fontSize: 88,
                            fontWeight: 600,
                            color: "#F8FAFC",
                            letterSpacing: "-0.03em",
                        }}
                    >
                        You're
                    </span>
                    <span
                        style={{
                            fontFamily: SERIF,
                            fontStyle: "italic",
                            fontSize: 96,
                            fontWeight: 600,
                            color: "#93C5FD",
                        }}
                    >
                        not
                    </span>
                    <span
                        style={{
                            fontFamily: FONT,
                            fontSize: 88,
                            fontWeight: 600,
                            color: "#F8FAFC",
                            letterSpacing: "-0.03em",
                        }}
                    >
                        in the room.
                    </span>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

export const KineticOpening: React.FC = () => {
    return (
        <AbsoluteFill>
            {/* Escena 1.1 · 0–75: Hook "Millions of people are talking about your brand." */}
            <Sequence durationInFrames={75}>
                <OpeningHookScene />
            </Sequence>

            {/* Escena 1.2 · 75–111 (36f): "People think." + "On every commute" */}
            <Sequence from={75} durationInFrames={36}>
                <BeatCoexistenceScene
                    leadText="People"
                    italicWord="think."
                    caption="On every commute"
                    brollSrc={staticFile("broll_subway.png")}
                />
            </Sequence>

            {/* Escena 1.3 · 111–147 (36f): "People write." + "In every café" */}
            <Sequence from={111} durationInFrames={36}>
                <BeatCoexistenceScene
                    leadText="People"
                    italicWord="write."
                    caption="In every café"
                    brollSrc={staticFile("broll_cafe.png")}
                />
            </Sequence>

            {/* Escena 1.4 · 147–183 (36f): "People share their opinions." + "At every hour" */}
            <Sequence from={147} durationInFrames={36}>
                <BeatCoexistenceScene
                    leadText="People share their"
                    italicWord="opinions."
                    caption="At every hour"
                    brollSrc={staticFile("broll_night_screen.png")}
                    fontSize={82}
                />
            </Sequence>

            {/* Escena 1.5 · 183–240 (57f): "You're not in the room." */}
            <Sequence from={183} durationInFrames={57}>
                <NotInTheRoomScene />
            </Sequence>
        </AbsoluteFill>
    );
};
