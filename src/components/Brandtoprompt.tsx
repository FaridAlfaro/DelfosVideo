// src/components/Brandtoprompt.tsx (300 frames = 17–27 s, f510–f810 global)
// Escena 3.1 (local 0–60, f510–f570): "Until today."
// Escena 3.2 (local 60–105, f570–f615): Revelación editorial limpia del logo monocromático BIN (#ffffff, 76px)
//   - Escala 0.94 -> 1.0, opacity 0 -> 1, blur(12px) -> blur(0px) en 22 frames con Easing.bezier(0.16, 1, 0.3, 1)
//   - Aurora sutil índigo/plata detrás (opacity 0.25, blur(60px)), sin destello ni onda de choque.
// Escena 3.3 (local 105–240, f615–f750): Barra de Prompt con Flexbox estricto sin solapamiento
//   - Isotipo.svg a la izquierda (#ffffff) y texto completo "What do people think about the new brand launch?" 100% visibles.
// Escena 3.4 (local 240–300, f750–f810): Transformación directa del botón enviar en isotipo.svg + revelación del Dashboard
//   - En f750 (local 240), la flecha desaparece en 6f y el botón enviar se transforma directamente en isotipo.svg.
//   - Mientras la barra se desvanece, el isotipo rota 0deg -> 180deg con un gradiente orgánico suave detrás (blur(50px))
//     que se expande entre f765 y f810 (local 255–300) revelando la ventana del Dashboard de la Escena 4.1.
import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import { BinIsotipo, BinLogoEditorialReveal } from "./BinBrand";
import { KineticText } from "./KineticText";
import { PromptBar, sendOffsetX } from "./Promptbar";
import { C, EDITORIAL, FONT, IO, OUT, SNAP, lerp, ramp } from "./Theme";
import { Cursor } from "./Ui";

const PROMPT = "What do people think about the new brand launch?";
const T_LOGO = 60;   // f570 global
const T_MORPH = 105; // f615 global
const T_TYPE0 = 135; // f645 global
const T_TYPE1 = 212; // f722 global
const T_CLICK = 240; // f750 global
const T_EXPAND = 255; // f765 global

const BAR_W = 1220;
const BAR_H = 98;
const CX = 960;
const CY = 540;

export const BrandToPrompt: React.FC = () => {
    const f = useCurrentFrame();

    // ── Escena 3.3: Barra de Prompt ──
    const morph = ramp(f, T_MORPH, T_MORPH + 26, SNAP);
    const barW = lerp(380, BAR_W, morph);
    const barEnterOpacity = ramp(f, T_MORPH, T_MORPH + 10, OUT);
    // Cuando se hace clic en local 240, el contenedor de la barra se desvanece suavemente (opacity: 1 -> 0)
    const chromeFadeOut = 1 - ramp(f, T_CLICK + 2, T_CLICK + 22, IO);

    // Tecleo completo sin desplazar ni recortar la letra "W"
    const typeP = ramp(f, T_TYPE0, T_TYPE1, Easing.out(Easing.quad));
    const nChars = Math.floor(PROMPT.length * typeP);
    const typed = PROMPT.slice(0, nChars);

    // ── Escena 3.4: Clic en el botón de enviar y transformación en isotipo.svg ──
    const press = f >= T_CLICK ? interpolate(f, [T_CLICK, T_CLICK + 3, T_CLICK + 8], [1, 1, 0], C) : 0;
    const sendScale = f >= T_CLICK
        ? interpolate(f, [T_CLICK, T_CLICK + 3, T_CLICK + 9], [0.86, 0.86, 1], { ...C, easing: OUT })
        : 1;

    // En 6 frames (240..246), la flecha desaparece y el botón se transforma en isotipo.svg
    const arrowMorphP = ramp(f, T_CLICK, T_CLICK + 6, OUT);

    // El isotipo nacido del botón de enviar rota de 0deg a 180deg y se desplaza/escala con elegancia
    const isoRotateP = ramp(f, T_CLICK, 296, IO);
    const isoRotation = lerp(0, 180, isoRotateP);
    const isoGlideToCenter = ramp(f, T_CLICK + 8, 282, IO);
    const isoFadeOutAtEnd = 1 - ramp(f, 284, 298, OUT);

    // Coordenada exacta del botón de enviar en la barra
    const sendBtnCenterX = CX + sendOffsetX(BAR_W, BAR_H);
    const sendBtnCenterY = CY;

    // El isotipo nace exactamente en (sendBtnCenterX, sendBtnCenterY) y se desliza hacia el centro mientras escala
    const activeIsoX = lerp(sendBtnCenterX, CX, isoGlideToCenter);
    const activeIsoY = sendBtnCenterY;
    const activeIsoScale = lerp(1, 1.55, ramp(f, T_CLICK + 4, 276, EDITORIAL)) * lerp(1, 0.9, ramp(f, 282, 298, OUT));

    // Gradiente orgánico suave detrás del isotipo (azul zafiro #1E3A8A, índigo #4338CA, violeta #6D28D9 con blur(50px))
    // Nace detrás del isotipo en f750 (240) y se expande entre f765 (255) y f810 (300)
    const auraBirth = ramp(f, T_CLICK, T_CLICK + 15, OUT);
    const auraExpand = ramp(f, T_EXPAND, 300, IO);
    const auraScale = lerp(0.35, 1.0, auraBirth) * lerp(1.0, 4.2, auraExpand);
    const auraOpacity = auraBirth * (1 - ramp(f, 290, 300, OUT) * 0.35);

    // Revelación progresiva de la ventana del Dashboard de la Escena 4.1 detrás del gradiente (entre f765 y f810 = local 255..300)
    const dashRevealP = ramp(f, T_EXPAND + 6, 300, EDITORIAL);

    // ── Cámara suave que mantiene el 100% de la barra de prompt visible en pantalla ──
    const camIn = ramp(f, T_MORPH, T_MORPH + 28, IO);
    const camOut = ramp(f, T_CLICK, 280, IO);
    const camScale = lerp(1, 1.08, camIn) * lerp(1, 0.93, camOut);

    // ── Cursor hacia el botón de enviar ──
    const targetScreenX = CX + (sendBtnCenterX - CX) * camScale;
    const targetScreenY = CY;
    const cp = ramp(f, 206, T_CLICK - 3, IO);
    const curX = lerp(1480, targetScreenX + 4, cp);
    const curY = lerp(880, targetScreenY + 8, cp);
    const curOpacity = ramp(f, 206, 214) * (1 - ramp(f, T_CLICK + 6, T_CLICK + 14));

    return (
        <AbsoluteFill style={{ overflow: "hidden" }}>
            {/* Escena 3.1 · Until today (f510–f570 global, local 0–60) */}
            <Sequence durationInFrames={60}>
                <KineticText
                    text="Until"
                    italicWord="today."
                    wordStagger={0}
                    italicDelay={6}
                    fontSize={116}
                    gradientItalic={["#F8FAFC", "#CBD5E1", "#93C5FD"]}
                    exitFrames={4}
                />
            </Sequence>

            {/* Preview de la ventana del Dashboard de la Escena 4.1 emergiendo detrás del gradiente entre f765 y f810 */}
            {dashRevealP > 0.01 && (
                <AbsoluteFill
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: dashRevealP,
                        transform: `perspective(1800px) rotateX(${lerp(12, 0, dashRevealP)}deg) translateY(${lerp(54, 0, dashRevealP)}px) scale(${lerp(0.9, 0.95, dashRevealP)})`,
                        filter: `blur(${lerp(14, 2, dashRevealP)}px)`,
                        pointerEvents: "none",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            left: 180,
                            top: 60,
                            width: 1560,
                            height: 830,
                            borderRadius: 26,
                            backgroundColor: "rgba(10, 13, 22, 0.88)",
                            backdropFilter: "blur(24px)",
                            border: "1px solid rgba(255, 255, 255, 0.09)",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                height: 46,
                                display: "flex",
                                alignItems: "center",
                                gap: 9,
                                padding: "0 18px",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
                            }}
                        >
                            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                                <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c, opacity: 0.75 }} />
                            ))}
                            <span style={{ fontFamily: FONT, fontSize: 15, color: "#94A3B8", marginLeft: 14 }}>
                                BIN · Real-time Sentiment Intelligence
                            </span>
                        </div>
                    </div>
                </AbsoluteFill>
            )}

            {/* Mundo de Escenas 3.2, 3.3 y 3.4 */}
            <AbsoluteFill
                style={{
                    transform: `scale(${camScale})`,
                    transformOrigin: "50% 50%",
                }}
            >
                {/* Escena 3.2 · Revelación Simple y Elegante del Logo BIN (local 60–105, f570–f615) */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <BinLogoEditorialReveal
                        frame={f}
                        startFrame={T_LOGO}
                        duration={22}
                        exitFrame={T_MORPH}
                        height={76}
                        color="#ffffff"
                        initialScale={0.94}
                        initialBlur={12}
                    />
                </div>

                {/* Escena 3.3 · Barra de Prompt sin solapamiento (local 105–262) */}
                {f >= T_MORPH && chromeFadeOut > 0.01 && (
                    <div
                        style={{
                            position: "absolute",
                            left: CX - barW / 2,
                            top: CY - BAR_H / 2,
                            opacity: barEnterOpacity,
                        }}
                    >
                        <PromptBar
                            width={barW}
                            height={BAR_H}
                            fontSize={25}
                            frame={f}
                            typed={typed}
                            caret={f < T_CLICK}
                            showButtons={morph > 0.85}
                            sendScale={sendScale}
                            sendBg="#ffffff"
                            sendArrow="#0B0F1A"
                            arrowMorphP={arrowMorphP}
                            isotipoRotation={isoRotation}
                            chromeOpacity={chromeFadeOut}
                        />
                    </div>
                )}

                {/* Escena 3.4 · Gradiente orgánico suave + Isotipo nacido del botón de enviar que rota 0->180deg */}
                {f >= T_CLICK && (
                    <div
                        style={{
                            position: "absolute",
                            left: activeIsoX,
                            top: activeIsoY,
                            width: 0,
                            height: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 30,
                        }}
                    >
                        {/* Esfera de gradiente orgánico suave detrás del isotipo (zafiro, índigo y lavanda suave, blur(50px)) */}
                        <div
                            style={{
                                position: "absolute",
                                width: 320,
                                height: 320,
                                borderRadius: "50%",
                                background:
                                    "radial-gradient(circle at 50% 50%, rgba(67, 56, 202, 0.78) 0%, rgba(30, 58, 138, 0.62) 42%, rgba(109, 40, 217, 0.38) 70%, rgba(248, 250, 252, 0.08) 88%, transparent 100%)",
                                filter: "blur(50px)",
                                opacity: auraOpacity,
                                transform: `scale(${auraScale})`,
                                pointerEvents: "none",
                            }}
                        />

                        {/* Isotipo.svg rotando 0deg -> 180deg sobre su eje */}
                        <div
                            style={{
                                position: "relative",
                                zIndex: 5,
                                opacity: arrowMorphP * isoFadeOutAtEnd,
                                transform: `scale(${activeIsoScale})`,
                            }}
                        >
                            <BinIsotipo size={36} color="#ffffff" rotation={isoRotation} />
                        </div>
                    </div>
                )}
            </AbsoluteFill>

            <Cursor x={curX} y={curY} press={press} opacity={curOpacity} size={56} />
        </AbsoluteFill>
    );
};
