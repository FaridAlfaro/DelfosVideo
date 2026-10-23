// src/components/Promptbar.tsx — Minimalist Prompt Bar with strict Flexbox layout (Zero Neon, Zero Overlap)
import React from "react";
import { FONT, lerp } from "./Theme";
import { BinIsotipo } from "./BinBrand";
import { Icon } from "./Ui";

interface Props {
    width: number;
    height: number;
    fontSize: number;
    frame: number;
    typed: string;
    placeholder?: string;
    caret?: boolean;
    textShift?: number;
    showButtons?: boolean;
    sendScale?: number;
    sendBg?: string;
    sendArrow?: string;
    ringP?: number;
    /** 0..1 progress (in 6 frames after click) where arrow morphs into isotipo.svg */
    arrowMorphP?: number;
    /** Rotation in degrees for the morphed isotipo inside the send button */
    isotipoRotation?: number;
    /** Opacity of the bar chrome (background, border, text, left isotipo, action pills) */
    chromeOpacity?: number;
}

/** Exact X offset of the send button center relative to the center of the PromptBar */
export const sendOffsetX = (width: number, height: number) => {
    const sendD = Math.round(Math.min(54, height * 0.54));
    return width / 2 - 24 - sendD / 2;
};

const pillBtnStyle = (h: number): React.CSSProperties => {
    const btnH = Math.round(Math.min(44, h * 0.44));
    return {
        height: btnH,
        borderRadius: 999,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 16px",
        color: "#E2E8F0",
        fontFamily: FONT,
        fontSize: 15,
        fontWeight: 500,
        flexShrink: 0,
    };
};

export const PromptBar: React.FC<Props> = ({
    width,
    height: h,
    fontSize,
    frame,
    typed,
    placeholder,
    caret = true,
    showButtons = false,
    sendScale = 1,
    sendBg = "#ffffff",
    sendArrow = "#0B0F1A",
    arrowMorphP = 0,
    isotipoRotation = 0,
    chromeOpacity = 1,
}) => {
    const sendD = Math.round(Math.min(54, h * 0.54));
    const arrowScale = Math.max(0, 1 - arrowMorphP);
    const arrowOpacity = Math.max(0, 1 - arrowMorphP);

    return (
        <div
            style={{
                width,
                height: h,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px 0 28px",
                gap: "20px",
                background: `rgba(18, 22, 34, ${0.85 * chromeOpacity})`,
                backdropFilter: chromeOpacity > 0.05 ? "blur(24px)" : undefined,
                border: `1px solid rgba(255, 255, 255, ${0.12 * chromeOpacity})`,
                borderRadius: "999px",
            }}
        >
            {/* Contenedor del isotipo.svg izquierdo (32x32, flexShrink: 0, blanco puro #ffffff, cero neón) */}
            <div
                style={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: chromeOpacity,
                }}
            >
                <BinIsotipo size={32} color="#ffffff" />
            </div>

            {/* Contenedor del texto: sin máscara oscura ni solapamiento con la letra "W" */}
            <div
                style={{
                    flex: 1,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    paddingLeft: "4px",
                    display: "flex",
                    alignItems: "center",
                    opacity: chromeOpacity,
                }}
            >
                <span
                    style={{
                        fontFamily: FONT,
                        fontSize,
                        fontWeight: 500,
                        letterSpacing: "-0.015em",
                        color: typed ? "#F8FAFC" : "#7C8294",
                        whiteSpace: "nowrap",
                    }}
                >
                    {typed || placeholder}
                    {caret && (
                        <span
                            style={{
                                color: "#94A3B8",
                                marginLeft: 3,
                                opacity: frame % 14 < 7 ? 1 : 0,
                            }}
                        >
                            |
                        </span>
                    )}
                </span>
            </div>

            {/* Contenedor derecho (acciones + botón enviar) */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexShrink: 0,
                }}
            >
                {showButtons && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            opacity: chromeOpacity,
                        }}
                    >
                        <div style={pillBtnStyle(h)}>
                            <Icon name="bag" size={16} color="#CBD5E1" />
                            <span>Attach</span>
                        </div>
                        <div style={pillBtnStyle(h)}>
                            <Icon name="chat" size={16} color="#CBD5E1" />
                            <span>Chat</span>
                        </div>
                        <div
                            style={{
                                ...pillBtnStyle(h),
                                width: Math.round(Math.min(44, h * 0.44)),
                                padding: 0,
                                justifyContent: "center",
                            }}
                        >
                            <svg width={18} height={18} viewBox="0 0 24 24" stroke="#CBD5E1" strokeWidth="2.2" strokeLinecap="round">
                                {[4, 8, 12, 16, 20].map((x, i) => (
                                    <line
                                        key={x}
                                        x1={x}
                                        x2={x}
                                        y1={12 - [3, 6, 9, 5, 3][i]}
                                        y2={12 + [3, 6, 9, 5, 3][i]}
                                    />
                                ))}
                            </svg>
                        </div>
                    </div>
                )}

                {/* Botón circular de enviar -> se transforma directamente en isotipo.svg al hacer clic */}
                <div
                    style={{
                        position: "relative",
                        width: sendD,
                        height: sendD,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* Fondo circular del botón enviar (se atenúa cuando nace el isotipo) */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            background: sendBg,
                            opacity: Math.max(0, 1 - arrowMorphP * 0.88) * chromeOpacity,
                            border: arrowMorphP > 0 ? "1px solid rgba(255, 255, 255, 0.14)" : "none",
                            transform: `scale(${sendScale})`,
                        }}
                    />

                    {/* Icono de flecha hacia arriba (desaparece con scale: 0, opacity: 0 en 6 frames) */}
                    {arrowOpacity > 0.01 && (
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: arrowOpacity,
                                transform: `scale(${arrowScale * sendScale})`,
                            }}
                        >
                            <svg
                                width={sendD * 0.44}
                                height={sendD * 0.44}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={sendArrow}
                                strokeWidth="2.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="19" x2="12" y2="5" />
                                <polyline points="5 12 12 5 19 12" />
                            </svg>
                        </div>
                    )}

                    {/* Isotipo.svg nacido directamente en la coordenada del botón de enviar */}
                    {arrowMorphP > 0.01 && (
                        <div
                            style={{
                                position: "absolute",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: arrowMorphP,
                                transform: `scale(${lerp(0.5, 1.15, arrowMorphP)})`,
                            }}
                        >
                            <BinIsotipo size={34} color="#ffffff" rotation={isotipoRotation} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
