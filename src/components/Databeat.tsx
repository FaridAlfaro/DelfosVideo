// src/components/DataBeat.tsx (270 frames = 8–17 s, f240–f510 global)
// Acto 2 en 5 beats:
// 1) 0–75 (f240–315): flujos de datos inclinados + "Millions of data points. Every single second."
// 2) 75–123 (f315–363): marco 35mm + "What they [🛒] buy"
// 3) 123–171 (f363–411): silueta a contraluz + "Who they love"
// 4) 171–219 (f411–459): silueta con nuevo recorte + "Who they follow"
// 5) 219–270 (f459–510): los flujos se desenfocan hasta volverse estática y aparece "Lost in the noise."
// Todos los textos con salida zoom-blur (scale > 1.2, blur > 16)
import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { DataStreams } from "./Datastreams";
import { KineticText } from "./KineticText";
import { RetroFrame } from "./RetroFrame";
import { ZoomBlurOut } from "./Theme";
import { Icon, Tile } from "./Ui";

export const DataBeat: React.FC = () => {
    const frame = useCurrentFrame();

    // Beat 5 estática y desenfoque progresivo de flujos (frames 219–270 locales)
    const isStaticNoise = frame >= 219;
    const staticProgress = isStaticNoise
        ? interpolate(frame, [219, 270], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        : 0;

    return (
        <AbsoluteFill>
            {/* 1 · 0–75 (f240–315): Millions of data points. Every single second. */}
            <Sequence durationInFrames={75}>
                <ZoomBlurOut frames={4}>
                    <DataStreams dim={0.45} />
                </ZoomBlurOut>
                <KineticText
                    text="Millions of"
                    italicWord="data points."
                    secondText="Every single second."
                    wordStagger={5}
                    italicDelay={6}
                    fontSize={76}
                    gradientItalic={["#818cf8", "#f472b6", "#818cf8"]}
                    exitFrames={5}
                />
            </Sequence>

            {/* 2 · 75–123 (f315–363): What they buy (marco 35 mm con tile de carrito) */}
            <Sequence from={75} durationInFrames={48}>
                <RetroFrame
                    srcs={[staticFile("broll_data_screens.png"), staticFile("broll_night_screen.png")]}
                    captions={[
                        <>
                            <span>What they</span>
                            <Tile size={64} radius={18} style={{ display: "inline-flex", margin: "0 10px" }}>
                                <Icon name="cart" size={34} color="#f472b6" />
                            </Tile>
                            <span>buy</span>
                        </>,
                    ]}
                    expandStart={8}
                    expandEnd={22}
                    cutEvery={12}
                />
            </Sequence>

            {/* 3 · 123–171 (f363–411): Who they love (silueta a contraluz) */}
            <Sequence from={123} durationInFrames={48}>
                <RetroFrame
                    srcs={[staticFile("broll_night_screen.png"), staticFile("broll_cafe.png")]}
                    captions={[
                        <>
                            <span>Who they</span>
                            <Tile size={64} radius={18} style={{ display: "inline-flex", margin: "0 10px" }}>
                                <Icon name="heart" size={32} color="#fb7185" />
                            </Tile>
                            <span>love</span>
                        </>,
                    ]}
                    silhouette
                    cutEvery={12}
                />
            </Sequence>

            {/* 4 · 171–219 (f411–459): Who they follow (nuevo recorte) */}
            <Sequence from={171} durationInFrames={48}>
                <RetroFrame
                    srcs={[staticFile("broll_subway.png"), staticFile("broll_cafe.png")]}
                    captions={[
                        <>
                            <span>Who they</span>
                            <Tile size={64} radius={18} style={{ display: "inline-flex", margin: "0 10px" }}>
                                <Icon name="user" size={32} color="#60a5fa" />
                            </Tile>
                            <span>follow</span>
                        </>,
                    ]}
                    silhouette
                    cutEvery={12}
                />
            </Sequence>

            {/* 5 · 219–270 (f459–510): Flujos se desenfocan a estática + "Lost in the noise." */}
            <Sequence from={219} durationInFrames={51}>
                {/* Flujos desenfocados a fondo */}
                <AbsoluteFill
                    style={{
                        filter: `blur(${staticProgress * 32}px) contrast(${1 + staticProgress * 2})`,
                        opacity: 1 - staticProgress * 0.7,
                    }}
                >
                    <DataStreams dim={0.6} />
                </AbsoluteFill>

                {/* Capa de estática de TV / ruido digital */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: staticProgress * 0.85,
                        mixBlendMode: "screen",
                        pointerEvents: "none",
                    }}
                >
                    <svg style={{ width: "100%", height: "100%" }}>
                        <filter id="staticNoise">
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency={0.85}
                                numOctaves={4}
                                seed={frame * 3}
                            />
                            <feColorMatrix type="saturate" values="0" />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#staticNoise)" />
                    </svg>
                </div>

                <KineticText
                    text="All of it..."
                    italicWord="lost in the noise."
                    wordStagger={5}
                    italicDelay={6}
                    fontSize={92}
                    gradientItalic={["#94a3b8", "#cbd5e1", "#64748b"]}
                    exitFrames={6}
                />
            </Sequence>
        </AbsoluteFill>
    );
};
