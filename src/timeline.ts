// src/timeline.ts — línea de tiempo maestra (60 s @ 30 fps = 1800 frames)
export const FPS = 30;

export const SCENES = {
    intro: { from: 0, duration: 240 }, //   0–8 s   Acto 1: Hook + People think / write / share + Not in the room
    data: { from: 240, duration: 270 }, //   8–17 s  Acto 2: Millones de datos + 5 beats + Lost in the noise
    prompt: { from: 510, duration: 300 }, //  17–27 s  Actos 3 y 4: Until today → logo → prompt macro → blob
    demo: { from: 810, duration: 480 }, //  27–43 s  Actos 5 y 6: Respuesta IA + 2º prompt + comparativa
    features: { from: 1290, duration: 270 }, //  43–52 s  Acto 7: Mapas / Dashboards / Estrategia
    outro: { from: 1560, duration: 240 }, //  52–60 s  Acto 8: Conectores → mosaico → lockup
} as const;

export const TOTAL_FRAMES = 1800;

/** Frame global en el que se pulsa "enviar" en el prompt macro (flare cian) */
export const SEND_FRAME = SCENES.prompt.from + 240;

/** Intensidad de la aurora inferior (0 = apagada) a lo largo del timeline */
export const AURORA_KEYS = {
    frames: [0, 510, 570, 600, 780, 840, 880, 1260, 1310, 1540, 1590, 1800],
    values: [0, 0, 0.9, 1, 1, 0.9, 0.55, 0.55, 0.7, 0.7, 1, 1],
};
