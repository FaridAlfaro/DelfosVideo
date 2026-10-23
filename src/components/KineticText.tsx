// src/components/KineticText.tsx — usar dentro de un <Sequence> (frame local 0 = inicio de la frase)
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, GradientText, SERIF, exitFx, lerp, ramp } from "./Theme";

interface Props {
    text: string;
    italicWord?: string;
    secondText?: string;
    /** frames entre palabra y palabra de `text` */
    wordStagger?: number;
    /** frames entre la última palabra y la itálica */
    italicDelay?: number;
    fontSize?: number;
    /** true = degradado animado por defecto; o lista de colores */
    gradientItalic?: boolean | string[];
    /** elemento inline (icono/tile) entre `text` y la palabra itálica */
    icon?: React.ReactNode;
    exitFrames?: number;
    /** alejamiento lento de cámara durante toda la frase */
    pullback?: boolean;
}

export const KineticText: React.FC<Props> = ({
    text,
    italicWord,
    secondText,
    wordStagger = 7,
    italicDelay = 8,
    fontSize = 96,
    gradientItalic,
    icon,
    exitFrames = 4,
    pullback = true,
}) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    const words = text.split(" ").filter(Boolean);
    const secondWords = secondText ? secondText.split(" ").filter(Boolean) : [];
    const iStart = (words.length - 1) * wordStagger + italicDelay;
    const secondStart = iStart + (italicWord ? 6 : 0);

    const enter = (start: number, big = false) => {
        const rel = frame - start;
        const p = ramp(rel, 0, 3);
        return {
            opacity: p,
            blur: lerp(14, 0, p),
            scale: lerp(0.88, 1, p),
            glowR: interpolate(rel, [0, 3, 7], [0, big ? 45 : 32, big ? 18 : 10], C),
            glowA: interpolate(rel, [0, 3, 7], [0, big ? 0.9 : 0.7, big ? 0.4 : 0.25], C),
        };
    };

    const e = exitFx(frame, durationInFrames, exitFrames);
    const pull = pullback ? lerp(1.07, 0.96, frame / durationInFrames) : 1;
    const ie = enter(iStart, true);
    const gradColors = Array.isArray(gradientItalic) ? gradientItalic : undefined;

    const italicStyle: React.CSSProperties = {
        fontFamily: SERIF,
        fontStyle: "italic",
        fontSize: fontSize + 8,
        whiteSpace: "nowrap",
    };

    return (
        <AbsoluteFill
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: fontSize * 0.26,
                opacity: e.opacity,
                filter: `blur(${e.blur}px)`,
                transform: `scale(${e.scale * pull})`,
            }}
        >
            {words.map((w, i) => {
                const en = enter(i * wordStagger);
                return (
                    <span
                        key={i}
                        style={{
                            fontFamily: FONT,
                            fontSize,
                            fontWeight: 600,
                            color: "#fff",
                            letterSpacing: "-0.03em",
                            whiteSpace: "nowrap",
                            opacity: en.opacity,
                            filter: `blur(${en.blur}px)`,
                            transform: `scale(${en.scale})`,
                            textShadow: `0 0 ${en.glowR}px rgba(255,255,255,${en.glowA})`,
                        }}
                    >
                        {w}
                    </span>
                );
            })}

            {icon && (
                <span style={{ display: "flex", opacity: ie.opacity, filter: `blur(${ie.blur}px)`, transform: `scale(${ie.scale})` }}>
                    {icon}
                </span>
            )}

            {italicWord && (
                <span
                    style={{
                        opacity: ie.opacity,
                        filter: `blur(${ie.blur}px)`,
                        transform: `scale(${ie.scale})`,
                        display: "inline-block",
                    }}
                >
                    {gradientItalic ? (
                        <GradientText colors={gradColors} style={italicStyle}>
                            {italicWord}
                        </GradientText>
                    ) : (
                        <span
                            style={{
                                ...italicStyle,
                                color: "#fff",
                                textShadow: `0 0 ${ie.glowR}px rgba(255,255,255,${ie.glowA})`,
                            }}
                        >
                            {italicWord}
                        </span>
                    )}
                </span>
            )}

            {secondWords.map((w, i) => {
                const en = enter(secondStart + i * wordStagger);
                return (
                    <span
                        key={`sec-${i}`}
                        style={{
                            fontFamily: FONT,
                            fontSize,
                            fontWeight: 600,
                            color: "#fff",
                            letterSpacing: "-0.03em",
                            whiteSpace: "nowrap",
                            opacity: en.opacity,
                            filter: `blur(${en.blur}px)`,
                            transform: `scale(${en.scale})`,
                            textShadow: `0 0 ${en.glowR}px rgba(255,255,255,${en.glowA})`,
                        }}
                    >
                        {w}
                    </span>
                );
            })}
        </AbsoluteFill>
    );
};
