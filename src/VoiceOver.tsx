// src/VoiceOver.tsx — Sincronía y estructura de VoiceOver para BIN (sin reacciones de clientes)
import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

export interface VoiceLine {
    id: string;
    startFrame: number;
    maxFrames: number;
    text: string;
    textEs?: string;
    emphasis?: string[];
}

export const VOICEOVER_SCRIPT: VoiceLine[] = [
    { id: "L01", startFrame: 0, maxFrames: 75, text: "Millions of people are talking about your brand.", textEs: "Millones de personas están hablando de tu marca." },
    { id: "L02", startFrame: 78, maxFrames: 33, text: "They THINK.", textEs: "PIENSAN." },
    { id: "L03", startFrame: 114, maxFrames: 33, text: "They WRITE.", textEs: "ESCRIBEN." },
    { id: "L04", startFrame: 150, maxFrames: 33, text: "They SHARE.", textEs: "COMPARTEN." },
    { id: "L05", startFrame: 192, maxFrames: 48, text: "And you're... NOT in the room.", textEs: "Y tú... NO estás en la sala." },
    { id: "L06", startFrame: 246, maxFrames: 66, text: "MILLIONS of data points. Every. Single. SECOND.", textEs: "MILLONES de datos. Cada. Segundo." },
    { id: "L07", startFrame: 318, maxFrames: 42, text: "What they want to BUY.", textEs: "Lo que quieren COMPRAR." },
    { id: "L08", startFrame: 366, maxFrames: 42, text: "Who they LOVE.", textEs: "A quién AMAN." },
    { id: "L09", startFrame: 414, maxFrames: 42, text: "Who they FOLLOW.", textEs: "A quién SIGUEN." },
    { id: "L10", startFrame: 462, maxFrames: 48, text: "All of it... lost in the NOISE.", textEs: "Todo eso... perdido en el RUIDO." },
    { id: "L11", startFrame: 510, maxFrames: 39, text: "Until TODAY.", textEs: "Hasta HOY." },
    { id: "L12", startFrame: 576, maxFrames: 54, text: "This is BIN.", textEs: "Este es BIN." },
    { id: "L13", startFrame: 636, maxFrames: 51, text: "Just... ASK.", textEs: "Solo... PREGUNTA." },
    { id: "L14", startFrame: 747, maxFrames: 63, text: "BIN answers. In REAL TIME.", textEs: "BIN responde. En TIEMPO REAL." },
    // L15 y L16 eliminados: en ningún momento se hacen reacciones del cliente al dashboard
    { id: "L17", startFrame: 996, maxFrames: 48, text: "Then keep going. ASK anything.", textEs: "Y sigue. Pregunta LO QUE QUIERAS." },
    { id: "L18", startFrame: 1050, maxFrames: 54, text: "Want to see how you STACK UP?", textEs: "¿Quieres ver cómo te COMPARAS?" },
    { id: "L19", startFrame: 1122, maxFrames: 78, text: "Brand equity. Share of voice.", textEs: "Valor de marca. Cuota de voz." },
    { id: "L20", startFrame: 1206, maxFrames: 78, text: "Side by side. INSTANTLY.", textEs: "Lado a lado. AL INSTANTE." },
    { id: "L21", startFrame: 1296, maxFrames: 48, text: "Watch sentiment LIGHT UP.", textEs: "Mira cómo se ENCIENDE el sentimiento." },
    { id: "L22", startFrame: 1350, maxFrames: 30, text: "Interactive MAPS.", textEs: "Mapas INTERACTIVOS." },
    { id: "L23", startFrame: 1386, maxFrames: 51, text: "Every metric. ONE glance.", textEs: "Cada métrica. De UN vistazo." },
    { id: "L24", startFrame: 1440, maxFrames: 30, text: "Data DASHBOARDS.", textEs: "Paneles de DATOS." },
    { id: "L25", startFrame: 1476, maxFrames: 48, text: "Know what's NEXT.", textEs: "Sabe lo que VIENE." },
    { id: "L26", startFrame: 1530, maxFrames: 30, text: "Predictive STRATEGY.", textEs: "Estrategia PREDICTIVA." },
    { id: "L27", startFrame: 1566, maxFrames: 42, text: "Connect your ENTIRE stack.", textEs: "Conecta TODO tu stack." },
    { id: "L28", startFrame: 1608, maxFrames: 96, text: "Real-time. // Warehouse. // AI agents.", textEs: "Tiempo real. // Almacén de datos. // Agentes de IA." },
    { id: "L29", startFrame: 1704, maxFrames: 30, text: "Everything. In ONE place.", textEs: "Todo. En UN solo lugar." },
    { id: "L30", startFrame: 1734, maxFrames: 34, text: "BIN.", textEs: "BIN." },
    { id: "L31", startFrame: 1768, maxFrames: 32, text: "Decide... BETTER.", textEs: "Decide... MEJOR." },
];

/** Determina si un frame dado tiene locución activa */
export const isVoiceActive = (frame: number): boolean => {
    return VOICEOVER_SCRIPT.some(
        (v) => frame >= v.startFrame && frame < v.startFrame + v.maxFrames
    );
};

export const VoiceOver: React.FC = () => {
    return (
        <>
            {VOICEOVER_SCRIPT.map((v) => (
                <Sequence
                    key={v.id}
                    from={v.startFrame}
                    durationInFrames={v.maxFrames}
                    name={`VO · ${v.id}`}
                >
                    <Audio
                        src={staticFile(`vo/${v.id}.mp3`)}
                        onError={() => {
                            // Ignorar silenciosamente si los clips aún no se grabaron en public/vo/
                        }}
                    />
                </Sequence>
            ))}
        </>
    );
};
