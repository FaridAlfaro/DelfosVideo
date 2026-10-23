// src/components/PromptBar.tsx — barra de prompt presentacional (macro y dock)
import React from "react";
import { FONT, gradBorder } from "./Theme";
import { Icon, Isotipo } from "./Ui";

interface Props {
    width: number;
    height: number;
    fontSize: number;
    frame: number;
    typed: string;
    placeholder?: string;
    caret?: boolean;
    /** desplazamiento del texto cuando desborda (px) */
    textShift?: number;
    showButtons?: boolean;
    sendScale?: number;
    sendBg?: string;
    sendArrow?: string;
    ringP?: number;
}

/** Posición X del centro del botón enviar respecto al centro de la barra */
export const sendOffsetX = (width: number, height: number) => width / 2 - height * 0.22 - height * 0.25;

const pillBtn = (h: number): React.CSSProperties => ({
    height: h * 0.5,
    borderRadius: h * 0.25,
    border: "1.5px solid rgba(255,255,255,0.22)",
    display: "flex",
    alignItems: "center",
    gap: h * 0.08,
    padding: `0 ${h * 0.16}px`,
    color: "#e5e7eb",
    fontFamily: FONT,
    fontSize: h * 0.2,
    fontWeight: 500,
});

export const PromptBar: React.FC<Props> = ({
    width,
    height: h,
    fontSize,
    frame,
    typed,
    placeholder,
    caret = true,
    textShift = 0,
    showButtons = false,
    sendScale = 1,
    sendBg = "#ffffff",
    sendArrow = "#000000",
    ringP = 0,
}) => {
    const sendD = h * 0.5;
    return (
        <div
            style={{
                width,
                height: h,
                boxSizing: "border-box",
                borderRadius: h * 0.34,
                padding: `0 ${h * 0.22}px`,
                display: "flex",
                alignItems: "center",
                gap: h * 0.2,
                boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
                ...gradBorder(frame, "rgba(26,26,30,0.97)", "rgba(255,255,255,0.35)", "rgba(244,114,182,0.7)", 1.5, 1.5),
            }}
        >
            <Isotipo size={h * 0.42} />
            <div
                style={{
                    flex: 1,
                    height: "100%",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 40px)",
                    maskImage: "linear-gradient(90deg, transparent 0, #000 40px)",
                }}
            >
                <span style={{ fontFamily: FONT, fontSize, color: typed ? "#f8fafc" : "#7c8294", whiteSpace: "nowrap", transform: `translateX(${-textShift}px)` }}>
                    {typed || placeholder}
                    {caret && <span style={{ color: "#c4b5fd", opacity: frame % 12 < 7 ? 1 : 0 }}>|</span>}
                </span>
            </div>
            {showButtons && (
                <>
                    <div style={pillBtn(h)}>
                        <Icon name="bag" size={h * 0.2} color="#e5e7eb" />
                        Attach
                    </div>
                    <div style={pillBtn(h)}>
                        <Icon name="chat" size={h * 0.2} color="#e5e7eb" />
                        Chat
                    </div>
                    <div style={{ ...pillBtn(h), width: h * 0.5, padding: 0, justifyContent: "center", borderRadius: h * 0.25 }}>
                        <svg width={h * 0.24} height={h * 0.24} viewBox="0 0 24 24" stroke="#e5e7eb" strokeWidth="2.4" strokeLinecap="round">
                            {[3, 7, 11, 15, 19].map((x, i) => (
                                <line key={x} x1={x + 0.5} x2={x + 0.5} y1={12 - [3, 7, 10, 6, 3][i]} y2={12 + [3, 7, 10, 6, 3][i]} />
                            ))}
                        </svg>
                    </div>
                </>
            )}
            <div style={{ position: "relative", width: sendD, height: sendD, flex: "none" }}>
                {ringP > 0 && ringP < 1 && (
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid #a5b4fc", opacity: 0.85 * (1 - ringP), transform: `scale(${1 + ringP * 1.8})` }} />
                )}
                <div
                    style={{
                        width: sendD,
                        height: sendD,
                        borderRadius: "50%",
                        background: sendBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: `scale(${sendScale})`,
                        boxShadow: ringP > 0 && ringP < 1 ? "0 0 40px rgba(129,140,248,0.9)" : "none",
                    }}
                >
                    <svg width={sendD * 0.46} height={sendD * 0.46} viewBox="0 0 24 24" fill="none" stroke={sendArrow} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="19" x2="12" y2="5" />
                        <polyline points="5 12 12 5 19 12" />
                    </svg>
                </div>
            </div>
        </div>
    );
};