// src/components/BrandToPrompt.tsx (300 frames = 17–27 s, f510–f810 global)
// "Until today" en local 0 (f510)
// Drop musical y aparición del logo en local 60 (f570): onda de choque expansiva + flash de 3 frames
// Logo se convierte en la barra de prompt (cámara macro) en local 105–135
// Tecleo en local 135–212 (con ticks de teclado sincronizados)
// Cursor y clic en local 240 (f750 global)
// ThinkingBlob y estrella que invade la pantalla en local 246–300
import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import { KineticText } from "./KineticText";
import { PromptBar, sendOffsetX } from "./Promptbar";
import { ThinkingBlob } from "./Thinkingblob";
import { C, FONT, IN, IO, OUT, SNAP, lerp, ramp } from "./Theme";
import { Cursor, Isotipo } from "./Ui";

const PROMPT = "What do people think about the new brand launch?";
const T_LOGO = 60; // f570 global (drop musical)
const T_MORPH = 105;
const T_TYPE0 = 135; // f645 global
const T_TYPE1 = 212; // f722 global
const T_CLICK = 240; // f750 global
const BAR_H = 140;
const BAR_W = 1300;
const CX = 960;
const CY = 540;

export const BrandToPrompt: React.FC = () => {
    const f = useCurrentFrame();

    // ── Drop musical en local 60 (f570 global): Flash de 3 frames + Onda de choque ──
    const flashRel = f - T_LOGO;
    const dropFlash = flashRel >= 0 && flashRel <= 3 ? interpolate(flashRel, [0, 3], [0.95, 0], C) : 0;
    const shockwaveP = ramp(flashRel, 0, 22, OUT);
    const shockwaveScale = lerp(0.2, 4.5, shockwaveP);
    const shockwaveOpacity = (1 - shockwaveP) * 0.9;

    // ── Logo lockup (60–118) ──
    const logoIn = ramp(f, T_LOGO, T_LOGO + 12, OUT);
    const logoOut = ramp(f, T_MORPH + 2, T_MORPH + 18);
    const logoOpacity = logoIn * (1 - logoOut);
    const logoScale = lerp(0.8, 1, logoIn) * (1 - 0.12 * logoOut) * (1 + Math.sin(f * 0.15) * 0.01);

    // ── Barra de prompt ──
    const morph = ramp(f, T_MORPH, T_MORPH + 30, SNAP);
    const barW = lerp(420, BAR_W, morph);
    const barOpacity = ramp(f, T_MORPH, T_MORPH + 8) * (1 - ramp(f, T_CLICK + 6, T_CLICK + 22));
    const typeP = ramp(f, T_TYPE0, T_TYPE1, Easing.out(Easing.quad));
    const nChars = Math.floor(PROMPT.length * typeP);
    const typed = PROMPT.slice(0, nChars);
    const textW = nChars * 29;
    const regionW = 640;
    const textShift = Math.max(0, textW - regionW);

    // ── Click ──
    const press = f >= T_CLICK ? interpolate(f, [T_CLICK, T_CLICK + 3, T_CLICK + 9], [1, 1, 0], C) : 0;
    const sendScale = f >= T_CLICK ? interpolate(f, [T_CLICK, T_CLICK + 3, T_CLICK + 9], [0.82, 0.82, 1], { ...C, easing: OUT }) : 1;
    const sendBg = f >= T_CLICK ? `rgb(${Math.round(lerp(99, 255, ramp(f, T_CLICK, T_CLICK + 8)))},${Math.round(lerp(102, 255, ramp(f, T_CLICK, T_CLICK + 8)))},${Math.round(lerp(241, 255, ramp(f, T_CLICK, T_CLICK + 8)))})` : "#fff";
    const ringP = ramp(f, T_CLICK, T_CLICK + 12);

    // ── Cámara (mundo 1920×1080, origen arriba-izq) ──
    const s1 = ramp(f, T_MORPH, T_MORPH + 30, IO);
    const s2 = ramp(f, T_TYPE1, T_TYPE1 + 24, IO);
    const sendX = CX + sendOffsetX(BAR_W, BAR_H);
    const scale = lerp(1, 1.7, s1) + lerp(0, 0.12, ramp(f, T_TYPE0, T_TYPE1)) + lerp(0, 0.7, s2);
    const fx = lerp(CX, 820, s1) + lerp(0, sendX - 120 - 820, s2) + Math.sin(f * 0.08) * 6;
    const fy = CY + Math.cos(f * 0.07) * 4;
    const camTransform = `translate(${CX - fx * scale}px, ${CY - fy * scale}px) scale(${scale})`;

    // ── Cursor (espacio de pantalla) ──
    const targetX = CX + (sendX - fx) * scale;
    const targetY = CY + (CY - fy) * scale;
    const cp = ramp(f, 206, T_CLICK - 4, IO);
    const curX = lerp(1560, targetX + 6, cp);
    const curY = lerp(930, targetY + 12, cp);
    const curOpacity = ramp(f, 206, 214) * (1 - ramp(f, T_CLICK + 8, T_CLICK + 16));

    // ── Blob ──
    const bt = f - (T_CLICK + 6);
    const blobIn = ramp(bt, 0, 16, Easing.out(Easing.back(1.8)));
    const blobGrow = 1 + 1.4 * ramp(bt, 22, 38, IO);
    const blobSize = 380 * blobIn * blobGrow;
    const starScale = 1 + 60 * ramp(f, 284, 300, IN);

    return (
        <AbsoluteFill style={{ overflow: "hidden" }}>
            {/* A. Until today (f510–f570 global) */}
            <Sequence durationInFrames={60}>
                <KineticText
                    text="Until"
                    italicWord="today."
                    wordStagger={0}
                    italicDelay={6}
                    fontSize={120}
                    gradientItalic={["#fb7185", "#f472b6", "#a78bfa"]}
                    exitFrames={4}
                />
            </Sequence>

            {/* Flash y Onda de choque en local 60 (drop f570) */}
            {dropFlash > 0 && (
                <AbsoluteFill
                    style={{
                        backgroundColor: "#ffffff",
                        opacity: dropFlash,
                        zIndex: 95,
                        pointerEvents: "none",
                    }}
                />
            )}
            {shockwaveP > 0 && shockwaveP < 1 && (
                <AbsoluteFill
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                        zIndex: 40,
                    }}
                >
                    <div
                        style={{
                            width: 400,
                            height: 400,
                            borderRadius: "50%",
                            border: "4px solid rgba(129, 140, 248, 0.8)",
                            boxShadow: "0 0 60px rgba(236, 72, 153, 0.9)",
                            opacity: shockwaveOpacity,
                            transform: `scale(${shockwaveScale})`,
                        }}
                    />
                </AbsoluteFill>
            )}

            {/* Mundo con cámara */}
            <AbsoluteFill style={{ transformOrigin: "0 0", transform: camTransform }}>
                {/* B. Lockup Delfos Intelligence en local 60 */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 1920,
                        height: 1080,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 26,
                        opacity: logoOpacity,
                        filter: `blur(${(1 - logoIn) * 14 + logoOut * 12}px)`,
                        transform: `scale(${logoScale})`,
                    }}
                >
                    <Isotipo size={96} style={{ filter: "drop-shadow(0 0 28px rgba(129,140,248,0.7))" }} />
                    <span style={{ fontFamily: FONT, fontSize: 92, fontWeight: 700, color: "#fff", letterSpacing: "-0.04em" }}>
                        Delfos <span style={{ fontWeight: 300, color: "#cbd5e1" }}>Intelligence</span>
                    </span>
                </div>

                {/* C. Barra macro */}
                <div
                    style={{
                        position: "absolute",
                        left: CX - barW / 2,
                        top: CY - BAR_H / 2,
                        opacity: barOpacity,
                        filter: `blur(${ramp(f, T_CLICK + 6, T_CLICK + 22) * 14}px)`,
                    }}
                >
                    <PromptBar
                        width={barW}
                        height={BAR_H}
                        fontSize={56}
                        frame={f}
                        typed={typed}
                        caret={f < T_CLICK}
                        textShift={textShift}
                        showButtons={morph > 0.9}
                        sendScale={sendScale}
                        sendBg={sendBg}
                        sendArrow={f >= T_CLICK && ringP < 0.5 ? "#fff" : "#000"}
                        ringP={ringP}
                    />
                </div>
            </AbsoluteFill>

            <Cursor x={curX} y={curY} press={press} opacity={curOpacity} />

            {/* D. Blob pensando + estrella que invade la pantalla */}
            {bt > 0 && (
                <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
                    <ThinkingBlob t={f} size={Math.max(blobSize, 1)} starScale={starScale} />
                </AbsoluteFill>
            )}
            <AbsoluteFill style={{ backgroundColor: "#07080d", opacity: ramp(f, 291, 300) }} />
        </AbsoluteFill>
    );
};
