// src/components/KineticOpening.tsx (240 frames = 0–8 s)
// 0–75: Hook "Millions of people are talking about your brand." con destello blanco de 2 frames en f0,
//        "people" en cursiva con degradado, pull-back lento.
// 75–111 (f75–f111): Think (36f = texto 14f + marco 35mm 22f)
// 111–147 (f111–f147): Write (36f = texto 14f + marco 35mm 22f)
// 147–183 (f147–f183): Share (36f = texto 14f + marco 35mm 22f con zoom-blur)
// 183–240 (f183–f240): Silueta a contraluz con "You're not in the room." con "not" en degradado rosa; la música cae en f183.
import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { KineticText } from "./KineticText";
import { RetroFrame } from "./RetroFrame";
import { ZoomBlurOut } from "./Theme";

export const KineticOpening: React.FC = () => {
    const frame = useCurrentFrame();

    // Destello blanco de 2 frames en frame 0
    const flashOpacity = frame < 2 ? 1 : 0;

    return (
        <AbsoluteFill>
            {/* Destello blanco en frame 0 */}
            {flashOpacity > 0 && (
                <AbsoluteFill
                    style={{
                        backgroundColor: "#ffffff",
                        zIndex: 100,
                        pointerEvents: "none",
                    }}
                />
            )}

            {/* 0–75 · Hook: Millions of people are talking about your brand. */}
            <Sequence durationInFrames={75}>
                <KineticText
                    text="Millions of"
                    italicWord="people"
                    secondText="are talking about your brand."
                    wordStagger={5}
                    italicDelay={6}
                    fontSize={82}
                    gradientItalic={["#fb7185", "#f472b6", "#a78bfa"]}
                    pullback
                    exitFrames={5}
                />
            </Sequence>

            {/* 75–111 (36f) · Beat 1: They THINK */}
            <Sequence from={75} durationInFrames={14}>
                <KineticText
                    text="People"
                    italicWord="think."
                    wordStagger={3}
                    italicDelay={4}
                    fontSize={104}
                    exitFrames={3}
                />
            </Sequence>
            <Sequence from={89} durationInFrames={22}>
                <RetroFrame
                    srcs={[staticFile("broll_subway.png"), staticFile("broll_cafe.png")]}
                    captions={["On every commute"]}
                    portrait
                    expandStart={4}
                    expandEnd={14}
                    cutEvery={11}
                />
            </Sequence>

            {/* 111–147 (36f) · Beat 2: They WRITE */}
            <Sequence from={111} durationInFrames={14}>
                <KineticText
                    text="People"
                    italicWord="write."
                    wordStagger={3}
                    italicDelay={4}
                    fontSize={104}
                    exitFrames={3}
                />
            </Sequence>
            <Sequence from={125} durationInFrames={22}>
                <RetroFrame
                    srcs={[staticFile("broll_cafe.png"), staticFile("broll_subway.png")]}
                    captions={["In every café"]}
                    portrait={false}
                    expandStart={4}
                    expandEnd={14}
                    cutEvery={11}
                />
            </Sequence>

            {/* 147–183 (36f) · Beat 3: They SHARE */}
            <Sequence from={147} durationInFrames={14}>
                <KineticText
                    text="People share their"
                    italicWord="opinions."
                    wordStagger={3}
                    italicDelay={4}
                    fontSize={88}
                    exitFrames={3}
                />
            </Sequence>
            <Sequence from={161} durationInFrames={22}>
                <RetroFrame
                    srcs={[staticFile("broll_night_screen.png"), staticFile("broll_cafe.png")]}
                    captions={["At every hour"]}
                    portrait
                    expandStart={4}
                    expandEnd={14}
                    cutEvery={11}
                />
            </Sequence>

            {/* 183–240 (57f) · Pico de tensión: You're not in the room. Silueta a contraluz */}
            <Sequence from={183} durationInFrames={57}>
                <ZoomBlurOut frames={4}>
                    <RetroFrame
                        srcs={[staticFile("broll_night_screen.png"), staticFile("broll_subway.png")]}
                        silhouette
                        cutEvery={18}
                    />
                    <KineticText
                        text="You're"
                        italicWord="not"
                        secondText="in the room."
                        wordStagger={5}
                        italicDelay={6}
                        fontSize={92}
                        gradientItalic={["#ec4899", "#fb7185", "#f43f5e"]}
                        exitFrames={5}
                    />
                </ZoomBlurOut>
            </Sequence>
        </AbsoluteFill>
    );
};
