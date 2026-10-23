// src/components/KineticText.tsx — Clean editorial kinetic typography (Zero Neon, No text-shadow glow)
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, GradientText, OUT, SERIF, exitFx, lerp, ramp } from "./Theme";

interface Props {
    text: string;
    italicWord?: string;
    secondText?: string;
    wordStagger?: number;
    italicDelay?: number;
    fontSize?: number;
    gradientItalic?: boolean | string[];
    icon?: React.ReactNode;
    exitFrames?: number;
    pullback?: boolean;
}

export const KineticText: React.FC<Props> = ({
    text,
    italicWord,
    secondText,
    wordStagger = 5,
    italicDelay = 6,
    fontSize = 96,
    gradientItalic,
    icon,
    exitFrames = 4,
    pullback = false,
}) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    const words = text.split(" ").filter(Boolean);
    const secondWords = secondText ? secondText.split(" ").filter(Boolean) : [];
    const iStart = (words.length - 1) * wordStagger + italicDelay;
    const secondStart = iStart + (italicWord ? 5 : 0);

    const enter = (start: number) => {
        const rel = frame - start;
        const p = ramp(rel, 0, 8, OUT);
        return {
            opacity: p,
            blur: lerp(8, 0, p),
            scale: lerp(0.95, 1, p),
            y: lerp(14, 0, p),
        };
    };

    const e = exitFx(frame, durationInFrames, exitFrames);
    const pull = pullback ? lerp(1.02, 0.99, frame / durationInFrames) : 1;
    const ie = enter(iStart);
    const gradColors = Array.isArray(gradientItalic) ? gradientItalic : ["#F8FAFC", "#CBD5E1", "#93C5FD"];

    const italicStyle: React.CSSProperties = {
        fontFamily: SERIF,
        fontStyle: "italic",
        fontSize: fontSize + 6,
        whiteSpace: "nowrap",
    };

    return (
        <AbsoluteFill
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: fontSize * 0.24,
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
                            color: "#F8FAFC",
                            letterSpacing: "-0.03em",
                            whiteSpace: "nowrap",
                            opacity: en.opacity,
                            filter: `blur(${en.blur}px)`,
                            transform: `translateY(${en.y}px) scale(${en.scale})`,
                        }}
                    >
                        {w}
                    </span>
                );
            })}

            {icon && (
                <span style={{ display: "flex", opacity: ie.opacity, filter: `blur(${ie.blur}px)`, transform: `translateY(${ie.y}px) scale(${ie.scale})` }}>
                    {icon}
                </span>
            )}

            {italicWord && (
                <span
                    style={{
                        opacity: ie.opacity,
                        filter: `blur(${ie.blur}px)`,
                        transform: `translateY(${ie.y}px) scale(${ie.scale})`,
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
                                color: "#F8FAFC",
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
                            color: "#F8FAFC",
                            letterSpacing: "-0.03em",
                            whiteSpace: "nowrap",
                            opacity: en.opacity,
                            filter: `blur(${en.blur}px)`,
                            transform: `translateY(${en.y}px) scale(${en.scale})`,
                        }}
                    >
                        {w}
                    </span>
                );
            })}
        </AbsoluteFill>
    );
};
