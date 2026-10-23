// src/components/Captions.tsx — Subtítulos cinéticos dinámicos
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { VOICEOVER_SCRIPT, VoiceLine } from "../VoiceOver";
import { FONT, GradientText, SERIF, lerp, ramp } from "./Theme";

interface CaptionsProps {
    enabled?: boolean;
}

export const SHOW_CAPTIONS = true;

export const Captions: React.FC<CaptionsProps> = ({ enabled = SHOW_CAPTIONS }) => {
    const frame = useCurrentFrame();

    if (!enabled) return null;

    // Encuentra la línea actual
    const currentLine: VoiceLine | undefined = VOICEOVER_SCRIPT.find(
        (v) => frame >= v.startFrame && frame < v.startFrame + v.maxFrames
    );

    if (!currentLine) return null;

    // Regla: ocultar si en pantalla ya hay texto equivalente que ocupe el centro
    // (Por ejemplo en KineticOpening beats 75-183, BrandToPrompt logo 576-630, lockup 1734-1800)
    // Pero para soporte de accesibilidad/preview se puede mostrar en la parte inferior de manera limpia y discreta.
    const rel = frame - currentLine.startFrame;
    const dur = currentLine.maxFrames;

    // Entrada: blur 10 -> 0 en 3 frames, scale 0.9 -> 1.0
    const enterP = ramp(rel, 0, 3);
    // Salida zoom-blur: últimos 4 frames
    const exitP = ramp(rel, dur - 4, dur);

    const opacity = enterP * (1 - exitP);
    const blur = (1 - enterP) * 10 + exitP * 18;
    const scale = lerp(0.92, 1, enterP) * (1 + exitP * 0.25);

    // Separamos en palabras y destacamos palabras en MAYÚSCULAS o clave
    const words = currentLine.text.split(" ");

    return (
        <AbsoluteFill
            style={{
                pointerEvents: "none",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: 48,
                zIndex: 85,
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    padding: "10px 24px",
                    borderRadius: 18,
                    background: "rgba(10, 12, 20, 0.72)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    opacity,
                    filter: `blur(${blur}px)`,
                    transform: `scale(${scale})`,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                }}
            >
                {words.map((w, i) => {
                    // Si la palabra está en mayúsculas o con caracteres especiales destacados
                    const isUpper = w.length > 1 && w === w.toUpperCase() && !w.includes("[");
                    const isItalicHighlight = isUpper || w.toLowerCase().includes("delfos") || w.includes("84");

                    if (isItalicHighlight) {
                        return (
                            <GradientText
                                key={i}
                                colors={["#fb7185", "#f472b6", "#a78bfa"]}
                                style={{
                                    fontFamily: SERIF,
                                    fontStyle: "italic",
                                    fontSize: 32,
                                    fontWeight: 700,
                                }}
                            >
                                {w}
                            </GradientText>
                        );
                    }

                    return (
                        <span
                            key={i}
                            style={{
                                fontFamily: FONT,
                                fontSize: 26,
                                fontWeight: 700,
                                color: "#f8fafc",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            {w}
                        </span>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};
