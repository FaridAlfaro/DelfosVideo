// src/audio.tsx — Música reactiva, ducking dinámico, sfx y helpers de BPM
import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { isVoiceActive } from "./VoiceOver";

export const BPM = 120;
export const BEAT = 15; // 30 fps / (120 bpm / 60s) = 15 frames por pulso

/** Helper onBeat(frame): oscilación de 0 a 1 sincronizada con 120 BPM */
export const onBeat = (frame: number): number => {
    const phase = (frame % BEAT) / BEAT;
    // Curva percusiva: golpe súbito y decaimiento rápido
    return Math.pow(1 - phase, 2.5);
};

/** Factor de escala de pulso sutil (1.00 -> 1.025 en el golpe) */
export const beatScale = (frame: number, amount = 0.025): number => {
    return 1 + onBeat(frame) * amount;
};

interface SfxEvent {
    frame: number;
    file: string;
    volume?: number;
}

export const SFX_EVENTS: SfxEvent[] = [
    // Acto 1: f0 impacto + sub-boom; f78, f114, f150 golpes; f150-192 riser; f192 latido grave
    { frame: 0, file: "sfx/impact_sub_boom.mp3", volume: 1.0 },
    { frame: 78, file: "sfx/snare_hit.mp3", volume: 0.8 },
    { frame: 114, file: "sfx/snare_hit.mp3", volume: 0.8 },
    { frame: 150, file: "sfx/snare_hit.mp3", volume: 0.8 },
    { frame: 150, file: "sfx/riser_short.mp3", volume: 0.5 },
    { frame: 192, file: "sfx/heartbeat_sub.mp3", volume: 0.9 },

    // Acto 2: whoosh de datos en f246; static swell en f462
    { frame: 246, file: "sfx/data_whoosh.mp3", volume: 0.7 },
    { frame: 462, file: "sfx/static_noise.mp3", volume: 0.75 },

    // Acto 3: riser f510; drop musical f570 con sub-bass impact y shockwave
    { frame: 510, file: "sfx/riser_2s.mp3", volume: 0.85 },
    { frame: 570, file: "sfx/sub_drop_shockwave.mp3", volume: 1.0 },

    // Acto 4: ticks teclado f645; click + shimmer f750; impacto f810
    { frame: 645, file: "sfx/keyboard_typing.mp3", volume: 0.4 },
    { frame: 750, file: "sfx/click_shimmer.mp3", volume: 0.8 },
    { frame: 810, file: "sfx/impact_star.mp3", volume: 0.9 },

    // Acto 5: gauge hit f822; pop tarjetas
    { frame: 822, file: "sfx/hit_gauge_pulse.mp3", volume: 0.85 },

    // Acto 6: teclado prompt 2 en f1024; click f1074; whoosh barrido f1076; pop elástico f1122
    { frame: 1024, file: "sfx/keyboard_typing.mp3", volume: 0.35 },
    { frame: 1074, file: "sfx/click.mp3", volume: 0.75 },
    { frame: 1076, file: "sfx/wipe_whoosh.mp3", volume: 0.8 },
    { frame: 1122, file: "sfx/elastic_bounce.mp3", volume: 0.6 },

    // Acto 7: morph pops y chimes ascendentes en f1350, f1440, f1530
    { frame: 1350, file: "sfx/morph_pop.mp3", volume: 0.65 },
    { frame: 1440, file: "sfx/morph_pop.mp3", volume: 0.65 },
    { frame: 1530, file: "sfx/morph_pop.mp3", volume: 0.65 },

    // Acto 8: dock notes f1566; keywords whoosh f1620; cluster swell f1677; impacto final f1734
    { frame: 1566, file: "sfx/dock_connectors.mp3", volume: 0.7 },
    { frame: 1620, file: "sfx/keyword_flash.mp3", volume: 0.65 },
    { frame: 1677, file: "sfx/cluster_swell.mp3", volume: 0.8 },
    { frame: 1734, file: "sfx/final_impact_chord.mp3", volume: 1.0 },
];

export const Music: React.FC = () => {
    const frame = useCurrentFrame();

    // Regla de diseño sonoro:
    // f183-192: Silencio total antes de "And you're... NOT in the room"
    let musicVol = 0.85;

    if (frame >= 183 && frame <= 192) {
        musicVol = 0;
    } else if (frame < 570) {
        // Acto 1 y 2: drone tenso / ritmo
        musicVol = 0.7;
    } else {
        // Drop musical en f570 con brillo y energía
        musicVol = 0.9;
    }

    // Ducking de -8 dB (≈ factor 0.40) cuando hay locución activa
    const isSpeaking = isVoiceActive(frame);
    const duckFactor = isSpeaking ? 0.4 : 1.0;

    // Suavizado del ducking
    const targetVol = musicVol * duckFactor;

    // Fade out muy sutil en los últimos frames
    const outroFade = interpolate(frame, [1780, 1800], [1, 0.7], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const finalVolume = targetVol * outroFade;

    return (
        <Audio
            src={staticFile("music.mp3")}
            volume={finalVolume}
            onError={() => {
                // Silencioso si aún no existe music.mp3 en public/
            }}
        />
    );
};

export const Sfx: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <>
            {SFX_EVENTS.map((sfx, idx) => {
                // Monta el audio solo en su frame de disparo (con pequeña tolerancia)
                if (frame === sfx.frame) {
                    return (
                        <Audio
                            key={`${sfx.file}-${sfx.frame}-${idx}`}
                            src={staticFile(sfx.file)}
                            volume={sfx.volume ?? 0.8}
                            onError={() => {
                                // Graceful omit if file does not exist
                            }}
                        />
                    );
                }
                return null;
            })}
        </>
    );
};
