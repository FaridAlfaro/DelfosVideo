// src/DelfosCommercial.tsx — BIN Commercial Master Timeline (60 s @ 30fps = 1800 frames)
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Music, Sfx } from "./audio";
import { AuroraBackground } from "./components/AuroraBackground";
import { BrandToPrompt } from "./components/Brandtoprompt";
import { DataBeat } from "./components/Databeat";
import { FeatureMontage } from "./components/Featuremontage";
import { FinalOutro } from "./components/FinalOutro";
import { KineticOpening } from "./components/KineticOpening";
import { ProductDemo } from "./components/Productdemo";
import { SCENES } from "./timeline";
import { VoiceOver } from "./VoiceOver";

export const BinCommercial: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
        {/* Pistas de audio sincronizadas */}
        <Music />
        <Sfx />
        <VoiceOver />

        {/* Aurora líquida con grano cinematográfico (GrainyGradient palette) */}
        <AuroraBackground />

        {/* Capas visuales por acto */}
        <Sequence durationInFrames={SCENES.intro.duration} name="1 · People think/write/share">
            <KineticOpening />
        </Sequence>
        <Sequence from={SCENES.data.from} durationInFrames={SCENES.data.duration} name="2 · Millions of data points">
            <DataBeat />
        </Sequence>
        <Sequence from={SCENES.prompt.from} durationInFrames={SCENES.prompt.duration} name="3 · Until today → BIN prompt">
            <BrandToPrompt />
        </Sequence>
        <Sequence from={SCENES.demo.from} durationInFrames={SCENES.demo.duration} name="4 · Respuesta IA + comparativa">
            <ProductDemo />
        </Sequence>
        <Sequence from={SCENES.features.from} durationInFrames={SCENES.features.duration} name="5 · Maps / Dashboards / Strategy">
            <FeatureMontage />
        </Sequence>
        <Sequence from={SCENES.outro.from} durationInFrames={SCENES.outro.duration} name="6 · Connectors → BIN Lockup">
            <FinalOutro />
        </Sequence>

        {/* Subtítulos eliminados según solicitud */}
    </AbsoluteFill>
);

export const DelfosCommercial = BinCommercial;
