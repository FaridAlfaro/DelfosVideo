// src/components/Databeat.tsx (270 frames = 8–17 s, f240–f510 global)
// Acto 2:
// 1) 0–75 (f240–315): flujos de datos inclinados + "Millions of data points. Every single second."
// 2) 75–123 (f315–363): "What they [ 🛒 ] buy" con píldora expansiva estilo END.mp4
// 3) 123–171 (f363–411): "Who they [ ❤️ ] love" con píldora expansiva estilo END.mp4
// 4) 171–219 (f411–459): "Who they [ 👤 ] follow" con píldora expansiva estilo END.mp4
// 5) 219–270 (f459–510): los flujos se desenfocan hasta volverse estática y aparece "All of it... lost in the noise."
import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DataStreams } from "./Datastreams";
import { KineticText } from "./KineticText";
import { FONT, OUT, ZoomBlurOut, lerp, ramp } from "./Theme";
import { Icon, IconName } from "./Ui";

/**
 * Mecánica de Píldora Expansiva (Estilo END.mp4):
 * El contenedor pill minimalista (borderRadius: 999px, fondo rgba(255,255,255,0.08),
 * borde 1px solid rgba(255,255,255,0.14), sin neón) se expande horizontalmente con
 * spring({ damping: 20, stiffness: 180 }) empujando suavemente las palabras adyacentes.
 */
const ExpandingPillBeat: React.FC<{
    leftText: string;
    rightText: string;
    iconName: IconName;
    brollSrc: string;
    orbShift?: number;
}> = ({ leftText, rightText, iconName, brollSrc, orbShift = 0 }) => {
    const f = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    const enterP = ramp(f, 0, 7, OUT);
    const exitP = ramp(f, durationInFrames - 5, durationInFrames, OUT);

    // Píldora que se expande horizontalmente empujando las palabras adyacentes
    const expandSpring = spring({
        frame: Math.max(0, f - 5),
        fps,
        config: { damping: 20, stiffness: 180 },
    });

    const pillWidth = lerp(0, 148, expandSpring);
    const pillMargin = lerp(0, 22, expandSpring);
    const pillOpacity = ramp(f, 5, 11, OUT);

    // Orbe orgánico difuso estilo END.mp4
    const orbX = orbShift + lerp(-70, 70, f / durationInFrames);
    const orbY = lerp(35, -35, f / durationInFrames);

    return (
        <AbsoluteFill
            style={{
                alignItems: "center",
                justifyContent: "center",
                opacity: enterP * (1 - exitP),
                filter: `blur(${(1 - enterP) * 6 + exitP * 8}px)`,
                overflow: "hidden",
            }}
        >
            {/* Sutil textura B-roll oscurecida al fondo */}
            <Img
                src={brollSrc}
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.22,
                    filter: "grayscale(1) contrast(1.3) brightness(0.6)",
                    transform: `scale(${1.04 + f * 0.002})`,
                }}
            />

            {/* Esfera de gradiente orgánico difuso (Estilo END.mp4: #1E3A8A, #4338CA, #6D28D9) */}
            <div
                style={{
                    position: "absolute",
                    width: 760,
                    height: 620,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle at 50% 50%, rgba(67, 56, 202, 0.68) 0%, rgba(30, 58, 138, 0.48) 45%, rgba(109, 40, 217, 0.25) 70%, transparent 100%)",
                    filter: "blur(65px)",
                    transform: `translate(${orbX}px, ${orbY}px)`,
                    pointerEvents: "none",
                }}
            />

            {/* Cápsula exterior traslúcida estilo END.mp4 */}
            <div
                style={{
                    position: "relative",
                    zIndex: 5,
                    padding: "44px 84px",
                    borderRadius: 999,
                    backgroundColor: "rgba(12, 16, 26, 0.78)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(255, 255, 255, 0.09)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <span
                    style={{
                        fontFamily: FONT,
                        fontSize: 72,
                        fontWeight: 600,
                        letterSpacing: "-0.03em",
                        color: "#F8FAFC",
                        whiteSpace: "nowrap",
                    }}
                >
                    {leftText}
                </span>

                {/* Contenedor tipo pill minimalista que se expande horizontalmente */}
                <div
                    style={{
                        width: pillWidth,
                        height: 76,
                        margin: `0 ${pillMargin}px`,
                        borderRadius: 999,
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        opacity: pillOpacity,
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            transform: `scale(${lerp(0.6, 1, expandSpring)})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                        }}
                    >
                        <Icon name={iconName} size={34} color="#F8FAFC" sw={2.2} />
                    </div>
                </div>

                <span
                    style={{
                        fontFamily: FONT,
                        fontSize: 72,
                        fontWeight: 600,
                        letterSpacing: "-0.03em",
                        color: "#F8FAFC",
                        whiteSpace: "nowrap",
                    }}
                >
                    {rightText}
                </span>
            </div>
        </AbsoluteFill>
    );
};

export const DataBeat: React.FC = () => {
    const frame = useCurrentFrame();

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
                    gradientItalic={["#F8FAFC", "#CBD5E1", "#93C5FD"]}
                    exitFrames={5}
                />
            </Sequence>

            {/* 2 · 75–123 (f315–363): What they [ 🛒 ] buy */}
            <Sequence from={75} durationInFrames={48}>
                <ExpandingPillBeat
                    leftText="What they"
                    rightText="buy"
                    iconName="cart"
                    brollSrc={staticFile("broll_data_screens.png")}
                    orbShift={-80}
                />
            </Sequence>

            {/* 3 · 123–171 (f363–411): Who they [ ❤️ ] love */}
            <Sequence from={123} durationInFrames={48}>
                <ExpandingPillBeat
                    leftText="Who they"
                    rightText="love"
                    iconName="heart"
                    brollSrc={staticFile("broll_night_screen.png")}
                    orbShift={40}
                />
            </Sequence>

            {/* 4 · 171–219 (f411–459): Who they [ 👤 ] follow */}
            <Sequence from={171} durationInFrames={48}>
                <ExpandingPillBeat
                    leftText="Who they"
                    rightText="follow"
                    iconName="user"
                    brollSrc={staticFile("broll_subway.png")}
                    orbShift={-30}
                />
            </Sequence>

            {/* 5 · 219–270 (f459–510): Flujos se desenfocan a estática + "All of it... lost in the noise." */}
            <Sequence from={219} durationInFrames={51}>
                <AbsoluteFill
                    style={{
                        filter: `blur(${staticProgress * 28}px)`,
                        opacity: 1 - staticProgress * 0.72,
                    }}
                >
                    <DataStreams dim={0.55} />
                </AbsoluteFill>

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: staticProgress * 0.55,
                        mixBlendMode: "overlay",
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
                    gradientItalic={["#F8FAFC", "#CBD5E1", "#94A3B8"]}
                    exitFrames={6}
                />
            </Sequence>
        </AbsoluteFill>
    );
};
